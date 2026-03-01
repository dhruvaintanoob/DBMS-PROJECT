-- SQL Script to update Netflix Clone database schema
-- Run this script on your MySQL database to add the new columns

USE netflix_db;

-- Add YouTube URL and thumbnail URL columns to content table
ALTER TABLE content 
ADD COLUMN youtube_url VARCHAR(500) NULL,
ADD COLUMN thumbnail_url VARCHAR(500) NULL;

-- Update existing content with sample YouTube URLs (optional)
-- You can run this to add YouTube URLs to existing content if any

-- Verify the changes
DESCRIBE content;

-- Show current content
SELECT id, title, youtube_url, thumbnail_url FROM content;

-- Note: The profiles table should already exist due to JPA auto-creation
-- But if you need to create it manually, here's the structure:

/*
CREATE TABLE IF NOT EXISTS profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    profile_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    is_kid_profile BOOLEAN DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_profile (user_id, profile_name)
);
*/