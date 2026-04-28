-- The Code Kid Database Migration
-- Run this in your Supabase SQL Editor to set up the schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════════════════

-- Profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL DEFAULT 'junior' CHECK (tier IN ('junior', 'explorer', 'pro')),
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  last_active DATE NOT NULL DEFAULT CURRENT_DATE,
  avatar_url TEXT,
  school TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for username lookups (uniqueness validation)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Index for tier filtering (leaderboard)
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);

-- Index for XP ranking (leaderboard ordering)
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles(xp DESC);

-- Index for streak queries
CREATE INDEX IF NOT EXISTS idx_profiles_streak ON profiles(streak DESC);

-- Index for activity_type queries (Issue #9)
CREATE INDEX IF NOT EXISTS idx_activity_log_activity_type ON activity_log(activity_type);

-- Index for activity_date queries
CREATE INDEX IF NOT EXISTS idx_activity_log_date ON activity_log(activity_date);

-- Combined index for user activity queries
CREATE INDEX IF NOT EXISTS idx_activity_log_user_date ON activity_log(user_id, activity_date DESC);

-- Completions table (tracks challenges completed)
CREATE TABLE IF NOT EXISTS completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'junior',
  xp_earned INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_completions_user ON completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_challenge ON completions(challenge_id);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_id);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_date DATE NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Daily challenge completions table
CREATE TABLE IF NOT EXISTS daily_challenge_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL,
  tier TEXT NOT NULL DEFAULT 'junior',
  xp_earned INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, challenge_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_completions_user ON daily_challenge_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_completions_date ON daily_challenge_completions(challenge_date);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenge_completions ENABLE ROW LEVEL SECURITY;

-- ─── Profiles Policies ─────────────────────────────────────────

-- Anyone can read profiles (needed for leaderboard)
-- Rate limiting should be implemented at the API level
CREATE POLICY "Public profiles are viewable by anyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (triggered on signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ─── Completions Policies ──────────────────────────────────────

-- Users can view their own completions
CREATE POLICY "Users can view own completions"
  ON completions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own completions
CREATE POLICY "Users can insert own completions"
  ON completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── User Badges Policies ──────────────────────────────────────

-- Users can view their own badges
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert badges (triggered on XP milestones)
-- Using a function to allow service role to insert
CREATE POLICY "System can insert badges"
  ON user_badges FOR INSERT
  WITH CHECK (true);

-- ─── Activity Log Policies ─────────────────────────────────────

-- Users can view their own activity
CREATE POLICY "Users can view own activity"
  ON activity_log FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert activity logs
CREATE POLICY "System can insert activity logs"
  ON activity_log FOR INSERT
  WITH CHECK (true);

-- ─── Daily Challenge Completions Policies ──────────────────────

-- Users can view their own daily completions
CREATE POLICY "Users can view own daily completions"
  ON daily_challenge_completions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own daily completions
CREATE POLICY "Users can insert own daily completions"
  ON daily_challenge_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, tier, xp, streak, last_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Coder_' || substr(NEW.id::text, 1, 6)),
    COALESCE(NEW.raw_user_meta_data->>'tier', 'junior'),
    0,
    0,
    CURRENT_DATE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_on_signup();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════
-- RATE LIMITING NOTE
-- ═══════════════════════════════════════════════════════════════
-- RLS allows public read access to profiles for leaderboard functionality.
-- Rate limiting MUST be implemented at the API level (express-rate-limit)
-- to prevent abuse. See backend/server.js for rate limiting configuration.
