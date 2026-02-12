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

    // 2. POST: Register a new user
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return userService.registerNewUser(user);
    }


}
