import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Menu, X, Youtube, Camera, Mail, Mic, Video, Pen, Copy, Heart, 
  ExternalLink, ChevronDown, Sparkles, TrendingUp, Clock, Filter, Bell,
  Settings, User, RefreshCw, BarChart3, Download, ChevronUp, Trash2,
  Check, AlertCircle, Loader
} from 'lucide-react';

// ============================================
// NAVBAR COMPONENT (Dashboard Version)
// ============================================
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-xl shadow-lg shadow-purple-500/10' : 'bg-[#0a0a0f]/50 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="hero-gradient-text text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Hook Bank
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              Home
            </button>
            <button className="text-white font-semibold underline underline-offset-4 decoration-pink-500">
              Dashboard
            </button>
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              Scraper
            </button>
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              Explore
            </button>
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              About
            </button>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors" aria-label="Search">
              <Search size={20} className="text-gray-400" />
            </button>
            
            {/* Notifications */}
            <button className="relative p-2 hover:bg-purple-500/20 rounded-lg transition-colors" aria-label="Notifications">
              <Bell size={20} className="text-gray-400" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Profile */}
            <button className="flex items-center space-x-2 p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </button>

            {/* Theme Toggle */}
            <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors" aria-label="Theme">
              <div className="w-5 h-5 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-lg rounded-lg mt-2 p-4 space-y-3"
          >
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">Home</button>
            <button className="block w-full text-left text-white font-semibold py-2">Dashboard</button>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">Scraper</button>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">Explore</button>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">About</button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

