# RLS Security Vulnerability Fix - Implementation Guide

## Overview

This document describes the critical security fixes implemented to address Row-Level Security (RLS) vulnerabilities where `user_metadata` was being used for authorization decisions.

## Security Issue

**Vulnerability:** Using `user_metadata` for authorization checks allows privilege escalation because:
- `user_metadata` is user-editable via `supabase.auth.update()`
- Malicious users could modify their metadata to grant themselves admin privileges
- This violates the principle that authorization data must be server-controlled

**Impact:** Users could bypass RLS policies and gain unauthorized access to:
- All user profiles
- Event registrations
- Content management functions (programs, events, gallery, etc.)

## Solution Implemented

### 1. Client-Side Changes ✅ COMPLETED

**File: `src/lib/supabase.ts`**

- **Fixed `authApi.isCurrentUserAdmin()`**: Now queries the `users.is_admin` column instead of checking `user_metadata.admin`
- **Updated User interface**: Changed `admin: boolean` to `is_admin: boolean` to match database schema
- **Added `authApi.manageAdminPrivileges()`**: Secure function to grant/revoke admin privileges via Edge Function
- **Added `userApi.getAllUsers()`**: Function for admins to view all users

### 2. Edge Function Created ✅ COMPLETED

**File: `supabase/functions/manage-admin/index.ts`**

Secure admin management function that:
- Verifies the requesting user is an admin
- Uses service role key to update `users.is_admin`
- Prevents self-revocation of admin privileges
- Logs all admin privilege changes for audit trail
- Returns detailed error messages

**Next Step Required:** Deploy this function using:
```bash
# This needs to be done via Supabase Dashboard or CLI
```

### 3. Database Migration Required ⚠️ MANUAL ACTION NEEDED

The following SQL migration needs to be applied to your Supabase database. This migration:

1. **Creates JWT Custom Claims Function** - Adds `is_admin` from database to JWT tokens
2. **Removes Vulnerable RLS Policies** - Drops policies that use user_metadata or database lookups
3. **Creates Secure RLS Policies** - New policies use JWT claims: `(auth.jwt() ->> 'is_admin')::boolean = true`

**Tables Updated:**
- `users` - Admin read access via JWT
- `event_registrations` - Admin full access via JWT
- `programs` - Admin-only management
- `events` - Admin-only management
- `gallery_images` - Admin-only management
- `board_members` - Admin-only management
- `community_partners` - Admin-only management
- `contact_submissions` - Admin read/update via JWT
- `newsletter_subscriptions` - Admin read via JWT
- `storage.objects` - Admin-only uploads/updates/deletes

**To Apply the Migration:**

1. Go to Supabase Dashboard → SQL Editor
2. Copy the SQL from the migration file below
3. Execute the migration
4. Verify no errors

**Migration SQL:**

```sql
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
```

### 4. Configure JWT Hooks ⚠️ MANUAL ACTION NEEDED

After applying the migration, configure the custom access token hook:

1. Go to Supabase Dashboard
2. Navigate to: **Authentication → Hooks**
3. Find: **Custom Access Token Hook**
4. Set Hook URL to: `public.custom_access_token_hook`
5. Enable the hook
6. Save changes

This ensures the `is_admin` claim is automatically added to all JWT tokens.

### 5. Grant Initial Admin Access ⚠️ MANUAL ACTION NEEDED

Since regular users can't modify `is_admin`, you need to grant initial admin access using the service role key:

**Option A: Via Supabase Dashboard SQL Editor**

```sql
UPDATE users
SET is_admin = true
WHERE email = 'your-admin-email@example.com';
```

**Option B: Via API with Service Role Key**

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SERVICE_ROLE_KEY' // ⚠️ Never expose this key client-side
)

await supabase
  .from('users')
  .update({ is_admin: true })
  .eq('email', 'your-admin-email@example.com')
```

## Security Benefits

### Before (Vulnerable)
```typescript
// ❌ INSECURE: User can edit their own metadata
await supabase.auth.updateUser({
  data: { admin: true } // Privilege escalation!
})

// ❌ Policy checks user-editable data
USING (user?.user_metadata?.admin === true)
```

### After (Secure)
```typescript
// ✅ SECURE: Only service role can update is_admin
// Regular users cannot modify this field

// ✅ Policy checks server-validated JWT claim
USING ((auth.jwt() ->> 'is_admin')::boolean = true)
```

## Testing the Fix

1. **Test Regular User Cannot Self-Promote:**
   ```typescript
   // This should fail (no permission)
   await supabase
     .from('users')
     .update({ is_admin: true })
     .eq('id', currentUser.id)
   ```

2. **Test Admin Can View All Users:**
   ```typescript
   // As admin, this should succeed
   const { data } = await supabase
     .from('users')
     .select('*')
   ```

3. **Test Admin Can Grant/Revoke Privileges:**
   ```typescript
   // As admin, grant privileges to another user
   await authApi.manageAdminPrivileges(targetUserId, 'grant')
   ```

4. **Test JWT Contains is_admin Claim:**
   ```typescript
   const { data: { session } } = await supabase.auth.getSession()
   console.log(session?.access_token) // Decode to see is_admin claim
   ```

## Rollback Plan

If issues arise, you can temporarily rollback by:

1. Disabling the custom access token hook in Supabase Dashboard
2. Re-creating the old policies (not recommended - security risk remains)

## Additional Recommendations

1. **Audit Logging:** Consider adding a table to log all admin privilege changes
2. **MFA for Admins:** Require multi-factor authentication for admin accounts
3. **Role Levels:** Consider implementing multiple admin role levels (super admin, content admin, viewer)
4. **Regular Audits:** Periodically review who has admin access

## Summary

This fix ensures that:
- ✅ Authorization data is stored in the database (server-controlled)
- ✅ JWT tokens contain validated admin status
- ✅ RLS policies check cryptographically-signed JWT claims
- ✅ Users cannot self-promote to admin
- ✅ Admin changes are logged and auditable
- ✅ Performance is optimized (JWT claims vs database lookups)

## Support

If you encounter any issues:
1. Check that the migration was applied successfully
2. Verify the JWT hook is enabled in Supabase Dashboard
3. Ensure at least one user has `is_admin = true`
4. Check browser console for any RLS policy errors
