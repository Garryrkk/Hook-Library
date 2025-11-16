// Get React and hooks from global scope
const { useState, useEffect } = React;
const { motion, AnimatePresence } = window.Motion;

// All your icon components exactly as they appear in the app
const Search = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const Menu = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const X = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Youtube = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const Camera = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const Mail = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const Mic = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

const Video = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const Pen = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const Copy = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const Heart = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Bell = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const User = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Sparkles = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

const TrendingUp = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const Clock = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Check = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertCircle = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const Loader = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className + " animate-spin"}>
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

const Sun = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const Moon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Terminal = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const Trash2 = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const RefreshCw = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const BarChart3 = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18" />
    <rect x="7" y="10" width="3" height="9" />
    <rect x="14" y="5" width="3" height="14" />
  </svg>
);

const ExternalLink = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ChevronDown = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Filter = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const Settings = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
  </svg>
);

const ChevronUp = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

// ============================================
// NAVBAR COMPONENT
// ============================================
const Navbar = ({ currentPage, onNavigate, darkMode, onThemeToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-lg shadow-lg shadow-purple-500/10' : 'bg-[#0a0a0f]/50 backdrop-blur-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="hero-gradient-text text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Hook Bank
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('home')}
              className={`transition-colors ${currentPage === 'home' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`transition-colors ${currentPage === 'dashboard' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate('explorer')}
              className={`transition-colors ${currentPage === 'explorer' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
            >
              Explorer
            </button>
            <button 
              onClick={() => onNavigate('scraper')}
              className={`transition-colors flex items-center space-x-2 ${currentPage === 'scraper' ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`}
            >
              <Terminal size={16} />
              <span>Scraper</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors relative">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            </button>
            <button 
              onClick={onThemeToggle}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors" 
            >
              {darkMode ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-400" />}
            </button>
            <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-lg rounded-lg mt-2 p-4 space-y-3 mb-4">
            <button onClick={() => { onNavigate('home'); setMobileOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">Home</button>
            <button onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">Dashboard</button>
            <button onClick={() => { onNavigate('explorer'); setMobileOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">Explorer</button>
            <button onClick={() => { onNavigate('scraper'); setMobileOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2 flex items-center space-x-2">
              <Terminal size={16} />
              <span>Scraper Console</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// ============================================
// HERO COMPONENT
// ============================================
const Hero = ({ onExplore }) => {
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
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1, y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
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
        <h1 className="hero-gradient-text text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Hook Bank
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-4">Find hooks that go viral</p>
        <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Discover, analyze, and remix viral hooks from YouTube, Reddit, and Instagram.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={() => onExplore('dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold text-lg shadow-lg"
          >
            Explore Dashboard
          </button>
          <button
            onClick={() => onExplore('scraper')}
            className="px-8 py-4 border-2 border-purple-500 text-white rounded-lg font-semibold text-lg hover:bg-purple-500/10"
          >
            Scraper Console
          </button>
        </div>
        <p className="text-sm text-gray-500">No login required • Free • 1000+ hooks</p>
      </div>
    </section>
  );
};

// ============================================
// STATS BAR
// ============================================
const StatsBar = () => {
  const stats = [
    { icon: Sparkles, label: 'Hooks in DB', value: '1,247', color: 'from-pink-500 to-purple-500' },
    { icon: TrendingUp, label: 'Platforms', value: '3', color: 'from-purple-500 to-blue-500' },
    { icon: Clock, label: 'Last Updated', value: 'Just now', color: 'from-blue-500 to-pink-500' }
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gradient-to-br from-[#1a0a2e]/50 to-[#0a0a0f]/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 flex items-center space-x-4">
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// HOOK CARD
// ============================================
const HookCard = ({ hook, onCopy, onFavorite }) => {
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hook.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  return (
    <div className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 group">
      <div className="flex items-start justify-between mb-4">
        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
          {hook.platform}
        </span>
        <div className="flex space-x-2">
          <button onClick={handleCopy} className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
          </button>
          <button onClick={() => { setFavorited(!favorited); onFavorite?.(); }} className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
            <Heart size={16} className={favorited ? 'text-pink-400 fill-pink-400' : 'text-gray-400'} />
          </button>
        </div>
      </div>
      <p className="text-white text-lg mb-4 line-clamp-3 group-hover:text-pink-300 transition-colors">"{hook.text}"</p>
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-pink-500/10 text-pink-300 rounded text-xs">{hook.tone}</span>
        <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs">{hook.niche}</span>
      </div>
    </div>
  );
};

// ============================================
// SCRAPER CONSOLE PAGE
// ============================================
const ScraperConsolePage = ({ onShowToast }) => {
  const [logs, setLogs] = useState([
    { type: 'success', message: 'System initialized', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [loading, setLoading] = useState({});
  const [stats, setStats] = useState({
    totalScraped: 0,
    youtube: 0,
    reddit: 0,
    instagram: 0,
    lastScrape: 'Never'
  });

  const addLog = (type, message) => {
    const newLog = { 
      type, 
      message, 
      timestamp: new Date().toLocaleTimeString() 
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleScrape = (platform) => {
    setLoading(prev => ({ ...prev, [platform]: true }));
    addLog('info', `🚀 Starting ${platform} scrape...`);
    
    setTimeout(() => {
      const scraped = Math.floor(Math.random() * 50) + 20;
      addLog('success', `✅ ${platform} scrape completed! Found ${scraped} new hooks`);
      setStats(prev => ({
        ...prev,
        totalScraped: prev.totalScraped + scraped,
        [platform.toLowerCase()]: prev[platform.toLowerCase()] + scraped,
        lastScrape: new Date().toLocaleTimeString()
      }));
      setLoading(prev => ({ ...prev, [platform]: false }));
      onShowToast(`${platform} scraped successfully!`, 'success');
    }, 2500);
  };

  const handleScrapeAll = () => {
    addLog('info', '🔥 Starting full platform scrape...');
    ['YouTube', 'Reddit', 'Instagram'].forEach((platform, i) => {
      setTimeout(() => handleScrape(platform), i * 3000);
    });
  };

  const clearLogs = () => {
    setLogs([{ type: 'success', message: 'Logs cleared', timestamp: new Date().toLocaleTimeString() }]);
    onShowToast('Logs cleared', 'info');
  };

  const resetStats = () => {
    setStats({
      totalScraped: 0,
      youtube: 0,
      reddit: 0,
      instagram: 0,
      lastScrape: 'Never'
    });
    addLog('info', '🔄 Stats reset');
    onShowToast('Stats reset', 'info');
  };

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <span className="hero-gradient-text">Scraper Console</span>
          </h1>
          <p className="text-xl text-gray-400">
            Automated hook extraction from multiple platforms
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1a0a2e]/50 to-[#0a0a0f]/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles size={20} className="text-pink-400" />
              <span className="text-gray-400 text-sm">Total</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalScraped}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#1a0a2e]/50 to-[#0a0a0f]/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Youtube size={20} className="text-red-400" />
              <span className="text-gray-400 text-sm">YouTube</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.youtube}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#1a0a2e]/50 to-[#0a0a0f]/50 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Camera size={20} className="text-orange-400" />
              <span className="text-gray-400 text-sm">Reddit</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.reddit}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#1a0a2e]/50 to-[#0a0a0f]/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Camera size={20} className="text-purple-400" />
              <span className="text-gray-400 text-sm">Instagram</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.instagram}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#1a0a2e]/50 to-[#0a0a0f]/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Clock size={20} className="text-blue-400" />
              <span className="text-gray-400 text-sm">Last</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.lastScrape}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="bg-[#1a0a2e]/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Terminal size={20} className="text-pink-400" />
                <span>Control Panel</span>
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleScrapeAll}
                  disabled={Object.values(loading).some(v => v)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <Sparkles size={16} />
                  <span>Scrape All</span>
                </button>

                <div className="h-px bg-purple-500/30 my-4" />

                <button
                  onClick={() => handleScrape('YouTube')}
                  disabled={loading.YouTube}
                  className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 transition-all"
                >
                  {loading.YouTube ? <Loader size={16} className="animate-spin" /> : <Youtube size={16} />}
                  <span>YouTube</span>
                </button>

                <button
                  onClick={() => handleScrape('Reddit')}
                  disabled={loading.Reddit}
                  className="w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 transition-all"
                >
                  {loading.Reddit ? <Loader size={16} className="animate-spin" /> : <Camera size={16} />}
                  <span>Reddit</span>
                </button>

                <button
                  onClick={() => handleScrape('Instagram')}
                  disabled={loading.Instagram}
                  className="w-full px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 transition-all"
                >
                  {loading.Instagram ? <Loader size={16} className="animate-spin" /> : <Camera size={16} />}
                  <span>Instagram</span>
                </button>
              </div>
            </div>

            <div className="bg-[#1a0a2e]/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={clearLogs}
                  className="w-full px-4 py-2 border border-purple-500/50 text-white rounded-lg text-sm hover:bg-purple-500/10 transition-all flex items-center justify-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Clear Logs</span>
                </button>
                <button
                  onClick={resetStats}
                  className="w-full px-4 py-2 border border-purple-500/50 text-white rounded-lg text-sm hover:bg-purple-500/10 transition-all flex items-center justify-center space-x-2"
                >
                  <RefreshCw size={14} />
                  <span>Reset Stats</span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#1a0a2e]/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <BarChart3 size={20} className="text-green-400" />
                  <span>Console Output</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400">Live</span>
                </div>
              </div>

              <div className="flex-1 bg-black/50 rounded-lg p-4 overflow-y-auto font-mono text-sm">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-2 flex items-start space-x-2 ${
                      log.type === 'success' ? 'text-green-400' : 
                      log.type === 'error' ? 'text-red-400' : 
                      log.type === 'info' ? 'text-blue-400' : 
                      'text-yellow-400'
                    }`}
                  >
                    <span className="text-gray-500 text-xs whitespace-nowrap">[{log.timestamp}]</span>
                    <span className="break-words">{log.message}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-purple-500/30">
                <p className="text-xs text-gray-400">
                  {logs.length} log entries • Last update: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
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
    success: <Check size={20} className="text-green-400" />,
    error: <AlertCircle size={20} className="text-red-400" />,
    info: <Sparkles size={20} className="text-blue-400" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border border-purple-500/50 rounded-xl px-6 py-4 shadow-2xl"
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
// FOOTER
// ============================================
const Footer = () => {
  return (
    <footer className="border-t border-pink-500/30 bg-[#0a0a0f] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="hero-gradient-text text-2xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>Hook Bank</div>
            <p className="text-gray-400 text-sm">Viral Hook Library</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Links</h4>
            <div className="space-y-2">
              <button className="block text-gray-400 hover:text-white text-sm">Dashboard</button>
              <button className="block text-gray-400 hover:text-white text-sm">Explorer</button>
              <button className="block text-gray-400 hover:text-white text-sm">Scraper</button>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <div className="space-y-2">
              <button className="block text-gray-400 hover:text-white text-sm">Privacy</button>
              <button className="block text-gray-400 hover:text-white text-sm">Terms</button>
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
// MAIN APP
// ============================================
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState(null);

  const sampleHooks = [
    { id: 1, text: "How I made $10k in 30 days with this simple trick nobody talks about", platform: "YouTube", tone: "motivational", niche: "business" },
    { id: 2, text: "This Reddit comment changed my entire perspective on productivity", platform: "Reddit", tone: "educational", niche: "productivity" },
    { id: 3, text: "The brutal truth about fitness that trainers won't tell you", platform: "Instagram", tone: "shock", niche: "fitness" },
    { id: 4, text: "I analyzed 1000 viral videos and found these 3 patterns", platform: "YouTube", tone: "educational", niche: "content" },
    { id: 5, text: "Why everyone is quitting their 9-5 for this side hustle", platform: "Reddit", tone: "curiosity", niche: "business" },
    { id: 6, text: "The one mindset shift that millionaires use daily", platform: "Instagram", tone: "motivational", niche: "mindset" }
  ];

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onThemeToggle={() => setDarkMode(!darkMode)}
      />

      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Hero onExplore={handleNavigate} />
            <StatsBar />
            
            <section className="py-16 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  <span className="hero-gradient-text">Trending Hooks</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleHooks.map((hook) => (
                    <HookCard 
                      key={hook.id} 
                      hook={hook} 
                      onCopy={() => showToast('Hook copied!', 'success')}
                      onFavorite={() => showToast('Added to favorites!', 'success')}
                    />
                  ))}
                </div>
                <div className="text-center mt-12">
                  <button 
                    onClick={() => handleNavigate('explorer')} 
                    className="px-8 py-3 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    View All Hooks
                  </button>
                </div>
              </div>
            </section>

            <Footer />
          </motion.div>
        )}

        {currentPage === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="pt-24 pb-12 px-4 min-h-screen">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    <span className="hero-gradient-text">Dashboard</span>
                  </h1>
                  <p className="text-xl text-gray-400">Manage and analyze high-performing hooks</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                  <div className="bg-[#1a0a2e]/50 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <Sparkles size={24} className="text-pink-400" />
                      <span className="text-gray-400">Total Hooks</span>
                    </div>
                    <p className="text-3xl font-bold text-white">1,247</p>
                  </div>
                  <div className="bg-[#1a0a2e]/50 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <Heart size={24} className="text-pink-400" />
                      <span className="text-gray-400">Saved</span>
                    </div>
                    <p className="text-3xl font-bold text-white">128</p>
                  </div>
                  <div className="bg-[#1a0a2e]/50 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <TrendingUp size={24} className="text-green-400" />
                      <span className="text-gray-400">Platforms</span>
                    </div>
                    <p className="text-3xl font-bold text-white">3</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleHooks.map((hook) => (
                    <HookCard 
                      key={hook.id} 
                      hook={hook}
                      onCopy={() => showToast('Hook copied!', 'success')}
                      onFavorite={() => showToast('Added to favorites!', 'success')}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Footer />
          </motion.div>
        )}

        {currentPage === 'explorer' && (
          <motion.div key="explorer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="pt-24 pb-12 px-4 min-h-screen">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    <span className="hero-gradient-text">Hook Explorer</span>
                  </h1>
                  <p className="text-xl text-gray-400">Your AI library for viral hooks</p>
                </div>

                <div className="mb-8">
                  <div className="relative max-w-2xl mx-auto">
                    <input
                      type="text"
                      placeholder="Search hooks..."
                      className="w-full px-6 py-4 pr-12 bg-[#1a0a2e]/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] rounded-lg">
                      <Search size={20} className="text-white" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleHooks.map((hook) => (
                    <HookCard 
                      key={hook.id} 
                      hook={hook}
                      onCopy={() => showToast('Hook copied!', 'success')}
                      onFavorite={() => showToast('Added to favorites!', 'success')}
                    />
                  ))}
                </div>

                <div className="text-center mt-12">
                  <button 
                    onClick={() => showToast('Loading more hooks...', 'info')}
                    className="px-8 py-3 bg-gradient-to-r from-[#ff4b8b] to-[#8b5cf6] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Load More
                  </button>
                </div>
              </div>
            </div>
            <Footer />
          </motion.div>
        )}

        {currentPage === 'scraper' && (
          <motion.div key="scraper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScraperConsolePage onShowToast={showToast} />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);