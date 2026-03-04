import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { User, Lock, Bell, Monitor, Shield } from 'lucide-react';
import { profileService } from '../services/profileService';

const SettingsPage: React.FC = () => {
  const { user, currentProfile, logout, setCurrentProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Profile settings state
  const [profileName, setProfileName] = useState(currentProfile?.profileName || '');
  const [isKidProfile, setIsKidProfile] = useState(currentProfile?.isKidProfile || false);
  
  // Notification settings state
  const [notifications, setNotifications] = useState({
    newContent: true,
    recommendations: true,
    watchlist: true,
    email: false,
    push: false,
  });
  
  // Playback settings state
  const [playbackSettings, setPlaybackSettings] = useState({
    videoQuality: 'auto',
    autoplayNext: true,
    autoplayPreviews: false,
    subtitles: 'off',
    audio: 'en',
  });
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    analytics: true,
    marketing: false,
    thirdParty: false,
  });

  useEffect(() => {
    if (currentProfile) {
      setProfileName(currentProfile.profileName);
      setIsKidProfile(currentProfile.isKidProfile);
    }
  }, [currentProfile]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveProfile = async () => {
    if (!currentProfile) return;
    
    setIsLoading(true);
    try {
      await profileService.updateProfile(
        currentProfile.id,
        profileName,
        isKidProfile,
        currentProfile.avatarUrl
      );
      
      // Update the current profile in context
      const updatedProfile = { ...currentProfile, profileName, isKidProfile };
      setCurrentProfile(updatedProfile);
      
      showMessage('success', 'Profile updated successfully!');
    } catch (error: any) {
      showMessage('error', error.response?.data || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
    showMessage('success', 'Notification preferences saved!');
  };

  const handleSavePlayback = () => {
    localStorage.setItem('playbackSettings', JSON.stringify(playbackSettings));
    showMessage('success', 'Playback settings saved!');
  };

  const handleSavePrivacy = () => {
    localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
    showMessage('success', 'Privacy settings saved!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'playback', label: 'Playback', icon: Monitor },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile Settings</h2>
            
            {message && (
              <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                {message.text}
              </div>
            )}
            
            <div className="bg-neutral-dark p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-neutral-gray rounded-xl flex items-center justify-center">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{profileName}</h3>
                  <p className="text-gray-400">{isKidProfile ? 'Kids Profile' : 'Adult Profile'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="input-field"
                    placeholder="Enter profile name"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="kidProfile"
                    checked={isKidProfile}
                    onChange={(e) => setIsKidProfile(e.target.checked)}
                    className="w-4 h-4 text-primary-blue bg-neutral-gray border-neutral-lightGray rounded"
                  />
                  <label htmlFor="kidProfile" className="text-sm">
                    This is a kids profile
                  </label>
                </div>
                
                <button 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            
            {message && (
              <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                {message.text}
              </div>
            )}
            
            <div className="bg-neutral-dark p-6 rounded-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={user?.username}
                    className="input-field bg-neutral-gray cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    className="input-field bg-neutral-gray cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subscription Plan</label>
                  <div className="bg-neutral-gray p-4 rounded-lg border-2 border-primary-blue">
                    <h3 className="text-2xl font-semibold mb-2">
                      {user?.subscriptionPlan || 'Basic'} Plan
                    </h3>
                    <p className="text-sm text-gray-400">
                      {user?.subscriptionPlan === 'Basic' && 'Watch on 1 device • Standard Definition'}
                      {user?.subscriptionPlan === 'Standard' && 'Watch on 2 devices • High Definition'}
                      {user?.subscriptionPlan === 'Premium' && 'Watch on 4 devices • Ultra High Definition'}
                      {!user?.subscriptionPlan && 'Watch on 1 device • Standard Definition'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Plan selected during registration cannot be changed</p>
                </div>
                
                <div className="pt-4 border-t border-neutral-gray">
                  <button 
                    onClick={handleLogout}
                    className="btn-secondary bg-red-600 hover:bg-red-700 w-full"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Notification Settings</h2>
            
            {message && (
              <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                {message.text}
              </div>
            )}
            
            <div className="bg-neutral-dark p-6 rounded-xl">
              <div className="space-y-4">
                {[
                  { id: 'newContent', label: 'New content notifications', description: 'Get notified when new movies and shows are added' },
                  { id: 'recommendations', label: 'Personalized recommendations', description: 'Receive suggestions based on your viewing history' },
                  { id: 'watchlist', label: 'Watchlist updates', description: 'Notifications when items in your list become available' },
                  { id: 'email', label: 'Email notifications', description: 'Receive notifications via email' },
                  { id: 'push', label: 'Push notifications', description: 'Browser push notifications' },
                ].map((setting) => (
                  <div key={setting.id} className="flex items-start gap-3 p-4 bg-neutral-gray rounded-lg">
                    <input
                      type="checkbox"
                      id={setting.id}
                      checked={notifications[setting.id as keyof typeof notifications]}
                      onChange={(e) => setNotifications({ ...notifications, [setting.id]: e.target.checked })}
                      className="w-4 h-4 text-primary-blue bg-neutral-gray border-neutral-lightGray rounded mt-1"
                    />
                    <div>
                      <label htmlFor={setting.id} className="font-medium cursor-pointer">
                        {setting.label}
                      </label>
                      <p className="text-sm text-gray-400 mt-1">{setting.description}</p>
                    </div>
                  </div>
                ))}
                
                <button onClick={handleSaveNotifications} className="btn-primary">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        );

      case 'playback':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Playback Settings</h2>
            
            {message && (
              <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                {message.text}
              </div>
            )}
            
            <div className="bg-neutral-dark p-6 rounded-xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Video Quality</label>
                  <select 
                    className="input-field"
                    value={playbackSettings.videoQuality}
                    onChange={(e) => setPlaybackSettings({ ...playbackSettings, videoQuality: e.target.value })}
                  >
                    <option value="auto">Auto (recommended)</option>
                    <option value="high">High (1080p)</option>
                    <option value="medium">Medium (720p)</option>
                    <option value="low">Low (480p)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Autoplay</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="autoplayNext"
                        checked={playbackSettings.autoplayNext}
                        onChange={(e) => setPlaybackSettings({ ...playbackSettings, autoplayNext: e.target.checked })}
                        className="w-4 h-4 text-primary-blue bg-neutral-gray border-neutral-lightGray rounded"
                      />
                      <label htmlFor="autoplayNext">Autoplay next episode</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="autoplayPreviews"
                        checked={playbackSettings.autoplayPreviews}
                        onChange={(e) => setPlaybackSettings({ ...playbackSettings, autoplayPreviews: e.target.checked })}
                        className="w-4 h-4 text-primary-blue bg-neutral-gray border-neutral-lightGray rounded"
                      />
                      <label htmlFor="autoplayPreviews">Autoplay previews while browsing</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitles & Audio</label>
                  <div className="space-y-4">
                    <select 
                      className="input-field"
                      value={playbackSettings.subtitles}
                      onChange={(e) => setPlaybackSettings({ ...playbackSettings, subtitles: e.target.value })}
                    >
                      <option value="off">Subtitles: Off</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                    <select 
                      className="input-field"
                      value={playbackSettings.audio}
                      onChange={(e) => setPlaybackSettings({ ...playbackSettings, audio: e.target.value })}
                    >
                      <option value="en">Audio: English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
                
                <button onClick={handleSavePlayback} className="btn-primary">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Privacy & Security</h2>
            
            {message && (
              <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                {message.text}
              </div>
            )}
            
            <div className="bg-neutral-dark p-6 rounded-xl">
              <div className="space-y-6">
                {[
                  { id: 'dataCollection', label: 'Data Collection', description: 'Allow collection of viewing data for recommendations' },
                  { id: 'analytics', label: 'Analytics', description: 'Help improve the service by sharing usage analytics' },
                  { id: 'marketing', label: 'Marketing Communications', description: 'Receive promotional emails and offers' },
                  { id: 'thirdParty', label: 'Third-party Sharing', description: 'Share data with trusted partners for better experience' },
                ].map((setting) => (
                  <div key={setting.id} className="flex items-start gap-3 p-4 bg-neutral-gray rounded-lg">
                    <input
                      type="checkbox"
                      id={setting.id}
                      checked={privacySettings[setting.id as keyof typeof privacySettings]}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, [setting.id]: e.target.checked })}
                      className="w-4 h-4 text-primary-blue bg-neutral-gray border-neutral-lightGray rounded mt-1"
                    />
                    <div>
                      <label htmlFor={setting.id} className="font-medium cursor-pointer">
                        {setting.label}
                      </label>
                      <p className="text-sm text-gray-400 mt-1">{setting.description}</p>
                    </div>
                  </div>
                ))}
                
                <button onClick={handleSavePrivacy} className="btn-primary">
                  Save Privacy Settings
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-black">
      <Header />
      
      <main className="pt-20 px-6 max-w-6xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-blue text-white'
                        : 'text-gray-400 hover:text-white hover:bg-neutral-gray'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;