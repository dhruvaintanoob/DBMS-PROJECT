package com.dbms.netflix_clone.Controller;

import com.dbms.netflix_clone.Entity.UserContentInteraction;
import com.dbms.netflix_clone.Service.UserContentInteractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/interactions")
public class UserContentInteractionController {

    @Autowired
    private UserContentInteractionService interactionService;

    /**
     * POST: Record a new interaction for a specific profile.
     * URL Example: http://localhost:8080/api/interactions/add?profileId=1&contentId=5&type=watched
     */
    @PostMapping("/add")
    public String addInteraction(
            @RequestParam Long profileId, // Updated from userId
            @RequestParam Long contentId, 
            @RequestParam String type) {
        return interactionService.recordInteraction(profileId, contentId, type);
    }

    /**
     * GET: Retrieve the full history for a specific profile.
     * URL Example: http://localhost:8080/api/interactions/profile/1
     */
    @GetMapping("/profile/{profileId}") // Updated path for clarity
    public List<UserContentInteraction> getProfileHistory(@PathVariable Long profileId) {
        return interactionService.getProfileHistory(profileId);
    }

    /**
     * GET: Retrieve specific interaction types for a profile (e.g., only "rated").
     * URL Example: http://localhost:8080/api/interactions/profile/1/type?type=rated
     */
    @GetMapping("/profile/{profileId}/type")
    public List<UserContentInteraction> getInteractionsByType(
            @PathVariable Long profileId, 
            @RequestParam String type) {
        return interactionService.getProfileInteractionsByType(profileId, type);
    }
}