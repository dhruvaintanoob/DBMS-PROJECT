import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { User, Lock, Bell, Monitor, CreditCard, Shield } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, currentProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'playback', label: 'Playback', icon: Monitor },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile Settings</h2>
            <div className="bg-neutral-dark p-6 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-neutral-gray rounded-xl flex items-center justify-center">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{currentProfile?.profileName}</h3>
                  <p className="text-gray-400">{currentProfile?.isKidProfile ? 'Kids Profile' : 'Adult Profile'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Name</label>
                  <input
                    type="text"
                    defaultValue={currentProfile?.profileName}
                    className="input-field"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="kidProfile"
                    defaultChecked={currentProfile?.isKidProfile}
                    className="w-4 h-4 text-primary-blue bg-neutral-gray border-neutral-lightGray rounded"
                  />
                  <label htmlFor="kidProfile" className="text-sm">
                    This is a kids profile
                  </label>
                </div>
                
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            <div className="bg-neutral-dark p-6 rounded-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    defaultValue={user?.username}
                    className="input-field"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subscription Plan</label>
                  <select className="input-field" defaultValue={user?.subscriptionPlan}>
                    <option value="Basic">Basic Plan</option>
                    <option value="Standard">Standard Plan</option>
                    <option value="Premium">Premium Plan</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-neutral-gray">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button className="btn-primary">Save Changes</button>
                  <button 
                    onClick={handleLogout}
                    className="btn-secondary bg-red-600 hover:bg-red-700"
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
                      defaultChecked={true}
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
                
                <button className="btn-primary">Save Preferences</button>
              </div>
            </div>
          </div>
        );

      case 'playback':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Playback Settings</h2>
            <div className="bg-neutral-dark p-6 rounded-xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Video Quality</label>
                  <select className="input-field">
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
                        defaultChecked={true}
                        className="w-4 h-4 text-primary-blue bg-neutral-gray border-neutral-lightGray rounded"
                      />
                      <label htmlFor="autoplayNext">Autoplay next episode</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="autoplayPreviews"
                        defaultChecked={false}
                        className="w-4 h-4 text-primary-blue bg-neutral-gray border-neutral-lightGray rounded"
                      />
                      <label htmlFor="autoplayPreviews">Autoplay previews while browsing</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitles & Audio</label>
                  <div className="space-y-4">
                    <select className="input-field">
                      <option value="off">Subtitles: Off</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                    <select className="input-field">
                      <option value="en">Audio: English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
                
                <button className="btn-primary">Save Settings</button>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Billing & Subscription</h2>
            <div className="bg-neutral-dark p-6 rounded-xl">
              <div className="space-y-6">
                <div className="border border-primary-blue rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Current Plan: {user?.subscriptionPlan}</h3>
                  <p className="text-gray-400 mb-4">
                    {user?.subscriptionPlan === 'Basic' && 'Watch on 1 device, Standard Definition'}
                    {user?.subscriptionPlan === 'Standard' && 'Watch on 2 devices, High Definition'}
                    {user?.subscriptionPlan === 'Premium' && 'Watch on 4 devices, Ultra High Definition'}
                  </p>
                  <div className="text-2xl font-bold">
                    ${user?.subscriptionPlan === 'Basic' ? '8.99' : user?.subscriptionPlan === 'Standard' ? '13.99' : '18.99'}/month
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Basic', 'Standard', 'Premium'].map((plan) => (
                      <div key={plan} className={`border rounded-lg p-4 ${user?.subscriptionPlan === plan ? 'border-primary-blue' : 'border-neutral-gray'}`}>
                        <h4 className="font-semibold">{plan}</h4>
                        <div className="text-xl font-bold my-2">
                          ${plan === 'Basic' ? '8.99' : plan === 'Standard' ? '13.99' : '18.99'}/month
                        </div>
                        <ul className="text-sm text-gray-400 space-y-1">
                          <li>• {plan === 'Basic' ? '1' : plan === 'Standard' ? '2' : '4'} device(s)</li>
                          <li>• {plan === 'Basic' ? 'SD' : plan === 'Standard' ? 'HD' : 'UHD'} quality</li>
                          <li>• Unlimited content</li>
                        </ul>
                        {user?.subscriptionPlan !== plan && (
                          <button className="btn-primary w-full mt-4">
                            {plan === 'Basic' ? 'Downgrade' : 'Upgrade'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-gray">
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="bg-neutral-gray p-4 rounded-lg">
                    <p className="text-gray-400">**** **** **** 1234</p>
                    <p className="text-sm text-gray-500">Expires 12/25</p>
                  </div>
                  <button className="btn-secondary mt-2">Update Payment Method</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Privacy & Security</h2>
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
                      defaultChecked={setting.id !== 'thirdParty'}
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
                
                <div className="pt-4 border-t border-neutral-gray">
                  <h3 className="text-lg font-semibold mb-4">Data Management</h3>
                  <div className="space-y-2">
                    <button className="btn-secondary w-full">Download My Data</button>
                    <button className="btn-secondary w-full bg-red-600 hover:bg-red-700">Delete Account</button>
                  </div>
                </div>
                
                <button className="btn-primary">Save Privacy Settings</button>
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