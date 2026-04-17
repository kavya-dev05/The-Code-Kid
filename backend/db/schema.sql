-- ═══════════════════════════════════════════════════════════
-- TheCodeKid — Database Schema
-- Run this entire file in: Supabase → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- 1. PROFILES TABLE
-- Stores each user's public info, XP, streak, and tier
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  school      TEXT,
  tier        TEXT NOT NULL DEFAULT 'junior'
                CHECK (tier IN ('junior', 'explorer', 'pro')),
  xp          INTEGER NOT NULL DEFAULT 0,
  streak      INTEGER NOT NULL DEFAULT 0,
  last_active DATE,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. COMPLETIONS TABLE
-- Records every challenge a user has completed
CREATE TABLE IF NOT EXISTS completions (
  id           SERIAL PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  tier         TEXT NOT NULL,
  xp_earned    INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- A user can only complete a specific challenge once
  UNIQUE(user_id, challenge_id)
);

-- 3. BADGES TABLE
-- Stores badges earned by users
CREATE TABLE IF NOT EXISTS user_badges (
  id         SERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id   TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- A user can only earn a specific badge once
  UNIQUE(user_id, badge_id)
);

-- 4. DAILY CHALLENGES TABLE
-- Tracks daily challenge completions (resets daily)
CREATE TABLE IF NOT EXISTS daily_challenge_completions (
  id           SERIAL PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL,
  tier         TEXT NOT NULL,
  xp_earned    INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- A user can only complete one daily challenge per day
  UNIQUE(user_id, challenge_date)
);

-- 5. ACTIVITY LOG TABLE
-- Logs user activities for streak tracking and history
CREATE TABLE IF NOT EXISTS activity_log (
  id           SERIAL PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_date DATE NOT NULL,
  details      JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Row Level Security (RLS) ─────────────────────────────
-- This makes sure users can only read/write their OWN data

-- Enable RLS on both tables
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

-- PROFILES: Anyone can read profiles (needed for leaderboard)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

-- PROFILES: Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- PROFILES: Service role (our backend) can insert
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT WITH CHECK (true);

-- COMPLETIONS: Users can only see their own completions
CREATE POLICY "Users can view their own completions"
  ON completions FOR SELECT USING (auth.uid() = user_id);

-- COMPLETIONS: Service role (our backend) can insert
CREATE POLICY "Service role can insert completions"
  ON completions FOR INSERT WITH CHECK (true);

-- USER_BADGES: Users can view their own badges
CREATE POLICY "Users can view their own badges"
  ON user_badges FOR SELECT USING (auth.uid() = user_id);

-- USER_BADGES: Service role can insert badges
CREATE POLICY "Service role can insert badges"
  ON user_badges FOR INSERT WITH CHECK (true);

-- DAILY_CHALLENGES: Users can view their own completions
CREATE POLICY "Users can view their own daily completions"
  ON daily_challenge_completions FOR SELECT USING (auth.uid() = user_id);

-- DAILY_CHALLENGES: Service role can insert daily completions
CREATE POLICY "Service role can insert daily completions"
  ON daily_challenge_completions FOR INSERT WITH CHECK (true);

-- ACTIVITY_LOG: Users can view their own activity
CREATE POLICY "Users can view their own activity"
  ON activity_log FOR SELECT USING (auth.uid() = user_id);

-- ACTIVITY_LOG: Service role can insert activity
CREATE POLICY "Service role can insert activity"
  ON activity_log FOR INSERT WITH CHECK (true);

-- ─── Indexes for speed ────────────────────────────────────
-- Makes leaderboard queries fast
CREATE INDEX IF NOT EXISTS idx_profiles_tier_xp ON profiles(tier, xp DESC);
-- Makes completion lookups fast
CREATE INDEX IF NOT EXISTS idx_completions_user ON completions(user_id);
-- Makes badge lookups fast
CREATE INDEX IF NOT EXISTS idx_badges_user ON user_badges(user_id);
-- Makes daily challenge lookups fast
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user ON daily_challenge_completions(user_id, challenge_date DESC);
-- Makes activity lookups fast
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id, activity_date DESC);