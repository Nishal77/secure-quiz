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

  const handleOptionClick = (optionKey: 'A' | 'B' | 'C' | 'D', e?: React.MouseEvent | React.ChangeEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onAnswerSelect(optionKey)
  }

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
        {options.map((option) => {
          const isSelected = selectedAnswer === option.key
          const hasSelection = selectedAnswer !== null
          
          return (
            <label
              key={option.key}
              htmlFor={`option-${question.id}-${option.key}`}
              className={`w-full flex items-start gap-3 p-3.5 rounded-md border cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : hasSelection
                  ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
                  : 'border-gray-300'
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleOptionClick(option.key, e)
              }}
            >
              <input
                type="radio"
                id={`option-${question.id}-${option.key}`}
                name={`question-${question.id}`}
                value={option.key}
                checked={isSelected}
                readOnly
                onChange={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleOptionClick(option.key, e)
                }}
                className="sr-only"
              />
              <div className="flex items-start gap-3 flex-1">
                {/* Google Forms style radio button */}
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                      isSelected
                        ? 'border-blue-600 bg-white'
                        : 'border-gray-500 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <span className={`text-sm leading-relaxed ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {option.text}
                  </span>
                </div>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}

