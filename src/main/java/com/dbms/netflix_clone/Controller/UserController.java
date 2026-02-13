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

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return userService.registerNewUser(user);
    }

    @PostMapping("/login") //we use POST for login because sending passwords in a GET request (in the URL) is insecure. POST hides the data inside the request body.
    public User login(@RequestBody User user) {
        return userService.login(user.getUsername(), user.getPassword());
    }
}
