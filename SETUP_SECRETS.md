# Setup Edge Function Secrets - Step by Step

## You're on the Right Page! ✅

I can see you have the **Edge Function Secrets** page open in Supabase Dashboard.

## Step-by-Step Instructions

### Step 1: Add SUPABASE_URL Secret

1. In the **"ADD OR REPLACE SECRETS"** section:
   - **Name field:** Type `SUPABASE_URL`
   - **Value field:** Type `https://tcfgopbbhshgcvvnwjki.supabase.co`
   - Click **"Add another"** to add the second secret

### Step 2: Add SUPABASE_SERVICE_ROLE_KEY Secret

1. **Name field:** Type `SUPABASE_SERVICE_ROLE_KEY`
2. **Value field:** Get this from:
   - Go to: **Settings** (left sidebar) → **API**
   - Under **"Project API keys"**
   - Find **"service_role"** (it's a secret key)
   - Click the **eye icon** or **copy icon** to reveal/copy it
   - ⚠️ **Keep this secret!** Never expose it publicly
   - Paste it in the **Value field**

### Step 3: Save

1. Click the green **"Save"** button
2. You should see both secrets appear in the list below

### Step 4: Verify Secrets Are Set

After saving, you should see:
- ✅ `SUPABASE_URL` in the secrets list
- ✅ `SUPABASE_SERVICE_ROLE_KEY` in the secrets list

## Visual Guide

```
┌─────────────────────────────────────┐
│ ADD OR REPLACE SECRETS              │
├─────────────────────────────────────┤
│ Name: SUPABASE_URL                  │
│ Value: https://tcfgopbbhshgcvvnwjki │
│        .supabase.co                 │
│                                     │
│ [Add another]                       │
│                                     │
│ Name: SUPABASE_SERVICE_ROLE_KEY     │
│ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6 │
│        ... (your secret key)        │
│                                     │
│ [Save] ← Click this!                │
└─────────────────────────────────────┘
```

## Where to Get Service Role Key

1. **Left Sidebar** → Click **"Settings"** (gear icon)
2. Click **"API"** in the settings menu
3. Scroll to **"Project API keys"** section
4. Find **"service_role"** row
5. Click the **eye icon** 👁️ to reveal
6. Click **copy icon** 📋 to copy
7. Paste in the Value field

## Important Notes

⚠️ **Security:**
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row-Level Security
- Never commit it to git
- Never expose it in frontend code
- Only use in Edge Functions (server-side)

✅ **After Setting Secrets:**
1. Deploy Edge Functions (see next steps)
2. Test the login flow
3. Should work now!

## Next Steps

After setting secrets:

```bash
# 1. Make sure Supabase CLI is installed
supabase --version

# 2. Login (if not already)
supabase login

# 3. Link project
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki

# 4. Deploy functions
supabase functions deploy
```

## Troubleshooting

**Can't find service_role key?**
- Make sure you're looking in **Settings → API**
- It's in the **"Project API keys"** section
- Look for **"service_role"** (not "anon" or "service_role key")

**Secrets not saving?**
- Make sure both Name and Value fields are filled
- Click "Save" button (green button at bottom)
- Check browser console for errors

**Still getting "Failed to send request"?**
- ✅ Verify secrets are saved (check the list below)
- ✅ Deploy functions: `supabase functions deploy`
- ✅ Check function logs in Dashboard

