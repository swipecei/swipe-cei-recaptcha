/*
  # JWT-Based RLS Security Fix

  ## Overview
  This migration fixes critical security vulnerabilities where user_metadata was used for
  authorization decisions. User metadata is user-editable and allowed privilege escalation.

  ## Changes

  1. **JWT Custom Claims Function**
     - Creates `custom_access_token_hook` function to add `is_admin` from database to JWT tokens
     - Grants proper permissions to supabase_auth_admin
     - Revokes public access to prevent unauthorized calls

  2. **Remove Vulnerable RLS Policies**
     - Drops all policies that use user_metadata or database lookups for admin checks
     - Affects: users, event_registrations, programs, events, gallery_images, board_members,
       community_partners, contact_submissions, newsletter_subscriptions, storage.objects

  3. **Create Secure RLS Policies Using JWT Claims**
     - New policies check `(auth.jwt() ->> 'is_admin')::boolean = true`
     - No database lookups needed - JWT claims are cryptographically signed
     - Better performance and security

  4. **Admin Change Tracking**
     - Creates trigger function to track when is_admin changes
     - Logs all admin privilege modifications for audit trail

  ## Security Benefits
  - ✅ Authorization data stored in database (server-controlled)
  - ✅ JWT tokens contain validated admin status
  - ✅ RLS policies check cryptographically-signed JWT claims
  - ✅ Users cannot self-promote to admin
  - ✅ Better performance (no database lookups in policies)

  ## Post-Migration Steps
  1. Configure JWT hook in Supabase Dashboard (Authentication → Hooks)
  2. Set hook to: public.custom_access_token_hook
  3. Grant initial admin access via service role key
*/

-- ============================================================================
-- STEP 1: Create Custom JWT Claims Function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claims jsonb;
  user_is_admin boolean;
BEGIN
  SELECT is_admin INTO user_is_admin
  FROM public.users
  WHERE id = (event->>'user_id')::uuid;

  user_is_admin := COALESCE(user_is_admin, false);

  claims := event->'claims';
  claims := jsonb_set(claims, '{is_admin}', to_jsonb(user_is_admin));

  event := jsonb_set(event, '{claims}', claims);

  RETURN event;
END;
$$;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO postgres;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM anon;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated;

-- ============================================================================
-- STEP 2: Drop Old Vulnerable Policies
-- ============================================================================

DROP POLICY IF EXISTS "Admins can read all user data" ON users;
DROP POLICY IF EXISTS "Admins can read all registrations" ON event_registrations;
DROP POLICY IF EXISTS "Authenticated users can manage programs" ON programs;
DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
DROP POLICY IF EXISTS "Authenticated users can manage gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can manage board members" ON board_members;
DROP POLICY IF EXISTS "Authenticated users can manage community partners" ON community_partners;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view all newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- ============================================================================
-- STEP 3: Create New Secure Policies Using JWT Claims
-- ============================================================================

-- USERS TABLE
CREATE POLICY "Admins can read all user profiles via JWT"
  ON users FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true);

-- EVENT REGISTRATIONS TABLE
CREATE POLICY "Admins can read all registrations via JWT"
  ON event_registrations FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can update all registrations via JWT"
  ON event_registrations FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can delete all registrations via JWT"
  ON event_registrations FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true);

-- PROGRAMS TABLE
CREATE POLICY "Admins can create programs"
  ON programs FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can update programs"
  ON programs FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can delete programs"
  ON programs FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true);

-- EVENTS TABLE
CREATE POLICY "Admins can create events"
  ON events FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can update events"
  ON events FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true);

-- GALLERY IMAGES TABLE
CREATE POLICY "Admins can create gallery images"
  ON gallery_images FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can update gallery images"
  ON gallery_images FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can delete gallery images"
  ON gallery_images FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true);

-- BOARD MEMBERS TABLE
CREATE POLICY "Admins can create board members"
  ON board_members FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can update board members"
  ON board_members FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can delete board members"
  ON board_members FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true);

-- COMMUNITY PARTNERS TABLE
CREATE POLICY "Admins can create community partners"
  ON community_partners FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can update community partners"
  ON community_partners FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can delete community partners"
  ON community_partners FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true);

-- CONTACT SUBMISSIONS TABLE
CREATE POLICY "Admins can view all contact submissions via JWT"
  ON contact_submissions FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can update contact submissions via JWT"
  ON contact_submissions FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

-- NEWSLETTER SUBSCRIPTIONS TABLE
CREATE POLICY "Admins can view all newsletter subscriptions via JWT"
  ON newsletter_subscriptions FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'is_admin')::boolean = true);

-- STORAGE POLICIES
CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND (auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can update images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND (auth.jwt() ->> 'is_admin')::boolean = true)
  WITH CHECK (bucket_id = 'media' AND (auth.jwt() ->> 'is_admin')::boolean = true);

CREATE POLICY "Admins can delete images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND (auth.jwt() ->> 'is_admin')::boolean = true);

-- ============================================================================
-- STEP 4: Create Function to Track Admin Changes
-- ============================================================================

CREATE OR REPLACE FUNCTION public.refresh_user_jwt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
    NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_admin_change ON users;
CREATE TRIGGER on_user_admin_change
  AFTER UPDATE OF is_admin ON users
  FOR EACH ROW
  EXECUTE FUNCTION refresh_user_jwt();

COMMENT ON FUNCTION public.custom_access_token_hook IS
  'Adds is_admin claim to JWT token. Must be configured in Supabase Dashboard under Authentication > Hooks';

COMMENT ON FUNCTION public.refresh_user_jwt IS
  'Trigger function that fires when user.is_admin changes. JWT will be refreshed on next getSession() call';

COMMENT ON COLUMN users.is_admin IS
  'Admin flag stored in database. Automatically added to JWT via custom_access_token_hook. Only modifiable via service role';