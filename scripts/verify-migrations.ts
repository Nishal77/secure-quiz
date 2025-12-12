/**
 * Verify Migration Status
 * 
 * Checks which migrations have been applied and verifies database state
 * 
 * Usage:
 *   deno run --allow-net --allow-env scripts/verify-migrations.ts [project_id]
 */

const projectId = Deno.args[0] || Deno.env.get('SUPABASE_PROJECT_ID') || 'tcfgopbbhshgcvvnwjki';

console.log(`
╔══════════════════════════════════════════════════════════════╗
║         Migration Verification Script                       ║
╚══════════════════════════════════════════════════════════════╝

📋 Project ID: ${projectId}

To verify migrations, use Supabase MCP tools:

1. Check applied migrations:
   mcp_Quiz-2025-supabase_list_migrations({ project_id: "${projectId}" })

2. Check tables:
   mcp_Quiz-2025-supabase_list_tables({ project_id: "${projectId}" })

3. Verify question_set column:
   mcp_Quiz-2025-supabase_execute_sql({
     project_id: "${projectId}",
     query: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'question_set';"
   })

Expected Results:
✅ schema_migrations table exists
✅ All 7 tables created (events, questions, sessions, answers, results, tab_switches, schema_migrations)
✅ question_set column exists in questions table
✅ 3 migrations recorded in schema_migrations
`);

