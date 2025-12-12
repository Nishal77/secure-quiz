# Quick Fix: Edge Functions Setup

## Problem
- ❌ `zsh: command not found: supabase`
- ❌ "Failed to send a request to the Edge Function"

## Solution (5 Steps)

### Step 1: Install Supabase CLI with pnpm

```bash
pnpm add -g supabase
```

Verify installation:
```bash
supabase --version
```

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

### Step 4: Set Secrets in Dashboard ⚠️ IMPORTANT

**Go to:** Supabase Dashboard → Edge Functions → Secrets

**Add these 2 secrets:**

1. **SUPABASE_URL**
   - Value: `https://tcfgopbbhshgcvvnwjki.supabase.co`

2. **SUPABASE_SERVICE_ROLE_KEY**
   - Get from: Dashboard → Settings → API → "service_role" secret key
   - ⚠️ Keep this secret!

Click **"Save"**

### Step 5: Deploy Functions

```bash
cd backend
pnpm deploy
```

Or deploy all at once:
```bash
supabase functions deploy
```

## Verify It Works

1. Check Dashboard → Edge Functions (should see 6 functions)
2. Test login at http://localhost:3000
3. Should work now! ✅

## All Commands in One

```bash
# 1. Install CLI
pnpm add -g supabase

# 2. Login
supabase login

# 3. Link project
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki

# 4. Set secrets in Dashboard (manual step)

# 5. Deploy
pnpm deploy
```

## Troubleshooting

**Still getting "command not found"?**
```bash
# Try npm instead
npm install -g supabase

# Or check PATH
echo $PATH
```

**Still getting "Failed to send request"?**
1. ✅ Check secrets are set in Dashboard
2. ✅ Check functions are deployed
3. ✅ Check browser console for specific errors

