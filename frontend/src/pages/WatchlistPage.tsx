import React, { useState, useEffect } from 'react';
import { Watchlist, Content } from '../types';
import { watchlistService } from '../services/watchlistService';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import ContentGrid from '../components/content/ContentGrid';
import VideoPlayer from '../components/content/VideoPlayer';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const WatchlistPage: React.FC = () => {
  const { currentProfile, user } = useAuth();
  const [watchlist, setWatchlist] = useState<Watchlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  const profileId = currentProfile?.id || user?.id || 1;

  useEffect(() => {
    if (user) {
      loadWatchlist();
    }
  }, [user, currentProfile]);

  const loadWatchlist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const watchlistData = await watchlistService.getProfileWatchlist(profileId);
      setWatchlist(Array.isArray(watchlistData) ? watchlistData : []);
    } catch (err: any) {
      console.error('Watchlist error:', err);
      if (err.response?.status === 404) {
        setWatchlist([]);
      } else {
        setError(err.response?.data || 'Failed to load watchlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (content: Content) => {
    setSelectedContent(content);
    setShowPlayer(true);
  };

  const handleInfo = (content: Content) => {
    setSelectedContent(content);
    setShowContentModal(true);
  };

  const handleRemoveFromWatchlist = async (contentId: number) => {
    try {
      await watchlistService.removeFromWatchlist(profileId, contentId);
      setWatchlist(prev => prev.filter(item => item.content?.id !== contentId));
    } catch (err: any) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-gray-400">You need to be logged in to view your watchlist.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-black">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-black">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Watchlist</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button onClick={loadWatchlist} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const content = watchlist
    .filter(item => item?.content)
    .map(item => item.content);

  return (
    <div className="min-h-screen bg-neutral-black">
      <Header />
      
      <main className="pt-20 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My List</h1>
          <p className="text-gray-400">{watchlist.length} items</p>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">Your list is empty</h2>
            <p className="text-gray-400 mb-6">
              Add movies and TV shows to your list to watch them later.
            </p>
            <a href="/browse" className="btn-primary">
              Browse Content
            </a>
          </div>
        ) : (
          <ContentGrid
            content={content}
            onPlay={handlePlay}
            onInfo={handleInfo}
          />
        )}
      </main>

      {showPlayer && selectedContent && (
        <VideoPlayer
          content={selectedContent}
          onClose={() => setShowPlayer(false)}
        />
      )}

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
                onClick={() => {
                  handleRemoveFromWatchlist(selectedContent.id);
                  setShowContentModal(false);
                }}
                className="btn-secondary px-6"
              >
                Remove from List
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WatchlistPage;