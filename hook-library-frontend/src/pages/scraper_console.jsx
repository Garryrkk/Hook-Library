import React, { useState, useEffect } from 'react';
import { 
  Search, Menu, X, Youtube, Camera, Heart, Copy, ExternalLink, 
  ChevronDown, Filter, TrendingUp, Clock, Sparkles, User, Bell,
  RefreshCw, Sun, Moon, Check, AlertCircle, RotateCcw, Eye,
  ThumbsUp, MessageCircle, ArrowUp
} from 'lucide-react';


const API_BASE = "http://localhost:8000";

// API Functions
const api = {
  fetchHooks: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('q', params.search);
    if (params.platform && params.platform !== 'all') queryParams.append('platform', params.platform);
    if (params.niche && params.niche !== 'all') queryParams.append('niche', params.niche);
    if (params.tone && params.tone !== 'all') queryParams.append('tone', params.tone);
    if (params.sort) {
      const sortMap = {
        'newest': 'Newest First',
        'popular': 'Most Popular',
        'copied': 'Most Copied',
        'engagement': 'Highest Engagement'
      };
      queryParams.append('sort_by', sortMap[params.sort] || 'Newest First');
    }
    
    const res = await fetch(`${API_BASE}/api/hooks?${queryParams.toString()}`);
    return res.json();
  },
  
  refreshHooks: async () => {
    const res = await fetch(`${API_BASE}/api/hooksrefresh`, { method: 'POST' });
    return res.json();
  },
  
  resetFilters: async () => {
    const res = await fetch(`${API_BASE}/api/hooks/reset-filters`, { method: 'POST' });
    return res.json();
  },
  
  recordCopy: async (hookId) => {
    const res = await fetch(`${API_BASE}/api/hooks/${hookId}/copy`, { method: 'POST' });
    return res.json();
  },
  
  recordView: async (hookId) => {
    const res = await fetch(`${API_BASE}/api/hooks/${hookId}/view`, { method: 'POST' });
    return res.json();
  },
  
  likeHook: async (hookId, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${API_BASE}/api/hooks/${hookId}/like`, { 
      method: 'POST',
      headers 
    });
    return res.json();
  },
  
  savePost: async (postId, token) => {
    const res = await fetch(`${API_BASE}/api/posts/${postId}/save`, { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.json();
  },
  
  recordShare: async (postId, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${API_BASE}/api/posts/${postId}/share`, { 
      method: 'POST',
      headers 
    });
    return res.json();
  },
  
  getDashboardMetrics: async () => {
    const res = await fetch(`${API_BASE}/api/dashboard/metrics`);
    return res.json();
  }
};

