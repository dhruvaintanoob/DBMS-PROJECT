package com.dbms.netflix_clone.Repository;

import com.dbms.netflix_clone.Entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface WatchlistRepo extends JpaRepository<Watchlist, Long> {

    // Find all movies/shows saved to a specific profile
    List<Watchlist> findByProfileId(Long profileId);

    // Check if a specific piece of content is already in a specific profile's list
    boolean existsByProfileIdAndContentId(Long profileId, Long contentId);

    // In WatchlistRepo interface
    Watchlist findByProfileIdAndContentId(Long profileId, Long contentId);
    
    // Find all watchlist entries for a specific content
    List<Watchlist> findByContentId(Long contentId);
    
    // Delete all watchlist items for a profile
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM watchlist WHERE profile_id = :profileId", nativeQuery = true)
    void deleteByProfileId(Long profileId);
    
    // Delete all watchlist items for a content
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM watchlist WHERE content_id = :contentId", nativeQuery = true)
    void deleteByContentId(Long contentId);
}