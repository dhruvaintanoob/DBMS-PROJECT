package com.dbms.netflix_clone.Controller;

import com.dbms.netflix_clone.Entity.Profile;
import com.dbms.netflix_clone.Service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // 1. POST: Create a new profile
    // URL: http://localhost:8080/api/profiles/create
    @PostMapping("/create")
    public String createProfile(@RequestParam Long userId, @RequestParam String profileName, 
                               @RequestParam(defaultValue = "false") boolean isKidProfile,
                               @RequestParam(required = false) String avatarUrl) {
        return profileService.createProfile(userId, profileName, isKidProfile, avatarUrl);
    }

    // 2. GET: Get all profiles for a user
    // URL: http://localhost:8080/api/profiles/user/1
    @GetMapping("/user/{userId}")
    public List<Profile> getUserProfiles(@PathVariable Long userId) {
        return profileService.getUserProfiles(userId);
    }

    // 3. GET: Get profile by ID
    // URL: http://localhost:8080/api/profiles/1
    @GetMapping("/{profileId}")
    public Optional<Profile> getProfileById(@PathVariable Long profileId) {
        return profileService.getProfileById(profileId);
    }

    // 4. PUT: Update profile
    // URL: http://localhost:8080/api/profiles/update/1
    @PutMapping("/update/{profileId}")
    public String updateProfile(@PathVariable Long profileId, 
                               @RequestParam(required = false) String profileName,
                               @RequestParam(required = false) Boolean isKidProfile,
                               @RequestParam(required = false) String avatarUrl) {
        return profileService.updateProfile(profileId, profileName, isKidProfile, avatarUrl);
    }

    // 5. DELETE: Delete profile
    // URL: http://localhost:8080/api/profiles/delete/1
    @DeleteMapping("/delete/{profileId}")
    public String deleteProfile(@PathVariable Long profileId) {
        return profileService.deleteProfile(profileId);
    }
}
