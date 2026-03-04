package com.dbms.netflix_clone.Controller;

import com.dbms.netflix_clone.Entity.Content;
import com.dbms.netflix_clone.Entity.User;
import com.dbms.netflix_clone.Entity.Profile;
import com.dbms.netflix_clone.Repository.ContentRepo;
import com.dbms.netflix_clone.Repository.UserRepo;
import com.dbms.netflix_clone.Repository.ProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final String ADMIN_PASSWORD = "admin123"; // Change this password

    @Autowired
    private ContentRepo contentRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProfileRepo profileRepo;
    
    @Autowired
    private com.dbms.netflix_clone.Repository.WatchlistRepo watchlistRepo;
    
    @Autowired
    private com.dbms.netflix_clone.Repository.UserContentInteractionRepo interactionRepo;

    // Password request DTO
    static class PasswordRequest {
        private String password;
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }

    // User DTO for admin responses (without profiles to avoid lazy loading issues)
    static class UserDTO {
        private Long id;
        private String username;
        private String email;
        private String subscriptionPlan;
        
        public UserDTO(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.email = user.getEmail();
            this.subscriptionPlan = user.getSubscriptionPlan();
        }
        
        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getSubscriptionPlan() { return subscriptionPlan; }
    }

    // Profile DTO for admin responses
    static class ProfileDTO {
        private Long id;
        private String profileName;
        private Long userId;
        private String avatarUrl;
        private boolean kidProfile;
        
        public ProfileDTO(Profile profile) {
            this.id = profile.getId();
            this.profileName = profile.getProfileName();
            this.userId = profile.getUser() != null ? profile.getUser().getId() : null;
            this.avatarUrl = profile.getAvatarUrl();
            this.kidProfile = profile.isKidProfile();
        }
        
        public Long getId() { return id; }
        public String getProfileName() { return profileName; }
        public Long getUserId() { return userId; }
        public String getAvatarUrl() { return avatarUrl; }
        public boolean isKidProfile() { return kidProfile; }
    }

    // Verify admin password
    @PostMapping("/verify")
    public boolean verifyPassword(@RequestBody PasswordRequest request) {
        String password = request.getPassword();
        System.out.println("Received password: " + password);
        System.out.println("Expected password: " + ADMIN_PASSWORD);
        return ADMIN_PASSWORD.equals(password);
    }

    // ========== CONTENT CRUD ==========
    
    @GetMapping("/content/all")
    public List<Content> getAllContent() {
        return contentRepo.findAll();
    }

    @GetMapping("/content/{id}")
    public Optional<Content> getContentById(@PathVariable Long id) {
        return contentRepo.findById(id);
    }

    @PostMapping("/content/create")
    public Content createContent(@RequestBody Content content) {
        return contentRepo.save(content);
    }

    @PutMapping("/content/update/{id}")
    public Content updateContent(@PathVariable Long id, @RequestBody Content content) {
        content.setId(id);
        return contentRepo.save(content);
    }

    @DeleteMapping("/content/delete/{id}")
    public String deleteContent(@PathVariable Long id) {
        contentRepo.deleteById(id);
        return "Content deleted successfully";
    }

    // ========== USER CRUD ==========
    
    @GetMapping("/users/all")
    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/users/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        User user = userRepo.findById(id).orElseThrow();
        return new UserDTO(user);
    }

    @PutMapping("/users/update/{id}")
    public UserDTO updateUser(@PathVariable Long id, @RequestBody User user) {
        // Fetch existing user to preserve relationships
        User existingUser = userRepo.findById(id).orElseThrow();
        
        // Only update non-null fields
        if (user.getUsername() != null && !user.getUsername().isEmpty()) {
            existingUser.setUsername(user.getUsername());
        }
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            existingUser.setEmail(user.getEmail());
        }
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(user.getPassword());
        }
        if (user.getSubscriptionPlan() != null) {
            existingUser.setSubscriptionPlan(user.getSubscriptionPlan());
        }
        
        return new UserDTO(userRepo.save(existingUser));
    }

    @DeleteMapping("/users/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        try {
            // Get user to find all their profiles
            User user = userRepo.findById(id).orElseThrow();
            
            // Get all profiles for this user
            List<Profile> profiles = profileRepo.findByUserId(id);
            
            // Delete all watchlist items and interactions for each profile
            for (Profile profile : profiles) {
                watchlistRepo.deleteByProfileId(profile.getId());
                interactionRepo.deleteByProfileId(profile.getId());
            }
            
            // Now delete the user (cascade will delete profiles)
            userRepo.deleteById(id);
            
            return "User deleted successfully";
        } catch (Exception e) {
            return "Error deleting user: " + e.getMessage();
        }
    }

    // ========== PROFILE CRUD ==========
    
    @GetMapping("/profiles/all")
    public List<ProfileDTO> getAllProfiles() {
        return profileRepo.findAll().stream()
                .map(ProfileDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/profiles/{id}")
    public ProfileDTO getProfileById(@PathVariable Long id) {
        Profile profile = profileRepo.findById(id).orElseThrow();
        return new ProfileDTO(profile);
    }

    @PutMapping("/profiles/update/{id}")
    public ProfileDTO updateProfile(@PathVariable Long id, @RequestBody Profile profile) {
        // Fetch existing profile to preserve user relationship
        Profile existingProfile = profileRepo.findById(id).orElseThrow();
        existingProfile.setProfileName(profile.getProfileName());
        existingProfile.setAvatarUrl(profile.getAvatarUrl());
        existingProfile.setKidProfile(profile.isKidProfile());
        return new ProfileDTO(profileRepo.save(existingProfile));
    }

    @DeleteMapping("/profiles/delete/{id}")
    public String deleteProfile(@PathVariable Long id) {
        profileRepo.deleteById(id);
        return "Profile deleted successfully";
    }
}
