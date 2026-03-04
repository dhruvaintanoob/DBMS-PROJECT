import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../content/SearchBar';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { user, currentProfile, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileChange = () => {
    navigate('/profiles');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black to-transparent">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/browse" className="text-primary-blue text-2xl font-bold">
            NetFlix Clone
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/browse" className="text-white hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link to="/watchlist" className="text-white hover:text-gray-300 transition-colors">
              My List
            </Link>
            <Link to="/history" className="text-white hover:text-gray-300 transition-colors">
              History
            </Link>
          </nav>
        </div>

        {/* Search and User Menu */}
        <div className="flex items-center gap-4">
          {onSearch && (
            <SearchBar onSearch={onSearch} />
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <User size={24} />
              <span className="hidden sm:inline">
                {currentProfile?.profileName || user?.username}
              </span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 bg-neutral-dark border border-neutral-gray rounded-xl shadow-lg min-w-48">
                <div className="p-2">
                  <button
                    onClick={handleProfileChange}
                    className="w-full text-left px-3 py-2 text-white hover:bg-neutral-gray rounded-lg flex items-center gap-2"
                  >
                    <User size={16} />
                    Switch Profile
                  </button>
                  
                  <Link
                    to="/settings"
                    className="w-full text-left px-3 py-2 text-white hover:bg-neutral-gray rounded-lg flex items-center gap-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  
                  <hr className="border-neutral-gray my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-white hover:bg-neutral-gray rounded-lg flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;