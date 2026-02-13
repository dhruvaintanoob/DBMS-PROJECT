package com.dbms.netflix_clone.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate; // for DATE types in java

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
}
