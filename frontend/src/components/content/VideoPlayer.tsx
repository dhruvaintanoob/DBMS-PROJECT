import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize, Minimize, Lock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Content } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { canAccessContent, getRequiredUpgrade } from '../../utils/planUtils';
import { interactionService } from '../../services/interactionService';

interface VideoPlayerProps {
  content: Content;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ content, onClose }) => {
  const { user, currentProfile } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userRating, setUserRating] = useState<'liked' | 'disliked' | null>(null);
  const [showRatingMessage, setShowRatingMessage] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  
  // Check if user has access to this content
  const hasAccess = canAccessContent(user?.subscriptionPlan, content.requiredPlan);
  const requiredUpgrade = getRequiredUpgrade(user?.subscriptionPlan, content.requiredPlan);
  
  const profileId = currentProfile?.id || user?.id || 1;
  
  // Debug logging
  useEffect(() => {
    console.log('=== VideoPlayer Access Check ===');
    console.log('Full User Object:', user);
    console.log('User Plan:', user?.subscriptionPlan);
    console.log('Full Content Object:', content);
    console.log('Content Required Plan:', content.requiredPlan);
    console.log('Has Access:', hasAccess);
    console.log('Required Upgrade:', requiredUpgrade);
  }, [user, content, hasAccess, requiredUpgrade]);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    console.log('Extracting YouTube ID from URL:', url);
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        console.log('Extracted YouTube ID:', match[1]);
        return match[1];
      }
    }
    
    console.warn('Could not extract YouTube ID from URL:', url);
    return null;
  };

  const youtubeVideoId = content.youtubeUrl ? getYouTubeVideoId(content.youtubeUrl) : null;
  
  // Determine video source with fallback logic
  // If videoLocation is not set, determine by checking which URL exists
  const videoLocation = content.videoLocation || (content.youtubeUrl ? 'youtube' : content.localVideoPath ? 'local' : 'youtube');
  const isYouTube = videoLocation === 'youtube' && youtubeVideoId;
  const isLocal = videoLocation === 'local' && content.localVideoPath;
  const localVideoUrl = isLocal ? `http://localhost:8080/api/videos/stream?path=${encodeURIComponent(content.localVideoPath || '')}` : null;
  
  console.log('=== Video Source Detection ===');
  console.log('Content:', content);
  console.log('Video Location (from DB):', content.videoLocation);
  console.log('Determined Video Location:', videoLocation);
  console.log('YouTube URL:', content.youtubeUrl);
  console.log('YouTube Video ID:', youtubeVideoId);
  console.log('Local Video Path:', content.localVideoPath);
  console.log('Local Video URL:', localVideoUrl);
  console.log('Is YouTube:', isYouTube);
  console.log('Is Local:', isLocal);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen, onClose]);

  const enterFullscreen = () => {
    if (playerRef.current?.requestFullscreen) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const handleRating = async (rating: 'liked' | 'disliked') => {
    if (!user) return;
    
    try {
      // If clicking the same rating, remove it
      if (userRating === rating) {
        setUserRating(null);
        setShowRatingMessage(true);
        setTimeout(() => setShowRatingMessage(false), 2000);
        return;
      }
      
      // Record the rating as an interaction
      await interactionService.recordInteraction(profileId, content.id, rating);
      setUserRating(rating);
      setShowRatingMessage(true);
      setTimeout(() => setShowRatingMessage(false), 2000);
    } catch (error) {
      console.error('Error recording rating:', error);
    }
  };

  return (
    <div 
      ref={playerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Header with controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{content.title}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-300 mt-1">
              <span>{content.rating}</span>
              <span>•</span>
              <span>{content.duration} min</span>
              <span>•</span>
              <span>{content.genre}</span>
              {content.releaseDate && (
                <>
                  <span>•</span>
                  <span>{new Date(content.releaseDate).getFullYear()}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Rating buttons */}
            {user && hasAccess && (
              <>
                <button
                  onClick={() => handleRating('liked')}
                  className={`p-2 rounded-full transition-colors ${
                    userRating === 'liked' 
                      ? 'bg-green-600 text-white' 
                      : 'text-white hover:bg-white/20'
                  }`}
                  title="Like"
                >
                  <ThumbsUp size={20} fill={userRating === 'liked' ? 'currentColor' : 'none'} />
                </button>
                
                <button
                  onClick={() => handleRating('disliked')}
                  className={`p-2 rounded-full transition-colors ${
                    userRating === 'disliked' 
                      ? 'bg-red-600 text-white' 
                      : 'text-white hover:bg-white/20'
                  }`}
                  title="Dislike"
                >
                  <ThumbsDown size={20} fill={userRating === 'disliked' ? 'currentColor' : 'none'} />
                </button>
                
                <div className="w-px h-6 bg-gray-600 mx-2"></div>
              </>
            )}
            
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors p-2"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
            
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors p-2"
              title="Close player"
            >
              <X size={28} />
            </button>
          </div>
        </div>
        
        {/* Rating message */}
        {showRatingMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg">
            {userRating === 'liked' && '👍 Liked!'}
            {userRating === 'disliked' && '👎 Disliked!'}
            {!userRating && 'Rating removed'}
          </div>
        )}
      </div>

      {/* Video area */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {!hasAccess ? (
          // Blocked content - Modal-style popup
          <div className="relative z-20">
            {/* Backdrop blur */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/70" onClick={onClose}></div>
            
            {/* Modal content */}
            <div className="relative bg-neutral-dark border-2 border-yellow-600 rounded-2xl p-8 max-w-lg mx-auto shadow-2xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-yellow-600 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">Content Locked</h3>
                
                <div className="bg-yellow-600/20 border border-yellow-600 text-yellow-100 px-6 py-4 rounded-lg mb-6">
                  <p className="font-semibold text-lg mb-2">Upgrade Required</p>
                  <p className="text-sm">
                    "{content.title}" requires a <span className="font-bold">{requiredUpgrade}</span> subscription plan or higher.
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between bg-neutral-gray p-4 rounded-lg">
                    <span className="text-gray-400">Your Plan:</span>
                    <span className="font-semibold text-white">{user?.subscriptionPlan || 'Basic'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-primary-blue/20 border border-primary-blue p-4 rounded-lg">
                    <span className="text-gray-300">Required:</span>
                    <span className="font-semibold text-white">{requiredUpgrade} or Higher</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={onClose}
                    className="w-full btn-primary bg-primary-blue hover:bg-blue-600"
                  >
                    Browse Other Content
                  </button>
                  
                  <p className="text-xs text-gray-500">
                    Contact support to upgrade your subscription plan
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : isYouTube ? (
          // YouTube embedded player with controls visible
          <div className="w-full h-full flex items-center justify-center" style={{ paddingBottom: isFullscreen ? '0' : '60px' }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1&controls=1&fs=1`}
              title={content.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
              style={{ maxHeight: isFullscreen ? '100%' : 'calc(100vh - 140px)' }}
            />
          </div>
        ) : isLocal ? (
          // Local video player with HTML5 video element
          <div className="w-full h-full flex items-center justify-center" style={{ paddingBottom: isFullscreen ? '0' : '60px' }}>
            <video
              controls
              autoPlay
              className="w-full h-full"
              style={{ maxHeight: isFullscreen ? '100%' : 'calc(100vh - 140px)' }}
            >
              <source src={localVideoUrl || ''} type="video/mp4" />
              <source src={localVideoUrl || ''} type="video/webm" />
              <source src={localVideoUrl || ''} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          // Fallback for content without YouTube URL
          <div className="text-center p-8">
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-neutral-gray rounded-full flex items-center justify-center mb-4">
                <svg 
                  className="w-16 h-16 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{content.title}</h3>
              <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                {content.description}
              </p>
              <div className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg">
                <p className="font-semibold">No video source available</p>
                <p className="text-sm mt-1">This content doesn't have a YouTube URL configured</p>
              </div>
            </div>
            
            <div className="mt-8 text-gray-500 text-sm">
              <p>To add a video source, update the content with a YouTube URL</p>
            </div>
          </div>
        )}
      </div>

      {/* Description overlay (only show when not in fullscreen and no video) */}
      {!isFullscreen && content.description && !isYouTube && !isLocal && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pointer-events-none">
          <p className="text-gray-300 text-sm max-w-4xl">
            {content.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;