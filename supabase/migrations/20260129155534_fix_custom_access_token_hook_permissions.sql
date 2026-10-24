/*
  # Fix Custom Access Token Hook Permissions

  ## Problem
  The custom access token hook was failing with "permission denied for table users" error.
  This happened because the auth hook function couldn't read from the users table due to RLS restrictions.

  ## Solution
  1. Grant SELECT permission on users table to supabase_auth_admin role
  2. Add RLS policy allowing supabase_auth_admin to bypass normal restrictions
  3. Recreate the custom_access_token_hook function with proper security settings

  ## Security Notes
  - The supabase_auth_admin role is a system role used by Supabase Auth internally
  - Granting it SELECT access to users table is safe and necessary for auth hooks
  - The function uses SECURITY DEFINER to run with elevated privileges
  - The search_path is set to 'public' to prevent SQL injection attacks
*/

-- Grant SELECT permission on users table to the auth admin role
GRANT SELECT ON public.users TO supabase_auth_admin;

-- Create RLS policy allowing supabase_auth_admin to read all users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Auth admin can read all users for hooks'
  ) THEN
    CREATE POLICY "Auth admin can read all users for hooks"
      ON public.users
      FOR SELECT
      TO supabase_auth_admin
      USING (true);
  END IF;
END $$;

-- Recreate the custom access token hook function with proper security
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  user_is_admin boolean;
BEGIN
  -- Query the users table to get the is_admin flag
  SELECT is_admin
  INTO user_is_admin
  FROM public.users
  WHERE id = (event->>'user_id')::uuid;

  -- If user not found in users table, default to false
  IF user_is_admin IS NULL THEN
    user_is_admin := false;
  END IF;

  -- Return the claims to be added to the JWT
  RETURN jsonb_build_object(
    'claims',
    jsonb_build_object(
      'is_admin', user_is_admin
    )
  );
END;
$$;

-- Grant execute permission to supabase_auth_admin
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;

-- Add comment explaining the function
COMMENT ON FUNCTION public.custom_access_token_hook(jsonb) IS 
'Custom access token hook that adds is_admin claim to JWT tokens. Called by Supabase Auth during authentication.';
