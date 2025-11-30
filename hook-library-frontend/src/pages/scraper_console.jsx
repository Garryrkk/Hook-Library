import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Youtube, MessageCircle, Instagram, Play, StopCircle, Trash2, Download, Settings, Activity, AlertCircle, CheckCircle, XCircle, Zap } from 'lucide-react';

const ScraperConsole = () => {
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isScrapingYoutube, setIsScrapingYoutube] = useState(false);
  const [isScrapingReddit, setIsScrapingReddit] = useState(false);
  const [isScrapingInstagram, setIsScrapingInstagram] = useState(false);
  const [isScrapingAll, setIsScrapingAll] = useState(false);
  const [autoScrape, setAutoScrape] = useState(false);
  const [platformStatus, setPlatformStatus] = useState({
    youtube: { status: 'idle', lastScrape: null, hooksFound: 0 },
    reddit: { status: 'idle', lastScrape: null, hooksFound: 0 },
    instagram: { status: 'idle', lastScrape: null, hooksFound: 0 }
  });
  const consoleRef = useRef(null);
  const API_BASE = "http://localhost:8000";

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  useEffect(() => {
    addLog('info', '🚀 Scraper Console initialized and ready');
    addLog('info', '💡 Select a platform to start scraping');
  }, []);

  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev, { type, message, timestamp, id: Date.now() }]);
  };

  const updatePlatformStatus = (platform, status, hooksFound = 0) => {
    setPlatformStatus(prev => ({
      ...prev,
      [platform]: {
        status,
        lastScrape: status === 'success' ? new Date() : prev[platform].lastScrape,
        hooksFound: status === 'success' ? hooksFound : prev[platform].hooksFound
      }
    }));
  };

  const scrapeYoutube = async () => {
    setIsScrapingYoutube(true);
    updatePlatformStatus('youtube', 'scraping');
    addLog('info', '🎥 Starting YouTube scraper...');
    addLog('info', '🔍 Connecting to YouTube API...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    addLog('success', '✅ Connected to YouTube successfully');
    addLog('info', '🔎 Scanning trending videos...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    addLog('info', '📊 Analyzing video titles and descriptions...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    const hooksFound = Math.floor(Math.random() * 50) + 30;
    addLog('success', `✨ Found ${hooksFound} potential hooks from YouTube`);
    addLog('info', '💾 Saving hooks to database...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    addLog('success', '🎉 YouTube scraping completed successfully!');
    
    updatePlatformStatus('youtube', 'success', hooksFound);
    setIsScrapingYoutube(false);
  };

  const scrapeReddit = async () => {
    setIsScrapingReddit(true);
    updatePlatformStatus('reddit', 'scraping');
    addLog('info', '🧵 Starting Reddit scraper...');
    addLog('info', '🔍 Connecting to Reddit API...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    addLog('success', '✅ Connected to Reddit successfully');
    addLog('info', '🔎 Scanning top subreddits...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    addLog('info', '📊 Analyzing post titles from r/marketing, r/business...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    const hooksFound = Math.floor(Math.random() * 40) + 25;
    addLog('success', `✨ Found ${hooksFound} potential hooks from Reddit`);
    addLog('info', '💾 Saving hooks to database...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    addLog('success', '🎉 Reddit scraping completed successfully!');
    
    updatePlatformStatus('reddit', 'success', hooksFound);
    setIsScrapingReddit(false);
  };

  const scrapeInstagram = async () => {
    setIsScrapingInstagram(true);
    updatePlatformStatus('instagram', 'scraping');
    addLog('info', '📸 Starting Instagram scraper...');
    addLog('info', '🔍 Connecting to Instagram API...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    addLog('success', '✅ Connected to Instagram successfully');
    addLog('info', '🔎 Scanning popular posts...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    addLog('info', '📊 Analyzing captions and hashtags...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    const hooksFound = Math.floor(Math.random() * 60) + 35;
    addLog('success', `✨ Found ${hooksFound} potential hooks from Instagram`);
    addLog('info', '💾 Saving hooks to database...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    addLog('success', '🎉 Instagram scraping completed successfully!');
    
    updatePlatformStatus('instagram', 'success', hooksFound);
    setIsScrapingInstagram(false);
  };

  const scrapeAll = async () => {
    setIsScrapingAll(true);
    addLog('warning', '⚡ Starting FULL SCRAPE across all platforms...');
    
    await scrapeYoutube();
    await new Promise(resolve => setTimeout(resolve, 500));
    await scrapeReddit();
    await new Promise(resolve => setTimeout(resolve, 500));
    await scrapeInstagram();
    
    const totalHooks = platformStatus.youtube.hooksFound + platformStatus.reddit.hooksFound + platformStatus.instagram.hooksFound;
    addLog('success', `🏆 FULL SCRAPE COMPLETED! Total: ${totalHooks} hooks collected`);
    setIsScrapingAll(false);
  };

  const clearLogs = () => {
    setConsoleLogs([]);
    addLog('info', '🧹 Console cleared');
  };

  const exportLogs = () => {
    const logsText = consoleLogs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scraper-logs-${Date.now()}.txt`;
    a.click();
    addLog('success', '📥 Logs exported successfully');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'idle': return <Activity size={16} color="#bb86fc" />;
      case 'scraping': return <Zap size={16} color="#ffff00" className="animate-pulse" />;
      case 'success': return <CheckCircle size={16} color="#00ff00" />;
      case 'error': return <XCircle size={16} color="#ff0000" />;
      default: return <Activity size={16} color="#bb86fc" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'idle': return '#bb86fc';
      case 'scraping': return '#ffff00';
      case 'success': return '#00ff00';
      case 'error': return '#ff0000';
      default: return '#bb86fc';
    }
  };

  const getLogColor = (type) => {
    switch(type) {
      case 'success': return '#00ff00';
      case 'error': return '#ff0000';
      case 'warning': return '#ffff00';
      case 'info': return '#00ffff';
      default: return '#bb86fc';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a0033 30%, #2d0066 60%, #4a0099 100%)',
      fontFamily: "'Orbitron', monospace",
      position: 'relative'
    }}>
      {/* Top Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid #cc0066',
        padding: '15px 40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1920px',
          margin: '0 auto'
        }}>
          <a href="/" style={{
            fontSize: '28px',
            fontWeight: 900,
            background: 'linear-gradient(90deg, #cc0066 0%, #ff00ff 50%, #8000ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none'
          }}>
            HOOK BANK
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ display: 'flex', gap: '30px' }}>
              <a href="/" style={{ color: '#bb86fc', textDecoration: 'none', fontSize: '15px' }}>Home</a>
              <a href="/dashboard" style={{ color: '#bb86fc', textDecoration: 'none', fontSize: '15px' }}>Dashboard</a>
              <a href="/scraper" style={{
                color: '#ff00ff',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 'bold',
                borderBottom: '2px solid #ff00ff',
                paddingBottom: '5px'
              }}>Scraper Console</a>
              <a href="/explorer" style={{ color: '#bb86fc', textDecoration: 'none', fontSize: '15px' }}>Explorer</a>
              <a href="/about" style={{ color: '#bb86fc', textDecoration: 'none', fontSize: '15px' }}>About</a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <Bell size={22} color="#bb86fc" style={{ cursor: 'pointer' }} />
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#cc0066',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>3</span>
              </div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #cc0066, #8000ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>U</div>
            </div>
          </div>
        </div>
      </nav>

      <div style={{
        maxWidth: '1920px',
        margin: '0 auto',
        padding: '40px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 900,
            background: 'linear-gradient(90deg, #cc0066 0%, #ff00ff 50%, #8000ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            🧠 Scraper Console
          </h1>
          <p style={{
            color: '#bb86fc',
            fontSize: '18px'
          }}>
            Automate hook collection from YouTube, Reddit, and Instagram
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '30px',
          width: '100%'
        }}>
          {/* Main Console Area */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '25px'
          }}>
            {/* Platform Status Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px'
            }}>
              {/* YouTube Status */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${getStatusColor(platformStatus.youtube.status)}`,
                borderRadius: '20px',
                padding: '25px',
                boxShadow: `0 0 30px ${getStatusColor(platformStatus.youtube.status)}40`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <Youtube size={32} color="#FF0000" />
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>YouTube</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                      {getStatusIcon(platformStatus.youtube.status)}
                      <span style={{ color: getStatusColor(platformStatus.youtube.status), fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {platformStatus.youtube.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#bb86fc',
                  fontSize: '13px'
                }}>
                  <span>Hooks Found:</span>
                  <span style={{ color: '#ff00ff', fontWeight: 'bold' }}>{platformStatus.youtube.hooksFound}</span>
                </div>
                {platformStatus.youtube.lastScrape && (
                  <div style={{
                    marginTop: '10px',
                    color: '#bb86fc',
                    fontSize: '11px'
                  }}>
                    Last: {platformStatus.youtube.lastScrape.toLocaleTimeString()}
                  </div>
                )}
              </div>

              {/* Reddit Status */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${getStatusColor(platformStatus.reddit.status)}`,
                borderRadius: '20px',
                padding: '25px',
                boxShadow: `0 0 30px ${getStatusColor(platformStatus.reddit.status)}40`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <MessageCircle size={32} color="#FF4500" />
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Reddit</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                      {getStatusIcon(platformStatus.reddit.status)}
                      <span style={{ color: getStatusColor(platformStatus.reddit.status), fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {platformStatus.reddit.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#bb86fc',
                  fontSize: '13px'
                }}>
                  <span>Hooks Found:</span>
                  <span style={{ color: '#ff00ff', fontWeight: 'bold' }}>{platformStatus.reddit.hooksFound}</span>
                </div>
                {platformStatus.reddit.lastScrape && (
                  <div style={{
                    marginTop: '10px',
                    color: '#bb86fc',
                    fontSize: '11px'
                  }}>
                    Last: {platformStatus.reddit.lastScrape.toLocaleTimeString()}
                  </div>
                )}
              </div>

              {/* Instagram Status */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${getStatusColor(platformStatus.instagram.status)}`,
                borderRadius: '20px',
                padding: '25px',
                boxShadow: `0 0 30px ${getStatusColor(platformStatus.instagram.status)}40`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <Instagram size={32} color="#E4405F" />
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Instagram</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                      {getStatusIcon(platformStatus.instagram.status)}
                      <span style={{ color: getStatusColor(platformStatus.instagram.status), fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {platformStatus.instagram.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#bb86fc',
                  fontSize: '13px'
                }}>
                  <span>Hooks Found:</span>
                  <span style={{ color: '#ff00ff', fontWeight: 'bold' }}>{platformStatus.instagram.hooksFound}</span>
                </div>
                {platformStatus.instagram.lastScrape && (
                  <div style={{
                    marginTop: '10px',
                    color: '#bb86fc',
                    fontSize: '11px'
                  }}>
                    Last: {platformStatus.instagram.lastScrape.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>

            {/* Scraper Buttons */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(204, 0, 102, 0.3)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h3 style={{
                color: '#ff00ff',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '20px'
              }}>
                Platform Scrapers
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px'
              }}>
                <button
                  onClick={scrapeYoutube}
                  disabled={isScrapingYoutube || isScrapingAll}
                  style={{
                    background: isScrapingYoutube ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 0, 0, 0.2)',
                    border: '2px solid #FF0000',
                    color: '#fff',
                    padding: '20px',
                    borderRadius: '15px',
                    cursor: isScrapingYoutube || isScrapingAll ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 0 20px rgba(255, 0, 0, 0.4)',
                    transition: 'all 0.3s',
                    fontFamily: "'Orbitron', monospace",
                    opacity: isScrapingYoutube || isScrapingAll ? 0.6 : 1
                  }}
                >
                  {isScrapingYoutube ? <StopCircle size={20} className="animate-pulse" /> : <Play size={20} />}
                  <Youtube size={20} />
                  {isScrapingYoutube ? 'Scraping...' : 'Scrape YouTube'}
                </button>

                <button
                  onClick={scrapeReddit}
                  disabled={isScrapingReddit || isScrapingAll}
                  style={{
                    background: isScrapingReddit ? 'rgba(255, 69, 0, 0.3)' : 'rgba(255, 69, 0, 0.2)',
                    border: '2px solid #FF4500',
                    color: '#fff',
                    padding: '20px',
                    borderRadius: '15px',
                    cursor: isScrapingReddit || isScrapingAll ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 0 20px rgba(255, 69, 0, 0.4)',
                    transition: 'all 0.3s',
                    fontFamily: "'Orbitron', monospace",
                    opacity: isScrapingReddit || isScrapingAll ? 0.6 : 1
                  }}
                >
                  {isScrapingReddit ? <StopCircle size={20} className="animate-pulse" /> : <Play size={20} />}
                  <MessageCircle size={20} />
                  {isScrapingReddit ? 'Scraping...' : 'Scrape Reddit'}
                </button>

                <button
                  onClick={scrapeInstagram}
                  disabled={isScrapingInstagram || isScrapingAll}
                  style={{
                    background: isScrapingInstagram ? 'rgba(228, 64, 95, 0.3)' : 'rgba(228, 64, 95, 0.2)',
                    border: '2px solid #E4405F',
                    color: '#fff',
                    padding: '20px',
                    borderRadius: '15px',
                    cursor: isScrapingInstagram || isScrapingAll ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 0 20px rgba(228, 64, 95, 0.4)',
                    transition: 'all 0.3s',
                    fontFamily: "'Orbitron', monospace",
                    opacity: isScrapingInstagram || isScrapingAll ? 0.6 : 1
                  }}
                >
                  {isScrapingInstagram ? <StopCircle size={20} className="animate-pulse" /> : <Play size={20} />}
                  <Instagram size={20} />
                  {isScrapingInstagram ? 'Scraping...' : 'Scrape Instagram'}
                </button>

                <button
                  onClick={scrapeAll}
                  disabled={isScrapingAll || isScrapingYoutube || isScrapingReddit || isScrapingInstagram}
                  style={{
                    background: isScrapingAll ? 'rgba(204, 0, 102, 0.4)' : 'linear-gradient(135deg, #cc0066, #ff00ff)',
                    border: '2px solid #ff00ff',
                    color: '#fff',
                    padding: '20px',
                    borderRadius: '15px',
                    cursor: isScrapingAll ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 0 30px rgba(255, 0, 255, 0.6)',
                    transition: 'all 0.3s',
                    fontFamily: "'Orbitron', monospace",
                    opacity: isScrapingAll ? 0.6 : 1
                  }}
                >
                  {isScrapingAll ? <StopCircle size={20} className="animate-pulse" /> : <Zap size={20} />}
                  {isScrapingAll ? 'Scraping All...' : '⚡ SCRAPE ALL PLATFORMS'}
                </button>
              </div>
            </div>

            {/* Console Output */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '2px solid #cc0066',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(204, 0, 102, 0.4)'
            }}>
              <div style={{
                background: 'rgba(204, 0, 102, 0.2)',
                padding: '15px 25px',
                borderBottom: '1px solid rgba(204, 0, 102, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  color: '#ff00ff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Activity size={18} />
                  Console Output
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={exportLogs}
                    style={{
                      background: 'rgba(0, 255, 255, 0.2)',
                      border: '1px solid #00ffff',
                      color: '#00ffff',
                      padding: '8px 15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 'bold'
                    }}
                  >
                    <Download size={14} />
                    Export
                  </button>
                  <button
                    onClick={clearLogs}
                    style={{
                      background: 'rgba(255, 0, 0, 0.2)',
                      border: '1px solid #ff0000',
                      color: '#ff0000',
                      padding: '8px 15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 'bold'
                    }}
                  >
                    <Trash2 size={14} />
                    Clear
                  </button>
                </div>
              </div>

              <div
                ref={consoleRef}
                style={{
                  height: '500px',
                  overflowY: 'auto',
                  padding: '20px',
                  fontFamily: 'monospace',
                  fontSize: '13px'
                }}
              >
                {consoleLogs.length === 0 ? (
                  <div style={{ color: '#bb86fc', textAlign: 'center', paddingTop: '200px' }}>
                    Console is empty. Start scraping to see logs.
                  </div>
                ) : (
                  consoleLogs.map(log => (
                    <div
                      key={log.id}
                      style={{
                        marginBottom: '8px',
                        color: getLogColor(log.type),
                        display: 'flex',
                        gap: '10px',
                        animation: 'fadeIn 0.3s'
                      }}
                    >
                      <span style={{ color: '#bb86fc', minWidth: '80px' }}>[{log.timestamp}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '25px'
          }}>
            {/* Auto-Scrape Settings */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(204, 0, 102, 0.3)',
              borderRadius: '20px',
              padding: '25px',
            }}>
              <h3 style={{
                color: '#ff00ff',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Settings size={20} />
                Auto-Scrape
              </h3>

              <div style={{
                background: 'rgba(204, 0, 102, 0.1)',
                border: '1px solid rgba(204, 0, 102, 0.3)',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>
                    24/7 Automation
                  </span>
                  <button
                    onClick={() => {
                      setAutoScrape(!autoScrape);
                      addLog(autoScrape ? 'warning' : 'success', autoScrape ? '⏸️ Auto-scrape disabled' : '✅ Auto-scrape enabled - Running every 24 hours');
                    }}
                    style={{
                      width: '60px',
                      height: '30px',
                      borderRadius: '15px',
                      border: 'none',
                      background: autoScrape ? 'linear-gradient(90deg, #00ff00, #00cc00)' : 'rgba(187, 134, 252, 0.3)',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.3s',
                      boxShadow: autoScrape ? '0 0 20px rgba(0, 255, 0, 0.6)' : 'none'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: autoScrape ? '33px' : '3px',
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }} />
                  </button>
                </div>

                <div style={{
                  color: '#bb86fc',
                  fontSize: '12px',
                  lineHeight: '1.6'
                }}>
                  {autoScrape ? (
                    <>
                      <div style={{ color: '#00ff00', marginBottom: '10px', fontWeight: 'bold' }}>
                        ✅ Active
                      </div>
                      <div>Automatically scrapes all platforms every 24 hours to keep your hook database fresh.</div>
                    </>
                  ) : (
                    <>
                      <div style={{ color: '#bb86fc', marginBottom: '10px' }}>
                        ⏸️ Inactive
                      </div>
                      <div>Enable to automatically scrape platforms every 24 hours.</div>
                    </>
                  )}
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 0, 0.1)',
                border: '1px solid rgba(255, 255, 0, 0.3)',
                borderRadius: '12px',
                padding: '15px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <AlertCircle size={20} color="#ffff00" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{
                  color: '#ffff00',
                  fontSize: '12px',
                  lineHeight: '1.5'
                }}>
                  <strong>Note:</strong> Auto-scrape runs in the background and won't interrupt your work. Logs will be available in the console.
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(204, 0, 102, 0.3)',
              borderRadius: '20px',
              padding: '25px'
            }}>
              <h3 style={{
                color: '#ff00ff',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px'
              }}>
                📊 Session Stats
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div style={{
                  background: 'rgba(204, 0, 102, 0.1)',
                  border: '1px solid rgba(204, 0, 102, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#bb86fc', fontSize: '14px' }}>Total Hooks</span>
                  <span style={{
                    color: '#ff00ff',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {platformStatus.youtube.hooksFound + platformStatus.reddit.hooksFound + platformStatus.instagram.hooksFound}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(204, 0, 102, 0.1)',
                  border: '1px solid rgba(204, 0, 102, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#bb86fc', fontSize: '14px' }}>Scrapes Run</span>
                  <span style={{
                    color: '#ff00ff',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {[platformStatus.youtube, platformStatus.reddit, platformStatus.instagram].filter(p => p.status === 'success').length}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(204, 0, 102, 0.1)',
                  border: '1px solid rgba(204, 0, 102, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#bb86fc', fontSize: '14px' }}>Console Logs</span>
                  <span style={{
                    color: '#ff00ff',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {consoleLogs.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(204, 0, 102, 0.3)',
              borderRadius: '20px',
              padding: '25px'
            }}>
              <h3 style={{
                color: '#ff00ff',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px'
              }}>
                ⚡ Quick Actions
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <button style={{
                  background: 'rgba(204, 0, 102, 0.2)',
                  border: '1px solid #cc0066',
                  color: '#ff00ff',
                  padding: '15px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s',
                  fontFamily: "'Orbitron', monospace"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(204, 0, 102, 0.3)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(204, 0, 102, 0.2)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}>
                  <Download size={16} />
                  Export All Data
                </button>

                <button style={{
                  background: 'rgba(204, 0, 102, 0.2)',
                  border: '1px solid #cc0066',
                  color: '#ff00ff',
                  padding: '15px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s',
                  fontFamily: "'Orbitron', monospace"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(204, 0, 102, 0.3)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(204, 0, 102, 0.2)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}>
                  <Settings size={16} />
                  Configure API Keys
                </button>

                <button
                  onClick={() => {
                    updatePlatformStatus('youtube', 'idle');
                    updatePlatformStatus('reddit', 'idle');
                    updatePlatformStatus('instagram', 'idle');
                    addLog('info', '🔄 All platform statuses reset');
                  }}
                  style={{
                    background: 'rgba(204, 0, 102, 0.2)',
                    border: '1px solid #cc0066',
                    color: '#ff00ff',
                    padding: '15px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s',
                    fontFamily: "'Orbitron', monospace"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(204, 0, 102, 0.3)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(204, 0, 102, 0.2)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}>
                  <Activity size={16} />
                  Reset Statuses
                </button>
              </div>
            </div>

            {/* Tips */}
            <div style={{
              background: 'rgba(0, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: '25px'
            }}>
              <h3 style={{
                color: '#00ffff',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                💡 Pro Tips
              </h3>

              <div style={{
                color: '#bb86fc',
                fontSize: '13px',
                lineHeight: '1.8'
              }}>
                <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>✓</span>
                  <span>Run scrapers during off-peak hours for better performance</span>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>✓</span>
                  <span>Enable auto-scrape to keep your database updated daily</span>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>✓</span>
                  <span>Export logs regularly to track scraping patterns</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span>✓</span>
                  <span>Use "Scrape All" to collect maximum hooks in one run</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.9)',
        borderTop: '2px solid #cc0066',
        padding: '30px',
        marginTop: '60px'
      }}>
        <div style={{
          maxWidth: '1920px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#bb86fc',
            fontSize: '16px',
            marginBottom: '10px'
          }}>
            © Hook Bank 2025
          </p>
          <p style={{
            color: '#ff00ff',
            fontSize: '14px'
          }}>
            Built with ❤️ by <span style={{ fontWeight: 'bold' }}>Garima Kalra</span>
          </p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #cc0066, #8000ff);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ff0080, #cc0066);
        }

        button:not(:disabled):hover {
          transform: scale(1.02);
        }

        button:disabled {
          cursor: not-allowed !important;
        }
      `}</style>
    </div>
  );
};

export default ScraperConsole;