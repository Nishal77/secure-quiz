import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase, corsHeaders } from '../utils/supabase.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessionId, switchType } = await req.json()

    if (!sessionId || !switchType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate switch type
    if (!['blur', 'focus', 'visibilitychange'].includes(switchType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid switch type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if session exists
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('is_submitted')
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

    // Log tab switch
    const { error: logError } = await supabase.from('tab_switches').insert({
      session_id: sessionId,
      switch_type: switchType,
    })

    if (logError) {
      return new Response(
        JSON.stringify({ error: 'Failed to log tab switch' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Increment tab switch count in session
    // Use atomic update to avoid race conditions
    const { data: currentSession, error: fetchError } = await supabase
      .from('sessions')
      .select('tab_switch_count')
      .eq('id', sessionId)
      .single()

    if (!fetchError && currentSession) {
      const newCount = (currentSession.tab_switch_count || 0) + 1
      const { error: updateError } = await supabase
        .from('sessions')
        .update({ tab_switch_count: newCount })
        .eq('id', sessionId)

      if (updateError) {
        console.error('Failed to update tab switch count:', updateError)
        // Don't fail the request, just log the error
      }
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

