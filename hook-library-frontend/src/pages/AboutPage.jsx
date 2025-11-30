import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Copy, Folder, Flame, TrendingUp, Calendar, Clock,
  Settings, Bell, Shield, Download, Camera, Mail, Check,
  Youtube, Instagram, Search, X, ChevronDown, Eye, EyeOff,
  Award, Star, BarChart3, PieChart, Activity, Menu,
  LogOut, Key, Trash2, Edit2, Save, RefreshCw, ExternalLink,
  FileText, Share2, Lock, Crown, AlertCircle, Loader
} from 'lucide-react';

// ============================================
// API SERVICE
// ============================================
class ApiService {
  constructor(baseURL = 'http://localhost:8000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  getUserProfile() {
    return this.request('/profile');
  }

  updateProfileInfo(data) {
    return this.request('/profile/info', { method: 'PUT', body: JSON.stringify(data) });
  }

  updateProfilePicture(imageData) {
    return this.request('/profile/picture', { method: 'POST', body: JSON.stringify({ image_data: imageData }) });
  }

  getQuickStats() {
    return this.request('/profile/stats/quick');
  }

  getActivityOverview(days = 7) {
    return this.request(`/profile/stats/activity?days=${days}`);
  }

  getCollections() {
    return this.request('/profile/collections');
  }

  createCollection(name) {
    return this.request('/profile/collections', { method: 'POST', body: JSON.stringify({ name }) });
  }

  deleteCollection(collectionId) {
    return this.request(`/profile/collections/${collectionId}`, { method: 'DELETE' });
  }

  copyHook(hookId) {
    return this.request(`/hooks/${hookId}/copy`, { method: 'POST' });
  }

  deleteHook(hookId) {
    return this.request(`/hooks/${hookId}`, { method: 'DELETE' });
  }

  getScrapingHistory(limit = 50) {
    return this.request(`/profile/scraping/history?limit=${limit}`);
  }

  getAchievements() {
    return this.request('/profile/achievements');
  }

  getSettings() {
    return this.request('/profile/settings');
  }

  changePassword(currentPassword, newPassword, confirmPassword) {
    return this.request('/profile/settings/password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword })
    });
  }

  enableTwoFactor() {
    return this.request('/profile/settings/2fa/enable', { method: 'POST' });
  }

  deleteAccount(password) {
    return this.request('/profile/settings/account', { method: 'DELETE', body: JSON.stringify({ password }) });
  }

  exportData(format) {
    return this.request('/profile/export', { method: 'POST', body: JSON.stringify({ format, collection_ids: [] }) });
  }

  getWeeklyReport() {
    return this.request('/reports/weekly');
  }

  logout() {
    return this.request('/auth/signout', { method: 'POST' });
  }

  shareProfile() {
    const profileUrl = window.location.origin;
    navigator.clipboard.writeText(profileUrl);
  }
}

