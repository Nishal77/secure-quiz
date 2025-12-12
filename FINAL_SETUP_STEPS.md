# Final Setup Steps - Get Login Working

## ✅ What's Done

1. ✅ User dashboard created (`/user/dashboard`)
2. ✅ Login flow updated (redirects to dashboard)
3. ✅ Error handling improved
4. ✅ Edge Function deployed
5. ✅ Session storage logic in place

## ⚠️ CRITICAL: Set Secrets (This Fixes 401 Error!)

### Step 1: Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard/project/tcfgopbbhshgcvvnwjki/functions/secrets
2. You should see the "Edge Function Secrets" page

### Step 2: Add Secrets

**Secret 1:**
- **Name:** `SUPABASE_URL`
- **Value:** `https://tcfgopbbhshgcvvnwjki.supabase.co`
- Click **"Add another"**

**Secret 2:**
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `8afdf4c5b3cd06f20034da6342e15f45d257f7fd40cd526a00bd5a8e8574cae1`
- Click **"Save"** (green button)

### Step 3: Verify

After saving, both secrets should appear in the list below.

## Test the Complete Flow

### 1. Start Frontend
```bash
pnpm dev
```

### 2. Test Login
1. Go to http://localhost:3000
2. Enter:
   - USN: `4MT24MC054`
   - Name: `Nishal`
3. Click "Start Quiz"

### 3. Expected Result
- ✅ No error message
- ✅ Redirects to `/user/dashboard?sessionId=<id>`
- ✅ Shows "Welcome, Nishal!"
- ✅ Shows USN: `4MT24MC054`
- ✅ Shows session details
- ✅ "Start Quiz" button available

### 4. Verify Database
```sql
SELECT usn, student_name, created_at 
FROM sessions 
ORDER BY created_at DESC;
```

Should show your session with USN and name stored!

## How It Works

1. **Login Page** (`/`)
   - User enters USN and name
   - Calls `start-session` Edge Function
   - Function stores data in `sessions` table
   - Returns session ID

2. **User Dashboard** (`/user/dashboard`)
   - Shows welcome message
   - Displays USN and name (from database)
   - Shows session info
   - "Start Quiz" button

3. **Quiz Page** (`/quiz/<session-id>`)
   - User starts the quiz
   - Questions loaded
   - Timer starts

## Troubleshooting

### Still getting "Edge Function returned a non-2xx status code"?

1. ✅ Check secrets are set (Dashboard → Edge Functions → Secrets)
2. ✅ Verify secret names are exact: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. ✅ Check no typos in values
4. ✅ Redeploy function: `cd backend && pnpm run deploy:start-session`

### "No active quiz event found"?

1. Create an event in admin panel
2. Activate it
3. Add questions to it

### Dashboard shows "Session not found"?

1. Check sessionId in URL
2. Verify session exists: `SELECT * FROM sessions WHERE id = '<session-id>';`
3. Check browser console for errors

## Summary

✅ **All code is ready!**
⏳ **Set secrets in Dashboard** (this fixes the 401 error)
✅ **Test the flow**
✅ **USN and name will be stored in database**
✅ **Dashboard will show user info**

**After setting secrets, login will work perfectly!** 🎉

