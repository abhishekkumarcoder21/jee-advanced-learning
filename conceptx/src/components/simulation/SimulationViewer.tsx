'use client';

import React from 'react';
import { Question } from '@/types';
import { RollingCylinderSimulation } from './RollingCylinderSimulation';
import { CapacitorSimulation } from './CapacitorSimulation';
import { SpringMassSimulation } from './SpringMassSimulation';
import { CubicCalculusSimulation } from './CubicCalculusSimulation';
import { Sparkles, Eye } from 'lucide-react';

interface SimulationViewerProps {
  question: Question;
  className?: string;
}

export function SimulationViewer({ question, className }: SimulationViewerProps) {
  // Select simulation based on question ID or topic
  if (question.id === 'phy-2026-p1-q1') {
    return <RollingCylinderSimulation className={className} />;
  }

  if (question.id === 'phy-2026-p1-q2') {
    return <CapacitorSimulation />;
  }

  if (question.id === 'phy-2026-p1-q3') {
    return <SpringMassSimulation />;
  }

  if (question.id === 'math-2026-p1-q1') {
    return <CubicCalculusSimulation />;
  }

  // Fallback conceptual diagram preview for questions without a custom simulation yet
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
        <Sparkles className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[var(--foreground)]">Conceptual Diagram & Models</h4>
        <p className="text-xs text-[var(--foreground-muted)] max-w-sm mx-auto mt-1">
          Review the step-by-step mathematical reasoning or ask the AI Tutor for custom visualizations and parameter changes.
        </p>
      </div>
      {question.learningSpecification?.keyEquations && (
        <div className="p-3 bg-[var(--background-secondary)] rounded-lg text-left text-xs font-mono">
          <div className="text-[10px] text-[var(--foreground-muted)] mb-1">Key Governing Equations:</div>
          <ul className="list-disc list-inside space-y-1 text-[var(--foreground-secondary)]">
            {question.learningSpecification.keyEquations.map((eq, i) => (
              <li key={i}>{eq}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
