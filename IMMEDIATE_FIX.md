# Immediate Fix - Set Secrets & Deploy via Dashboard

## Quick Solution (No CLI Needed!)

Since CLI installation has issues, you can set secrets and deploy via Dashboard.

## Step 1: Set Secrets (You're on the Right Page!)

**In the Edge Function Secrets page you have open:**

1. **Add First Secret:**
   - **Name:** `SUPABASE_URL`
   - **Value:** `https://tcfgopbbhshgcvvnwjki.supabase.co`
   - Click **"Add another"**

2. **Add Second Secret:**
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Get from **Settings → API → service_role** (click eye icon to reveal)
   - Click **"Save"** (green button)

3. **Verify:** Both secrets should appear in the list

## Step 2: Deploy Functions via Dashboard

### Option A: Use Supabase Dashboard (Easiest)

1. Go to **Edge Functions** → **Functions** (left sidebar)
2. You should see your function folders
3. Click on **"start-session"** function
4. Click **"Deploy"** or use the deploy button
5. Repeat for other functions if needed

### Option B: Fix CLI Installation First

If you want to use CLI, fix Xcode first:

```bash
# Update Xcode from App Store, then:
brew install supabase/tap/supabase
```

Or use the official install method:
```bash
# Check latest install method at:
# https://github.com/supabase/cli#install-the-cli
```

## Step 3: Test After Secrets Are Set

1. **Set the secrets** (Step 1 above)
2. **Deploy functions** (Step 2 above)
3. **Test login:**
   ```bash
   pnpm dev
   ```
   Go to http://localhost:3000 and try logging in

## Alternative: Manual Function Upload

If Dashboard deploy doesn't work:

1. Go to **Edge Functions** → **Functions**
2. Click **"Create a new function"** or upload via Dashboard
3. Copy function code from `backend/functions/start-session/index.ts`
4. Paste and deploy

## Quick Checklist

- [ ] Set `SUPABASE_URL` secret in Dashboard
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` secret in Dashboard
- [ ] Deploy functions (via Dashboard or CLI)
- [ ] Test login at http://localhost:3000

## Most Important: Set Secrets NOW!

**You have the secrets page open - do this first:**

1. Add `SUPABASE_URL` = `https://tcfgopbbhshgcvvnwjki.supabase.co`
2. Add `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API)
3. Click **Save**

This will fix the "Failed to send request" error!

