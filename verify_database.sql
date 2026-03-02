-- Verify the database schema and data

-- 1. Check if required_plan column exists in content table
DESCRIBE content;

-- 2. Check if subscription_plan column exists in users table  
DESCRIBE users;

-- 3. Check actual data in users table
SELECT id, username, email, subscription_plan, SubscriptionPlan 
FROM users 
LIMIT 5;

-- 4. Check actual data in content table
SELECT id, title, required_plan, requiredPlan 
FROM content 
LIMIT 5;

-- 5. If columns don't exist or have wrong names, fix them:

-- Fix users table if needed (choose ONE based on what exists):
-- Option A: If column is named SubscriptionPlan, rename it:
-- ALTER TABLE users CHANGE COLUMN SubscriptionPlan subscription_plan VARCHAR(50);

-- Option B: If column doesn't exist at all, add it:
-- ALTER TABLE users ADD COLUMN subscription_plan VARCHAR(50) DEFAULT 'Basic';

-- Fix content table if needed (choose ONE based on what exists):
-- Option A: If column is named requiredPlan, rename it:
-- ALTER TABLE content CHANGE COLUMN requiredPlan required_plan VARCHAR(20);

-- Option B: If column doesn't exist at all, add it:
-- ALTER TABLE content ADD COLUMN required_plan VARCHAR(20) DEFAULT 'Basic';

-- 6. Update test data
-- Set a user to Basic plan
UPDATE users SET subscription_plan = 'Basic' WHERE id = 1;

-- Set some content to Premium
UPDATE content SET required_plan = 'Premium' WHERE id IN (1, 2, 3);

-- Set some content to Standard  
UPDATE content SET required_plan = 'Standard' WHERE id IN (4, 5, 6);

-- Rest stays as Basic (default)

-- 7. Verify the updates
SELECT 'Users:' as table_name, id, username, subscription_plan FROM users LIMIT 3
UNION ALL
SELECT 'Content:', id, title, required_plan FROM content LIMIT 5;
