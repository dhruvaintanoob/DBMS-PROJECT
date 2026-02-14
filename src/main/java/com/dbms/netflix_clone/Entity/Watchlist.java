package com.dbms.netflix_clone.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "watchlist", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"profile_id", "content_id"})
})
@Data
public class Watchlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // WatchlistID

    // Foreign Key to User
    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    // Foreign Key to Content
    @ManyToOne
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;



    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        this.addedAt = LocalDateTime.now();
    }
}