// ============================================
// SIDEBAR COMPONENT
// ============================================
const Sidebar = ({ collapsed, onToggle, activeFilters, onFilterChange }) => {
  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#0a0a0f]/50 backdrop-blur-xl border-r border-purple-500/20 z-40 overflow-y-auto"
    >
      <div className="p-4">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="w-full mb-6 p-2 hover:bg-purple-500/20 rounded-lg transition-colors flex items-center justify-center"
        >
          <Menu size={20} className="text-gray-400" />
        </button>

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Profile Box */}
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Hey, User 👋</p>
                  <p className="text-xs text-gray-400">Hook Master</p>
                </div>
              </div>
            </div>

            {/* Platform Filters */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Platform</h3>
              <div className="space-y-2">
                {['All', 'YouTube', 'Reddit', 'Instagram'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => onFilterChange('platform', platform)}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all ${
                      activeFilters.platform === platform
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border border-pink-500/50'
                        : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Niche Filters */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Niche</h3>
              <div className="space-y-2">
                {['Marketing', 'Fitness', 'Tech', 'Business', 'Motivation'].map((niche) => (
                  <button
                    key={niche}
                    onClick={() => onFilterChange('niche', niche)}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all ${
                      activeFilters.niche === niche
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border border-pink-500/50'
                        : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Filters */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Tone</h3>
              <div className="space-y-2">
                {['Emotional', 'Funny', 'Fear', 'Curiosity', 'Data'].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => onFilterChange('tone', tone)}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all ${
                      activeFilters.tone === tone
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border border-pink-500/50'
                        : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Hooks */}
            <button className="w-full px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg text-left text-sm text-purple-300 transition-all flex items-center space-x-2">
              <Heart size={16} />
              <span>Saved Hooks</span>
            </button>

            {/* Settings */}
            <button className="w-full px-3 py-2 hover:bg-purple-500/10 rounded-lg text-left text-sm text-gray-400 hover:text-white transition-all flex items-center space-x-2">
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </motion.div>
        )}

        {collapsed && (
          <div className="space-y-4 flex flex-col items-center">
            <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors" aria-label="Profile">
              <User size={20} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors" aria-label="Saved">
              <Heart size={20} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors" aria-label="Settings">
              <Settings size={20} className="text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// HEADER SECTION COMPONENT
// ============================================
const DashboardHeader = ({ onScrapeAll, onRefresh, onAnalyze }) => {
  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <span className="hero-gradient-text">Dashboard – Hook Control Center</span>
          </h1>
          <p className="text-gray-400">
            Manage, analyze, and generate high-performing hooks from every platform
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onScrapeAll}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-purple-500/50"
          >
            <Sparkles size={16} />
            <span>Scrape All</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className="px-4 py-2 border border-purple-500/50 text-white rounded-lg font-semibold text-sm flex items-center space-x-2 hover:bg-purple-500/10 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAnalyze}
            className="px-4 py-2 border border-purple-500/50 text-white rounded-lg font-semibold text-sm flex items-center space-x-2 hover:bg-purple-500/10 transition-colors"
          >
            <BarChart3 size={16} />
            <span className="hidden sm:inline">Analyze</span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

// ============================================
// STATS OVERVIEW COMPONENT
// ============================================
const StatsOverview = ({ stats }) => {
  const statCards = [
    { icon: Sparkles, label: 'Total Hooks', value: stats.total, color: 'from-pink-500 to-purple-500', emoji: '📈' },
    { icon: Youtube, label: 'YouTube Hooks', value: stats.youtube, color: 'from-red-500 to-red-700', emoji: '▶️' },
    { icon: Camera, label: 'Reddit Hooks', value: stats.reddit, color: 'from-orange-500 to-red-500', emoji: '🧵' },
    { icon: Camera, label: 'Instagram Hooks', value: stats.instagram, color: 'from-purple-500 to-pink-500', emoji: '📸' },
    { icon: Heart, label: 'Saved Hooks', value: stats.saved, color: 'from-pink-500 to-red-500', emoji: '❤️' }
  ];

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              rotateX: 5
            }}
            className="bg-[#1a0a2e]/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 relative overflow-hidden group cursor-pointer neon-glow-subtle"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <span className="text-2xl">{stat.emoji}</span>
              </div>
              
              <p className="text-3xl font-bold text-white mb-1">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// PLATFORM TABS COMPONENT
// ============================================
const PlatformTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All', icon: Sparkles, emoji: '⭐' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, emoji: '🎥' },
    { id: 'reddit', label: 'Reddit', icon: Camera, emoji: '🧵' },
    { id: 'instagram', label: 'Instagram', icon: Camera, emoji: '📸' }
  ];

  return (
    <section className="mb-6">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/50'
                : 'bg-[#1a0a2e]/30 border border-purple-500/30 text-gray-400 hover:text-white hover:border-purple-500/50'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Animated indicator line */}
      <motion.div
        layoutId="activeTab"
        className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-2"
        style={{ width: '100px' }}
      />
    </section>
  );
};

// ============================================
// HOOK CARD COMPONENT
// ============================================
const HookCard = ({ hook, onCopy, onSave, onViewDetails }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(hook.saved || false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hook.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(hook);
  };

  const platformColors = {
    YouTube: 'from-red-500 to-red-700',
    Reddit: 'from-orange-500 to-red-500',
    Instagram: 'from-purple-500 to-pink-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-[#1a0a2e]/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 bg-gradient-to-r ${platformColors[hook.platform]} text-white rounded-full text-xs font-semibold flex items-center space-x-1`}>
            <span>{hook.platformIcon}</span>
            <span>{hook.platform}</span>
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
            aria-label="Copy hook"
          >
            {copied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} className="text-gray-400 group-hover:text-white" />
            )}
          </button>
          
          <button
            onClick={handleSave}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
            aria-label="Save hook"
          >
            <Heart 
              size={16} 
              className={saved ? 'text-pink-500 fill-pink-500' : 'text-gray-400 group-hover:text-white'}
            />
          </button>
          
          <button
            onClick={() => onViewDetails?.(hook)}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
            aria-label="View details"
          >
            <ExternalLink size={16} className="text-gray-400 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Hook Text */}
      <p className="text-white text-base mb-4 line-clamp-3 group-hover:text-pink-300 transition-colors">
        "{hook.text}"
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-pink-500/10 text-pink-300 rounded text-xs">{hook.tone}</span>
        <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs">{hook.niche}</span>
      </div>

      {/* Engagement Metrics */}
      {hook.engagement && (
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <span>👍 {hook.engagement.likes}</span>
          <span>💬 {hook.engagement.comments}</span>
          <span>🕐 {hook.date}</span>
        </div>
      )}
    </motion.div>
  );
};

// ============================================
// HOOKS GRID COMPONENT
// ============================================
const HooksGrid = ({ hooks, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#1a0a2e]/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-5 animate-pulse">
            <div className="h-6 bg-purple-500/20 rounded mb-4" />
            <div className="h-20 bg-purple-500/20 rounded mb-4" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-purple-500/20 rounded" />
              <div className="h-6 w-16 bg-purple-500/20 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (hooks.length === 0) {
    return (
      <div className="text-center py-20">
        <Sparkles size={48} className="text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No hooks found. Try scraping some platforms!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hooks.map((hook, i) => (
        <HookCard
          key={hook.id}
          hook={hook}
          onCopy={() => console.log('Copied:', hook.id)}
          onSave={(h) => console.log('Saved:', h.id)}
          onViewDetails={(h) => console.log('View details:', h.id)}
        />
      ))}
    </div>
  );
};

