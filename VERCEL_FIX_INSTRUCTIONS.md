# Vercel Build Fix - Critical Instructions

## ⚠️ The Problem

Vercel is trying to run `cd frontend && pnpm install && pnpm build` but the `frontend` directory doesn't exist in the build context because Vercel needs to know the **Root Directory**.

## ✅ Solution: Set Root Directory in Vercel Dashboard

**This is the ONLY way to fix this issue properly for a monorepo.**

### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `secure-quiz-frontend` (or your project name)

2. **Navigate to Settings**
   - Click on **"Settings"** tab
   - Go to **"General"** section

3. **Set Root Directory**
   - Scroll down to **"Root Directory"** section
   - Click **"Edit"** or **"Override"**
   - Enter: `frontend`
   - Click **"Save"**

4. **Update Build Settings (if needed)**
   - In the same Settings → General page
   - Check **"Build and Output Settings"**
   - Ensure:
     - **Framework Preset**: Next.js
     - **Build Command**: `pnpm build` (or leave empty for auto-detection)
     - **Output Directory**: `.next` (or leave empty for auto-detection)
     - **Install Command**: `pnpm install` (or leave empty for auto-detection)

5. **Redeploy**
   - Go to **"Deployments"** tab
   - Click **"Redeploy"** on the latest deployment
   - Or push a new commit to trigger a new deployment

## Why This Works

When you set Root Directory to `frontend`:
- Vercel changes to the `frontend` directory before running any commands
- All commands run from `frontend/` directory
- `pnpm build` will work because it's running from the correct location
- No need for `cd frontend` in build commands

## Alternative: If You Can't Access Dashboard

If you can't set Root Directory in Dashboard, you need to:

1. **Move vercel.json to frontend directory**
   ```bash
   mv vercel.json frontend/vercel.json
   ```

2. **Update frontend/vercel.json**:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

3. **Delete root vercel.json** (or keep it minimal)

4. **Set Root Directory in Dashboard to `frontend`** (still required!)

## Current Configuration

The root `vercel.json` is configured for monorepo, but **Root Directory MUST be set in Dashboard** for it to work.

## Verification

After setting Root Directory:
- ✅ Build should find `frontend` directory
- ✅ `pnpm build` should run successfully
- ✅ Output should be in `frontend/.next`
- ✅ Deployment should succeed

## Important Notes

- **Root Directory setting in Dashboard is REQUIRED** for monorepo deployments
- The `vercel.json` file alone is not enough
- Vercel Dashboard settings override `vercel.json` in some cases
- Always set Root Directory when deploying a subdirectory of a monorepo
