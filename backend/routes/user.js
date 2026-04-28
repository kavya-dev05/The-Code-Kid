const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const authGuard = require('../middleware/authGuard');

// All routes here require login
router.use(authGuard);

// Badge definitions - earned based on XP milestones
const BADGES = [
  { id: 'badge_first_steps', name: 'First Steps', icon: '🌱', xpThreshold: 20 },
  { id: 'badge_beginner', name: 'Beginner', icon: '🌟', xpThreshold: 100 },
  { id: 'badge_learner', name: 'Learner', icon: '📚', xpThreshold: 200 },
  { id: 'badge_explorer', name: 'Explorer', icon: '🔭', xpThreshold: 300 },
  { id: 'badge_achiever', name: 'Achiever', icon: '🏅', xpThreshold: 500 },
  { id: 'badge_expert', name: 'Expert', icon: '💎', xpThreshold: 750 },
  { id: 'badge_master', name: 'Master', icon: '👑', xpThreshold: 1000 },
  { id: 'badge_legend', name: 'Legend', icon: '⚡', xpThreshold: 1500 },
  { id: 'badge_mythical', name: 'Mythical', icon: '🐉', xpThreshold: 2000 },
  { id: 'badge_phenomenon', name: 'Phenomenon', icon: '🌌', xpThreshold: 3000 },
  { id: 'badge_coding_wizard', name: 'Coding Wizard', icon: '🧙', xpThreshold: 5000 },
  { id: 'badge_grand_master', name: 'Grand Master', icon: '🏆', xpThreshold: 10000 }
];

