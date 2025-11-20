import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Menu, X, Youtube, Camera, Heart, Copy, ExternalLink,
  ChevronDown, Filter, TrendingUp, Clock, Sparkles, User, Bell,
  RefreshCw, Sun, Moon, Check, AlertCircle, RotateCcw, Eye,
  ThumbsUp, MessageCircle, Share2, Bookmark, ArrowUp
} from 'lucide-react';
import axios from "axios";

const API_URL = "http://localhost:5000";

const handleScrape = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/scrape/reddit`);
    const data = await res.json();
    console.log("Scraped:", data);
  } catch (err) {
    console.error("Scrape error:", err);
  }
  setLoading(false);
};


// ============================================
// NAVBAR COMPONENT
// ============================================
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-purple-500/20 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl shadow-lg shadow-purple-500/10' : 'bg-[#0a0a0f]/50 backdrop-blur-xl'
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
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              Dashboard
            </button>
            <button className="text-white font-semibold underline underline-offset-4 decoration-pink-500">
              Explorer
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
                className="w-full px-4 py-2 pr-10 bg-[#1a0a2e]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-purple-500/20 rounded transition-colors"
                aria-label="Search"
              >
                <Search size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="relative p-2 hover:bg-purple-500/20 rounded-lg transition-colors" aria-label="Notifications">
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
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-400" />}
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
            className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-lg rounded-lg mt-2 p-4 space-y-3 mb-4"
          >
            <div className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hooks..."
                className="w-full px-4 py-2 bg-[#1a0a2e]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 text-sm"
              />
            </div>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">Home</button>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">Dashboard</button>
            <button className="block w-full text-left text-white font-semibold py-2">Explorer</button>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">About</button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

// ============================================
// SEARCH & FILTER BAR COMPONENT
// ============================================
const SearchFilterBar = ({ filters, onFilterChange, onReset }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a0a2e]/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
      >
        {/* Main Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search hooks about marketing, fitness..."
              className="w-full px-6 py-4 pr-12 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
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
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {/* Platform */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Platform</label>
                <select
                  value={filters.platform}
                  onChange={(e) => onFilterChange('platform', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="all">All Platforms</option>
                  <option value="youtube">YouTube</option>
                  <option value="reddit">Reddit</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>

              {/* Niche */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Niche</label>
                <select
                  value={filters.niche}
                  onChange={(e) => onFilterChange('niche', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="all">All Niches</option>
                  <option value="business">Business</option>
                  <option value="fitness">Fitness</option>
                  <option value="tech">Tech</option>
                  <option value="health">Health</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Tone</label>
                <select
                  value={filters.tone}
                  onChange={(e) => onFilterChange('tone', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="all">All Tones</option>
                  <option value="emotional">Emotional</option>
                  <option value="urgent">Urgent</option>
                  <option value="curiosity">Curiosity</option>
                  <option value="informative">Informative</option>
                  <option value="funny">Funny</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => onFilterChange('sort', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="copied">Most Copied</option>
                  <option value="engagement">Highest Engagement</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Button */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="px-4 py-2 border border-purple-500/50 text-white rounded-lg text-sm flex items-center space-x-2 hover:bg-purple-500/10 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

// ============================================
// HOOK CARD COMPONENT
// ============================================
const HookCard = ({ hook, onCopy, onSave, onViewSource, isSaved }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleCopy = () => {
    navigator.clipboard.writeText(hook.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.(hook);
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(hook);
  };

  const platformConfig = {
    YouTube: { color: 'from-red-500 to-red-700', icon: Youtube, emoji: '▶️' },
    Reddit: { color: 'from-orange-500 to-red-500', icon: Camera, emoji: '🧵' },
    Instagram: { color: 'from-purple-500 to-pink-500', icon: Camera, emoji: '📸' }
  };

  const config = platformConfig[hook.platform] || platformConfig.YouTube;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 group hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20"
    >
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
          className={`p-2 rounded-lg transition-all ${saved ? 'bg-pink-500/20 text-pink-400' : 'hover:bg-purple-500/20 text-gray-400'
            }`}
          aria-label="Save hook"
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
          <span className="flex items-center space-x-1">
            <ThumbsUp size={12} />
            <span>{hook.engagement.likes.toLocaleString()}</span>
          </span>
          <span className="flex items-center space-x-1">
            <MessageCircle size={12} />
            <span>{hook.engagement.comments}</span>
          </span>
          {hook.engagement.views && (
            <span className="flex items-center space-x-1">
              <Eye size={12} />
              <span>{hook.engagement.views.toLocaleString()}</span>
            </span>
          )}
        </div>
        <span className="flex items-center space-x-1">
          <Clock size={12} />
          <span>{hook.dateAdded}</span>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${copied
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border border-purple-500/50 hover:from-pink-500/30 hover:to-purple-500/30'
            }`}
        >
          <span className="flex items-center justify-center space-x-2">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Hook'}</span>
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewSource?.(hook)}
          className="px-4 py-2 border border-purple-500/50 text-white rounded-lg text-sm font-semibold hover:bg-purple-500/10 transition-all"
        >
          <span className="flex items-center justify-center space-x-1">
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Source</span>
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================
// RIGHT SIDEBAR COMPONENT
// ============================================
const RightSidebar = ({ topHooks, stats, recentlyViewed }) => {
  return (
    <div className="space-y-6">
      {/* Top Hooks */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#1a0a2e]/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp size={20} className="text-pink-400" />
          <span>Top Hooks</span>
        </h3>
        <div className="space-y-3">
          {topHooks.map((hook, i) => (
            <div key={i} className="p-3 bg-[#0a0a0f]/50 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
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
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1a0a2e]/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Sparkles size={20} className="text-purple-400" />
          <span>Hook Stats</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Hooks</span>
            <span className="text-white font-bold">{stats.total.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">YouTube</span>
            <span className="text-white font-bold">{stats.youtube}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Reddit</span>
            <span className="text-white font-bold">{stats.reddit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Instagram</span>
            <span className="text-white font-bold">{stats.instagram}</span>
          </div>
        </div>
      </motion.div>

      {/* Filter Presets */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1a0a2e]/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5"
      >
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
      </motion.div>

      {/* Recently Viewed */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1a0a2e]/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Clock size={20} className="text-blue-400" />
          <span>Recently Viewed</span>
        </h3>
        <div className="space-y-2">
          {recentlyViewed.map((hook, i) => (
            <div key={i} className="p-2 bg-[#0a0a0f]/30 rounded-lg text-xs text-gray-400 hover:text-white transition-colors cursor-pointer line-clamp-2">
              {hook}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// FLOATING ACTION BUTTONS
// ============================================
const FloatingActions = ({ onRefresh, onThemeToggle, darkMode }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRefresh}
        className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg shadow-purple-500/50 neon-glow"
        aria-label="Refresh data"
      >
        <RefreshCw size={20} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onThemeToggle}
        className="p-4 bg-[#1a0a2e]/80 backdrop-blur-xl border border-purple-500/50 text-white rounded-full shadow-lg"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-4 bg-[#1a0a2e]/80 backdrop-blur-xl border border-purple-500/50 text-white rounded-full shadow-lg"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// TOAST NOTIFICATION
// ============================================
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
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -50, x: '-50%' }}
      className="fixed top-20 left-1/2 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border border-purple-500/50 rounded-xl px-6 py-4 shadow-2xl neon-glow"
    >
      <div className="flex items-center space-x-3">
        {icons[type]}
        <p className="text-white font-semibold text-sm">{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// FOOTER COMPONENT
// ============================================
const Footer = () => {
  return (
    <footer className="border-t-2 border-pink-500/30 bg-[#0a0a0f] py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">© Hook Bank 2025</p>
            <p className="text-gray-500 text-xs mt-1">Built by Garima Kalra</p>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm flex items-center space-x-1">
              <span>GitHub</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm flex items-center space-x-1">
              <span>Instagram</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm flex items-center space-x-1">
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN EXPLORER PAGE COMPONENT
// ============================================
export default function ExplorerPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState(null);
  const [savedHooks, setSavedHooks] = useState(new Set());

  const [filters, setFilters] = useState({
    search: '',
    platform: 'all',
    niche: 'all',
    tone: 'all',
    sort: 'newest'
  });

  const [stats] = useState({
    total: 1247,
    youtube: 420,
    reddit: 360,
    instagram: 467
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

  const [allHooks, setAllHooks] = useState([
    {
      id: 1,
      text: "How I made $10k in 30 days with this simple trick nobody talks about",
      platform: "YouTube",
      niche: "Business",
      tone: "Emotional",
      dateAdded: "2 hours ago",
      engagement: { likes: 4320, comments: 234, views: 125000 }
    },
    {
      id: 2,
      text: "This Reddit comment changed my entire perspective on productivity forever",
      platform: "Reddit",
      niche: "Lifestyle",
      tone: "Informative",
      dateAdded: "5 hours ago",
      engagement: { likes: 2134, comments: 89 }
    },
    {
      id: 3,
      text: "The brutal truth about fitness that trainers won't tell you",
      platform: "Instagram",
      niche: "Fitness",
      tone: "Urgent",
      dateAdded: "1 day ago",
      engagement: { likes: 8765, comments: 456, views: 234000 }
    },
    {
      id: 4,
      text: "I analyzed 1000 viral videos and found these 3 patterns that guarantee success",
      platform: "YouTube",
      niche: "Tech",
      tone: "Informative",
      dateAdded: "2 days ago",
      engagement: { likes: 12340, comments: 678, views: 456000 }
    },
    {
      id: 5,
      text: "Why everyone is quitting their 9-5 for this side hustle in 2024",
      platform: "Reddit",
      niche: "Business",
      tone: "Curiosity",
      dateAdded: "3 days ago",
      engagement: { likes: 5432, comments: 234 }
    },
    {
      id: 6,
      text: "The one mindset shift that millionaires use daily to stay focused",
      platform: "Instagram",
      niche: "Lifestyle",
      tone: "Emotional",
      dateAdded: "4 days ago",
      engagement: { likes: 9876, comments: 567, views: 345000 }
    },
    {
      id: 7,
      text: "Stop wasting money on ads - here's what actually works in 2024",
      platform: "YouTube",
      niche: "Business",
      tone: "Urgent",
      dateAdded: "5 days ago",
      engagement: { likes: 15670, comments: 890, views: 567000 }
    },
    {
      id: 8,
      text: "I spent $50k learning this - now I'm giving it away for free",
      platform: "Reddit",
      niche: "Business",
      tone: "Emotional",
      dateAdded: "1 week ago",
      engagement: { likes: 7890, comments: 345 }
    },
    {
      id: 9,
      text: "The algorithm doesn't want you to see this content creation hack",
      platform: "Instagram",
      niche: "Tech",
      tone: "Curiosity",
      dateAdded: "1 week ago",
      engagement: { likes: 11234, comments: 678, views: 456000 }
    },
    {
      id: 10,
      text: "Nobody is talking about this life-changing morning routine",
      platform: "YouTube",
      niche: "Health",
      tone: "Curiosity",
      dateAdded: "1 week ago",
      engagement: { likes: 8765, comments: 432, views: 234000 }
    },
    {
      id: 11,
      text: "The secret strategy that made me 100k followers in 6 months",
      platform: "Instagram",
      niche: "Tech",
      tone: "Emotional",
      dateAdded: "2 weeks ago",
      engagement: { likes: 13456, comments: 789, views: 567000 }
    },
    {
      id: 12,
      text: "This one mistake is costing you thousands every month",
      platform: "Reddit",
      niche: "Business",
      tone: "Urgent",
      dateAdded: "2 weeks ago",
      engagement: { likes: 6543, comments: 234 }
    }
  ]);

  const [visibleHooks, setVisibleHooks] = useState(9);

  const fetchHooksFromBackend = async () => {
    try {
      const response = await axios.post(`${API_URL}/reddit/scrape`, null, {
        params: { subreddit: "Business", limit: 5 }
      });
      setAllHooks(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchHooksFromBackend();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      platform: 'all',
      niche: 'all',
      tone: 'all',
      sort: 'newest'
    });
    showToast('Filters reset', 'success');
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleCopy = (hook) => {
    showToast('Hook copied to clipboard!', 'success');
  };

  const handleSave = (hook) => {
    const newSaved = new Set(savedHooks);
    if (newSaved.has(hook.id)) {
      newSaved.delete(hook.id);
      showToast('Hook removed from favorites', 'info');
    } else {
      newSaved.add(hook.id);
      showToast('Hook saved to favorites!', 'success');
    }
    setSavedHooks(newSaved);
  };

  const handleViewSource = (hook) => {
    showToast('Opening source...', 'info');
  };

  const handleRefresh = () => {
    showToast('Refreshing hooks...', 'info');
    fetchHooksFromBackend();
  };

  const handleLoadMore = () => {
    setVisibleHooks(prev => Math.min(prev + 9, filteredHooks.length));
    showToast(`Loaded ${Math.min(9, filteredHooks.length - visibleHooks)} more hooks`, 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Filter hooks
  const filteredHooks = allHooks.filter(hook => {
    const matchesSearch = filters.search === '' ||
      hook.text.toLowerCase().includes(filters.search.toLowerCase()) ||
      hook.niche.toLowerCase().includes(filters.search.toLowerCase()) ||
      hook.tone.toLowerCase().includes(filters.search.toLowerCase());

    const matchesPlatform = filters.platform === 'all' ||
      hook.platform.toLowerCase() === filters.platform.toLowerCase();

    const matchesNiche = filters.niche === 'all' ||
      hook.niche.toLowerCase() === filters.niche.toLowerCase();

    const matchesTone = filters.tone === 'all' ||
      hook.tone.toLowerCase() === filters.tone.toLowerCase();

    return matchesSearch && matchesPlatform && matchesNiche && matchesTone;
  });

  // Sort hooks
  const sortedHooks = [...filteredHooks].sort((a, b) => {
    switch (filters.sort) {
      case 'popular':
        return b.engagement.likes - a.engagement.likes;
      case 'copied':
        return (b.engagement.comments - a.engagement.comments);
      case 'engagement':
        return (b.engagement.likes + b.engagement.comments) - (a.engagement.likes + a.engagement.comments);
      default: // newest
        return b.id - a.id;
    }
  });

  const displayedHooks = sortedHooks.slice(0, visibleHooks);

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

      <Navbar
        onSearch={handleSearch}
        darkMode={darkMode}
        onThemeToggle={() => setDarkMode(!darkMode)}
      />

      {/* Main Container */}
      <div className="pt-20 pb-12">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 mt-8"
          >
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <span className="hero-gradient-text">Hook Explorer</span>
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
          </motion.div>

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
              {displayedHooks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <Sparkles size={64} className="text-gray-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-2">No hooks found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold"
                  >
                    Reset Filters
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedHooks.map((hook, i) => (
                      <motion.div
                        key={hook.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <HookCard
                          hook={hook}
                          onCopy={handleCopy}
                          onSave={handleSave}
                          onViewSource={handleViewSource}
                          isSaved={savedHooks.has(hook.id)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {visibleHooks < sortedHooks.length && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center mt-12"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLoadMore}
                        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/50 neon-glow"
                      >
                        Load More Hooks ({sortedHooks.length - visibleHooks} remaining)
                      </motion.button>
                      <p className="text-gray-500 text-sm mt-4">
                        Showing {displayedHooks.length} of {sortedHooks.length} hooks
                      </p>
                    </motion.div>
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