package com.dbms.netflix_clone.Controller;

import com.dbms.netflix_clone.Entity.Content;
import com.dbms.netflix_clone.Service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/content")

public class ContentController {
    @Autowired
    private ContentService contentService;

    // 1. POST: Add a new movie
    // URL: http://localhost:8080/api/content/add
    @PostMapping("/add")
    public Content addContent(@RequestBody Content content) {
        return contentService.addContent(content);
    }

    // 2. GET: Get all movies
    // URL: http://localhost:8080/api/content/all
    @GetMapping("/all")
    public List<Content> getAllContent() {
        return contentService.getAllContent();
    }

    // 3. GET: Search movies
    // URL: http://localhost:8080/api/content/search?title=Spider
    @GetMapping("/search")
    public List<Content> searchContent(@RequestParam String title) {
        return contentService.searchByTitle(title);
    }

    // 4. GET: Filter by Genre
    // URL: http://localhost:8080/api/content/filter?genre=Action
    @GetMapping("/filter")
    public List<Content> filterByGenre(@RequestParam String genre) {
        return contentService.getByGenre(genre);
    }
    
    // 5. GET: Get movie by ID
    // URL: http://localhost:8080/api/content/1
    @GetMapping("/{id}")
    public Optional<Content> getContentById(@PathVariable Long id) {
        return contentService.getContentById(id);
    }
}
