package com.dbms.netflix_clone.Service;

import com.dbms.netflix_clone.Entity.User;
import com.dbms.netflix_clone.Entity.Profile;
import com.dbms.netflix_clone.Repository.UserRepo;
import com.dbms.netflix_clone.Repository.ProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo ur;

    @Autowired
    private ProfileRepo profileRepo;

    public String registerNewUser(User user) {
        if (ur.existsByEmail(user.getEmail())){
            return "Error , email already in Use";
        }
         
        User savedUser = ur.save(user);
        
        // Create default profile for new user
        try {
            Profile defaultProfile = new Profile();
            defaultProfile.setUser(savedUser);
            defaultProfile.setProfileName(savedUser.getUsername());
            defaultProfile.setKidProfile(false);
            defaultProfile.setAvatarUrl(null);
            profileRepo.save(defaultProfile);
        } catch (Exception e) {
            // If profile creation fails, still return success for user creation
            System.err.println("Failed to create default profile for user: " + e.getMessage());
        }
        
        return "User registered successfully";
    }

    public List<User> getAllUsers() {
        return ur.findAll(); 
    }

    public User login(String username, String password) {
        User user = ur.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}