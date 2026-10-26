import { describe, it, expect } from 'vitest';
import { questions, getQuestionById, getQuestionsBySubject, examinations, papers, sections } from '../src/data/questions';

describe('Question Bank Data Integrity', () => {
  it('has examination, paper, and sections registered', () => {
    expect(examinations.length).toBeGreaterThan(0);
    expect(papers.length).toBeGreaterThan(0);
    expect(sections.length).toBeGreaterThan(0);
  });

  it('contains questions for Physics, Chemistry, and Mathematics', () => {
    const physicsQ = getQuestionsBySubject('physics');
    const chemQ = getQuestionsBySubject('chemistry');
    const mathQ = getQuestionsBySubject('mathematics');

    expect(physicsQ.length).toBeGreaterThan(0);
    expect(chemQ.length).toBeGreaterThan(0);
    expect(mathQ.length).toBeGreaterThan(0);
  });

  it('ensures all multiple-choice questions have options with label and content', () => {
    for (const q of questions) {
      if (q.questionType === 'single_correct' || q.questionType === 'multiple_correct') {
        expect(q.options).toBeDefined();
        expect(q.options!.length).toBeGreaterThanOrEqual(2);
        for (const opt of q.options!) {
          expect(opt.id).toBeTruthy();
          expect(opt.label).toBeTruthy();
          expect(opt.content).toBeTruthy();
        }
      }
    }
  });

  it('ensures questions with solutions have well-formed step-by-step reasoning', () => {
    for (const q of questions) {
      if (q.solution) {
        expect(q.solution.approach).toBeTruthy();
        expect(q.solution.steps.length).toBeGreaterThan(0);
        expect(q.solution.finalAnswer).toBeTruthy();
      }
    }
  });

  it('ensures numerical questions have a valid target value', () => {
    const numericals = questions.filter(
      (q) => q.questionType === 'integer_answer' || q.questionType === 'numerical'
    );
    for (const q of numericals) {
      if (q.numericalAnswer) {
        expect(typeof q.numericalAnswer.value).toBe('number');
      }
    }
  });
});