// ============================================
// NAVBAR COMPONENT
// ============================================
const Navbar = ({ onLogout, showNotifications, setShowNotifications, notifications }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const api = new ApiService();
      await api.logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-purple-500/20 ${
      scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl shadow-lg shadow-purple-500/10' : 'bg-[#0a0a0f]/50 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="hero-gradient-text text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Hook Bank
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">Home</button>
            <button className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
            <button className="text-white font-semibold">Profile</button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Bell Icon with Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-purple-500/20 rounded-lg transition-colors" 
                aria-label="Notifications"
              >
                <Bell size={20} className="text-purple-400" />
                {notifications && notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0a0a0f] border border-purple-500/30 rounded-lg shadow-lg shadow-purple-500/20 max-h-96 overflow-y-auto z-50">
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Bell size={16} /> Notifications
                    </h3>
                    <div className="space-y-2">
                      {notifications && notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div key={notif.id} className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <p className="text-gray-300 text-sm">{notif.message}</p>
                            <p className="text-gray-500 text-xs mt-1">{notif.time}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No new notifications</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// PROFILE HEADER
// ============================================
const ProfileHeader = ({ profile, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const api = new ApiService();
      await api.updateProfileInfo({ name: editedName });
      onEdit({ ...profile, name: editedName });
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const api = new ApiService();
    api.shareProfile();
    alert('Profile link copied to clipboard!');
  };

  const handleCameraClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const api = new ApiService();
            await api.updateProfilePicture(event.target.result);
            alert('Profile picture updated!');
          } catch (error) {
            console.error('Picture upload failed:', error);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl p-8 mb-8"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative group">
          <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-5xl font-bold text-white">
            {profile?.avatar || profile?.name?.charAt(0) || 'U'}
          </div>
          <button
            onClick={handleCameraClick}
            className="absolute bottom-0 right-0 p-2 bg-purple-500 hover:bg-purple-600 rounded-full text-white"
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="px-4 py-2 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none"
              />
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="p-2 bg-green-500 hover:bg-green-600 rounded-lg text-white disabled:opacity-50"
              >
                <Save size={20} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {profile?.name || 'User'}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <Edit2 size={18} className="text-gray-400" />
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400 text-sm mb-4">
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <span>{profile?.email || 'N/A'}</span>
              <Check size={16} className="text-green-400" />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Member since {profile?.memberSince || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-semibold">
              {profile?.role || 'User'}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
              {profile?.plan || 'Free'} Plan
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="px-4 py-2 border border-purple-500/50 text-white rounded-lg hover:bg-purple-500/10 transition-all flex items-center gap-2"
        >
          <Share2 size={16} />
          <span className="hidden sm:inline">Share</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================
// QUICK STATS
// ============================================
const QuickStats = ({ stats, isLoading }) => {
  const statCards = [
    { icon: Heart, label: 'Hooks Saved', value: stats?.saved || 0, color: 'from-pink-500 to-red-500', emoji: '💾' },
    { icon: Copy, label: 'Hooks Copied', value: stats?.copied || 0, color: 'from-purple-500 to-blue-500', emoji: '📋' },
    { icon: Folder, label: 'Collections', value: stats?.collections || 0, color: 'from-blue-500 to-cyan-500', emoji: '📁' },
    { icon: Flame, label: 'Day Streak', value: stats?.streak || 0, color: 'from-orange-500 to-red-500', emoji: '🔥' }
  ];

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1a0a2e]/40 border border-purple-500/30 rounded-xl p-6 h-40 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <span className="text-3xl">{stat.emoji}</span>
            </div>
            
            <p className="text-4xl font-bold text-white mb-2">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// SIDEBAR TABS
// ============================================
const SidebarTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'saved', label: 'Saved Hooks', icon: Heart },
    { id: 'collections', label: 'Collections', icon: Folder },
    { id: 'history', label: 'Scraping History', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  return (
    <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4">
      <div className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full px-4 py-3 rounded-lg text-left text-sm font-semibold transition-all flex items-center space-x-3 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
            }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// OVERVIEW TAB
// ============================================
const OverviewTab = ({ activity }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp size={24} className="text-pink-400" />
          <span>Weekly Activity</span>
        </h3>
        <div className="h-64 flex items-end justify-around gap-2">
          {activity?.weekly?.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.value / 50) * 100}%` }}
                transition={{ delay: i * 0.1 }}
                className="w-full bg-gradient-to-t from-pink-500 to-purple-500 rounded-t-lg min-h-[20px]"
              />
              <span className="text-xs text-gray-400">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <Youtube size={32} className="text-red-500" />
            <span className="text-2xl font-bold text-white">42%</span>
          </div>
          <p className="text-gray-400 text-sm">YouTube Hooks</p>
        </div>

        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
            <span className="text-2xl font-bold text-white">35%</span>
          </div>
          <p className="text-gray-400 text-sm">Reddit Hooks</p>
        </div>

        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <Instagram size={32} className="text-pink-500" />
            <span className="text-2xl font-bold text-white">23%</span>
          </div>
          <p className="text-gray-400 text-sm">Instagram Hooks</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SAVED HOOKS TAB
// ============================================
const SavedHooksTab = ({ hooks, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');

  const filteredHooks = hooks?.filter(hook => {
    const matchesSearch = hook.text?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || hook.platform?.toLowerCase() === filterPlatform;
    return matchesSearch && matchesPlatform;
  }) || [];

  const handleCopyHook = async (hookId, text) => {
    try {
      const api = new ApiService();
      await api.copyHook(hookId);
      navigator.clipboard.writeText(text);
      alert('Hook copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleDeleteHook = async (hookId) => {
    if (window.confirm('Delete this hook?')) {
      try {
        const api = new ApiService();
        await api.deleteHook(hookId);
        onRefresh();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved hooks..."
              className="w-full px-4 py-3 pl-10 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white"
          >
            <option value="all">All Platforms</option>
            <option value="youtube">YouTube</option>
            <option value="reddit">Reddit</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHooks.map((hook) => (
          <motion.div
            key={hook.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                {hook.platform}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCopyHook(hook.id, hook.text)}
                  className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                >
                  <Copy size={14} className="text-gray-400" />
                </button>
                <button
                  onClick={() => handleDeleteHook(hook.id)}
                  className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                >
                  <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
            
            <p className="text-white text-sm mb-3">"{hook.text}"</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Saved {hook.savedDate}</span>
              <Heart size={12} className="text-pink-400 fill-pink-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {filteredHooks.length === 0 && (
        <div className="text-center py-20">
          <Heart size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No saved hooks found</p>
        </div>
      )}
    </div>
  );
};

// ============================================
// COLLECTIONS TAB
// ============================================
const CollectionsTab = ({ collections, onRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (newCollectionName.trim()) {
      try {
        setIsCreating(true);
        const api = new ApiService();
        await api.createCollection(newCollectionName);
        onRefresh();
        setNewCollectionName('');
        setShowCreateModal(false);
      } catch (error) {
        alert('Failed to create collection');
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (window.confirm('Delete this collection?')) {
      try {
        const api = new ApiService();
        await api.deleteCollection(collectionId);
        onRefresh();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">My Collections</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold flex items-center space-x-2"
        >
          <Folder size={16} />
          <span>New Collection</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections?.map((collection) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                <Folder size={24} className="text-white" />
              </div>
              <button
                onClick={() => handleDeleteCollection(collection.id)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} className="text-gray-400" />
              </button>
            </div>
            
            <h4 className="text-lg font-bold text-white mb-2">{collection.name}</h4>
            <p className="text-sm text-gray-400 mb-4">{collection.count || 0} hooks</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Updated {collection.updated}</span>
              <ExternalLink size={12} />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a0a2e] border-2 border-purple-500/50 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Create New Collection</h3>
              
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name..."
                className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none mb-6"
                autoFocus
              />
              
              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-purple-500/50 text-white rounded-lg hover:bg-purple-500/10"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// SCRAPING HISTORY TAB
// ============================================
const ScrapingHistoryTab = ({ history }) => {
  return (
    <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 text-center">
      <Clock size={64} className="text-gray-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Scraping History</h3>
      <p className="text-gray-400">{history?.length || 0} scraping records</p>
    </div>
  );
};

// ============================================
// ANALYTICS TAB
// ============================================
const AnalyticsTab = () => {
  const [reportType, setReportType] = useState('weekly');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      const api = new ApiService();
      const data = reportType === 'weekly' ? await api.getWeeklyReport() : await api.getWeeklyReport();
      
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <BarChart3 size={24} className="text-pink-400" />
          <span>Analytics Dashboard</span>
        </h3>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setReportType('weekly')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              reportType === 'weekly'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-[#0a0a0f]/50 text-gray-400'
            }`}
          >
            Weekly Report
          </button>
          <button
            onClick={() => setReportType('monthly')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              reportType === 'monthly'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-[#0a0a0f]/50 text-gray-400'
            }`}
          >
            Monthly Report
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadReport}
          disabled={isDownloading}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <Download size={18} />
          <span>{isDownloading ? 'Downloading...' : 'Download Report'}</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Performance</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-[#0a0a0f]/30 rounded-lg">
              <span className="text-gray-400">Total Hooks</span>
              <span className="text-white font-bold">247</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#0a0a0f]/30 rounded-lg">
              <span className="text-gray-400">Avg. Daily</span>
              <span className="text-white font-bold">35</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Platform Distribution</h4>
          <div className="space-y-2">
            <div className="text-sm text-gray-400">YouTube: 42%</div>
            <div className="text-sm text-gray-400">Reddit: 35%</div>
            <div className="text-sm text-gray-400">Instagram: 23%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ACHIEVEMENTS TAB
// ============================================
const AchievementsTab = ({ achievements }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-2 border-purple-500/30 rounded-2xl p-8 text-center">
        <Crown size={64} className="text-yellow-400 mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-white mb-2">Level 5 - Hook Master</h3>
        <p className="text-gray-400 mb-4">1,250 XP until next level</p>
        <div className="w-full bg-[#0a0a0f]/50 rounded-full h-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full" style={{ width: '75%' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements?.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-[#1a0a2e]/40 backdrop-blur-sm border rounded-xl p-6 text-center ${
              achievement.unlocked 
                ? 'border-yellow-500/50' 
                : 'border-purple-500/30 opacity-60'
            }`}
          >
            <div className={`text-6xl mb-4 ${achievement.unlocked ? '' : 'grayscale'}`}>
              {achievement.icon}
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{achievement.name}</h4>
            <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
            {achievement.unlocked ? (
              <span className="text-xs text-green-400 flex items-center justify-center space-x-1">
                <Check size={12} />
                <span>Unlocked {achievement.unlockedDate}</span>
              </span>
            ) : (
              <span className="text-xs text-gray-500">
                {achievement.progress}/{achievement.requirement}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SETTINGS TAB
// ============================================
const SettingsTab = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handlePasswordChange = async () => {
    if (!passwords.new || !passwords.confirm || !passwords.current) {
      alert('Please fill all password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const api = new ApiService();
      await api.changePassword(passwords.current, passwords.new, passwords.confirm);
      alert('Password changed successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      alert('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const api = new ApiService();
      await api.enableTwoFactor();
      alert('2FA setup initiated. Check your email for QR code.');
    } catch (error) {
      alert('Failed to enable 2FA');
    }
  };

  const handleExport = async (format) => {
    try {
      setIsLoading(true);
      const api = new ApiService();
      await api.exportData(format);
      alert(`Data exported as ${format.toUpperCase()}`);
    } catch (error) {
      alert('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt('Enter your password to confirm account deletion:');
    if (!password) return;

    if (!window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      return;
    }

    try {
      const api = new ApiService();
      await api.deleteAccount(password);
      alert('Account deleted successfully');
      window.location.href = '/';
    } catch (error) {
      alert('Failed to delete account');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {['account', 'notifications', 'privacy', 'data'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
              activeSection === section
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-[#1a0a2e]/40 text-gray-400'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {activeSection === 'account' && (
        <div className="space-y-4">
          <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Key size={20} className="text-pink-400" />
              <span>Change Password</span>
            </h4>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500"
              />
              <input
                type="password"
                placeholder="New password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500"
              />
              <button
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>

          <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Shield size={20} className="text-green-400" />
              <span>Two-Factor Authentication</span>
            </h4>
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">Add an extra layer of security</p>
              <button
                onClick={handleEnable2FA}
                className="px-6 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg font-semibold"
              >
                Enable
              </button>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h4 className="text-lg font-bold text-red-400 mb-4 flex items-center space-x-2">
              <AlertCircle size={20} />
              <span>Danger Zone</span>
            </h4>
            <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back.</p>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <Bell size={20} className="text-purple-400" />
            <span>Notification Preferences</span>
          </h4>
          <div className="space-y-4">
            {['Email Notifications', 'Scrape Completion Alerts', 'Weekly Summary'].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0f]/30 rounded-lg">
                <p className="text-white font-semibold">{item}</p>
                <button className="w-12 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'privacy' && (
        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <Lock size={20} className="text-blue-400" />
            <span>Privacy Settings</span>
          </h4>
          <div className="space-y-4">
            {['Public Profile', 'Show Activity'].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0f]/30 rounded-lg">
                <p className="text-white font-semibold">{item}</p>
                <button className="w-12 h-6 bg-gray-600 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'data' && (
        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Download size={20} className="text-cyan-400" />
            <span>Export Data</span>
          </h4>
          <p className="text-gray-400 text-sm mb-4">Download all your saved hooks and collections</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('csv')}
              disabled={isLoading}
              className="px-6 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/50 rounded-lg disabled:opacity-50"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={isLoading}
              className="px-6 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/50 rounded-lg disabled:opacity-50"
            >
              Export as JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// FOOTER
// ============================================
const Footer = () => {
  return (
    <footer className="border-t-2 border-pink-500/30 bg-[#0a0a0f] py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">© Hook Bank 2025</p>
            <p className="text-gray-500 text-xs mt-1">Built with ❤️ by Garima Kalra & Aurin Desai</p>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm">GitHub</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [hooks, setHooks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [history, setHistory] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your profile has been updated', time: '5m ago' },
    { id: 2, message: 'New achievement unlocked: Content Curator', time: '1h ago' }
  ]);

  const showToastNotification = (message, type) => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const api = new ApiService();
      
      try {
        const profileData = await api.getUserProfile();
        setProfile(profileData);
      } catch {
        setProfile({ name: 'User', email: 'user@example.com', memberSince: 'January 2025', role: 'User', plan: 'Free' });
      }

      try {
        const statsData = await api.getQuickStats();
        setStats(statsData);
      } catch {
        setStats({ saved: 247, copied: 1834, collections: 12, streak: 7 });
      }

      try {
        const activityData = await api.getActivityOverview();
        setActivity(activityData);
      } catch {
        setActivity({
          weekly: [
            { label: 'Mon', value: 12 },
            { label: 'Tue', value: 25 },
            { label: 'Wed', value: 18 },
            { label: 'Thu', value: 42 },
            { label: 'Fri', value: 35 },
            { label: 'Sat', value: 28 },
            { label: 'Sun', value: 15 }
          ]
        });
      }

      try {
        const hooksData = await api.request('/hooks/saved');
        setHooks(hooksData);
      } catch {
        setHooks([
          { id: 1, text: 'How I made $10k in 30 days with this simple trick', platform: 'YouTube', savedDate: '2 hours ago' },
          { id: 2, text: 'This Reddit comment changed my entire perspective', platform: 'Reddit', savedDate: '1 day ago' }
        ]);
      }

      try {
        const collectionsData = await api.getCollections();
        setCollections(collectionsData);
      } catch {
        setCollections([
          { id: 1, name: 'Marketing Ideas', count: 45, updated: '2 days ago' },
          { id: 2, name: 'Fitness Content', count: 32, updated: '5 days ago' }
        ]);
      }

      try {
        const achievementsData = await api.getAchievements();
        setAchievements(achievementsData);
      } catch {
        setAchievements([
          { id: 1, name: 'Hook Hunter', description: 'Save your first 10 hooks', icon: '🎯', unlocked: true, unlockedDate: '2 weeks ago', progress: 10, requirement: 10 },
          { id: 2, name: 'Content Curator', description: 'Save 100 hooks', icon: '📚', unlocked: true, unlockedDate: '1 week ago', progress: 100, requirement: 100 }
        ]);
      }

      try {
        const historyData = await api.getScrapingHistory();
        setHistory(historyData);
      } catch {
        setHistory([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #000000; }
        .hero-gradient-text {
          background: linear-gradient(90deg, #ff4b8b, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1a0a2e; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #ff4b8b, #8b5cf6); border-radius: 4px; }
      `}</style>

      <Navbar onLogout={handleLogout} showNotifications={showNotifications} setShowNotifications={setShowNotifications} notifications={notifications} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ProfileHeader profile={profile} onEdit={setProfile} />
          <QuickStats stats={stats} isLoading={isLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'overview' && <OverviewTab activity={activity} />}
                  {activeTab === 'saved' && <SavedHooksTab hooks={hooks} onRefresh={loadData} />}
                  {activeTab === 'collections' && <CollectionsTab collections={collections} onRefresh={loadData} />}
                  {activeTab === 'history' && <ScrapingHistoryTab history={history} />}
                  {activeTab === 'analytics' && <AnalyticsTab />}
                  {activeTab === 'achievements' && <AchievementsTab achievements={achievements} />}
                  {activeTab === 'settings' && <SettingsTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.95)',
          border: `2px solid ${showToast.type === 'success' ? '#00ff00' : showToast.type === 'error' ? '#ff0000' : '#00ffff'}`,
          borderRadius: '10px',
          padding: '15px 25px',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: `0 0 20px ${showToast.type === 'success' ? '#00ff00' : showToast.type === 'error' ? '#ff0000' : '#00ffff'}`,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {showToast.type === 'success' ? <Check size={20} color="#00ff00" /> : <AlertCircle size={20} color="#00ffff" />}
          <span style={{ color: '#fff', fontSize: '14px' }}>{showToast.message}</span>
        </div>
      )}
    </div>
  );
}