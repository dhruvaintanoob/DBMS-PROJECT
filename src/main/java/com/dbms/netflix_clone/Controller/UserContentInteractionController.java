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
     * POST: Record a new user-content interaction.
     * URL Example: http://localhost:8080/api/interactions/add?userId=1&contentId=5&type=watched
     */
    @PostMapping("/add")
    public String addInteraction(
            @RequestParam Long userId, 
            @RequestParam Long contentId, 
            @RequestParam String type) {
        return interactionService.recordInteraction(userId, contentId, type);
    }

    /**
     * GET: Retrieve the full history for a specific user.
     * URL Example: http://localhost:8080/api/interactions/user/1
     */
    @GetMapping("/user/{userId}")
    public List<UserContentInteraction> getUserHistory(@PathVariable Long userId) {
        return interactionService.getUserHistory(userId);
    }

    /**
     * GET: Retrieve specific interaction types for a user (e.g., only "rated").
     * URL Example: http://localhost:8080/api/interactions/user/1/type?type=rated
     */
    @GetMapping("/user/{userId}/type")
    public List<UserContentInteraction> getInteractionsByType(
            @PathVariable Long userId, 
            @RequestParam String type) {
        return interactionService.getUserInteractionsByType(userId, type);
    }
}