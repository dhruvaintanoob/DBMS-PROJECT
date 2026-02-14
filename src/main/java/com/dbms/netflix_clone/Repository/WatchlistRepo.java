package com.dbms.netflix_clone.Repository;

import com.dbms.netflix_clone.Entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchlistRepo extends JpaRepository<Watchlist, Long> {

    // Find all movies/shows saved to a specific profile
    List<Watchlist> findByProfileId(Long profileId);

    // Check if a specific piece of content is already in a specific profile's list
    boolean existsByProfileIdAndContentId(Long profileId, Long contentId);


    // In WatchlistRepo interface
    Watchlist findByProfileIdAndContentId(Long profileId, Long contentId);
}