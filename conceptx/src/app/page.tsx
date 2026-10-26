'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Atom,
  FlaskConical,
  Calculator,
  ArrowRight,
  Eye,
  Brain,
  Lightbulb,
  Target,
  Sparkles,
  Play,
  ChevronRight,
  BookOpen,
  Layers,
  Zap,
} from 'lucide-react';
import { questions, papers } from '@/data/questions';
import { getSubjectBadgeClass, getQuestionTypeLabel } from '@/lib/utils';
import { MathText } from '@/components/math/MathRenderer';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const subjects = [
  {
    name: 'Physics',
    slug: 'physics',
    icon: Atom,
    color: '#3b82f6',
    bg: 'var(--physics-bg)',
    description: 'Mechanics, Electrodynamics, Optics, Thermodynamics, Modern Physics',
    questionCount: questions.filter(q => q.subject === 'physics').length,
  },
  {
    name: 'Chemistry',
    slug: 'chemistry',
    icon: FlaskConical,
    color: '#10b981',
    bg: 'var(--chemistry-bg)',
    description: 'Physical, Organic, and Inorganic Chemistry',
    questionCount: questions.filter(q => q.subject === 'chemistry').length,
  },
  {
    name: 'Mathematics',
    slug: 'mathematics',
    icon: Calculator,
    color: '#8b5cf6',
    bg: 'var(--mathematics-bg)',
    description: 'Calculus, Algebra, Coordinate Geometry, Vectors',
    questionCount: questions.filter(q => q.subject === 'mathematics').length,
  },
];

const learningSteps = [
  {
    step: 1,
    title: 'Read the Question',
    description: 'Start with the original JEE Advanced question exactly as it appeared in the exam.',
    icon: BookOpen,
  },
  {
    step: 2,
    title: 'Visualize the Concept',
    description: 'Explore interactive simulations and diagrams that bring abstract ideas to life.',
    icon: Eye,
  },
  {
    step: 3,
    title: 'Experiment & Explore',
    description: 'Adjust parameters, observe changes, and build physical intuition.',
    icon: Layers,
  },
  {
    step: 4,
    title: 'Understand the Reasoning',
    description: 'Walk through step-by-step solutions with clear mathematical derivations.',
    icon: Brain,
  },
  {
    step: 5,
    title: 'Ask the AI Tutor',
    description: 'Get explanations, hints, and alternative approaches from an intelligent tutor.',
    icon: Lightbulb,
  },
  {
    step: 6,
    title: 'Solve Independently',
    description: 'Test your understanding with related questions and conceptual checks.',
    icon: Target,
  },
];

