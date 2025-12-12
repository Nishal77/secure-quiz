# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "No active quiz event found"

**Symptoms:**
- Error message: "No active quiz event found. Please contact administrator."
- User cannot start a quiz

**Solutions:**

1. **Create an Event:**
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO events (name, description, duration_minutes, is_active)
   VALUES ('Your Quiz Name', 'Description', 30, true);
   ```

2. **Or use Admin Panel:**
   - Go to http://localhost:3000/admin/events
   - Click "Create Event"
   - Fill in details and activate it

3. **Verify Event is Active:**
   ```sql
   SELECT id, name, is_active FROM events WHERE is_active = true;
   ```

### Issue 2: USN and Name Not Storing in Database

**Symptoms:**
- Form submits but session is not created
- No data appears in sessions table

**Solutions:**

1. **Check Edge Function is Deployed:**
   ```bash
   cd backend
   supabase functions deploy start-session
   ```

2. **Check Edge Function Environment Variables:**
   - Go to Supabase Dashboard → Settings → Edge Functions
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

3. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

4. **Verify RLS Policies:**
   - Events table should allow anonymous users to view active events
   - Sessions table should allow inserts (via Edge Function with service role)

5. **Check Questions Exist:**
   ```sql
   -- Verify questions exist for the event
   SELECT COUNT(*) FROM questions WHERE event_id = 'your-event-id';
   ```
   - If no questions, add questions first (see scripts/insert-questions.js)

### Issue 3: RLS Policy Errors

**Symptoms:**
- "new row violates row-level security policy"
- Cannot read/write data

**Solutions:**

1. **Fix Events RLS Policy:**
   ```sql
   -- Allow anonymous users to view active events
   DROP POLICY IF EXISTS "Anyone can view active events" ON events;
   CREATE POLICY "Anyone can view active events"
     ON events FOR SELECT
     USING (is_active = true);
   ```

2. **Verify Sessions RLS:**
   - Sessions are created via Edge Function (service role), so RLS should allow inserts
   - Check policy allows service role inserts

### Issue 4: Edge Function Not Working

**Symptoms:**
- "Failed to start quiz session"
- Network errors in browser console

**Solutions:**

1. **Check Function Deployment:**
   ```bash
   supabase functions list
   ```

2. **Check Function Logs:**
   - Go to Supabase Dashboard → Edge Functions → start-session → Logs
   - Look for error messages

3. **Test Function Manually:**
   ```bash
   # In Supabase Dashboard → Edge Functions → start-session
   # Use "Invoke" button with test payload:
   {
     "usn": "TEST123",
     "name": "Test User",
     "eventId": "your-event-id"
   }
   ```

4. **Verify Environment Variables:**
   - `SUPABASE_URL` must be set
   - `SUPABASE_SERVICE_ROLE_KEY` must be set

### Issue 5: User Page Not Loading

**Symptoms:**
- Redirects to quiz page but shows error
- Cannot load questions

**Solutions:**

1. **Check Session Exists:**
   ```sql
   SELECT * FROM sessions WHERE id = 'session-id';
   ```

2. **Check Questions Load:**
   ```sql
   -- Verify questions exist for session's event
   SELECT q.* FROM questions q
   JOIN sessions s ON q.event_id = s.event_id
   WHERE s.id = 'session-id';
   ```

3. **Check Browser Console:**
   - Look for specific error messages
   - Check Network tab for failed API calls

### Issue 6: Questions Not Showing

**Symptoms:**
- Quiz page loads but no questions appear
- Empty question list

**Solutions:**

1. **Add Questions to Event:**
   ```bash
   # Use the question insertion script
   node scripts/insert-questions.js
   # Make sure EVENT_ID in .env matches your event
   ```

2. **Verify Questions Linked to Event:**
   ```sql
   SELECT COUNT(*) FROM questions WHERE event_id = 'your-event-id';
   ```

### Quick Diagnostic Queries

Run these in Supabase SQL Editor to diagnose issues:

```sql
-- 1. Check if events exist and are active
SELECT id, name, is_active, duration_minutes 
FROM events 
ORDER BY created_at DESC;

-- 2. Check if questions exist for events
SELECT e.name, COUNT(q.id) as question_count
FROM events e
LEFT JOIN questions q ON q.event_id = e.id
GROUP BY e.id, e.name;

-- 3. Check recent sessions
SELECT id, usn, student_name, event_id, created_at
FROM sessions
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('events', 'sessions', 'questions');
```

## Step-by-Step Debugging

1. **Check Database:**
   - ✅ Events exist and `is_active = true`
   - ✅ Questions exist for the event
   - ✅ RLS policies allow access

2. **Check Frontend:**
   - ✅ Environment variables set correctly
   - ✅ Supabase client initialized
   - ✅ No console errors

3. **Check Backend:**
   - ✅ Edge Functions deployed
   - ✅ Environment variables set
   - ✅ Function logs show no errors

4. **Test Flow:**
   - ✅ Can query active events
   - ✅ Can invoke start-session function
   - ✅ Session created in database
   - ✅ Can load quiz page

## Getting Help

If issues persist:

1. Check browser console for errors
2. Check Supabase Dashboard → Edge Functions → Logs
3. Check Supabase Dashboard → Database → Logs
4. Verify all environment variables
5. Review RLS policies in Supabase Dashboard

