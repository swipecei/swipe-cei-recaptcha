/*
  # Create gallery images table

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `category` (text)
      - `image_url` (text)
      - `alt_text` (text)
      - `display_order` (integer)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `gallery_images` table
    - Add policy for public read access
    - Add policy for authenticated admin access
*/

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'community',
  image_url text NOT NULL,
  alt_text text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active images
CREATE POLICY "Public can read active gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow authenticated users to manage all gallery images
CREATE POLICY "Authenticated users can manage gallery images"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images(display_order);

-- Insert sample data
INSERT INTO gallery_images (title, category, image_url, alt_text, display_order) VALUES
('Community Gathering', 'events', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//a.jpg', 'Community Gathering', 1),
('Neighborhood Outreach', 'community', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//b.jpg', 'Neighborhood Outreach', 2),
('Youth Leadership Workshop', 'youth', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//c.jpg', 'Youth Leadership Workshop', 3),
('Annual Celebration', 'events', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//d.jpg', 'Annual Celebration', 4),
('Community Service Day', 'community', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//e.jpg', 'Community Service Day', 5),
('Women Empowerment Summit', 'women', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//f.jpg', 'Women Empowerment Summit', 6),
('Health Fair', 'events', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//g.jpg', 'Health Fair', 7),
('Senior Appreciation', 'elderly', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//h.jpg', 'Senior Appreciation', 8),
('Food Drive Initiative', 'community', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//i.jpg', 'Food Drive Initiative', 9),
('Mentorship Program', 'youth', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//j.jpg', 'Mentorship Program', 10),
('Fundraising Gala', 'events', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//k.jpg', 'Fundraising Gala', 11),
('Professional Development', 'women', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//l.jpg', 'Professional Development', 12),
('Volunteer Training', 'community', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//m.jpg', 'Volunteer Training', 13),
('Senior Social Hour', 'elderly', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//n.jpg', 'Senior Social Hour', 14),
('Community Festival', 'events', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//o.jpg', 'Community Festival', 15),
('Skills Workshop', 'youth', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//p.jpg', 'Skills Workshop', 16),
('Neighborhood Cleanup', 'community', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//q.jpg', 'Neighborhood Cleanup', 17),
('Leadership Circle', 'women', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//r.jpg', 'Leadership Circle', 18),
('Holiday Celebration', 'events', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//s.jpg', 'Holiday Celebration', 19),
('Wellness Program', 'elderly', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//t.jpg', 'Wellness Program', 20),
('Resource Fair', 'community', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//u.jpg', 'Resource Fair', 21),
('Career Guidance', 'youth', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//v.jpg', 'Career Guidance', 22),
('Awards Ceremony', 'events', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//w.jpg', 'Awards Ceremony', 23),
('Networking Event', 'women', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//x.jpg', 'Networking Event', 24);