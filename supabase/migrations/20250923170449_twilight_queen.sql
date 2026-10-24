/*
  # Create Events and Community Partners Tables

  1. New Tables
    - `community_partners`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `logo_url` (text)
      - `website_url` (text, optional)
      - `description` (text, optional)
      - `is_active` (boolean, default true)
      - `display_order` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `title` (text)
      - `subtitle` (text, optional)
      - `description` (text)
      - `detailed_description` (text, optional)
      - `event_date` (date)
      - `start_time` (time)
      - `end_time` (time, optional)
      - `location` (text)
      - `category` (text)
      - `hero_image` (text, optional)
      - `features` (jsonb array)
      - `schedule` (jsonb array)
      - `partner_ids` (jsonb array of partner IDs)
      - `registration_required` (boolean, default false)
      - `registration_cost` (text, default 'Free')
      - `registration_deadline` (date, optional)
      - `walk_ins_welcome` (boolean, default true)
      - `is_active` (boolean, default true)
      - `display_order` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access and authenticated admin access

  3. Sample Data
    - Insert community partners from Partners.tsx
    - Insert sample events with comprehensive information
*/

-- Create community_partners table
CREATE TABLE IF NOT EXISTS community_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  logo_url text NOT NULL,
  website_url text,
  description text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  detailed_description text,
  event_date date NOT NULL,
  start_time time NOT NULL,
  end_time time,
  location text NOT NULL,
  category text NOT NULL DEFAULT 'Community',
  hero_image text,
  features jsonb DEFAULT '[]'::jsonb,
  schedule jsonb DEFAULT '[]'::jsonb,
  partner_ids jsonb DEFAULT '[]'::jsonb,
  registration_required boolean DEFAULT false,
  registration_cost text DEFAULT 'Free',
  registration_deadline date,
  walk_ins_welcome boolean DEFAULT true,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE community_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for community_partners
CREATE POLICY "Public can read active community partners"
  ON community_partners
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage community partners"
  ON community_partners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for events
CREATE POLICY "Public can read active events"
  ON events
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_partners_active ON community_partners (is_active);
CREATE INDEX IF NOT EXISTS idx_community_partners_order ON community_partners (display_order);
CREATE INDEX IF NOT EXISTS idx_events_active ON events (is_active);
CREATE INDEX IF NOT EXISTS idx_events_date ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events (slug);
CREATE INDEX IF NOT EXISTS idx_events_order ON events (display_order);

