package com.dbms.netflix_clone.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "profiles")
@Data
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn( nullable = false)
    @JsonBackReference
    private User user;
    //primary key is taken as the referenced column by default when using the @JoinColumn annotation
    
    @Column(nullable = false)
    private String profileName;

    private String avatarUrl;

    private boolean isKidProfile = false;

    // Add relationships to enable cascade delete
    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.dbms.netflix_clone.Entity.Watchlist> watchlists;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.dbms.netflix_clone.Entity.UserContentInteraction> interactions;
}