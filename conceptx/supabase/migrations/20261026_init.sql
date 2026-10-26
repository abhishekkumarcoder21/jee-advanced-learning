-- ==============================================================================
-- ConceptX — Supabase PostgreSQL Schema & Migrations
-- Interactive Learning Platform for JEE Advanced
-- ==============================================================================

-- 1. Create custom enum types
CREATE TYPE subject_type AS ENUM ('physics', 'chemistry', 'mathematics');
CREATE TYPE question_kind AS ENUM (
  'single_correct', 
  'multiple_correct', 
  'numerical', 
  'matching_list', 
  'integer_answer', 
  'paragraph_based'
);
CREATE TYPE verification_stage AS ENUM (
  'draft', 
  'extraction_review', 
  'solution_review', 
  'simulation_review', 
  'validated', 
  'published'
);
CREATE TYPE difficulty_grade AS ENUM ('easy', 'medium', 'hard', 'advanced');

-- 2. Examinations Table
CREATE TABLE IF NOT EXISTS examinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. Papers Table
CREATE TABLE IF NOT EXISTS papers (
  id TEXT PRIMARY KEY,
  examination_id TEXT NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  paper_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  total_marks INTEGER DEFAULT 180,
  duration TEXT DEFAULT '3 hours',
  source_file TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. Sections Table
CREATE TABLE IF NOT EXISTS question_sections (
  id TEXT PRIMARY KEY,
  paper_id TEXT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  subject subject_type NOT NULL,
  section_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  instructions TEXT NOT NULL,
  question_type question_kind NOT NULL,
  marks_per_question NUMERIC(4, 2) DEFAULT 4.0,
  negative_marks NUMERIC(4, 2) DEFAULT -1.0,
  partial_marking BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 5. Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES question_sections(id) ON DELETE CASCADE,
  paper_id TEXT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  subject subject_type NOT NULL,
  question_number INTEGER NOT NULL,
  question_type question_kind NOT NULL,
  statement TEXT NOT NULL,
  numerical_answer NUMERIC(10, 4),
  numerical_tolerance NUMERIC(10, 4) DEFAULT 0,
  marks NUMERIC(4, 2) NOT NULL DEFAULT 4.0,
  negative_marks NUMERIC(4, 2) NOT NULL DEFAULT -1.0,
  partial_marking BOOLEAN NOT NULL DEFAULT FALSE,
  topics TEXT[] NOT NULL DEFAULT '{}',
  subtopics TEXT[] NOT NULL DEFAULT '{}',
  difficulty difficulty_grade DEFAULT 'medium',
  verification_status verification_stage NOT NULL DEFAULT 'extraction_review',
  answer_source TEXT,
  has_visualization BOOLEAN NOT NULL DEFAULT FALSE,
  has_simulation BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. Question Options Table
CREATE TABLE IF NOT EXISTS question_options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- '(A)', '(B)', etc.
  content TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 7. Solutions Table
CREATE TABLE IF NOT EXISTS solutions (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL UNIQUE REFERENCES questions(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  approach TEXT NOT NULL,
  final_answer TEXT NOT NULL,
  common_mistakes TEXT[] DEFAULT '{}',
  verification_status verification_stage NOT NULL DEFAULT 'extraction_review',
  source TEXT DEFAULT 'ai_generated',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 8. Solution Steps Table
CREATE TABLE IF NOT EXISTS solution_steps (
  id TEXT PRIMARY KEY,
  solution_id TEXT NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  equation TEXT,
  concept_used TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 9. Learning Specifications Table (Simulations & Models)
CREATE TABLE IF NOT EXISTS learning_specifications (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL UNIQUE REFERENCES questions(id) ON DELETE CASCADE,
  concept_summary TEXT NOT NULL,
  governing_law TEXT,
  visualization_type TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  assumptions TEXT[] DEFAULT '{}',
  key_equations TEXT[] DEFAULT '{}',
  physics_model JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 10. Student Attempts Table
CREATE TABLE IF NOT EXISTS student_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_options TEXT[] DEFAULT '{}',
  numerical_answer NUMERIC(10, 4),
  score NUMERIC(4, 2),
  is_full_marks BOOLEAN DEFAULT FALSE,
  is_partial BOOLEAN DEFAULT FALSE,
  hints_used INTEGER DEFAULT 0,
  solution_revealed BOOLEAN DEFAULT FALSE,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. Student Bookmarks Table
CREATE TABLE IF NOT EXISTS student_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(user_id, question_id)
);

-- 12. Student Notes Table
CREATE TABLE IF NOT EXISTS student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(user_id, question_id)
);

-- ==============================================================================
-- Indexes for Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_paper ON questions(paper_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(verification_status);
CREATE INDEX IF NOT EXISTS idx_attempts_question ON student_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON student_bookmarks(user_id);

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_notes ENABLE ROW LEVEL SECURITY;

-- Public read access for curriculum data
CREATE POLICY "Public read examinations" ON examinations FOR SELECT USING (true);
CREATE POLICY "Public read papers" ON papers FOR SELECT USING (true);
CREATE POLICY "Public read sections" ON question_sections FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Public read question_options" ON question_options FOR SELECT USING (true);
CREATE POLICY "Public read solutions" ON solutions FOR SELECT USING (true);
CREATE POLICY "Public read solution_steps" ON solution_steps FOR SELECT USING (true);
CREATE POLICY "Public read learning_specifications" ON learning_specifications FOR SELECT USING (true);

-- User-specific access for student progress
CREATE POLICY "Users can manage own attempts" ON student_attempts
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can manage own bookmarks" ON student_bookmarks
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can manage own notes" ON student_notes
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
