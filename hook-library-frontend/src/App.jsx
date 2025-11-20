import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Youtube, Camera, Mail, Mic, Video, Pen, Copy, Heart, ExternalLink, ChevronDown, Sparkles, TrendingUp, Clock, Filter, AlertCircle, CheckCircle, Loader, User, Settings, BarChart3, Database, Download, Zap, Grid, List } from 'lucide-react';

// ============================================
// API CONFIGURATION
// ============================================
const API_BASE_URL = 'http://localhost:8000/api';

const api = {
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
  youtube: {
    scrape: (channelId, limit = 10) => 
      fetch(`${API_BASE_URL}/youtube/scrape?channel_id=${channelId}&limit=${limit}`, { method: 'POST' }),
    scrapeAll: () => 
      fetch(`${API_BASE_URL}/youtube/scrape-all`, { method: 'POST' })
  },
  instagram: {
    scrape: (username, limit = 5) => 
      fetch(`${API_BASE_URL}/instagram/scrape?username=${username}&limit=${limit}`, { method: 'POST' }),
    scrapeAll: () => 
      fetch(`${API_BASE_URL}/instagram/scrape-all`, { method: 'POST' })
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
const Navbar = ({ currentPage, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', page: 'home' },
    { name: 'Dashboard', page: 'dashboard' },
    { name: 'Explore', page: 'explore' },
    { name: 'Scraper', page: 'scraper' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-lg shadow-lg shadow-purple-500/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="hero-gradient-text text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Hook Bank
            </div>
            <span className="text-xs text-gray-400 hidden sm:block">Viral Hook Library</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <button 
                key={item.page}
                onClick={() => onNavigate(item.page)} 
                className={`transition-colors ${
                  currentPage === item.page ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
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
            {navItems.map(item => (
              <button 
                key={item.page}
                onClick={() => { onNavigate(item.page); setMobileOpen(false); }} 
                className={`block w-full text-left py-2 ${
                  currentPage === item.page ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
            <button 
              onClick={() => { onNavigate('explore'); setMobileOpen(false); }}
              className="w-full px-6 py-2 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold"
            >
              Explore Hooks
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

// ============================================
// HOME PAGE COMPONENT
// ============================================
const HomePage = ({ onNavigate, onPlatformScrape, hooks, stats }) => {
  const icons = [
    { Icon: Video, delay: 0, x: -100, y: -50 },
    { Icon: Mic, delay: 0.2, x: 100, y: -30 },
    { Icon: Camera, delay: 0.4, x: -80, y: 80 },
    { Icon: Mail, delay: 0.6, x: 120, y: 70 },
    { Icon: Pen, delay: 0.8, x: 0, y: -100 }
  ];

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

  return (
    <div>
      {/* Hero Section */}
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
              onClick={() => onNavigate('dashboard')}
            >
              Explore Dashboard
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-purple-500 text-white rounded-lg font-semibold text-lg hover:bg-purple-500/10 transition-colors"
              onClick={() => onNavigate('scraper')}
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
            No login required • Free • {stats.totalHooks}+ hooks
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, label: 'Hooks in DB', value: stats.totalHooks.toLocaleString(), color: 'from-pink-500 to-purple-500' },
              { icon: TrendingUp, label: 'Platforms', value: stats.platforms, color: 'from-purple-500 to-blue-500' },
              { icon: Clock, label: 'Last Updated', value: stats.lastUpdate, color: 'from-blue-500 to-pink-500' }
            ].map((stat, i) => (
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

      {/* Platforms Section */}
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
                <PlatformCard {...platform} onScrape={onPlatformScrape} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Hooks Preview */}
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
          <p className="text-gray-400 text-center mb-12">Discover what's working right now</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hooks.slice(0, 6).map((hook) => (
              <HookCard key={hook.id} hook={hook} />
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold"
              onClick={() => onNavigate('explore')}
            >
              View All Hooks
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============================================
// DASHBOARD PAGE COMPONENT
// ============================================
const DashboardPage = ({ hooks, stats }) => {
  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="hero-gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-400">Your hook analytics and insights</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Hooks', value: stats.totalHooks, icon: Database, color: 'from-purple-500 to-pink-500' },
            { label: 'Saved Hooks', value: '42', icon: Heart, color: 'from-pink-500 to-red-500' },
            { label: 'Collections', value: '8', icon: Grid, color: 'from-blue-500 to-purple-500' },
            { label: 'Last Scrape', value: stats.lastUpdate, icon: Clock, color: 'from-green-500 to-blue-500' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 border border-purple-500/30 rounded-xl p-6"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 border border-purple-500/30 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <BarChart3 size={20} className="mr-2" />
              Platform Distribution
            </h3>
            <div className="space-y-4">
              {[
                { platform: 'YouTube', count: Math.floor(stats.totalHooks * 0.4), color: 'bg-red-500' },
                { platform: 'Reddit', count: Math.floor(stats.totalHooks * 0.35), color: 'bg-orange-500' },
                { platform: 'Instagram', count: Math.floor(stats.totalHooks * 0.25), color: 'bg-purple-500' }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{item.platform}</span>
                    <span className="text-white font-semibold">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / stats.totalHooks) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`${item.color} h-2 rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 border border-purple-500/30 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2" />
              Top Categories
            </h3>
            <div className="space-y-3">
              {[
                { category: 'Business', count: 156 },
                { category: 'Productivity', count: 134 },
                { category: 'Fitness', count: 98 },
                { category: 'Technology', count: 87 },
                { category: 'Mindset', count: 76 }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg"
                >
                  <span className="text-gray-300">{item.category}</span>
                  <span className="text-white font-semibold">{item.count}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 border border-purple-500/30 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Clock size={20} className="mr-2" />
            Recent Hooks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hooks.slice(0, 6).map((hook) => (
              <HookCard key={hook.id} hook={hook} compact />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// EXPLORE PAGE COMPONENT
// ============================================
const ExplorePage = ({ hooks, onSearch }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [filteredHooks, setFilteredHooks] = useState(hooks);
  const [filters, setFilters] = useState({
    platform: 'all',
    tone: 'all',
    sort: 'newest'
  });

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredHooks(hooks);
      return;
    }

    const results = hooks.filter(hook => 
      hook.text.toLowerCase().includes(query.toLowerCase()) ||
      hook.niche?.toLowerCase().includes(query.toLowerCase()) ||
      hook.tone?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredHooks(results);
    onSearch?.(query, filters);
  };

  useEffect(() => {
    let results = [...hooks];
    
    if (filters.platform !== 'all') {
      results = results.filter(h => h.platform.toLowerCase() === filters.platform);
    }
    if (filters.tone !== 'all') {
      results = results.filter(h => h.tone?.toLowerCase() === filters.tone);
    }
    
    setFilteredHooks(results);
  }, [filters, hooks]);

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="hero-gradient-text">Explore Hooks</span>
          </h1>
          <p className="text-gray-400">Browse and search through {hooks.length} viral hooks</p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder='Search hooks — e.g., "How I made $10k"'
                className="w-full px-6 py-4 pr-12 bg-[#1a0a2e]/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg border transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-500/20 border-purple-500' 
                    : 'border-purple-500/30 hover:border-purple-500/50'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg border transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-purple-500/20 border-purple-500' 
                    : 'border-purple-500/30 hover:border-purple-500/50'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-400">
            Showing {filteredHooks.length} of {hooks.length} hooks
          </p>
        </div>

        {filteredHooks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No hooks found matching your criteria</p>
            <button
              onClick={() => setFilters({ platform: 'all', tone: 'all', sort: 'newest' })}
              className="px-6 py-3 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredHooks.map((hook) => (
              <HookCard key={hook.id} hook={hook} listView={viewMode === 'list'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// SCRAPER PAGE COMPONENT
// ============================================
const ScraperPage = ({ onPlatformScrape }) => {
  const [activeTab, setActiveTab] = useState('youtube');
  const [youtubeChannel, setYoutubeChannel] = useState('');
  const [youtubeLimit, setYoutubeLimit] = useState(10);
  const [redditSubreddit, setRedditSubreddit] = useState('');
  const [redditLimit, setRedditLimit] = useState(50);
  const [instagramUsername, setInstagramUsername] = useState('');
  const [instagramLimit, setInstagramLimit] = useState(5);

  const handleCustomScrape = async (e) => {
    e.preventDefault();
    
    switch(activeTab) {
      case 'youtube':
        if (youtubeChannel) {
          await onPlatformScrape('youtube', { channelId: youtubeChannel, limit: youtubeLimit });
        }
        break;
      case 'reddit':
        if (redditSubreddit) {
          await onPlatformScrape('reddit', { subreddit: redditSubreddit, limit: redditLimit });
        }
        break;
      case 'instagram':
        if (instagramUsername) {
          await onPlatformScrape('instagram', { username: instagramUsername, limit: instagramLimit });
        }
        break;
    }
  };

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-700' },
    { id: 'reddit', name: 'Reddit', icon: Camera, color: 'from-orange-500 to-red-500' },
    { id: 'instagram', name: 'Instagram', icon: Camera, color: 'from-purple-500 to-pink-500' }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="hero-gradient-text">Scraper</span>
          </h1>
          <p className="text-gray-400">Scrape viral hooks from social media platforms</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 border border-purple-500/30 rounded-xl p-6"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center mb-4`}>
                <platform.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
              <p className="text-gray-400 text-sm mb-4">Scrape all default accounts</p>
              <button
                onClick={() => onPlatformScrape(platform.name)}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold text-sm"
              >
                Scrape Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* Custom Scraper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 border border-purple-500/30 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Custom Scraper</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-purple-500/30">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setActiveTab(platform.id)}
                className={`px-6 py-3 font-semibold transition-colors relative ${
                  activeTab === platform.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {platform.name}
                {activeTab === platform.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Forms */}
          <form onSubmit={handleCustomScrape}>
            {activeTab === 'youtube' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    YouTube Channel ID
                  </label>
                  <input
                    type="text"
                    value={youtubeChannel}
                    onChange={(e) => setYoutubeChannel(e.target.value)}
                    placeholder="UCxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Videos
                  </label>
                  <input
                    type="number"
                    value={youtubeLimit}
                    onChange={(e) => setYoutubeLimit(parseInt(e.target.value))}
                    min="1"
                    max="50"
                    className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'reddit' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subreddit Name
                  </label>
                  <input
                    type="text"
                    value={redditSubreddit}
                    onChange={(e) => setRedditSubreddit(e.target.value)}
                    placeholder="wallstreetbets"
                    className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Posts
                  </label>
                  <input
                    type="number"
                    value={redditLimit}
                    onChange={(e) => setRedditLimit(parseInt(e.target.value))}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'instagram' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instagram Username
                  </label>
                  <input
                    type="text"
                    value={instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value)}
                    placeholder="garyvee"
                    className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Posts
                  </label>
                  <input
                    type="number"
                    value={instagramLimit}
                    onChange={(e) => setInstagramLimit(parseInt(e.target.value))}
                    min="1"
                    max="20"
                    className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold text-lg shadow-lg"
              >
                Start Scraping
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-3 flex items-center">
            <Sparkles size={20} className="mr-2" />
            Pro Tips
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• Start with smaller limits to test before doing large scrapes</li>
            <li>• Reddit scraping works best with active subreddits</li>
            <li>• YouTube channel IDs can be found in the channel URL</li>
            <li>• Instagram scraping requires public accounts</li>
          </ul>
        </motion.div>
      </div>
    </div>
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
      className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group"
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
// HOOK CARD COMPONENT
// ============================================
const HookCard = ({ hook, compact, listView }) => {
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hook.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setFavorited(!favorited);
  };

  if (listView) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 border border-purple-500/30 rounded-xl p-4 flex items-center gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
              {hook.platform}
            </span>
            {hook.tone && <span className="px-2 py-1 bg-pink-500/10 text-pink-300 rounded text-xs">{hook.tone}</span>}
            {hook.niche && <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs">{hook.niche}</span>}
          </div>
          <p className="text-white text-base">"{hook.text}"</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <Copy size={16} className={copied ? 'text-green-400' : 'text-gray-400'} />
          </button>
          <button
            onClick={handleFavorite}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <Heart size={16} className={favorited ? 'text-pink-400 fill-pink-400' : 'text-gray-400'} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
          {hook.platform}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <Copy size={16} className={copied ? 'text-green-400' : 'text-gray-400'} />
          </button>
          <button
            onClick={handleFavorite}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <Heart size={16} className={favorited ? 'text-pink-400 fill-pink-400' : 'text-gray-400'} />
          </button>
        </div>
      </div>

      <p className={`text-white mb-4 group-hover:text-pink-300 transition-colors ${compact ? 'text-sm line-clamp-2' : 'text-lg line-clamp-3'}`}>
        "{hook.text}"
      </p>

      {!compact && (
        <>
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
        </>
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
  const [currentPage, setCurrentPage] = useState('home');
  const [notification, setNotification] = useState(null);
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

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlatformScrape = async (platform, customParams) => {
    showNotification(`Scraping ${platform}...`, 'loading');
    
    try {
      let response;
      
      switch(platform.toLowerCase()) {
        case 'youtube':
          if (customParams) {
            response = await api.youtube.scrape(customParams.channelId, customParams.limit);
          } else {
            response = await api.youtube.scrapeAll();
          }
          break;
        case 'reddit':
          if (customParams) {
            response = await api.reddit.scrape(customParams.subreddit, customParams.limit);
          } else {
            response = await api.reddit.scrapeAll();
          }
          break;
        case 'instagram':
          if (customParams) {
            response = await api.instagram.scrape(customParams.username, customParams.limit);
          } else {
            response = await api.instagram.scrapeAll();
          }
          break;
        default:
          throw new Error('Unknown platform');
      }
      
      const data = await response.json();
      
      if (response.ok) {
        showNotification(`✅ ${platform} scraped successfully!`, 'success');
        await loadHooks();
      } else {
        throw new Error(data.detail || 'Scraping failed');
      }
    } catch (error) {
      showNotification(`❌ Error: ${error.message}`, 'error');
    }
  };

  const loadHooks = async () => {
    try {
      const response = await api.reddit.getHooks();
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setHooks(data);
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

  const handleSearch = async (query, filters) => {
    if (!query.trim()) return;

    showNotification('Searching...', 'loading');

    try {
      const response = await api.reddit.searchHooks(query);
      
      if (response.ok) {
        const data = await response.json();
        showNotification(`Found ${data.length} hooks`, 'success');
      } else {
        showNotification('Search completed', 'success');
      }
    } catch (error) {
      showNotification('Search error', 'error');
    }
  };

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

      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </AnimatePresence>

      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HomePage 
              onNavigate={handleNavigate}
              onPlatformScrape={handlePlatformScrape}
              hooks={hooks}
              stats={stats}
            />
          </motion.div>
        )}

        {currentPage === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DashboardPage hooks={hooks} stats={stats} />
          </motion.div>
        )}

        {currentPage === 'explore' && (
          <motion.div
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ExplorePage hooks={hooks} onSearch={handleSearch} />
          </motion.div>
        )}

        {currentPage === 'scraper' && (
          <motion.div
            key="scraper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ScraperPage onPlatformScrape={handlePlatformScrape} />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}