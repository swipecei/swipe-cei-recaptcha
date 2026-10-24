/*
  # Create programs table

  1. New Tables
    - `programs`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - Program name
      - `subtitle` (text) - Program tagline
      - `description` (text) - Short description
      - `detailed_description` (text) - Full description
      - `icon` (text) - Icon name for display
      - `gradient` (text) - CSS gradient classes
      - `hero_image` (text) - Hero image URL
      - `target_audience` (text) - Who the program serves
      - `duration` (text) - Program duration
      - `location` (text) - Program location
      - `features` (jsonb) - Array of program features
      - `outcomes` (jsonb) - Array of expected outcomes
      - `testimonials` (jsonb) - Array of testimonials
      - `upcoming_events` (jsonb) - Array of upcoming events
      - `is_active` (boolean) - Whether program is active
      - `display_order` (integer) - Sort order
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `programs` table
    - Add policy for public read access to active programs
    - Add policy for authenticated users to manage programs
*/

CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  detailed_description text,
  icon text DEFAULT 'Users',
  gradient text DEFAULT 'from-[#5d00c1] to-[#4a0096]',
  hero_image text,
  target_audience text,
  duration text,
  location text DEFAULT 'Charlotte Metro Area',
  features jsonb DEFAULT '[]'::jsonb,
  outcomes jsonb DEFAULT '[]'::jsonb,
  testimonials jsonb DEFAULT '[]'::jsonb,
  upcoming_events jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Public can read active programs
CREATE POLICY "Public can read active programs"
  ON programs
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage all programs
CREATE POLICY "Authenticated users can manage programs"
  ON programs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs (is_active);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs (slug);
CREATE INDEX IF NOT EXISTS idx_programs_order ON programs (display_order);

