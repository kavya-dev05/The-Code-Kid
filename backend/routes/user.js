const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const authGuard = require('../middleware/authGuard');

// All routes here require login
router.use(authGuard);

// ─────────────────────────────────────────
// GET /api/user/me
// Returns full profile of the logged in user
// ─────────────────────────────────────────
router.get('/me', async (req, res) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error || !profile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }

  res.json({
    id: profile.id,
    username: profile.username,
    tier: profile.tier,
    xp: profile.xp,
    streak: profile.streak,
    level: Math.floor(profile.xp / 100) + 1,
    xpToNextLevel: 100 - (profile.xp % 100),
    last_active: profile.last_active,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
  });
});

// ─────────────────────────────────────────
// POST /api/user/complete-challenge
// Body: { challengeId, xpEarned, tier }
// Called when user solves a challenge/quiz
// ─────────────────────────────────────────
router.post('/complete-challenge', async (req, res) => {
  const { challengeId, xpEarned, tier } = req.body;

  if (!challengeId || !xpEarned) {
    return res.status(400).json({ error: 'challengeId and xpEarned are required.' });
  }

  // Check if user already completed this challenge
  const { data: existing } = await supabase
    .from('completions')
    .select('id')
    .eq('user_id', req.user.id)
    .eq('challenge_id', challengeId)
    .single();

  if (existing) {
    return res.status(400).json({ error: 'You already completed this challenge!', alreadyDone: true });
  }

  // Record the completion
  await supabase.from('completions').insert({
    user_id: req.user.id,
    challenge_id: challengeId,
    tier: tier || 'junior',
    xp_earned: xpEarned,
  });

  // Add XP to user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', req.user.id)
    .single();

  const newXp = (profile?.xp || 0) + xpEarned;
  const newLevel = Math.floor(newXp / 100) + 1;
  const oldLevel = Math.floor((profile?.xp || 0) / 100) + 1;

  await supabase
    .from('profiles')
    .update({ xp: newXp })
    .eq('id', req.user.id);

  res.json({
    message: 'Challenge completed!',
    xpEarned,
    totalXp: newXp,
    level: newLevel,
    leveledUp: newLevel > oldLevel,
  });
});

// ─────────────────────────────────────────
// GET /api/user/completions
// Returns list of challenges this user finished
// ─────────────────────────────────────────
router.get('/completions', async (req, res) => {
  const { data, error } = await supabase
    .from('completions')
    .select('challenge_id, tier, xp_earned, completed_at')
    .eq('user_id', req.user.id)
    .order('completed_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Failed to fetch completions.' });

  res.json(data);
});

// ─────────────────────────────────────────
// PUT /api/user/tier
// Body: { tier } — update user's active tier
// ─────────────────────────────────────────
router.put('/tier', async (req, res) => {
  const { tier } = req.body;

  if (!['junior', 'explorer', 'pro'].includes(tier)) {
    return res.status(400).json({ error: 'Invalid tier. Must be junior, explorer, or pro.' });
  }

  await supabase
    .from('profiles')
    .update({ tier })
    .eq('id', req.user.id);

  res.json({ message: `Switched to ${tier} tier.`, tier });
});

module.exports = router;