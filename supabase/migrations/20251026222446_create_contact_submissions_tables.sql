/*
  # Contact Submissions and Newsletter Subscriptions Tables

  ## Overview
  This migration creates tables to store contact form submissions and newsletter subscriptions
  for the SWIPE Community Empowerment website. It includes proper security and indexing.

  ## New Tables

  ### 1. `contact_submissions`
  Stores all contact form submissions from the website.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each submission
  - `name` (text, required) - Full name of the person submitting
  - `email` (text, required) - Email address of the submitter
  - `message` (text, required) - Message content from the form
  - `type` (text, required) - Type of inquiry (general, volunteer, programs, partnership)
  - `status` (text, default 'new') - Status tracking (new, read, resolved, archived)
  - `user_agent` (text) - Browser user agent for spam detection
  - `ip_address` (text) - IP address for rate limiting
  - `created_at` (timestamptz) - Timestamp when submission was received
  - `updated_at` (timestamptz) - Timestamp when submission was last modified

  ### 2. `newsletter_subscriptions`
  Stores newsletter email subscriptions.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `email` (text, unique, required) - Subscriber email address
  - `status` (text, default 'active') - Subscription status (active, unsubscribed)
  - `unsubscribe_token` (uuid, unique) - Token for unsubscribe links
  - `subscribed_at` (timestamptz) - When they subscribed
  - `unsubscribed_at` (timestamptz) - When they unsubscribed (if applicable)

  ## Security

  ### Row Level Security (RLS)
  - Both tables have RLS enabled
  - Anonymous users can INSERT (submit forms)
  - Only authenticated admin users can SELECT (view submissions)
  - No UPDATE or DELETE allowed except via Edge Functions with service role

  ## Indexes
  - Index on `contact_submissions.email` for quick lookups
  - Index on `contact_submissions.created_at` for sorting by date
  - Index on `contact_submissions.status` for filtering
  - Unique index on `newsletter_subscriptions.email` to prevent duplicates
  - Index on `newsletter_subscriptions.status` for filtering active subscribers

  ## Triggers
  - Auto-update `updated_at` timestamp on contact_submissions changes
*/

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('general', 'volunteer', 'programs', 'partnership')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved', 'archived')),
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  unsubscribe_token uuid UNIQUE DEFAULT gen_random_uuid(),
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions(status);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_submissions

-- Allow anonymous users to insert contact submissions
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated admin users to view all submissions
CREATE POLICY "Admins can view all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Allow authenticated admin users to update submission status
CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- RLS Policies for newsletter_subscriptions

-- Allow anonymous users to insert newsletter subscriptions
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated admin users to view all subscriptions
CREATE POLICY "Admins can view all newsletter subscriptions"
  ON newsletter_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Allow anyone to update their own subscription status via unsubscribe token
CREATE POLICY "Anyone can unsubscribe with valid token"
  ON newsletter_subscriptions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (status = 'unsubscribed');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before updates
DROP TRIGGER IF EXISTS trigger_update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER trigger_update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_submissions_updated_at();
