/*
  # Create board members table

  1. New Tables
    - `board_members`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `title` (text, required) 
      - `email` (text, required)
      - `phone` (text, optional)
      - `bio` (text, optional)
      - `image_url` (text, optional)
      - `display_order` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `board_members` table
    - Add policy for public to read active board members
    - Add policy for authenticated users to manage board members

  3. Indexes
    - Index on `is_active` for filtering
    - Index on `display_order` for sorting
*/

CREATE TABLE IF NOT EXISTS board_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  email text NOT NULL,
  phone text,
  bio text,
  image_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Public can read active board members
CREATE POLICY "Public can read active board members"
  ON board_members
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage board members
CREATE POLICY "Authenticated users can manage board members"
  ON board_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_board_members_active ON board_members (is_active);
CREATE INDEX IF NOT EXISTS idx_board_members_order ON board_members (display_order);

-- Create trigger for updated_at
CREATE TRIGGER update_board_members_updated_at
  BEFORE UPDATE ON board_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();