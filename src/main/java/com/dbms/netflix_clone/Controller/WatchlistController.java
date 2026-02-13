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
    public String addToWatchlist(@RequestParam Long userId, @RequestParam Long contentId) {
        return watchlistService.addToWatchlist(userId, contentId);
    }

    // 2. GET: Get a user's watchlist
    @GetMapping("/user/{userId}")
    public List<Watchlist> getUserWatchlist(@PathVariable Long userId) {
        return watchlistService.getUserWatchlist(userId);
    

    // 3. DELETE: Remove an item
    @DeleteMapping("/delete/{id}")
    public String removeFromWatchlist(@PathVariable Long id) {
        return watchlistService.removeFromWatchlist(id);
    }
}