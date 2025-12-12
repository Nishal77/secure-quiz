'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { QUIZ_CONFIG } from '@/lib/constants'
import type { Answer } from '@/lib/supabaseClient'

interface UseAutosaveProps {
  sessionId: string
  answers: Record<string, Answer>
  enabled: boolean
}

interface UseAutosaveReturn {
  isSaving: boolean
  lastSaved: Date | null
}

export function useAutosave({ sessionId, answers, enabled }: UseAutosaveProps): UseAutosaveReturn {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<Record<string, Answer>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    if (!enabled || !sessionId) return

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Check if answers have changed
    const answersChanged = JSON.stringify(answers) !== JSON.stringify(lastSavedRef.current)

    if (answersChanged) {
      // Debounce autosave
      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true)
        try {
          // Save each changed answer
          const savePromises: Promise<void>[] = []
          
          for (const [questionId, answer] of Object.entries(answers)) {
            const lastAnswer = lastSavedRef.current[questionId]
            
            // Only save if answer changed
            if (!lastAnswer || lastAnswer.selected_answer !== answer.selected_answer) {
              savePromises.push(
                supabase.functions.invoke('save-answer', {
                  body: {
                    sessionId,
                    questionId,
                    selectedAnswer: answer.selected_answer,
                  },
                }).then(() => {
                  // Answer saved successfully
                }).catch((error) => {
                  console.error(`Failed to save answer for question ${questionId}:`, error)
                })
              )
            }
          }

          // Wait for all saves to complete
          await Promise.all(savePromises)

          lastSavedRef.current = { ...answers }
          setLastSaved(new Date())
        } catch (error) {
          console.error('Autosave error:', error)
        } finally {
          setIsSaving(false)
        }
      }, QUIZ_CONFIG.AUTO_SAVE_INTERVAL)
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [answers, sessionId, enabled])

  // Save on page unload (beforeunload)
  useEffect(() => {
    if (!enabled || !sessionId) return

    const handleBeforeUnload = async () => {
      // Save any unsaved answers before page unload
      const unsavedAnswers = Object.entries(answers).filter(([questionId, answer]) => {
        const lastAnswer = lastSavedRef.current[questionId]
        return !lastAnswer || lastAnswer.selected_answer !== answer.selected_answer
      })

      if (unsavedAnswers.length > 0) {
        // Use sendBeacon for reliable save on page unload
        for (const [questionId, answer] of unsavedAnswers) {
          const data = JSON.stringify({
            sessionId,
            questionId,
            selectedAnswer: answer.selected_answer,
          })
          
          // Note: sendBeacon doesn't work with Supabase functions directly
          // So we'll use a synchronous approach or save to localStorage as backup
          try {
            await fetch('/api/save-answer-fallback', {
              method: 'POST',
              body: data,
              headers: { 'Content-Type': 'application/json' },
              keepalive: true,
            })
          } catch (error) {
            // Fallback: Save to localStorage
            const backupKey = `quiz_answer_backup_${sessionId}_${questionId}`
            localStorage.setItem(backupKey, JSON.stringify(answer))
          }
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [answers, sessionId, enabled])

  return {
    isSaving,
    lastSaved,
  }
}
