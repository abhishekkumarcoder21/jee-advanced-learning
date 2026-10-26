# ConceptX — Next.js Application Architecture

> **Understand the concept. Visualize the solution. Master JEE Advanced.**

ConceptX is an AI-powered interactive learning platform for JEE Advanced preparation. This directory contains the Next.js 16 (Turbopack) web application codebase.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run local development server
npm run dev

# 3. Run automated tests (Vitest)
npm test

# 4. Build for production
npm run build
```

Application starts on **[http://localhost:3000](http://localhost:3000)**.

---

## 🏗️ Technical Stack

- **Framework**: Next.js 16.4.3 (App Router with partial prerendering & Turbopack)
- **Language**: TypeScript 5.0 (Strict mode)
- **Styling**: Tailwind CSS v4 & custom design system tokens
- **Math Engine**: KaTeX (`MathRenderer.tsx` supporting inline `$..$` and display `$$..$$`)
- **Physics Simulation**: HTML5 2D Canvas analytical mechanics engine
- **Evaluation**: Official JEE Advanced partial-marking scoring engine
- **Testing**: Vitest with unit & simulation invariant tests
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) policies

---

## 🧭 Application Routes

- `/` — Landing page with subject tracks, features, and methodology
- `/explore` — Examination question explorer with live subject & type filters
- `/questions/:id` — Interactive question workspace (physics simulation, answer checker, hints, and AI tutor)
- `/admin` — Curriculum verification pipeline and PDF ingestion inspection
- `/api/tutor` — Serverless AI tutoring endpoint with structured pedagogical reasoning

---

## 🧪 Testing

```bash
npm test
```

Executes 15 automated unit and physics invariant tests verifying angular momentum conservation, energy dissipation, and JEE Advanced scoring accuracy.