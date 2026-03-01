import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize, Minimize } from 'lucide-react';
import { Content } from '../../types';

interface VideoPlayerProps {
  content: Content;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ content, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

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
  
  console.log('Content:', content);
  console.log('YouTube URL:', content.youtubeUrl);
  console.log('YouTube Video ID:', youtubeVideoId);

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
      </div>

      {/* Video area */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {youtubeVideoId ? (
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
      {!isFullscreen && content.description && !youtubeVideoId && (
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