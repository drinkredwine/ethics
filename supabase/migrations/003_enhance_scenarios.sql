-- Add fields to scenarios table for better tracking
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS generation_model TEXT;
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- Create table to track which scenarios users have seen
CREATE TABLE IF NOT EXISTS user_scenario_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, scenario_id, assessment_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_user_scenario_history_user_id ON user_scenario_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_scenario_history_scenario_id ON user_scenario_history(scenario_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_ai_generated ON scenarios(ai_generated, locale, is_active);
CREATE INDEX IF NOT EXISTS idx_scenarios_usage_count ON scenarios(usage_count);

-- Enable RLS on user_scenario_history
ALTER TABLE user_scenario_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own scenario history" ON user_scenario_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scenario history" ON user_scenario_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to get scenario count by locale
CREATE OR REPLACE FUNCTION get_scenario_count(p_locale TEXT DEFAULT 'en')
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM scenarios 
    WHERE locale = p_locale AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unused scenarios for a user
CREATE OR REPLACE FUNCTION get_unused_scenarios_for_user(
  p_user_id UUID,
  p_locale TEXT DEFAULT 'en',
  p_limit INTEGER DEFAULT 2
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  options JSONB,
  locale VARCHAR(5),
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  ai_generated BOOLEAN,
  generation_model TEXT,
  usage_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.title, s.description, s.options, s.locale, s.is_active, 
         s.created_at, s.updated_at, s.ai_generated, s.generation_model, s.usage_count
  FROM scenarios s
  WHERE s.locale = p_locale 
    AND s.is_active = true
    AND s.id NOT IN (
      SELECT DISTINCT scenario_id 
      FROM user_scenario_history 
      WHERE user_id = p_user_id
    )
  ORDER BY s.usage_count ASC, RANDOM()
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;