# Backend - Supabase Edge Functions

## ✅ Setup Complete!

All functions are deployed and ready to use.

## Quick Start

### Deploy Functions

```bash
cd backend
pnpm run deploy
```

This automatically syncs and deploys all functions.

### Deploy Specific Function

```bash
pnpm run deploy:start-session
pnpm run deploy:submit
# etc.
```

## Directory Structure

```
backend/
├── functions/          # Source functions (EDIT THESE)
│   ├── start-session/
│   ├── submit/
│   ├── save-answer/
│   ├── tab-switch/
│   ├── admin-export/
│   └── server-time/
├── supabase/
│   └── functions/      # Synced functions (auto-generated)
│       ├── utils/      # Shared utilities
│       └── [functions]/
├── utils/              # Source utilities (EDIT THESE)
│   ├── supabase.ts     # Shared Supabase client
│   ├── db.ts
│   └── scoring.ts
└── .bin/               # Supabase CLI (local)
```

## Workflow

1. **Edit** functions in `backend/functions/`
2. **Deploy** using `pnpm run deploy` (auto-syncs)
3. Functions are deployed to Supabase

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm run supabase:login` | Login to Supabase |
| `pnpm run supabase:link` | Link project |
| `pnpm run sync` | Sync functions to supabase/functions |
| `pnpm run deploy` | Sync + Deploy all functions |
| `pnpm run deploy:start-session` | Deploy specific function |
| `pnpm run functions:list` | List deployed functions |
| `pnpm run functions:logs` | View function logs |
| `pnpm run setup` | Login + Link |

## Edge Functions

### 1. start-session
Creates a new quiz session for a student.

**Endpoint:** `POST /functions/v1/start-session`

**Body:**
```json
{
  "usn": "4MT24MC054",
  "name": "Student Name",
  "eventId": "event-uuid"
}
```

### 2. submit
Submits a quiz session and calculates final score.

**Endpoint:** `POST /functions/v1/submit`

**Body:**
```json
{
  "sessionId": "session-uuid"
}
```

### 3. save-answer
Auto-saves a student's answer.

**Endpoint:** `POST /functions/v1/save-answer`

**Body:**
```json
{
  "sessionId": "session-uuid",
  "questionId": "question-uuid",
  "selectedAnswer": "A"
}
```

### 4. tab-switch
Logs tab switch events for anti-cheat monitoring.

**Endpoint:** `POST /functions/v1/tab-switch`

**Body:**
```json
{
  "sessionId": "session-uuid",
  "switchType": "blur"
}
```

### 5. admin-export
Exports quiz results as CSV.

**Endpoint:** `POST /functions/v1/admin-export`

**Body:**
```json
{
  "format": "csv"
}
```

### 6. server-time
Returns current server time for timer synchronization.

**Endpoint:** `GET /functions/v1/server-time`

**Response:**
```json
{
  "serverTime": "2025-12-11T17:00:00.000Z"
}
```

## Environment Variables

Set these in Supabase Dashboard → Edge Functions → Secrets:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)

## Development

### Making Changes

1. Edit function in `backend/functions/[function-name]/index.ts`
2. Run `pnpm run deploy:[function-name]` to deploy
3. Or `pnpm run deploy` to deploy all

### Testing

View logs:
```bash
pnpm run functions:logs start-session
```

Or in Dashboard → Edge Functions → [function-name] → Logs

## Troubleshooting

### "No Functions specified or found"

Make sure functions are synced:
```bash
pnpm run sync
pnpm run deploy
```

### "Module not found"

Make sure `utils/` folder is in `supabase/functions/utils/`:
```bash
pnpm run sync
```

### Functions not updating

1. Check you're editing `backend/functions/` (not `supabase/functions/`)
2. Run `pnpm run sync` to sync changes
3. Deploy again

## Status

✅ All 6 functions deployed successfully!
✅ Sync script working
✅ Ready for production use

