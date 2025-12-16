import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase, corsHeaders } from '../utils/supabase.ts'

// Type definitions
interface SaveAnswerRequest {
  sessionId: string
  questionId: string
  selectedAnswer?: string | null
}

interface SessionData {
  is_submitted: boolean
  expires_at: string
}

// Constants
const VALID_ANSWER_OPTIONS = ['A', 'B', 'C', 'D'] as const
const ANSWER_CONFLICT_COLUMNS = 'session_id,question_id' as const

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

function validateRequiredFields(sessionId: unknown, questionId: unknown): string | null {
  if (!sessionId || !questionId) {
    return 'Missing required fields: sessionId and questionId are required'
  }
  return null
}

function validateAnswerFormat(answer: string | null | undefined): string | null {
  if (!answer) {
    return null // null/undefined answers are allowed (for clearing answers)
  }

  const normalizedAnswer = answer.toUpperCase()
  if (!VALID_ANSWER_OPTIONS.includes(normalizedAnswer as typeof VALID_ANSWER_OPTIONS[number])) {
    return 'Invalid answer format. Must be one of: A, B, C, or D'
  }
  return null
}

function normalizeAnswer(answer: string | null | undefined): string | null {
  return answer ? answer.toUpperCase() : null
}

async function fetchSession(sessionId: string): Promise<SessionData | null> {
  const { data: session, error } = await supabase
    .from('sessions')
    .select('is_submitted, expires_at')
    .eq('id', sessionId)
    .single()

  if (error || !session) {
    return null
  }

  return session as SessionData
}

function validateSession(session: SessionData | null): string | null {
  if (!session) {
    return 'Session not found'
  }

  if (session.is_submitted) {
    return 'Session already submitted'
  }

  const now = new Date()
  const expiresAt = new Date(session.expires_at)
  if (now > expiresAt) {
    return 'Time has expired'
  }

  return null
}

async function saveAnswer(
  sessionId: string,
  questionId: string,
  selectedAnswer: string | null
): Promise<string | null> {
  const { error } = await supabase
    .from('answers')
    .upsert(
      {
        session_id: sessionId,
        question_id: questionId,
        selected_answer: selectedAnswer,
      },
      {
        onConflict: ANSWER_CONFLICT_COLUMNS,
      }
    )

  if (error) {
    return 'Failed to save answer to database'
  }

  return null
}

// Main handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody: SaveAnswerRequest = await req.json()
    const { sessionId, questionId, selectedAnswer } = requestBody

    // Validate required fields
    const requiredFieldsError = validateRequiredFields(sessionId, questionId)
    if (requiredFieldsError) {
      return createErrorResponse(requiredFieldsError, 400)
    }

    // Validate answer format
    const answerFormatError = validateAnswerFormat(selectedAnswer)
    if (answerFormatError) {
      return createErrorResponse(answerFormatError, 400)
    }

    // Fetch and validate session
    const session = await fetchSession(sessionId)
    const sessionValidationError = validateSession(session)
    if (sessionValidationError) {
      const statusCode = sessionValidationError === 'Session not found' ? 404 : 400
      return createErrorResponse(sessionValidationError, statusCode)
    }

    // Normalize and save answer
    const normalizedAnswer = normalizeAnswer(selectedAnswer)
    const saveError = await saveAnswer(sessionId, questionId, normalizedAnswer)
    if (saveError) {
      return createErrorResponse(saveError, 500)
    }

    return createJsonResponse({ success: true }, 200)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return createErrorResponse(errorMessage, 500)
  }
})

