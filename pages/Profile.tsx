import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { User, Settings, Lock } from 'lucide-react';
import { AVAILABLE_LEVERAGE } from '../constants';

export const Profile = () => {
  const { user, updateProfile, isAuthenticated } = useStore();
  const [activeTab, setActiveTab] = useState('general');

  // Local state for forms
  const [username, setUsername] = useState(user?.username || '');

  const handleSaveProfile = () => {
    updateProfile({ username });
    alert("Profile updated successfully!");
  };

  const handleSaveSettings = (key: string, value: any) => {
    if (!user) return;
    updateProfile({
      settings: { ...user.settings, [key]: value }
    });
  };

  if (!isAuthenticated) {
    return <div className="p-12 text-center text-gray-500">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
           <button 
             onClick={() => setActiveTab('general')}
             className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'general' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-800 text-gray-400'}`}
           >
             <User size={18} /> General
           </button>
           <button 
             onClick={() => setActiveTab('preferences')}
             className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'preferences' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-800 text-gray-400'}`}
           >
             <Settings size={18} /> Preferences
           </button>
           <button 
             onClick={() => setActiveTab('security')}
             className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-800 text-gray-400'}`}
           >
             <Lock size={18} /> Security
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card border border-card-border rounded-xl p-8">
          
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-lg">
               <div>
                 <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                 <p className="text-sm text-gray-400 mb-6">Update your public profile details.</p>
               </div>
               
               <Input label="Email Address" value={user?.email} disabled className="opacity-50" />
               <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
               
               <div className="pt-4">
                 <Button onClick={handleSaveProfile}>Save Changes</Button>
               </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 max-w-lg">
               <div>
                 <h2 className="text-xl font-bold mb-4">Trading Preferences</h2>
                 <p className="text-sm text-gray-400 mb-6">Customize your default trading interface experience.</p>
               </div>

               <Select 
                 label="Default Leverage" 
                 value={user?.settings.defaultLeverage} 
                 onChange={(e) => handleSaveSettings('defaultLeverage', Number(e.target.value))}
               >
                 {AVAILABLE_LEVERAGE.map(lev => <option key={lev} value={lev}>{lev}x</option>)}
               </Select>

               <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                 <div>
                   <span className="block font-medium text-white">Dark Mode</span>
                   <span className="text-xs text-gray-400">Use dark theme by default</span>
                 </div>
                 <div className="text-primary font-bold">Active</div>
               </div>
            </div>
          )}

           {activeTab === 'security' && (
            <div className="space-y-6 max-w-lg">
               <div>
                 <h2 className="text-xl font-bold mb-4">Security</h2>
                 <p className="text-sm text-gray-400 mb-6">Manage your password and security settings.</p>
               </div>
               
               <Input label="Current Password" type="password" placeholder="••••••••" />
               <Input label="New Password" type="password" placeholder="••••••••" />
               <Input label="Confirm New Password" type="password" placeholder="••••••••" />
               
               <div className="pt-4">
                 <Button variant="outline">Update Password</Button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};