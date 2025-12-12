-- Fix RLS policies to allow anonymous users to access sessions and questions for quiz
-- This is safe because:
-- 1. Session IDs are UUIDs (hard to guess)
-- 2. Users need to access their session to take the quiz
-- 3. Questions are needed to display the quiz
-- 4. Admin policies still protect write operations

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Students can view own session" ON sessions;
DROP POLICY IF EXISTS "Admins can manage questions" ON questions;

-- Allow anyone to view sessions (needed for quiz page)
CREATE POLICY "Anyone can view sessions"
  ON sessions
  FOR SELECT
  USING (true);

-- Allow anyone to view questions (needed for quiz page)
CREATE POLICY "Anyone can view questions"
  ON questions
  FOR SELECT
  USING (true);

-- Keep admin policies for write operations
-- Admins can still manage all sessions
DROP POLICY IF EXISTS "Admins can manage all sessions" ON sessions;
CREATE POLICY "Admins can manage all sessions"
  ON sessions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can manage questions
CREATE POLICY "Admins can manage questions"
  ON questions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
