'use client';

import React, { useState } from 'react';
import { Question, TutorMessage, TutorMode } from '@/types';
import { MathText } from '@/components/math/MathRenderer';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight,
  RotateCcw,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AITutorPanelProps {
  question: Question;
  className?: string;
}

export function AITutorPanel({ question, className }: AITutorPanelProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome',
      role: 'tutor',
      content: `Hello! I am your **ConceptX AI Tutor** for ${question.subject.toUpperCase()}. 

I can help you build intuition for this problem, clarify the physical reasoning, or provide progressive hints without giving away the full answer right away.

What would you like to explore?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userQuery: string, mode: TutorMode = 'explain') => {
    if (!userQuery.trim() || isLoading) return;

    const userMsg: TutorMessage = {
      id: `user_${Date.now()}`,
      role: 'student',
      content: userQuery,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          mode,
          message: userQuery,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: TutorMessage = {
          id: `tutor_${Date.now()}`,
          role: 'tutor',
          mode,
          content: data.content,
          concept: data.concept,
          equations: data.equations,
          suggestedNextStep: data.suggestedNextStep,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('Tutor response failed');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `tutor_err_${Date.now()}`,
          role: 'tutor',
          content: 'I had trouble connecting to the tutor server. Let me know if you would like me to retry!',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (label: string, mode: TutorMode) => {
    sendMessage(label, mode);
  };

  return (
    <div className={cn('flex flex-col h-[520px] rounded-xl border border-[var(--border)] bg-[var(--background-card)] overflow-hidden shadow-sm', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--background-secondary)]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">AI Concept Tutor</h3>
            <p className="text-[10px] text-[var(--foreground-muted)]">Grounded in JEE Advanced Pedagogy</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome',
                role: 'tutor',
                content: `Chat reset. What concept would you like to explore in Question ${question.questionNumber}?`,
                timestamp: new Date().toISOString(),
              },
            ]);
          }}
          className="p-1.5 rounded hover:bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-b border-[var(--border)]/70 bg-[var(--background-secondary)]/30 flex gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => handleQuickAction('Give me a subtle hint without revealing the answer', 'hint')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[var(--background-card)] border border-[var(--border)] hover:border-[var(--brand-primary)] text-[var(--foreground-secondary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1"
        >
          <Lightbulb className="w-3 h-3 text-amber-500" /> Need a Hint
        </button>
        <button
          onClick={() => handleQuickAction('Why is kinetic energy NOT conserved during impact?', 'explain')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[var(--background-card)] border border-[var(--border)] hover:border-[var(--brand-primary)] text-[var(--foreground-secondary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-blue-500" /> Explain Inelastic Impact
        </button>
        <button
          onClick={() => handleQuickAction('What are the common traps students fall into here?', 'find_mistake')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[var(--background-card)] border border-[var(--border)] hover:border-[var(--brand-primary)] text-[var(--foreground-secondary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1"
        >
          <AlertTriangle className="w-3 h-3 text-rose-500" /> Common Pitfalls
        </button>
        <button
          onClick={() => handleQuickAction('What happens if we increase the step height?', 'change_conditions')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[var(--background-card)] border border-[var(--border)] hover:border-[var(--brand-primary)] text-[var(--foreground-secondary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3 text-purple-500" /> Vary Parameters
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'student';
          return (
            <div
              key={m.id}
              className={cn('flex gap-2.5 max-w-[88%]', isUser ? 'ml-auto flex-row-reverse' : 'mr-auto')}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs',
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-[var(--foreground)]'
                )}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={cn(
                  'p-3 rounded-2xl text-xs leading-relaxed',
                  isUser
                    ? 'bg-[var(--brand-primary)] text-white rounded-tr-none'
                    : 'bg-[var(--background-secondary)] text-[var(--foreground)] rounded-tl-none border border-[var(--border)]/60'
                )}
              >
                {isUser ? (
                  <p>{m.content}</p>
                ) : (
                  <div className="space-y-2">
                    <MathText text={m.content} />
                    {m.suggestedNextStep && (
                      <div className="pt-2 mt-2 border-t border-[var(--border)]/40 flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                        <ArrowRight className="w-3 h-3" />
                        <span>Next idea: {m.suggestedNextStep}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 mr-auto max-w-[80%] items-center text-xs text-[var(--foreground-muted)]">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 animate-bounce" />
            </div>
            <div className="p-3 rounded-2xl bg-[var(--background-secondary)] rounded-tl-none border border-[var(--border)]">
              <span className="animate-pulse">Analyzing physics principles & crafting reasoning...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--background-card)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputText);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a question or request conceptual clarification..."
            className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-3.5 py-2 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-xs font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
