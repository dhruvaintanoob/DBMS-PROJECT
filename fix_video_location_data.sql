-- Fix video_location for existing content

-- Step 1: Check current state
SELECT id, title, video_location, youtube_url, local_video_path 
FROM content 
LIMIT 10;

-- Step 2: Set video_location to 'youtube' for content with YouTube URLs
UPDATE content 
SET video_location = 'youtube' 
WHERE youtube_url IS NOT NULL 
  AND youtube_url != '' 
  AND (video_location IS NULL OR video_location = '');

-- Step 3: Set video_location to 'local' for content without YouTube URLs
UPDATE content 
SET video_location = 'local' 
WHERE (youtube_url IS NULL OR youtube_url = '') 
  AND (video_location IS NULL OR video_location = '');

-- Step 4: Verify the fix
SELECT 
    video_location, 
    COUNT(*) as count,
    COUNT(CASE WHEN youtube_url IS NOT NULL THEN 1 END) as with_youtube_url,
    COUNT(CASE WHEN local_video_path IS NOT NULL THEN 1 END) as with_local_path
FROM content 
GROUP BY video_location;

-- Step 5: Show sample of each type
SELECT 'YouTube Videos:' as type, id, title, video_location, youtube_url 
FROM content 
WHERE video_location = 'youtube' 
LIMIT 3;

SELECT 'Local Videos:' as type, id, title, video_location, local_video_path 
FROM content 
WHERE video_location = 'local' 
LIMIT 3;
