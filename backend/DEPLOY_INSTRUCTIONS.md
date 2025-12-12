# Deploy Edge Functions - Correct Commands

## ⚠️ Important: Use Correct Commands

The scripts have been renamed to avoid conflicts with pnpm's built-in commands.

## Step-by-Step Deployment

### Step 1: Login to Supabase

```bash
cd backend
pnpm run supabase:login
```

**OR use the binary directly:**
```bash
./.bin/supabase login
```

This will open your browser to authenticate.

### Step 2: Link Your Project

```bash
pnpm run supabase:link
```

**OR:**
```bash
./.bin/supabase link --project-ref tcfgopbbhshgcvvnwjki
```

### Step 3: Set Secrets in Dashboard

**Go to:** Supabase Dashboard → Edge Functions → Secrets

Add:
- `SUPABASE_URL` = `https://tcfgopbbhshgcvvnwjki.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API)

### Step 4: Deploy Functions

```bash
pnpm run deploy
```

**OR:**
```bash
./.bin/supabase functions deploy
```

### Step 5: Deploy Specific Function

```bash
pnpm run deploy:start-session
pnpm run deploy:submit
# etc.
```

## Quick Setup (All in One)

```bash
cd backend
pnpm run setup        # Login + Link
pnpm run deploy       # Deploy all functions
```

## Available Commands

| Command | What It Does |
|---------|--------------|
| `pnpm run supabase:login` | Login to Supabase |
| `pnpm run supabase:link` | Link project |
| `pnpm run deploy` | Deploy all functions |
| `pnpm run deploy:start-session` | Deploy specific function |
| `pnpm run functions:list` | List deployed functions |
| `pnpm run functions:logs` | View function logs |
| `pnpm run setup` | Login + Link in one command |

## Direct Binary Usage

You can also use the binary directly:

```bash
./.bin/supabase login
./.bin/supabase link --project-ref tcfgopbbhshgcvvnwjki
./.bin/supabase functions deploy
```

## Troubleshooting

### "command not found: supabase"

The CLI is in `backend/.bin/supabase`. Use:
```bash
./.bin/supabase --version
```

### "No project was selected for deployment"

This means pnpm is intercepting the command. Use:
```bash
pnpm run deploy
```

### "Not logged in"

Run:
```bash
pnpm run supabase:login
```

### "Project not linked"

Run:
```bash
pnpm run supabase:link
```

## Why "run" is needed

pnpm has built-in commands like `login`, `link`, and `deploy` that conflict with our scripts. Using `pnpm run <script>` ensures our custom scripts are executed.

## Alternative: Use Binary Directly

If scripts don't work, use the binary directly:

```bash
cd backend

# Login
./.bin/supabase login

# Link
./.bin/supabase link --project-ref tcfgopbbhshgcvvnwjki

# Deploy
./.bin/supabase functions deploy
```

