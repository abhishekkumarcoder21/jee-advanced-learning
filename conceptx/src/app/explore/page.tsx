'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Atom, 
  FlaskConical, 
  Calculator, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  ChevronRight,
  Layers,
  Award,
  BookOpen,
  ArrowUpDown
} from 'lucide-react';
import { questions, papers } from '@/data/questions';
import { Question, Subject, QuestionType, DifficultyLevel } from '@/types';
import { MathText } from '@/components/math/MathRenderer';
import { getSubjectBadgeClass, getQuestionTypeLabel, cn } from '@/lib/utils';
import { getAttempts, getBookmarks, toggleBookmark, STORAGE_UPDATE_EVENT } from '@/lib/storage';

export default function ExplorePage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [hasSimulationOnly, setHasSimulationOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Local storage state for reactive display
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [attemptedMap, setAttemptedMap] = useState<Record<string, boolean>>({});

  const loadLocalState = () => {
    const bms = getBookmarks();
    setBookmarkedIds(new Set(bms.map((b) => b.questionId)));
    const atts = getAttempts();
    const map: Record<string, boolean> = {};
    for (const [id, a] of Object.entries(atts)) {
      map[id] = a.isCorrect || false;
    }
    setAttemptedMap(map);
  };

  useEffect(() => {
    loadLocalState();
    window.addEventListener(STORAGE_UPDATE_EVENT, loadLocalState);
    return () => window.removeEventListener(STORAGE_UPDATE_EVENT, loadLocalState);
  }, []);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
      if (selectedType !== 'all' && q.questionType !== selectedType) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (hasSimulationOnly && !q.hasSimulation) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesStatement = q.statement.toLowerCase().includes(query);
        const matchesTopics = q.topics.some((t) => t.toLowerCase().includes(query));
        const matchesSubject = q.subject.toLowerCase().includes(query);
        if (!matchesStatement && !matchesTopics && !matchesSubject) return false;
      }

      return true;
    });
  }, [selectedSubject, selectedType, selectedDifficulty, hasSimulationOnly, searchQuery]);

  // Statistics
  const totalQuestions = questions.length;
  const simQuestionsCount = questions.filter((q) => q.hasSimulation).length;
  const attemptedCount = Object.keys(attemptedMap).length;

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
          <BookOpen className="w-4 h-4" />
          <span>JEE Advanced 2026 Question Explorer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)]">
          Examination Question Bank
        </h1>
        <p className="text-sm text-[var(--foreground-secondary)] max-w-2xl">
          Explore real examination questions with step-by-step mathematical reasoning, interactive physics simulations, and AI tutoring guidance.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xs">
          <div className="text-xs text-[var(--foreground-muted)] font-medium">Total Questions</div>
          <div className="text-2xl font-bold text-[var(--foreground)] mt-1">{totalQuestions}</div>
          <div className="text-[11px] text-[var(--foreground-muted)] mt-0.5">Paper 1 Complete</div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xs">
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Simulations
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{simQuestionsCount}</div>
          <div className="text-[11px] text-[var(--foreground-muted)] mt-0.5">Physics & Mathematics</div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xs">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Verified Derivations
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalQuestions}</div>
          <div className="text-[11px] text-[var(--foreground-muted)] mt-0.5">Derived from Principles</div>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xs">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Your Solved Progress</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {attemptedCount} / {totalQuestions}
          </div>
          <div className="text-[11px] text-[var(--foreground-muted)] mt-0.5">Saved locally</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background-card)] space-y-4 shadow-sm">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by concept, topic (e.g. 'cylinder', 'capacitor', 'integral', 'equilibrium')..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          />
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Subjects', icon: BookOpen },
              { id: 'physics', label: 'Physics', icon: Atom },
              { id: 'chemistry', label: 'Chemistry', icon: FlaskConical },
              { id: 'mathematics', label: 'Mathematics', icon: Calculator },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedSubject === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSubject(tab.id as Subject | 'all')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all',
                    isSelected
                      ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                      : 'bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick toggle: Interactive simulation only */}
          <label className="flex items-center gap-2 text-xs text-[var(--foreground-secondary)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasSimulationOnly}
              onChange={(e) => setHasSimulationOnly(e.target.checked)}
              className="rounded text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
            />
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Simulations only
            </span>
          </label>
        </div>

        {/* Additional Filters: Type and Difficulty */}
        <div className="flex flex-wrap gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[var(--foreground-muted)] font-medium">Question Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as QuestionType | 'all')}
              className="px-2.5 py-1 rounded border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)]"
            >
              <option value="all">All Types</option>
              <option value="multiple_correct">Multiple Correct (+4, -1)</option>
              <option value="single_correct">Single Correct (+3, -1)</option>
              <option value="integer_answer">Integer / Numerical (+4, 0)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[var(--foreground-muted)] font-medium">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'all')}
              className="px-2.5 py-1 rounded border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)]"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {(selectedSubject !== 'all' || selectedType !== 'all' || selectedDifficulty !== 'all' || hasSimulationOnly || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSubject('all');
                setSelectedType('all');
                setSelectedDifficulty('all');
                setHasSimulationOnly(false);
                setSearchQuery('');
              }}
              className="text-xs text-[var(--brand-primary)] hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Questions Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
          <span>Showing {filteredQuestions.length} examination question{filteredQuestions.length === 1 ? '' : 's'}</span>
          <span>JEE Advanced 2026 Paper 1</span>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-[var(--border)] bg-[var(--background-card)] space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">No questions matched your filter</h3>
            <p className="text-xs text-[var(--foreground-muted)]">Try selecting &apos;All Subjects&apos; or clearing your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map((q) => {
              const isBookmarked = bookmarkedIds.has(q.id);
              const isSolved = attemptedMap[q.id];

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background-card)] hover:border-[var(--brand-primary)]/50 transition-all shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={cn('px-2.5 py-0.5 rounded text-xs font-semibold uppercase', getSubjectBadgeClass(q.subject))}>
                          {q.subject}
                        </span>
                        <span className="text-xs font-semibold text-[var(--foreground)]">
                          Question {q.questionNumber}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--background-secondary)] text-[var(--foreground-muted)] font-mono">
                          {getQuestionTypeLabel(q.questionType)}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono">
                          +{q.marks} / {q.negativeMarks} marks
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Simulation badge */}
                        {q.hasSimulation && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                            <Sparkles className="w-3 h-3" /> Interactive Simulation
                          </span>
                        )}

                        {/* Verification badge */}
                        <span className="text-[10px] text-slate-500 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
                          {q.verificationStatus === 'validated' ? 'Validated ✓' : 'Extraction Review'}
                        </span>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => {
                            toggleBookmark(q.id);
                            loadLocalState();
                          }}
                          className={cn(
                            'p-1.5 rounded hover:bg-[var(--background-secondary)] transition-colors',
                            isBookmarked ? 'text-amber-500' : 'text-[var(--foreground-muted)]'
                          )}
                          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                        >
                          <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    {/* Question Statement Preview with KaTeX */}
                    <div className="text-sm text-[var(--foreground)] line-clamp-3 leading-relaxed">
                      <MathText text={q.statement} />
                    </div>

                    {/* Topics List */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {q.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[var(--background-secondary)] text-[11px] text-[var(--foreground-secondary)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Row with Action CTA */}
                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <div>
                      {isSolved && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/questions/${q.id}`}
                      className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>Solve & Visualize</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
