-- Fix column names to match the Java entities

-- Step 1: Check if old column exists and rename it
-- For users table - rename SubscriptionPlan to subscription_plan
ALTER TABLE users 
CHANGE COLUMN SubscriptionPlan subscription_plan VARCHAR(50);

-- If the above fails because column doesn't exist, try adding it:
-- ALTER TABLE users ADD COLUMN subscription_plan VARCHAR(50) DEFAULT 'Basic';

-- Step 2: Update all NULL values to 'Basic'
UPDATE users 
SET subscription_plan = 'Basic' 
WHERE subscription_plan IS NULL OR subscription_plan = '';

-- Step 3: Verify the change
SELECT id, username, email, subscription_plan 
FROM users;

-- Step 4: For content table - check if required_plan exists
-- If you already ran content_plan_restriction.sql, this should exist
-- Otherwise, add it:
-- ALTER TABLE content ADD COLUMN required_plan VARCHAR(20) DEFAULT 'Basic';

-- Step 5: Verify content table
SELECT id, title, required_plan 
FROM content 
LIMIT 10;
