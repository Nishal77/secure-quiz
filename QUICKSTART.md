# Quick Start Guide - Using pnpm

## Prerequisites

1. **Install pnpm** (if not already installed):
   ```bash
   npm install -g pnpm
   # or
   brew install pnpm
   ```

2. **Supabase Setup**:
   - Make sure you've run all SQL schemas in Supabase SQL Editor
   - Set Edge Function secrets in Supabase Dashboard → Settings → Edge Functions

## Installation

### 1. Install Dependencies

From the project root:
```bash
pnpm install
```

This will install dependencies for both frontend and backend.

Or install separately:
```bash
# Frontend
cd frontend
pnpm install

# Backend (optional, mainly for TypeScript types)
cd ../backend
pnpm install
```

## Running the Application

### Frontend (Next.js)

From the project root:
```bash
pnpm dev
# or
cd frontend && pnpm dev
```

The app will start at: **http://localhost:3000**

### Backend (Supabase Edge Functions)

Edge Functions are deployed to Supabase, not run locally. To deploy:

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref tcfgopbbhshgcvvnwjki
   ```

4. **Deploy all functions**:
   ```bash
   cd backend
   supabase functions deploy start-session
   supabase functions deploy submit
   supabase functions deploy save-answer
   supabase functions deploy tab-switch
   supabase functions deploy admin-export
   supabase functions deploy server-time
   ```

   Or deploy all at once:
   ```bash
   supabase functions deploy
   ```

## First Time Setup

1. **Start the frontend**:
   ```bash
   pnpm dev
   ```

2. **Access Admin Dashboard**:
   - Go to: http://localhost:3000/admin/events
   - Create a new event
   - Upload questions CSV (see format below)
   - Activate the event

3. **Students can now login**:
   - Go to: http://localhost:3000
   - Enter USN and Name
   - Start the quiz

## Question CSV Format

```csv
question,option_a,option_b,option_c,option_d,correct_answer,marks,negative_marks
What is 2+2?,3,4,5,6,B,1,0.25
What is the capital of France?,London,Paris,Berlin,Madrid,B,1,0.25
```

## Available Scripts

### Root Level
- `pnpm dev` - Start frontend development server
- `pnpm build` - Build frontend for production
- `pnpm start` - Start production server
- `pnpm install:all` - Install all dependencies

### Frontend
- `pnpm --filter frontend dev` - Start dev server
- `pnpm --filter frontend build` - Build for production
- `pnpm --filter frontend start` - Start production server

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# or use a different port
pnpm dev -- -p 3001
```

### Environment variables not loading
- Make sure `.env.local` exists in `frontend/` directory
- Restart the dev server after changing env variables
- Check that variable names match exactly

### Edge Functions not working
- Verify secrets are set in Supabase Dashboard
- Check function logs in Supabase Dashboard → Edge Functions
- Ensure database schemas are created

## Development Workflow

1. **Make changes to frontend code**
2. **Hot reload** will automatically refresh
3. **For Edge Functions**:
   - Make changes in `backend/functions/`
   - Deploy: `supabase functions deploy <function-name>`
   - Test the function

## Production Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Supabase)
Edge Functions are already deployed to Supabase and run serverlessly.

