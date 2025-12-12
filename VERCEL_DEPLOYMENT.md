# Vercel Deployment Configuration

This project is configured for deployment on Vercel with proper monorepo support.

## 📁 Project Structure

```
quiz-platform/
├── frontend/          # Next.js application (deployed to Vercel)
├── backend/           # Supabase Edge Functions (deployed to Supabase)
├── vercel.json        # Vercel configuration
└── .vercelignore      # Files to exclude from deployment
```

## ⚙️ Configuration Files

### `vercel.json`
- **Root Directory**: `frontend` (monorepo support)
- **Build Command**: `cd frontend && pnpm install && pnpm build`
- **Output Directory**: `frontend/.next`
- **Framework**: Next.js (auto-detected)
- **Security Headers**: Configured for XSS protection

### `.vercelignore`
Excludes backend, scripts, and documentation from deployment (only frontend is deployed).

## 🚀 Deployment Methods

### Method 1: Using Vercel Dashboard (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Configure Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (optional)

4. **Deploy**
   - Click "Deploy"
   - Vercel will use the configuration from `vercel.json`

### Method 2: Using Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   # or
   pnpm add -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link your project** (first time only)
   ```bash
   # From project root
   vercel link
   ```
   - Follow prompts to select/create project
   - Vercel will read `vercel.json` for configuration

4. **Deploy to Preview**
   ```bash
   # From project root
   pnpm vercel:deploy
   # or
   vercel
   ```

5. **Deploy to Production**
   ```bash
   # From project root
   pnpm vercel:deploy:prod
   # or
   vercel --prod
   ```

### Method 3: Using npm/pnpm Scripts

From project root:
```bash
# Deploy to preview
pnpm vercel:deploy

# Deploy to production
pnpm vercel:deploy:prod

# Run local Vercel dev server
pnpm vercel:dev
```

## 🔧 Environment Variables

### Required Variables (Set in Vercel Dashboard)

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: `https://your-project-ref.supabase.co`
   - Where to find: Supabase Dashboard → Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your anon/public key (JWT token)
   - Where to find: Supabase Dashboard → Settings → API → anon public key

3. **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY** (Optional)
   - Value: Alternative publishable key if you have one

### How to Set Environment Variables

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Add each variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase URL
   - **Environment**: Select all (Production, Preview, Development)
4. Repeat for other variables
5. **Redeploy** after adding variables

## 📝 Build Configuration

The `vercel.json` file specifies:
- **Root Directory**: `frontend` (monorepo support)
- **Build Command**: `cd frontend && pnpm install && pnpm build`
- **Output Directory**: `frontend/.next`
- **Install Command**: `pnpm install`

Vercel will:
1. Install dependencies using `pnpm install`
2. Run build command from `frontend` directory
3. Serve the `.next` output directory

## 🔒 Security Headers

The configuration includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 🐛 Troubleshooting

### Issue: Build fails with "Cannot find module"

**Solution:**
- Ensure `pnpm-lock.yaml` is committed to git
- Check that `package.json` has all dependencies listed
- Verify build command in `vercel.json` is correct

### Issue: Environment variables not working

**Solution:**
- Verify variables are set in Vercel Dashboard
- Check variable names match exactly (case-sensitive)
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding variables

### Issue: "Root directory not found"

**Solution:**
- Verify `rootDirectory` in `vercel.json` is `frontend`
- Check that `frontend` directory exists
- Ensure `.vercelignore` isn't excluding the frontend directory

### Issue: Build takes too long

**Solution:**
- Vercel caches `node_modules` automatically
- Consider using Vercel's build cache
- Optimize dependencies in `package.json`

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub
- [ ] `vercel.json` is configured correctly
- [ ] `.vercelignore` excludes unnecessary files
- [ ] Environment variables are set in Vercel Dashboard
- [ ] Local build succeeds: `cd frontend && pnpm build`
- [ ] Test deployment in preview environment first

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Monorepo Deployment](https://vercel.com/docs/monorepos)

## 🎯 Quick Start

```bash
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Login
vercel login

# 3. Link project (first time)
vercel link

# 4. Deploy
vercel --prod
```

That's it! Your app will be live on Vercel. 🚀
