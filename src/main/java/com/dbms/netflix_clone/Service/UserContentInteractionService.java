package com.dbms.netflix_clone.Service;

import com.dbms.netflix_clone.Entity.Content;
import com.dbms.netflix_clone.Entity.User;
import com.dbms.netflix_clone.Entity.UserContentInteraction;
import com.dbms.netflix_clone.Repository.ContentRepo;
import com.dbms.netflix_clone.Repository.UserContentInteractionRepo;
import com.dbms.netflix_clone.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserContentInteractionService {

    @Autowired
    private UserContentInteractionRepo interactionRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ContentRepo contentRepo;

    /**
     * Records a new interaction between a user and content.
     * @param userId ID of the user
     * @param contentId ID of the content
     * @param type Type of interaction (e.g., "watched", "rated")
     * @return Success or error message
     */
    public String recordInteraction(Long userId, Long contentId, String type) {
        // Find the real User and Content objects from the database
        User user = userRepo.findById(userId).orElse(null);
        Content content = contentRepo.findById(contentId).orElse(null);

        if (user == null || content == null) {
            return "Error: User or Content not found";
        }

        UserContentInteraction interaction = new UserContentInteraction();
        interaction.setUser(user);
        interaction.setContent(content);
        interaction.setInteractionType(type);
        
        
        interactionRepo.save(interaction);
        return "Interaction recorded successfully: " + type;
    }

    
    public List<UserContentInteraction> getUserHistory(Long userId) {
        return interactionRepo.findByUserId(userId);
    }

    
    public List<UserContentInteraction> getUserInteractionsByType(Long userId, String type) {
        return interactionRepo.findByUserIdAndInteractionType(userId, type);
    }
}