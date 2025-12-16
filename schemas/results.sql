-- Results table
-- Stores final quiz results after submission
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

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_results_session_id ON results(session_id);

-- Enable RLS
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view their own results, admins can view all
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


