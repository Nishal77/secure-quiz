// Scoring utilities
export interface AnswerData {
  question_id: string
  selected_answer: string | null
  correct_answer: string
  marks: number
  negative_marks: number
}

export interface ScoreResult {
  total_questions: number
  answered_count: number
  correct_count: number
  incorrect_count: number
  total_marks: number
  negative_marks: number
  final_score: number
  percentage: number
}

/**
 * Calculate quiz score with negative marking
 */
export function calculateScore(answers: AnswerData[]): ScoreResult {
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
  const percentage = totalQuestions > 0 ? (finalScore / totalMarks) * 100 : 0

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

