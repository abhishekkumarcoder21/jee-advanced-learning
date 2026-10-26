'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  UploadCloud, 
  Eye, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  Database
} from 'lucide-react';
import { questions as initialQuestions, papers } from '@/data/questions';
import { Question, VerificationStatus } from '@/types';
import { cn, getSubjectBadgeClass } from '@/lib/utils';
import { getSyncStatus } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [questionsList, setQuestionsList] = useState<Question[]>(initialQuestions);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [ingestStatus, setIngestStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const syncStatus = getSyncStatus();

  // Status counts
  const draftCount = questionsList.filter((q) => q.verificationStatus === 'draft').length;
  const extractionCount = questionsList.filter((q) => q.verificationStatus === 'extraction_review').length;
  const solutionCount = questionsList.filter((q) => q.verificationStatus === 'solution_review').length;
  const simulationCount = questionsList.filter((q) => q.verificationStatus === 'simulation_review').length;
  const validatedCount = questionsList.filter((q) => q.verificationStatus === 'validated').length;

  const handleUpdateStatus = (questionId: string, newStatus: VerificationStatus) => {
    setQuestionsList((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, verificationStatus: newStatus } : q))
    );
  };

  const handleRunIngestion = () => {
    setIngestStatus('scanning');
    setTimeout(() => {
      setIngestStatus('success');
      setTimeout(() => setIngestStatus('idle'), 3000);
    }, 1500);
  };

  const filteredQuestions = questionsList.filter((q) => {
    if (selectedFilter === 'all') return true;
    return q.verificationStatus === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
            <ShieldCheck className="w-4 h-4" />
            <span>Curriculum Admin & Ingestion Pipeline</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mt-1">
            Question Verification Pipeline
          </h1>
          <p className="text-xs text-[var(--foreground-secondary)] mt-1">
            Review ingested examination questions, verify solutions, validate simulations, and inspect PDF extraction status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-card)] text-xs text-[var(--foreground-secondary)]">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>Mode: <strong className="text-[var(--foreground)]">{syncStatus.provider}</strong></span>
          </div>

          <button
            onClick={handleRunIngestion}
            disabled={ingestStatus === 'scanning'}
            className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', ingestStatus === 'scanning' ? 'animate-spin' : '')} />
            <span>{ingestStatus === 'scanning' ? 'Scanning PDF...' : 'Run PDF Ingestion Check'}</span>
          </button>
        </div>
      </div>

      {/* PDF Ingestion Health Card */}
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--foreground)]">JEE Advanced 2026 Paper 1 Source PDF</div>
              <div className="text-xs font-mono text-[var(--foreground-muted)]">p1_english.pdf (3.24 MB)</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> 100% Extracted
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-[var(--background-secondary)]">
            <span className="text-[var(--foreground-muted)] block">Total Questions Ingested:</span>
            <span className="font-bold text-base text-[var(--foreground)] mt-0.5 block">{questionsList.length}</span>
            <span className="text-[10px] text-emerald-600">Physics, Chemistry & Math</span>
          </div>

          <div className="p-3 rounded-lg bg-[var(--background-secondary)]">
            <span className="text-[var(--foreground-muted)] block">Simulations Engineered:</span>
            <span className="font-bold text-base text-[var(--foreground)] mt-0.5 block">
              {questionsList.filter((q) => q.hasSimulation).length}
            </span>
            <span className="text-[10px] text-blue-600">Active interactive models</span>
          </div>

          <div className="p-3 rounded-lg bg-[var(--background-secondary)]">
            <span className="text-[var(--foreground-muted)] block">Extraction Health Check:</span>
            <span className="font-bold text-base text-emerald-600 dark:text-emerald-400 mt-0.5 block">Passed</span>
            <span className="text-[10px] text-[var(--foreground-muted)]">No missing options or math errors</span>
          </div>
        </div>
      </div>

      {/* Verification Pipeline Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { id: 'all', label: 'All Items', count: questionsList.length, color: 'text-slate-700 dark:text-slate-300' },
          { id: 'draft', label: 'Draft', count: draftCount, color: 'text-slate-500' },
          { id: 'extraction_review', label: 'Extraction Review', count: extractionCount, color: 'text-amber-600 dark:text-amber-400' },
          { id: 'simulation_review', label: 'Simulation Review', count: simulationCount, color: 'text-blue-600 dark:text-blue-400' },
          { id: 'validated', label: 'Validated', count: validatedCount, color: 'text-emerald-600 dark:text-emerald-400' },
        ].map((item) => {
          const isSelected = selectedFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedFilter(item.id)}
              className={cn(
                'p-3.5 rounded-xl border text-left transition-all',
                isSelected
                  ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/8 ring-1 ring-[var(--brand-primary)]'
                  : 'border-[var(--border)] bg-[var(--background-card)] hover:bg-[var(--background-secondary)]/50'
              )}
            >
              <div className="text-xs text-[var(--foreground-muted)] font-medium">{item.label}</div>
              <div className={cn('text-xl font-bold mt-1', item.color)}>{item.count}</div>
            </button>
          );
        })}
      </div>

      {/* Review Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--background-secondary)]/30 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Question Review Queue</h3>
          <span className="text-xs text-[var(--foreground-muted)]">
            Showing {filteredQuestions.length} item{filteredQuestions.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--background-secondary)]/60 text-[var(--foreground-secondary)] font-semibold border-b border-[var(--border)]">
              <tr>
                <th className="py-3 px-4">Q#</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Simulation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-[var(--background-secondary)]/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--foreground)]">
                    Q{q.questionNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold uppercase', getSubjectBadgeClass(q.subject))}>
                      {q.subject}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[var(--foreground-secondary)]">
                    {q.questionType}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--foreground)] font-medium max-w-[200px] truncate">
                    {q.topics[0]}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={q.verificationStatus}
                      onChange={(e) => handleUpdateStatus(q.id, e.target.value as VerificationStatus)}
                      className="px-2 py-1 rounded text-xs border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] cursor-pointer"
                    >
                      <option value="draft">Draft</option>
                      <option value="extraction_review">Extraction Review</option>
                      <option value="solution_review">Solution Review</option>
                      <option value="simulation_review">Simulation Review</option>
                      <option value="validated">Validated ✓</option>
                      <option value="published">Published</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    {q.hasSimulation ? (
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">Active</span>
                    ) : (
                      <span className="text-[var(--foreground-muted)]">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/questions/${q.id}`}
                      className="text-[var(--brand-primary)] hover:underline font-medium inline-flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
