package com.dbms.netflix_clone.Service;

import com.dbms.netflix_clone.Entity.User;
import com.dbms.netflix_clone.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo ur;

    public String registerNewUser(User user) {
        if (ur.existsByEmail(user.getEmail())){
            return "Error , email already in Use";
        }
        if (ur.existsByUsername(user.getUsername())) {
            return "Error: Username already taken";
        }
        ur.save(user);
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