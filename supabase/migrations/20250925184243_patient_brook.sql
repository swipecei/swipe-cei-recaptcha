/*
  # Insert Board Members Data

  1. Data Insertion
    - Insert all 12 board members with their contact information
    - Set appropriate display order based on hierarchy (President, VP, Treasurer, etc.)
    - All members set as active by default

  2. Member Roles
    - Executive officers (President, VP, Treasurer, Chaplain)
    - Board members
    - Consultants
    - Honorary board member

  3. Contact Information
    - Names, titles, emails, and phone numbers for all members
    - Proper formatting and data validation
*/

INSERT INTO board_members (name, title, email, phone, display_order, is_active) VALUES
  ('Joyce Reid', 'President', 'ejr5309@aol.com', '704-231-3614', 1, true),
  ('Lisa Bryan', 'Vice President', 'lisa.k.bryan@hotmail.com', '704-804-9028', 2, true),
  ('Devonne Wallace', 'Treasurer', 'devonnefoxx@gmail.com', '704-618-8893', 3, true),
  ('Blossom Cooper', 'Chaplain', 'blossomcooper@att.net', '704-953-0638', 4, true),
  ('Tanita Alexander', 'Board Member', 'TanitaAlexander44@gmail.com', '704-906-7086', 5, true),
  ('Beverly Hunt', 'Board Member', 'bwhunt@bellsouth.net', '704-608-1411', 6, true),
  ('Michael Nance', 'Board Member', 'monance74@yahoo.com', '980-240-6708', 7, true),
  ('Beverly Rogers', 'Board Member', 'beverly.r.rogers062@gmail.com', '704-582-1961', 8, true),
  ('David Torrence', 'Board Member', 'dtorrence722@gmail.com', '404-388-4891', 9, true),
  ('Ramona Brooks', 'Consultant', 'rnbrooks21@gmail.com', '704-819-9357', 10, true),
  ('Jason Brooks', 'Consultant', 'jbrooks207@gmail.com', '704-562-4157', 11, true),
  ('Adrienne Turner', 'Honorary Board Member', 'ad.henderson101@gmail.com', '704-891-5917', 12, true);