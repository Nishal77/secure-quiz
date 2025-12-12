'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useQuizTimer, clearQuizTimer } from '@/hooks/useQuizTimer'
import { useAutosave } from '@/hooks/useAutosave'
import { initTabSwitchDetection, getTabSwitchCount, isEliminatedUser } from '@/lib/antiCheat'
import { QUIZ_CONFIG } from '@/lib/constants'
import { Timer } from './components/Timer'
import { QuestionCard } from './components/QuestionCard'
import { Navigation } from './components/Navigation'
import type { Question, Session, Answer } from '@/lib/supabaseClient'

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [timeUp, setTimeUp] = useState(false)
  const [warningCount, setWarningCount] = useState(0)
  const [isEliminated, setIsEliminated] = useState(false)

  // Load session and questions
  useEffect(() => {
    if (!sessionId) return

    async function loadQuiz() {
      try {
        // Load session
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
          .single()

        if (sessionError) {
          console.error('Session error:', sessionError)
          console.error('Error details:', {
            message: sessionError.message,
            details: sessionError.details,
            hint: sessionError.hint,
            code: sessionError.code
          })
          setError(`Session not found: ${sessionError.message}. Please check browser console for details.`)
          setLoading(false)
          return
        }

        if (!sessionData) {
          console.error('No session data returned for ID:', sessionId)
          setError('Session not found. Please check the session ID.')
          setLoading(false)
          return
        }

        console.log('Session loaded successfully:', {
          id: sessionData.id,
          usn: sessionData.usn,
          student_name: sessionData.student_name,
          question_order_type: typeof sessionData.question_order,
          question_order_length: Array.isArray(sessionData.question_order) 
            ? sessionData.question_order.length 
            : 'not an array'
        })

        if (sessionData.is_submitted) {
          router.push(`/quiz/${sessionId}/result`)
          return
        }

        setSession(sessionData)

        // Load questions in the order stored in session
        // Handle both array and string formats (PostgreSQL arrays can be serialized as strings)
        let questionIds: string[] = []
        if (Array.isArray(sessionData.question_order)) {
          questionIds = sessionData.question_order
        } else if (typeof sessionData.question_order === 'string') {
          try {
            // Try to parse as JSON array
            questionIds = JSON.parse(sessionData.question_order)
          } catch {
            // If not JSON, might be PostgreSQL array format like "{uuid1,uuid2}"
            const cleaned = sessionData.question_order.replace(/[{}"]/g, '')
            questionIds = cleaned.split(',').filter(id => id.trim())
          }
        }
        
        console.log('Session data:', sessionData)
        console.log('Question IDs:', questionIds)
        
        if (!questionIds || questionIds.length === 0) {
          console.error('No question IDs found in session:', sessionData)
          setError('No questions found for this session. Please contact administrator.')
          setLoading(false)
          return
        }

        console.log('Fetching questions with IDs:', questionIds)
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .in('id', questionIds)

        if (questionsError) {
          console.error('Questions error:', questionsError)
          console.error('Error details:', {
            message: questionsError.message,
            details: questionsError.details,
            hint: questionsError.hint,
            code: questionsError.code
          })
          setError(`Failed to load questions: ${questionsError.message}. Please check browser console for details.`)
          setLoading(false)
          return
        }

        console.log('Questions loaded:', questionsData?.length || 0)

        if (!questionsData || questionsData.length === 0) {
          console.error('No questions returned from database. Question IDs requested:', questionIds)
          setError('No questions found in database. Please contact administrator.')
          setLoading(false)
          return
        }

        // Sort questions according to question_order
        const sortedQuestions = questionIds
          .map((id) => questionsData.find((q) => q.id === id))
          .filter((q): q is Question => q !== undefined)

        if (sortedQuestions.length === 0) {
          setError('Failed to match questions with session order')
          setLoading(false)
          return
        }

        setQuestions(sortedQuestions)

        // Load existing answers
        const { data: answersData } = await supabase
          .from('answers')
          .select('*')
          .eq('session_id', sessionId)

        if (answersData) {
          const answersMap: Record<string, Answer> = {}
          answersData.forEach((answer) => {
            answersMap[answer.question_id] = {
              session_id: answer.session_id,
              question_id: answer.question_id,
              selected_answer: answer.selected_answer,
            }
          })
          setAnswers(answersMap)
        }

        // Initialize comprehensive anti-cheat system
        initTabSwitchDetection(
          sessionId,
          (warningNumber) => {
            // Show warning
            setWarningCount(warningNumber)
            // Warning will be shown via modal
          },
          () => {
            // Handle elimination
            setIsEliminated(true)
            // Immediately start submission process
            setSubmitting(true)
            // Small delay to show elimination message, then submit quickly
            setTimeout(() => {
              handleSubmit(true)
            }, 800) // Reduced to 0.8 seconds for quick submission
          }
        )

        setLoading(false)
      } catch (err) {
        console.error('Load quiz error:', err)
        setError('Failed to load quiz')
        setLoading(false)
      }
    }

    loadQuiz()
  }, [sessionId, router])

  // Handle submit
  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!session || session.is_submitted) return

    // Check tab switch limit
    const tabSwitches = getTabSwitchCount()
    if (tabSwitches > QUIZ_CONFIG.MAX_TAB_SWITCHES && !autoSubmit) {
      alert(`You have exceeded the maximum allowed tab switches (${QUIZ_CONFIG.MAX_TAB_SWITCHES}). Your quiz will be submitted automatically.`)
    }

    setSubmitting(true)

    try {
      const { data, error: submitError } = await supabase.functions.invoke('submit', {
        body: {
          sessionId,
        },
      })

      if (submitError) {
        setError('Failed to submit quiz. Please try again.')
        setSubmitting(false)
        return
      }

      // Clear timer storage on successful submit
      clearQuizTimer(sessionId)

      // Redirect to results page
      router.push(`/quiz/${sessionId}/result`)
    } catch (err) {
      console.error('Submit error:', err)
      setError('An error occurred while submitting. Please try again.')
      setSubmitting(false)
    }
  }, [session, sessionId, router])

  // Timer - 15 minutes countdown
  const handleTimerExpire = useCallback(async () => {
    setTimeUp(true)
    
    // Wait a moment to ensure any pending autosaves complete
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Auto-submit on expiry
    handleSubmit(true)
  }, [handleSubmit])

  const { timeRemaining, isExpired } = useQuizTimer({
    sessionId,
    onExpire: handleTimerExpire,
  })

  // Autosave with visual feedback - continue saving even when time is up
  const { isSaving, lastSaved } = useAutosave({
    sessionId,
    answers,
    enabled: !submitting && !!session && !session.is_submitted,
  })

  // Handle answer selection - disabled when time is up or eliminated
  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (!session || session.is_submitted || isExpired || timeUp || isEliminated) return

    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        session_id: sessionId,
        question_id: currentQuestion.id,
        selected_answer: answer,
      },
    }))
  }

  // Disable navigation when time is up or eliminated
  const handleQuestionSelect = (index: number) => {
    if (timeUp || isExpired || isEliminated) return
    setCurrentQuestionIndex(index)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!session || questions.length === 0) {
    return null
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestion?.id]?.selected_answer || null

  return (
    <div className="min-h-screen bg-white pb-24" data-quiz-content>
      <Timer timeRemaining={timeRemaining} isExpired={isExpired} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-medium text-gray-900 mb-1">Quiz</h1>
            <p className="text-sm text-gray-600">
              {session.student_name} ({session.usn})
            </p>
          </div>
          
          {/* Autosave Status Indicator */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {isSaving ? (
              <>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Saved</span>
              </>
            ) : null}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Warning Modal */}
        {warningCount > 0 && !isEliminated && !timeUp && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg p-6 sm:p-8 text-center max-w-md w-full border border-gray-200">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Warning {warningCount}</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
                Tab switching detected. You have <span className="font-medium text-gray-900">{3 - warningCount} warning{3 - warningCount !== 1 ? 's' : ''}</span> remaining.
              </p>
              <p className="text-sm sm:text-base text-gray-700 mb-6 font-medium">
                Further tab switches will result in elimination.
              </p>
              <button
                onClick={() => setWarningCount(0)}
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors w-full sm:w-auto min-w-[140px]"
              >
                I Understand
              </button>
            </div>
          </div>
        )}

        {/* Disable interaction when time is up or eliminated */}
        <div className={timeUp || isExpired || isEliminated ? 'pointer-events-none opacity-60' : ''}>
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={currentAnswer}
            onAnswerSelect={handleAnswerSelect}
          />

          <Navigation
            currentQuestion={currentQuestionIndex}
            totalQuestions={questions.length}
            answers={answers}
            questionOrder={session.question_order}
            onQuestionSelect={handleQuestionSelect}
            onSubmit={() => handleSubmit(false)}
          />
        </div>

        {/* Elimination Message */}
        {isEliminated && !submitting && (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-50 px-4">
            <div className="bg-white border border-red-300 rounded-lg p-6 sm:p-8 text-center max-w-lg w-full shadow-sm">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-3 sm:mb-4">You Are Eliminated</h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed px-2">
                You exceeded the allowed number of tab switches. To keep the quiz fair for everyone, this attempt has been closed. Please stay on the quiz screen next time — you'll do great!
              </p>
            </div>
          </div>
        )}

        {/* Submitting Overlay - shown during submission after elimination */}
        {isEliminated && submitting && (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-700 text-lg font-medium">Submitting quiz...</p>
            </div>
          </div>
        )}

        {/* Time Up Message */}
        {timeUp && !submitting && !isEliminated && (
          <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
            <div className="bg-white border-2 border-red-300 rounded-lg p-8 text-center max-w-md mx-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Time's Up!</h2>
              <p className="text-gray-700 mb-4">
                Your quiz time has expired. Your responses are being automatically submitted.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span>Submitting your responses...</span>
              </div>
            </div>
          </div>
        )}

        {/* Submitting Overlay */}
        {submitting && (
          <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-700 text-lg font-medium">Submitting quiz...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

