# Deploy Edge Functions - Complete Guide

## Issue: "Failed to send a request to the Edge Function"

This error occurs when:
1. Edge Functions are not deployed
2. Edge Function secrets are not configured
3. Supabase CLI is not installed

## Step 1: Install Supabase CLI

### Option A: Using pnpm (Global Install)

```bash
pnpm add -g supabase
```

### Option B: Using npm (Alternative)

```bash
npm install -g supabase
```

### Option C: Using Homebrew (macOS)

```bash
brew install supabase/tap/supabase
```

### Verify Installation

```bash
supabase --version
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

## Step 3: Link Your Project

```bash
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki
```

Or if you need to find your project ref:
1. Go to Supabase Dashboard
2. Settings → General
3. Copy "Reference ID"

## Step 4: Set Edge Function Secrets

Edge Functions need these environment variables:

### Required Secrets:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (⚠️ Keep secret!)

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to **Supabase Dashboard** → **Edge Functions** → **Secrets**
2. Click **"Add or Replace Secrets"**
3. Add these secrets:

   **Secret 1:**
   - Name: `SUPABASE_URL`
   - Value: `https://tcfgopbbhshgcvvnwjki.supabase.co` (your project URL)

   **Secret 2:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your service role key (from Settings → API → service_role secret)

4. Click **"Save"**

### Method 2: Using Supabase CLI

```bash
# Set secrets via CLI
supabase secrets set SUPABASE_URL=https://tcfgopbbhshgcvvnwjki.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### How to Get Your Service Role Key:

1. Go to Supabase Dashboard
2. Settings → API
3. Under "Project API keys"
4. Copy the **"service_role"** secret key (⚠️ Never expose this publicly!)

## Step 5: Deploy Edge Functions

### Deploy All Functions

```bash
cd backend
supabase functions deploy
```

### Deploy Individual Functions

```bash
cd backend
supabase functions deploy start-session
supabase functions deploy submit
supabase functions deploy save-answer
supabase functions deploy tab-switch
supabase functions deploy admin-export
supabase functions deploy server-time
```

## Step 6: Verify Deployment

1. Go to **Supabase Dashboard** → **Edge Functions**
2. You should see all 6 functions listed:
   - ✅ start-session
   - ✅ submit
   - ✅ save-answer
   - ✅ tab-switch
   - ✅ admin-export
   - ✅ server-time

## Step 7: Test the Function

### Test via Dashboard:
1. Go to **Edge Functions** → **start-session**
2. Click **"Invoke"**
3. Use test payload:
   ```json
   {
     "usn": "TEST123",
     "name": "Test User",
     "eventId": "3265c65f-3bcd-4e71-94b3-a6493e2715bb"
   }
   ```

### Test via Frontend:
1. Start frontend: `pnpm dev`
2. Go to http://localhost:3000
3. Enter USN and Name
4. Click "Start Quiz"
5. Should work now! ✅

## Troubleshooting

### Error: "command not found: supabase"

**Solution:**
```bash
# Install globally with pnpm
pnpm add -g supabase

# Or with npm
npm install -g supabase

# Verify
which supabase
supabase --version
```

### Error: "Failed to send a request to the Edge Function"

**Causes & Solutions:**

1. **Function not deployed:**
   ```bash
   cd backend
   supabase functions deploy start-session
   ```

2. **Secrets not set:**
   - Check Supabase Dashboard → Edge Functions → Secrets
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` exist

3. **Wrong project linked:**
   ```bash
   supabase link --project-ref tcfgopbbhshgcvvnwjki
   ```

4. **Function logs show errors:**
   - Go to Dashboard → Edge Functions → start-session → Logs
   - Check for specific error messages

### Error: "Not logged in"

```bash
supabase login
```

### Error: "Project not linked"

```bash
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki
```

## Quick Setup Script

Save this as `setup-edge-functions.sh`:

```bash
#!/bin/bash

echo "🚀 Setting up Edge Functions..."

# Install Supabase CLI
echo "📦 Installing Supabase CLI..."
pnpm add -g supabase

# Login
echo "🔐 Logging in to Supabase..."
supabase login

# Link project
echo "🔗 Linking project..."
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki

# Deploy functions
echo "📤 Deploying Edge Functions..."
supabase functions deploy

echo "✅ Done! Don't forget to set secrets in Dashboard!"
echo "   Go to: Edge Functions → Secrets"
echo "   Add: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
```

Make it executable:
```bash
chmod +x setup-edge-functions.sh
./setup-edge-functions.sh
```

## Environment Variables Reference

| Variable | Where to Get | Where to Set |
|----------|-------------|--------------|
| `SUPABASE_URL` | Dashboard → Settings → API → Project URL | Dashboard → Edge Functions → Secrets |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard → Settings → API → service_role secret | Dashboard → Edge Functions → Secrets |

## Next Steps After Deployment

1. ✅ Functions deployed
2. ✅ Secrets configured
3. ✅ Test login flow
4. ✅ Verify sessions are created
5. ✅ Test quiz functionality

## Summary

**To fix "Failed to send a request to the Edge Function":**

1. Install Supabase CLI: `pnpm add -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref tcfgopbbhshgcvvnwjki`
4. Set secrets in Dashboard (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
5. Deploy: `cd backend && supabase functions deploy`
6. Test: Try logging in again

That's it! 🎉
