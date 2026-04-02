const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// ─────────────────────────────────────────
// GET /api/leaderboard/:tier
// Returns top 20 players for a given tier
// ─────────────────────────────────────────
router.get('/:tier', async (req, res) => {
  const { tier } = req.params;

  if (!['junior', 'explorer', 'pro'].includes(tier)) {
    return res.status(400).json({ error: 'Invalid tier.' });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('username, xp, streak, avatar_url')
    .eq('tier', tier)
    .order('xp', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: 'Failed to fetch leaderboard.' });

  // Add rank numbers and compute level
  const ranked = data.map((user, index) => ({
    rank: index + 1,
    username: user.username,
    xp: user.xp,
    streak: user.streak,
    avatar_url: user.avatar_url,
    level: Math.floor(user.xp / 100) + 1,
    initials: user.username.slice(0, 2).toUpperCase(),
  }));

  res.json(ranked);
});

// ─────────────────────────────────────────
// GET /api/leaderboard/:tier/my-rank
// Returns the current user's rank (requires login)
// ─────────────────────────────────────────
router.get('/:tier/my-rank', async (req, res) => {
  const { tier } = req.params;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.json({ rank: null });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return res.json({ rank: null });

  // Count how many users have more XP than this user in the same tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single();

  if (!profile) return res.json({ rank: null });

  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('tier', tier)
    .gt('xp', profile.xp);

  res.json({ rank: (count || 0) + 1, xp: profile.xp });
});

module.exports = router;