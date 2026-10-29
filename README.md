# ConceptX — AI-Powered Interactive Learning for JEE Advanced

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)
![KaTeX](https://img.shields.io/badge/KaTeX-Math_Engine-3298dc?style=for-the-badge&logo=latex)
![Vitest](https://img.shields.io/badge/Vitest-15%20Passed-6e9f18?style=for-the-badge&logo=vitest)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20RLS-3ecf8e?style=for-the-badge&logo=supabase)

<p align="center">
  <strong>Understand the concept. Visualize the solution. Master JEE Advanced.</strong>
</p>

<p align="center">
  A production-grade educational platform built for JEE Advanced aspirants. ConceptX replaces static solutions and robotic chatbot wrappers with <strong>interactive analytical physics simulations</strong>, <strong>rigorous mathematical models</strong>, <strong>official JEE partial-marking evaluation</strong>, and an <strong>adaptive AI Tutor</strong> grounded in first principles.
</p>

<p align="center">
  <a href="https://jeeadvanced.zybytee.in/"><strong>Visit the live website</strong></a>
</p>

</div>

---

## 🌟 Key Features

### 1. ⚙️ Flagship Physics Simulation: Rolling Cylinder Over a Step
* **Question**: Uniform solid cylinder of mass $M$ and radius $R$ rolling without slipping at speed $v_0$, encountering a sharp step of height $h < R$ (inelastic collision, pivoting about the edge).
* **60 FPS Canvas Physics Engine**: Interactive real-time analytical mechanics simulation.
* **Live Telemetry & Diagnostics**:
  * **Angular Momentum Conservation**: Demonstrates that $\vec{\tau}_{\text{edge}} = 0 \implies L_{\text{before}} = L_{\text{after}} = M v_0 \frac{3R - 2h}{2}$.
  * **Inelastic Collision Energy Loss**: Shows quantitatively that kinetic energy is **not** conserved during impact ($\Delta KE > 0$).
  * **Climbing Threshold Gauge**: Automatically evaluates whether $v_0 \geq v_{0,\min}$ where:
    $$v_{0,\min} = \frac{\sqrt{12gh} \cdot R}{3R - 2h}$$
  * **Interactive Controls**: Sliders for $v_0$ (0.5 – 7.0 m/s), $R$ (0.2 – 1.2 m), $h$ ($< R$), and $M$ (0.5 – 5.0 kg), vector overlays ($\vec{v}$, $M\vec{g}$, pivot reaction $\vec{J}$), play/pause, step, and speed controls.

### 2. 🔬 Interactive Multi-Subject Visualizations
* **Capacitor Dielectrics Model**: Series dielectrics with dielectric constants $K_1$ and $K_2$, electric field vectors ($E_1, E_2$), displacement continuity ($D = K\varepsilon_0 E$), and voltage profile $V(x)$.
* **Spring-Mass SHM Simulator**: Oscillating block with dynamic spring rendering, real-time phase space plot $(x, v)$, and live kinetic vs potential energy bars ($KE + PE = \frac{1}{2}kA^2$).
* **Cubic Calculus Visualizer**: Interactive curve $f(x) = x^3 - 3x^2 + 2x$ with draggable tangent line, local extrema at $x = 1 \pm \frac{1}{\sqrt{3}}$, inflection point at $x = 1$, and shaded bounded area $\int_0^2 |f(x)|dx = \frac{1}{2}$.

### 3. 🎯 Authentic JEE Advanced Examination Scoring Engine
* **Multiple Correct Questions**: Implements the official JEE Advanced partial marking algorithm:
  * **+4**: All correct options chosen without any wrong selections.
  * **+3**: When all 4 options are correct, but only 3 are selected.
  * **+2**: When 3 or more options are correct, but only 2 are selected (both correct).
  * **+1**: When 2 or more options are correct, but only 1 is selected (and correct).
  * **0**: Unattempted.
  * **-1**: Penalty applied if any incorrect option is chosen.
* **Single Correct & Integer Answer Questions**: Instant validation with tolerance handling.

### 4. 💡 3-Tier Progressive Hint Workflow
Instead of instantly spoiling the solution, students can unlock progressive conceptual nudges:
1. **Tier 1 (Pivot Selection)**: Helps identify the ideal reference point where unknown impulsive torques vanish.
2. **Tier 2 (Conservation Laws)**: Guides students on why momentum is conserved while mechanical energy is dissipated.
3. **Tier 3 (Mathematical Formulation)**: Formulates the governing equation ready for substitution.

### 5. 🤖 Grounded AI Tutor (`/api/tutor`)
* **First-Principles Pedagogy**: AI tutor persona trained to explain concepts, guide derivations, and highlight exam traps rather than simply giving away letter answers.
* **Quick Prompt Actions**:
  * 💡 *"Need a Hint"*
  * ✨ *"Explain Inelastic Impact"*
  * ⚠️ *"Common Pitfalls & Mistakes"*
  * ❓ *"Vary Parameters (What if $h$ changes?)"*
* **KaTeX Math Typesetting**: Real-time rendering of complex formulas in conversation.
* **Dual-Mode Backend**: Ready for Google Gemini API (`GEMINI_API_KEY`) with an intelligent, zero-latency local pedagogical knowledge base fallback.

### 6. 📊 Student Persistence & Personal Workspace
* **Local-First Architecture**: Progress, question attempts, scores, and hints are auto-saved to `localStorage` via reactive event dispatchers.
* **Study Notes**: In-workspace note-taking editor allowing students to record key formulas and caveats per question.
* **Bookmarking**: Quick toggle bookmarking system accessible from anywhere.

### 7. 🛡️ Curriculum Admin & Ingestion Pipeline (`/admin`)
* **Verification Lifecycle**: Questions follow a clear verification status flow:
  $$\text{Draft} \longrightarrow \text{Extraction Review} \longrightarrow \text{Simulation Review} \longrightarrow \text{Validated} \longrightarrow \text{Published}$$
* **Source PDF Inspection**: Tracks the parsing and health status of `p1_english.pdf` (JEE Advanced 2026 Paper 1, 3.24 MB).

---

## 🏛️ System Architecture

```mermaid
graph TD
    A[Student / Aspirant] --> B[ConceptX Web App]
    
    subgraph Frontend [Next.js 16 App Router]
        B --> C[Landing Page]
        B --> D[Question Explorer /explore]
        B --> E[Question Workspace /questions/:id]
        
        E --> F[KaTeX Math Engine]
        E --> G[Scoring Engine + Partial Marking]
        E --> H[Simulation Viewer]
        E --> I[AI Tutor Panel]
        E --> J[Study Notes & Bookmarks]
        
        H --> K1[Rolling Cylinder Canvas Simulation]
        H --> K2[Capacitor Dielectric Model]
        H --> K3[Spring-Mass SHM Tracker]
        H --> K4[Cubic Calculus Curve Plotter]
    end

    subgraph Backend & Services
        I --> L[/api/tutor Route]
        L --> M[Gemini 1.5 Flash API]
        L --> N[Local Pedagogical Knowledge Base]
        
        B --> O[Admin Review Dashboard /admin]
        O --> P[PDF Ingestion Inspector]
        P --> Q[p1_english.pdf Source]
    end

    subgraph Persistence [Local-First + Supabase]
        J --> R[Reactive LocalStorage Adapter]
        R -.-> S[(Supabase PostgreSQL + RLS)]
    end
```

---

## 📁 Repository Structure

```
jee-advanced-learning/
├── p1_english.pdf                  # Official JEE Advanced 2026 Paper 1 Source (3.24 MB)
├── README.md                       # Main Project Documentation
└── conceptx/                       # Web Application Root
    ├── package.json                # Project dependencies & scripts
    ├── tsconfig.json               # TypeScript configuration
    ├── next.config.ts              # Next.js configuration (Turbopack)
    ├── supabase/
    │   └── migrations/
    │       └── 20261026_init.sql   # Complete Supabase PostgreSQL Schema & RLS Policies
    ├── tests/                      # Automated Vitest Test Suite
    │   ├── physics.test.ts         # Analytical mechanics & simulation tests
    │   ├── scoring.test.ts         # JEE Advanced partial marking tests
    │   └── questions.test.ts       # Question bank integrity tests
    └── src/
        ├── app/
        │   ├── layout.tsx          # Root layout with Header, Footer, and Suspense
        │   ├── page.tsx            # High-impact Landing Page
        │   ├── globals.css         # Design system tokens and Tailwind CSS
        │   ├── explore/
        │   │   └── page.tsx        # Question Explorer with filters & search
        │   ├── questions/
        │   │   └── [id]/
        │   │       └── page.tsx    # Question Workspace Server Page (Static Prerender)
        │   ├── admin/
        │   │   └── page.tsx        # Curriculum Verification & Ingestion Dashboard
        │   └── api/
        │       └── tutor/
        │           └── route.ts    # AI Tutor Serverless API Endpoint
        ├── components/
        │   ├── layout/
        │   │   └── Navigation.tsx  # Header, Footer, and theme toggle
        │   ├── math/
        │   │   └── MathRenderer.tsx# KaTeX LaTeX renderer (inline & display)
        │   ├── simulation/
        │   │   ├── RollingCylinderSimulation.tsx # Flagship Physics Engine
        │   │   ├── CapacitorSimulation.tsx       # Dielectric Capacitor Model
        │   │   ├── SpringMassSimulation.tsx      # SHM Phase Space Engine
        │   │   ├── CubicCalculusSimulation.tsx   # Calculus Curve Visualizer
        │   │   └── SimulationViewer.tsx          # Adaptive Simulation Switcher
        │   ├── tutor/
        │   │   └── AITutorPanel.tsx              # Interactive AI Tutor Chat
        │   └── workspace/
        │       └── QuestionWorkspaceClient.tsx   # Client Question Workspace UI
        ├── data/
        │   └── questions.ts        # Typed Question Bank (Physics, Chem, Math)
        ├── lib/
        │   ├── scoring.ts          # JEE Advanced scoring logic
        │   ├── storage.ts          # Local-first student state manager
        │   ├── supabase.ts         # Supabase connection & sync adapter
        │   └── utils.ts            # Styling utilities (clsx, tailwind-merge)
        └── types/
            └── index.ts            # Core TypeScript interfaces
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18.0.0 or later (Node v22+ recommended)
* **npm**: v9.0.0 or later

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abhishekkumarcoder21/jee-advanced-learning.git
   cd jee-advanced-learning/conceptx
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

4. **Run the automated test suite**:
   ```bash
   npm test
   ```

5. **Create an optimized production build**:
   ```bash
   npm run build
   ```

---

## 🧮 Physics & Mathematical Derivations

### Flagship Problem: Rolling Cylinder Encountering a Step

#### Phase 1: Inelastic Impact at Step Edge ($P$)
When the cylinder strikes the step of height $h$, an impulsive normal force $\vec{J}$ acts through the edge point $P$. 
Because the torque about $P$ is identically zero:
$$\vec{\tau}_P = 0 \implies \vec{L}_P(\text{before}) = \vec{L}_P(\text{after})$$

Before the collision (rolling without slipping, $\omega_0 = v_0 / R$):
$$L_{P,\text{initial}} = M v_0 (R - h) + I_{\text{cm}}\omega_0 = M v_0 (R - h) + \frac{1}{2} M R v_0 = M v_0 \left(\frac{3R - 2h}{2}\right)$$

Immediately after the collision, the cylinder rotates purely about pivot $P$ ($I_P = \frac{3}{2}MR^2$ via the parallel axis theorem):
$$L_{P,\text{after}} = I_P \omega_1 = \frac{3}{2} M R^2 \omega_1$$

Equating angular momenta gives the post-impact angular velocity:
$$\omega_1 = \frac{v_0 (3R - 2h)}{3 R^2}$$

#### Phase 2: Inelastic Collision Kinetic Energy Loss
$$\text{KE}_{\text{initial}} = \frac{3}{4} M v_0^2$$
$$\text{KE}_{\text{after}} = \frac{1}{2} I_P \omega_1^2 = \frac{M v_0^2 (3R - 2h)^2}{12 R^2} < \text{KE}_{\text{initial}}$$
$$\therefore \Delta \text{KE} = \text{KE}_{\text{initial}} - \text{KE}_{\text{after}} > 0 \quad (\text{Energy is strictly dissipated})$$

#### Phase 3: Energy Condition to Clear the Step
To climb over, the center of mass must rise by height $h$ (reaching vertically above the pivot):
$$\text{KE}_{\text{after}} \geq M g h \implies \frac{M v_0^2 (3R - 2h)^2}{12 R^2} \geq M g h$$
$$\implies v_{0,\min} = \frac{\sqrt{12gh} \cdot R}{3R - 2h}$$

---

## 🧪 Testing & Validation

The test suite validates physical equations, grading rules, and question bank consistency:

```bash
✓ tests/physics.test.ts (4 tests)
  - conserves angular momentum about the edge during the collision
  - dissipates kinetic energy during the inelastic collision
  - correctly calculates minimum velocity v0_min to climb step
  - determines climbing outcome correctly for sub-critical and super-critical velocity
✓ tests/scoring.test.ts (6 tests)
  - awards full marks (+4) for all correct options
  - awards partial credit (+1, +2, +3) without wrong guesses
  - penalizes (-1) if any incorrect option is selected
  - returns 0 marks when question is unattempted
  - evaluates single correct questions properly
  - evaluates numerical/integer answer questions correctly
✓ tests/questions.test.ts (5 tests)
  - has examination, paper, and sections registered
  - contains questions for Physics, Chemistry, and Mathematics
  - ensures all multiple-choice questions have options
  - ensures questions with solutions have step-by-step reasoning
  - ensures numerical questions have a valid target value
```

---

## 📄 License & Attribution

* **Exam Materials**: Questions and diagrams are derived from publicly available Joint Entrance Examination (Advanced) papers.
* **Application Code**: Licensed under the **MIT License**.
