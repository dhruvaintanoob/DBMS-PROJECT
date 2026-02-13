package com.dbms.netflix_clone.Repository;

import com.dbms.netflix_clone.Entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepo extends JpaRepository<Content, Long> {
    // 1. Search by Title (e.g., User types "Spider" -> finds "Spider-Man")
    List<Content> findByTitleContaining(String title);

    // 2. Filter by Genre (e.g., User clicks "Horror" category)
    List<Content> findByGenreContaining(String genre);
}
