# Quick Deploy Guide - Fixed Commands

## ⚠️ The Problem

pnpm has built-in commands that conflict with our scripts. Use `pnpm run <script>` or the binary directly.

## ✅ Correct Commands

### Option 1: Use pnpm run (Recommended)

```bash
cd backend

# Login to Supabase
pnpm run supabase:login

# Link project
pnpm run supabase:link

# Deploy all functions
pnpm run deploy
```

### Option 2: Use Binary Directly (Easiest)

```bash
cd backend

# Login
./.bin/supabase login

# Link
./.bin/supabase link --project-ref tcfgopbbhshgcvvnwjki

# Deploy
./.bin/supabase functions deploy
```

## All-in-One Setup

```bash
cd backend

# Setup (login + link)
pnpm run setup

# Deploy
pnpm run deploy
```

## What Went Wrong

- ❌ `pnpm login` → This is pnpm's npm registry login, not Supabase
- ❌ `pnpm link` → This is pnpm's package linking, not Supabase
- ❌ `pnpm deploy` → pnpm thinks this is a deployment command

## ✅ Correct Way

- ✅ `pnpm run supabase:login` → Our Supabase login script
- ✅ `pnpm run supabase:link` → Our Supabase link script  
- ✅ `pnpm run deploy` → Our deploy script
- ✅ OR use `./.bin/supabase` directly

## Quick Reference

```bash
# From backend directory:

# Method 1: npm scripts (use 'run')
pnpm run supabase:login
pnpm run supabase:link
pnpm run deploy

# Method 2: Binary directly (no 'run' needed)
./.bin/supabase login
./.bin/supabase link --project-ref tcfgopbbhshgcvvnwjki
./.bin/supabase functions deploy
```

## Verify CLI Works

```bash
cd backend
./.bin/supabase --version
# Should show: 2.65.5
```

If this works, you're good to go! 🚀

