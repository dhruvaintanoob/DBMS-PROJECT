package com.dbms.netflix_clone.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;


@Entity
@Table(name = "user_interactions")
@Data
public class UserContentInteraction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long interactionId; // InteractionID (Primary Key)

    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile; // UserID (Foreign Key)

    @ManyToOne
    @JoinColumn(name = "content_id", nullable = false)
    private Content content; // ContentID (Foreign Key)

    @Column(nullable = false)
    private String interactionType; // Type (watched, rated, etc.)

    private LocalDateTime interactionDate; // Date and time of the interaction

    @PrePersist
    protected void onCreate() {
        this.interactionDate = LocalDateTime.now(); // Automatically sets current time
    }





}