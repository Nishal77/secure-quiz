-- Migration: Make USN globally unique (one-time use)
-- Description: Changes USN constraint from per-event to globally unique
-- This ensures each USN can only be used once across all events
-- Created: 2025-12-13

-- Step 1: Drop the existing unique constraint (event_id, usn)
-- First, check if the constraint exists and drop it
DO $$
BEGIN
    -- Drop the existing unique constraint if it exists
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'sessions_event_id_usn_key'
    ) THEN
        ALTER TABLE sessions DROP CONSTRAINT sessions_event_id_usn_key;
    END IF;
END $$;

-- Step 2: Add a unique constraint on USN alone (globally unique)
-- This ensures each USN can only be used once across all events
ALTER TABLE sessions 
    ADD CONSTRAINT sessions_usn_unique UNIQUE (usn);

-- Step 3: Add a comment to document the constraint
COMMENT ON CONSTRAINT sessions_usn_unique ON sessions IS 
    'Ensures each USN can only be used once globally across all events';
