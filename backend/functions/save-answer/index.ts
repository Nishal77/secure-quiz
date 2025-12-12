import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase, corsHeaders } from '../utils/supabase.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessionId, questionId, selectedAnswer } = await req.json()

    if (!sessionId || !questionId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate answer format
    if (selectedAnswer && !['A', 'B', 'C', 'D'].includes(selectedAnswer.toUpperCase())) {
      return new Response(
        JSON.stringify({ error: 'Invalid answer format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if session exists and is not submitted
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('is_submitted, expires_at')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (session.is_submitted) {
      return new Response(
        JSON.stringify({ error: 'Session already submitted' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if time has expired
    const now = new Date()
    const expiresAt = new Date(session.expires_at)
    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ error: 'Time has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Upsert answer
    const { error: answerError } = await supabase
      .from('answers')
      .upsert(
        {
          session_id: sessionId,
          question_id: questionId,
          selected_answer: selectedAnswer ? selectedAnswer.toUpperCase() : null,
        },
        {
          onConflict: 'session_id,question_id',
        }
      )

    if (answerError) {
      return new Response(
        JSON.stringify({ error: 'Failed to save answer' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

