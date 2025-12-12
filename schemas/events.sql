-- Events table
-- Stores quiz events (exams)
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

-- Index for active events
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active events, only admins can manage
CREATE POLICY "Anyone can view active events"
  ON events
  FOR SELECT
  USING (is_active = true OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage events"
  ON events
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

