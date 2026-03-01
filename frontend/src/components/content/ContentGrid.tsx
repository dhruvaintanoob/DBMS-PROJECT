import React from 'react';
import { Content } from '../../types';
import ContentCard from './ContentCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface ContentGridProps {
  content: Content[];
  isLoading?: boolean;
  title?: string;
  onPlay?: (content: Content) => void;
  onInfo?: (content: Content) => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({ 
  content, 
  isLoading = false, 
  title,
  onPlay,
  onInfo 
}) => {
  if (isLoading) {
    return (
      <div className="py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-lg">No content available</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {content.map((item) => (
          <ContentCard
            key={item.id}
            content={item}
            onPlay={onPlay}
            onInfo={onInfo}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentGrid;