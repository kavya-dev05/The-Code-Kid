const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// ─────────────────────────────────────────
// POST /api/auth/signup
// Body: { email, password, username, tier }
// ─────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { email, password, username, tier } = req.body;

  // Basic validation
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password and username are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  // Check if username is already taken
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  if (existingUser) {
    return res.status(400).json({ error: 'That username is already taken. Try another.' });
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
      username,
      tier: tier || 'junior',
      xp: 0,
      streak: 0,
    },
  });
});

// ─────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

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