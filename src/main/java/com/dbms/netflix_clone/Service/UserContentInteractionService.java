package com.dbms.netflix_clone.Service;

import com.dbms.netflix_clone.Entity.Content;
import com.dbms.netflix_clone.Entity.Profile;
import com.dbms.netflix_clone.Entity.UserContentInteraction;
import com.dbms.netflix_clone.Repository.ContentRepo;
import com.dbms.netflix_clone.Repository.ProfileRepo;
import com.dbms.netflix_clone.Repository.UserContentInteractionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserContentInteractionService {

    @Autowired
    private UserContentInteractionRepo interactionRepo;

    @Autowired
    private ProfileRepo profileRepo;

    @Autowired
    private ContentRepo contentRepo;

    public String recordInteraction(Long profileId, Long contentId, String type) {
        Profile profile = profileRepo.findById(profileId).orElse(null);
        Content content = contentRepo.findById(contentId).orElse(null);

        if (profile == null || content == null) {
            return "Error: Profile or Content not found";
        }

        UserContentInteraction interaction = new UserContentInteraction();
        interaction.setProfile(profile);
        interaction.setContent(content);
        interaction.setInteractionType(type);
        
        interactionRepo.save(interaction);
        return "Interaction recorded successfully: " + type;
    }

    // ENSURE THESE NAMES MATCH THE CONTROLLER CALLS
    public List<UserContentInteraction> getProfileHistory(Long profileId) {
        return interactionRepo.findByProfileId(profileId);
    }

    public List<UserContentInteraction> getProfileInteractionsByType(Long profileId, String type) {
        return interactionRepo.findByProfileIdAndInteractionType(profileId, type);
    }
}