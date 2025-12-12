import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase, corsHeaders } from '../utils/supabase.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { format = 'csv' } = await req.json()

    // Get all results with session data
    const { data: results, error: resultsError } = await supabase
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

    if (resultsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (format === 'csv') {
      // Generate CSV
      const headers = [
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
      ]

      const rows = (results || []).map((result: any) => {
        const session = result.sessions
        return [
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
        ]
      })

      const csv = [
        headers.join(','),
        ...rows.map((row: any[]) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n')

      return new Response(
        JSON.stringify({ csv }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Unsupported format' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

