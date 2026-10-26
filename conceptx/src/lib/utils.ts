import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSubjectColor(subject: string): string {
  switch (subject) {
    case 'physics': return '#3b82f6';
    case 'chemistry': return '#10b981';
    case 'mathematics': return '#8b5cf6';
    default: return '#64748b';
  }
}

export function getSubjectBadgeClass(subject: string): string {
  switch (subject) {
    case 'physics': return 'badge-physics';
    case 'chemistry': return 'badge-chemistry';
    case 'mathematics': return 'badge-mathematics';
    default: return '';
  }
}

export function getSubjectIcon(subject: string): string {
  switch (subject) {
    case 'physics': return '⚡';
    case 'chemistry': return '🧪';
    case 'mathematics': return '📐';
    default: return '📚';
  }
}

export function formatQuestionNumber(num: number): string {
  return `Q${num}`;
}

export function getVerificationLabel(status: string): string {
  switch (status) {
    case 'validated': return 'Verified';
    case 'published': return 'Published';
    case 'draft': return 'Draft';
    case 'extraction_review': return 'Under Review';
    case 'solution_review': return 'Solution Review';
    case 'simulation_review': return 'Simulation Review';
    default: return 'Unverified';
  }
}

export function getQuestionTypeLabel(type: string): string {
  switch (type) {
    case 'single_correct': return 'Single Correct';
    case 'multiple_correct': return 'Multiple Correct';
    case 'numerical': return 'Numerical';
    case 'integer_answer': return 'Integer Answer';
    case 'matching_list': return 'Matching List';
    case 'paragraph_based': return 'Paragraph Based';
    default: return type;
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '#10b981';
    case 'medium': return '#f59e0b';
    case 'hard': return '#ef4444';
    case 'advanced': return '#7c3aed';
    default: return '#64748b';
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