// ============================================
// FLOATING SCRAPER CONSOLE COMPONENT
// ============================================
const FloatingScraperConsole = ({ logs, onScrape, onClearLogs }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState({ youtube: false, reddit: false, instagram: false });

  const handleScrape = async (platform) => {
    setLoading({ ...loading, [platform]: true });
    await onScrape(platform);
    setTimeout(() => {
      setLoading({ ...loading, [platform]: false });
    }, 2000);
  };

  return (
    <motion.div
      initial={{ x: 400, y: 0 }}
      animate={{ x: 0, y: 0 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className={`bg-[#0a0a0f]/95 backdrop-blur-xl border-2 border-pink-500/50 rounded-2xl shadow-2xl neon-glow overflow-hidden transition-all ${
        expanded ? 'w-96' : 'w-14'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-3 flex items-center justify-between cursor-move">
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-pink-400" />
            {expanded && <span className="text-white text-sm font-semibold">Scraper Console</span>}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-purple-500/20 rounded transition-colors"
          >
            {expanded ? <ChevronDown size={16} className="text-white" /> : <ChevronUp size={16} className="text-white" />}
          </button>
        </div>

        {/* Content */}
        {expanded && (
          <div className="p-4 space-y-4">
            {/* Scrape Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleScrape('reddit')}
                disabled={loading.reddit}
                className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading.reddit ? <Loader size={16} className="animate-spin" /> : <span>🧵</span>}
                <span>Scrape Reddit</span>
              </button>

              <button
                onClick={() => handleScrape('youtube')}
                disabled={loading.youtube}
                className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading.youtube ? <Loader size={16} className="animate-spin" /> : <span>🎥</span>}
                <span>Scrape YouTube</span>
              </button>

              <button
                onClick={() => handleScrape('instagram')}
                disabled={loading.instagram}
                className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading.instagram ? <Loader size={16} className="animate-spin" /> : <span>📸</span>}
                <span>Scrape Instagram</span>
              </button>
            </div>

            {/* Console Log */}
            <div className="bg-black/50 rounded-lg p-3 h-40 overflow-y-auto font-mono text-xs">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-1 ${
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'error' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}
                >
                  {log.type === 'success' && '✅ '}
                  {log.type === 'error' && '⚠️ '}
                  {log.message}
                </motion.div>
              ))}
            </div>

            {/* Clear Button */}
            <button
              onClick={onClearLogs}
              className="w-full px-4 py-2 border border-purple-500/50 text-white rounded-lg text-sm hover:bg-purple-500/10 transition-all flex items-center justify-center space-x-2"
            >
              <Trash2 size={14} />
              <span>Clear Log</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// TOAST NOTIFICATION COMPONENT
// ============================================
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <Check size={20} className="text-green-400" />,
    error: <AlertCircle size={20} className="text-red-400" />,
    info: <Sparkles size={20} className="text-blue-400" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -50, x: '-50%' }}
      className="fixed top-20 left-1/2 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border border-purple-500/50 rounded-xl px-6 py-4 shadow-2xl neon-glow"
    >
      <div className="flex items-center space-x-3">
        {icons[type]}
        <p className="text-white font-semibold">{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// PAGINATION COMPONENT
// ============================================
const Pagination = ({ currentPage, totalPages, onPageChange, totalHooks, loadedHooks }) => {
  return (
    <section className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-gray-400 text-sm">
        Showing {loadedHooks} of {totalHooks} hooks
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#1a0a2e]/50 border border-purple-500/30 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500/10 transition-all"
        >
          Previous
        </motion.button>

        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
          const pageNum = i + 1;
          return (
            <motion.button
              key={pageNum}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                currentPage === pageNum
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-[#1a0a2e]/50 border border-purple-500/30 text-gray-400 hover:text-white'
              }`}
            >
              {pageNum}
            </motion.button>
          );
        })}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#1a0a2e]/50 border border-purple-500/30 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500/10 transition-all"
        >
          Next
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-purple-500/50 flex items-center space-x-2"
      >
        <ChevronUp size={16} />
        <span>Back to Top</span>
      </motion.button>
    </section>
  );
};

