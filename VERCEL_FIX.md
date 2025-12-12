# 🚨 VERCEL BUILD ERROR - FIX REQUIRED

## The Error

```
sh: line 1: cd: frontend: No such file or directory
Error: Command "cd frontend && pnpm install && pnpm build" exited with 1
```

## Root Cause

**Vercel Dashboard has build settings that OVERRIDE `vercel.json`.**

The Dashboard is configured to run: `cd frontend && pnpm install && pnpm build`

This fails because:
1. Root Directory is NOT set in Vercel Dashboard
2. Vercel doesn't know where `frontend` directory is relative to
3. Dashboard settings take precedence over `vercel.json` for monorepos

## ✅ THE FIX (MUST DO THIS)

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Click on your project: `secure-quiz-frontend`

### Step 2: Settings → General

1. Click **"Settings"** tab
2. Click **"General"** in left sidebar

### Step 3: Set Root Directory ⚠️ CRITICAL

1. Scroll to **"Root Directory"** section
2. Click **"Edit"** button
3. Type: `frontend`
4. Click **"Save"**

### Step 4: Clear Build Command Override

1. In same page, find **"Build and Output Settings"**
2. Expand it
3. **DELETE/CLEAR** the "Build Command" field (make it empty)
4. **DELETE/CLEAR** the "Output Directory" field (make it empty)
5. **DELETE/CLEAR** the "Install Command" field (make it empty)
6. Click **"Save"**

This allows Vercel to:
- Auto-detect Next.js from `frontend/package.json`
- Use `frontend/` as the working directory
- Run `pnpm build` from the correct location

### Step 5: Redeploy

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on latest deployment

## Why This Is Required

- Vercel Dashboard settings **OVERRIDE** `vercel.json` for monorepos
- The Dashboard has `cd frontend && pnpm install && pnpm build` hardcoded
- This command fails because Root Directory isn't set
- Setting Root Directory makes Vercel change to `frontend/` first
- Then commands run from the correct directory

## What Changed in Code

- ✅ Updated `vercel.json` to use `pnpm --filter frontend build`
- ✅ This works from root using pnpm workspace
- ✅ But Dashboard override still takes precedence

## After Setting Root Directory

The build will:
1. ✅ Change to `frontend/` directory automatically
2. ✅ Run `pnpm install` from `frontend/`
3. ✅ Run `pnpm build` from `frontend/`
4. ✅ Find output in `.next` directory
5. ✅ Deploy successfully

## ⚠️ IMPORTANT

**You CANNOT fix this with code alone.** The Vercel Dashboard settings MUST be updated. This is a Vercel limitation for monorepo deployments.
