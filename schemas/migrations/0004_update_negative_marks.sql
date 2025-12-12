-- Migration: Update negative marks from 0.25 to 0.15
-- This migration updates the default negative marking value and all existing questions

-- Step 1: Update the default value for negative_marks column in questions table
ALTER TABLE questions 
  ALTER COLUMN negative_marks SET DEFAULT 0.15;

-- Step 2: Update all existing questions that have negative_marks = 0.25 to 0.15
UPDATE questions 
SET negative_marks = 0.15 
WHERE negative_marks = 0.25;

-- Step 3: Verify the update (optional - for manual verification)
-- SELECT COUNT(*) as updated_count FROM questions WHERE negative_marks = 0.15;
-- SELECT COUNT(*) as old_count FROM questions WHERE negative_marks = 0.25;
