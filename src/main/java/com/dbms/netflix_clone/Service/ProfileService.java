package com.dbms.netflix_clone.Service;

import com.dbms.netflix_clone.Entity.Profile;
import com.dbms.netflix_clone.Entity.User;
import com.dbms.netflix_clone.Repository.ProfileRepo;
import com.dbms.netflix_clone.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepo profileRepo;

    @Autowired
    private UserRepo userRepo;

    // 1. Create a new profile
    public String createProfile(Long userId, String profileName, boolean isKidProfile, String avatarUrl) {
        // Check if user exists
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return "Error: User not found";
        }

        User user = userOpt.get();

        // Check if profile name already exists for this user
        if (profileRepo.existsByUserAndProfileName(user, profileName)) {
            return "Error: Profile name already exists for this user";
        }

        // Create new profile
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setProfileName(profileName);
        profile.setKidProfile(isKidProfile);
        profile.setAvatarUrl(avatarUrl);

        profileRepo.save(profile);
        return "Profile created successfully";
    }

    // 2. Get all profiles for a user
    public List<Profile> getUserProfiles(Long userId) {
        return profileRepo.findByUserId(userId);
    }

    // 3. Get profile by ID
    public Optional<Profile> getProfileById(Long profileId) {
        return profileRepo.findById(profileId);
    }

    // 4. Update profile
    public String updateProfile(Long profileId, String profileName, Boolean isKidProfile, String avatarUrl) {
        Optional<Profile> profileOpt = profileRepo.findById(profileId);
        if (profileOpt.isEmpty()) {
            return "Error: Profile not found";
        }

        Profile profile = profileOpt.get();

        // Update fields if provided
        if (profileName != null && !profileName.trim().isEmpty()) {
            // Check if new name conflicts with existing profiles for this user
            if (!profile.getProfileName().equals(profileName) && 
                profileRepo.existsByUserAndProfileName(profile.getUser(), profileName)) {
                return "Error: Profile name already exists for this user";
            }
            profile.setProfileName(profileName);
        }

        if (isKidProfile != null) {
            profile.setKidProfile(isKidProfile);
        }

        if (avatarUrl != null) {
            profile.setAvatarUrl(avatarUrl);
        }

        profileRepo.save(profile);
        return "Profile updated successfully";
    }

    // 5. Delete profile
    public String deleteProfile(Long profileId) {
        if (!profileRepo.existsById(profileId)) {
            return "Error: Profile not found";
        }

        profileRepo.deleteById(profileId);
        return "Profile deleted successfully";
    }

    // 6. Create default profile for new user
    public Profile createDefaultProfile(User user) {
        Profile defaultProfile = new Profile();
        defaultProfile.setUser(user);
        defaultProfile.setProfileName(user.getUsername());
        defaultProfile.setKidProfile(false);
        defaultProfile.setAvatarUrl(null);

        return profileRepo.save(defaultProfile);
    }
}