-- Answers table
-- Stores student answers (autosaved)
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer CHAR(1) CHECK (selected_answer IN ('A', 'B', 'C', 'D', NULL)),
  is_correct BOOLEAN,
  marks_obtained DECIMAL(5,2) DEFAULT 0,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id) -- One answer per question per session
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_answers_session_id ON answers(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);

-- Enable RLS
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view/modify their own answers, admins can view all
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


