# ✅ CLI Installed! Final Instructions

## ✅ Installation Complete
Supabase CLI is installed at: `~/.local/bin/supabase`

## ⚠️ Important: Reload Your Terminal

The PATH was updated, but you need to reload your terminal:

**Option 1: Close and reopen terminal**

**Option 2: Run this command:**
```bash
source ~/.zshrc
```

**Option 3: Use full path:**
```bash
~/.local/bin/supabase --version
```

## 🎯 Critical First Step: Set Secrets

**You have the Dashboard open - do this NOW:**

### In Edge Function Secrets Page:

1. **Add `SUPABASE_URL`:**
   - Name: `SUPABASE_URL`
   - Value: `https://tcfgopbbhshgcvvnwjki.supabase.co`
   - Click "Add another"

2. **Add `SUPABASE_SERVICE_ROLE_KEY`:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Get from **Settings → API → service_role** (click 👁️ to reveal)
   - Click **"Save"** ✅

**This fixes the "Failed to send request" error!**

## After Setting Secrets

### 1. Reload Terminal (or use full path)
```bash
source ~/.zshrc
supabase --version
```

### 2. Login
```bash
supabase login
```

### 3. Link Project
```bash
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki
```

### 4. Deploy Functions
```bash
supabase functions deploy
```

### 5. Test
```bash
cd ..
pnpm dev
```

Go to http://localhost:3000 and test login!

## Quick Reference

```bash
# If supabase command not found, use:
~/.local/bin/supabase --version

# Or reload shell:
source ~/.zshrc
supabase --version

# Then proceed with:
supabase login
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki
supabase functions deploy
```

## Summary

✅ **CLI Installed** - At `~/.local/bin/supabase`
⏳ **Set Secrets** - Do this in Dashboard FIRST! (you have it open)
⏳ **Reload Terminal** - `source ~/.zshrc` or close/reopen
⏳ **Login & Deploy** - Follow steps above

**Priority: Set secrets in Dashboard right now!** 🎯

