package com.dbms.netflix_clone.Entity;

import jakarta.persistence.*;
import lombok.Data;
<<<<<<< Updated upstream
import java.time.LocalDate; // for DATE types in java

@Entity
@Table(name = "content")
@Data
public class Content {
=======




@Entity
@Data


public class Content {

>>>>>>> Stashed changes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< Updated upstream
    @Column(nullable = false)
    private String title;
    
    private String genre;

    private LocalDate releaseDate;

    private Integer duration;

    private String rating;

    @Column(columnDefinition = "TEXT") // TEXT is a data type in MySQL for long text
    private String description;
=======
    
    @Column(nullable =false);
    private String title;

    private String description;
    private String genre;
    private int releaseYear;
    private double rating;
    
    
>>>>>>> Stashed changes
}
