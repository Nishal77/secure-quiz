# 🔧 How to Fix Vercel Build Error - Step by Step Guide

## The Problem
Vercel is trying to run `cd frontend && pnpm install && pnpm build` but can't find the `frontend` directory because Root Directory isn't set.

## ✅ Solution: Update Vercel Dashboard Settings

Follow these **exact steps**:

---

### **STEP 1: Open Vercel Dashboard**

1. Go to: **https://vercel.com/dashboard**
2. Log in if needed
3. Find your project (likely named something like `secure-quiz` or `quiz-platform`)
4. **Click on your project** to open it

---

### **STEP 2: Navigate to Settings**

1. Look at the top navigation bar
2. Click the **"Settings"** tab (next to "Deployments", "Analytics", etc.)
3. You should see a left sidebar with options like:
   - General
   - Environment Variables
   - Git
   - etc.

---

### **STEP 3: Open General Settings**

1. In the left sidebar, click **"General"**
2. You'll see various settings sections

---

### **STEP 4: Set Root Directory** ⚠️ **CRITICAL STEP**

1. Scroll down to find the **"Root Directory"** section
2. You'll see something like:
   ```
   Root Directory
   [Edit]  (currently empty or shows "/")
   ```
3. Click the **"Edit"** button
4. A text input will appear
5. Type exactly: **`frontend`** (no quotes, no slash, just `frontend`)
6. Click **"Save"** or press Enter

**What this does:** Tells Vercel to treat `frontend/` as the project root for all commands.

---

### **STEP 5: Fix Build Command** ⚠️ **CRITICAL STEP**

1. On the same "General" settings page, scroll to **"Build and Deployment"** section (or "Framework Settings")
2. Find the **"Build Command"** field
3. **Current value (WRONG):** `cd frontend && pnpm install && pnpm build`
4. **Change it to:** `pnpm install && pnpm build` (remove `cd frontend &&` from the beginning)
5. **OR** even better: Turn OFF the "Override" toggle next to Build Command to let Vercel auto-detect

**Why:** Since Root Directory is already `frontend`, Vercel is already inside that directory. The `cd frontend &&` tries to go into `frontend/frontend`, which doesn't exist!

**For Output Directory:**
- Current: `frontend/.next`
- Change to: `.next` (remove `frontend/` prefix)
- **OR** turn OFF the "Override" toggle to auto-detect

**For Install Command:**
- Current: `pnpm install` (this is fine, but you can also turn OFF override)

6. After making changes, click **"Save"** at the bottom

---

### **STEP 6: Verify Settings**

After saving, your settings should look like:

- ✅ **Root Directory:** `frontend`
- ✅ **Build Command:** (empty - auto-detected)
- ✅ **Output Directory:** (empty - auto-detected)
- ✅ **Install Command:** (empty - auto-detected)

---

### **STEP 7: Redeploy**

1. Click the **"Deployments"** tab at the top
2. Find your latest deployment (the one that failed)
3. Click the **"⋯"** (three dots) menu next to it
4. Click **"Redeploy"**
5. Confirm the redeploy

**OR** simply push a new commit to trigger a new deployment.

---

## 🎯 What Happens After This

When you redeploy, Vercel will:

1. ✅ Clone your repository
2. ✅ **Automatically change to `frontend/` directory** (because Root Directory is set)
3. ✅ Run `pnpm install` from `frontend/`
4. ✅ Run `pnpm build` from `frontend/` (auto-detected from `package.json`)
5. ✅ Find the output in `.next/` directory
6. ✅ Deploy successfully! 🎉

---

## 📸 Visual Guide (What You'll See)

### Root Directory Section:
```
┌─────────────────────────────────────┐
│ Root Directory                      │
│ [Edit]  frontend                    │ ← Type "frontend" here
└─────────────────────────────────────┘
```

### Build and Output Settings:
```
┌─────────────────────────────────────┐
│ Build and Output Settings          │
│                                     │
│ Build Command:                     │ ← Make empty
│ [                    ]              │
│                                     │
│ Output Directory:                  │ ← Make empty
│ [                    ]              │
│                                     │
│ Install Command:                    │ ← Make empty
│ [                    ]              │
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
```

---

## ⚠️ Common Mistakes to Avoid

1. ❌ **Don't** type `/frontend` (no leading slash)
2. ❌ **Don't** type `./frontend` (no dot-slash)
3. ❌ **Don't** leave Root Directory empty
4. ❌ **Don't** forget to clear the Build Command field
5. ❌ **Don't** forget to save after making changes

---

## 🔍 If You Can't Find These Settings

If you don't see "Root Directory" or "Build and Output Settings":

1. Make sure you're in the **"Settings"** tab (not "Deployments")
2. Make sure you clicked **"General"** in the left sidebar
3. Scroll down - these settings are usually near the bottom
4. If still not visible, you might need to:
   - Check if you have the correct permissions (must be project owner/admin)
   - Try refreshing the page
   - Check if you're on the correct project

---

## ✅ Success Indicators

After fixing and redeploying, you should see:

- ✅ Build logs show: `Running "pnpm install"` (from frontend/)
- ✅ Build logs show: `Running "pnpm build"` (from frontend/)
- ✅ No more `cd: frontend: No such file or directory` error
- ✅ Build completes successfully
- ✅ Deployment succeeds

---

## 🆘 Still Having Issues?

If after following these steps you still get errors:

1. **Double-check Root Directory:** Make sure it says exactly `frontend` (case-sensitive)
2. **Check Build Logs:** Look at the full build log to see what command is actually running
3. **Verify Project Structure:** Make sure your `frontend/` folder exists in the repository
4. **Contact Support:** If nothing works, Vercel support can help debug

---

## 📝 Quick Checklist

Before redeploying, verify:

- [ ] Root Directory is set to: `frontend`
- [ ] Build Command is: (empty)
- [ ] Output Directory is: (empty)
- [ ] Install Command is: (empty)
- [ ] All changes are saved
- [ ] Ready to redeploy

---

**That's it!** After completing these steps, your Vercel deployment should work perfectly. 🚀
