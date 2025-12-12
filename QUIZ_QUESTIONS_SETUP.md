# Quiz Questions Setup Guide

## Quick Start

### Step 1: Run Database Migration

First, add the `question_set` column to your questions table:

1. Go to Supabase Dashboard → SQL Editor
2. Run the migration:
   ```sql
   -- Copy and paste the contents of:
   schemas/migrations/add_question_set.sql
   ```

Or run directly:
```sql
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS question_set INTEGER CHECK (question_set IN (1, 2, 3, 4));

CREATE INDEX IF NOT EXISTS idx_questions_question_set ON questions(question_set);
```

### Step 2: Insert Questions (Set 1)

You have 3 options:

#### Option A: SQL Script (Easiest)
1. Open `scripts/insert-questions-set1.sql`
2. Replace `'YOUR_EVENT_ID_HERE'` with your event UUID
3. Copy entire script to Supabase SQL Editor
4. Run it

#### Option B: Node.js Script
```bash
# Create .env file with:
# SUPABASE_URL=your_url
# SUPABASE_SERVICE_ROLE_KEY=your_key
# EVENT_ID=your_event_uuid

node scripts/insert-questions.js
```

#### Option C: TypeScript/Deno
```bash
export SUPABASE_URL=your_url
export SUPABASE_SERVICE_ROLE_KEY=your_key
export EVENT_ID=your_event_uuid

deno run --allow-net --allow-env scripts/insert-questions.ts
```

### Step 3: Verify

Check in Supabase SQL Editor:
```sql
SELECT question_set, COUNT(*) 
FROM questions 
WHERE event_id = 'your-event-id'
GROUP BY question_set;
```

## How It Works

- **4 Question Sets**: Questions are randomly distributed across sets 1-4
- **Random Assignment**: Each question gets assigned to a random set (1-4) when inserted
- **Fair Distribution**: This ensures students get varied question sets
- **Future Sets**: When you add Set 2, 3, or 4, use the same scripts with new questions

## Current Questions (Set 1)

15 questions covering:
- Compiler vs Interpreter
- OOP (Inheritance, Interfaces, Abstract Classes)
- REST API
- Database (Primary Keys, Normalization, SQL Injection)
- HTTP Methods (GET vs POST)
- Design Patterns
- Network Layers (Transport Layer)
- Version Control (Git)
- Exception Handling
- Synchronous Execution
- Middleware
- Time Complexity

## Adding More Sets

When ready to add Set 2, 3, or 4:

1. Update the questions array in `scripts/insert-questions.js` or `scripts/insert-questions.ts`
2. Or create new SQL files like `insert-questions-set2.sql`
3. Run the script - questions will be randomly assigned to sets 1-4

## Notes

- Questions are automatically assigned to random sets (1-4)
- Default marks: 1 point per question
- Default negative marks: 0.25 per wrong answer
- Difficulty: Mostly 'medium', some 'easy'

