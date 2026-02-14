package com.dbms.netflix_clone.Service;

import com.dbms.netflix_clone.Entity.Profile;
import com.dbms.netflix_clone.Entity.User;
import com.dbms.netflix_clone.Repository.ProfileRepo;
import com.dbms.netflix_clone.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepo profileRepo;

    @Autowired
    private UserRepo userRepo;

    public String createProfile(Long userId, String name, String avatar, boolean isKid) {
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) return "User not found";

        // Logic: Netflix usually limits to 5 profiles
        List<Profile> existingProfiles = profileRepo.findByUserId(userId);
        if (existingProfiles.size() >= 5) {
            return "Maximum profile limit reached (5)";
        }

        Profile profile = new Profile();
        profile.setUser(user);
        profile.setProfileName(name);
        profile.setAvatarUrl(avatar);
        profile.setKidProfile(isKid);

        profileRepo.save(profile);
        return "Profile created successfully";
    }

    public List<Profile> getProfilesByUser(Long userId) {
        return profileRepo.findByUserId(userId);
    }

    public String deleteProfile(Long profileId) {
        profileRepo.deleteById(profileId);
        return "Profile deleted";
    }
}