-- Insert community partners data
INSERT INTO community_partners (name, logo_url, website_url, display_order) VALUES
('Samaritan''s Feet', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/Partners/SAMF_Linear.png', 'https://samaritansfeet.org', 1),
('Truist', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/Partners/Truist.png', 'https://truist.com', 2),
('YMCA', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/Partners/clipart2705208.png', 'https://ymca.org', 3),
('Bank of America', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/Partners/Bank-of-America-Emblem.png', 'https://bankofamerica.com', 4),
('Target', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/Partners/Target-logo-1.png', 'https://target.com', 5),
('Charlotte Mecklenburg Schools', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/Partners/CMS.png', 'https://cms.k12.nc.us', 6),
('The AME Zion Church', 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media/Partners/logo%20amez%20with%20%20point%20copia%20(1).png', 'https://amez.org', 7);

-- Insert sample events
INSERT INTO events (
  slug, title, subtitle, description, detailed_description, event_date, start_time, end_time, 
  location, category, hero_image, features, schedule, partner_ids, 
  registration_required, registration_cost, walk_ins_welcome, display_order
) VALUES
(
  'community-health-wellness-fair',
  'Community Health & Wellness Fair',
  'Free Health Screenings & Wellness Resources',
  'Join us for a comprehensive health and wellness fair featuring free health screenings, wellness resources, and community connections for all ages.',
  'Our annual Community Health & Wellness Fair brings together healthcare professionals, wellness experts, and community resources to provide comprehensive health services and education to our community.

This free event offers health screenings, educational workshops, wellness demonstrations, and connections to local healthcare resources. Whether you''re looking to learn about healthy living, get important health screenings, or connect with healthcare providers, this event has something for everyone.

We believe that access to healthcare and wellness resources should be available to all community members, regardless of their circumstances. This event embodies our commitment to promoting health equity and community well-being.',
  '2024-03-15',
  '10:00:00',
  '16:00:00',
  'Charlotte Community Center, 123 Main St, Charlotte, NC',
  'Health',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  '["Free blood pressure and diabetes screenings", "BMI and wellness assessments", "Nutrition counseling and healthy cooking demos", "Mental health resources and counseling", "Children''s health activities and education", "Senior wellness programs", "Community resource fair", "Free healthy snacks and refreshments"]'::jsonb,
  '[{"time": "10:00 AM", "activity": "Registration & Welcome"}, {"time": "10:30 AM", "activity": "Health Screenings Begin"}, {"time": "11:00 AM", "activity": "Nutrition Workshop"}, {"time": "12:00 PM", "activity": "Healthy Lunch & Networking"}, {"time": "1:00 PM", "activity": "Mental Health Resources Session"}, {"time": "2:00 PM", "activity": "Senior Wellness Activities"}, {"time": "3:00 PM", "activity": "Children''s Health Education"}, {"time": "4:00 PM", "activity": "Closing & Resource Distribution"}]'::jsonb,
  '[]'::jsonb,
  false,
  'Free',
  true,
  1
),
(
  'youth-leadership-summit',
  'Youth Leadership Summit',
  'Empowering Tomorrow''s Leaders Today',
  'Annual gathering of young leaders for workshops, networking, and skill development focused on leadership, community engagement, and personal growth.',
  'The Youth Leadership Summit is our flagship annual event designed to inspire, educate, and empower young people aged 14-25 to become effective leaders in their communities.

This intensive one-day summit features interactive workshops, keynote presentations from successful young leaders, networking opportunities, and hands-on leadership activities. Participants will develop essential leadership skills, learn about community engagement, and connect with peers who share their passion for making a positive impact.

Our summit focuses on practical leadership skills that young people can immediately apply in their schools, communities, and future careers. We believe that investing in youth leadership today creates stronger communities tomorrow.',
  '2024-04-20',
  '09:00:00',
  '17:00:00',
  'Johnson C. Smith University, Charlotte, NC',
  'Youth',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  '["Interactive leadership workshops", "Keynote presentations from young leaders", "Networking sessions with peers and mentors", "Community service project planning", "Personal development sessions", "College and career guidance", "Leadership certificate upon completion", "Lunch and materials provided"]'::jsonb,
  '[{"time": "9:00 AM", "activity": "Registration & Continental Breakfast"}, {"time": "9:30 AM", "activity": "Opening Keynote: Leadership in Action"}, {"time": "10:30 AM", "activity": "Workshop Session 1: Communication Skills"}, {"time": "11:30 AM", "activity": "Networking Break"}, {"time": "12:00 PM", "activity": "Workshop Session 2: Team Building"}, {"time": "1:00 PM", "activity": "Lunch & Peer Networking"}, {"time": "2:00 PM", "activity": "Panel: Young Leaders in Our Community"}, {"time": "3:00 PM", "activity": "Workshop Session 3: Project Planning"}, {"time": "4:00 PM", "activity": "Action Planning & Next Steps"}, {"time": "4:30 PM", "activity": "Certificate Ceremony & Closing"}]'::jsonb,
  '[]'::jsonb,
  true,
  'Free (Registration Required)',
  false,
  2
),
(
  'senior-appreciation-gala',
  'Senior Appreciation Gala',
  'Celebrating Our Community Elders',
  'An elegant evening celebrating our elderly community members with dinner, entertainment, and recognition of their contributions to our community.',
  'The Senior Appreciation Gala is our annual celebration honoring the wisdom, experience, and invaluable contributions of our elderly community members. This elegant evening brings together seniors, their families, and community supporters for an unforgettable night of recognition and celebration.

The gala features a formal dinner, live entertainment, awards ceremony recognizing outstanding seniors, and opportunities for intergenerational connection. We believe in honoring those who have paved the way for our community''s success and ensuring they feel valued and celebrated.

This event also serves as a fundraiser to support our ongoing senior programs and services, ensuring we can continue providing essential support to elderly community members throughout the year.',
  '2024-05-10',
  '18:00:00',
  '21:00:00',
  'Charlotte Convention Center, Charlotte, NC',
  'Elderly',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  '["Elegant three-course dinner", "Live musical entertainment", "Senior achievement awards ceremony", "Professional photography", "Dancing and social activities", "Recognition of community volunteers", "Silent auction fundraiser", "Transportation assistance available"]'::jsonb,
  '[{"time": "6:00 PM", "activity": "Registration & Cocktail Reception"}, {"time": "6:30 PM", "activity": "Welcome & Opening Remarks"}, {"time": "7:00 PM", "activity": "Three-Course Dinner Service"}, {"time": "8:00 PM", "activity": "Live Musical Entertainment"}, {"time": "8:30 PM", "activity": "Senior Achievement Awards"}, {"time": "9:00 PM", "activity": "Dancing & Social Time"}, {"time": "9:30 PM", "activity": "Silent Auction Results"}, {"time": "10:00 PM", "activity": "Closing Remarks & Transportation"}, {"time": "10:30 PM", "activity": "Event Conclusion"}]'::jsonb,
  '[]'::jsonb,
  true,
  '$25 per person (Scholarships available)',
  false,
  3
);