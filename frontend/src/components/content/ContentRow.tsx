import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Content } from '../../types';
import ContentCard from './ContentCard';

interface ContentRowProps {
  title: string;
  content: Content[];
  onPlay?: (content: Content) => void;
  onInfo?: (content: Content) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, content, onPlay, onInfo }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (content.length === 0) return null;

  return (
    <div className="mb-8 group/row">
      <h2 className="text-2xl font-bold mb-4 px-6">{title}</h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-neutral-black to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft size={40} className="text-white drop-shadow-lg" />
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {content.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-64">
              <ContentCard
                content={item}
                onPlay={onPlay}
                onInfo={onInfo}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-neutral-black to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight size={40} className="text-white drop-shadow-lg" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentRow;