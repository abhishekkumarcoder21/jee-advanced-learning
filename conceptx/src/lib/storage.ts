'use client';

import { StudentAttempt, Bookmark, StudentNote } from '@/types';

const STORAGE_KEYS = {
  ATTEMPTS: 'conceptx_student_attempts',
  BOOKMARKS: 'conceptx_student_bookmarks',
  NOTES: 'conceptx_student_notes',
};

// Custom event name for cross-component reactivity
export const STORAGE_UPDATE_EVENT = 'conceptx_storage_updated';

function triggerUpdate(detail: { type: string; id?: string }) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_UPDATE_EVENT, { detail }));
  }
}

// ---------------- Attempts ----------------

export function getAttempts(): Record<string, StudentAttempt> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load attempts from storage', e);
    return {};
  }
}

export function getAttemptForQuestion(questionId: string): StudentAttempt | undefined {
  const attempts = getAttempts();
  return attempts[questionId];
}

export function saveAttempt(attempt: StudentAttempt): void {
  if (typeof window === 'undefined') return;
  try {
    const attempts = getAttempts();
    attempts[attempt.questionId] = attempt;
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    triggerUpdate({ type: 'attempt', id: attempt.questionId });
  } catch (e) {
    console.error('Failed to save attempt', e);
  }
}

// ---------------- Bookmarks ----------------

export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load bookmarks', e);
    return [];
  }
}

export function isQuestionBookmarked(questionId: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.questionId === questionId);
}

export function toggleBookmark(questionId: string, note?: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const bookmarks = getBookmarks();
    const existingIndex = bookmarks.findIndex((b) => b.questionId === questionId);
    let bookmarked = false;

    if (existingIndex >= 0) {
      bookmarks.splice(existingIndex, 1);
      bookmarked = false;
    } else {
      bookmarks.push({
        id: `bm_${Date.now()}_${questionId}`,
        userId: 'local_user',
        questionId,
        note,
        createdAt: new Date().toISOString(),
      });
      bookmarked = true;
    }

    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    triggerUpdate({ type: 'bookmark', id: questionId });
    return bookmarked;
  } catch (e) {
    console.error('Failed to toggle bookmark', e);
    return false;
  }
}

// ---------------- Notes ----------------

export function getNotes(): Record<string, StudentNote> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load notes', e);
    return {};
  }
}

export function getNoteForQuestion(questionId: string): StudentNote | undefined {
  const notes = getNotes();
  return notes[questionId];
}

export function saveNoteForQuestion(questionId: string, content: string): void {
  if (typeof window === 'undefined') return;
  try {
    const notes = getNotes();
    const existing = notes[questionId];
    notes[questionId] = {
      id: existing ? existing.id : `note_${Date.now()}_${questionId}`,
      userId: 'local_user',
      questionId,
      content,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    triggerUpdate({ type: 'note', id: questionId });
  } catch (e) {
    console.error('Failed to save note', e);
  }
}
