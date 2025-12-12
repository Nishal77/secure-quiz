# ⚠️ CRITICAL: Vercel Root Directory Fix

## The Problem

Vercel is trying to run `cd frontend && pnpm install && pnpm build` but fails because:
- Root Directory is **NOT set** in Vercel Dashboard
- Vercel doesn't know where your Next.js app is located

## ✅ THE FIX (Required)

You **MUST** set Root Directory in Vercel Dashboard. There's no way around this for monorepos.

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Click on your project: `secure-quiz-frontend`

2. **Settings → General**
   - Click **"Settings"** tab
   - Click **"General"** section

3. **Set Root Directory**
   - Scroll to **"Root Directory"**
   - Click **"Edit"** or **"Override"**
   - Type: `frontend`
   - Click **"Save"**

4. **Verify Build Settings** (in same page)
   - **Framework Preset**: Next.js (auto)
   - **Build Command**: Leave empty (will use `pnpm build` from frontend/)
   - **Output Directory**: Leave empty (will use `.next`)
   - **Install Command**: Leave empty (will use `pnpm install`)

5. **Redeploy**
   - Go to **"Deployments"** tab
   - Click **"Redeploy"** on latest deployment

## What Changed in Code

- ✅ Removed root `vercel.json` (not needed when Root Directory is set)
- ✅ Kept `frontend/vercel.json` (for security headers)
- ✅ Configuration is now correct

## Why This Works

When Root Directory = `frontend`:
- Vercel changes to `frontend/` directory first
- All commands run from `frontend/`
- `pnpm build` works because it's in the right directory
- No `cd frontend` needed

## After Setting Root Directory

The build will:
1. ✅ Change to `frontend/` directory
2. ✅ Run `pnpm install` (installs frontend dependencies)
3. ✅ Run `pnpm build` (builds Next.js app)
4. ✅ Find output in `.next` directory
5. ✅ Deploy successfully

## Important

- **Root Directory MUST be set in Dashboard** - this is not optional
- The `vercel.json` file alone cannot fix this
- Vercel Dashboard settings override file-based config for monorepos

## Verification

After setting Root Directory and redeploying, you should see:
- ✅ Build succeeds
- ✅ No "cd: frontend: No such file or directory" error
- ✅ Next.js build completes
- ✅ Deployment succeeds
