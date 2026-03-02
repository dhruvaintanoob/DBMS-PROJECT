package com.dbms.netflix_clone.Controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@CrossOrigin
@RestController
@RequestMapping("/api/videos")
public class VideoController {

    // Base directory where local videos are stored (for relative paths)
    // You can change this to your actual video directory
    private final String VIDEO_DIRECTORY = System.getProperty("user.home") + "/Videos/netflix_content/";

    /**
     * Stream local video file
     * URL: http://localhost:8080/api/videos/stream?path=/videos/movie.mp4
     * Supports both absolute paths and relative paths
     */
    @GetMapping("/stream")
    public ResponseEntity<Resource> streamVideo(@RequestParam String path) {
        try {
            Path filePath;
            
            // Check if path is absolute (starts with / or contains :)
            if (path.startsWith("/") || path.contains(":")) {
                // Absolute path - use as is
                filePath = Paths.get(path);
            } else {
                // Relative path - prepend VIDEO_DIRECTORY
                filePath = Paths.get(VIDEO_DIRECTORY + path);
            }
            
            System.out.println("Attempting to stream video from: " + filePath.toString());
            
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType = "video/mp4"; // Default to mp4
                String fileName = filePath.getFileName().toString().toLowerCase();
                if (fileName.endsWith(".webm")) {
                    contentType = "video/webm";
                } else if (fileName.endsWith(".ogg")) {
                    contentType = "video/ogg";
                } else if (fileName.endsWith(".mkv")) {
                    contentType = "video/x-matroska";
                } else if (fileName.endsWith(".avi")) {
                    contentType = "video/x-msvideo";
                }

                System.out.println("Streaming video: " + filePath.toString() + " (" + contentType + ")");

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                        .body(resource);
            } else {
                System.err.println("Video file not found or not readable: " + filePath.toString());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            System.err.println("Error streaming video: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if video file exists
     * URL: http://localhost:8080/api/videos/exists?path=/videos/movie.mp4
     */
    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkVideoExists(@RequestParam String path) {
        try {
            Path filePath;
            
            if (path.startsWith("/") || path.contains(":")) {
                filePath = Paths.get(path);
            } else {
                filePath = Paths.get(VIDEO_DIRECTORY + path);
            }
            
            Resource resource = new UrlResource(filePath.toUri());
            boolean exists = resource.exists() && resource.isReadable();
            
            System.out.println("Video exists check for " + filePath.toString() + ": " + exists);
            
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            System.err.println("Error checking video existence: " + e.getMessage());
            return ResponseEntity.ok(false);
        }
    }
}
