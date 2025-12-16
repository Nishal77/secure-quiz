import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase, corsHeaders } from '../utils/supabase.ts'

// Type definitions
interface SessionData {
  usn: string
  student_name: string
  tab_switch_count: number
  started_at: string
  submitted_at: string
}

interface ResultData {
  total_questions: number
  answered_count: number
  correct_count: number
  incorrect_count: number
  total_marks: number
  negative_marks: number
  final_score: number
  percentage: number
  sessions: SessionData | null
}

interface ExportRequest {
  format?: 'csv' | string
}

// Constants
const CSV_HEADERS = [
  'USN',
  'Name',
  'Total Questions',
  'Answered',
  'Correct',
  'Incorrect',
  'Total Marks',
  'Negative Marks',
  'Final Score',
  'Percentage',
  'Tab Switches',
  'Started At',
  'Submitted At',
] as const

const EXPORT_FORMAT = {
  CSV: 'csv',
} as const

// Helper functions
function createJsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function createErrorResponse(message: string, status: number = 500): Response {
  return createJsonResponse({ error: message }, status)
}

function escapeCsvCell(cell: unknown): string {
  return `"${String(cell)}"`
}

function formatCsvRow(row: unknown[]): string {
  return row.map(escapeCsvCell).join(',')
}

function generateCsv(results: ResultData[]): string {
  const headerRow = CSV_HEADERS.join(',')
  const dataRows = results.map((result) => {
    const session = result.sessions
    return formatCsvRow([
      session?.usn || '',
      session?.student_name || '',
      result.total_questions,
      result.answered_count,
      result.correct_count,
      result.incorrect_count,
      result.total_marks,
      result.negative_marks,
      result.final_score,
      result.percentage,
      session?.tab_switch_count || 0,
      session?.started_at || '',
      session?.submitted_at || '',
    ])
  })

  return [headerRow, ...dataRows].join('\n')
}

async function fetchResultsWithSessions() {
  const { data: results, error } = await supabase
    .from('results')
    .select(`
      *,
      sessions (
        usn,
        student_name,
        tab_switch_count,
        started_at,
        submitted_at
      )
    `)
    .order('calculated_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch results from database')
  }

  return results as ResultData[] | null
}

// Main handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody: ExportRequest = await req.json()
    const exportFormat = requestBody.format || EXPORT_FORMAT.CSV

    // Fetch results with session data
    const results = await fetchResultsWithSessions()

    if (!results || results.length === 0) {
      return createJsonResponse({ csv: CSV_HEADERS.join(',') }, 200)
    }

    // Generate export based on format
    if (exportFormat === EXPORT_FORMAT.CSV) {
      const csvContent = generateCsv(results)
      return createJsonResponse({ csv: csvContent }, 200)
    }

    return createErrorResponse('Unsupported export format', 400)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return createErrorResponse(errorMessage, 500)
  }
})