// ============================================
// FOOTER COMPONENT
// ============================================
const Footer = () => {
  return (
    <footer className="border-t border-pink-500/30 bg-[#0a0a0f] py-8 px-4 mt-16 shadow-[0_-10px_50px_rgba(255,75,139,0.1)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">Built with ❤️ by Garima Kalra</p>
            <p className="text-gray-500 text-xs mt-1">Version 1.0.0</p>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">GitHub</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">LinkedIn</a>
          </div>

          <div className="text-gray-500 text-xs">
            © 2024 Hook Bank. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN DASHBOARD APP COMPONENT
// ============================================
export default function DashboardApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    platform: 'All',
    niche: null,
    tone: null
  });

  const [stats] = useState({
    total: 1245,
    youtube: 420,
    reddit: 360,
    instagram: 465,
    saved: 128
  });

  const [scraperLogs, setScraperLogs] = useState([
    { type: 'success', message: 'System initialized successfully' }
  ]);

  const [hooks, setHooks] = useState([
    {
      id: 1,
      text: "How I made $10k in 30 days with this simple trick nobody talks about",
      platform: "YouTube",
      platformIcon: "▶️",
      tone: "motivational",
      niche: "business",
      date: "2 hours ago",
      saved: false,
      engagement: { likes: 1234, comments: 89 }
    },
    {
      id: 2,
      text: "This Reddit comment changed my entire perspective on productivity forever",
      platform: "Reddit",
      platformIcon: "🧵",
      tone: "educational",
      niche: "productivity",
      date: "5 hours ago",
      saved: true,
      engagement: { likes: 567, comments: 34 }
    },
    {
      id: 3,
      text: "The brutal truth about fitness that trainers won't tell you",
      platform: "Instagram",
      platformIcon: "📸",
      tone: "shock",
      niche: "fitness",
      date: "1 day ago",
      saved: false,
      engagement: { likes: 2341, comments: 156 }
    },
    {
      id: 4,
      text: "I analyzed 1000 viral videos and found these 3 patterns that guarantee success",
      platform: "YouTube",
      platformIcon: "▶️",
      tone: "educational",
      niche: "content",
      date: "3 days ago",
      saved: false,
      engagement: { likes: 4567, comments: 234 }
    },
    {
      id: 5,
      text: "Why everyone is quitting their 9-5 for this side hustle in 2024",
      platform: "Reddit",
      platformIcon: "🧵",
      tone: "curiosity",
      niche: "business",
      date: "4 days ago",
      saved: true,
      engagement: { likes: 891, comments: 67 }
    },
    {
      id: 6,
      text: "The one mindset shift that millionaires use daily to stay focused",
      platform: "Instagram",
      platformIcon: "📸",
      tone: "motivational",
      niche: "mindset",
      date: "1 week ago",
      saved: false,
      engagement: { likes: 3456, comments: 178 }
    },
    {
      id: 7,
      text: "Stop wasting money on ads - here's what actually works in 2024",
      platform: "YouTube",
      platformIcon: "▶️",
      tone: "fear",
      niche: "marketing",
      date: "1 week ago",
      saved: false,
      engagement: { likes: 5678, comments: 312 }
    },
    {
      id: 8,
      text: "I spent $50k learning this - now I'm giving it away for free",
      platform: "Reddit",
      platformIcon: "🧵",
      tone: "emotional",
      niche: "business",
      date: "2 weeks ago",
      saved: false,
      engagement: { likes: 1234, comments: 89 }
    },
    {
      id: 9,
      text: "The algorithm doesn't want you to see this content creation hack",
      platform: "Instagram",
      platformIcon: "📸",
      tone: "curiosity",
      niche: "content",
      date: "2 weeks ago",
      saved: true,
      engagement: { likes: 2890, comments: 145 }
    }
  ]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }));
    showToast(`Filter applied: ${value}`, 'success');
  };

  const handleScrapeAll = () => {
    setLoading(true);
    addScraperLog('success', 'Starting scrape on all platforms...');
    setTimeout(() => {
      setLoading(false);
      addScraperLog('success', 'Scraped 150 new hooks from all platforms');
      showToast('Scrape completed successfully!', 'success');
    }, 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    showToast('Refreshing data...', 'info');
    setTimeout(() => {
      setLoading(false);
      showToast('Data refreshed!', 'success');
    }, 1500);
  };

  const handleAnalyze = () => {
    showToast('Analytics coming soon!', 'info');
  };

  const handleScrape = async (platform) => {
    addScraperLog('success', `Starting ${platform} scrape...`);
    setTimeout(() => {
      addScraperLog('success', `Scraped 50 posts from ${platform}`);
    }, 1500);
  };

  const addScraperLog = (type, message) => {
    setScraperLogs(prev => [...prev, { type, message }]);
  };

  const clearScraperLogs = () => {
    setScraperLogs([]);
    showToast('Logs cleared', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const filteredHooks = hooks.filter(hook => {
    if (activeTab !== 'all' && hook.platform.toLowerCase() !== activeTab) return false;
    if (activeFilters.platform !== 'All' && activeFilters.platform && hook.platform !== activeFilters.platform) return false;
    if (activeFilters.niche && hook.niche !== activeFilters.niche.toLowerCase()) return false;
    if (activeFilters.tone && hook.tone !== activeFilters.tone.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: #0a0a0f;
        }
        
        .hero-gradient-text {
          background: linear-gradient(90deg, #ff4b8b, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .neon-glow {
          filter: drop-shadow(0 0 8px #ff4b8b) drop-shadow(0 0 16px #8b5cf6);
        }
        
        .neon-glow-subtle {
          box-shadow: 0 0 20px rgba(255, 75, 139, 0.1), 0 0 40px rgba(139, 92, 246, 0.1);
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1a0a2e;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ff4b8b, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ff4b8b, #ff4b8b);
        }
      `}</style>

      <Navbar />
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />

      {/* Main Content */}
      <main 
        className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '80px' : '280px' }}
      >
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            onScrapeAll={handleScrapeAll}
            onRefresh={handleRefresh}
            onAnalyze={handleAnalyze}
          />

          <StatsOverview stats={stats} />

          <PlatformTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <HooksGrid hooks={filteredHooks} loading={loading} />

          <Pagination 
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
            totalHooks={stats.total}
            loadedHooks={filteredHooks.length}
          />
        </div>
      </main>

      <FloatingScraperConsole 
        logs={scraperLogs}
        onScrape={handleScrape}
        onClearLogs={clearScraperLogs}
      />

      <Footer />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}