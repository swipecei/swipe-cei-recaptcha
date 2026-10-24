/*
  # Add Sample Upcoming Event for Testing

  1. New Event
    - Community Health & Wellness Fair
    - Scheduled for next month
    - Registration required
    - Linked to community partners
    - Complete schedule and features

  2. Purpose
    - Test event registration functionality
    - Verify upcoming events display
    - Test user dashboard integration
*/

-- Insert a sample upcoming event
INSERT INTO events (
  slug,
  title,
  subtitle,
  description,
  detailed_description,
  event_date,
  start_time,
  end_time,
  location,
  category,
  hero_image,
  features,
  schedule,
  partner_ids,
  registration_required,
  registration_cost,
  registration_deadline,
  walk_ins_welcome,
  is_active,
  display_order
) VALUES (
  'community-health-wellness-fair-2025',
  'Community Health & Wellness Fair 2025',
  'Your Health, Our Priority - Free Health Screenings & Wellness Resources',
  'Join us for a comprehensive health and wellness fair featuring free health screenings, wellness workshops, and resources for healthy living.',
  'Our annual Community Health & Wellness Fair brings together healthcare professionals, wellness experts, and community resources to provide comprehensive health services to our community.

This free event features:
- Free health screenings including blood pressure, diabetes, and cholesterol checks
- Wellness workshops on nutrition, exercise, and mental health
- Information booths from local healthcare providers
- Free healthy snacks and refreshments
- Children''s activities and health education
- Resource fair with community health organizations

Whether you''re looking to learn about healthy living, get important health screenings, or connect with healthcare resources in our community, this event has something for everyone. Bring your family and friends for a day focused on health and wellness.

No registration required, but we encourage you to arrive early as some screenings are available on a first-come, first-served basis.',
  '2025-03-15',
  '09:00:00',
  '15:00:00',
  'Charlotte Community Center, 123 Main Street, Charlotte, NC',
  'Health',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'Free health screenings (blood pressure, diabetes, cholesterol)',
    'Wellness workshops and educational sessions',
    'Information booths from local healthcare providers',
    'Free healthy snacks and refreshments',
    'Children''s activities and health education',
    'Resource fair with community organizations',
    'Free parking available',
    'Wheelchair accessible venue'
  ],
  JSONB_BUILD_ARRAY(
    JSONB_BUILD_OBJECT('time', '9:00 AM', 'activity', 'Registration & Welcome Coffee'),
    JSONB_BUILD_OBJECT('time', '9:30 AM', 'activity', 'Health Screenings Begin'),
    JSONB_BUILD_OBJECT('time', '10:00 AM', 'activity', 'Nutrition Workshop - "Eating for Energy"'),
    JSONB_BUILD_OBJECT('time', '11:00 AM', 'activity', 'Mental Health & Wellness Session'),
    JSONB_BUILD_OBJECT('time', '12:00 PM', 'activity', 'Healthy Lunch & Community Networking'),
    JSONB_BUILD_OBJECT('time', '1:00 PM', 'activity', 'Exercise & Movement Workshop'),
    JSONB_BUILD_OBJECT('time', '2:00 PM', 'activity', 'Resource Fair & Information Booths'),
    JSONB_BUILD_OBJECT('time', '3:00 PM', 'activity', 'Closing Remarks & Health Resource Packets')
  ),
  JSONB_BUILD_ARRAY(
    (SELECT id FROM community_partners WHERE name = 'Atrium Health' LIMIT 1),
    (SELECT id FROM community_partners WHERE name = 'Charlotte-Mecklenburg Schools' LIMIT 1),
    (SELECT id FROM community_partners WHERE name = 'YMCA of Greater Charlotte' LIMIT 1)
  ),
  false,
  'Free',
  NULL,
  true,
  true,
  1
);

