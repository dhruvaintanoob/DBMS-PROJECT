import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';

export interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  selectedSort: string;
  onSortSelect: (sortValue: string) => void;
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  selectedSort,
  onSortSelect,
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

  const handleSortSelect = (sortValue: string) => {
    onSortSelect(sortValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === selectedSort);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-gray hover:bg-neutral-lightGray text-white rounded-lg transition-colors min-w-32"
      >
        <ArrowUpDown size={16} />
        <span className="truncate">{selectedOption?.label || 'Sort by'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-neutral-dark border border-neutral-gray rounded-lg shadow-lg z-50 min-w-48">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              className={`w-full text-left px-4 py-2 hover:bg-neutral-gray transition-colors ${
                selectedSort === option.value ? 'bg-primary-blue text-white' : 'text-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;