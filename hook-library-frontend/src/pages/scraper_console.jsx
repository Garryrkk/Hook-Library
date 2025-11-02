import { useState, useRef, useEffect } from 'react';
import { Youtube, MessageSquare, Instagram, Layers, Play, Loader2, Menu, X, Zap } from 'lucide-react';

// ============================================
// COMPLETE SCRAPER CONSOLE - SINGLE FILE DEMO
// ============================================

const ScraperConsole = () => {
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), message: '🔹 Console initialized', type: 'info' }
  ]);
  const [loading, setLoading] = useState({});
  const [platformStatus] = useState({
    youtube: { status: 'active', label: 'Active' },
    reddit: { status: 'active', label: 'Active' },
    instagram: { status: 'warning', label: 'Token Expired' }
  });
  const [autoScrape, setAutoScrape] = useState(false);
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time, message, type }]);
  };

  const handleScrape = async (platform) => {
    setLoading(prev => ({ ...prev, [platform]: true }));
    
    const icons = {
      youtube: '🔴',
      reddit: '🧡',
      instagram: '💜',
      all: '🧩'
    };

    addLog(`${icons[platform]} Starting ${platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)} Scraper...`, 'info');

    try {
      // Simulated API call - replace with your actual FastAPI endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Example for real API integration:
      // const response = await fetch('http://your-api-url/youtube/scrape', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();
      
      const mockResults = Math.floor(Math.random() * 50) + 10;
      addLog(`✅ ${mockResults} posts scraped from ${platform}`, 'success');
      
      // Simulate some additional logs
      if (platform === 'all') {
        setTimeout(() => addLog('🔹 Processing YouTube data...', 'info'), 500);
        setTimeout(() => addLog('🔹 Processing Reddit data...', 'info'), 1000);
        setTimeout(() => addLog('🔹 Processing Instagram data...', 'info'), 1500);
      }
      
    } catch (error) {
      addLog(`❌ Failed to scrape ${platform}: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getLogIcon = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '🔹';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            🧠 Scraper Console
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Trigger backend scrapers and monitor scraping logs in real time.
          </p>
        </div>

        {/* Platform Status Indicators */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(platformStatus).map(([platform, data]) => (
            <div
              key={platform}
              className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-4 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-white text-sm uppercase tracking-wider font-bold">
                  {platform}
                </span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(data.status)} shadow-lg animate-pulse`}></div>
                  <span className="text-gray-400 text-xs">{data.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scraper Controls */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300">
            <h2 className="text-2xl uppercase mb-6 text-white font-bold tracking-wider">
              Scraper Controls
            </h2>

            <div className="space-y-4">
              {/* YouTube Button */}
              <button
                onClick={() => handleScrape('youtube')}
                disabled={loading.youtube}
                className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/50 hover:shadow-purple-500/50 hover:scale-105 uppercase text-sm tracking-wide flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {loading.youtube ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Youtube className="w-5 h-5" />
                )}
                <span>Scrape YouTube</span>
              </button>

              {/* Reddit Button */}
              <button
                onClick={() => handleScrape('reddit')}
                disabled={loading.reddit}
                className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/50 hover:shadow-purple-500/50 hover:scale-105 uppercase text-sm tracking-wide flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {loading.reddit ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MessageSquare className="w-5 h-5" />
                )}
                <span>Scrape Reddit</span>
              </button>

              {/* Instagram Button */}
              <button
                onClick={() => handleScrape('instagram')}
                disabled={loading.instagram}
                className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/50 hover:shadow-purple-500/50 hover:scale-105 uppercase text-sm tracking-wide flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {loading.instagram ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Instagram className="w-5 h-5" />
                )}
                <span>Scrape Instagram</span>
              </button>

              {/* Scrape All Button */}
              <button
                onClick={() => handleScrape('all')}
                disabled={loading.all}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-pink-500/50 hover:scale-105 uppercase text-sm tracking-wide flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-pink-500 font-bold"
              >
                {loading.all ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Layers className="w-5 h-5" />
                )}
                <span>Scrape All Platforms</span>
              </button>
            </div>

            {/* Auto Scrape Toggle */}
            <div className="mt-6 pt-6 border-t border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-sm uppercase mb-1 font-bold">Automation</h3>
                  <p className="text-gray-400 text-xs">Auto scrape every 24h</p>
                </div>
                <button
                  onClick={() => setAutoScrape(!autoScrape)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    autoScrape ? 'bg-pink-500 shadow-lg shadow-pink-500/50' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      autoScrape ? 'transform translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Console Logs */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300">
            <h2 className="text-2xl uppercase mb-6 text-white flex items-center gap-2 font-bold tracking-wider">
              <Play className="w-6 h-6 text-pink-500" />
              Console Output
            </h2>

            <div className="bg-black rounded-xl p-4 h-[500px] overflow-y-auto text-sm border border-purple-500/30">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-2 font-mono ${
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'error' ? 'text-red-500' :
                    log.type === 'warning' ? 'text-yellow-400' :
                    'text-cyan-400'
                  }`}
                >
                  <span className="text-gray-500">[{log.time}]</span>{' '}
                  <span>{getLogIcon(log.type)}</span>{' '}
                  {log.message}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScraperConsole;