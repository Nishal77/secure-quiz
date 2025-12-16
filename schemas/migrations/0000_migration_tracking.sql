-- Migration: 0000_migration_tracking
-- Description: Creates migration tracking table to manage database schema versions
-- Created: 2025-01-XX

-- Migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_schema_migrations_version ON schema_migrations(version);
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON schema_migrations(applied_at);

-- Enable RLS (only admins can view)
ALTER TABLE schema_migrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view migrations"
  ON schema_migrations
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Function to check if migration exists
CREATE OR REPLACE FUNCTION migration_exists(version_name VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM schema_migrations 
    WHERE version = version_name AND success = true
  );
END;
$$ LANGUAGE plpgsql;

-- Function to record migration
CREATE OR REPLACE FUNCTION record_migration(
  version_name VARCHAR,
  migration_name VARCHAR,
  migration_description TEXT,
  exec_time_ms INTEGER,
  was_success BOOLEAN DEFAULT true,
  error_msg TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO schema_migrations (
    version, 
    name, 
    description, 
    execution_time_ms, 
    success, 
    error_message
  ) VALUES (
    version_name,
    migration_name,
    migration_description,
    exec_time_ms,
    was_success,
    error_msg
  );
END;
$$ LANGUAGE plpgsql;


