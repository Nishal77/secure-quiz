-- Sessions table
-- Stores individual quiz sessions for each student
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  usn VARCHAR(50) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  question_order UUID[] NOT NULL, -- Array of question IDs in randomized order
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE,
  is_submitted BOOLEAN DEFAULT false,
  tab_switch_count INTEGER DEFAULT 0,
  server_start_time TIMESTAMP WITH TIME ZONE NOT NULL, -- Server-verified start time
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, usn) -- One session per USN per event
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_sessions_event_id ON sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_sessions_usn ON sessions(usn);
CREATE INDEX IF NOT EXISTS idx_sessions_submitted ON sessions(is_submitted);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view their own session, admins can view all
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

