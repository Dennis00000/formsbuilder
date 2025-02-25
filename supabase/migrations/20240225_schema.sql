-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT false,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (form_id, user_id)
);

-- Add role column to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Enable Row Level Security
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Forms policies
CREATE POLICY "Users can view public forms"
  ON forms FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own forms"
  ON forms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own forms"
  ON forms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms"
  ON forms FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms"
  ON forms FOR DELETE
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments on public forms"
  ON comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM forms
    WHERE id = form_id AND is_public = true
  ));

CREATE POLICY "Users can view comments on their forms"
  ON comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM forms
    WHERE id = form_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON likes FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_created_at ON forms(created_at);
CREATE INDEX IF NOT EXISTS idx_forms_is_public ON forms(is_public);

