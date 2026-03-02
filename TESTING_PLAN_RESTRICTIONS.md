# Testing Plan-Based Content Restrictions

## Step 1: Verify Database Setup

Run this query to check if the `required_plan` column exists and has data:

```sql
-- Check if column exists
DESCRIBE content;

-- Check content with different plan requirements
SELECT id, title, required_plan, release_date 
FROM content 
ORDER BY required_plan, id 
LIMIT 20;

-- Count content by plan
SELECT required_plan, COUNT(*) as count 
FROM content 
GROUP BY required_plan;
```

## Step 2: Check User Subscription Plan

```sql
-- Check your test user's subscription plan
SELECT id, username, email, subscription_plan 
FROM users;

-- If subscription_plan is NULL, update it:
UPDATE users 
SET subscription_plan = 'Basic' 
WHERE id = 1;  -- Replace with your user ID
```

## Step 3: Test in Browser

1. **Open Browser Console** (F12)
2. **Login** with your test user
3. **Click on any content** to play it
4. **Check Console Logs** - You should see:
   ```
   === VideoPlayer Access Check ===
   User Plan: Basic (or Standard/Premium)
   Content Required Plan: Premium (or whatever the content requires)
   Has Access: false (if blocked) or true (if allowed)
   Required Upgrade: Premium (if blocked)
   ```

## Step 4: Test Different Scenarios

### Scenario A: Basic User trying to watch Premium content
```sql
-- Set user to Basic
UPDATE users SET subscription_plan = 'Basic' WHERE id = 1;

-- Set some content to Premium
UPDATE content SET required_plan = 'Premium' WHERE id IN (1, 2, 3);
```
**Expected**: Modal popup saying "Upgrade Required"

### Scenario B: Premium User watching any content
```sql
-- Set user to Premium
UPDATE users SET subscription_plan = 'Premium' WHERE id = 1;
```
**Expected**: All content plays normally

### Scenario C: Standard User watching Standard content
```sql
-- Set user to Standard
UPDATE users SET subscription_plan = 'Standard' WHERE id = 1;

-- Set content to Standard
UPDATE content SET required_plan = 'Standard' WHERE id = 5;
```
**Expected**: Content plays normally

### Scenario D: Standard User trying Premium content
```sql
-- User is Standard (from above)
-- Set content to Premium
UPDATE content SET required_plan = 'Premium' WHERE id = 6;
```
**Expected**: Modal popup blocking access

## Step 5: Verify Visual Indicators

1. **Content Cards**: Should show lock badge on restricted content
2. **Play Button**: Should show "Locked" instead of "Play" for restricted content
3. **Video Player**: Should show modal popup with upgrade message

## Troubleshooting

### Issue: All content plays (no blocking)
**Possible causes:**
1. `required_plan` column doesn't exist → Run `content_plan_restriction.sql`
2. All content has `required_plan = 'Basic'` → Update some content to Premium/Standard
3. User's `subscription_plan` is NULL → Update user's plan
4. Backend not restarted → Restart Spring Boot application

### Issue: Console shows "Content Required Plan: undefined"
**Solution:** Backend needs to be restarted after adding the column

### Issue: User Plan shows as "undefined"
**Solution:** 
```sql
UPDATE users 
SET subscription_plan = 'Basic' 
WHERE subscription_plan IS NULL;
```

## Quick Test Commands

```sql
-- Create a clear test scenario
-- User 1 = Basic, Content 1 = Premium (should block)
UPDATE users SET subscription_plan = 'Basic' WHERE id = 1;
UPDATE content SET required_plan = 'Premium' WHERE id = 1;

-- User 1 = Premium, Content 2 = Basic (should allow)
UPDATE users SET subscription_plan = 'Premium' WHERE id = 1;
UPDATE content SET required_plan = 'Basic' WHERE id = 2;
```
