-- Add coins column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 10;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_coins ON users(coins);
