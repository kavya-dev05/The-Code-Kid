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

-- ─── Indexes for speed ────────────────────────────────────
-- Makes leaderboard queries fast
CREATE INDEX IF NOT EXISTS idx_profiles_tier_xp ON profiles(tier, xp DESC);
-- Makes completion lookups fast
CREATE INDEX IF NOT EXISTS idx_completions_user ON completions(user_id);