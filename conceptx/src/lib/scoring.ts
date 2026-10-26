import { Question, QuestionType } from '@/types';

export interface ScoreResult {
  score: number;
  maxScore: number;
  isFullMarks: boolean;
  isPartial: boolean;
  isIncorrect: boolean;
  isUnattempted: boolean;
  feedback: string;
}

export function evaluateAttempt(
  question: Question,
  selectedOptions?: string[],
  numericalAnswer?: number
): ScoreResult {
  const marks = question.marks || 4;
  const negativeMarks = question.negativeMarks ?? -1;

  // Single Correct
  if (question.questionType === 'single_correct') {
    if (!selectedOptions || selectedOptions.length === 0) {
      return {
        score: 0,
        maxScore: marks,
        isFullMarks: false,
        isPartial: false,
        isIncorrect: false,
        isUnattempted: true,
        feedback: 'Question not attempted.',
      };
    }

    const selectedId = selectedOptions[0];
    const correctOption = question.options?.find((o) => o.isCorrect);

    if (correctOption && selectedId === correctOption.id) {
      return {
        score: marks,
        maxScore: marks,
        isFullMarks: true,
        isPartial: false,
        isIncorrect: false,
        isUnattempted: false,
        feedback: `Correct! You received full marks (+${marks}).`,
      };
    } else {
      return {
        score: negativeMarks,
        maxScore: marks,
        isFullMarks: false,
        isPartial: false,
        isIncorrect: true,
        isUnattempted: false,
        feedback: `Incorrect. Penalty applied (${negativeMarks} marks).`,
      };
    }
  }

  // Multiple Correct with JEE Advanced Partial Marking Scheme
  if (question.questionType === 'multiple_correct') {
    if (!selectedOptions || selectedOptions.length === 0) {
      return {
        score: 0,
        maxScore: marks,
        isFullMarks: false,
        isPartial: false,
        isIncorrect: false,
        isUnattempted: true,
        feedback: 'Question not attempted.',
      };
    }

    const correctOptions = question.options?.filter((o) => o.isCorrect) || [];
    const correctIds = new Set(correctOptions.map((o) => o.id));
    const selectedIds = new Set(selectedOptions);

    // Check if any selected option is incorrect
    let hasWrongOption = false;
    for (const id of selectedOptions) {
      if (!correctIds.has(id)) {
        hasWrongOption = true;
        break;
      }
    }

    if (hasWrongOption) {
      return {
        score: negativeMarks,
        maxScore: marks,
        isFullMarks: false,
        isPartial: false,
        isIncorrect: true,
        isUnattempted: false,
        feedback: `Incorrect option selected. In JEE Advanced, choosing any wrong option gives ${negativeMarks} mark.`,
      };
    }

    // All selected options are correct. How many were selected?
    const numCorrectSelected = selectedOptions.length;
    const totalCorrect = correctIds.size;

    if (numCorrectSelected === totalCorrect) {
      return {
        score: marks,
        maxScore: marks,
        isFullMarks: true,
        isPartial: false,
        isIncorrect: false,
        isUnattempted: false,
        feedback: `Excellent! All correct options identified (+${marks} marks).`,
      };
    }

    // Partial marking logic:
    let partialScore = 0;
    if (totalCorrect === 4 && numCorrectSelected === 3) {
      partialScore = 3;
    } else if (totalCorrect >= 3 && numCorrectSelected === 2) {
      partialScore = 2;
    } else if (totalCorrect >= 2 && numCorrectSelected === 1) {
      partialScore = 1;
    } else {
      partialScore = numCorrectSelected;
    }

    return {
      score: partialScore,
      maxScore: marks,
      isFullMarks: false,
      isPartial: true,
      isIncorrect: false,
      isUnattempted: false,
      feedback: `Partial credit (+${partialScore} / ${marks}). You found ${numCorrectSelected} of the ${totalCorrect} correct options without guessing wrong!`,
    };
  }

  // Integer / Numerical Answer
  if (question.questionType === 'integer_answer' || question.questionType === 'numerical') {
    if (numericalAnswer === undefined || isNaN(numericalAnswer)) {
      return {
        score: 0,
        maxScore: marks,
        isFullMarks: false,
        isPartial: false,
        isIncorrect: false,
        isUnattempted: true,
        feedback: 'No numerical answer entered.',
      };
    }

    const target = question.numericalAnswer?.value;
    const tolerance = question.numericalAnswer?.tolerance ?? 0;

    if (target !== undefined && Math.abs(numericalAnswer - target) <= tolerance) {
      return {
        score: marks,
        maxScore: marks,
        isFullMarks: true,
        isPartial: false,
        isIncorrect: false,
        isUnattempted: false,
        feedback: `Correct! The exact answer is ${target} (+${marks} marks).`,
      };
    } else {
      return {
        score: negativeMarks,
        maxScore: marks,
        isFullMarks: false,
        isPartial: false,
        isIncorrect: true,
        isUnattempted: false,
        feedback: `Incorrect. Your answer was ${numericalAnswer}. (Penalty: ${negativeMarks} marks).`,
      };
    }
  }

  return {
    score: 0,
    maxScore: marks,
    isFullMarks: false,
    isPartial: false,
    isIncorrect: false,
    isUnattempted: true,
    feedback: 'Evaluation complete.',
  };
}
