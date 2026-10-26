'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  AlertTriangle, 
  BookOpen, 
  Edit3, 
  Bot,
  Layers,
} from 'lucide-react';
import { questions, getQuestionById, getSectionForQuestion } from '@/data/questions';
import { MathText } from '@/components/math/MathRenderer';
import { evaluateAttempt, ScoreResult } from '@/lib/scoring';
import { 
  getAttemptForQuestion, 
  saveAttempt, 
  isQuestionBookmarked, 
  toggleBookmark, 
  getNoteForQuestion, 
  saveNoteForQuestion,
} from '@/lib/storage';
import { SimulationViewer } from '@/components/simulation/SimulationViewer';
import { AITutorPanel } from '@/components/tutor/AITutorPanel';
import { getSubjectBadgeClass, getQuestionTypeLabel, cn } from '@/lib/utils';

export function QuestionWorkspaceClient({ questionId }: { questionId: string }) {
  const question = getQuestionById(questionId);

  if (!question) {
    notFound();
  }

  const section = getSectionForQuestion(question.id);

  // Question navigation indexes
  const currentIndex = questions.findIndex((q) => q.id === question.id);
  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

  // Answer interaction states
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [numericalInput, setNumericalInput] = useState<string>('');
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  // Progressive hints
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [solutionRevealed, setSolutionRevealed] = useState<boolean>(false);

  // Student Note
  const [studentNote, setStudentNote] = useState<string>('');
  const [isNoteSaved, setIsNoteSaved] = useState<boolean>(false);

  // Right column tab switcher: 'simulation' | 'tutor' | 'spec'
  const [activeTab, setActiveTab] = useState<'simulation' | 'tutor' | 'spec'>('simulation');

  // Bookmark status
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Initialize and load saved state from storage
  useEffect(() => {
    setIsBookmarked(isQuestionBookmarked(question.id));
    const savedAttempt = getAttemptForQuestion(question.id);
    if (savedAttempt) {
      if (savedAttempt.selectedOptions) {
        setSelectedOptions(savedAttempt.selectedOptions);
      }
      if (savedAttempt.numericalAnswer !== undefined) {
        setNumericalInput(savedAttempt.numericalAnswer.toString());
      }
      if (savedAttempt.solutionRevealed) {
        setSolutionRevealed(true);
      }
      if (savedAttempt.hintsUsed) {
        setRevealedHints(savedAttempt.hintsUsed);
      }
      // Recompute score result
      const res = evaluateAttempt(
        question,
        savedAttempt.selectedOptions,
        savedAttempt.numericalAnswer
      );
      setScoreResult(res);
    }

    const note = getNoteForQuestion(question.id);
    if (note) {
      setStudentNote(note.content);
    }
  }, [question.id]);

  // Handle option select
  const toggleOption = (optionId: string) => {
    if (question.questionType === 'single_correct') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      );
    }
    // Clear previous feedback upon change
    setScoreResult(null);
  };

  // Submit and verify attempt
  const handleCheckAnswer = () => {
    const numVal = numericalInput.trim() !== '' ? parseFloat(numericalInput) : undefined;
    const result = evaluateAttempt(question, selectedOptions, numVal);
    setScoreResult(result);

    // Save attempt to local storage
    saveAttempt({
      id: `attempt_${Date.now()}`,
      questionId: question.id,
      selectedOptions,
      numericalAnswer: numVal,
      isCorrect: result.isFullMarks || result.isPartial,
      hintsUsed: revealedHints,
      solutionRevealed,
      attemptedAt: new Date().toISOString(),
    });
  };

  // Reveal next progressive hint
  const handleRevealNextHint = () => {
    const nextCount = Math.min(3, revealedHints + 1);
    setRevealedHints(nextCount);
    saveAttempt({
      id: `attempt_${Date.now()}`,
      questionId: question.id,
      selectedOptions,
      numericalAnswer: numericalInput ? parseFloat(numericalInput) : undefined,
      isCorrect: scoreResult?.isFullMarks || scoreResult?.isPartial,
      hintsUsed: nextCount,
      solutionRevealed,
      attemptedAt: new Date().toISOString(),
    });
  };

  // Save student note
  const handleSaveNote = () => {
    saveNoteForQuestion(question.id, studentNote);
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 2000);
  };

  // Progressive hints bank
  const hints = [
    {
      level: 1,
      title: 'Hint 1: Choice of Pivot and Governing Principle',
      content: question.id === 'phy-2026-p1-q1'
        ? 'Consider the moment of collision with the sharp step edge. An impulsive normal reaction force acts at the edge. What is the torque of this impulsive force about the edge itself?'
        : 'Identify the governing physical law or definition. Write down the expressions for the initial and final states.',
    },
    {
      level: 2,
      title: 'Hint 2: Conservation Laws vs Inelasticity',
      content: question.id === 'phy-2026-p1-q1'
        ? 'Since torque about the edge is zero, angular momentum about the edge is conserved: L_initial = L_final. But remember: the collision with the edge is inelastic, so kinetic energy is NOT conserved during the impact!'
        : 'Check whether energy or momentum is conserved. Watch out for dissipative losses or non-conservative forces.',
    },
    {
      level: 3,
      title: 'Hint 3: Key Mathematical Formulation',
      content: question.id === 'phy-2026-p1-q1'
        ? 'Initial angular momentum about edge includes both translational orbital momentum M*v_0*(R-h) and intrinsic spin I_cm*omega_0. The post-impact moment of inertia about the edge is 3/2 M R^2.'
        : 'Substitute the given numerical parameters into the simplified governing formula and solve for the unknown variable.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
          <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-[var(--foreground)]">Explore</Link>
          <span>/</span>
          <Link href={`/explore?subject=${question.subject}`} className="capitalize hover:text-[var(--foreground)]">
            {question.subject}
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-semibold">Question {question.questionNumber}</span>
        </div>

        {/* Prev / Next Question Switcher */}
        <div className="flex items-center gap-2">
          {prevQuestion && (
            <Link
              href={`/questions/${prevQuestion.id}`}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-card)] hover:bg-[var(--background-secondary)] text-xs text-[var(--foreground)] flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Q{prevQuestion.questionNumber}</span>
            </Link>
          )}

          <div className="text-xs font-mono text-[var(--foreground-muted)] px-2">
            {currentIndex + 1} of {questions.length}
          </div>

          {nextQuestion && (
            <Link
              href={`/questions/${nextQuestion.id}`}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-card)] hover:bg-[var(--background-secondary)] text-xs text-[var(--foreground)] flex items-center gap-1 transition-colors"
            >
              <span>Q{nextQuestion.questionNumber}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Bookmark Button */}
          <button
            onClick={() => {
              const res = toggleBookmark(question.id);
              setIsBookmarked(res);
            }}
            className={cn(
              'p-2 rounded-lg border border-[var(--border)] bg-[var(--background-card)] hover:bg-[var(--background-secondary)] transition-colors ml-1',
              isBookmarked ? 'text-amber-500' : 'text-[var(--foreground-muted)]'
            )}
            title={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question, Answer Submission, Hints & Full Solution (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Question Card */}
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xs space-y-5">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('px-2.5 py-0.5 rounded text-xs font-semibold uppercase', getSubjectBadgeClass(question.subject))}>
                  {question.subject}
                </span>
                <span className="text-xs font-semibold text-[var(--foreground)]">
                  Question {question.questionNumber}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--background-secondary)] text-[var(--foreground-secondary)] font-mono">
                  {getQuestionTypeLabel(question.questionType)}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono">
                  +{question.marks} / {question.negativeMarks} marks
                </span>
              </div>

              <span className="text-[10px] text-slate-500 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
                Extraction Review
              </span>
            </div>

            {section && (
              <div className="text-xs text-[var(--foreground-muted)] italic">
                {section.title} — {section.instructions}
              </div>
            )}

            {/* Question Statement with KaTeX */}
            <div className="text-base text-[var(--foreground)] leading-relaxed pt-2">
              <MathText text={question.statement} />
            </div>

            {/* Options or Numerical Input Form */}
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-secondary)]">
                {question.questionType === 'multiple_correct'
                  ? 'Select Option(s) [One or more may be correct]:'
                  : question.questionType === 'single_correct'
                    ? 'Select One Option:'
                    : 'Enter Exact Numerical / Integer Answer:'}
              </div>

              {/* Multiple Choice Options List */}
              {question.options && question.options.length > 0 && (
                <div className="space-y-2.5">
                  {question.options.map((opt) => {
                    const isSelected = selectedOptions.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleOption(opt.id)}
                        className={cn(
                          'w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer',
                          isSelected
                            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/8 text-[var(--foreground)] shadow-xs'
                            : 'border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--background-card)] text-[var(--foreground)]'
                        )}
                      >
                        <div
                          className={cn(
                            'w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-colors mt-0.5',
                            isSelected
                              ? 'bg-[var(--brand-primary)] text-white'
                              : 'border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground-secondary)]'
                          )}
                        >
                          {isSelected ? '✓' : ''}
                        </div>

                        <div className="flex-1 text-sm leading-relaxed">
                          <span className="font-semibold mr-2">{opt.label}</span>
                          <MathText text={opt.content} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Integer / Numerical Input */}
              {(question.questionType === 'integer_answer' || question.questionType === 'numerical') && (
                <div className="max-w-xs space-y-2">
                  <input
                    type="number"
                    step="any"
                    value={numericalInput}
                    onChange={(e) => {
                      setNumericalInput(e.target.value);
                      setScoreResult(null);
                    }}
                    placeholder="Enter answer (e.g. 5)"
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] font-mono text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              )}

              {/* Submit & Check Answer Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOptions.length === 0 && numericalInput.trim() === ''}
                  className="px-5 py-2.5 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-sm font-semibold disabled:opacity-50 transition-all shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check Answer</span>
                </button>

                {(selectedOptions.length > 0 || numericalInput) && (
                  <button
                    onClick={() => {
                      setSelectedOptions([]);
                      setNumericalInput('');
                      setScoreResult(null);
                    }}
                    className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  >
                    Clear selection
                  </button>
                )}
              </div>

              {/* Feedback Alert Card */}
              {scoreResult && (
                <div
                  className={cn(
                    'p-4 rounded-xl border text-sm space-y-2 mt-3 animate-in fade-in',
                    scoreResult.isFullMarks
                      ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                      : scoreResult.isPartial
                        ? 'border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                        : 'border-rose-500/40 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
                  )}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {scoreResult.isFullMarks && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    {scoreResult.isPartial && <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    {scoreResult.isIncorrect && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                    <span>
                      {scoreResult.isFullMarks
                        ? 'Full Marks Awarded (+4)'
                        : scoreResult.isPartial
                          ? `Partial Credit (+${scoreResult.score})`
                          : `Incorrect (${scoreResult.score} Mark)`}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{scoreResult.feedback}</p>
                </div>
              )}
            </div>
          </div>

          {/* Progressive Hints Section */}
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Guided Hints</h3>
                <span className="text-xs font-mono text-[var(--foreground-muted)]">
                  ({revealedHints} of 3 unlocked)
                </span>
              </div>

              {revealedHints < 3 && (
                <button
                  onClick={handleRevealNextHint}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--background-secondary)] text-xs text-[var(--foreground)] font-medium transition-colors"
                >
                  Unlock Hint {revealedHints + 1}
                </button>
              )}
            </div>

            {revealedHints === 0 ? (
              <p className="text-xs text-[var(--foreground-muted)]">
                Stuck or unsure about which principle applies? Unlock a hint for guided physical reasoning without spoiling the solution.
              </p>
            ) : (
              <div className="space-y-3 pt-1">
                {hints.slice(0, revealedHints).map((hint) => (
                  <div
                    key={hint.level}
                    className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-[var(--foreground)] space-y-1"
                  >
                    <div className="font-semibold text-amber-700 dark:text-amber-400">
                      {hint.title}
                    </div>
                    <p className="leading-relaxed text-[var(--foreground-secondary)]">{hint.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Complete Step-by-Step Solution Reveal */}
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Step-by-Step Solution & Derivations</h3>
              </div>

              <button
                onClick={() => setSolutionRevealed(!solutionRevealed)}
                className="px-3 py-1.5 rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--border)] text-xs text-[var(--foreground)] font-medium transition-colors"
              >
                {solutionRevealed ? 'Hide Solution' : 'Reveal Solution'}
              </button>
            </div>

            {solutionRevealed && question.solution && (
              <div className="space-y-5 pt-3 border-t border-[var(--border)] animate-in fade-in">
                {/* Approach Summary */}
                <div className="p-3.5 rounded-lg bg-[var(--background-secondary)] text-xs space-y-1">
                  <div className="font-semibold text-[var(--foreground)]">Approach:</div>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    {question.solution.approach}
                  </p>
                </div>

                {/* Numbered Steps */}
                <div className="space-y-4">
                  {question.solution.steps.map((st) => (
                    <div
                      key={st.id}
                      className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background)] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-[var(--foreground)]">
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[var(--brand-primary)] text-white text-[11px] flex items-center justify-center font-mono">
                            {st.stepNumber}
                          </span>
                          {st.title}
                        </span>
                        {st.conceptUsed && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--background-secondary)] text-[var(--foreground-muted)]">
                            {st.conceptUsed}
                          </span>
                        )}
                      </div>

                      <div className="text-[var(--foreground-secondary)] leading-relaxed">
                        <MathText text={st.explanation} />
                      </div>

                      {st.equation && (
                        <div className="p-2.5 bg-[var(--background-card)] border border-[var(--border)]/70 rounded text-center overflow-x-auto">
                          <MathText text={`$$${st.equation}$$`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Final Answer Banner */}
                <div className="p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/20 text-xs">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                    Verified Final Answer:
                  </div>
                  <div className="text-emerald-950 dark:text-emerald-100 font-medium">
                    {question.solution.finalAnswer}
                  </div>
                </div>

                {/* Common Pitfalls & Traps */}
                {question.solution.commonMistakes && question.solution.commonMistakes.length > 0 && (
                  <div className="p-4 rounded-lg border border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 text-xs space-y-2">
                    <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Exam Pitfalls & Common Mistakes to Avoid:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-rose-900 dark:text-rose-200">
                      {question.solution.commonMistakes.map((mistake, idx) => (
                        <li key={idx} className="leading-relaxed">{mistake}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Student Personal Study Note */}
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Your Study Notes</h3>
              </div>
              <button
                onClick={handleSaveNote}
                className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors"
              >
                {isNoteSaved ? 'Saved!' : 'Save Note'}
              </button>
            </div>
            <textarea
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              placeholder="Write personal takeaways, key formulas, or traps to remember for this question..."
              rows={3}
              className="w-full p-3 text-xs rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Right Column: Simulation, AI Tutor, and Specification Tabs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tab Navigation */}
          <div className="flex rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-1 gap-1 text-xs font-medium shadow-xs">
            <button
              onClick={() => setActiveTab('simulation')}
              className={cn(
                'flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all',
                activeTab === 'simulation'
                  ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                  : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Sim</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className={cn(
                'flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all',
                activeTab === 'tutor'
                  ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                  : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
              )}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Tutor</span>
            </button>

            <button
              onClick={() => setActiveTab('spec')}
              className={cn(
                'flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all',
                activeTab === 'spec'
                  ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                  : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Formulas</span>
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'simulation' && (
            <div className="space-y-4 animate-in fade-in">
              <SimulationViewer question={question} />
            </div>
          )}

          {activeTab === 'tutor' && (
            <div className="space-y-4 animate-in fade-in">
              <AITutorPanel question={question} />
            </div>
          )}

          {activeTab === 'spec' && (
            <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xs space-y-4 animate-in fade-in text-xs">
              <div className="font-semibold text-sm text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                Learning Specification & Governing Laws
              </div>

              {question.learningSpecification ? (
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-[var(--foreground)]">Governing Law:</span>
                    <p className="text-[var(--foreground-secondary)] mt-0.5">
                      {question.learningSpecification.governingLaw || 'First principles of mechanics and electrodynamics.'}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-[var(--foreground)]">Physical Assumptions:</span>
                    <ul className="list-disc list-inside space-y-1 text-[var(--foreground-secondary)] mt-1">
                      {question.learningSpecification.assumptions.map((asm, i) => (
                        <li key={i}>{asm}</li>
                      ))}
                    </ul>
                  </div>

                  {question.learningSpecification.keyEquations && (
                    <div>
                      <span className="font-semibold text-[var(--foreground)]">Key LaTeX Equations:</span>
                      <div className="space-y-1.5 mt-1.5">
                        {question.learningSpecification.keyEquations.map((eq, i) => (
                          <div key={i} className="p-2 bg-[var(--background-secondary)] rounded font-mono text-center">
                            <MathText text={`$$${eq}$$`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[var(--foreground-muted)]">No explicit formula specification available for this question.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
