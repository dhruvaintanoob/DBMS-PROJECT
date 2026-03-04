package com.dbms.netflix_clone.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate; // for DATE types in java
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "content")
@Data
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    
    private String genre;

    private LocalDate releaseDate;

    private Integer duration;

    private String rating;

    @Column(columnDefinition = "TEXT") // TEXT is a data type in MySQL for long text
    private String description;
    
    // Video source fields
    @Column(name = "video_location")
    private String videoLocation = "youtube"; // 'youtube' or 'local'
    
    @Column(name = "youtube_url")
    private String youtubeUrl; // For YouTube videos
    
    @Column(name = "local_video_path")
    private String localVideoPath; // For local videos (e.g., /videos/movie.mp4)
    
    @Column(name = "thumbnail_url")
    private String thumbnailUrl;
    
    // Subscription plan requirement
    @Column(name = "required_plan")
    private String requiredPlan = "Basic"; // Default to Basic plan

    // Add relationships to enable cascade delete
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<com.dbms.netflix_clone.Entity.Watchlist> watchlists;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<com.dbms.netflix_clone.Entity.UserContentInteraction> interactions;
}
