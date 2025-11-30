import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Youtube, Camera, Mail, Mic, Video, Pen, Copy, Heart, ExternalLink, ChevronDown, Sparkles, TrendingUp, Clock, Filter, AlertCircle, CheckCircle, Loader, Bell, Check } from 'lucide-react';

// ============================================
// API CONFIGURATION
// ============================================
const API_BASE_URL = 'http://localhost:8000/api';

const api = {
  // Reddit endpoints
  reddit: {
    scrape: (subreddit, limit = 50) => 
      fetch(`${API_BASE_URL}/reddit/scrape?subreddit=${subreddit}&limit=${limit}`, { method: 'POST' }),
    scrapeAll: () => 
      fetch(`${API_BASE_URL}/reddit/scrape-all`, { method: 'POST' }),
    getHooks: () => 
      fetch(`${API_BASE_URL}/reddit/hooks`),
    searchHooks: (niche) => 
      fetch(`${API_BASE_URL}/reddit/hooks/search?niche=${niche}`)
  },
  
  // YouTube endpoints
  youtube: {
    scrape: (channelId, limit = 10) => 
      fetch(`${API_BASE_URL}/youtube/scrape?channel_id=${channelId}&limit=${limit}`, { method: 'POST' }),
    scrapeAll: () => 
      fetch(`${API_BASE_URL}/youtube/scrape-all`, { method: 'POST' })
  },
  
  // Instagram endpoints
  instagram: {
    scrape: (username, limit = 5) => 
      fetch(`${API_BASE_URL}/instagram/scrape?username=${username}&limit=${limit}`, { method: 'POST' }),
    scrapeAll: () => 
      fetch(`${API_BASE_URL}/instagram/scrape-all`, { method: 'POST' })
  },
  
  // Settings & Reports endpoints
  settings: {
    get: (token) => 
      fetch(`${API_BASE_URL}/settings`, { headers: { 'Authorization': `Bearer ${token}` }}),
    update: (token, data) => 
      fetch(`${API_BASE_URL}/settings`, { 
        method: 'PUT', 
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
  },
  
  // Reports endpoints
  reports: {
    weekly: (token) => 
      fetch(`${API_BASE_URL}/reports/weekly`, { headers: { 'Authorization': `Bearer ${token}` }}),
    monthly: (token) => 
      fetch(`${API_BASE_URL}/reports/monthly`, { headers: { 'Authorization': `Bearer ${token}` }}),
    export: (token, reportType, format = 'csv') => 
      fetch(`${API_BASE_URL}/reports/download/${reportType}?format=${format}`, { headers: { 'Authorization': `Bearer ${token}` }})
  },
  
  // AI Generation endpoints
  ai: {
    generate: (token, data) => 
      fetch(`${API_BASE_URL}/ai/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }),
    getCredits: (token) => 
      fetch(`${API_BASE_URL}/ai/credits`, { headers: { 'Authorization': `Bearer ${token}` }}),
    shufflePrompts: () => 
      fetch(`${API_BASE_URL}/ai/shuffle-prompts`, { method: 'POST' })
  },
  
  // Profile endpoints
  profile: {
    get: (token) => 
      fetch(`${API_BASE_URL}/profile/`, { headers: { 'Authorization': `Bearer ${token}` }}),
    getSummary: (token) => 
      fetch(`${API_BASE_URL}/profile/summary`, { headers: { 'Authorization': `Bearer ${token}` }}),
    getStats: (token) => 
      fetch(`${API_BASE_URL}/profile/stats/quick`, { headers: { 'Authorization': `Bearer ${token}` }})
  },
  
  // Collections endpoints
  collections: {
    getAll: (token) => 
      fetch(`${API_BASE_URL}/profile/collections`, { headers: { 'Authorization': `Bearer ${token}` }}),
    create: (token, data) => 
      fetch(`${API_BASE_URL}/profile/collections`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
  }
};

// ============================================
// NOTIFICATION COMPONENT
// ============================================
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    loading: Loader
  };

  const Icon = icons[type] || AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className={`fixed top-4 left-1/2 z-[100] px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm border flex items-center space-x-3 ${
        type === 'success' ? 'bg-green-500/20 border-green-500/50' :
        type === 'error' ? 'bg-red-500/20 border-red-500/50' :
        'bg-blue-500/20 border-blue-500/50'
      }`}
    >
      <Icon size={20} className={`${
        type === 'success' ? 'text-green-400' :
        type === 'error' ? 'text-red-400' :
        'text-blue-400 animate-spin'
      }`} />
      <span className="text-white text-sm">{message}</span>
      <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
        <X size={16} />
      </button>
    </motion.div>
  );
};

// ============================================
// NAVBAR COMPONENT
// ============================================
const Navbar = ({ onNavigate, showNotifications, setShowNotifications, appNotifications }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-lg shadow-lg shadow-purple-500/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="hero-gradient-text text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Hook Bank
            </div>
            <span className="text-xs text-gray-400 hidden sm:block">Viral Hook Library</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="text-gray-300 hover:text-white transition-colors">Home</button>
            <button onClick={() => onNavigate('dashboard')} className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => onNavigate('explore')} className="text-gray-300 hover:text-white transition-colors">Explore</button>
            <button onClick={() => onNavigate('scraper')} className="text-gray-300 hover:text-white transition-colors">Scraper</button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Bell Icon */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-purple-500/20 rounded-lg transition-colors" 
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-300" />
                {appNotifications && appNotifications.length > 0 && (
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
                      {appNotifications && appNotifications.length > 0 ? (
                        appNotifications.map(notif => (
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
              className="px-6 py-2 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold shadow-lg"
              onClick={() => onNavigate('explore')}
            >
              Explore Hooks
            </motion.button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-lg rounded-lg mt-2 p-4 space-y-3"
          >
            <button onClick={() => { onNavigate('home'); setMobileOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">Home</button>
            <button onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">Dashboard</button>
            <button onClick={() => { onNavigate('explore'); setMobileOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">Explore</button>
            <button onClick={() => { onNavigate('scraper'); setMobileOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">Scraper</button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

// ============================================
// HERO COMPONENT
// ============================================
const Hero = ({ onExplore, onScrape }) => {
  const icons = [
    { Icon: Video, delay: 0, x: -100, y: -50 },
    { Icon: Mic, delay: 0.2, x: 100, y: -30 },
    { Icon: Camera, delay: 0.4, x: -80, y: 80 },
    { Icon: Mail, delay: 0.6, x: 120, y: 70 },
    { Icon: Pen, delay: 0.8, x: 0, y: -100 }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {icons.map(({ Icon, delay, x, y }, i) => (
        <motion.div
          key={i}
          className="absolute neon-glow"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.4,
            scale: 1,
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            opacity: { delay, duration: 0.5 },
            scale: { delay, duration: 0.5 },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
        >
          <Icon size={48} className="text-purple-400" />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-gradient-text text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          Hook Bank
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl sm:text-2xl text-gray-300 mb-4"
        >
          Find hooks that go viral
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
        >
          Discover, analyze, and remix viral hooks from YouTube, Reddit, and Instagram. Auto-labeled, semantically searchable, ready to boost your content.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold text-lg shadow-lg shadow-purple-500/50"
            onClick={onExplore}
          >
            Explore Dashboard
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-purple-500 text-white rounded-lg font-semibold text-lg hover:bg-purple-500/10 transition-colors"
            onClick={onScrape}
          >
            Scrape Now
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm text-gray-500"
        >
          No login required • Free • 1000+ hooks
        </motion.p>
      </div>
    </section>
  );
};

// ============================================
// STATS BAR COMPONENT
// ============================================
const StatsBar = ({ stats }) => {
  const statCards = [
    { icon: Sparkles, label: 'Hooks in DB', value: stats.totalHooks.toLocaleString(), color: 'from-pink-500 to-purple-500' },
    { icon: TrendingUp, label: 'Platforms', value: stats.platforms, color: 'from-purple-500 to-blue-500' },
    { icon: Clock, label: 'Last Updated', value: stats.lastUpdate, color: 'from-blue-500 to-pink-500' }
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-[#1a0a2e]/50 to-[#0a0a0f]/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 flex items-center space-x-4"
            >
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// PLATFORM CARD COMPONENT
// ============================================
const PlatformCard = ({ platform, icon: Icon, description, color, onScrape }) => {
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    await onScrape(platform);
    setLoading(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative z-10">
        <div className="mb-4">
          <Icon size={48} className="text-purple-400 group-hover:text-pink-400 transition-colors" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {platform}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold text-sm disabled:opacity-50"
          onClick={handleScrape}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader size={16} className="animate-spin mr-2" />
              Scraping...
            </span>
          ) : 'Scrape Now'}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================
// SEARCH BAR COMPONENT
// ============================================
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    platform: 'all',
    tone: 'all',
    sort: 'newest'
  });

  const handleSubmit = () => {
    onSearch(query, filters);
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder='Search hooks — e.g., "How I made $10k"'
              className="w-full px-6 py-4 pr-12 bg-[#1a0a2e]/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={handleSubmit}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] rounded-lg"
              aria-label="Search"
            >
              <Search size={20} className="text-white" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <Filter size={16} />
          <span className="text-sm">Filters</span>
          <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
          >
            <select 
              value={filters.platform}
              onChange={(e) => setFilters({...filters, platform: e.target.value})}
              className="px-4 py-2 bg-[#1a0a2e]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="reddit">Reddit</option>
              <option value="instagram">Instagram</option>
            </select>
            
            <select 
              value={filters.tone}
              onChange={(e) => setFilters({...filters, tone: e.target.value})}
              className="px-4 py-2 bg-[#1a0a2e]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Tones</option>
              <option value="motivational">Motivational</option>
              <option value="shock">Shock</option>
              <option value="educational">Educational</option>
            </select>
            
            <select 
              value={filters.sort}
              onChange={(e) => setFilters({...filters, sort: e.target.value})}
              className="px-4 py-2 bg-[#1a0a2e]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="newest">Sort: Newest</option>
              <option value="popular">Most Popular</option>
              <option value="cluster">By Cluster</option>
            </select>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// ============================================
// HOOK CARD COMPONENT
// ============================================
const HookCard = ({ hook, onCopy, onFavorite, onOpen }) => {
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hook.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.(hook);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setFavorited(!favorited);
    onFavorite?.(hook);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 cursor-pointer group"
      onClick={() => onOpen?.(hook)}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
          {hook.platform}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
            aria-label="Copy hook"
          >
            <Copy size={16} className={copied ? 'text-green-400' : 'text-gray-400'} />
          </button>
          <button
            onClick={handleFavorite}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
            aria-label="Favorite hook"
          >
            <Heart size={16} className={favorited ? 'text-pink-400 fill-pink-400' : 'text-gray-400'} />
          </button>
        </div>
      </div>

      <p className="text-white text-lg mb-4 line-clamp-3 group-hover:text-pink-300 transition-colors">
        "{hook.text}"
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {hook.tone && <span className="px-2 py-1 bg-pink-500/10 text-pink-300 rounded text-xs">{hook.tone}</span>}
        {hook.niche && <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs">{hook.niche}</span>}
      </div>

      {hook.source && (
        <a
          href={hook.source}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-purple-400 text-sm flex items-center space-x-1 hover:text-pink-400 transition-colors"
        >
          <span>View source</span>
          <ExternalLink size={12} />
        </a>
      )}
    </motion.div>
  );
};

// ============================================
// FOOTER COMPONENT
// ============================================
const Footer = () => {
  return (
    <footer className="border-t border-pink-500/30 bg-[#0a0a0f] py-12 px-4 shadow-[0_-10px_50px_rgba(255,75,139,0.1)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="hero-gradient-text text-2xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Hook Bank
            </div>
            <p className="text-gray-400 text-sm">Viral Hook Library</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Links</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Dashboard</a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Explore</a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Scraper</a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">About</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/20 pt-6 text-center">
          <p className="text-gray-500 text-sm">Built with 💜 by Hook Bank Team</p>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  const [notification, setNotification] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [appNotifications, setAppNotifications] = useState([
    { id: 1, message: 'New hooks available from trending creators', time: '5m ago' },
    { id: 2, message: 'Your scraping session completed successfully', time: '2h ago' }
  ]);
  const [stats, setStats] = useState({
    totalHooks: 1247,
    platforms: 3,
    lastUpdate: 'Just now'
  });
  const [hooks, setHooks] = useState([
    {
      id: 1,
      text: "How I made $10k in 30 days with this simple trick nobody talks about",
      platform: "YouTube",
      tone: "motivational",
      niche: "business",
      source: "https://youtube.com"
    },
    {
      id: 2,
      text: "This Reddit comment changed my entire perspective on productivity",
      platform: "Reddit",
      tone: "educational",
      niche: "productivity",
      source: "https://reddit.com"
    },
    {
      id: 3,
      text: "The brutal truth about fitness that trainers won't tell you",
      platform: "Instagram",
      tone: "shock",
      niche: "fitness",
      source: "https://instagram.com"
    },
    {
      id: 4,
      text: "I analyzed 1000 viral videos and found these 3 patterns",
      platform: "YouTube",
      tone: "educational",
      niche: "content",
      source: "https://youtube.com"
    },
    {
      id: 5,
      text: "Why everyone is quitting their 9-5 for this side hustle",
      platform: "Reddit",
      tone: "curiosity",
      niche: "business",
      source: "https://reddit.com"
    },
    {
      id: 6,
      text: "The one mindset shift that millionaires use daily",
      platform: "Instagram",
      tone: "motivational",
      niche: "mindset",
      source: "https://instagram.com"
    }
  ]);

  const [filteredHooks, setFilteredHooks] = useState(hooks);

  const showToastNotification = (message, type) => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Scraping handlers
  const handlePlatformScrape = async (platform) => {
    showNotification(`Scraping ${platform}...`, 'loading');
    
    try {
      let response;
      
      switch(platform.toLowerCase()) {
        case 'youtube':
          response = await api.youtube.scrapeAll();
          break;
        case 'reddit':
          response = await api.reddit.scrapeAll();
          break;
        case 'instagram':
          response = await api.instagram.scrapeAll();
          break;
        default:
          throw new Error('Unknown platform');
      }
      
      const data = await response.json();
      
      if (response.ok) {
        showNotification(`✅ ${platform} scraped successfully!`, 'success');
        // Refresh hooks after scraping
        await loadHooks();
      } else {
        throw new Error(data.detail || 'Scraping failed');
      }
    } catch (error) {
      showNotification(`❌ Error scraping ${platform}: ${error.message}`, 'error');
    }
  };

  // Load hooks from API
  const loadHooks = async () => {
    try {
      const response = await api.reddit.getHooks();
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setHooks(data);
          setFilteredHooks(data);
          setStats(prev => ({
            ...prev,
            totalHooks: data.length,
            lastUpdate: 'Just now'
          }));
        }
      }
    } catch (error) {
      console.error('Error loading hooks:', error);
    }
  };

  // Search handler
  const handleSearch = async (query, filters) => {
    if (!query.trim()) {
      setFilteredHooks(hooks);
      return;
    }

    showNotification('Searching...', 'loading');

    try {
      // Try API search first
      const response = await api.reddit.searchHooks(query);
      
      if (response.ok) {
        const data = await response.json();
        setFilteredHooks(data);
        showNotification(`Found ${data.length} hooks`, 'success');
      } else {
        // Fallback to local search
        const filtered = hooks.filter(hook => 
          hook.text.toLowerCase().includes(query.toLowerCase()) ||
          hook.niche?.toLowerCase().includes(query.toLowerCase()) ||
          hook.tone?.toLowerCase().includes(query.toLowerCase())
        );
        
        // Apply filters
        let results = filtered;
        if (filters.platform !== 'all') {
          results = results.filter(h => h.platform.toLowerCase() === filters.platform);
        }
        if (filters.tone !== 'all') {
          results = results.filter(h => h.tone?.toLowerCase() === filters.tone);
        }
        
        setFilteredHooks(results);
        showNotification(`Found ${results.length} hooks locally`, 'success');
      }
    } catch (error) {
      showNotification('Search error, showing local results', 'error');
      setFilteredHooks(hooks);
    }
  };

  // Hook actions
  const handleCopyHook = (hook) => {
    showNotification('Hook copied to clipboard!', 'success');
  };

  const handleFavoriteHook = (hook) => {
    showNotification('Hook added to favorites!', 'success');
  };

  const handleOpenHook = (hook) => {
    console.log('Opening hook:', hook);
  };

  // Navigation handler
  const handleNavigate = (page) => {
    console.log('Navigate to:', page);
    showNotification(`Navigating to ${page}...`, 'loading');
    setTimeout(() => closeNotification(), 1000);
  };

  const platforms = [
    {
      platform: "YouTube",
      icon: Youtube,
      description: "Scrape viral video hooks from the world's largest video platform",
      color: "from-red-500 to-red-700"
    },
    {
      platform: "Reddit",
      icon: Camera,
      description: "Extract engaging post titles and comments from trending subreddits",
      color: "from-orange-500 to-red-500"
    },
    {
      platform: "Instagram",
      icon: Camera,
      description: "Capture attention-grabbing captions from top performing reels",
      color: "from-purple-500 to-pink-500"
    }
  ];

  // Load hooks on mount
  useEffect(() => {
    loadHooks();
  }, []);

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
      `}</style>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </AnimatePresence>

      <Navbar onNavigate={handleNavigate} showNotifications={showNotifications} setShowNotifications={setShowNotifications} appNotifications={appNotifications} />
      
      <Hero 
        onExplore={() => handleNavigate('explore')} 
        onScrape={() => handleNavigate('scraper')} 
      />
      
      <StatsBar stats={stats} />
      
      {/* Platform Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <span className="hero-gradient-text">Supported Platforms</span>
          </motion.h2>
          <p className="text-gray-400 text-center mb-12">Scrape viral hooks from multiple platforms</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platforms.map((platform, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PlatformCard 
                  {...platform} 
                  onScrape={handlePlatformScrape}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SearchBar onSearch={handleSearch} />

      {/* Hook Samples Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <span className="hero-gradient-text">Trending Hooks</span>
          </motion.h2>
          <p className="text-gray-400 text-center mb-12">
            Discover what's working right now ({filteredHooks.length} hooks)
          </p>
          
          {filteredHooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No hooks found. Try different search terms or scrape new content.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold"
                onClick={() => handlePlatformScrape('Reddit')}
              >
                Scrape Reddit Now
              </motion.button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHooks.map((hook) => (
                  <HookCard
                    key={hook.id}
                    hook={hook}
                    onCopy={handleCopyHook}
                    onFavorite={handleFavoriteHook}
                    onOpen={handleOpenHook}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold"
                  onClick={() => handleNavigate('explore')}
                >
                  View All Hooks
                </motion.button>
              </div>
            </>
          )}
        </div>
      </section>

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