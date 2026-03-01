import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface GenreDropdownProps {
  genres: string[];
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
  className?: string;
}

const GenreDropdown: React.FC<GenreDropdownProps> = ({
  genres,
  selectedGenre,
  onGenreSelect,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenreSelect = (genre: string) => {
    onGenreSelect(genre);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-gray hover:bg-neutral-lightGray text-white rounded-lg transition-colors min-w-32"
      >
        <span className="truncate">{selectedGenre}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-neutral-dark border border-neutral-gray rounded-lg shadow-lg z-50 min-w-48 max-h-64 overflow-y-auto">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreSelect(genre)}
              className={`w-full text-left px-4 py-2 hover:bg-neutral-gray transition-colors ${
                selectedGenre === genre ? 'bg-primary-blue text-white' : 'text-gray-300'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreDropdown;