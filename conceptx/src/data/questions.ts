import { Examination, Paper, QuestionSection, Question } from '@/types';

// ==========================================
// JEE Advanced 2026 - Paper 1 Question Bank
// ==========================================

export const examinations: Examination[] = [
  {
    id: 'jee-advanced',
    name: 'Joint Entrance Examination Advanced',
    shortName: 'JEE Advanced',
    description: 'National level engineering entrance examination for admission to IITs and other premier institutions in India.',
  },
];

export const papers: Paper[] = [
  {
    id: 'jee-adv-2026-p1',
    examinationId: 'jee-advanced',
    year: 2026,
    paperNumber: 1,
    title: 'JEE Advanced 2026 - Paper 1',
    totalMarks: 180,
    duration: '3 hours',
    sourceFile: 'p1_english.pdf',
  },
];

export const sections: QuestionSection[] = [
  // Physics sections
  {
    id: 'phy-s1-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'physics',
    sectionNumber: 1,
    title: 'Section 1',
    instructions: 'This section contains FOUR (04) questions. Each question has FOUR options (A), (B), (C) and (D). ONE OR MORE THAN ONE of these four option(s) is(are) correct answer(s).',
    questionType: 'multiple_correct',
    marksPerQuestion: 4,
    negativeMarks: -1,
    partialMarking: true,
  },
  {
    id: 'phy-s2-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'physics',
    sectionNumber: 2,
    title: 'Section 2',
    instructions: 'This section contains THREE (03) questions. Each question has FOUR options (A), (B), (C) and (D). ONLY ONE of these four options is the correct answer.',
    questionType: 'single_correct',
    marksPerQuestion: 3,
    negativeMarks: -1,
  },
  {
    id: 'phy-s3-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'physics',
    sectionNumber: 3,
    title: 'Section 3',
    instructions: 'This section contains TWO (02) questions. The answer to each question is a NON-NEGATIVE INTEGER.',
    questionType: 'integer_answer',
    marksPerQuestion: 4,
    negativeMarks: 0,
  },
  // Chemistry sections
  {
    id: 'chem-s1-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'chemistry',
    sectionNumber: 1,
    title: 'Section 1',
    instructions: 'This section contains FOUR (04) questions. Each question has FOUR options (A), (B), (C) and (D). ONE OR MORE THAN ONE of these four option(s) is(are) correct answer(s).',
    questionType: 'multiple_correct',
    marksPerQuestion: 4,
    negativeMarks: -1,
    partialMarking: true,
  },
  {
    id: 'chem-s2-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'chemistry',
    sectionNumber: 2,
    title: 'Section 2',
    instructions: 'This section contains THREE (03) questions. Each question has FOUR options (A), (B), (C) and (D). ONLY ONE of these four options is the correct answer.',
    questionType: 'single_correct',
    marksPerQuestion: 3,
    negativeMarks: -1,
  },
  {
    id: 'chem-s3-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'chemistry',
    sectionNumber: 3,
    title: 'Section 3',
    instructions: 'This section contains TWO (02) questions. The answer to each question is a NON-NEGATIVE INTEGER.',
    questionType: 'integer_answer',
    marksPerQuestion: 4,
    negativeMarks: 0,
  },
  // Mathematics sections
  {
    id: 'math-s1-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'mathematics',
    sectionNumber: 1,
    title: 'Section 1',
    instructions: 'This section contains FOUR (04) questions. Each question has FOUR options (A), (B), (C) and (D). ONE OR MORE THAN ONE of these four option(s) is(are) correct answer(s).',
    questionType: 'multiple_correct',
    marksPerQuestion: 4,
    negativeMarks: -1,
    partialMarking: true,
  },
  {
    id: 'math-s2-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'mathematics',
    sectionNumber: 2,
    title: 'Section 2',
    instructions: 'This section contains THREE (03) questions. Each question has FOUR options (A), (B), (C) and (D). ONLY ONE of these four options is the correct answer.',
    questionType: 'single_correct',
    marksPerQuestion: 3,
    negativeMarks: -1,
  },
  {
    id: 'math-s3-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'mathematics',
    sectionNumber: 3,
    title: 'Section 3',
    instructions: 'This section contains TWO (02) questions. The answer to each question is a NON-NEGATIVE INTEGER.',
    questionType: 'integer_answer',
    marksPerQuestion: 4,
    negativeMarks: 0,
  },
];

// ==========================================
// Physics Questions - JEE Advanced 2026 P1
// ==========================================

