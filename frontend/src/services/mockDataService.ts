import { Content, Watchlist, UserContentInteraction } from '../types';

// Mock content data for testing
export const mockContent: Content[] = [
  {
    id: 1,
    title: "Big Buck Bunny",
    genre: "Animation",
    releaseDate: "2008-04-10",
    duration: 10,
    rating: "G",
    description: "A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.",
    youtubeUrl: "https://www.youtube.com/watch?v=YE7VzlLtp-4",
    thumbnailUrl: "https://i.ytimg.com/vi/YE7VzlLtp-4/maxresdefault.jpg"
  },
  {
    id: 2,
    title: "Sintel",
    genre: "Fantasy",
    releaseDate: "2010-09-30",
    duration: 15,
    rating: "PG",
    description: "A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. But when he is kidnapped by an adult dragon, Sintel decides to embark on a dangerous quest to find her lost friend Scales.",
    youtubeUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    thumbnailUrl: "https://i.ytimg.com/vi/eRsGyueVLvQ/maxresdefault.jpg"
  },
  {
    id: 3,
    title: "Tears of Steel",
    genre: "Sci-Fi",
    releaseDate: "2012-09-26",
    duration: 12,
    rating: "PG-13",
    description: "In an apocalyptic future, a group of soldiers and scientists takes refuge in Amsterdam to try to stop an army of robots that threatens humanity.",
    youtubeUrl: "https://www.youtube.com/watch?v=R6MlUcmOul8",
    thumbnailUrl: "https://i.ytimg.com/vi/R6MlUcmOul8/maxresdefault.jpg"
  },
  {
    id: 4,
    title: "Elephant's Dream",
    genre: "Surreal",
    releaseDate: "2006-03-24",
    duration: 11,
    rating: "PG",
    description: "Two strange characters explore a capricious and seemingly infinite machine.",
    youtubeUrl: "https://www.youtube.com/watch?v=TLkA0RELQ1g",
    thumbnailUrl: "https://i.ytimg.com/vi/TLkA0RELQ1g/maxresdefault.jpg"
  },
  {
    id: 5,
    title: "Cosmos Laundromat",
    genre: "Comedy",
    releaseDate: "2015-08-10",
    duration: 12,
    rating: "PG",
    description: "On a desolate island, a suicidal sheep named Franck meets his fate in a quirky salesman.",
    youtubeUrl: "https://www.youtube.com/watch?v=Y-rmzh0PI3c",
    thumbnailUrl: "https://i.ytimg.com/vi/Y-rmzh0PI3c/maxresdefault.jpg"
  },
  {
    id: 6,
    title: "Spring",
    genre: "Nature",
    releaseDate: "2019-04-04",
    duration: 8,
    rating: "G",
    description: "A beautiful and meditative short film about the cycle of life.",
    youtubeUrl: "https://www.youtube.com/watch?v=WhWc3b3KhnY",
    thumbnailUrl: "https://i.ytimg.com/vi/WhWc3b3KhnY/maxresdefault.jpg"
  }
];

// Mock watchlist data
export const mockWatchlist: Watchlist[] = [];

// Mock interactions data
export const mockInteractions: UserContentInteraction[] = [];

// Helper function to check if backend is available
export const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch('http://localhost:8080/api/content/all', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Mock service functions
export const mockServices = {
  content: {
    getAllContent: () => Promise.resolve(mockContent),
    getContentById: (id: number) => Promise.resolve(mockContent.find(c => c.id === id)),
    searchContent: (title: string) => Promise.resolve(
      mockContent.filter(c => c.title.toLowerCase().includes(title.toLowerCase()))
    ),
    filterByGenre: (genre: string) => Promise.resolve(
      mockContent.filter(c => c.genre.toLowerCase().includes(genre.toLowerCase()))
    )
  },
  
  watchlist: {
    getProfileWatchlist: () => Promise.resolve(mockWatchlist),
    addToWatchlist: (profileId: number, contentId: number) => {
      const content = mockContent.find(c => c.id === contentId);
      if (content) {
        const exists = mockWatchlist.find(w => w.content.id === contentId);
        if (exists) {
          return Promise.resolve('Already in watchlist');
        }
        
        const watchlistItem: Watchlist = {
          id: Date.now(),
          profile: { id: profileId, profileName: 'Mock Profile', isKidProfile: false },
          content,
          addedAt: new Date().toISOString()
        };
        mockWatchlist.push(watchlistItem);
        return Promise.resolve('Added to watchlist');
      }
      return Promise.reject(new Error('Content not found'));
    },
    removeFromWatchlist: (profileId: number, contentId: number) => {
      const index = mockWatchlist.findIndex(w => w.content.id === contentId);
      if (index > -1) {
        mockWatchlist.splice(index, 1);
        return Promise.resolve('Removed from watchlist');
      }
      return Promise.reject(new Error('Item not found in watchlist'));
    }
  },
  
  interactions: {
    getProfileHistory: () => Promise.resolve(mockInteractions),
    getInteractionsByType: (profileId: number, type: string) => Promise.resolve(
      mockInteractions.filter(i => i.interactionType === type)
    ),
    recordInteraction: (profileId: number, contentId: number, type: string) => {
      const content = mockContent.find(c => c.id === contentId);
      if (content) {
        const interaction: UserContentInteraction = {
          interactionId: Date.now(),
          profile: { id: profileId, profileName: 'Mock Profile', isKidProfile: false },
          content,
          interactionType: type,
          interactionDate: new Date().toISOString()
        };
        mockInteractions.push(interaction);
        return Promise.resolve('Interaction recorded');
      }
      return Promise.reject(new Error('Content not found'));
    }
  }
};