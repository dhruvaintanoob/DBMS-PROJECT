import React, { useState, useEffect } from 'react';
import { Play, Plus, Info, Check, Lock } from 'lucide-react';
import { Content } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { watchlistService } from '../../services/watchlistService';
import { interactionService } from '../../services/interactionService';
import { canAccessContent } from '../../utils/planUtils';

interface ContentCardProps {
  content: Content;
  onPlay?: (content: Content) => void;
  onInfo?: (content: Content) => void;
  isInWatchlist?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  content, 
  onPlay, 
  onInfo, 
  isInWatchlist: initialWatchlistState = false 
}) => {
  const { currentProfile, user } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(initialWatchlistState);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string>('');
  
  // Check if user has access to this content
  const hasAccess = canAccessContent(user?.subscriptionPlan, content.requiredPlan);

  // Use a mock profile ID if no profile is selected but user exists
  const getProfileId = () => {
    if (currentProfile?.id) return currentProfile.id;
    if (user?.id) return user.id; // Fallback to user ID
    return 1; // Default fallback
  };

  const showMessage = (message: string) => {
    setActionMessage(message);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      showMessage('Please log in first');
      return;
    }
    
    setIsLoading(true);
    try {
      const profileId = getProfileId();
      
      if (isInWatchlist) {
        await watchlistService.removeFromWatchlist(profileId, content.id);
        setIsInWatchlist(false);
        showMessage('Removed from watchlist');
      } else {
        await watchlistService.addToWatchlist(profileId, content.id);
        setIsInWatchlist(true);
        showMessage('Added to watchlist');
      }
    } catch (error: any) {
      console.error('Error updating watchlist:', error);
      let errorMessage = 'Failed to update watchlist';
      
      if (error.response?.status === 404) {
        errorMessage = 'Profile or content not found';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data || 'Invalid request';
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || errorMessage;
      }
      
      showMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    if (user) {
      try {
        const profileId = getProfileId();
        await interactionService.recordInteraction(profileId, content.id, 'watched');
      } catch (error) {
        console.error('Error recording interaction:', error);
        // Don't show error to user for this, as it's not critical
      }
    }
    onPlay?.(content);
  };

  return (
    <div className="content-card group relative">
      {/* Action message */}
      {actionMessage && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm z-10">
          {actionMessage}
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative aspect-video bg-neutral-gray rounded-t-xl">
        {content.thumbnailUrl ? (
          <img 
            src={content.thumbnailUrl} 
            alt={content.title}
            className="w-full h-full object-cover rounded-t-xl"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-center p-4">
              {content.title}
            </span>
          </div>
        )}
        
        {/* Plan restriction badge */}
        {!hasAccess && content.requiredPlan && (
          <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded flex items-center gap-1 text-xs font-semibold">
            <Lock size={12} />
            {content.requiredPlan}
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-t-xl">
          <button
            onClick={handlePlay}
            className="bg-white text-black rounded-full p-3 hover:bg-gray-200 transition-colors shadow-lg"
          >
            {hasAccess ? (
              <Play size={24} fill="currentColor" />
            ) : (
              <Lock size={24} />
            )}
          </button>
        </div>
      </div>
      
      {/* Content info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{content.title}</h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>{content.rating || 'NR'}</span>
          <span>•</span>
          <span>{content.duration} min</span>
          <span>•</span>
          <span>{content.genre || 'General'}</span>
        </div>
        
        <p className="text-sm text-gray-300 line-clamp-3 mb-4">
          {content.description}
        </p>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            title={hasAccess ? 'Play' : `Requires ${content.requiredPlan} plan`}
          >
            {hasAccess ? (
              <>
                <Play size={16} fill="currentColor" />
                Play
              </>
            ) : (
              <>
                <Lock size={16} />
                Locked
              </>
            )}
          </button>
          
          <button
            onClick={handleAddToWatchlist}
            disabled={isLoading}
            className={`btn-secondary p-2 ${isInWatchlist ? 'bg-green-600 hover:bg-green-700' : ''}`}
            title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isInWatchlist ? (
              <Check size={16} />
            ) : (
              <Plus size={16} />
            )}
          </button>
          
          <button
            onClick={() => onInfo?.(content)}
            className="btn-secondary p-2"
            title="More info"
          >
            <Info size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;