-- Create assessments table to store assessment history
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  evaluation JSONB,
  primary_stage INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table for additional user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  total_assessments INTEGER DEFAULT 0,
  current_stage INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for assessments table
CREATE POLICY "Users can view their own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for user_profiles table
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update assessment count
CREATE OR REPLACE FUNCTION public.update_user_assessment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_profiles 
  SET 
    total_assessments = (
      SELECT COUNT(*) FROM public.assessments 
      WHERE user_id = NEW.user_id
    ),
    current_stage = NEW.primary_stage,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update user stats when assessment is completed
CREATE OR REPLACE TRIGGER on_assessment_completed
  AFTER INSERT ON public.assessments
  FOR EACH ROW EXECUTE PROCEDURE public.update_user_assessment_count();