/*
  # Add admin policy to view all user profiles

  1. Security Changes
    - Add policy for admins to read all user data in admin dashboard
    - Uses direct email check to avoid recursion issues
    - Maintains existing user privacy for non-admin users

  2. Policy Details
    - Allows users with email 'admin@swipece.org' to read all user profiles
    - Prevents infinite recursion by using auth.email() instead of querying users table
    - Enables admin dashboard functionality for user management
*/

-- Add policy for admin to read all user data
CREATE POLICY "Admin can read all user profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'admin@swipece.org');