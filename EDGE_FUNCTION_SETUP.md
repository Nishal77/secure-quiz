# Edge Function Setup - Step by Step

## ✅ Step 1: Install Supabase CLI (DONE)

The CLI installation script is ready. Run:

```bash
./scripts/install-supabase-cli.sh
```

Or manually:
```bash
brew install supabase/tap/supabase
```

Verify:
```bash
supabase --version
```

## 📝 Step 2: Add Secrets in Supabase Dashboard

### Your Project Details:
- **Project URL**: `https://tcfgopbbhshgcvvnwjki.supabase.co`
- **Project ID**: `tcfgopbbhshgcvvnwjki`

### How to Add Secrets:

1. **Go to Supabase Dashboard:**
   - Navigate to: https://supabase.com/dashboard/project/tcfgopbbhshgcvvnwjki/functions/secrets

2. **Get Your Service Role Key:**
   - Go to: **Settings** → **API**
   - Find **"service_role"** key (⚠️ Keep this secret!)
   - Copy the entire key

3. **Add Secrets:**
   - Click **"ADD OR REPLACE SECRETS"**
   - Add these two secrets:

   **Secret 1:**
   ```
   Name: SUPABASE_URL
   Value: https://tcfgopbbhshgcvvnwjki.supabase.co
   ```

   **Secret 2:**
   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [paste your service_role key here]
   ```

4. **Click "Save"**

### Quick Copy-Paste Format:

You can paste this format in the secrets page:
```
SUPABASE_URL=https://tcfgopbbhshgcvvnwjki.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🔗 Step 3: Login and Link Project

```bash
# Login to Supabase
supabase login

# Link your project
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki
```

## 📦 Step 4: Deploy Edge Functions

### Option A: Deploy All at Once
```bash
cd backend
supabase functions deploy
```

### Option B: Use the Deployment Script
```bash
./scripts/deploy-functions.sh
```

### Option C: Deploy Individual Functions
```bash
cd backend
supabase functions deploy start-session
supabase functions deploy submit
supabase functions deploy save-answer
supabase functions deploy tab-switch
supabase functions deploy admin-export
supabase functions deploy server-time
```

## ✅ Step 5: Verify Deployment

1. **Check Supabase Dashboard:**
   - Go to: **Edge Functions**
   - You should see 6 functions:
     - ✅ start-session
     - ✅ submit
     - ✅ save-answer
     - ✅ tab-switch
     - ✅ admin-export
     - ✅ server-time

2. **Test a Function:**
   - Click on **start-session**
   - Click **"Invoke"**
   - Use test payload:
     ```json
     {
       "usn": "TEST123",
       "name": "Test User",
       "eventId": "3265c65f-3bcd-4e71-94b3-a6493e2715bb"
     }
     ```

## 🐛 Troubleshooting

### Error: "command not found: supabase"
```bash
# Install via Homebrew
brew install supabase/tap/supabase

# Or via npm
npm install -g supabase
```

### Error: "Not logged in"
```bash
supabase login
```

### Error: "Project not linked"
```bash
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki
```

### Error: "Failed to send a request to the Edge Function"

**Check these:**

1. **Function is deployed:**
   - Go to Supabase Dashboard → Edge Functions
   - Verify function exists

2. **Secrets are set:**
   - Go to Supabase Dashboard → Edge Functions → Secrets
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` exist

3. **Check function logs:**
   - Go to Supabase Dashboard → Edge Functions → [function name] → Logs
   - Look for error messages

4. **Test function manually:**
   - Use the "Invoke" button in Supabase Dashboard
   - Check the response

## 📋 Quick Checklist

- [ ] Supabase CLI installed (`supabase --version`)
- [ ] Logged in (`supabase login`)
- [ ] Project linked (`supabase link --project-ref tcfgopbbhshgcvvnwjki`)
- [ ] Secrets added in Dashboard (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Functions deployed (`supabase functions deploy`)
- [ ] Functions visible in Dashboard
- [ ] Test function works

## 🎯 Next Steps After Setup

1. ✅ Test login flow in frontend
2. ✅ Check browser console for errors
3. ✅ Monitor function logs
4. ✅ Verify sessions are being created

## 📞 Need Help?

- Check `DEPLOY_EDGE_FUNCTIONS.md` for detailed guide
- Check `TROUBLESHOOTING.md` for common issues
- Check Supabase Dashboard → Edge Functions → Logs for errors
