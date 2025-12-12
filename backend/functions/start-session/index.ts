import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase, corsHeaders } from '../utils/supabase.ts'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { usn, name, eventId } = await req.json()

    if (!usn || !name || !eventId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('is_active', true)
      .single()

    if (eventError || !event) {
      return new Response(
        JSON.stringify({ error: 'Event not found or not active' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if USN has already been used (globally unique constraint)
    // USN can only be used once across all events
    const { data: existingSession, error: checkError } = await supabase
      .from('sessions')
      .select('id, event_id, student_name, is_submitted')
      .eq('usn', usn.toUpperCase())
      .single()

    if (existingSession) {
      // USN already exists - return error with clear message
      return new Response(
        JSON.stringify({ 
          error: 'USN already registered',
          message: `This USN (${usn.toUpperCase()}) has already been used. Each USN can only be registered once.`
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If checkError exists but it's not a "not found" error, handle it
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('USN check error:', checkError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to verify USN',
          details: checkError.message || 'Database error occurred'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all questions for the event
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id')
      .eq('event_id', eventId)

    if (questionsError || !questions || questions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No questions found for this event' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Randomize question order using Fisher-Yates shuffle algorithm
    const questionIds = questions.map((q) => q.id)
    
    // Fisher-Yates shuffle for proper randomization
    const shuffled = [...questionIds]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Select 15 unique questions randomly (or all available if less than 15)
    // Questions are guaranteed to be unique since we're selecting from unique question IDs
    const selectedQuestions = shuffled.slice(0, Math.min(15, shuffled.length))
    
    // Log for debugging (optional)
    console.log(`Selected ${selectedQuestions.length} questions out of ${questions.length} available`)

    // Calculate expiration time
    const serverTime = new Date()
    const expiresAt = new Date(serverTime.getTime() + event.duration_minutes * 60 * 1000)

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        event_id: eventId,
        usn: usn.toUpperCase(),
        student_name: name.trim(),
        question_order: selectedQuestions,
        started_at: serverTime.toISOString(),
        expires_at: expiresAt.toISOString(),
        server_start_time: serverTime.toISOString(),
        is_submitted: false,
        tab_switch_count: 0,
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      
      // Check if error is due to unique constraint violation (USN already exists)
      if (sessionError.code === '23505' || sessionError.message?.includes('unique') || sessionError.message?.includes('duplicate')) {
        return new Response(
          JSON.stringify({ 
            error: 'USN already registered',
            message: `This USN (${usn.toUpperCase()}) has already been used. Each USN can only be registered once.`
          }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create session',
          details: sessionError.message || 'Database error occurred'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Failed to create session - no session returned' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Start session error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

