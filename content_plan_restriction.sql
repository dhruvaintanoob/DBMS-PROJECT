-- Add required_plan column to content table
-- This column specifies the minimum subscription plan needed to watch the content

ALTER TABLE content 
ADD COLUMN required_plan VARCHAR(20) DEFAULT 'Basic' 
COMMENT 'Minimum subscription plan required: Basic, Standard, or Premium';

-- Update existing content with different plan requirements
-- You can customize this based on your content strategy

-- Set some premium content (e.g., newer releases)
UPDATE content 
SET required_plan = 'Premium' 
WHERE YEAR(release_date) >= 2023 
LIMIT 10;

-- Set some standard content
UPDATE content 
SET required_plan = 'Standard' 
WHERE YEAR(release_date) >= 2020 AND required_plan = 'Basic'
LIMIT 15;

-- The rest will remain as 'Basic' (default)

-- Verify the changes
SELECT required_plan, COUNT(*) as content_count 
FROM content 
GROUP BY required_plan;
