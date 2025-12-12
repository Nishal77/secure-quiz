# Question Insertion Scripts

This directory contains scripts to insert quiz questions into your Supabase database.

## Overview

- **4 Question Sets**: Questions are randomly assigned to sets 1-4 for better distribution
- **Set 1**: Contains 15 questions (this is the first set)
- **Future Sets**: You can add more questions later using the same scripts

## Prerequisites

1. Run the migration first to add the `question_set` column:
   ```sql
   -- In Supabase SQL Editor, run:
   \i schemas/migrations/add_question_set.sql
   ```

2. Have your event created in the database (you'll need the event UUID)

## Method 1: Using SQL Script (Recommended for Quick Setup)

1. Open `scripts/insert-questions-set1.sql` in a text editor
2. Replace `'YOUR_EVENT_ID_HERE'` with your actual event UUID
3. Copy and paste the entire script into Supabase SQL Editor
4. Run the script

**Pros:**
- No dependencies needed
- Works directly in Supabase dashboard
- Questions are randomly assigned to sets 1-4 automatically

## Method 2: Using Node.js Script

1. Install dependencies:
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

2. Create a `.env` file in the project root:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   EVENT_ID=your_event_uuid
   ```

3. Run the script:
   ```bash
   node scripts/insert-questions.js
   ```

**Pros:**
- Can be automated
- Shows detailed output and distribution summary
- Easy to modify for future question sets

## Method 3: Using TypeScript/Deno Script

1. Set environment variables:
   ```bash
   export SUPABASE_URL=your_supabase_url
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   export EVENT_ID=your_event_uuid
   ```

2. Run with Deno:
   ```bash
   deno run --allow-net --allow-env scripts/insert-questions.ts
   ```

   Or with tsx:
   ```bash
   npx tsx scripts/insert-questions.ts
   ```

## Finding Your Event ID

You can find your event ID by:

1. **Via Supabase Dashboard:**
   - Go to Table Editor → `events` table
   - Copy the `id` (UUID) of your event

2. **Via SQL:**
   ```sql
   SELECT id, name FROM events;
   ```

3. **Via Admin Panel:**
   - Go to `/admin/events` in your app
   - The event ID should be visible in the URL or table

## Adding More Question Sets

When you're ready to add Set 2, Set 3, or Set 4:

1. **For SQL method:** Copy `insert-questions-set1.sql`, update the questions, and run
2. **For Node.js/TypeScript:** Update the `questions` array in the script and run again

The scripts will automatically assign questions to random sets (1-4), ensuring good distribution.

## Verification

After inserting questions, verify in Supabase:

```sql
-- Check question distribution by set
SELECT question_set, COUNT(*) as count 
FROM questions 
WHERE event_id = 'your-event-id'
GROUP BY question_set 
ORDER BY question_set;

-- View all questions
SELECT id, question_text, question_set, correct_answer 
FROM questions 
WHERE event_id = 'your-event-id'
ORDER BY question_set, id;
```

## Notes

- Questions are randomly assigned to sets 1-4 to ensure fair distribution
- Each question has default marks (1) and negative marks (0.25)
- Difficulty is set to 'medium' by default (some are marked as 'easy')
- You can modify these values in the script before running

