package com.dbms.netflix_clone.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dbms.netflix_clone.Entity.User;


import com.dbms.netflix_clone.Entity.Profile;
import java.util.List;


@Repository
public interface ProfileRepo  extends JpaRepository<Profile,Long> {

    List<Profile> findByUser(User user);

    /**
     * Finds all profiles by the ID of the user. 
     * Spring JPA is smart: it sees "User" (the object) and "Id" (the field inside User).
     */
    List<Profile> findByUserId(Long userId);

    /**
     * Checks if a profile name already exists for a specific user.
     * Useful for preventing a user from having two profiles named "Dad".
     */
    boolean existsByUserIdAndProfileName(Long userId, String profileName);

   
    Profile findByUserIdAndProfileName(Long userId, String profileName);


}
