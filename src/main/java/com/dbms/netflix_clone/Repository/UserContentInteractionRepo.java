package com.dbms.netflix_clone.Repository;

import com.dbms.netflix_clone.Entity.UserContentInteraction;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;



@Repository
public interface UserContentInteractionRepo extends JpaRepository<UserContentInteraction, Long> {

    // Retrieve all interactions for a specific user (e.g., full history)
    List<UserContentInteraction> findByUserId(Long userId);

    // Filter interactions by type for a specific user (e.g., only "watched" or "rated")
    List<UserContentInteraction> findByUserIdAndInteractionType(Long userId, String interactionType);

    // Retrieve all interactions for a specific piece of content (e.g., all users who watched 'Spider-Man')
    List<UserContentInteraction> findByContentId(Long contentId);
}