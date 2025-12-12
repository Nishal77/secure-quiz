# Quick Setup Guide

## 1. Database Setup

1. Go to your Supabase project SQL Editor
2. Run each schema file in this order:
   - `schemas/events.sql`
   - `schemas/questions.sql`
   - `schemas/sessions.sql`
   - `schemas/answers.sql`
   - `schemas/results.sql`
   - `schemas/tab_switches.sql`

## 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run development server:
```bash
npm run dev
```

## 3. Backend Setup (Edge Functions)

Install Supabase CLI:
```bash
npm install -g supabase
```

Login to Supabase:
```bash
supabase login
```

Link your project:
```bash
supabase link --project-ref your-project-ref
```

Deploy functions:
```bash
cd backend
supabase functions deploy start-session
supabase functions deploy submit
supabase functions deploy save-answer
supabase functions deploy tab-switch
supabase functions deploy admin-export
supabase functions deploy server-time
```

Set environment variables in Supabase Dashboard:
- Go to Settings → Edge Functions
- Add:
  - `SUPABASE_URL` = your project URL
  - `SUPABASE_SERVICE_ROLE_KEY` = your service role key

## 4. First Use

1. Start the frontend: `cd frontend && npm run dev`
2. Go to `http://localhost:3000/admin/events`
3. Create a new event
4. Upload a CSV file with questions (see README for format)
5. Activate the event
6. Students can now login at `http://localhost:3000`

## CSV Question Format

```csv
question,option_a,option_b,option_c,option_d,correct_answer,marks,negative_marks
What is 2+2?,3,4,5,6,B,1,0.25
What is the capital of France?,London,Paris,Berlin,Madrid,B,1,0.25
```

## Troubleshooting

- **RLS Errors**: Make sure you've run all SQL schema files
- **Function Errors**: Check that environment variables are set in Supabase Dashboard
- **Import Errors**: Make sure you're using the correct import paths (`@/lib/...`)

