-- Create forms table if it doesn't exist
CREATE TABLE IF NOT EXISTS forms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create forms"
    ON forms FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own forms"
    ON forms FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms"
    ON forms FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms"
    ON forms FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public forms"
    ON forms FOR SELECT
    TO anon, authenticated
    USING (is_public = true); 