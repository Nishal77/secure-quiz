# Set Edge Function Secrets - Step by Step

## ⚠️ Critical: Set Secrets to Fix 401 Errors

The "Edge Function returned a non-2xx status code" error is likely because secrets are not set.

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard/project/tcfgopbbhshgcvvnwjki
2. Click **"Edge Functions"** in left sidebar
3. Click **"Secrets"** (under MANAGE section)

### 2. Add First Secret: SUPABASE_URL

1. In the **"ADD OR REPLACE SECRETS"** section:
   - **Name:** Type `SUPABASE_URL`
   - **Value:** Type `https://tcfgopbbhshgcvvnwjki.supabase.co`
   - Click **"Add another"**

### 3. Add Second Secret: SUPABASE_SERVICE_ROLE_KEY

1. **Name:** Type `SUPABASE_SERVICE_ROLE_KEY`
2. **Value:** Paste your secret key:
   ```
   8afdf4c5b3cd06f20034da6342e15f45d257f7fd40cd526a00bd5a8e8574cae1
   ```
3. Click **"Save"** (green button)

### 4. Verify Secrets Are Set

After saving, you should see both secrets in the list:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

## Important Notes

⚠️ **Security:**
- Never commit secrets to git
- Never share secrets publicly
- The service role key bypasses RLS - keep it secret!

✅ **After Setting:**
- Functions will work correctly
- 401 errors will be resolved
- Login will store data in database

## Test After Setting Secrets

1. Go to http://localhost:3000
2. Enter USN and Name
3. Click "Start Quiz"
4. Should redirect to `/user/dashboard`
5. Check database - session should be stored!

## Troubleshooting

**Still getting 401?**
- Verify secrets are saved (check the list)
- Make sure names are exact: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check for typos in values
- Redeploy functions: `cd backend && pnpm run deploy`

**Still getting errors?**
- Check function logs in Dashboard
- Verify event is active
- Verify questions exist for event

