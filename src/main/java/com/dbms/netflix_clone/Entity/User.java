package com.dbms.netflix_clone.Entity; // Ensure this matches your folder path exactly

import jakarta.persistence.*;
import lombok.Data;




//In Spring Data JPA, these "at-signs" are called Annotations, and they act 
// as metadata. They tell Hibernate (the engine under the hood) how to map your
//  Java variables to the strict rules of a SQL database.




@Entity
// tells jpa to look at this and generate a corresponding table 

@Table(name = "users")
@Data
// writes all the getter setter functions automatically 

public class User {
    @Id // Marks this field as the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tells MySQL to auto-increment the ID
    private Long id;

    @Column(unique = true, nullable = false) // Ensures no two users have the same email
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;
    
    
}   