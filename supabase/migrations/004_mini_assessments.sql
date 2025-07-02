-- Add fields to support mini-assessments and session tracking
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS session_number INTEGER DEFAULT 1;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS questions_count INTEGER DEFAULT 3;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS assessment_type VARCHAR(50) DEFAULT 'mini';

-- Add index for better performance when querying user assessments
CREATE INDEX IF NOT EXISTS idx_assessments_user_completed ON assessments(user_id, completed_at DESC);

-- Update user profiles to track mini-assessment progress
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_session_date TIMESTAMP WITH TIME ZONE;

-- Update the trigger function to handle mini-assessments
CREATE OR REPLACE FUNCTION public.update_user_assessment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_profiles 
  SET 
    total_assessments = (
      SELECT COUNT(*) FROM public.assessments 
      WHERE user_id = NEW.user_id
    ),
    total_sessions = (
      SELECT COUNT(DISTINCT session_number) FROM public.assessments 
      WHERE user_id = NEW.user_id
    ),
    current_stage = NEW.primary_stage,
    last_session_date = NEW.completed_at,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 