package com.dbms.netflix_clone.Service;

import com.dbms.netflix_clone.Entity.Content;
import com.dbms.netflix_clone.Entity.Profile;
import com.dbms.netflix_clone.Entity.Watchlist;
import com.dbms.netflix_clone.Repository.ContentRepo;
import com.dbms.netflix_clone.Repository.ProfileRepo;
import com.dbms.netflix_clone.Repository.WatchlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;



//In Spring Boot (Spring Data JPA), the Repository is the "Library Catalog" 
// (finding things), while the Service is the "Librarian" (doing the work).

//1. How Insertion Actually Works
//You don't write a save() method in your Repository because 
// JpaRepository already provides one for you. Instead, the logic happens in your Service class:



@Service
public class WatchlistService {

    @Autowired
    private WatchlistRepo watchlistRepo;

    @Autowired
    private ProfileRepo profileRepo; // Switched from UserRepo

    @Autowired
    private ContentRepo contentRepo;

    // 1. Add to Watchlist using Profile ID
    public String addToWatchlist(Long profileId, Long contentId) {
        // Step A: Check if it's already in this specific profile's watchlist
        if (watchlistRepo.existsByProfileIdAndContentId(profileId, contentId)) {
            return "Movie already in profile watchlist";
        }

        // Step B: Find the real Profile and Content objects
        Profile profile = profileRepo.findById(profileId).orElse(null);
        Content content = contentRepo.findById(contentId).orElse(null);

        if (profile == null || content == null) {
            return "Profile or Content not found";
        }

        // Step C: Link them to the Profile and Save
        Watchlist item = new Watchlist();
        item.setProfile(profile); // Link to Profile instead of User
        item.setContent(content);
        watchlistRepo.save(item);

        return "Added to watchlist";
    }

    // 2. Get a Specific Profile's Watchlist
    public List<Watchlist> getProfileWatchlist(Long profileId) {
        return watchlistRepo.findByProfileId(profileId);
    }

    // 3. Remove from Watchlist
    public String removeFromWatchlist(Long profileId, Long contentId) {
    // We find the specific entry that matches both the profile and the content
    Watchlist item = watchlistRepo.findByProfileIdAndContentId(profileId, contentId);
    
    if (item != null) {
        watchlistRepo.delete(item);
        return "Removed from watchlist";
    } else {
        return "Item not found in this profile's watchlist";
    }

    

    }


    
}

