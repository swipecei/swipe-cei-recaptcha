/*
  # Fix Custom Access Token Hook Return Value

  ## Issue
  The custom access token hook was returning only custom claims, but Supabase requires
  the hook to return the complete event object with all required JWT fields.

  ## Changes
  1. Update `custom_access_token_hook` function to:
     - Accept the full event object with existing claims
     - Merge the custom `is_admin` claim into existing claims
     - Return the complete event object with merged claims
  
  ## Security
  - Maintains existing RLS integration
  - Preserves all required JWT fields (aud, exp, iat, sub, email, phone, role, aal, session_id, is_anonymous)
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS public.custom_access_token_hook(event jsonb);

-- Recreate the function with correct return structure
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_is_admin boolean;
BEGIN
  -- Get the user_id from the event
  SELECT is_admin INTO user_is_admin
  FROM public.users
  WHERE id = (event->'user_id')::text::uuid;

  -- If user not found, default to false
  IF user_is_admin IS NULL THEN
    user_is_admin := false;
  END IF;

  -- Merge the custom claim into the existing claims
  -- This preserves all required JWT fields while adding our custom claim
  RETURN jsonb_set(
    event,
    '{claims}',
    (event->'claims') || jsonb_build_object('is_admin', user_is_admin)
  );
END;
$$;

-- Grant execute permission to supabase_auth_admin
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;

-- Revoke from public for security
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM authenticated, anon, public;

COMMENT ON FUNCTION public.custom_access_token_hook IS 'Adds is_admin claim to JWT tokens by merging with existing claims';
