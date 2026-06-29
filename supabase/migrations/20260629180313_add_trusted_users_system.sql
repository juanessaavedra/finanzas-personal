-- Create trusted_users table
-- This table controls which email addresses are allowed to use the application
-- Users must be in this table to successfully sign up or sign in

CREATE TABLE public.trusted_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index for faster email lookups
CREATE INDEX idx_trusted_users_email ON public.trusted_users(email);
CREATE INDEX idx_trusted_users_active ON public.trusted_users(is_active) WHERE is_active = true;

-- Enable RLS on trusted_users table
ALTER TABLE public.trusted_users ENABLE ROW LEVEL SECURITY;

-- RLS policies for trusted_users table
-- Only authenticated users can view trusted users list
CREATE POLICY "Authenticated users can view trusted users"
  ON public.trusted_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Only allow specific admin operations (can be customized later)
CREATE POLICY "Service role can manage trusted users"
  ON public.trusted_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to check if an email is in the trusted users list
CREATE OR REPLACE FUNCTION public.is_trusted_user(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.trusted_users
    WHERE LOWER(email) = LOWER(user_email)
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate user during signup (used by auth hook)
CREATE OR REPLACE FUNCTION public.validate_trusted_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user's email is in the trusted users list
  IF NOT public.is_trusted_user(NEW.email) THEN
    RAISE EXCEPTION 'Email % is not authorized to use this application. Please contact an administrator.', NEW.email
      USING HINT = 'Only trusted users can register',
            ERRCODE = 'PEXTN';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to validate user on signup (before user is created in auth.users)
-- Note: This trigger is for additional validation in the database layer
-- The primary validation should be done via Supabase Auth Hook in config.toml
CREATE TRIGGER validate_trusted_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_trusted_user();

-- Function to add a trusted user (can be called by admins)
CREATE OR REPLACE FUNCTION public.add_trusted_user(
  user_email TEXT,
  user_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.trusted_users (email, added_by, notes)
  VALUES (
    LOWER(TRIM(user_email)),
    auth.uid(),
    user_notes
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove a trusted user (deactivate)
CREATE OR REPLACE FUNCTION public.remove_trusted_user(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.trusted_users
  SET is_active = false
  WHERE LOWER(email) = LOWER(user_email);

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reactivate a trusted user
CREATE OR REPLACE FUNCTION public.reactivate_trusted_user(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.trusted_users
  SET is_active = true
  WHERE LOWER(email) = LOWER(user_email);

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON TABLE public.trusted_users IS 'List of email addresses authorized to use the application. Users must be in this list to sign up or sign in.';
COMMENT ON FUNCTION public.is_trusted_user IS 'Check if an email address is in the trusted users list and active';
COMMENT ON FUNCTION public.add_trusted_user IS 'Add a new email to the trusted users list';
COMMENT ON FUNCTION public.remove_trusted_user IS 'Deactivate a trusted user (soft delete)';
COMMENT ON FUNCTION public.reactivate_trusted_user IS 'Reactivate a previously deactivated trusted user';
