# Fix pnpm Global Installation Issue

## Problem
```
WARN  Failed to create bin at /Users/nishalpoojary/Library/pnpm/supabase. 
ENOENT: no such file or directory
```

This happens when pnpm's global bin directory doesn't exist or isn't in PATH.

## Solution 1: Fix pnpm Global Directory (Recommended)

### Step 1: Create the directory
```bash
mkdir -p ~/Library/pnpm
```

### Step 2: Set pnpm global bin directory
```bash
pnpm config set global-bin-dir ~/Library/pnpm
```

### Step 3: Add to PATH (if not already)
Add this to your `~/.zshrc`:
```bash
export PATH="$HOME/Library/pnpm:$PATH"
```

Then reload:
```bash
source ~/.zshrc
```

### Step 4: Install Supabase CLI again
```bash
pnpm add -g supabase
```

### Step 5: Verify
```bash
which supabase
supabase --version
```

## Solution 2: Use npm Instead (Quick Fix)

If pnpm continues to have issues, use npm:

```bash
npm install -g supabase
```

Then verify:
```bash
which supabase
supabase --version
```

## Solution 3: Use Homebrew (macOS - Most Reliable)

```bash
brew install supabase/tap/supabase
```

This is the most reliable method on macOS.

## Solution 4: Manual Fix for pnpm

If you want to stick with pnpm:

```bash
# 1. Create directories
mkdir -p ~/Library/pnpm/global/5

# 2. Set config
pnpm config set global-bin-dir ~/Library/pnpm
pnpm config set global-dir ~/Library/pnpm/global

# 3. Install
pnpm add -g supabase

# 4. Add to PATH
echo 'export PATH="$HOME/Library/pnpm:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 5. Verify
supabase --version
```

## Quick Test

After installation, test:
```bash
supabase --version
```

Should show: `supabase x.x.x` (version number)

## Next Steps After Installation

1. **Login:**
   ```bash
   supabase login
   ```

2. **Link project:**
   ```bash
   cd backend
   supabase link --project-ref tcfgopbbhshgcvvnwjki
   ```

3. **Set secrets in Dashboard** (you have the page open):
   - Add `SUPABASE_URL` = `https://tcfgopbbhshgcvvnwjki.supabase.co`
   - Add `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API)

4. **Deploy:**
   ```bash
   supabase functions deploy
   ```

## Recommended: Use Homebrew

For macOS, Homebrew is the most reliable:

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Supabase CLI
brew install supabase/tap/supabase

# Verify
supabase --version
```

This avoids all pnpm global path issues!

