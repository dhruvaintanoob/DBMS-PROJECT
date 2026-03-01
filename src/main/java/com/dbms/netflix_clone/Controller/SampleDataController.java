package com.dbms.netflix_clone.Controller;

import com.dbms.netflix_clone.Entity.Content;
import com.dbms.netflix_clone.Service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/sample")
public class SampleDataController {

    @Autowired
    private ContentService contentService;

    // POST: Add sample content with YouTube videos
    // URL: http://localhost:8080/api/sample/content
    @PostMapping("/content")
    public String addSampleContent() {
        try {
            List<Content> sampleContent = createSampleContent();
            
            for (Content content : sampleContent) {
                contentService.addContent(content);
            }
            
            return "Sample content added successfully! Added " + sampleContent.size() + " items.";
        } catch (Exception e) {
            return "Error adding sample content: " + e.getMessage();
        }
    }

    private List<Content> createSampleContent() {
        List<Content> contentList = new ArrayList<>();

        // Big Buck Bunny
        Content bigBuckBunny = new Content();
        bigBuckBunny.setTitle("Big Buck Bunny");
        bigBuckBunny.setGenre("Animation");
        bigBuckBunny.setReleaseDate(LocalDate.of(2008, 4, 10));
        bigBuckBunny.setDuration(10);
        bigBuckBunny.setRating("G");
        bigBuckBunny.setDescription("A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.");
        bigBuckBunny.setYoutubeUrl("https://www.youtube.com/watch?v=YE7VzlLtp-4");
        bigBuckBunny.setThumbnailUrl("https://i.ytimg.com/vi/YE7VzlLtp-4/maxresdefault.jpg");
        contentList.add(bigBuckBunny);

        // Sintel
        Content sintel = new Content();
        sintel.setTitle("Sintel");
        sintel.setGenre("Fantasy");
        sintel.setReleaseDate(LocalDate.of(2010, 9, 30));
        sintel.setDuration(15);
        sintel.setRating("PG");
        sintel.setDescription("A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. But when he is kidnapped by an adult dragon, Sintel decides to embark on a dangerous quest to find her lost friend Scales.");
        sintel.setYoutubeUrl("https://www.youtube.com/watch?v=eRsGyueVLvQ");
        sintel.setThumbnailUrl("https://i.ytimg.com/vi/eRsGyueVLvQ/maxresdefault.jpg");
        contentList.add(sintel);

        // Tears of Steel
        Content tearsOfSteel = new Content();
        tearsOfSteel.setTitle("Tears of Steel");
        tearsOfSteel.setGenre("Sci-Fi");
        tearsOfSteel.setReleaseDate(LocalDate.of(2012, 9, 26));
        tearsOfSteel.setDuration(12);
        tearsOfSteel.setRating("PG-13");
        tearsOfSteel.setDescription("In an apocalyptic future, a group of soldiers and scientists takes refuge in Amsterdam to try to stop an army of robots that threatens humanity.");
        tearsOfSteel.setYoutubeUrl("https://www.youtube.com/watch?v=R6MlUcmOul8");
        tearsOfSteel.setThumbnailUrl("https://i.ytimg.com/vi/R6MlUcmOul8/maxresdefault.jpg");
        contentList.add(tearsOfSteel);

        // Elephant's Dream
        Content elephantsDream = new Content();
        elephantsDream.setTitle("Elephant's Dream");
        elephantsDream.setGenre("Surreal");
        elephantsDream.setReleaseDate(LocalDate.of(2006, 3, 24));
        elephantsDream.setDuration(11);
        elephantsDream.setRating("PG");
        elephantsDream.setDescription("Two strange characters explore a capricious and seemingly infinite machine. The elder, Proog, acts as a tour-guide and protector, happily showing off the sights and dangers of the machine to his initially curious but increasingly skeptical protege Emo.");
        elephantsDream.setYoutubeUrl("https://www.youtube.com/watch?v=TLkA0RELQ1g");
        elephantsDream.setThumbnailUrl("https://i.ytimg.com/vi/TLkA0RELQ1g/maxresdefault.jpg");
        contentList.add(elephantsDream);

        // Cosmos Laundromat
        Content cosmosLaundromat = new Content();
        cosmosLaundromat.setTitle("Cosmos Laundromat");
        cosmosLaundromat.setGenre("Comedy");
        cosmosLaundromat.setReleaseDate(LocalDate.of(2015, 8, 10));
        cosmosLaundromat.setDuration(12);
        cosmosLaundromat.setRating("PG");
        cosmosLaundromat.setDescription("On a desolate island, a suicidal sheep named Franck meets his fate in a quirky salesman, who offers him the gift of a lifetime. Little does he know that he can only handle this much 'lifetime'.");
        cosmosLaundromat.setYoutubeUrl("https://www.youtube.com/watch?v=Y-rmzh0PI3c");
        cosmosLaundromat.setThumbnailUrl("https://i.ytimg.com/vi/Y-rmzh0PI3c/maxresdefault.jpg");
        contentList.add(cosmosLaundromat);

        // Spring
        Content spring = new Content();
        spring.setTitle("Spring");
        spring.setGenre("Nature");
        spring.setReleaseDate(LocalDate.of(2019, 4, 4));
        spring.setDuration(8);
        spring.setRating("G");
        spring.setDescription("Spring is a beautiful and meditative short film about the cycle of life, showcasing the beauty of nature through stunning visuals and peaceful storytelling.");
        spring.setYoutubeUrl("https://www.youtube.com/watch?v=WhWc3b3KhnY");
        spring.setThumbnailUrl("https://i.ytimg.com/vi/WhWc3b3KhnY/maxresdefault.jpg");
        contentList.add(spring);

        return contentList;
    }
}