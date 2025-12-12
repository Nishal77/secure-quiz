# Vercel Build Fix - Monorepo Configuration

## Issue
Vercel build fails with: `sh: line 1: cd: frontend: No such file or directory`

## Solution

The issue is that Vercel needs to know the root directory for the Next.js app. For monorepos, you have two options:

### Option 1: Set Root Directory in Vercel Dashboard (Recommended)

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **General**
2. Find **"Root Directory"** setting
3. Set it to: `frontend`
4. Click **"Save"**
5. The `vercel.json` will be automatically adjusted

After setting this, Vercel will:
- Run commands from the `frontend` directory
- Use `frontend/package.json` for dependencies
- Build from `frontend` directory

### Option 2: Use Current Configuration (Updated)

The `vercel.json` has been updated to use pnpm workspace commands:
```json
{
  "buildCommand": "pnpm --filter frontend build",
  "outputDirectory": "frontend/.next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

This should work, but **Option 1 is still recommended** for better Vercel integration.

## Current Configuration

The root `vercel.json` now uses:
- `buildCommand`: `pnpm --filter frontend build` (uses pnpm workspace)
- `outputDirectory`: `frontend/.next`
- `installCommand`: `pnpm install` (installs all workspace dependencies)

## Next Steps

1. **Set Root Directory in Vercel Dashboard** (Option 1 - Recommended)
   - Settings → General → Root Directory → `frontend`
   - Save and redeploy

2. **OR** try deploying with current configuration
   - The pnpm workspace command should work from root

## Verification

After fixing, the build should:
- ✅ Install dependencies successfully
- ✅ Run build command successfully
- ✅ Find output in `frontend/.next`
- ✅ Deploy successfully
