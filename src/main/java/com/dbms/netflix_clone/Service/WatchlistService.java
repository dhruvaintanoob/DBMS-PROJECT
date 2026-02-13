package com.dbms.netflix_clone.Service;

import com.dbms.netflix_clone.Entity.Content;
import com.dbms.netflix_clone.Entity.User;
import com.dbms.netflix_clone.Entity.Watchlist;
import com.dbms.netflix_clone.Repository.ContentRepo;
import com.dbms.netflix_clone.Repository.UserRepo;
import com.dbms.netflix_clone.Repository.WatchlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistService {

    @Autowired
    private WatchlistRepo watchlistRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ContentRepo contentRepo;

    // 1. Add to Watchlist
    public String addToWatchlist(Long userId, Long contentId) {
        // Step A: Check if it's already there
        if (watchlistRepo.existsByUserIdAndContentId(userId, contentId)) {
            return "Movie already in watchlist";
        }

        // Step B: Find the real User and Content objects
        User user = userRepo.findById(userId).orElse(null);
        Content content = contentRepo.findById(contentId).orElse(null);
        if (user == null || content == null) {
            return "User or Content not found";
        }

        // Step C: Link them and Save
        Watchlist item = new Watchlist();
        item.setUser(user);
        item.setContent(content);
        watchlistRepo.save(item);

        return "Added to watchlist";
    }

    // 2. Get User's Watchlist
    public List<Watchlist> getUserWatchlist(Long userId) {
        return watchlistRepo.findByUserId(userId);
    }

    // 3. Remove from Watchlist
    public String removeFromWatchlist(Long id) {
        watchlistRepo.deleteById(id);
        return "Removed from watchlist";
    }
}