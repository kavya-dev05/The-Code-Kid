const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// ─────────────────────────────────────────
// GET /api/auth/check-username?username=X
// Returns 200 if available, 409 if taken
// ─────────────────────────────────────────
router.get('/check-username', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username is required.' });

  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.trim())
    .single();

  if (data) {
    return res.status(409).json({ available: false, error: 'That username is already taken.' });
  }
  res.json({ available: true });
});

// ─────────────────────────────────────────
// POST /api/auth/forgot-password
// Body: { email }
// Sends a password reset email via Supabase Auth
// ─────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const { error } = await supabase.auth.resetPasswordEmail(email, {
    redirectTo: `${req.protocol}://${req.get('host')}/reset-password`,
  });

  if (error) {
    return res.status(400).json({ error: 'No account found with that email address.' });
  }

  res.json({ message: 'Password reset email sent! Check your inbox.' });
});

// ─────────────────────────────────────────
// POST /api/auth/signup
// Body: { email, password, username, school, tier }
// ─────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { email, password, username, school, tier } = req.body;

  // Basic validation
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password and username are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  if (username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    return res.status(400).json({ error: 'Username can only contain letters, numbers and underscores.' });
  }

  // Check if username is already taken
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.trim())
    .single();

  if (existingUser) {
    return res.status(409).json({ error: 'That username is already taken. Try another.' });
  }

  // Create the user in Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip email verification for now
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    return res.status(400).json({ error: error.message });
  }

  // Save the user's profile info in our profiles table
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    username: username.trim(),
    tier: tier || 'junior',
    xp: 0,
    streak: 0,
    last_active: new Date().toISOString().split('T')[0],
    school: school ? school.trim() : null,
  });

  if (profileError) {
    // Rollback: delete auth user if profile creation failed
    await supabase.auth.admin.deleteUser(data.user.id);
    return res.status(500).json({ error: 'Failed to create profile. Please try again.' });
  }

  // Log the user in right away so they get a token
  const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    return res.status(500).json({ error: 'Account created but login failed. Try signing in.' });
  }

  res.status(201).json({
    message: 'Account created successfully!',
    token: session.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      username: username.trim(),
      tier: tier || 'junior',
      xp: 0,
      streak: 0,
      school: school ? school.trim() : null,
    },
  });
});

// ─────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
// email can be either an email address OR a username
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email: loginInput, password } = req.body;

  if (!loginInput || !password) {
    return res.status(400).json({ error: 'Username/email and password are required.' });
  }

  let resolvedEmail = loginInput;

  // If it doesn't look like an email, treat it as a username and look up the account
  if (!loginInput.includes('@')) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('username', loginInput)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    resolvedEmail = profile.email;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password });

  if (error) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  // Update last_active date and check/reset streak
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let streak = profile?.streak || 0;
  if (profile?.last_active === yesterday) {
    streak += 1; // continued streak
  } else if (profile?.last_active !== today) {
    streak = 1; // streak broken, reset to 1
  }

  await supabase
    .from('profiles')
    .update({ last_active: today, streak })
    .eq('id', data.user.id);

  res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      username: profile?.username || 'Coder',
      tier: profile?.tier || 'junior',
      xp: profile?.xp || 0,
      streak,
      level: Math.floor((profile?.xp || 0) / 100) + 1,
    },
  });
});

// ─────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    await supabase.auth.admin.signOut(token);
  }
  res.json({ message: 'Logged out successfully.' });
});

module.exports = router;