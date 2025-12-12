# Secure Online Quiz Platform

A robust, event-based online quiz platform designed for 140+ concurrent students with anti-cheat features, server-verified timing, and comprehensive admin controls.

## Features

### Student Features
- **Simple Login**: USN and Name only (no passwords)
- **Randomized Questions**: Each student gets a unique set of 20 randomized questions
- **Server-Verified Timer**: Countdown timer synced with server time
- **Auto-save**: Answers are automatically saved as you navigate
- **Question Navigation**: Easy navigation between questions with progress tracking

### Security Features
- **Tab Switch Detection**: Monitors and logs tab switches
- **Server-Side Validation**: All timing and scoring validated on the server
- **Session Locking**: Question order locked once session is created
- **Anti-Cheat Monitoring**: Tracks suspicious behavior

### Admin Features
- **Live Session Monitoring**: Real-time view of all active sessions
- **Results Dashboard**: View and analyze all quiz results
- **Event Management**: Create events and upload question sets
- **Data Export**: Export results to CSV
- **Tab Switch Tracking**: Monitor cheating attempts

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** + **shadcn/ui**
- **Zustand** (state management)
- **Supabase JS Client**

### Backend
- **Supabase Edge Functions** (Deno/TypeScript)
- **Supabase Postgres** (Database)
- **Row-Level Security** (RLS)

### Hosting
- **Vercel** (Frontend)
- **Supabase** (Backend + Database)

## Project Structure

```
project-root/
├── frontend/              # Next.js application
│   ├── app/
│   │   ├── (public)/      # Login page
│   │   ├── quiz/          # Quiz pages
│   │   ├── admin/         # Admin dashboard
│   │   └── api/           # API routes
│   ├── hooks/             # React hooks
│   └── lib/               # Utilities
│
├── backend/
│   └── functions/         # Supabase Edge Functions
│       ├── start-session/
│       ├── submit/
│       ├── save-answer/
│       ├── tab-switch/
│       ├── admin-export/
│       └── server-time/
│
└── schemas/               # Database schemas
    ├── events.sql
    ├── questions.sql
    ├── sessions.sql
    ├── answers.sql
    ├── results.sql
    └── tab_switches.sql
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm (package manager)
- Supabase account
- Vercel account (for frontend deployment)

### Install pnpm
```bash
npm install -g pnpm
# or
brew install pnpm
```

### 1. Database Setup

1. Create a new Supabase project
2. Run the SQL schemas in order:
   ```sql
   -- Run these in Supabase SQL Editor
   \i schemas/events.sql
   \i schemas/questions.sql
   \i schemas/sessions.sql
   \i schemas/answers.sql
   \i schemas/results.sql
   \i schemas/tab_switches.sql
   ```

3. Set up Row-Level Security policies (included in schema files)

### 2. Environment Variables

Create `.env.local` in the `frontend` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For Edge Functions, set these in Supabase Dashboard → Settings → Edge Functions:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Frontend Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# or from frontend directory:
cd frontend
pnpm install
pnpm dev
```

The app will be available at **http://localhost:3000**

### 4. Backend Setup (Edge Functions)

Deploy each function to Supabase:

```bash
cd backend
supabase functions deploy start-session
supabase functions deploy submit
supabase functions deploy save-answer
supabase functions deploy tab-switch
supabase functions deploy admin-export
supabase functions deploy server-time
```

Or deploy all at once:
```bash
supabase functions deploy
```

### 5. Initial Configuration

1. Access the admin dashboard at `/admin`
2. Create a new event
3. Upload questions via CSV (format: `question,option_a,option_b,option_c,option_d,correct_answer,marks,negative_marks`)
4. Activate the event

## Usage

### For Students
1. Navigate to the login page
2. Enter USN and Name
3. Start the quiz (session is created automatically)
4. Answer questions (auto-saved)
5. Submit when done or wait for timer expiry

### For Admins
1. **Create Event**: Go to `/admin/events` → Create Event → Upload questions CSV
2. **Monitor Sessions**: Go to `/admin/sessions` to see live sessions
3. **View Results**: Go to `/admin/results` to see all results and export data

## Question CSV Format

```csv
question,option_a,option_b,option_c,option_d,correct_answer,marks,negative_marks
What is 2+2?,3,4,5,6,B,1,0.25
What is the capital of France?,London,Paris,Berlin,Madrid,B,1,0.25
```

## Security Considerations

1. **Row-Level Security**: All tables have RLS enabled
2. **Server-Side Validation**: All critical operations happen on the server
3. **Time Verification**: Timer uses server time, not client time
4. **Session Locking**: Question order cannot change after session creation
5. **Tab Switch Monitoring**: All tab switches are logged and counted

## Configuration

Edit `lib/constants.ts` to adjust:
- `MAX_TAB_SWITCHES`: Maximum allowed tab switches (default: 5)
- `AUTO_SAVE_INTERVAL`: Auto-save frequency (default: 2000ms)
- `SERVER_TIME_SYNC_INTERVAL`: Server time sync frequency (default: 30000ms)

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Supabase)
Edge functions are automatically deployed when you push to Supabase.

## License

MIT

## Support

For issues and questions, please open an issue on the repository.