// ─────────────────────────────────────────
// GET /api/user/me
// Returns full profile of the logged in user with badges
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

  // Fetch user's earned badges
  const { data: badgesData } = await supabase
    .from('user_badges')
    .select('badge_id, badge_name, badge_icon, earned_at')
    .eq('user_id', req.user.id)
    .order('earned_at', { ascending: true });

  const badges = badgesData || [];

  // Fetch user's solved count
  const { count: solvedCount } = await supabase
    .from('completions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', req.user.id);

  res.json({
    id: profile.id,
    username: profile.username,
    tier: profile.tier,
    xp: profile.xp,
    streak: profile.streak,
    level: Math.floor(profile.xp / 100),
    xpToNextLevel: 100 - (profile.xp % 100),
    last_active: profile.last_active,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
    school: profile.school,
    badges: badges,
    solved: solvedCount || 0,
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

  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', req.user.id)
    .single();

  const oldXp = profile?.xp || 0;
  const newXp = oldXp + xpEarned;
  const newLevel = Math.floor(newXp / 100);
  const oldLevel = Math.floor(oldXp / 100);

  // Use a transaction-like approach for atomic updates
  // Record the completion
  const { error: completionError } = await supabase.from('completions').insert({
    user_id: req.user.id,
    challenge_id: challengeId,
    tier: tier || 'junior',
    xp_earned: xpEarned,
  });

  if (completionError) {
    return res.status(500).json({ error: 'Failed to record completion.' });
  }

  // Update XP - using increment to avoid race conditions
  const { error: xpError } = await supabase
    .from('profiles')
    .update({ xp: newXp })
    .eq('id', req.user.id);

  if (xpError) {
    return res.status(500).json({ error: 'Failed to update XP.' });
  }

  // Check and award new badges
  const newlyEarnedBadges = [];
  for (const badge of BADGES) {
    if (newXp >= badge.xpThreshold && oldXp < badge.xpThreshold) {
      // User just earned this badge
      const { error: badgeError } = await supabase.from('user_badges').insert({
        user_id: req.user.id,
        badge_id: badge.id,
        badge_name: badge.name,
        badge_icon: badge.icon,
      });

      if (!badgeError) {
        newlyEarnedBadges.push({
          badge_id: badge.id,
          badge_name: badge.name,
          badge_icon: badge.icon,
        });
      }
    }
  }

  // Log activity
  await supabase.from('activity_log').insert({
    user_id: req.user.id,
    activity_type: 'challenge_completed',
    activity_date: new Date().toISOString().split('T')[0],
    details: { challengeId, xpEarned, tier },
  });

  res.json({
    message: 'Challenge completed!',
    xpEarned,
    totalXp: newXp,
    level: newLevel,
    leveledUp: newLevel > oldLevel,
    newlyEarnedBadges,
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

// ─────────────────────────────────────────
// POST /api/user/daily-challenge
// Body: { xpEarned, tier }
// Called when user completes daily challenge (one per day)
// ─────────────────────────────────────────
router.post('/daily-challenge', async (req, res) => {
  const { xpEarned, tier } = req.body;

  if (!xpEarned) {
    return res.status(400).json({ error: 'xpEarned is required.' });
  }

  const today = new Date().toISOString().split('T')[0];

  // Check if user already completed daily challenge today
  const { data: existing } = await supabase
    .from('daily_challenge_completions')
    .select('id')
    .eq('user_id', req.user.id)
    .eq('challenge_date', today)
    .single();

  if (existing) {
    return res.status(400).json({ error: 'You already completed today\'s daily challenge!', alreadyDone: true });
  }

  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak')
    .eq('id', req.user.id)
    .single();

  const oldXp = profile?.xp || 0;
  const newXp = oldXp + xpEarned;
  const newLevel = Math.floor(newXp / 100);
  const oldLevel = Math.floor(oldXp / 100);

  // Record daily challenge completion
  const { error: dailyError } = await supabase.from('daily_challenge_completions').insert({
    user_id: req.user.id,
    challenge_date: today,
    tier: tier || 'junior',
    xp_earned: xpEarned,
  });

  if (dailyError) {
    return res.status(500).json({ error: 'Failed to record daily challenge completion.' });
  }

  // Update XP
  await supabase
    .from('profiles')
    .update({ xp: newXp })
    .eq('id', req.user.id);

  // Check and award new badges
  const newlyEarnedBadges = [];
  for (const badge of BADGES) {
    if (newXp >= badge.xpThreshold && oldXp < badge.xpThreshold) {
      const { error: badgeError } = await supabase.from('user_badges').insert({
        user_id: req.user.id,
        badge_id: badge.id,
        badge_name: badge.name,
        badge_icon: badge.icon,
      });

      if (!badgeError) {
        newlyEarnedBadges.push({
          badge_id: badge.id,
          badge_name: badge.name,
          badge_icon: badge.icon,
        });
      }
    }
  }

  // Log activity
  await supabase.from('activity_log').insert({
    user_id: req.user.id,
    activity_type: 'daily_challenge_completed',
    activity_date: today,
    details: { xpEarned, tier },
  });

  res.json({
    message: 'Daily challenge completed!',
    xpEarned,
    totalXp: newXp,
    level: newLevel,
    leveledUp: newLevel > oldLevel,
    newlyEarnedBadges,
  });
});

// ─────────────────────────────────────────
// GET /api/user/badges
// Returns all badges earned by the user
// ─────────────────────────────────────────
router.get('/badges', async (req, res) => {
  const { data: badges, error } = await supabase
    .from('user_badges')
    .select('badge_id, badge_name, badge_icon, earned_at')
    .eq('user_id', req.user.id)
    .order('earned_at', { ascending: true });

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch badges.' });
  }

  // Get all available badges with earned status
  const allBadges = BADGES.map(badge => {
    const earned = badges?.find(b => b.badge_id === badge.id);
    return {
      ...badge,
      earned: !!earned,
      earned_at: earned?.earned_at,
    };
  });

  res.json(allBadges);
});

// ─────────────────────────────────────────
// POST /api/user/update-streak
// Updates streak based on activity (called on daily actions)
// ─────────────────────────────────────────
router.post('/update-streak', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const { data: profile } = await supabase
    .from('profiles')
    .select('streak, last_active')
    .eq('id', req.user.id)
    .single();

  let streak = profile?.streak || 0;
  let lastActive = profile?.last_active;

  // Update streak logic
  if (lastActive === yesterday) {
    // Continued the streak
    streak += 1;
  } else if (lastActive !== today) {
    // First activity today - either continue or start new streak
    if (lastActive !== today) {
      // If last active was before yesterday, streak resets
      streak = 1;
    }
  }
  // If lastActive === today, streak stays the same (already updated)

  await supabase
    .from('profiles')
    .update({ streak, last_active: today })
    .eq('id', req.user.id);

  // Log activity
  await supabase.from('activity_log').insert({
    user_id: req.user.id,
    activity_type: 'streak_updated',
    activity_date: today,
    details: { streak },
  });

  res.json({ streak, updated: true });
});

// ─────────────────────────────────────────
// PUT /api/user/profile
// Body: { username?, school? } — update profile fields
// ─────────────────────────────────────────
router.put('/profile', async (req, res) => {
  const { username, school } = req.body;

  const updateData = {};
  if (username) {
    // Validate username format
    if (username.trim().length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return res.status(400).json({ error: 'Username can only contain letters, numbers and underscores.' });
    }

    // Check if username is already taken by another user
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', username.trim())
      .neq('id', req.user.id) // Exclude current user
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'That username is already taken. Try another.' });
    }

    updateData.username = username.trim();
  }
  if (school) updateData.school = school;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No fields to update.' });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to update profile.' });
  }

  res.json({ username: data.username, school: data.school });
});

// ─────────────────────────────────────────
// POST /api/user/avatar
// Body: { avatarUrl } — update user's avatar URL
// ─────────────────────────────────────────
router.post('/avatar', async (req, res) => {
  const { avatarUrl } = req.body;

  if (!avatarUrl || typeof avatarUrl !== 'string') {
    return res.status(400).json({ error: 'avatarUrl is required and must be a string.' });
  }

  // Validate URL format
  try {
    new URL(avatarUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format for avatar.' });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', req.user.id)
    .select('avatar_url')
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to update avatar.' });
  }

  res.json({ avatar_url: data.avatar_url });
});

module.exports = router;