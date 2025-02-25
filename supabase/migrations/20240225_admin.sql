-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add role column to users if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add essential indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create audit logging function
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    metadata
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id)::text,
    jsonb_build_object(
      'old_data', to_jsonb(OLD),
      'new_data', to_jsonb(NEW)
    )
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers
CREATE TRIGGER users_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action();

