import { describe, it, expect } from 'vitest';
import { evaluateAttempt } from '../src/lib/scoring';
import { Question } from '../src/types';

describe('JEE Advanced Scoring Engine', () => {
  const mockMultipleCorrectQuestion: Question = {
    id: 'mock-mcq-1',
    sectionId: 'sec-1',
    paperId: 'paper-1',
    subject: 'physics',
    questionNumber: 1,
    questionType: 'multiple_correct',
    statement: 'Which options are correct?',
    options: [
      { id: 'opt-a', label: '(A)', content: 'Option A', isCorrect: true },
      { id: 'opt-b', label: '(B)', content: 'Option B', isCorrect: true },
      { id: 'opt-c', label: '(C)', content: 'Option C', isCorrect: false },
      { id: 'opt-d', label: '(D)', content: 'Option D', isCorrect: false },
    ],
    marks: 4,
    negativeMarks: -1,
    partialMarking: true,
    topics: ['Mechanics'],
    assets: [],
    verificationStatus: 'validated',
    hasVisualization: false,
    hasSimulation: false,
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  };

  it('awards full marks (+4) when all correct options are selected and none incorrect', () => {
    const res = evaluateAttempt(mockMultipleCorrectQuestion, ['opt-a', 'opt-b']);
    expect(res.score).toBe(4);
    expect(res.isFullMarks).toBe(true);
    expect(res.isPartial).toBe(false);
    expect(res.isIncorrect).toBe(false);
  });

  it('awards partial credit (+1) when only one of two correct options is chosen without wrong guesses', () => {
    const res = evaluateAttempt(mockMultipleCorrectQuestion, ['opt-a']);
    expect(res.score).toBe(1);
    expect(res.isFullMarks).toBe(false);
    expect(res.isPartial).toBe(true);
    expect(res.isIncorrect).toBe(false);
  });

  it('penalizes (-1) if any incorrect option is selected, even alongside correct ones', () => {
    const res = evaluateAttempt(mockMultipleCorrectQuestion, ['opt-a', 'opt-c']);
    expect(res.score).toBe(-1);
    expect(res.isIncorrect).toBe(true);
    expect(res.isFullMarks).toBe(false);
  });

  it('returns 0 marks when question is unattempted', () => {
    const res = evaluateAttempt(mockMultipleCorrectQuestion, []);
    expect(res.score).toBe(0);
    expect(res.isUnattempted).toBe(true);
  });

  it('evaluates single correct questions properly', () => {
    const mockSingleQuestion: Question = {
      id: 'mock-single-1',
      sectionId: 'sec-2',
      paperId: 'paper-1',
      subject: 'chemistry',
      questionNumber: 2,
      questionType: 'single_correct',
      statement: 'Single choice question',
      options: [
        { id: 's-a', label: '(A)', content: 'Option A', isCorrect: true },
        { id: 's-b', label: '(B)', content: 'Option B', isCorrect: false },
      ],
      marks: 3,
      negativeMarks: -1,
      partialMarking: false,
      topics: ['Physical Chemistry'],
      assets: [],
      verificationStatus: 'validated',
      hasVisualization: false,
      hasSimulation: false,
      createdAt: '2026-10-26',
      updatedAt: '2026-10-26',
    };

    const correctRes = evaluateAttempt(mockSingleQuestion, ['s-a']);
    expect(correctRes.score).toBe(3);
    expect(correctRes.isFullMarks).toBe(true);

    const wrongRes = evaluateAttempt(mockSingleQuestion, ['s-b']);
    expect(wrongRes.score).toBe(-1);
    expect(wrongRes.isIncorrect).toBe(true);
  });

  it('evaluates numerical/integer answer questions correctly', () => {
    const mockNumericalQuestion: Question = {
      id: 'mock-num-1',
      sectionId: 'sec-3',
      paperId: 'paper-1',
      subject: 'mathematics',
      questionNumber: 3,
      questionType: 'integer_answer',
      statement: 'Evaluate the integral',
      numericalAnswer: { value: 5, tolerance: 0 },
      marks: 4,
      negativeMarks: 0,
      partialMarking: false,
      topics: ['Calculus'],
      assets: [],
      verificationStatus: 'validated',
      hasVisualization: false,
      hasSimulation: false,
      createdAt: '2026-10-26',
      updatedAt: '2026-10-26',
    };

    const correctRes = evaluateAttempt(mockNumericalQuestion, undefined, 5);
    expect(correctRes.score).toBe(4);
    expect(correctRes.isFullMarks).toBe(true);

    const wrongRes = evaluateAttempt(mockNumericalQuestion, undefined, 4);
    expect(wrongRes.score).toBe(0);
    expect(wrongRes.isIncorrect).toBe(true);
  });
});
