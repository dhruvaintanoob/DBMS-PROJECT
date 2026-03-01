import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { Profile } from '../../types';
import { User } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileSelector: React.FC = () => {
  const { user, setCurrentProfile } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadProfiles();
    }
  }, [user]);

  const loadProfiles = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const userProfiles = await profileService.getUserProfiles(user.id);
      
      // If no profiles exist, create a default one
      if (userProfiles.length === 0) {
        await profileService.createProfile(user.id, user.username || 'Main Profile', false);
        const newProfiles = await profileService.getUserProfiles(user.id);
        setProfiles(newProfiles);
      } else {
        setProfiles(userProfiles);
      }
    } catch (err: any) {
      console.error('Error loading profiles:', err);
      setError('Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSelect = (profile: Profile) => {
    setCurrentProfile(profile);
    navigate('/browse');
  };

  const handleAddProfile = async () => {
    if (!user?.id) return;
    
    const profileName = prompt('Enter profile name:');
    if (!profileName) return;
    
    try {
      await profileService.createProfile(user.id, profileName, false);
      await loadProfiles();
    } catch (err) {
      console.error('Error creating profile:', err);
      alert('Failed to create profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button onClick={loadProfiles} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-black flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Who's watching?</h1>
      
      <div className="flex flex-wrap gap-8 justify-center">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => handleProfileSelect(profile)}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-32 h-32 bg-neutral-gray rounded-xl flex items-center justify-center mb-4 group-hover:bg-neutral-lightGray transition-colors shadow-lg">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.profileName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <User size={64} className="text-white" />
              )}
            </div>
            <span className="text-lg text-gray-300 group-hover:text-white transition-colors">
              {profile.profileName}
            </span>
            {profile.isKidProfile && (
              <span className="text-sm text-yellow-400">KIDS</span>
            )}
          </div>
        ))}
        
        <div 
          onClick={handleAddProfile}
          className="flex flex-col items-center cursor-pointer group"
        >
          <div className="w-32 h-32 bg-neutral-gray rounded-xl flex items-center justify-center mb-4 group-hover:bg-neutral-lightGray transition-colors border-2 border-dashed border-neutral-silver shadow-lg">
            <span className="text-4xl text-neutral-silver">+</span>
          </div>
          <span className="text-lg text-gray-300 group-hover:text-white transition-colors">
            Add Profile
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelector;