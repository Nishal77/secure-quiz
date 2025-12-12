# Quick Start Guide - Running Frontend & Backend

## Prerequisites

1. **Node.js 18+** installed
2. **pnpm** installed (`npm install -g pnpm`)
3. **Supabase project** set up (database migrations applied)
4. **Supabase CLI** installed (for backend deployment)

## Step 1: Install Dependencies

### Option A: Install All at Once (Recommended)
```bash
# From project root
pnpm install
```

### Option B: Install Separately
```bash
# Frontend
cd frontend
pnpm install

# Backend (if needed)
cd ../backend
pnpm install
```

## Step 2: Configure Environment Variables

### Frontend Environment

Create or update `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**How to get these values:**
1. Go to Supabase Dashboard → Settings → API
2. Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Backend Environment (Edge Functions)

Set these in **Supabase Dashboard** (not in local files):
1. Go to **Settings → Edge Functions**
2. Add environment variables:
   - `SUPABASE_URL` = Your project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key

**How to get service role key:**
- Go to Supabase Dashboard → Settings → API
- Copy "service_role secret" key (⚠️ Keep this secret!)

## Step 3: Run Frontend

### From Project Root
```bash
pnpm dev
# or
pnpm --filter frontend dev
```

### From Frontend Directory
```bash
cd frontend
pnpm dev
```

**Frontend will run at:** http://localhost:3000

## Step 4: Deploy Backend (Edge Functions)

The backend consists of Supabase Edge Functions that need to be deployed to Supabase.

### First Time Setup

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   
   Find your project ref in Supabase Dashboard → Settings → General

### Deploy Functions

**Option A: Deploy All Functions**
```bash
cd backend
supabase functions deploy
```

**Option B: Deploy Individual Functions**
```bash
cd backend
supabase functions deploy start-session
supabase functions deploy submit
supabase functions deploy save-answer
supabase functions deploy tab-switch
supabase functions deploy admin-export
supabase functions deploy server-time
```

### Verify Deployment

1. Go to Supabase Dashboard → Edge Functions
2. You should see all 6 functions listed:
   - `start-session`
   - `submit`
   - `save-answer`
   - `tab-switch`
   - `admin-export`
   - `server-time`

## Step 5: Verify Everything Works

1. **Frontend**: Open http://localhost:3000
2. **Admin Panel**: Go to http://localhost:3000/admin/events
3. **Create an Event**: Test creating an event
4. **Check Functions**: Verify functions are deployed in Supabase Dashboard

## Common Commands

### Frontend Development
```bash
# Start dev server
pnpm dev                    # From root
cd frontend && pnpm dev     # From frontend dir

# Build for production
pnpm build                  # From root
cd frontend && pnpm build   # From frontend dir

# Start production server
pnpm start                  # From root
cd frontend && pnpm start  # From frontend dir
```

### Backend (Edge Functions)
```bash
# Deploy all functions
cd backend
supabase functions deploy

# Deploy specific function
supabase functions deploy start-session

# View function logs
supabase functions logs start-session

# Test function locally (if configured)
supabase functions serve start-session
```

## Troubleshooting

### Frontend Issues

**Error: Missing Supabase environment variables**
- ✅ Check `frontend/.env.local` exists
- ✅ Verify variable names start with `NEXT_PUBLIC_`
- ✅ Restart dev server after adding env vars

**Error: Cannot connect to Supabase**
- ✅ Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- ✅ Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- ✅ Ensure Supabase project is active

**Port 3000 already in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
cd frontend
PORT=3001 pnpm dev
```

### Backend Issues

**Error: supabase: command not found**
```bash
npm install -g supabase
```

**Error: Not logged in**
```bash
supabase login
```

**Error: Project not linked**
```bash
supabase link --project-ref your-project-ref
```

**Error: Function deployment failed**
- ✅ Check environment variables in Supabase Dashboard
- ✅ Verify function code has no syntax errors
- ✅ Check Supabase CLI is up to date: `supabase update`

**Error: RLS policy errors**
- ✅ Ensure all migrations are applied
- ✅ Check RLS policies in Supabase Dashboard → Authentication → Policies

## Development Workflow

### Typical Development Session

1. **Start Frontend**:
   ```bash
   pnpm dev
   ```

2. **Make Changes**:
   - Edit frontend code
   - Hot reload will update automatically

3. **Deploy Backend Changes** (when needed):
   ```bash
   cd backend
   supabase functions deploy function-name
   ```

4. **Test**:
   - Test in browser at http://localhost:3000
   - Check browser console for errors
   - Check Supabase Dashboard → Edge Functions → Logs

## Project Structure

```
Quiz-2025/
├── frontend/              # Next.js frontend
│   ├── .env.local        # Frontend environment variables
│   └── package.json
├── backend/               # Supabase Edge Functions
│   ├── functions/        # Individual function folders
│   └── package.json
└── package.json          # Root workspace config
```

## Next Steps After Setup

1. ✅ Frontend running on http://localhost:3000
2. ✅ Backend functions deployed to Supabase
3. ✅ Create your first event at `/admin/events`
4. ✅ Insert questions (use scripts from `scripts/` directory)
5. ✅ Test the quiz flow

## Need Help?

- Check `README.md` for detailed documentation
- Check `SETUP.md` for setup instructions
- Check `MIGRATION_GUIDE.md` for database migrations
- Check Supabase Dashboard for logs and errors

