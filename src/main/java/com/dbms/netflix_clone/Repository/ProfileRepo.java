package com.dbms.netflix_clone.Repository;

import com.dbms.netflix_clone.Entity.Profile;
import com.dbms.netflix_clone.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileRepo extends JpaRepository<Profile, Long> {
    
    // Find all profiles for a specific user
    List<Profile> findByUserId(Long userId);
    
    // Find profiles by user entity
    List<Profile> findByUser(User user);
    
    // Check if profile name exists for a user
    boolean existsByUserAndProfileName(User user, String profileName);
    
    // Find profile by user and profile name
    Profile findByUserAndProfileName(User user, String profileName);
}