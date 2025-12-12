import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { supabase, corsHeaders } from '../utils/supabase.ts'

// Scoring utility
interface AnswerData {
  question_id: string
  selected_answer: string | null
  correct_answer: string
  marks: number
  negative_marks: number
}

function calculateScore(answers: AnswerData[]) {
  const totalQuestions = answers.length
  let answeredCount = 0
  let correctCount = 0
  let incorrectCount = 0
  let totalMarks = 0
  let negativeMarks = 0

  for (const answer of answers) {
    if (answer.selected_answer) {
      answeredCount++

      if (answer.selected_answer.toUpperCase() === answer.correct_answer.toUpperCase()) {
        correctCount++
        totalMarks += answer.marks
      } else {
        incorrectCount++
        negativeMarks += answer.negative_marks
      }
    }
  }

  const finalScore = Math.max(0, totalMarks - negativeMarks)
  // Calculate total possible marks (sum of all question marks)
  const totalPossibleMarks = answers.reduce((sum, answer) => sum + answer.marks, 0)
  // Percentage = (finalScore / totalPossibleMarks) * 100
  const percentage = totalPossibleMarks > 0 ? (finalScore / totalPossibleMarks) * 100 : 0

  return {
    total_questions: totalQuestions,
    answered_count: answeredCount,
    correct_count: correctCount,
    incorrect_count: incorrectCount,
    total_marks: totalMarks,
    negative_marks: negativeMarks,
    final_score: finalScore,
    percentage: parseFloat(percentage.toFixed(2)),
  }
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing sessionId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
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

    // Get all answers for this session
    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select('*')
      .eq('session_id', sessionId)

    if (answersError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch answers' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get questions with correct answers
    const questionIds = session.question_order
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, correct_answer, marks, negative_marks')
      .in('id', questionIds)

    if (questionsError || !questions) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch questions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create answer data for scoring
    const answerData = questionIds.map((questionId) => {
      const question = questions.find((q) => q.id === questionId)
      const answer = answers?.find((a) => a.question_id === questionId)

      return {
        question_id: questionId,
        selected_answer: answer?.selected_answer || null,
        correct_answer: question?.correct_answer || '',
        marks: question?.marks || 1,
        negative_marks: question?.negative_marks || 0.25,
      }
    })

    // Calculate score
    const scoreResult = calculateScore(answerData)

    // Update answers with correctness and marks
    for (const answerDataItem of answerData) {
      const answer = answers?.find((a) => a.question_id === answerDataItem.question_id)
      if (answer) {
        const isCorrect =
          answerDataItem.selected_answer?.toUpperCase() ===
          answerDataItem.correct_answer.toUpperCase()

        let marksObtained = 0
        if (isCorrect) {
          marksObtained = answerDataItem.marks
        } else if (answerDataItem.selected_answer) {
          marksObtained = -answerDataItem.negative_marks
        }

        await supabase
          .from('answers')
          .update({
            is_correct: isCorrect,
            marks_obtained: marksObtained,
          })
          .eq('id', answer.id)
      }
    }

    // Create result
    const { error: resultError } = await supabase.from('results').insert({
      session_id: sessionId,
      total_questions: scoreResult.total_questions,
      answered_count: scoreResult.answered_count,
      correct_count: scoreResult.correct_count,
      incorrect_count: scoreResult.incorrect_count,
      total_marks: scoreResult.total_marks,
      negative_marks: scoreResult.negative_marks,
      final_score: scoreResult.final_score,
      percentage: scoreResult.percentage,
    })

    if (resultError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create result' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark session as submitted
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        is_submitted: true,
        submitted_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, score: scoreResult }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

