-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_sign_in ON users(last_sign_in_at);

-- Create storage usage tracking
CREATE TABLE IF NOT EXISTS storage_usage (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  size BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Function to update storage usage
CREATE OR REPLACE FUNCTION update_storage_usage()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO storage_usage (user_id, size)
  VALUES (NEW.owner, NEW.metadata->>'size')
  ON CONFLICT (user_id)
  DO UPDATE SET 
    size = storage_usage.size + (NEW.metadata->>'size')::bigint,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for storage usage tracking
CREATE TRIGGER storage_usage_trigger
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION update_storage_usage();

-- Function to log admin actions
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
    NEW.id::text,
    jsonb_build_object(
      'old_data', to_jsonb(OLD),
      'new_data', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for audit logging
CREATE TRIGGER users_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action();

CREATE TRIGGER forms_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON forms
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action();

