-- Migration for Multi-Test Assessment Platform
-- This migration transforms the single Kohlberg assessment into a platform supporting multiple test types

-- Create test_types table to define available assessments
CREATE TABLE IF NOT EXISTS test_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL, -- 'personality', 'skills', 'values', 'cognitive'
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  question_count INTEGER NOT NULL,
  estimated_duration_minutes INTEGER,
  evaluation_method TEXT NOT NULL, -- 'ai_analysis', 'multiple_choice', 'hybrid'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_variants table for different versions of tests (e.g., multiple choice vs free text)
CREATE TABLE IF NOT EXISTS test_variants (
  id TEXT PRIMARY KEY,
  test_type_id TEXT REFERENCES test_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  variant_type TEXT NOT NULL, -- 'multiple_choice', 'free_text', 'hybrid'
  is_default BOOLEAN DEFAULT false,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update assessments table to support multiple test types
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS test_type_id TEXT;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS test_variant_id TEXT;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS test_version INTEGER DEFAULT 1;

-- Add foreign keys for the new columns
-- Note: We'll make these nullable initially to handle existing data
ALTER TABLE assessments ADD CONSTRAINT fk_assessments_test_type 
  FOREIGN KEY (test_type_id) REFERENCES test_types(id);
ALTER TABLE assessments ADD CONSTRAINT fk_assessments_test_variant 
  FOREIGN KEY (test_variant_id) REFERENCES test_variants(id);

-- Create user_test_results table for aggregated results per test type
CREATE TABLE IF NOT EXISTS user_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_type_id TEXT REFERENCES test_types(id) ON DELETE CASCADE,
  latest_score JSONB, -- Store structured results (e.g., {"stage": 4, "confidence": "medium"})
  assessment_count INTEGER DEFAULT 1,
  first_taken_at TIMESTAMP WITH TIME ZONE,
  last_taken_at TIMESTAMP WITH TIME ZONE,
  progress_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, test_type_id)
);

-- Enhance user_profiles for comprehensive tracking
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS test_results_summary JSONB DEFAULT '{}';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS personality_vector JSONB DEFAULT '{}';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS skills_vector JSONB DEFAULT '{}';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS values_vector JSONB DEFAULT '{}';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS timezone TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_test_types_category ON test_types(category);
CREATE INDEX IF NOT EXISTS idx_test_types_active ON test_types(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_assessments_test_type ON assessments(test_type_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_test_results_user ON user_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_test_results_test_type ON user_test_results(test_type_id);

-- Enable RLS for new tables
ALTER TABLE test_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_test_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for test_types (public read, admin write)
CREATE POLICY "Test types are viewable by everyone" ON test_types
  FOR SELECT USING (is_active = true);

-- RLS policies for test_variants (public read, admin write) 
CREATE POLICY "Test variants are viewable by everyone" ON test_variants
  FOR SELECT USING (true);

-- RLS policies for user_test_results
CREATE POLICY "Users can view their own test results" ON user_test_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results" ON user_test_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test results" ON user_test_results
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert initial test types
INSERT INTO test_types (id, name, description, short_description, category, tags, question_count, estimated_duration_minutes, evaluation_method) VALUES
('kohlberg_moral', 'Kohlberg Moral Development', 'Assess your stage of moral reasoning based on Lawrence Kohlberg''s theory of moral development', 'Discover your moral reasoning stage', 'values', '{"morals", "ethics", "development"}', 3, 15, 'ai_analysis'),
('big_five_personality', 'Big Five Personality', 'Comprehensive personality assessment based on the five-factor model (OCEAN)', 'Explore your personality dimensions', 'personality', '{"personality", "traits", "psychology"}', 50, 25, 'multiple_choice'),
('communication_skills', 'Communication Skills Assessment', 'Evaluate your communication effectiveness across different contexts and situations', 'Assess your communication abilities', 'skills', '{"communication", "interpersonal", "professional"}', 30, 20, 'multiple_choice'),
('project_management', 'Project Management Competency', 'Assess your project management skills and leadership capabilities', 'Measure your PM skills', 'skills', '{"management", "leadership", "planning"}', 35, 25, 'multiple_choice');

-- Insert test variants
INSERT INTO test_variants (id, test_type_id, name, description, variant_type, is_default) VALUES
('kohlberg_moral_freetext', 'kohlberg_moral', 'Free Text Analysis', 'Answer open-ended scenarios with detailed reasoning', 'free_text', true),
('kohlberg_moral_multiple', 'kohlberg_moral', 'Multiple Choice', 'Select from predefined responses to moral dilemmas', 'multiple_choice', false),
('big_five_standard', 'big_five_personality', 'Standard Assessment', 'Traditional Big Five questionnaire with Likert scale', 'multiple_choice', true),
('communication_standard', 'communication_skills', 'Standard Assessment', 'Comprehensive communication skills evaluation', 'multiple_choice', true),
('project_management_standard', 'project_management', 'Standard Assessment', 'Project management competency evaluation', 'multiple_choice', true);

-- Function to update user test results when assessment is completed
CREATE OR REPLACE FUNCTION public.update_user_test_results()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user test result summary
  INSERT INTO public.user_test_results (
    user_id, 
    test_type_id, 
    latest_score, 
    assessment_count,
    first_taken_at,
    last_taken_at
  ) VALUES (
    NEW.user_id,
    NEW.test_type_id,
    NEW.evaluation,
    1,
    NEW.completed_at,
    NEW.completed_at
  )
  ON CONFLICT (user_id, test_type_id) 
  DO UPDATE SET
    latest_score = NEW.evaluation,
    assessment_count = user_test_results.assessment_count + 1,
    last_taken_at = NEW.completed_at,
    updated_at = NOW();
  
  -- Update user profile summary
  UPDATE public.user_profiles 
  SET 
    test_results_summary = COALESCE(test_results_summary, '{}'::JSONB) || 
      JSONB_BUILD_OBJECT(NEW.test_type_id, NEW.evaluation),
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for test result updates
CREATE OR REPLACE TRIGGER on_assessment_test_result
  AFTER INSERT ON public.assessments
  FOR EACH ROW 
  WHEN (NEW.test_type_id IS NOT NULL)
  EXECUTE PROCEDURE public.update_user_test_results();

-- Update existing Kohlberg assessments to have test_type_id
UPDATE assessments 
SET 
  test_type_id = 'kohlberg_moral',
  test_variant_id = 'kohlberg_moral_freetext'
WHERE test_type_id IS NULL;

-- Add NOT NULL constraints after data migration
-- ALTER TABLE assessments ALTER COLUMN test_type_id SET NOT NULL;
-- ALTER TABLE assessments ALTER COLUMN test_variant_id SET NOT NULL;