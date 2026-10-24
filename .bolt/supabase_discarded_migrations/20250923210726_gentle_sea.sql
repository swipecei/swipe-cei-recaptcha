/*
  # Enable RLS for Event Registrations

  1. Security Changes
    - Enable RLS on `event_registrations` table
    - Add policy for users to read only their own registrations
    - Add policy for users to update only their own registrations
    - Add policy for users to delete only their own registrations
    - Add policy for admins to read all registrations

  2. Important Notes
    - This ensures users can only see their own event registrations
    - Admins can view all registrations for management purposes
    - Maintains data privacy and security
*/

-- Enable RLS on event_registrations table
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Policy for users to read only their own registrations
CREATE POLICY "Users can read own registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to update only their own registrations
CREATE POLICY "Users can update own registrations"
  ON event_registrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete only their own registrations
CREATE POLICY "Users can delete own registrations"
  ON event_registrations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to create registrations for themselves
CREATE POLICY "Users can create own registrations"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for admins to read all registrations
CREATE POLICY "Admins can read all registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );