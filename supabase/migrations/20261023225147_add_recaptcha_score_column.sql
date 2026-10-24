/*
# Add reCAPTCHA score column to contact_submissions

## Overview
This migration adds a `recaptcha_score` column to the `contact_submissions` table
to store the spam-protection trust score (0.0 to 1.0) returned by Google reCAPTCHA v3
for each contact form submission. This allows admins to review score patterns over time.

## Changes
- Added `recaptcha_score` (numeric, nullable) to `contact_submissions`
  - Stores the reCAPTCHA v3 score from 0.0 (likely bot) to 1.0 (likely human)
  - Nullable because the column is new and existing rows don't have a score

## Security
- No changes to RLS policies or grants — the column is only written by the
  edge function using the service role key, and read by authenticated admins
  via the existing SELECT policy.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions'
    AND column_name = 'recaptcha_score'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN recaptcha_score numeric;
  END IF;
END $$;
