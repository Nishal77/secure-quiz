# ✅ Supabase CLI Installed! Next Steps

## ✅ What's Done
- Supabase CLI installed: `supabase 2.65.5`
- Added to PATH: `/Users/nishalpoojary/.local/bin/supabase`

## 🎯 Next Steps (In Order)

### Step 1: Set Secrets in Dashboard (CRITICAL!)

**You have the Edge Function Secrets page open:**

1. **Add Secret 1:**
   - Name: `SUPABASE_URL`
   - Value: `https://tcfgopbbhshgcvvnwjki.supabase.co`
   - Click "Add another"

2. **Add Secret 2:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Get from **Settings → API → service_role** (click eye icon)
   - Click **"Save"** (green button)

**⚠️ Do this FIRST before deploying!**

### Step 2: Login to Supabase

```bash
supabase login
```

This opens your browser to authenticate.

### Step 3: Link Your Project

```bash
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki
```

### Step 4: Deploy Edge Functions

```bash
# Still in backend directory
supabase functions deploy
```

This deploys all 6 functions.

### Step 5: Test

```bash
# Go back to root
cd ..

# Start frontend
pnpm dev
```

Then go to http://localhost:3000 and test login!

## All Commands

```bash
# 1. Set secrets in Dashboard (manual - see Step 1)

# 2. Login
supabase login

# 3. Link
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki

# 4. Deploy
supabase functions deploy

# 5. Test
cd ..
pnpm dev
```

## Verify Installation

```bash
supabase --version
# Should show: supabase 2.65.5
```

## Summary

✅ **CLI Installed** - Ready to use!
⏳ **Set Secrets** - Do this in Dashboard NOW (you have it open!)
⏳ **Login** - `supabase login`
⏳ **Link** - `cd backend && supabase link --project-ref tcfgopbbhshgcvvnwjki`
⏳ **Deploy** - `supabase functions deploy`

**Most Important:** Set the secrets in Dashboard first! That's the critical step to fix "Failed to send request" error.

