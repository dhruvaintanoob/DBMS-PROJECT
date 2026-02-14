package com.dbms.netflix_clone.Controller;

import com.dbms.netflix_clone.Entity.Watchlist;
import com.dbms.netflix_clone.Service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController

@RequestMapping("/api/watchlist")
public class WatchlistController {
    @Autowired
    private WatchlistService watchlistService;

    // 1. POST: Add movie to watchlist
    @PostMapping("/add")
    public String addToWatchlist(@RequestParam Long profileId, @RequestParam Long contentId) {
        return watchlistService.addToWatchlist(profileId, contentId);
    }

    // 2. GET: Get a specific profile's watchlist
    // FIX: Path variable name {profileId} must match the @PathVariable name
    @GetMapping("/profile/{profileId}") 
    public List<Watchlist> getProfileWatchlist(@PathVariable Long profileId) {
        return watchlistService.getProfileWatchlist(profileId);
    }

    // 3. DELETE: Remove an item using both IDs for safety
    @DeleteMapping("/remove")
    public String removeFromWatchlist(@RequestParam Long profileId, @RequestParam Long contentId) {
      return watchlistService.removeFromWatchlist(profileId, contentId);
    }  
}