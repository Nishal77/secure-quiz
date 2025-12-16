import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase, corsHeaders } from '../utils/supabase.ts'

// Type definitions
interface StartSessionRequest {
  usn: string
  name: string
  eventId: string
}

interface EventData {
  id: string
  duration_minutes: number
  is_active: boolean
  [key: string]: unknown
}

interface QuestionData {
  id: string
}

interface SessionData {
  id: string
  [key: string]: unknown
}

interface ExistingSessionData {
  id: string
  event_id: string
  student_name: string
  is_submitted: boolean
}

// Constants
const MAX_QUESTIONS_PER_SESSION = 15
const NOT_FOUND_ERROR_CODE = 'PGRST116'
const UNIQUE_CONSTRAINT_ERROR_CODE = '23505'
const MILLISECONDS_PER_MINUTE = 60 * 1000

// Helper functions
function createJsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function createErrorResponse(message: string, status: number = 500, details?: string): Response {
  const response: { error: string; message?: string; details?: string } = { error: message }
  if (details) {
    response.details = details
  }
  return createJsonResponse(response, status)
}

function validateRequiredFields(usn: unknown, name: unknown, eventId: unknown): string | null {
  if (!usn || !name || !eventId) {
    return 'Missing required fields: usn, name, and eventId are required'
  }
  return null
}

function normalizeUSN(usn: string): string {
  return usn.toUpperCase()
}

function normalizeName(name: string): string {
  return name.trim()
}

async function fetchActiveEvent(eventId: string): Promise<EventData | null> {
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('is_active', true)
    .single()

  if (error || !event) {
    return null
  }

  return event as EventData
}

async function checkUSNAvailability(usn: string): Promise<{
  exists: boolean
  error: string | null
}> {
  const normalizedUSN = normalizeUSN(usn)
  const { data: existingSession, error: checkError } = await supabase
    .from('sessions')
    .select('id, event_id, student_name, is_submitted')
    .eq('usn', normalizedUSN)
    .single()

  if (existingSession) {
    return { exists: true, error: null }
  }

  // If checkError exists but it's not a "not found" error, handle it
  if (checkError && checkError.code !== NOT_FOUND_ERROR_CODE) {
    console.error('USN check error:', checkError)
    return {
      exists: false,
      error: checkError.message || 'Database error occurred',
    }
  }

  return { exists: false, error: null }
}

function createUSNConflictResponse(usn: string): Response {
  const normalizedUSN = normalizeUSN(usn)
  return createErrorResponse(
    'USN already registered',
    409,
    `This USN (${normalizedUSN}) has already been used. Each USN can only be registered once.`
  )
}

async function fetchEventQuestions(eventId: string): Promise<QuestionData[] | null> {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id')
    .eq('event_id', eventId)

  if (error || !questions || questions.length === 0) {
    return null
  }

  return questions as QuestionData[]
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function selectRandomQuestions(questions: QuestionData[], maxCount: number): string[] {
  const questionIds = questions.map((q) => q.id)
  const shuffled = shuffleArray(questionIds)
  const selectedCount = Math.min(maxCount, shuffled.length)
  const selectedQuestions = shuffled.slice(0, selectedCount)

  console.log(`Selected ${selectedQuestions.length} questions out of ${questions.length} available`)

  return selectedQuestions
}

function calculateExpirationTime(startTime: Date, durationMinutes: number): Date {
  return new Date(startTime.getTime() + durationMinutes * MILLISECONDS_PER_MINUTE)
}

async function createSession(
  eventId: string,
  usn: string,
  name: string,
  questionOrder: string[],
  startTime: Date,
  expiresAt: Date
): Promise<{ session: SessionData | null; error: string | null }> {
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      event_id: eventId,
      usn: normalizeUSN(usn),
      student_name: normalizeName(name),
      question_order: questionOrder,
      started_at: startTime.toISOString(),
      expires_at: expiresAt.toISOString(),
      server_start_time: startTime.toISOString(),
      is_submitted: false,
      tab_switch_count: 0,
    })
    .select()
    .single()

  if (sessionError) {
    console.error('Session creation error:', sessionError)

    // Check if error is due to unique constraint violation (USN already exists)
    const isUniqueConstraintError =
      sessionError.code === UNIQUE_CONSTRAINT_ERROR_CODE ||
      sessionError.message?.includes('unique') ||
      sessionError.message?.includes('duplicate')

    if (isUniqueConstraintError) {
      return { session: null, error: 'USN_CONFLICT' }
    }

    return {
      session: null,
      error: sessionError.message || 'Database error occurred',
    }
  }

  return { session: session as SessionData | null, error: null }
}

// Main handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody: StartSessionRequest = await req.json()
    const { usn, name, eventId } = requestBody

    // Validate required fields
    const validationError = validateRequiredFields(usn, name, eventId)
    if (validationError) {
      return createErrorResponse(validationError, 400)
    }

    // Fetch and validate event
    const event = await fetchActiveEvent(eventId)
    if (!event) {
      return createErrorResponse('Event not found or not active', 404)
    }

    // Check USN availability
    const usnCheck = await checkUSNAvailability(usn)
    if (usnCheck.exists) {
      return createUSNConflictResponse(usn)
    }
    if (usnCheck.error) {
      return createErrorResponse('Failed to verify USN', 500, usnCheck.error)
    }

    // Fetch questions for the event
    const questions = await fetchEventQuestions(eventId)
    if (!questions) {
      return createErrorResponse('No questions found for this event', 404)
    }

    // Select random questions
    const selectedQuestions = selectRandomQuestions(questions, MAX_QUESTIONS_PER_SESSION)

    // Calculate expiration time
    const serverTime = new Date()
    const expiresAt = calculateExpirationTime(serverTime, event.duration_minutes)

    // Create session
    const { session, error: sessionError } = await createSession(
      eventId,
      usn,
      name,
      selectedQuestions,
      serverTime,
      expiresAt
    )

    if (sessionError === 'USN_CONFLICT') {
      return createUSNConflictResponse(usn)
    }
    if (sessionError) {
      return createErrorResponse('Failed to create session', 500, sessionError)
    }
    if (!session) {
      return createErrorResponse('Failed to create session - no session returned', 500)
    }

    return createJsonResponse({ sessionId: session.id }, 200)
  } catch (error) {
    console.error('Start session error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return createErrorResponse('Internal server error', 500, errorMessage)
  }
})

