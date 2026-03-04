package com.dbms.netflix_clone.Repository;

import com.dbms.netflix_clone.Entity.UserContentInteraction;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Repository
public interface UserContentInteractionRepo extends JpaRepository<UserContentInteraction, Long> {

    // Get history for a specific profile (e.g., Dad's history vs. Kid's history)
    List<UserContentInteraction> findByProfileId(Long profileId);

    // Filter by type for a specific profile (e.g., just "Rated" movies for Profile A)
    List<UserContentInteraction> findByProfileIdAndInteractionType(Long profileId, String type);
    
    // Find all interactions for a specific content
    List<UserContentInteraction> findByContentId(Long contentId);
    
    // Delete all interactions for a profile
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_interactions WHERE profile_id = :profileId", nativeQuery = true)
    void deleteByProfileId(Long profileId);
    
    // Delete all interactions for a content
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_interactions WHERE content_id = :contentId", nativeQuery = true)
    void deleteByContentId(Long contentId);
}
