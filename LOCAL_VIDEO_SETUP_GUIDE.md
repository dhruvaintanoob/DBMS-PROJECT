# Local Video Support Setup Guide

## Overview
The system now supports both YouTube videos and local video files stored on your PC.

## Step 1: Database Setup

Run the SQL script: `add_video_location_support.sql`

This adds:
- `video_location` column: 'youtube' or 'local'
- `local_video_path` column: path to local video file

## Step 2: Create Video Directory

Create a folder on your PC to store videos:

**Default location:** `~/Videos/netflix_content/`

Example structure:
```
~/Videos/netflix_content/
├── movies/
│   ├── action_movie.mp4
│   ├── comedy_movie.mp4
│   └── drama_movie.mp4
├── shows/
│   ├── show1_ep1.mp4
│   └── show1_ep2.mp4
└── trailers/
    └── trailer1.mp4
```

**To change the directory:**
Edit `VideoController.java` line 20:
```java
private final String VIDEO_DIRECTORY = "/your/custom/path/";
```

## Step 3: Add Local Video Content

### Option A: Insert new local video content

```sql
INSERT INTO content (
    title, genre, release_date, duration, rating, description,
    video_location, local_video_path, required_plan, thumbnail_url
) VALUES (
    'My Local Movie',
    'Action',
    '2024-01-01',
    120,
    'PG-13',
    'A great action movie stored locally',
    'local',
    'movies/action_movie.mp4',
    'Basic',
    NULL
);
```

### Option B: Convert existing content to local

```sql
UPDATE content 
SET 
    video_location = 'local',
    local_video_path = 'movies/my_movie.mp4',
    youtube_url = NULL,
    thumbnail_url = NULL
WHERE id = 10;
```

## Step 4: Restart Backend

Restart your Spring Boot application to load the new entity fields and controller.

## Step 5: Test

1. Add a test video file to `~/Videos/netflix_content/movies/test.mp4`
2. Add database entry pointing to it
3. Click play on that content
4. Video should play using HTML5 video player

## How It Works

### YouTube Videos
- `video_location` = 'youtube'
- `youtube_url` = YouTube URL
- Plays in embedded YouTube iframe

### Local Videos
- `video_location` = 'local'
- `local_video_path` = relative path (e.g., 'movies/video.mp4')
- Plays in HTML5 `<video>` element
- Streams from: `http://localhost:8080/api/videos/stream?path=movies/video.mp4`

## Supported Video Formats

- MP4 (recommended)
- WebM
- OGG

## File Path Examples

```sql
-- Correct paths (relative to VIDEO_DIRECTORY)
'movies/action.mp4'
'shows/season1/episode1.mp4'
'trailers/trailer.mp4'

-- Incorrect paths (don't use absolute paths)
'/home/user/Videos/movie.mp4'  ❌
'C:/Videos/movie.mp4'  ❌
```

## Troubleshooting

### Video doesn't play
1. Check file exists: `ls ~/Videos/netflix_content/movies/your_video.mp4`
2. Check file permissions: `chmod 644 ~/Videos/netflix_content/movies/your_video.mp4`
3. Check browser console for errors
4. Verify path in database matches actual file location

### 404 Error
- File path in database doesn't match actual file location
- Check `VIDEO_DIRECTORY` in `VideoController.java`

### Permission Denied
- Spring Boot process doesn't have read access to video directory
- Run: `chmod -R 755 ~/Videos/netflix_content/`

## Example: Bulk Convert to Local

```sql
-- Convert all content without YouTube URLs to local
UPDATE content 
SET 
    video_location = 'local',
    local_video_path = CONCAT('movies/', LOWER(REPLACE(title, ' ', '_')), '.mp4')
WHERE youtube_url IS NULL OR youtube_url = '';

-- Then manually place video files with matching names in the directory
```

## Security Note

The VideoController only serves files from the configured VIDEO_DIRECTORY.
Users cannot access files outside this directory.
