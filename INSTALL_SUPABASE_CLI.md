# Install Supabase CLI - Correct Method

## ❌ Problem
Supabase CLI **does not support** npm/pnpm global installation anymore.

Error: `Installing Supabase CLI as a global module is not supported.`

## ✅ Solution: Use Homebrew (Recommended for macOS)

### Step 1: Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Supabase CLI

```bash
brew install supabase/tap/supabase
```

### Step 3: Verify Installation

```bash
supabase --version
```

Should show: `supabase x.x.x`

## Alternative: Direct Install Script

If you don't want to use Homebrew:

```bash
# Download and install
curl -fsSL https://supabase.com/install.sh | sh
```

Then add to PATH (if needed):
```bash
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Quick Setup After Installation

```bash
# 1. Login
supabase login

# 2. Link project
cd backend
supabase link --project-ref tcfgopbbhshgcvvnwjki

# 3. Set secrets in Dashboard (see SETUP_SECRETS.md)

# 4. Deploy
supabase functions deploy
```

## Why Not npm/pnpm?

Supabase CLI requires native binaries and system-level dependencies that npm/pnpm global installs don't handle well. Homebrew or the install script are the recommended methods.

