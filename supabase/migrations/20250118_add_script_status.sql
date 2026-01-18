-- Add status column to ideas table
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scripted';

-- Add index for status for better query performance
CREATE INDEX IF NOT EXISTS ideas_status_idx ON ideas(status);
