'use client'

interface NavigationProps {
  currentQuestion: number
  totalQuestions: number
  questionOrder: string[]
  onQuestionSelect: (index: number) => void
  onSubmit: () => void
}

export function Navigation({
  currentQuestion,
  totalQuestions,
  onQuestionSelect,
  onSubmit,
}: NavigationProps) {
  const isLastQuestion = currentQuestion === totalQuestions - 1
  const isFirstQuestion = currentQuestion === 0

  return (
    <div className="bg-white border-t border-gray-200 mt-6 pt-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onQuestionSelect(Math.max(0, currentQuestion - 1))}
          disabled={isFirstQuestion}
          className="flex-1 px-5 py-2.5 bg-white text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-gray-300 text-sm"
        >
          Back
        </button>
        
        {isLastQuestion ? (
          <button
            onClick={onSubmit}
            className="flex-1 px-5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => onQuestionSelect(Math.min(totalQuestions - 1, currentQuestion + 1))}
            className="flex-1 px-5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
