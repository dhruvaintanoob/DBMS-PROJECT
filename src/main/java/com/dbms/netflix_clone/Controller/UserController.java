package com.dbms.netflix_clone.Controller;

import java.util.*;
import com.dbms.netflix_clone.Entity.User;
import com.dbms.netflix_clone.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController 
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Login response DTO
    static class LoginResponse {
        private Long id;
        private String username;
        private String email;
        private String subscriptionPlan;
        
        public LoginResponse(User user) {
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

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return userService.registerNewUser(user);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody User user) {
        User loggedInUser = userService.login(user.getUsername(), user.getPassword());
        if (loggedInUser != null) {
            return new LoginResponse(loggedInUser);
        }
        return null;
    }
}
