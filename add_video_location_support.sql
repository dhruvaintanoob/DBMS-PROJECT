-- Add support for local video files in addition to YouTube

-- Step 1: Add video_location column (youtube or local)
ALTER TABLE content 
ADD COLUMN video_location VARCHAR(20) DEFAULT 'youtube' 
COMMENT 'Video source: youtube or local';

-- Step 2: Add local_video_path column for local file paths
ALTER TABLE content 
ADD COLUMN local_video_path VARCHAR(500) NULL 
COMMENT 'Path to local video file (only for local videos)';

-- Step 3: Update existing content to be 'youtube' type
UPDATE content 
SET video_location = 'youtube' 
WHERE youtube_url IS NOT NULL;

-- Step 4: Set content without YouTube URL to 'local' type
UPDATE content 
SET video_location = 'local' 
WHERE youtube_url IS NULL OR youtube_url = '';

-- Step 5: Verify the changes
SELECT id, title, video_location, youtube_url, local_video_path 
FROM content 
LIMIT 10;

-- Example: Add a local video entry
-- INSERT INTO content (title, genre, release_date, duration, rating, description, 
--                      video_location, local_video_path, required_plan, thumbnail_url)
-- VALUES ('Local Movie', 'Action', '2024-01-01', 120, 'PG-13', 
--         'A locally stored movie', 'local', '/videos/local_movie.mp4', 'Basic', NULL);

-- Example: Update existing content to use local video
-- UPDATE content 
-- SET video_location = 'local', 
--     local_video_path = '/videos/movie_name.mp4',
--     youtube_url = NULL,
--     thumbnail_url = NULL
-- WHERE id = 10;