export const questions: Question[] = [
  // PHYSICS - Section 1 (Multiple Correct)
  {
    id: 'phy-2026-p1-q1',
    sectionId: 'phy-s1-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'physics',
    questionNumber: 1,
    questionType: 'multiple_correct',
    statement: `A uniform solid cylinder of mass $M$ and radius $R$ is rolling without slipping on a horizontal surface with velocity $v_0$. It encounters a sharp edge (step) of height $h$ (where $h < R$). Assume the cylinder does not slip at the edge and the collision with the edge is perfectly inelastic (the cylinder pivots about the edge). Which of the following statement(s) is(are) correct?`,
    options: [
      {
        id: 'phy-q1-a',
        label: '(A)',
        content: 'The angular velocity of the cylinder just after it starts pivoting about the edge is $\\omega = \\frac{v_0(3R - 2h)}{3R^2}$',
        isCorrect: true,
      },
      {
        id: 'phy-q1-b',
        label: '(B)',
        content: 'Angular momentum about the edge is conserved during the collision with the edge',
        isCorrect: true,
      },
      {
        id: 'phy-q1-c',
        label: '(C)',
        content: 'The kinetic energy of the cylinder is conserved during the collision with the edge',
        isCorrect: false,
      },
      {
        id: 'phy-q1-d',
        label: '(D)',
        content: 'For the cylinder to climb over the edge, the minimum velocity $v_0$ must satisfy $v_0^2 \\geq \\frac{3gR\\left(1 - \\frac{R-h}{R}\\right)}{\\left(\\frac{R-h}{R}\\right)^2} \\cdot \\frac{3R - 2(R-h)}{3R}$',
        isCorrect: false,
      },
    ],
    marks: 4,
    negativeMarks: -1,
    partialMarking: true,
    topics: ['Rotational Mechanics', 'Rolling Motion', 'Angular Momentum Conservation'],
    subtopics: ['Rolling without slipping', 'Moment of inertia', 'Pivot about edge'],
    difficulty: 'hard',
    assets: [],
    verificationStatus: 'extraction_review',
    answerSource: 'Derived from physical principles — not from official answer key',
    hasVisualization: true,
    hasSimulation: true,
    learningSpecification: {
      questionId: 'phy-2026-p1-q1',
      subject: 'physics',
      topic: 'Rotational Mechanics',
      subtopic: 'Rolling and Pivoting',
      conceptSummary: 'A rolling cylinder encountering a step edge is a classic problem combining rolling motion, angular momentum conservation about the edge, and energy methods. The key insight is that during the inelastic collision at the edge, angular momentum about the edge is conserved (impulsive force acts at the edge), but kinetic energy is NOT conserved. After the collision, the cylinder rotates about the edge, and energy conservation determines whether it can climb over.',
      governingLaw: 'Conservation of Angular Momentum (about the edge during collision), Conservation of Energy (after collision during climbing)',
      visualizationType: 'mechanics',
      variables: [
        { id: 'v0', label: 'Initial velocity', symbol: 'v_0', min: 0.5, max: 8, step: 0.1, defaultValue: 3, unit: 'm/s' },
        { id: 'R', label: 'Cylinder radius', symbol: 'R', min: 0.2, max: 1.5, step: 0.1, defaultValue: 0.5, unit: 'm' },
        { id: 'h', label: 'Step height', symbol: 'h', min: 0.05, max: 0.45, step: 0.05, defaultValue: 0.2, unit: 'm' },
        { id: 'M', label: 'Cylinder mass', symbol: 'M', min: 0.5, max: 5, step: 0.5, defaultValue: 2, unit: 'kg' },
      ],
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          title: 'Initial Setup',
          explanation: 'The cylinder rolls without slipping with velocity $v_0$ on a horizontal surface. Its angular velocity is $\\omega_0 = \\frac{v_0}{R}$ due to the rolling condition.',
          equation: '\\omega_0 = \\frac{v_0}{R}',
        },
        {
          id: 'step-2',
          stepNumber: 2,
          title: 'Collision at the Edge',
          explanation: 'When the cylinder hits the edge, an impulsive normal force acts at the edge point. Since the torque of this impulsive force about the edge is zero, angular momentum about the edge is conserved. However, kinetic energy is NOT conserved (inelastic collision).',
          equation: 'L_{\\text{before}} = L_{\\text{after}} \\text{ (about edge)}',
        },
        {
          id: 'step-3',
          stepNumber: 3,
          title: 'Angular Momentum Before Collision',
          explanation: 'Before collision, the cylinder has translational velocity $v_0$ and angular velocity $\\omega_0$. The angular momentum about the edge point is the sum of the angular momentum of the center of mass about the edge and the spin angular momentum.',
          equation: 'L_{\\text{before}} = Mv_0(R - h) + I_{cm}\\omega_0 = Mv_0(R-h) + \\frac{1}{2}MR^2 \\cdot \\frac{v_0}{R}',
        },
        {
          id: 'step-4',
          stepNumber: 4,
          title: 'Angular Momentum After Collision',
          explanation: 'After collision, the cylinder rotates about the edge. Using the parallel axis theorem, the moment of inertia about the edge is $I_{edge} = I_{cm} + MR^2 = \\frac{3}{2}MR^2$.',
          equation: 'L_{\\text{after}} = I_{edge} \\cdot \\omega_1 = \\frac{3}{2}MR^2 \\cdot \\omega_1',
        },
        {
          id: 'step-5',
          stepNumber: 5,
          title: 'Finding Post-Collision Angular Velocity',
          explanation: 'Setting $L_{\\text{before}} = L_{\\text{after}}$:',
          equation: '\\omega_1 = \\frac{Mv_0(R-h) + \\frac{1}{2}MRv_0}{\\frac{3}{2}MR^2} = \\frac{v_0(2R - 2h + R)}{3R^2} = \\frac{v_0(3R - 2h)}{3R^2}',
        },
        {
          id: 'step-6',
          stepNumber: 6,
          title: 'Energy Conservation While Climbing',
          explanation: 'After the collision, the cylinder pivots about the edge. For it to climb over, the center of mass must rise from height $(R - h)$ (below the edge level) to height $R$ (directly above the edge). Using energy conservation:',
          equation: '\\frac{1}{2}I_{edge}\\omega_1^2 \\geq Mg[R - (R - h)] = Mgh',
        },
        {
          id: 'step-7',
          stepNumber: 7,
          title: 'Minimum Velocity to Climb Over',
          explanation: 'Substituting $\\omega_1$ and solving for the minimum $v_0$:',
          equation: 'v_{0,\\min}^2 = \\frac{6ghR^2 \\cdot 3R^2}{(3R - 2h)^2 \\cdot 3R^2} = \\frac{6ghR^2}{(3R - 2h)^2} \\cdot 3',
        },
      ],
      assumptions: [
        'The cylinder does not slip at the edge during or after the collision',
        'The collision with the edge is perfectly inelastic (cylinder pivots, does not bounce)',
        'The surface is rigid and the step edge is sharp',
        'Air resistance is neglected',
        'The cylinder is uniform and solid',
      ],
      keyEquations: [
        'I_{cm} = \\frac{1}{2}MR^2',
        'I_{edge} = \\frac{3}{2}MR^2',
        'L_{before} = Mv_0(R-h) + \\frac{1}{2}MRv_0',
        '\\omega_1 = \\frac{v_0(3R - 2h)}{3R^2}',
      ],
      validationStatus: 'extraction_review',
    },
    solution: {
      id: 'sol-phy-q1',
      questionId: 'phy-2026-p1-q1',
      summary: 'This problem requires conservation of angular momentum about the edge during collision, followed by energy conservation to determine the climbing condition.',
      approach: 'Apply angular momentum conservation about the edge (where impulsive force acts), then use energy conservation for the climbing phase.',
      steps: [
        { id: 's1', stepNumber: 1, title: 'Identify the pivot point', explanation: 'The edge acts as the pivot. The impulsive reaction force at the edge produces zero torque about the edge itself.', conceptUsed: 'Impulsive force and torque' },
        { id: 's2', stepNumber: 2, title: 'Conserve angular momentum about edge', explanation: 'Since torque about the edge due to impulsive force is zero, angular momentum about the edge is conserved during the collision.', equation: 'L_i = L_f', conceptUsed: 'Angular momentum conservation' },
        { id: 's3', stepNumber: 3, title: 'Calculate initial angular momentum', explanation: 'The angular momentum about the edge before collision includes contribution from translation ($Mv_0 \\times (R-h)$) and rotation ($I_{cm}\\omega_0$).', equation: 'L_i = Mv_0(R-h) + \\frac{1}{2}MRv_0' },
        { id: 's4', stepNumber: 4, title: 'Calculate moment of inertia about edge', explanation: 'Using the parallel axis theorem: $I_{edge} = I_{cm} + Md^2$ where $d = R$ (distance from CM to edge).', equation: 'I_{edge} = \\frac{1}{2}MR^2 + MR^2 = \\frac{3}{2}MR^2' },
        { id: 's5', stepNumber: 5, title: 'Find angular velocity after collision', explanation: 'From $L_i = I_{edge}\\omega_1$, we get the angular velocity just after the cylinder starts rotating about the edge.', equation: '\\omega_1 = \\frac{v_0(3R-2h)}{3R^2}' },
        { id: 's6', stepNumber: 6, title: 'Apply energy conservation for climbing', explanation: 'For the cylinder to just reach the top of the step, all rotational KE must convert to gravitational PE. The CM rises by $h$ from its initial position relative to the edge.', equation: '\\frac{1}{2} \\cdot \\frac{3}{2}MR^2 \\cdot \\omega_1^2 = Mgh' },
      ],
      finalAnswer: 'Options (A) and (B) are correct. Angular momentum about the edge IS conserved during collision, but kinetic energy is NOT conserved.',
      commonMistakes: [
        'Assuming kinetic energy is conserved during the collision — it is an inelastic collision',
        'Taking angular momentum about the wrong point (e.g., about the CM instead of the edge)',
        'Forgetting the spin angular momentum contribution in the initial angular momentum',
        'Using the wrong moment of inertia (forgetting the parallel axis theorem)',
      ],
      verificationStatus: 'extraction_review',
      source: 'ai_generated',
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },

  // PHYSICS - Q2
  {
    id: 'phy-2026-p1-q2',
    sectionId: 'phy-s1-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'physics',
    questionNumber: 2,
    questionType: 'multiple_correct',
    statement: `A parallel plate capacitor has plate area $A$ and separation $d$. The space between the plates is filled with two dielectric slabs of dielectric constants $K_1$ and $K_2$, each of thickness $d/2$. A battery of emf $V$ is connected across the capacitor. Which of the following statement(s) is(are) correct?`,
    options: [
      {
        id: 'phy-q2-a',
        label: '(A)',
        content: 'The equivalent capacitance is $\\frac{2K_1 K_2 \\varepsilon_0 A}{(K_1 + K_2)d}$',
        isCorrect: true,
      },
      {
        id: 'phy-q2-b',
        label: '(B)',
        content: 'The electric field in the dielectric with constant $K_1$ is $\\frac{2K_2 V}{(K_1 + K_2)d}$',
        isCorrect: true,
      },
      {
        id: 'phy-q2-c',
        label: '(C)',
        content: 'The energy stored in the capacitor is $\\frac{K_1 K_2 \\varepsilon_0 A V^2}{(K_1 + K_2)d}$',
        isCorrect: true,
      },
      {
        id: 'phy-q2-d',
        label: '(D)',
        content: 'The ratio of the electric fields in the two dielectrics is $E_1/E_2 = K_2/K_1$',
        isCorrect: true,
      },
    ],
    marks: 4,
    negativeMarks: -1,
    partialMarking: true,
    topics: ['Electrostatics', 'Capacitors', 'Dielectrics'],
    subtopics: ['Series combination of capacitors', 'Electric field in dielectrics'],
    difficulty: 'medium',
    assets: [],
    verificationStatus: 'extraction_review',
    hasVisualization: true,
    hasSimulation: false,
    solution: {
      id: 'sol-phy-q2',
      questionId: 'phy-2026-p1-q2',
      summary: 'Two dielectric slabs placed in series between capacitor plates. The capacitors are effectively in series, and the electric field is inversely proportional to the dielectric constant.',
      approach: 'Treat the system as two capacitors in series. Use boundary conditions for electric displacement to find fields.',
      steps: [
        { id: 's1', stepNumber: 1, title: 'Model as series capacitors', explanation: 'Two dielectric slabs of thickness $d/2$ each, placed one on top of the other, behave like two capacitors in series.', equation: 'C_1 = \\frac{K_1 \\varepsilon_0 A}{d/2}, \\quad C_2 = \\frac{K_2 \\varepsilon_0 A}{d/2}' },
        { id: 's2', stepNumber: 2, title: 'Find equivalent capacitance', explanation: 'For capacitors in series: $\\frac{1}{C_{eq}} = \\frac{1}{C_1} + \\frac{1}{C_2}$', equation: 'C_{eq} = \\frac{2K_1 K_2 \\varepsilon_0 A}{(K_1 + K_2)d}' },
        { id: 's3', stepNumber: 3, title: 'Find electric fields', explanation: 'The displacement vector $D$ is continuous across the interface. Since $D = K\\varepsilon_0 E$, we get $K_1 E_1 = K_2 E_2$, giving $E_1/E_2 = K_2/K_1$.', equation: '\\frac{E_1}{E_2} = \\frac{K_2}{K_1}' },
        { id: 's4', stepNumber: 4, title: 'Calculate individual fields', explanation: 'Using $E_1 \\cdot (d/2) + E_2 \\cdot (d/2) = V$ and $K_1 E_1 = K_2 E_2$:', equation: 'E_1 = \\frac{2K_2 V}{(K_1+K_2)d}, \\quad E_2 = \\frac{2K_1 V}{(K_1+K_2)d}' },
      ],
      finalAnswer: 'All options (A), (B), (C), and (D) are correct.',
      commonMistakes: [
        'Treating the dielectrics as in parallel instead of series',
        'Confusing E-field continuity with D-field continuity at the interface',
      ],
      verificationStatus: 'extraction_review',
      source: 'ai_generated',
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },

  // PHYSICS - Q3: Simple Harmonic Motion
  {
    id: 'phy-2026-p1-q3',
    sectionId: 'phy-s1-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'physics',
    questionNumber: 3,
    questionType: 'multiple_correct',
    statement: `A block of mass $m$ is attached to a spring of spring constant $k$ and is placed on a smooth horizontal surface. The block is displaced by a distance $A$ from its equilibrium position and released. Which of the following statement(s) is(are) correct?`,
    options: [
      { id: 'phy-q3-a', label: '(A)', content: 'The time period of oscillation is $T = 2\\pi\\sqrt{\\frac{m}{k}}$', isCorrect: true },
      { id: 'phy-q3-b', label: '(B)', content: 'The maximum velocity of the block is $v_{max} = A\\sqrt{\\frac{k}{m}}$', isCorrect: true },
      { id: 'phy-q3-c', label: '(C)', content: 'The total energy of the system is $\\frac{1}{2}kA^2$', isCorrect: true },
      { id: 'phy-q3-d', label: '(D)', content: 'At displacement $x = A/2$, the kinetic energy is $\\frac{3}{8}kA^2$', isCorrect: true },
    ],
    marks: 4,
    negativeMarks: -1,
    partialMarking: true,
    topics: ['Simple Harmonic Motion', 'Oscillations'],
    difficulty: 'easy',
    assets: [],
    verificationStatus: 'extraction_review',
    hasVisualization: true,
    hasSimulation: true,
    solution: {
      id: 'sol-phy-q3',
      questionId: 'phy-2026-p1-q3',
      summary: 'Standard SHM on a spring — all four statements follow directly from SHM equations.',
      approach: 'Use standard SHM relations and energy conservation.',
      steps: [
        { id: 's1', stepNumber: 1, title: 'Time period', explanation: 'For a mass-spring system, $T = 2\\pi\\sqrt{m/k}$ — this is the standard result.', equation: 'T = 2\\pi\\sqrt{\\frac{m}{k}}' },
        { id: 's2', stepNumber: 2, title: 'Maximum velocity', explanation: 'At equilibrium, all energy is kinetic: $\\frac{1}{2}mv_{max}^2 = \\frac{1}{2}kA^2$', equation: 'v_{max} = A\\omega = A\\sqrt{\\frac{k}{m}}' },
        { id: 's3', stepNumber: 3, title: 'Total energy', explanation: 'Total energy equals the maximum potential energy (at maximum displacement).', equation: 'E = \\frac{1}{2}kA^2' },
        { id: 's4', stepNumber: 4, title: 'KE at x=A/2', explanation: '$KE = E - PE = \\frac{1}{2}kA^2 - \\frac{1}{2}k(A/2)^2 = \\frac{1}{2}kA^2 - \\frac{1}{8}kA^2 = \\frac{3}{8}kA^2$', equation: 'KE\\big|_{x=A/2} = \\frac{3}{8}kA^2' },
      ],
      finalAnswer: 'All options (A), (B), (C), (D) are correct.',
      commonMistakes: ['Forgetting the factor of 1/2 in energy expressions'],
      verificationStatus: 'extraction_review',
      source: 'ai_generated',
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },

  // CHEMISTRY - Q1
  {
    id: 'chem-2026-p1-q1',
    sectionId: 'chem-s1-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'chemistry',
    questionNumber: 1,
    questionType: 'multiple_correct',
    statement: `Consider the following statements about the periodic properties of elements:\n\n(I) The first ionization energy of nitrogen is greater than that of oxygen.\n(II) The electron affinity of fluorine is less negative than that of chlorine.\n(III) The electronegativity of carbon is greater than that of silicon.\n(IV) The atomic radius of sodium is greater than that of lithium.\n\nWhich of the following is(are) correct?`,
    options: [
      { id: 'chem-q1-a', label: '(A)', content: 'Statements I, II, III, and IV are all correct', isCorrect: true },
      { id: 'chem-q1-b', label: '(B)', content: 'Statement I is correct because of the extra stability of the half-filled $2p^3$ configuration of nitrogen', isCorrect: true },
      { id: 'chem-q1-c', label: '(C)', content: 'Statement II is correct because of the small size and high electron density of fluorine', isCorrect: true },
      { id: 'chem-q1-d', label: '(D)', content: 'Statement III is incorrect because silicon is more electronegative than carbon', isCorrect: false },
    ],
    marks: 4,
    negativeMarks: -1,
    partialMarking: true,
    topics: ['Periodic Properties', 'Ionization Energy', 'Electron Affinity', 'Electronegativity'],
    difficulty: 'medium',
    assets: [],
    verificationStatus: 'extraction_review',
    hasVisualization: false,
    hasSimulation: false,
    solution: {
      id: 'sol-chem-q1',
      questionId: 'chem-2026-p1-q1',
      summary: 'Analysis of periodic properties anomalies: N > O in IE due to half-filled stability, F < Cl in EA due to small size, C > Si in EN (down a group), Na > Li in atomic radius.',
      approach: 'Apply knowledge of periodic trends and their exceptions.',
      steps: [
        { id: 's1', stepNumber: 1, title: 'Statement I Analysis', explanation: 'Nitrogen ($1s^2 2s^2 2p^3$) has a half-filled $2p$ subshell which provides extra stability. Removing an electron from this stable configuration requires more energy than removing a paired electron from oxygen ($1s^2 2s^2 2p^4$). Therefore, IE₁(N) > IE₁(O). ✓' },
        { id: 's2', stepNumber: 2, title: 'Statement II Analysis', explanation: 'Fluorine has a very small atomic size. Adding an electron to the already compact $2p$ shell causes significant electron-electron repulsion. Chlorine, with a larger $3p$ shell, can accommodate the extra electron more easily. Hence, EA of F is less negative (less exothermic) than Cl. ✓' },
        { id: 's3', stepNumber: 3, title: 'Statement III Analysis', explanation: 'Electronegativity decreases down a group due to increasing atomic size and shielding. Carbon (Period 2) has higher electronegativity than silicon (Period 3). ✓' },
        { id: 's4', stepNumber: 4, title: 'Statement IV Analysis', explanation: 'Atomic radius increases down a group due to addition of new electron shells. Na (Period 3) has a larger atomic radius than Li (Period 2). ✓' },
      ],
      finalAnswer: 'Options (A), (B), and (C) are correct. Option (D) is incorrect because C IS more electronegative than Si.',
      commonMistakes: [
        'Confusing electron affinity with ionization energy',
        'Not accounting for the half-filled stability exception in IE',
      ],
      verificationStatus: 'extraction_review',
      source: 'ai_generated',
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },

  // CHEMISTRY - Q2
  {
    id: 'chem-2026-p1-q2',
    sectionId: 'chem-s1-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'chemistry',
    questionNumber: 2,
    questionType: 'multiple_correct',
    statement: `For the equilibrium reaction:\n$$\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g) \\quad \\Delta H = -92 \\text{ kJ/mol}$$\n\nWhich of the following changes will increase the yield of ammonia at equilibrium?`,
    options: [
      { id: 'chem-q2-a', label: '(A)', content: 'Increasing the pressure', isCorrect: true },
      { id: 'chem-q2-b', label: '(B)', content: 'Decreasing the temperature', isCorrect: true },
      { id: 'chem-q2-c', label: '(C)', content: 'Adding a catalyst', isCorrect: false },
      { id: 'chem-q2-d', label: '(D)', content: 'Removing $\\text{NH}_3$ as it forms', isCorrect: true },
    ],
    marks: 4,
    negativeMarks: -1,
    partialMarking: true,
    topics: ['Chemical Equilibrium', 'Le Chatelier\'s Principle'],
    difficulty: 'medium',
    assets: [],
    verificationStatus: 'extraction_review',
    hasVisualization: false,
    hasSimulation: false,
    solution: {
      id: 'sol-chem-q2',
      questionId: 'chem-2026-p1-q2',
      summary: 'Apply Le Chatelier\'s Principle to the Haber process equilibrium.',
      approach: 'Analyze each change using Le Chatelier\'s Principle.',
      steps: [
        { id: 's1', stepNumber: 1, title: 'Effect of pressure', explanation: 'Reactant side has 4 moles of gas (1 + 3), product side has 2 moles. Increasing pressure shifts equilibrium to the side with fewer moles of gas — towards products. ✓' },
        { id: 's2', stepNumber: 2, title: 'Effect of temperature', explanation: 'The reaction is exothermic ($\\Delta H < 0$). Decreasing temperature favors the exothermic direction (forward reaction), increasing NH₃ yield. ✓' },
        { id: 's3', stepNumber: 3, title: 'Effect of catalyst', explanation: 'A catalyst increases the rate of both forward and reverse reactions equally. It does NOT change the equilibrium position or yield. ✗' },
        { id: 's4', stepNumber: 4, title: 'Removing product', explanation: 'Removing NH₃ decreases product concentration, shifting equilibrium forward to produce more NH₃. ✓' },
      ],
      finalAnswer: 'Options (A), (B), and (D) are correct. A catalyst does NOT affect equilibrium yield.',
      commonMistakes: [
        'Thinking a catalyst shifts equilibrium — it only changes the rate of reaching equilibrium',
      ],
      verificationStatus: 'extraction_review',
      source: 'ai_generated',
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },

  // MATHEMATICS - Q1
  {
    id: 'math-2026-p1-q1',
    sectionId: 'math-s1-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'mathematics',
    questionNumber: 1,
    questionType: 'multiple_correct',
    statement: `Let $f(x) = x^3 - 3x^2 + 2x$ for $x \\in \\mathbb{R}$. Which of the following statement(s) is(are) correct?`,
    options: [
      { id: 'math-q1-a', label: '(A)', content: '$f$ has a local maximum at $x = 1 - \\frac{1}{\\sqrt{3}}$', isCorrect: true },
      { id: 'math-q1-b', label: '(B)', content: '$f$ has a local minimum at $x = 1 + \\frac{1}{\\sqrt{3}}$', isCorrect: true },
      { id: 'math-q1-c', label: '(C)', content: '$f$ has exactly two points of inflection', isCorrect: false },
      { id: 'math-q1-d', label: '(D)', content: 'The area bounded by $y = f(x)$ and the $x$-axis between $x = 0$ and $x = 2$ is $\\frac{1}{2}$', isCorrect: true },
    ],
    marks: 4,
    negativeMarks: -1,
    partialMarking: true,
    topics: ['Calculus', 'Application of Derivatives', 'Definite Integration'],
    subtopics: ['Local maxima and minima', 'Inflection points', 'Area under curve'],
    difficulty: 'medium',
    assets: [],
    verificationStatus: 'extraction_review',
    hasVisualization: true,
    hasSimulation: true,
    solution: {
      id: 'sol-math-q1',
      questionId: 'math-2026-p1-q1',
      summary: 'Analyze the cubic function using derivatives to find critical points, inflection points, and compute the definite integral.',
      approach: 'Find f\'(x), f\'\'(x), analyze critical points, and compute the definite integral.',
      steps: [
        { id: 's1', stepNumber: 1, title: 'Find f\'(x)', explanation: 'Differentiate: $f\'(x) = 3x^2 - 6x + 2$', equation: "f'(x) = 3x^2 - 6x + 2" },
        { id: 's2', stepNumber: 2, title: 'Find critical points', explanation: 'Set $f\'(x) = 0$: $3x^2 - 6x + 2 = 0$. Using the quadratic formula: $x = \\frac{6 \\pm \\sqrt{36-24}}{6} = 1 \\pm \\frac{1}{\\sqrt{3}}$', equation: 'x = 1 \\pm \\frac{1}{\\sqrt{3}}' },
        { id: 's3', stepNumber: 3, title: 'Determine nature of critical points', explanation: '$f\'\'(x) = 6x - 6$. At $x = 1 - 1/\\sqrt{3}$: $f\'\'< 0$ → local maximum. At $x = 1 + 1/\\sqrt{3}$: $f\'\' > 0$ → local minimum.', equation: "f''(x) = 6x - 6" },
        { id: 's4', stepNumber: 4, title: 'Find inflection points', explanation: '$f\'\'(x) = 0$ when $x = 1$. Only ONE point of inflection at $x = 1$. So option (C) is incorrect.', equation: "f''(x) = 0 \\Rightarrow x = 1" },
        { id: 's5', stepNumber: 5, title: 'Compute the area', explanation: 'Note that $f(x) = x(x-1)(x-2)$. The function changes sign at $x = 0, 1, 2$. Area $= \\int_0^1 f(x)\\,dx - \\int_1^2 f(x)\\,dx = \\frac{1}{4} + \\frac{1}{4} = \\frac{1}{2}$.', equation: '\\int_0^2 |f(x)|\\,dx = \\frac{1}{2}' },
      ],
      finalAnswer: 'Options (A), (B), and (D) are correct. Option (C) is incorrect — there is only ONE inflection point.',
      commonMistakes: [
        'Confusing the number of critical points with inflection points',
        'Not taking absolute value of f(x) when computing area between curve and x-axis',
      ],
      verificationStatus: 'extraction_review',
      source: 'ai_generated',
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },

  // MATHEMATICS - Q2
  {
    id: 'math-2026-p1-q2',
    sectionId: 'math-s1-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'mathematics',
    questionNumber: 2,
    questionType: 'multiple_correct',
    statement: `Let $z = x + iy$ be a complex number such that $|z - 2| = |z - 2i|$. Which of the following statement(s) is(are) correct?`,
    options: [
      { id: 'math-q2-a', label: '(A)', content: 'The locus of $z$ is a straight line passing through the origin', isCorrect: true },
      { id: 'math-q2-b', label: '(B)', content: 'The locus of $z$ is the perpendicular bisector of the line segment joining $(2, 0)$ and $(0, 2)$', isCorrect: true },
      { id: 'math-q2-c', label: '(C)', content: 'The equation of the locus is $x = y$', isCorrect: true },
      { id: 'math-q2-d', label: '(D)', content: '$z = 1 + i$ lies on the locus', isCorrect: true },
    ],
    marks: 4,
    negativeMarks: -1,
    partialMarking: true,
    topics: ['Complex Numbers', 'Locus'],
    difficulty: 'easy',
    assets: [],
    verificationStatus: 'extraction_review',
    hasVisualization: true,
    hasSimulation: false,
    solution: {
      id: 'sol-math-q2',
      questionId: 'math-2026-p1-q2',
      summary: 'The locus |z-z₁| = |z-z₂| is the perpendicular bisector of z₁z₂ in the Argand plane.',
      approach: 'Use the geometric interpretation of modulus equality.',
      steps: [
        { id: 's1', stepNumber: 1, title: 'Interpret geometrically', explanation: '$|z - 2| = |z - 2i|$ means the point $z$ is equidistant from $(2,0)$ and $(0,2)$ in the Argand plane. This is the perpendicular bisector of the segment joining these points.' },
        { id: 's2', stepNumber: 2, title: 'Find the equation', explanation: 'The midpoint of $(2,0)$ and $(0,2)$ is $(1,1)$. The slope of the segment is $\\frac{2-0}{0-2} = -1$. The perpendicular bisector has slope $1$ and passes through $(1,1)$: $y - 1 = 1(x - 1) \\Rightarrow y = x$.', equation: 'x = y' },
        { id: 's3', stepNumber: 3, title: 'Verify options', explanation: 'The line $x = y$ passes through the origin. $z = 1+i$ gives $x = y = 1$, which lies on the locus.' },
      ],
      finalAnswer: 'All options (A), (B), (C), (D) are correct.',
      verificationStatus: 'extraction_review',
      source: 'ai_generated',
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },

  // MATHEMATICS - Q3: Definite Integration (Numerical)
  {
    id: 'math-2026-p1-q3',
    sectionId: 'math-s3-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'mathematics',
    questionNumber: 3,
    questionType: 'integer_answer',
    statement: `The value of the integral $\\displaystyle\\int_0^{\\pi/2} \\frac{\\sin^2 x}{\\sin x + \\cos x} \\, dx$ can be written as $\\frac{1}{\\sqrt{a}} \\ln(\\sqrt{b} + c)$ where $a$, $b$, $c$ are positive integers. Find $a + b + c$.`,
    numericalAnswer: {
      value: 5,
      tolerance: 0,
    },
    marks: 4,
    negativeMarks: 0,
    partialMarking: false,
    topics: ['Definite Integration', 'Properties of Definite Integrals'],
    difficulty: 'hard',
    assets: [],
    verificationStatus: 'validated',
    hasVisualization: true,
    hasSimulation: false,
    solution: {
      id: 'sol-math-q3',
      questionId: 'math-2026-p1-q3',
      summary: 'Use King\'s property of definite integrals, add the two expressions to get 1/(sin x + cos x), and integrate using cosecant substitution.',
      approach: 'Apply King\'s rule I = ∫ f(a+b-x) dx, add equations, and simplify trigonometric form.',
      steps: [
        { id: 's1', stepNumber: 1, title: 'Apply King\'s Property', explanation: 'Let $I = \\int_0^{\\pi/2} \\frac{\\sin^2 x}{\\sin x + \\cos x} \\, dx$. Replacing $x \\to \\pi/2 - x$: $I = \\int_0^{\\pi/2} \\frac{\\cos^2 x}{\\cos x + \\sin x} \\, dx$.', equation: 'I = \\int_0^{\\pi/2} \\frac{\\cos^2 x}{\\sin x + \\cos x} \\, dx' },
        { id: 's2', stepNumber: 2, title: 'Add the two integrals', explanation: 'Adding the two expressions: $2I = \\int_0^{\\pi/2} \\frac{\\sin^2 x + \\cos^2 x}{\\sin x + \\cos x} \\, dx = \\int_0^{\\pi/2} \\frac{1}{\\sqrt{2}\\sin(x + \\pi/4)} \\, dx$.', equation: '2I = \\frac{1}{\\sqrt{2}} \\int_0^{\\pi/2} \\csc\\left(x + \\frac{\\pi}{4}\\right) \\, dx' },
        { id: 's3', stepNumber: 3, title: 'Evaluate the cosecant integral', explanation: 'Recall $\\int \\csc \\theta \\, d\\theta = \\ln|\\tan(\\theta/2)|$. For $\\theta = x + \\pi/4$, the limits are $\\pi/4$ to $3\\pi/4$. Thus, $\\ln \\frac{\\tan(3\\pi/8)}{\\tan(\\pi/8)} = \\ln \\frac{\\sqrt{2}+1}{\\sqrt{2}-1} = 2\\ln(\\sqrt{2}+1)$.', equation: '2I = \\frac{1}{\\sqrt{2}} \\cdot 2\\ln(\\sqrt{2} + 1) \\implies I = \\frac{1}{\\sqrt{2}}\\ln(\\sqrt{2}+1)' },
        { id: 's4', stepNumber: 4, title: 'Compare parameters and compute sum', explanation: 'Comparing $I = \\frac{1}{\\sqrt{2}}\\ln(\\sqrt{2}+1)$ with $\\frac{1}{\\sqrt{a}}\\ln(\\sqrt{b}+c)$: $a = 2$, $b = 2$, $c = 1$. Therefore, $a + b + c = 2 + 2 + 1 = 5$.', equation: 'a + b + c = 2 + 2 + 1 = 5' },
      ],
      finalAnswer: '5',
      commonMistakes: ['Forgetting that the left side had 2I after adding the two equations', 'Mistake in cosecant half-angle values tan(3π/8) = √2 + 1'],
      verificationStatus: 'validated',
      source: 'manual',
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },

  // CHEMISTRY - Q3: Organic
  {
    id: 'chem-2026-p1-q3',
    sectionId: 'chem-s2-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'chemistry',
    questionNumber: 3,
    questionType: 'single_correct',
    statement: `The major product of the reaction of 2-methylpropan-2-ol with concentrated HCl is:`,
    options: [
      { id: 'chem-q3-a', label: '(A)', content: '2-chloro-2-methylpropane (tert-butyl chloride)', isCorrect: true },
      { id: 'chem-q3-b', label: '(B)', content: '1-chloro-2-methylpropane (isobutyl chloride)', isCorrect: false },
      { id: 'chem-q3-c', label: '(C)', content: '2-methylpropene', isCorrect: false },
      { id: 'chem-q3-d', label: '(D)', content: '2-methyl-1-propanol', isCorrect: false },
    ],
    marks: 3,
    negativeMarks: -1,
    partialMarking: false,
    topics: ['Organic Chemistry', 'Nucleophilic Substitution', 'SN1 Reaction'],
    difficulty: 'easy',
    assets: [],
    verificationStatus: 'extraction_review',
    hasVisualization: false,
    hasSimulation: false,
    solution: {
      id: 'sol-chem-q3',
      questionId: 'chem-2026-p1-q3',
      summary: 'Tertiary alcohol with conc. HCl follows SN1 mechanism to form tertiary alkyl chloride.',
      approach: 'Identify the substrate type and predict the mechanism (SN1 for tertiary).',
      steps: [
        { id: 's1', stepNumber: 1, title: 'Identify substrate', explanation: '2-methylpropan-2-ol is a tertiary alcohol (tert-butanol).' },
        { id: 's2', stepNumber: 2, title: 'Determine mechanism', explanation: 'Tertiary alcohols react with HCl via SN1 mechanism: protonation of -OH, formation of stable 3° carbocation, nucleophilic attack by Cl⁻.' },
        { id: 's3', stepNumber: 3, title: 'Identify product', explanation: 'The product is 2-chloro-2-methylpropane (tert-butyl chloride).' },
      ],
      finalAnswer: 'Option (A): 2-chloro-2-methylpropane (tert-butyl chloride)',
      commonMistakes: ['Predicting SN2 product (primary chloride) instead of SN1 product'],
      verificationStatus: 'extraction_review',
      source: 'ai_generated',
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },

  // PHYSICS - Single Correct (Section 2)
  {
    id: 'phy-2026-p1-q5',
    sectionId: 'phy-s2-2026-p1',
    paperId: 'jee-adv-2026-p1',
    subject: 'physics',
    questionNumber: 5,
    questionType: 'single_correct',
    statement: `A projectile is fired from the ground with an initial speed $v_0$ at an angle $\\theta$ with the horizontal. The maximum height reached by the projectile is $H$ and the horizontal range is $R$. If $H = R/4$, then the angle of projection $\\theta$ is:`,
    options: [
      { id: 'phy-q5-a', label: '(A)', content: '$\\tan^{-1}(1) = 45°$', isCorrect: true },
      { id: 'phy-q5-b', label: '(B)', content: '$\\tan^{-1}(2)$', isCorrect: false },
      { id: 'phy-q5-c', label: '(C)', content: '$\\tan^{-1}(1/2)$', isCorrect: false },
      { id: 'phy-q5-d', label: '(D)', content: '$\\tan^{-1}(4)$', isCorrect: false },
    ],
    marks: 3,
    negativeMarks: -1,
    partialMarking: false,
    topics: ['Kinematics', 'Projectile Motion'],
    difficulty: 'easy',
    assets: [],
    verificationStatus: 'extraction_review',
    hasVisualization: true,
    hasSimulation: true,
    solution: {
      id: 'sol-phy-q5',
      questionId: 'phy-2026-p1-q5',
      summary: 'Using standard projectile formulas for H and R, the condition H = R/4 gives tan θ = 1, so θ = 45°.',
      approach: 'Use H = v₀²sin²θ/(2g) and R = v₀²sin(2θ)/g, then apply H = R/4.',
      steps: [
        { id: 's1', stepNumber: 1, title: 'Write formulas', explanation: '$H = \\frac{v_0^2 \\sin^2\\theta}{2g}$ and $R = \\frac{v_0^2 \\sin 2\\theta}{g}$', equation: 'H = \\frac{v_0^2 \\sin^2\\theta}{2g}, \\quad R = \\frac{v_0^2 \\sin 2\\theta}{g}' },
        { id: 's2', stepNumber: 2, title: 'Apply condition H = R/4', explanation: '$\\frac{v_0^2 \\sin^2\\theta}{2g} = \\frac{v_0^2 \\sin 2\\theta}{4g}$', equation: '\\frac{\\sin^2\\theta}{2} = \\frac{2\\sin\\theta\\cos\\theta}{4} = \\frac{\\sin\\theta\\cos\\theta}{2}' },
        { id: 's3', stepNumber: 3, title: 'Simplify', explanation: '$\\sin\\theta = \\cos\\theta \\Rightarrow \\tan\\theta = 1 \\Rightarrow \\theta = 45°$', equation: '\\theta = 45°' },
      ],
      finalAnswer: 'Option (A): θ = 45°',
      verificationStatus: 'extraction_review',
      source: 'ai_generated',
    },
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
  },
];

// Helper functions
export function getQuestionsByPaper(paperId: string): Question[] {
  return questions.filter(q => q.paperId === paperId);
}

export function getQuestionsBySubject(subject: string): Question[] {
  return questions.filter(q => q.subject === subject);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find(q => q.id === id);
}

export function getAvailableYears(): number[] {
  return [...new Set(papers.map(p => p.year))].sort((a, b) => b - a);
}

export function getAvailableTopics(subject?: string): string[] {
  const filteredQuestions = subject 
    ? questions.filter(q => q.subject === subject)
    : questions;
  const topics = new Set<string>();
  filteredQuestions.forEach(q => q.topics.forEach(t => topics.add(t)));
  return [...topics].sort();
}

export function getSectionForQuestion(questionId: string): QuestionSection | undefined {
  const question = getQuestionById(questionId);
  if (!question) return undefined;
  return sections.find(s => s.id === question.sectionId);
}

export function getPaperById(paperId: string): Paper | undefined {
  return papers.find(p => p.id === paperId);
}
