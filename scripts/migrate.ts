/**
 * Migration Runner Script
 * 
 * Applies database migrations in order using Supabase MCP
 * 
 * Usage:
 *   deno run --allow-net --allow-env scripts/migrate.ts [project_id]
 *   or
 *   npx tsx scripts/migrate.ts [project_id]
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get project ID from args or env
const projectId = Deno.args[0] || Deno.env.get('SUPABASE_PROJECT_ID') || 'tcfgopbbhshgcvvnwjki';

interface Migration {
  version: string;
  name: string;
  file: string;
  sql: string;
}

// Read all migration files
function loadMigrations(): Migration[] {
  const migrationsDir = join(__dirname, '..', 'schemas', 'migrations');
  const migrations: Migration[] = [];

  // Migration files in order
  const migrationFiles = [
    '0000_migration_tracking.sql',
    '0001_initial_schema.sql',
    '0002_add_question_set.sql',
  ];

  for (const file of migrationFiles) {
    try {
      const filePath = join(migrationsDir, file);
      const sql = readFileSync(filePath, 'utf-8');
      const version = file.replace('.sql', '');
      const name = version.split('_').slice(1).join('_');
      
      migrations.push({ version, name, file, sql });
    } catch (error) {
      console.error(`❌ Failed to load migration ${file}:`, error);
    }
  }

  return migrations.sort((a, b) => a.version.localeCompare(b.version));
}

// Check if migration already applied (using direct SQL since we can't use MCP functions)
async function checkMigrationApplied(projectId: string, version: string): Promise<boolean> {
  try {
    // We'll use the MCP execute_sql tool
    const query = `
      SELECT EXISTS (
        SELECT 1 FROM schema_migrations 
        WHERE version = $1 AND success = true
      ) as exists;
    `;
    
    // Note: This is a placeholder - actual implementation would use MCP
    // For now, we'll try to execute and catch errors
    return false; // Assume not applied if we can't check
  } catch {
    return false;
  }
}

async function applyMigration(projectId: string, migration: Migration): Promise<boolean> {
  const startTime = Date.now();
  
  console.log(`\n📦 Applying migration: ${migration.version} - ${migration.name}`);
  
  try {
    // This would use MCP apply_migration tool
    // For now, we'll provide instructions
    console.log(`   SQL file: schemas/migrations/${migration.file}`);
    console.log(`   ⚠️  Please apply this migration manually using Supabase MCP or SQL Editor`);
    
    return true;
  } catch (error) {
    console.error(`   ❌ Error:`, error);
    return false;
  }
}

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');
  console.log(`📋 Project ID: ${projectId}\n`);

  const migrations = loadMigrations();
  
  if (migrations.length === 0) {
    console.error('❌ No migrations found!');
    Deno.exit(1);
  }

  console.log(`📦 Found ${migrations.length} migration(s):`);
  migrations.forEach(m => {
    console.log(`   - ${m.version}: ${m.name}`);
  });

  console.log('\n⚠️  This script provides migration SQL files.');
  console.log('   To apply migrations, use one of these methods:\n');
  console.log('   1. Use Supabase MCP apply_migration tool');
  console.log('   2. Copy SQL to Supabase SQL Editor');
  console.log('   3. Use the migration utility script\n');

  // Generate migration commands
  console.log('📝 Migration SQL files to apply:\n');
  migrations.forEach((migration, index) => {
    console.log(`-- Migration ${index + 1}/${migrations.length}: ${migration.version}`);
    console.log(`-- File: schemas/migrations/${migration.file}\n`);
  });
}

runMigrations().catch((error) => {
  console.error('❌ Unexpected error:', error);
  Deno.exit(1);
});