-- Insert initial program data
INSERT INTO programs (
  slug, title, subtitle, description, detailed_description, icon, gradient, hero_image,
  target_audience, duration, features, outcomes, testimonials, upcoming_events, display_order
) VALUES 
(
  'youth-empowerment',
  'Youth Empowerment',
  'Building Tomorrow''s Leaders Today',
  'Comprehensive mentorship, leadership development, and life skills training designed to empower young people aged 12-25 with the tools they need for success.',
  'Our Youth Empowerment program is designed to nurture the next generation of community leaders. We believe that every young person has the potential to make a positive impact, and our comprehensive approach ensures they have the tools, support, and opportunities needed to succeed.

Through personalized mentorship, participants are paired with experienced community leaders who provide guidance, support, and real-world insights. Our leadership training modules cover essential skills including communication, problem-solving, teamwork, and decision-making.

The program also includes practical life skills workshops covering financial literacy, time management, goal setting, and professional development. We work closely with local schools and community organizations to provide educational support and career guidance tailored to each participant''s interests and goals.',
  'Users',
  'from-[#5d00c1] via-[#7b2cbf] to-[#9d4edd]',
  'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//youth.jpg',
  'Young people aged 12-25',
  'Ongoing programs throughout the year',
  '["Leadership Training", "Mentorship Programs", "Life Skills Workshops", "Career Guidance", "Educational Support"]'::jsonb,
  '["Improved academic performance and graduation rates", "Enhanced leadership and communication skills", "Increased self-confidence and self-esteem", "Better preparation for college and career opportunities", "Stronger community connections and civic engagement"]'::jsonb,
  '[{"quote": "The mentorship program changed my life. I learned skills I never knew I needed and gained confidence to pursue my dreams.", "author": "Former Program Participant"}]'::jsonb,
  '[{"title": "Youth Leadership Summit", "date": "April 20, 2024", "time": "9:00 AM - 5:00 PM", "description": "Annual gathering of young leaders for workshops, networking, and skill development."}]'::jsonb,
  1
),
(
  'elder-care',
  'Elder Care & Support',
  'Honoring Our Community Elders',
  'Compassionate companionship, practical assistance, and meaningful community connections for our cherished elderly community members.',
  'Our Elder Care & Support program recognizes the invaluable contributions our senior community members have made and continues to provide them with the dignity, respect, and support they deserve.

We offer regular companionship visits to combat isolation and loneliness, providing meaningful social interaction and emotional support. Our volunteers are trained to engage seniors in conversation, activities, and provide a caring presence.

Transportation assistance helps seniors maintain their independence by providing rides to medical appointments, grocery shopping, and social activities. We also offer health and wellness programs including exercise classes, nutrition education, and health screenings.

Our technology support helps seniors stay connected with family and friends through digital literacy training, helping them navigate smartphones, tablets, and video calling platforms.',
  'Heart',
  'from-[#00c019] via-[#00d41a] to-[#00e81b]',
  'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//elder.jpg',
  'Senior citizens aged 65+',
  'Year-round support services',
  '["Companionship Visits", "Transportation Assistance", "Health & Wellness Programs", "Social Activities", "Technology Support"]'::jsonb,
  '["Reduced social isolation and loneliness", "Improved access to essential services and healthcare", "Enhanced quality of life and well-being", "Stronger intergenerational connections", "Increased digital literacy and connectivity"]'::jsonb,
  '[{"quote": "The volunteers who visit me have become like family. They brighten my week and help me stay connected to the community.", "author": "Program Participant"}]'::jsonb,
  '[{"title": "Senior Appreciation Gala", "date": "May 10, 2024", "time": "6:00 PM - 9:00 PM", "description": "Celebrating our elderly community members with dinner, entertainment, and recognition."}]'::jsonb,
  2
),
(
  'womens-empowerment',
  'Women''s Empowerment',
  'Empowering Women to Lead and Succeed',
  'Professional development, entrepreneurship support, and personal growth programs designed to uplift and empower women in our community.',
  'Our Women''s Empowerment program is dedicated to supporting women in achieving their personal and professional goals. We provide comprehensive resources, training, and networking opportunities to help women build confidence, develop skills, and create meaningful connections.

Our business training workshops cover entrepreneurship basics, business planning, marketing strategies, and financial management. We provide mentorship from successful businesswomen and connect participants with resources for starting or growing their businesses.

Financial literacy sessions help women take control of their financial future through budgeting, saving, investing, and credit management education. We also offer personal development workshops focusing on leadership skills, communication, and work-life balance.

Regular networking events provide opportunities for women to connect, share experiences, and build professional relationships that can lead to new opportunities and collaborations.',
  'BookOpen',
  'from-[#5d00c1] via-[#7b2cbf] to-[#9d4edd]',
  'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//women%20program.jpg',
  'Women of all ages and backgrounds',
  'Monthly workshops and ongoing support',
  '["Business Training", "Financial Literacy", "Networking Events", "Personal Development", "Leadership Skills"]'::jsonb,
  '["Increased business and entrepreneurship skills", "Improved financial literacy and independence", "Enhanced leadership and professional capabilities", "Stronger professional networks and mentorship relationships", "Greater self-confidence and personal empowerment"]'::jsonb,
  '[{"quote": "The business training program gave me the confidence and skills to start my own company. The support network has been invaluable.", "author": "Program Graduate"}]'::jsonb,
  '[{"title": "Women in Business Workshop", "date": "March 25, 2024", "time": "10:00 AM - 3:00 PM", "description": "Comprehensive workshop on entrepreneurship and business development for women."}]'::jsonb,
  3
),
(
  'community-outreach',
  'Community Outreach',
  'Meeting Immediate Needs with Compassion',
  'Direct assistance through food drives, clothing donations, and emergency support for families and individuals facing challenges.',
  'Our Community Outreach program provides immediate assistance to families and individuals facing economic hardship, crisis situations, or other challenges. We believe that everyone deserves access to basic necessities and support during difficult times.

Our food pantry services provide nutritious meals and groceries to families experiencing food insecurity. We partner with local food banks, grocery stores, and community gardens to ensure fresh, healthy options are available.

Regular clothing drives collect and distribute clothing for all ages and seasons, with special focus on professional attire for job interviews, school uniforms for children, and warm clothing during winter months.

Emergency relief services provide rapid response support for families facing unexpected crises such as job loss, medical emergencies, or housing instability. We connect families with resources and provide temporary assistance to help them get back on their feet.

Our holiday programs ensure that families can celebrate special occasions with dignity, providing holiday meals, gifts for children, and festive activities that bring joy during challenging times.',
  'Gift',
  'from-[#00c019] via-[#00d41a] to-[#00e81b]',
  'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//l.jpg',
  'Families and individuals in need',
  'Ongoing support and seasonal programs',
  '["Food Pantry Services", "Clothing Drives", "Emergency Relief", "Holiday Programs", "Resource Connection"]'::jsonb,
  '["Reduced food insecurity and hunger in the community", "Improved access to essential clothing and household items", "Faster recovery from crisis situations", "Enhanced community resilience and support networks", "Increased awareness of available community resources"]'::jsonb,
  '[{"quote": "When we lost our home in a fire, SWIPE CE was there immediately with food, clothing, and emotional support. They helped us rebuild our lives.", "author": "Community Member"}]'::jsonb,
  '[{"title": "Community Health & Wellness Fair", "date": "March 15, 2024", "time": "10:00 AM - 4:00 PM", "description": "Free health screenings, wellness resources, and community connections for all ages."}]'::jsonb,
  4
);