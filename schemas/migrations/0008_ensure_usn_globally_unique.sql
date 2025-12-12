-- Migration: Ensure USN is globally unique (one-time use)
-- Description: Ensures USN can only be used once across all events
-- This migration is idempotent and can be run multiple times safely
-- Created: 2025-12-13

-- Step 1: Drop any existing unique constraints on (event_id, usn) combination
-- Handle different possible constraint names
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find and drop any unique constraint that includes both event_id and usn
    FOR constraint_name IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'sessions'::regclass
        AND contype = 'u'
        AND (
            conname LIKE '%event_id%usn%' OR
            conname LIKE '%usn%event_id%' OR
            conname = 'sessions_event_id_usn_key'
        )
    LOOP
        EXECUTE format('ALTER TABLE sessions DROP CONSTRAINT IF EXISTS %I', constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- Step 2: Drop existing USN unique constraint if it exists (to recreate it cleanly)
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_usn_unique;

-- Step 3: Check for duplicate USNs before adding constraint
-- If duplicates exist, this will fail - admin must clean up first
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT usn, COUNT(*) as cnt
        FROM sessions
        GROUP BY usn
        HAVING COUNT(*) > 1
    ) duplicates;
    
    IF duplicate_count > 0 THEN
        RAISE EXCEPTION 'Cannot add unique constraint: Found % duplicate USN(s). Please remove duplicates first.', duplicate_count;
    END IF;
END $$;

-- Step 4: Add unique constraint on USN (globally unique)
-- This ensures each USN can only be used once across all events
ALTER TABLE sessions 
    ADD CONSTRAINT sessions_usn_unique UNIQUE (usn);

-- Step 5: Create index for better query performance (if not exists)
CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_usn_unique ON sessions(usn);

-- Step 6: Add comment to document the constraint
COMMENT ON CONSTRAINT sessions_usn_unique ON sessions IS 
    'Ensures each USN can only be used once globally across all events. Once a USN is registered, it cannot be used again.';

-- Step 7: Verify the constraint was created successfully
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conrelid = 'sessions'::regclass
        AND conname = 'sessions_usn_unique'
        AND contype = 'u'
    ) THEN
        RAISE EXCEPTION 'Failed to create unique constraint on USN';
    END IF;
    
    RAISE NOTICE 'Successfully created unique constraint on USN column';
END $$;
