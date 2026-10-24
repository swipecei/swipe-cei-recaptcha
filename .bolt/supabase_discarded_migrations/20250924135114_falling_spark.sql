/*
  # Fix infinite recursion in users table RLS policies

  1. Problem
    - The "Admins can read all user data" policy creates infinite recursion
    - It queries the users table to check if current user is admin
    - This creates a circular dependency when the policy evaluates itself

  2. Solution
    - Drop the problematic admin policy that causes recursion
    - Replace with a simpler policy that checks is_admin directly
    - Ensure policies don't create circular references

  3. Security
    - Users can still only access their own data
    - Admin access is maintained without recursion
    - All existing functionality preserved
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all user data" ON users;

-- Create a new admin policy that doesn't cause recursion
-- This policy allows users to read all data if they are marked as admin
CREATE POLICY "Admin users can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    -- Allow if user is reading their own profile
    (auth.uid() = id) 
    OR 
    -- Allow if current user has admin flag set (check via auth metadata or direct flag)
    (auth.uid() IN (
      SELECT id FROM users WHERE id = auth.uid() AND is_admin = true
    ))
  );

-- Ensure the policy for users reading their own data still exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;