-- Add role column to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create storage bucket for form images and avatars
INSERT INTO storage.buckets (id, name) 
VALUES ('forms', 'forms') 
ON CONFLICT DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'forms' AND storage.foldername(name) = 'public');

CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'forms' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name) = 'public' OR storage.foldername(name) = auth.uid()::text)
  );

CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE WITH CHECK (
    bucket_id = 'forms' 
    AND auth.uid()::text = storage.foldername(name)
  );

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'forms' 
    AND auth.uid()::text = storage.foldername(name)
  );

