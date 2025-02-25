ALTER TABLE forms ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add RLS policy for public forms
CREATE POLICY "Anyone can view public forms"
  ON forms FOR SELECT
  TO anon
  USING (is_public = true); 