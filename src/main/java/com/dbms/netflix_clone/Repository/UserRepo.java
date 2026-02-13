package com.dbms.netflix_clone.Repository;

import com.dbms.netflix_clone.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; 

@Repository 
public interface UserRepo extends JpaRepository<User,Long> {

    User findByEmail(String email); // find a user by their email
    boolean existsByEmail(String email); // check if a user with a given email already exists

    User findByUsername(String username); // find a user by their username
    boolean existsByUsername(String username);
}
