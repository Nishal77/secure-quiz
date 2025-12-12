-- Migration: Add question_set column to questions table
-- This allows organizing questions into sets (1-4) for random distribution

-- Add question_set column
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS question_set INTEGER CHECK (question_set IN (1, 2, 3, 4));

-- Create index for faster set-based queries
CREATE INDEX IF NOT EXISTS idx_questions_question_set ON questions(question_set);

-- Add comment for documentation
COMMENT ON COLUMN questions.question_set IS 'Question set number (1-4) for random distribution across quiz sessions';

