# Complete Setup Guide - Fix All Issues

## Current Status
- ❌ Supabase CLI not installed (npm/pnpm don't work)
- ⚠️ Need to set Edge Function secrets
- ⚠️ Need to deploy Edge Functions

## Step 1: Install Supabase CLI

### Option A: Homebrew (Best for macOS)

```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Supabase CLI
brew install supabase/tap/supabase

# Verify
supabase --version
```

### Option B: Direct Install Script

```bash
# Install
curl -fsSL https://supabase.com/install.sh | sh

# Add to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
supabase --version
```

## Step 2: Set Edge Function Secrets

**You have the Dashboard open!** Follow these steps:

1. **In the "ADD OR REPLACE SECRETS" section:**

   **Secret 1:**
   - Name: `SUPABASE_URL`
   - Value: `https://tcfgopbbhshgcvvnwjki.supabase.co`
   - Click "Add another"

   **Secret 2:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Get from **Settings → API → service_role** secret
   - Click "Save" (green button)

2. **Verify:** Both secrets should appear in the list below

## Step 3: Login to Supabase

```bash
supabase login
```

This opens your browser to authenticate.

## Step 4: Link Your Project

```bash
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki
```

## Step 5: Deploy Edge Functions

```bash
# From backend directory
supabase functions deploy
```

This deploys all 6 functions:
- start-session
- submit
- save-answer
- tab-switch
- admin-export
- server-time

## Step 6: Verify Everything Works

1. **Check Dashboard:**
   - Go to **Edge Functions** → Should see 6 functions listed

2. **Test Login:**
   - Start frontend: `pnpm dev`
   - Go to http://localhost:3000
   - Enter USN and Name
   - Click "Start Quiz"
   - ✅ Should work now!

## All Commands in Order

```bash
# 1. Install CLI (choose one)
brew install supabase/tap/supabase
# OR
curl -fsSL https://supabase.com/install.sh | sh

# 2. Verify
supabase --version

# 3. Login
supabase login

# 4. Link project
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki

# 5. Set secrets in Dashboard (manual step - see Step 2 above)

# 6. Deploy
supabase functions deploy

# 7. Test
cd ..
pnpm dev
```

## Troubleshooting

### "command not found: supabase" after install

**Homebrew:**
```bash
# Check installation
brew list supabase

# Reinstall if needed
brew reinstall supabase/tap/supabase
```

**Direct install:**
```bash
# Check if in PATH
echo $PATH | grep -q ".local/bin" || echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "Failed to send request" after deployment

1. ✅ Check secrets are set in Dashboard
2. ✅ Check functions are deployed (Dashboard → Edge Functions)
3. ✅ Check function logs for errors
4. ✅ Verify event is active and has questions

## Summary

**To fix everything:**

1. ✅ Install CLI: `brew install supabase/tap/supabase`
2. ✅ Set secrets in Dashboard (you're on the right page!)
3. ✅ Login: `supabase login`
4. ✅ Link: `cd backend && supabase link --project-ref tcfgopbbhshgcvvnwjki`
5. ✅ Deploy: `supabase functions deploy`
6. ✅ Test: Login should work!

That's it! 🎉

