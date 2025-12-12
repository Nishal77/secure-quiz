'use client'

import type { Question } from '@/lib/supabaseClient'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null
  onAnswerSelect: (answer: 'A' | 'B' | 'C' | 'D') => void
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
}: QuestionCardProps) {
  const options = [
    { key: 'A' as const, text: question.option_a },
    { key: 'B' as const, text: question.option_b },
    { key: 'C' as const, text: question.option_c },
    { key: 'D' as const, text: question.option_d },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 mb-6">
      <div className="mb-4">
        <span className="text-xs font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-5 leading-relaxed">
        {question.question_text}
      </h2>

      <div className="space-y-2.5">
        {options.map((option) => (
          <label
            key={option.key}
            className={`w-full flex items-start gap-3 p-3.5 rounded-md border cursor-pointer transition-all ${
              selectedAnswer === option.key
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.key}
              checked={selectedAnswer === option.key}
              onChange={() => onAnswerSelect(option.key)}
              className="sr-only"
            />
            <div className="flex items-start gap-3 flex-1">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  selectedAnswer === option.key
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-gray-400 bg-white'
                }`}
              >
                {selectedAnswer === option.key && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${selectedAnswer === option.key ? 'text-indigo-900 font-medium' : 'text-gray-700'}`}>
                  {option.text}
                </span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

