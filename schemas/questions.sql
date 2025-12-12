-- Questions table
-- Stores all quiz questions with metadata
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
  negative_marks DECIMAL(5,2) DEFAULT 0.25,
  difficulty VARCHAR(20) DEFAULT 'medium',
  question_set INTEGER CHECK (question_set IN (1, 2, 3, 4)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_questions_event_id ON questions(event_id);
CREATE INDEX IF NOT EXISTS idx_questions_question_set ON questions(question_set);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view/modify questions
CREATE POLICY "Admins can manage questions"
  ON questions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

