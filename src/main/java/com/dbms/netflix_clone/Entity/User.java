package com.dbms.netflix_clone.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity // tells jpa to look at this and generate a corresponding table 
@Table(name = "users")
@Data // writes all the getter setter functions automatically

public class User {
    @Id // Marks this field as the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tells MySQL to auto-increment the ID

    private Long id;

    @Column(nullable = false) 
    private String username;
    
    @Column(unique = true, nullable = false) // Ensures no two users have the same email
    private String email;

    @Column(nullable = false)
    private String password;

    private String SubscriptionPlan;
}   