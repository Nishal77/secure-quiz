-- Tab switches table
-- Logs all tab switch events for anti-cheat monitoring
CREATE TABLE IF NOT EXISTS tab_switches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  switch_type VARCHAR(20) NOT NULL CHECK (switch_type IN ('blur', 'focus', 'visibilitychange')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tab_switches_session_id ON tab_switches(session_id);
CREATE INDEX IF NOT EXISTS idx_tab_switches_timestamp ON tab_switches(timestamp);

-- Enable RLS
ALTER TABLE tab_switches ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view tab switch logs
CREATE POLICY "Admins can view tab switches"
  ON tab_switches
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');


