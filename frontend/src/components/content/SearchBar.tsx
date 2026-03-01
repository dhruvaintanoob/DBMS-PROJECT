import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search movies and TV shows...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    setIsExpanded(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className={`flex items-center transition-all duration-300 ${
          isExpanded ? 'bg-neutral-dark border border-white rounded-lg' : 'bg-transparent'
        }`}>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-white hover:text-gray-300 transition-colors"
          >
            <Search size={20} />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`bg-transparent text-white placeholder-gray-400 outline-none transition-all duration-300 ${
              isExpanded ? 'w-64 px-2 py-2' : 'w-0 px-0'
            }`}
            onFocus={() => setIsExpanded(true)}
          />
          
          {isExpanded && query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;