-- Insert another sample event for variety
INSERT INTO events (
  slug,
  title,
  subtitle,
  description,
  detailed_description,
  event_date,
  start_time,
  end_time,
  location,
  category,
  hero_image,
  features,
  schedule,
  partner_ids,
  registration_required,
  registration_cost,
  registration_deadline,
  walk_ins_welcome,
  is_active,
  display_order
) VALUES (
  'youth-leadership-summit-2025',
  'Youth Leadership Summit 2025',
  'Empowering Tomorrow''s Leaders Today',
  'A dynamic leadership development program for young people aged 14-24, featuring workshops, mentorship, and networking opportunities.',
  'Our Youth Leadership Summit is designed to empower young people with the skills, confidence, and connections they need to become effective leaders in their communities.

This intensive one-day program includes:
- Interactive leadership workshops led by community leaders
- Peer-to-peer learning and collaboration activities
- Mentorship matching with local professionals
- College and career guidance sessions
- Community service project planning
- Networking lunch with successful young professionals
- Leadership certificate presentation

Participants will learn essential leadership skills including communication, problem-solving, team building, and community engagement. The summit is designed to be interactive and engaging, with plenty of opportunities for participants to practice new skills and connect with peers.

Registration is required and space is limited to ensure quality interaction and personalized attention. Lunch and materials are provided.',
  '2025-04-12',
  '08:30:00',
  '16:30:00',
  'Johnson C. Smith University, Charlotte, NC',
  'Youth',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'Interactive leadership workshops',
    'Peer-to-peer learning activities',
    'Mentorship matching program',
    'College and career guidance',
    'Community service project planning',
    'Networking opportunities',
    'Leadership certificate',
    'Lunch and materials provided'
  ],
  JSONB_BUILD_ARRAY(
    JSONB_BUILD_OBJECT('time', '8:30 AM', 'activity', 'Registration & Continental Breakfast'),
    JSONB_BUILD_OBJECT('time', '9:00 AM', 'activity', 'Welcome & Icebreaker Activities'),
    JSONB_BUILD_OBJECT('time', '9:30 AM', 'activity', 'Leadership Fundamentals Workshop'),
    JSONB_BUILD_OBJECT('time', '10:45 AM', 'activity', 'Communication Skills Session'),
    JSONB_BUILD_OBJECT('time', '12:00 PM', 'activity', 'Networking Lunch with Mentors'),
    JSONB_BUILD_OBJECT('time', '1:00 PM', 'activity', 'Team Building & Problem Solving'),
    JSONB_BUILD_OBJECT('time', '2:30 PM', 'activity', 'Community Service Project Planning'),
    JSONB_BUILD_OBJECT('time', '3:45 PM', 'activity', 'Action Planning & Goal Setting'),
    JSONB_BUILD_OBJECT('time', '4:15 PM', 'activity', 'Certificate Presentation & Closing')
  ),
  JSONB_BUILD_ARRAY(
    (SELECT id FROM community_partners WHERE name = 'Johnson C. Smith University' LIMIT 1),
    (SELECT id FROM community_partners WHERE name = 'Charlotte-Mecklenburg Schools' LIMIT 1),
    (SELECT id FROM community_partners WHERE name = 'YMCA of Greater Charlotte' LIMIT 1)
  ),
  true,
  'Free',
  '2025-04-05',
  false,
  true,
  2
);

-- Insert a third sample event
INSERT INTO events (
  slug,
  title,
  subtitle,
  description,
  detailed_description,
  event_date,
  start_time,
  end_time,
  location,
  category,
  hero_image,
  features,
  schedule,
  partner_ids,
  registration_required,
  registration_cost,
  registration_deadline,
  walk_ins_welcome,
  is_active,
  display_order
) VALUES (
  'senior-appreciation-dinner-2025',
  'Senior Appreciation Dinner 2025',
  'Celebrating Our Community Elders',
  'An elegant evening celebrating the wisdom, contributions, and stories of our senior community members.',
  'Join us for a special evening dedicated to honoring and celebrating our senior community members. This elegant dinner event recognizes the invaluable contributions, wisdom, and experiences of our elders.

The evening will feature:
- Welcome reception with light appetizers
- Three-course dinner prepared by local chefs
- Live entertainment featuring local musicians
- Recognition ceremony for outstanding seniors
- Storytelling session - "Wisdom from Our Elders"
- Dancing and social time
- Professional photography to capture memories
- Transportation assistance available

This is more than just a dinner - it''s a celebration of the rich history and ongoing contributions of our senior community members. We''ll hear inspiring stories, recognize achievements, and create new memories together.

The event is designed to be accessible and comfortable for all attendees, with assistance available as needed. Family members and caregivers are welcome to attend.',
  '2025-05-18',
  '17:00:00',
  '21:00:00',
  'Charlotte Convention Center, Grand Ballroom',
  'Elderly',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'Welcome reception with appetizers',
    'Three-course dinner',
    'Live entertainment and music',
    'Recognition ceremony',
    'Storytelling session',
    'Dancing and social time',
    'Professional photography',
    'Transportation assistance available'
  ],
  JSONB_BUILD_ARRAY(
    JSONB_BUILD_OBJECT('time', '5:00 PM', 'activity', 'Welcome Reception & Registration'),
    JSONB_BUILD_OBJECT('time', '5:30 PM', 'activity', 'Cocktail Hour & Appetizers'),
    JSONB_BUILD_OBJECT('time', '6:30 PM', 'activity', 'Welcome Remarks & Dinner Service'),
    JSONB_BUILD_OBJECT('time', '7:30 PM', 'activity', 'Live Entertainment'),
    JSONB_BUILD_OBJECT('time', '8:00 PM', 'activity', 'Recognition Ceremony'),
    JSONB_BUILD_OBJECT('time', '8:30 PM', 'activity', 'Storytelling - "Wisdom from Our Elders"'),
    JSONB_BUILD_OBJECT('time', '9:00 PM', 'activity', 'Dancing & Social Time'),
    JSONB_BUILD_OBJECT('time', '9:30 PM', 'activity', 'Closing Remarks & Photo Opportunities')
  ),
  JSONB_BUILD_ARRAY(
    (SELECT id FROM community_partners WHERE name = 'Charlotte-Mecklenburg Library' LIMIT 1),
    (SELECT id FROM community_partners WHERE name = 'Atrium Health' LIMIT 1)
  ),
  true,
  '$25 per person (Scholarships available)',
  '2025-05-10',
  false,
  true,
  3
);