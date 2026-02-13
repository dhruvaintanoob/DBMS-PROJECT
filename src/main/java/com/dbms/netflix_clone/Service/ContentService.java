package com.dbms.netflix_clone.Service;

import com.dbms.netflix_clone.Entity.Content;
import com.dbms.netflix_clone.Repository.ContentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContentService {
    @Autowired
    private ContentRepo contentRepo;

    // 1. Add a Movie (Admin feature)
    public Content addContent(Content content) {
        return contentRepo.save(content);
    }

    // 2. Get All Movies (For the Home Page)
    public List<Content> getAllContent() {
        return contentRepo.findAll();
    }

    // 3. Get Single Movie Details (When user clicks a movie)
    public Optional<Content> getContentById(Long id) {
        return contentRepo.findById(id);
    }

    // 4. Search Functionality (Search Bar)
    public List<Content> searchByTitle(String title) {
        return contentRepo.findByTitleContaining(title);
    }

    // 5. Filter by Genre (e.g., "Show me all Action movies")
    public List<Content> getByGenre(String genre) {
        return contentRepo.findByGenreContaining(genre);
    }
}
