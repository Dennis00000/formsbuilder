-- Create form_likes table
CREATE TABLE IF NOT EXISTS form_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(form_id, user_id)
);

-- Create form_comments table
CREATE TABLE IF NOT EXISTS form_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create RLS policies for form_likes
ALTER TABLE form_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all likes"
  ON form_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like forms"
  ON form_likes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can unlike their own likes"
  ON form_likes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create RLS policies for form_comments
ALTER TABLE form_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all comments"
  ON form_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can comment on forms"
  ON form_comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can edit their own comments"
  ON form_comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON form_comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid()); 