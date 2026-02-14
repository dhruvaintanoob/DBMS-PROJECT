package com.dbms.netflix_clone.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dbms.netflix_clone.Entity.User;


import com.dbms.netflix_clone.Entity.Profile;
import java.util.List;


@Repository
public interface ProfileRepo  extends JpaRepository<Profile,Long> {

    List<Profile> findByUserId(Long userId);

    
    boolean existsByUserIdAndProfileName(Long userId, String profileName);



}
