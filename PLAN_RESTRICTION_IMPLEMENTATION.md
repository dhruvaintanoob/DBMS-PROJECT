# Plan-Based Content Restriction Implementation

## Overview
This feature restricts video content based on user subscription plans (Basic, Standard, Premium).

## Implementation Steps

### 1. Database Changes
Run the SQL script: `content_plan_restriction.sql`

```sql
-- Adds required_plan column to content table
ALTER TABLE content 
ADD COLUMN required_plan VARCHAR(20) DEFAULT 'Basic';
```

This will:
- Add a `required_plan` column to the content table
- Set default value as 'Basic'
- Update some existing content with different plan requirements

### 2. Backend Changes
- **Content.java**: Added `requiredPlan` field
- **User.java**: Fixed `subscriptionPlan` field naming (already done)

### 3. Frontend Changes

#### New Files:
- `frontend/src/utils/planUtils.ts`: Utility functions for plan access checking

#### Updated Files:
- `frontend/src/types/index.ts`: Added `requiredPlan` to Content interface
- `frontend/src/components/content/VideoPlayer.tsx`: 
  - Checks user plan before playing video
  - Shows upgrade message if access denied
- `frontend/src/components/content/ContentCard.tsx`:
  - Shows lock badge on restricted content
  - Changes play button to locked state

## How It Works

### Plan Hierarchy:
1. **Basic** (Tier 1): Can watch Basic content only
2. **Standard** (Tier 2): Can watch Basic + Standard content
3. **Premium** (Tier 3): Can watch all content

### User Experience:
- Content cards show a lock badge if user doesn't have access
- Play button shows "Locked" for restricted content
- Video player displays upgrade message instead of video
- Clear indication of current plan vs required plan

## Testing

1. **Run the SQL script** to add the column and set test data
2. **Restart Spring Boot backend** to load the new entity field
3. **Test with different user plans**:
   - Create users with Basic, Standard, and Premium plans
   - Try accessing content with different `required_plan` values
   - Verify lock badges appear correctly
   - Verify video player blocks restricted content

## Customizing Content Plans

You can update content plan requirements:

```sql
-- Set specific content to Premium
UPDATE content 
SET required_plan = 'Premium' 
WHERE id IN (1, 2, 3);

-- Set content to Standard
UPDATE content 
SET required_plan = 'Standard' 
WHERE id IN (4, 5, 6);

-- Set content to Basic (accessible to all)
UPDATE content 
SET required_plan = 'Basic' 
WHERE id IN (7, 8, 9);
```

## Future Enhancements

- Add upgrade flow in the UI
- Show filtered content based on user plan
- Add "Premium" or "Standard" badges on content cards
- Analytics on blocked content views
