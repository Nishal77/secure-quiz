import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../utils/supabase.ts'

// Type definitions
interface ServerTimeResponse {
  serverTime: string
}

interface ErrorResponse {
  error: string
}

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

function getServerTime(): string {
  return new Date().toISOString()
}

// Main handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const serverTime = getServerTime()
    return createJsonResponse({ serverTime }, 200)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return createErrorResponse(errorMessage, 500)
  }
})


