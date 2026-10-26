// Core types for ConceptX question bank and learning system

export type Subject = 'physics' | 'chemistry' | 'mathematics';

export type QuestionType = 
  | 'single_correct' 
  | 'multiple_correct' 
  | 'numerical' 
  | 'matching_list'
  | 'integer_answer'
  | 'paragraph_based';

export type VerificationStatus = 
  | 'draft' 
  | 'extraction_review' 
  | 'solution_review' 
  | 'simulation_review' 
  | 'validated' 
  | 'published';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'advanced';

export interface Examination {
  id: string;
  name: string;
  shortName: string;
  description: string;
}

export interface Paper {
  id: string;
  examinationId: string;
  year: number;
  paperNumber: number;
  title: string;
  totalMarks?: number;
  duration?: string; // e.g., "3 hours"
  sourceFile?: string;
}

export interface QuestionSection {
  id: string;
  paperId: string;
  subject: Subject;
  sectionNumber: number;
  title: string;
  instructions: string;
  questionType: QuestionType;
  marksPerQuestion?: number;
  negativeMarks?: number;
  partialMarking?: boolean;
}

export interface QuestionOption {
  id: string;
  label: string; // (A), (B), (C), (D) etc.
  content: string; // Can contain KaTeX
  isCorrect?: boolean; // Only set if answer is verified
}

export interface QuestionAsset {
  id: string;
  questionId: string;
  type: 'diagram' | 'figure' | 'table' | 'graph';
  url?: string;
  altText: string;
  svgContent?: string; // For inline SVG diagrams
  sourcePage?: number;
}

export interface Question {
  id: string;
  sectionId: string;
  paperId: string;
  subject: Subject;
  questionNumber: number;
  questionType: QuestionType;
  statement: string; // Can contain KaTeX markup
  options?: QuestionOption[];
  numericalAnswer?: {
    value: number;
    tolerance?: number;
    unit?: string;
  };
  marks: number;
  negativeMarks: number;
  partialMarking: boolean;
  topics: string[];
  subtopics?: string[];
  difficulty?: DifficultyLevel;
  assets: QuestionAsset[];
  verificationStatus: VerificationStatus;
  answerSource?: string;
  hasVisualization: boolean;
  hasSimulation: boolean;
  learningSpecification?: LearningSpecification;
  solution?: Solution;
  createdAt: string;
  updatedAt: string;
}

export interface Solution {
  id: string;
  questionId: string;
  summary: string;
  approach: string;
  steps: SolutionStep[];
  finalAnswer: string;
  commonMistakes?: string[];
  alternativeApproaches?: AlternativeApproach[];
  verificationStatus: VerificationStatus;
  source: 'manual' | 'ai_generated' | 'community' | 'official';
}

export interface SolutionStep {
  id: string;
  stepNumber: number;
  title: string;
  explanation: string;
  equation?: string; // KaTeX
  highlightIds?: string[];
  conceptUsed?: string;
}

export interface AlternativeApproach {
  id: string;
  title: string;
  description: string;
  steps: SolutionStep[];
}

// Visualization and Simulation Types

export type VisualizationType =
  | 'mechanics'
  | 'electric_field'
  | 'magnetic_field'
  | 'wave'
  | 'optics'
  | 'thermodynamics'
  | 'graph'
  | 'geometry'
  | 'conic_section'
  | 'molecular'
  | 'reaction_mechanism'
  | 'orbital'
  | 'number_line'
  | 'coordinate_geometry'
  | 'vector_3d'
  | 'complex_plane'
  | 'custom_diagram'
  | 'none';

export interface SimulationVariable {
  id: string;
  label: string;
  symbol?: string; // LaTeX symbol
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  currentValue?: number | string;
  unit?: string;
  description?: string;
}

export interface LearningSpecification {
  questionId: string;
  subject: Subject;
  topic: string;
  subtopic?: string;
  conceptSummary: string;
  governingLaw?: string;
  visualizationType: VisualizationType;
  variables: SimulationVariable[];
  steps: LearningStep[];
  assumptions: string[];
  keyEquations?: string[]; // KaTeX
  validationStatus: VerificationStatus;
  physicsModel?: PhysicsModel;
}

export interface LearningStep {
  id: string;
  stepNumber: number;
  title: string;
  explanation: string;
  equation?: string; // KaTeX
  highlightIds?: string[];
  visualState?: Record<string, number | string>;
}

export interface PhysicsModel {
  type: string;
  equations: ModelEquation[];
  constraints: string[];
  conservationLaws?: string[];
  initialConditions: Record<string, number>;
  computeState: string; // Function identifier, not arbitrary code
}

export interface ModelEquation {
  id: string;
  name: string;
  latex: string;
  description: string;
  variables: string[];
}

// AI Tutor Types

export type TutorMode = 
  | 'explain' 
  | 'hint' 
  | 'step_detail' 
  | 'change_conditions' 
  | 'find_mistake' 
  | 'alternative' 
  | 'test_understanding';

export interface TutorMessage {
  id: string;
  role: 'student' | 'tutor' | 'system';
  mode?: TutorMode;
  content: string;
  equations?: string[];
  concept?: string;
  assumptions?: string[];
  commonMisconception?: string;
  suggestedNextStep?: string;
  confidence?: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface TutorContext {
  questionId: string;
  subject: Subject;
  topic: string;
  questionStatement: string;
  currentStep?: number;
  studentAnswer?: string;
  simulationValues?: Record<string, number | string>;
  previousMessages: TutorMessage[];
}

// Student Progress Types

export interface StudentAttempt {
  id: string;
  questionId: string;
  userId?: string;
  selectedOptions?: string[];
  numericalAnswer?: number;
  isCorrect?: boolean;
  timeSpent?: number; // seconds
  hintsUsed: number;
  solutionRevealed: boolean;
  attemptedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  questionId: string;
  note?: string;
  createdAt: string;
}

export interface StudentNote {
  id: string;
  userId: string;
  questionId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Filter types for the explorer

export interface QuestionFilters {
  year?: number;
  paperNumber?: number;
  subject?: Subject;
  questionType?: QuestionType;
  topic?: string;
  difficulty?: DifficultyLevel;
  hasVisualization?: boolean;
  searchQuery?: string;
}
