/*
  # Add is_admin column to users table

  1. Changes
    - Add `is_admin` boolean column to `users` table with default value `false`
    - Update RLS policies to allow admins to read all user data
    - Add index on is_admin column for performance

  2. Security
    - Only authenticated users can update their own profiles (existing policy)
    - Admins can read all user data for admin functions
    - Default value is false for security
*/

-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Add index for performance when querying admin users
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- Add policy for admins to read all user data (for admin functions)
CREATE POLICY "Admins can read all user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );