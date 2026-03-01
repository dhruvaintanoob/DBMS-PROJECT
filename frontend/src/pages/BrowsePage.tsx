import React, { useState, useEffect } from 'react';
import { Content } from '../types';
import { contentService } from '../services/contentService';
import Header from '../components/layout/Header';
import ContentRow from '../components/content/ContentRow';
import ContentGrid from '../components/content/ContentGrid';
import VideoPlayer from '../components/content/VideoPlayer';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AddSampleContent from '../components/admin/AddSampleContent';
import GenreDropdown from '../components/content/GenreDropdown';
import SortDropdown, { SortOption } from '../components/content/SortDropdown';

const BrowsePage: React.FC = () => {
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('title');
  const [heroIndex, setHeroIndex] = useState<number>(0);

  const sortOptions: SortOption[] = [
    { value: 'title', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
    { value: 'release_date', label: 'Newest First' },
    { value: 'release_date_desc', label: 'Oldest First' },
    { value: 'duration', label: 'Shortest First' },
    { value: 'duration_desc', label: 'Longest First' },
    { value: 'rating', label: 'Rating A-Z' },
  ];

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allContent, selectedGenre, searchQuery, sortBy]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const content = await contentService.getAllContent();
      setAllContent(content);
    } catch (err: any) {
      setError(err.message || 'Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...allContent];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply genre filter
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(content =>
        content.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'release_date':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'release_date_desc':
          return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        case 'duration':
          return a.duration - b.duration;
        case 'duration_desc':
          return b.duration - a.duration;
        case 'rating':
          return a.rating.localeCompare(b.rating);
        default:
          return 0;
      }
    });

    setFilteredContent(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handlePlay = (content: Content) => {
    setSelectedContent(content);
    setShowPlayer(true);
  };

  const handleInfo = (content: Content) => {
    setSelectedContent(content);
    setShowContentModal(true);
  };

  const handleNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % Math.min(filteredContent.length, 5));
  };

  const handlePrevHero = () => {
    setHeroIndex((prev) => (prev - 1 + Math.min(filteredContent.length, 5)) % Math.min(filteredContent.length, 5));
  };

  const getUniqueGenres = () => {
    const genres = allContent.map(content => content.genre);
    return Array.from(new Set(genres)).filter(Boolean);
  };

  const getContentByGenre = (genre: string) => {
    return filteredContent.filter(content => content.genre === genre);
  };

  const getTrendingContent = () => {
    return filteredContent.slice(0, 10);
  };

  const getRecentlyAdded = () => {
    return [...filteredContent].sort((a, b) => 
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    ).slice(0, 10);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSortBy('title');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Content</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={loadContent}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-black">
      <Header onSearch={handleSearch} />
      
      <main className="pt-20 px-6">
        {/* Sample Content Adder - Show when no content */}
        {allContent.length === 0 && !isLoading && (
          <section className="mb-12">
            <AddSampleContent />
          </section>
        )}

        {/* Hero Section */}
        {filteredContent.length > 0 && (
          <section className="mb-12">
            <div className="relative h-96 bg-gradient-to-r from-neutral-dark to-neutral-gray rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <h1 className="text-5xl font-bold mb-4">{filteredContent[heroIndex].title}</h1>
                  <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                    {filteredContent[heroIndex].description}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => handlePlay(filteredContent[heroIndex])}
                      className="btn-primary text-lg px-8 py-3"
                    >
                      ▶ Play
                    </button>
                    <button 
                      onClick={() => handleInfo(filteredContent[heroIndex])}
                      className="btn-secondary text-lg px-8 py-3"
                    >
                      More Info
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              {filteredContent.length > 1 && (
                <>
                  <button
                    onClick={handlePrevHero}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    aria-label="Previous"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextHero}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    aria-label="Next"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {filteredContent.slice(0, 5).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setHeroIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === heroIndex ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Filters and Controls */}
        {allContent.length > 0 && (
          <section className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <GenreDropdown
                genres={getUniqueGenres()}
                selectedGenre={selectedGenre}
                onGenreSelect={handleGenreFilter}
              />
              
              <SortDropdown
                options={sortOptions}
                selectedSort={sortBy}
                onSortSelect={handleSortChange}
              />

              {(searchQuery || selectedGenre !== 'All' || sortBy !== 'title') && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Active filters display */}
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <span className="px-3 py-1 bg-primary-blue text-white rounded-full text-sm">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedGenre !== 'All' && (
                <span className="px-3 py-1 bg-primary-blue text-white rounded-full text-sm">
                  Genre: {selectedGenre}
                </span>
              )}
              {sortBy !== 'title' && (
                <span className="px-3 py-1 bg-primary-blue text-white rounded-full text-sm">
                  Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
                </span>
              )}
            </div>

            {/* Results count */}
            <p className="text-gray-400 text-sm">
              Showing {filteredContent.length} of {allContent.length} items
            </p>
          </section>
        )}

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <ContentGrid
            content={filteredContent}
            title={searchQuery ? `Search Results` : selectedGenre === 'All' ? 'All Content' : `${selectedGenre} Movies & Shows`}
            onPlay={handlePlay}
            onInfo={handleInfo}
          />
        ) : allContent.length > 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">No content found</h2>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filter criteria.
            </p>
            <button 
              onClick={clearAllFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        ) : null}
      </main>

      {/* Video Player */}
      {showPlayer && selectedContent && (
        <VideoPlayer
          content={selectedContent}
          onClose={() => setShowPlayer(false)}
        />
      )}

      {/* Content Info Modal */}
      <Modal
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
        title={selectedContent?.title}
      >
        {selectedContent && (
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>{selectedContent.rating}</span>
                <span>{selectedContent.duration} min</span>
                <span>{selectedContent.genre}</span>
                <span>{new Date(selectedContent.releaseDate).getFullYear()}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {selectedContent.description}
              </p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setShowContentModal(false);
                  handlePlay(selectedContent);
                }}
                className="btn-primary flex-1"
              >
                ▶ Play
              </button>
              <button 
                onClick={() => setShowContentModal(false)}
                className="btn-secondary px-6"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BrowsePage;