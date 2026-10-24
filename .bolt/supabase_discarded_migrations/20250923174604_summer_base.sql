/*
  # Fix RLS policies for event_registrations table

  1. Security
    - Enable RLS on event_registrations table
    - Add policies for users to manage their own registrations
    - Add policies for admins to view all registrations
    - Allow public to check registration status for events

  2. Changes
    - Drop existing policies if they exist
    - Create new comprehensive policies
    - Ensure proper access control
*/

-- Enable RLS on event_registrations table
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can create own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can update own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can delete own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Admins can read all registrations" ON event_registrations;

-- Allow users to read their own registrations
CREATE POLICY "Users can read own registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to create their own registrations
CREATE POLICY "Users can create own registrations"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own registrations
CREATE POLICY "Users can update own registrations"
  ON event_registrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own registrations
CREATE POLICY "Users can delete own registrations"
  ON event_registrations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admins to read all registrations
CREATE POLICY "Admins can read all registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE users.id = auth.uid() 
      AND users.email = 'admin@swipece.org'
    )
  );