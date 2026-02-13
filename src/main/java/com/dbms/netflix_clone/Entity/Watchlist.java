package com.dbms.netflix_clone.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "watchlist")
@Data
public class Watchlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // WatchlistID

    // Foreign Key to User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Foreign Key to Content
    @ManyToOne
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;
}
