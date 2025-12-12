# Database Migration Guide

## Overview

This project uses a clean, versioned migration system to manage database schema changes. All migrations are stored in `schemas/migrations/` and are applied using Supabase MCP tools.

## Migration System

### Migration Files

Migrations are numbered sequentially:
- `0000_migration_tracking.sql` - Creates migration tracking infrastructure
- `0001_initial_schema.sql` - Creates all base tables
- `0002_add_question_set.sql` - Adds question_set column

### Migration Tracking

The `schema_migrations` table tracks all applied migrations:
- `version` - Migration version/name
- `name` - Human-readable name
- `description` - What the migration does
- `applied_at` - When it was applied
- `success` - Whether it succeeded
- `error_message` - Error details if failed

## Current Status

✅ **All migrations have been applied successfully!**

Applied migrations:
1. ✅ `migration_tracking` - Migration tracking system
2. ✅ `initial_schema` - All base tables created
3. ✅ `add_question_set` - Question set column added

## Database Schema

### Tables Created

1. **events** - Quiz events/exams
2. **questions** - Quiz questions (with question_set column)
3. **sessions** - Student quiz sessions
4. **answers** - Student answers
5. **results** - Final quiz results
6. **tab_switches** - Anti-cheat tab switch logs
7. **schema_migrations** - Migration tracking

### Key Features

- ✅ Row-Level Security (RLS) enabled on all tables
- ✅ Proper indexes for performance
- ✅ Foreign key constraints
- ✅ Triggers for `updated_at` timestamps
- ✅ Question sets (1-4) for random distribution

## Applying Migrations

### Method 1: Using Supabase MCP (Recommended)

Use the `apply_migration` tool in Cursor:

```typescript
// Example: Apply a new migration
mcp_Quiz-2025-supabase_apply_migration({
  project_id: "your-project-id",
  name: "migration_name",
  query: "-- Your SQL here"
})
```

### Method 2: Using Supabase SQL Editor

1. Go to Supabase Dashboard → SQL Editor
2. Copy the migration SQL from `schemas/migrations/`
3. Paste and execute

### Method 3: Using Supabase CLI

```bash
supabase db push
```

## Creating New Migrations

### Step 1: Create Migration File

Create a new file in `schemas/migrations/`:
- Format: `0003_descriptive_name.sql`
- Use sequential numbering

### Step 2: Write Migration SQL

```sql
-- Migration: 0003_descriptive_name
-- Description: What this migration does
-- Created: YYYY-MM-DD

-- Your SQL here
ALTER TABLE table_name ADD COLUMN new_column TYPE;
```

### Step 3: Apply Migration

Use one of the methods above to apply the migration.

### Step 4: Update Base Schema (Optional)

If this is a permanent change, also update the base schema files in `schemas/`:
- `schemas/questions.sql`
- `schemas/events.sql`
- etc.

## Verifying Migrations

### Check Applied Migrations

```sql
SELECT * FROM schema_migrations ORDER BY applied_at;
```

Or use MCP:
```typescript
mcp_Quiz-2025-supabase_list_migrations({ project_id: "..." })
```

### Check Tables

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Or use MCP:
```typescript
mcp_Quiz-2025-supabase_list_tables({ project_id: "..." })
```

## Migration Best Practices

1. **Always test migrations** on a development branch first
2. **Use IF NOT EXISTS** for idempotent migrations
3. **Add indexes** for new columns that will be queried
4. **Update RLS policies** if adding new tables
5. **Document changes** in migration comments
6. **Keep migrations small** - one logical change per migration
7. **Never modify applied migrations** - create new ones instead

## Rollback Strategy

Supabase migrations are forward-only. To rollback:

1. Create a new migration that reverses the changes
2. Or manually fix the schema using SQL Editor
3. Update the migration tracking if needed

## Troubleshooting

### Migration Failed

1. Check `schema_migrations` table for error details
2. Fix the SQL and create a new migration
3. Or manually fix the schema and mark migration as successful

### Migration Already Applied

Migrations use `IF NOT EXISTS` clauses, so re-running is safe. However, if you need to force re-apply:

1. Remove from `schema_migrations` table
2. Re-apply the migration

### Schema Drift

If your database schema doesn't match migrations:

1. Check what's different
2. Create a migration to sync
3. Or manually fix and document

## Next Steps

After migrations are applied:

1. ✅ Verify all tables exist
2. ✅ Insert questions using `scripts/insert-questions.js`
3. ✅ Create events via admin panel
4. ✅ Test the application

## Project ID

Current project: `tcfgopbbhshgcvvnwjki` (Acas)

To use a different project, set `SUPABASE_PROJECT_ID` environment variable or pass as argument to migration scripts.

