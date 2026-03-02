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
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @GetMapping("/users/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userRepo.findById(id);
    }

    @PutMapping("/users/update/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userRepo.save(user);
    }

    @DeleteMapping("/users/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return "User deleted successfully";
    }

    // ========== PROFILE CRUD ==========
    
    @GetMapping("/profiles/all")
    public List<Profile> getAllProfiles() {
        return profileRepo.findAll();
    }

    @GetMapping("/profiles/{id}")
    public Optional<Profile> getProfileById(@PathVariable Long id) {
        return profileRepo.findById(id);
    }

    @PutMapping("/profiles/update/{id}")
    public Profile updateProfile(@PathVariable Long id, @RequestBody Profile profile) {
        profile.setId(id);
        return profileRepo.save(profile);
    }

    @DeleteMapping("/profiles/delete/{id}")
    public String deleteProfile(@PathVariable Long id) {
        profileRepo.deleteById(id);
        return "Profile deleted successfully";
    }
}