export default function HomePage() {
  const featuredQuestions = questions.filter(q => q.hasVisualization || q.hasSimulation).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-primary)]/3 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-[var(--brand-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-56 h-56 bg-[var(--brand-accent)]/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6
                bg-[var(--brand-primary)]/8 text-[var(--brand-primary)] border border-[var(--brand-primary)]/15"
            >
              <Sparkles className="w-3.5 h-3.5" />
              JEE Advanced 2026 Paper 1 Now Available
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={0.1}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] leading-tight tracking-tight"
            >
              Understand the concept.{' '}
              <span className="text-[var(--brand-primary)]">Visualize</span> the solution.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="mt-5 text-lg text-[var(--foreground-secondary)] leading-relaxed max-w-2xl mx-auto"
            >
              ConceptX helps JEE Advanced aspirants master difficult questions through
              interactive visualizations, step-by-step reasoning, and AI-guided explanations.
              Don&apos;t just memorize — understand.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={0.3}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link href="/explore" className="btn btn-primary text-base px-6 py-3 shadow-lg shadow-[var(--brand-primary)]/20">
                <Play className="w-4.5 h-4.5" />
                Explore Questions
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/questions/phy-2026-p1-q1" className="btn btn-secondary text-base px-6 py-3">
                <Zap className="w-4.5 h-4.5" />
                Try the Simulation
              </Link>
            </motion.div>
          </motion.div>

          {/* Interactive Preview Card */}
          <motion.div
            variants={fadeUp}
            custom={0.4}
            initial="hidden"
            animate="visible"
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="card p-1 overflow-hidden">
              <div className="rounded-lg bg-gradient-to-br from-[var(--background-secondary)] to-[var(--background-card)] p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSubjectBadgeClass('physics')}`}>
                    Physics
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)]">
                    JEE Advanced 2026 · Paper 1 · Q1
                  </span>
                </div>
                <div className="text-sm text-[var(--foreground)] leading-relaxed">
                  <MathText>
                    {questions[0]?.statement.slice(0, 200) + '...'}
                  </MathText>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href="/questions/phy-2026-p1-q1"
                    className="btn btn-primary text-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Open Question
                  </Link>
                  <span className="text-xs text-[var(--foreground-muted)] flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Interactive Simulation Available
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]"
            >
              How ConceptX Works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.1}
              className="mt-3 text-[var(--foreground-secondary)] max-w-xl mx-auto"
            >
              A structured learning workflow designed around genuine understanding, not rote memorization.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {learningSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp}
                  custom={i * 0.08}
                  className="card p-5 relative group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/8 flex items-center justify-center shrink-0 group-hover:bg-[var(--brand-primary)]/15 transition-colors">
                      <Icon className="w-5 h-5 text-[var(--brand-primary)]" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[var(--brand-primary)] mb-1">
                        Step {step.step}
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subject Exploration */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]"
            >
              Explore by Subject
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.1}
              className="mt-3 text-[var(--foreground-secondary)] max-w-xl mx-auto"
            >
              Dive into Physics, Chemistry, and Mathematics with questions from JEE Advanced papers.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map((subject, i) => {
              const Icon = subject.icon;
              return (
                <motion.div
                  key={subject.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp}
                  custom={i * 0.1}
                >
                  <Link
                    href={`/explore?subject=${subject.slug}`}
                    className="card card-interactive block p-6 h-full group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ background: subject.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: subject.color }} />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1.5 group-hover:text-[var(--brand-primary)] transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)] mb-4 leading-relaxed">
                      {subject.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[var(--foreground-muted)]">
                        {subject.questionCount} questions available
                      </span>
                      <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--brand-primary)] transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Questions */}
      <section className="py-20 bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
          >
            <div>
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]"
              >
                Featured Questions
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={0.1}
                className="mt-2 text-[var(--foreground-secondary)]"
              >
                Questions with interactive visualizations and detailed solutions.
              </motion.p>
            </div>
            <motion.div variants={fadeUp} custom={0.2}>
              <Link href="/explore" className="btn btn-secondary text-sm">
                View All Questions
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredQuestions.map((q, i) => (
              <motion.div
                key={q.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                custom={i * 0.1}
              >
                <Link
                  href={`/questions/${q.id}`}
                  className="card card-interactive block p-5 h-full group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSubjectBadgeClass(q.subject)}`}>
                      {q.subject.charAt(0).toUpperCase() + q.subject.slice(1)}
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)]">
                      Q{q.questionNumber}
                    </span>
                    {q.hasSimulation && (
                      <span className="text-xs text-[var(--brand-accent)] flex items-center gap-0.5">
                        <Zap className="w-3 h-3" />
                        Simulation
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[var(--foreground)] leading-relaxed line-clamp-3 mb-3">
                    <MathText>{q.statement.slice(0, 150) + '...'}</MathText>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
                    <div className="flex flex-wrap gap-1.5">
                      {q.topics.slice(0, 2).map(t => (
                        <span key={t} className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--background-secondary)] text-[var(--foreground-muted)]">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)]">
                      {getQuestionTypeLabel(q.questionType)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Papers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
              Available Examination Papers
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.1} className="mt-3 text-[var(--foreground-secondary)]">
              Start exploring past JEE Advanced papers with interactive solutions.
            </motion.p>
          </motion.div>

          <div className="max-w-lg mx-auto">
            {papers.map((paper, i) => (
              <motion.div
                key={paper.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.1}
              >
                <Link
                  href={`/explore?year=${paper.year}&paper=${paper.paperNumber}`}
                  className="card card-interactive block p-6 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--brand-primary)] transition-colors">
                        {paper.title}
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)] mt-1">
                        {paper.totalMarks} marks · {paper.duration} · {questions.filter(q => q.paperId === paper.id).length} questions loaded
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-[var(--brand-primary)] transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[var(--brand-primary)]/5 via-[var(--background-secondary)] to-[var(--brand-accent)]/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
              Ready to understand, not just solve?
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.1} className="mt-4 text-lg text-[var(--foreground-secondary)]">
              Start exploring JEE Advanced questions with interactive visualizations and step-by-step explanations.
            </motion.p>
            <motion.div variants={fadeUp} custom={0.2} className="mt-8">
              <Link href="/explore" className="btn btn-primary text-base px-8 py-3 shadow-lg shadow-[var(--brand-primary)]/20">
                Explore Questions
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
