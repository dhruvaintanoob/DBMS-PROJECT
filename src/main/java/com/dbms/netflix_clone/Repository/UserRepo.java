package com.dbms.netflix_clone.Repository;


import com.dbms.netflix_clone.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.*;


public interface UserRepo extends JpaRepository<User,Long> {
    User findByEmail(String email);
    // Spring takes the name of your method, strips away the 
    // findBy prefix, and then looks for a field in your Entity that matches the rest of the name.



    boolean existsByEmail(String email);

    List<User> findByNameContaining(String name);


}