const Navbar = ({ onSearch, darkMode, onThemeToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = () => {
    onSearch(searchQuery);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-purple-500/20 ${
      scrolled ? 'bg-gray-900/90 backdrop-blur-xl shadow-lg shadow-purple-500/10' : 'bg-gray-900/50 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Scraper Console
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              Home
            </button>
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              Dashboard
            </button>
            <button className="text-white font-semibold underline underline-offset-4 decoration-pink-500">
              Scraper Console
            </button>
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              About
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                placeholder="Search hooks..."
                className="w-full px-4 py-2 pr-10 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-purple-500/20 rounded transition-colors"
              >
                <Search size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="relative p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
              <Bell size={18} className="text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            </button>

            <button className="flex items-center space-x-2 p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
              <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
            </button>

            <button 
              onClick={onThemeToggle}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
            >
              {darkMode ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-400" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-lg rounded-lg mt-2 p-4 space-y-3 mb-4">
            <div className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hooks..."
                className="w-full px-4 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 text-sm"
              />
            </div>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">Home</button>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">Dashboard</button>
            <button className="block w-full text-left text-white font-semibold py-2">Scraper Console</button>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">About</button>
          </div>
        )}
      </div>
    </nav>
  );
};


const SearchFilterBar = ({ filters, onFilterChange, onReset }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mb-8">
      <div className="bg-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        {/* Main Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search hooks about marketing, fitness..."
              className="w-full px-6 py-4 pr-12 bg-gray-900/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <Search size={20} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <Filter size={16} />
          <span className="text-sm font-semibold">Advanced Filters</span>
          <ChevronDown size={16} className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters */}
        {expanded && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Platform */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Platform</label>
              <select
                value={filters.platform}
                onChange={(e) => onFilterChange('platform', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="all">All Platforms</option>
                <option value="YouTube">YouTube</option>
                <option value="Reddit">Reddit</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            {/* Niche */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Niche</label>
              <select
                value={filters.niche}
                onChange={(e) => onFilterChange('niche', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="all">All Niches</option>
                <option value="Business">Business</option>
                <option value="Fitness">Fitness</option>
                <option value="Tech">Tech</option>
                <option value="Health">Health</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Tone</label>
              <select
                value={filters.tone}
                onChange={(e) => onFilterChange('tone', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="all">All Tones</option>
                <option value="Emotional">Emotional</option>
                <option value="Urgent">Urgent</option>
                <option value="Curiosity">Curiosity</option>
                <option value="Informative">Informative</option>
                <option value="Funny">Funny</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => onFilterChange('sort', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="copied">Most Copied</option>
                <option value="engagement">Highest Engagement</option>
              </select>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {expanded && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onReset}
              className="px-4 py-2 border border-purple-500/50 text-white rounded-lg text-sm flex items-center space-x-2 hover:bg-purple-500/10 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};


const HookCard = ({ hook, onCopy, onSave, onViewSource, onLike, isSaved, isLiked }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [liked, setLiked] = useState(isLiked);

  const handleCopy = async () => {
    navigator.clipboard.writeText(hook.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    await onCopy?.(hook);
  };

  const handleSave = async () => {
    setSaved(!saved);
    await onSave?.(hook);
  };

  const handleLike = async () => {
    setLiked(!liked);
    await onLike?.(hook);
  };

  const platformConfig = {
    YouTube: { color: 'from-red-500 to-red-700', icon: Youtube, emoji: '▶️' },
    Reddit: { color: 'from-orange-500 to-red-500', icon: Camera, emoji: '🧵' },
    Instagram: { color: 'from-purple-500 to-pink-500', icon: Camera, emoji: '📸' }
  };

  const config = platformConfig[hook.platform] || platformConfig.YouTube;

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 group hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 bg-gradient-to-r ${config.color} text-white rounded-full text-xs font-semibold flex items-center space-x-1`}>
            <span>{config.emoji}</span>
            <span>{hook.platform}</span>
          </span>
        </div>
        
        <button
          onClick={handleSave}
          className={`p-2 rounded-lg transition-all ${
            saved ? 'bg-pink-500/20 text-pink-400' : 'hover:bg-purple-500/20 text-gray-400'
          }`}
        >
          <Heart size={18} className={saved ? 'fill-pink-400' : ''} />
        </button>
      </div>

      {/* Hook Text */}
      <p className="text-white text-lg mb-4 leading-relaxed group-hover:text-pink-300 transition-colors font-medium">
        "{hook.text}"
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/30">
          {hook.niche}
        </span>
        <span className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
          {hook.tone}
        </span>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 hover:text-pink-400 transition-colors ${liked ? 'text-pink-400' : ''}`}
          >
            <ThumbsUp size={12} className={liked ? 'fill-pink-400' : ''} />
            <span>{hook.engagement?.likes?.toLocaleString() || 0}</span>
          </button>
          <span className="flex items-center space-x-1">
            <MessageCircle size={12} />
            <span>{hook.engagement?.comments || 0}</span>
          </span>
          {hook.engagement?.views && (
            <span className="flex items-center space-x-1">
              <Eye size={12} />
              <span>{hook.engagement.views.toLocaleString()}</span>
            </span>
          )}
        </div>
        <span className="flex items-center space-x-1">
          <Clock size={12} />
          <span>{hook.dateAdded || 'Recently'}</span>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            copied 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
              : 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border border-purple-500/50 hover:from-pink-500/30 hover:to-purple-500/30'
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Hook'}</span>
          </span>
        </button>

        <button
          onClick={() => onViewSource?.(hook)}
          className="px-4 py-2 border border-purple-500/50 text-white rounded-lg text-sm font-semibold hover:bg-purple-500/10 transition-all"
        >
          <span className="flex items-center justify-center space-x-1">
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Source</span>
          </span>
        </button>
      </div>
    </div>
  );
};


const RightSidebar = ({ topHooks, stats, recentlyViewed }) => {
  return (
    <div className="space-y-6">
      {/* Top Hooks */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp size={20} className="text-pink-400" />
          <span>Top Hooks</span>
        </h3>
        <div className="space-y-3">
          {topHooks.map((hook, i) => (
            <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
              <p className="text-white text-sm line-clamp-2 mb-2">"{hook.text}"</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{hook.platform}</span>
                <span className="flex items-center space-x-1">
                  <Copy size={10} />
                  <span>{hook.copies}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Sparkles size={20} className="text-purple-400" />
          <span>Hook Stats</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Hooks</span>
            <span className="text-white font-bold">{stats.total?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">YouTube</span>
            <span className="text-white font-bold">{stats.youtube || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Reddit</span>
            <span className="text-white font-bold">{stats.reddit || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Instagram</span>
            <span className="text-white font-bold">{stats.instagram || 0}</span>
          </div>
        </div>
      </div>

      {/* Filter Presets */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-4">Quick Filters</h3>
        <div className="space-y-2">
          <button className="w-full px-3 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-lg text-sm font-semibold transition-all text-left">
            🔥 Viral Hooks Only
          </button>
          <button className="w-full px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-sm font-semibold transition-all text-left">
            💔 Emotional Hooks
          </button>
          <button className="w-full px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm font-semibold transition-all text-left">
            🧠 Educational
          </button>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Clock size={20} className="text-blue-400" />
          <span>Recently Viewed</span>
        </h3>
        <div className="space-y-2">
          {recentlyViewed.map((hook, i) => (
            <div key={i} className="p-2 bg-gray-900/30 rounded-lg text-xs text-gray-400 hover:text-white transition-colors cursor-pointer line-clamp-2">
              {hook}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const FloatingActions = ({ onRefresh, onThemeToggle, darkMode }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
      <button
        onClick={onRefresh}
        className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg"
      >
        <RefreshCw size={20} />
      </button>

      <button
        onClick={onThemeToggle}
        className="p-4 bg-gray-800/80 backdrop-blur-xl border border-purple-500/50 text-white rounded-full shadow-lg"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-4 bg-gray-800/80 backdrop-blur-xl border border-purple-500/50 text-white rounded-full shadow-lg"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <Check size={18} className="text-green-400" />,
    error: <AlertCircle size={18} className="text-red-400" />,
    info: <Sparkles size={18} className="text-blue-400" />
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur-xl border border-purple-500/50 rounded-xl px-6 py-4 shadow-2xl">
      <div className="flex items-center space-x-3">
        {icons[type]}
        <p className="text-white font-semibold text-sm">{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="border-t-2 border-pink-500/30 bg-gray-900 py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">© Scraper Console 2025</p>
            <p className="text-gray-500 text-xs mt-1">Built by Garima Kalra</p>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function ScraperConsolePage() {
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState(null);
  const [savedHooks, setSavedHooks] = useState(new Set());
  const [likedHooks, setLikedHooks] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null); // Store JWT token if available
  
  const [filters, setFilters] = useState({
    search: '',
    platform: 'all',
    niche: 'all',
    tone: 'all',
    sort: 'newest'
  });

  const [stats, setStats] = useState({
    total: 0,
    youtube: 0,
    reddit: 0,
    instagram: 0
  });

  const [topHooks] = useState([
    { text: "How I made $10k in 30 days", platform: "YouTube", copies: 1234 },
    { text: "This changed my life forever", platform: "Instagram", copies: 987 },
    { text: "Why everyone is quitting", platform: "Reddit", copies: 765 }
  ]);

  const [recentlyViewed] = useState([
    "How I made $10k in 30 days with this simple trick",
    "The brutal truth about fitness that trainers won't tell you",
    "I analyzed 1000 viral videos and found these 3 patterns"
  ]);

  const [allHooks, setAllHooks] = useState([]);
  const [visibleHooks, setVisibleHooks] = useState(9);

  // Fetch hooks from backend
  const fetchHooksFromBackend = async () => {
    setLoading(true);
    try {
      const data = await api.fetchHooks(filters);
      setAllHooks(data);
      showToast('Hooks loaded successfully!', 'success');
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast('Failed to fetch hooks', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard metrics
  const fetchDashboardMetrics = async () => {
    try {
      const data = await api.getDashboardMetrics();
      setStats({
        total: data.total_hooks || 0,
        youtube: data.youtube_count || 0,
        reddit: data.reddit_count || 0,
        instagram: data.instagram_count || 0
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  useEffect(() => {
    fetchHooksFromBackend();
    fetchDashboardMetrics();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHooksFromBackend();
    }, 500); // Debounce API calls
    
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = async () => {
    setFilters({
      search: '',
      platform: 'all',
      niche: 'all',
      tone: 'all',
      sort: 'newest'
    });
    
    try {
      const data = await api.resetFilters();
      setAllHooks(data);
      showToast('Filters reset', 'success');
    } catch (error) {
      console.error("Error resetting filters:", error);
      showToast('Failed to reset filters', 'error');
    }
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleCopy = async (hook) => {
    try {
      await api.recordCopy(hook.id);
      showToast('Hook copied to clipboard!', 'success');
    } catch (error) {
      console.error('Failed to track copy:', error);
      showToast('Hook copied to clipboard!', 'success'); // Still show success for user
    }
  };

  const handleSave = async (hook) => {
    const newSaved = new Set(savedHooks);
    
    try {
      if (newSaved.has(hook.id)) {
        newSaved.delete(hook.id);
        showToast('Hook removed from favorites', 'info');
      } else {
        newSaved.add(hook.id);
        showToast('Hook saved to favorites!', 'success');
      }
      
      // Call API to save/unsave
      if (authToken) {
        await api.savePost(hook.id, authToken);
      }
      
      setSavedHooks(newSaved);
    } catch (error) {
      console.error('Failed to save hook:', error);
      showToast('Failed to save hook. Please login.', 'error');
    }
  };

  const handleLike = async (hook) => {
    const newLiked = new Set(likedHooks);
    
    try {
      if (newLiked.has(hook.id)) {
        newLiked.delete(hook.id);
      } else {
        newLiked.add(hook.id);
      }
      
      await api.likeHook(hook.id, authToken);
      setLikedHooks(newLiked);
    } catch (error) {
      console.error('Failed to like hook:', error);
      // Still update UI optimistically
      setLikedHooks(newLiked);
    }
  };

  const handleViewSource = async (hook) => {
    try {
      await api.recordView(hook.id);
      showToast('Opening source...', 'info');
      
      // Open source URL if available
      if (hook.sourceUrl) {
        window.open(hook.sourceUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to record view:', error);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await api.refreshHooks();
      setAllHooks(data);
      await fetchDashboardMetrics();
      showToast('Hooks refreshed successfully!', 'success');
    } catch (error) {
      console.error("Error refreshing hooks:", error);
      showToast('Failed to refresh hooks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleHooks(prev => Math.min(prev + 9, filteredHooks.length));
    showToast(`Loaded ${Math.min(9, filteredHooks.length - visibleHooks)} more hooks`, 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Filter hooks (client-side for immediate feedback)
  const filteredHooks = allHooks.filter(hook => {
    const matchesSearch = filters.search === '' || 
      hook.text?.toLowerCase().includes(filters.search.toLowerCase()) ||
      hook.niche?.toLowerCase().includes(filters.search.toLowerCase()) ||
      hook.tone?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesPlatform = filters.platform === 'all' || 
      hook.platform?.toLowerCase() === filters.platform.toLowerCase();
    
    const matchesNiche = filters.niche === 'all' || 
      hook.niche?.toLowerCase() === filters.niche.toLowerCase();
    
    const matchesTone = filters.tone === 'all' || 
      hook.tone?.toLowerCase() === filters.tone.toLowerCase();
    
    return matchesSearch && matchesPlatform && matchesNiche && matchesTone;
  });

  // Sort hooks
  const sortedHooks = [...filteredHooks].sort((a, b) => {
    switch (filters.sort) {
      case 'popular':
        return (b.engagement?.likes || 0) - (a.engagement?.likes || 0);
      case 'copied':
        return (b.engagement?.comments || 0) - (a.engagement?.comments || 0);
      case 'engagement':
        return ((b.engagement?.likes || 0) + (b.engagement?.comments || 0)) - 
               ((a.engagement?.likes || 0) + (a.engagement?.comments || 0));
      default: // newest
        return (b.id || 0) - (a.id || 0);
    }
  });

  const displayedHooks = sortedHooks.slice(0, visibleHooks);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: #0a0a0f;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1a2e;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ec4899, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ec4899, #ec4899);
        }
      `}</style>

      <Navbar 
        onSearch={handleSearch}
        darkMode={darkMode}
        onThemeToggle={() => setDarkMode(!darkMode)}
      />

      {/* Main Container */}
      <div className="pt-20 pb-12">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Scraper Console
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Your AI library for viral hooks. Search, filter, and discover high-performing content from YouTube, Reddit, and Instagram.
            </p>
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-500">
              <span className="flex items-center space-x-2">
                <Sparkles size={16} className="text-pink-400" />
                <span>{filteredHooks.length} hooks found</span>
              </span>
              <span className="flex items-center space-x-2">
                <Heart size={16} className="text-purple-400" />
                <span>{savedHooks.size} saved</span>
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <SearchFilterBar 
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Hooks Grid - 3 columns */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-20">
                  <RefreshCw size={48} className="text-purple-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-400">Loading hooks...</p>
                </div>
              ) : displayedHooks.length === 0 ? (
                <div className="text-center py-20">
                  <Sparkles size={64} className="text-gray-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-2">No hooks found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedHooks.map((hook) => (
                      <div key={hook.id}>
                        <HookCard
                          hook={hook}
                          onCopy={handleCopy}
                          onSave={handleSave}
                          onViewSource={handleViewSource}
                          onLike={handleLike}
                          isSaved={savedHooks.has(hook.id)}
                          isLiked={likedHooks.has(hook.id)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {visibleHooks < sortedHooks.length && (
                    <div className="text-center mt-12">
                      <button
                        onClick={handleLoadMore}
                        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg"
                      >
                        Load More Hooks ({sortedHooks.length - visibleHooks} remaining)
                      </button>
                      <p className="text-gray-500 text-sm mt-4">
                        Showing {displayedHooks.length} of {sortedHooks.length} hooks
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Sidebar - 1 column */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <RightSidebar
                  topHooks={topHooks}
                  stats={stats}
                  recentlyViewed={recentlyViewed}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActions
        onRefresh={handleRefresh}
        onThemeToggle={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
      />

      <Footer />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}