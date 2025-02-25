-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (managed by Supabase Auth)
-- Note: We don't need to create this as Supabase Auth handles it

-- Create forms table
CREATE TABLE forms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create responses table
CREATE TABLE responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create comments table
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create likes table
CREATE TABLE likes (
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (form_id, user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Forms policies
CREATE POLICY "Users can view public forms" ON forms
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own forms" ON forms
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own forms" ON forms
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms" ON forms
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms" ON forms
    FOR DELETE USING (auth.uid() = user_id);

-- Responses policies
CREATE POLICY "Users can view responses to their forms" ON responses
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM forms WHERE id = form_id
        )
    );

CREATE POLICY "Users can create responses to public forms" ON responses
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (SELECT 1 FROM forms WHERE id = form_id AND (is_public = true OR user_id = auth.uid()))
    );

-- Comments policies
CREATE POLICY "Anyone can view comments on public forms" ON comments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM forms WHERE id = form_id AND is_public = true)
    );

CREATE POLICY "Users can view comments on their forms" ON comments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM forms WHERE id = form_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes count" ON likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON likes
    FOR ALL USING (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_forms_updated_at
    BEFORE UPDATE ON forms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

