import React, { useState, useEffect } from 'react';
import { UserContentInteraction, Content } from '../types';
import { interactionService } from '../services/interactionService';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import ContentGrid from '../components/content/ContentGrid';
import VideoPlayer from '../components/content/VideoPlayer';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HistoryPage: React.FC = () => {
  const { currentProfile, user } = useAuth();
  const [interactions, setInteractions] = useState<UserContentInteraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const profileId = currentProfile?.id || user?.id || 1;

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, currentProfile, filterType]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let historyData: UserContentInteraction[];
      if (filterType === 'all') {
        historyData = await interactionService.getProfileHistory(profileId);
      } else {
        historyData = await interactionService.getInteractionsByType(profileId, filterType);
      }
      
      setInteractions(Array.isArray(historyData) ? historyData : []);
    } catch (err: any) {
      console.error('History error:', err);
      if (err.response?.status === 404) {
        setInteractions([]);
      } else {
        setError(err.response?.data || 'Failed to load history');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-gray-400">You need to be logged in to view your history.</p>
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
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading History</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button onClick={loadHistory} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const content = interactions
    .filter(interaction => interaction?.content)
    .map(interaction => interaction.content);
    
  const uniqueContent = content.filter((item, index, self) => 
    index === self.findIndex(t => t?.id === item.id)
  );

  return (
    <div className="min-h-screen bg-neutral-black">
      <Header />
      
      <main className="pt-20 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Watch History</h1>
          <p className="text-gray-400">{interactions.length} interactions</p>
        </div>

        <div className="mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {['all', 'watched', 'liked', 'disliked'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors capitalize flex items-center gap-2 ${
                  filterType === type
                    ? 'bg-primary-blue text-white'
                    : 'bg-neutral-gray text-gray-300 hover:bg-neutral-lightGray'
                }`}
              >
                {type === 'liked' && '👍'}
                {type === 'disliked' && '👎'}
                {type === 'all' ? 'All Activity' : type}
              </button>
            ))}
          </div>
        </div>

        {interactions.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">No history found</h2>
            <p className="text-gray-400 mb-6">
              {filterType === 'all' 
                ? "Start watching content to build your history."
                : `No ${filterType} interactions found.`
              }
            </p>
            <a href="/browse" className="btn-primary">
              Browse Content
            </a>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {interactions.slice(0, 5).map((interaction) => (
                  interaction?.content ? (
                    <div key={interaction.interactionId} className="flex items-center gap-4 p-4 bg-neutral-dark rounded-lg">
                      <div className="w-16 h-10 bg-neutral-gray rounded flex items-center justify-center">
                        <span className="text-xs font-semibold">
                          {interaction.content.title.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{interaction.content.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="capitalize">{interaction.interactionType}</span>
                          {interaction.interactionType === 'liked' && <span className="text-green-500">👍</span>}
                          {interaction.interactionType === 'disliked' && <span className="text-red-500">👎</span>}
                          <span>•</span>
                          <span>{new Date(interaction.interactionDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlay(interaction.content)}
                        className="btn-primary px-4 py-2"
                      >
                        Play
                      </button>
                    </div>
                  ) : null
                ))}
              </div>
            </div>

            <ContentGrid
              content={uniqueContent}
              title="All Watched Content"
              onPlay={handlePlay}
              onInfo={handleInfo}
            />
          </>
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

export default HistoryPage;