-- Alternative Approach: Using a mapping table instead of a column
-- (NOT RECOMMENDED - but here's how it would work)

-- Create a content-plan mapping table
CREATE TABLE content_plan_access (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id BIGINT NOT NULL,
    required_plan VARCHAR(20) NOT NULL,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    UNIQUE KEY unique_content_plan (content_id)
);

-- Insert plan requirements for content
-- (You'd need to do this for each content item)
INSERT INTO content_plan_access (content_id, required_plan) 
SELECT id, 'Basic' FROM content WHERE YEAR(release_date) < 2020;

INSERT INTO content_plan_access (content_id, required_plan) 
SELECT id, 'Standard' FROM content WHERE YEAR(release_date) BETWEEN 2020 AND 2022;

INSERT INTO content_plan_access (content_id, required_plan) 
SELECT id, 'Premium' FROM content WHERE YEAR(release_date) >= 2023;

-- Query to get content accessible to a user
-- Example: Get all content accessible to a Standard user (user_id = 1)
SELECT c.* 
FROM content c
LEFT JOIN content_plan_access cpa ON c.id = cpa.content_id
INNER JOIN users u ON u.id = 1  -- Replace with actual user_id
WHERE 
    -- If no plan requirement exists, default to Basic
    COALESCE(cpa.required_plan, 'Basic') IN (
        CASE u.subscription_plan
            WHEN 'Premium' THEN ('Basic', 'Standard', 'Premium')
            WHEN 'Standard' THEN ('Basic', 'Standard')
            WHEN 'Basic' THEN ('Basic')
            ELSE ('Basic')
        END
    );

-- Query to check if specific user can access specific content
SELECT 
    c.id,
    c.title,
    u.subscription_plan as user_plan,
    COALESCE(cpa.required_plan, 'Basic') as required_plan,
    CASE 
        WHEN u.subscription_plan = 'Premium' THEN TRUE
        WHEN u.subscription_plan = 'Standard' AND COALESCE(cpa.required_plan, 'Basic') IN ('Basic', 'Standard') THEN TRUE
        WHEN u.subscription_plan = 'Basic' AND COALESCE(cpa.required_plan, 'Basic') = 'Basic' THEN TRUE
        ELSE FALSE
    END as has_access
FROM content c
CROSS JOIN users u
LEFT JOIN content_plan_access cpa ON c.id = cpa.content_id
WHERE u.id = 1 AND c.id = 5;  -- Replace with actual user_id and content_id

-- WHY THIS IS WORSE:
-- 1. Extra table to maintain
-- 2. More complex queries
-- 3. Slower performance (extra JOIN)
-- 4. Content restriction is content metadata, not a relationship
-- 5. Need to ensure every content has an entry in mapping table
