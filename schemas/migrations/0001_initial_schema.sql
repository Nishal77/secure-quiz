-- Migration: 0001_initial_schema
-- Description: Creates all base tables for the quiz application
-- Created: 2025-01-XX

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active) WHERE is_active = true;

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active events"
  ON events
  FOR SELECT
  USING (is_active = true OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage events"
  ON events
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  marks INTEGER NOT NULL DEFAULT 1,
  negative_marks DECIMAL(5,2) DEFAULT 0.15,
  difficulty VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_event_id ON questions(event_id);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage questions"
  ON questions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  usn VARCHAR(50) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  question_order UUID[] NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE,
  is_submitted BOOLEAN DEFAULT false,
  tab_switch_count INTEGER DEFAULT 0,
  server_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, usn)
);

CREATE INDEX IF NOT EXISTS idx_sessions_event_id ON sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_sessions_usn ON sessions(usn);
CREATE INDEX IF NOT EXISTS idx_sessions_submitted ON sessions(is_submitted);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own session"
  ON sessions
  FOR SELECT
  USING (
    auth.jwt() ->> 'usn' = usn OR 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can manage all sessions"
  ON sessions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer CHAR(1) CHECK (selected_answer IN ('A', 'B', 'C', 'D', NULL)),
  is_correct BOOLEAN,
  marks_obtained DECIMAL(5,2) DEFAULT 0,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_answers_session_id ON answers(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own answers"
  ON answers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = answers.session_id 
      AND (sessions.usn = auth.jwt() ->> 'usn' OR auth.jwt() ->> 'role' = 'admin')
    )
  );

-- Results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL,
  answered_count INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  incorrect_count INTEGER NOT NULL,
  total_marks DECIMAL(10,2) NOT NULL,
  negative_marks DECIMAL(10,2) DEFAULT 0,
  final_score DECIMAL(10,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_results_session_id ON results(session_id);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own results"
  ON results
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = results.session_id 
      AND (sessions.usn = auth.jwt() ->> 'usn' OR auth.jwt() ->> 'role' = 'admin')
    )
  );

CREATE POLICY "Admins can manage all results"
  ON results
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Tab switches table
CREATE TABLE IF NOT EXISTS tab_switches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  switch_type VARCHAR(20) NOT NULL CHECK (switch_type IN ('blur', 'focus', 'visibilitychange')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tab_switches_session_id ON tab_switches(session_id);
CREATE INDEX IF NOT EXISTS idx_tab_switches_timestamp ON tab_switches(timestamp);

ALTER TABLE tab_switches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view tab switches"
  ON tab_switches
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_answers_updated_at ON answers;
CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

