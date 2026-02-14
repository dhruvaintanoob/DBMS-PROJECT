package com.dbms.netflix_clone.Repository;

import com.dbms.netflix_clone.Entity.UserContentInteraction;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;



   @Repository
public interface UserContentInteractionRepo extends JpaRepository<UserContentInteraction, Long> {

    // Get history for a specific profile (e.g., Dad's history vs. Kid's history)
    List<UserContentInteraction> findByProfileId(Long profileId);

    // Filter by type for a specific profile (e.g., just "Rated" movies for Profile A)
    List<UserContentInteraction> findByProfileIdAndInteractionType(Long profileId, String type);
}
