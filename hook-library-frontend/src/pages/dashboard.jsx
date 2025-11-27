import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X, Settings, Youtube, MessageCircle, Instagram, Heart, Copy, Eye, TrendingUp, RefreshCw, Brain, ChevronLeft, ChevronRight, Github, Linkedin, Check, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [activePlatform, setActivePlatform] = useState('All');
  const [activeNiche, setActiveNiche] = useState('All');
  const [activeTone, setActiveTone] = useState('All');
  const [savedHooks, setSavedHooks] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const stats = [
    { label: 'Total Hooks', value: '1,245', icon: TrendingUp, emoji: '📈' },
    { label: 'YouTube Hooks', value: '420', icon: Youtube, emoji: '▶️' },
    { label: 'Reddit Hooks', value: '360', icon: MessageCircle, emoji: '🧵' },
    { label: 'Instagram Hooks', value: '465', icon: Instagram, emoji: '📸' },
    { label: 'Saved Hooks', value: '128', icon: Heart, emoji: '❤️' },
  ];

  const hooks = [
    { id: 1, platform: 'youtube', text: '5 mistakes killing your productivity (and how to fix them)', niche: 'Business', tone: 'Curiosity', likes: 1240, comments: 89, date: '2 days ago' },
    { id: 2, platform: 'reddit', text: 'I tried every productivity hack for 30 days. Here\'s what actually worked.', niche: 'Productivity', tone: 'Data', likes: 890, comments: 156, date: '1 day ago' },
    { id: 3, platform: 'instagram', text: 'Stop doing cardio. Here\'s why strength training changed everything.', niche: 'Fitness', tone: 'Fear', likes: 2340, comments: 234, date: '5 hours ago' },
    { id: 4, platform: 'youtube', text: 'The psychology trick that made me $100K in 6 months', niche: 'Marketing', tone: 'Curiosity', likes: 3450, comments: 421, date: '1 week ago' },
    { id: 5, platform: 'reddit', text: 'My company went from 0 to 1M users. Here are the 7 things we did right.', niche: 'Business', tone: 'Data', likes: 1890, comments: 312, date: '3 days ago' },
    { id: 6, platform: 'instagram', text: 'You\'re doing push-ups wrong. This one change doubled my results.', niche: 'Fitness', tone: 'Curiosity', likes: 1560, comments: 178, date: '12 hours ago' },
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToastNotification('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSave = (id) => {
    const newSaved = new Set(savedHooks);
    if (newSaved.has(id)) {
      newSaved.delete(id);
      showToastNotification('Removed from saved', 'info');
    } else {
      newSaved.add(id);
      showToastNotification('Saved successfully!', 'success');
    }
    setSavedHooks(newSaved);
  };

  const showToastNotification = (message, type) => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const scrapeData = (platform) => {
    const timestamp = new Date().toLocaleTimeString();
    const messages = [
      `[${timestamp}] 🚀 Starting ${platform} scraper...`,
      `[${timestamp}] 🔍 Scanning trending content...`,
      `[${timestamp}] ✅ Found 45 new hooks from ${platform}`,
      `[${timestamp}] 💾 Saved to database successfully!`
    ];
    
    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setConsoleLogs(prev => [...prev, msg]);
      }, idx * 800);
    });
  };

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'youtube': return <Youtube size={16} />;
      case 'reddit': return <MessageCircle size={16} />;
      case 'instagram': return <Instagram size={16} />;
      default: return null;
    }
  };

  const getPlatformColor = (platform) => {
    switch(platform) {
      case 'youtube': return '#FF0000';
      case 'reddit': return '#FF4500';
      case 'instagram': return '#E4405F';
      default: return '#cc0066';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a0033 30%, #2d0066 60%, #4a0099 100%)',
      fontFamily: "'Orbitron', monospace",
      position: 'relative',
      overflow: 'auto'
    }}>
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.9)',
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

      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(204, 0, 102, 0.3)',
        padding: '15px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: 'none',
            border: 'none',
            color: '#cc0066',
            cursor: 'pointer'
          }}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <a href="/" style={{
            fontSize: '24px',
            fontWeight: 900,
            background: 'linear-gradient(90deg, #cc0066 0%, #ff00ff 50%, #8000ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none'
          }}>
            HOOK BANK
          </a>

          <div style={{ display: 'flex', gap: '25px' }}>
            {['Home', 'Dashboard', 'Scraper', 'Explore', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                color: '#bb86fc',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s'
              }}>
                {item}
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Search size={20} color="#bb86fc" style={{ cursor: 'pointer' }} />
          <div style={{ position: 'relative' }}>
            <Bell size={20} color="#bb86fc" style={{ cursor: 'pointer' }} />
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#cc0066',
              color: '#fff',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>3</span>
          </div>
          <div style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #cc0066, #8000ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>U</div>
        </div>
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <aside style={{
            width: '280px',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(204, 0, 102, 0.3)',
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '25px'
          }}>
            <div style={{
              background: 'rgba(204, 0, 102, 0.1)',
              border: '1px solid rgba(204, 0, 102, 0.3)',
              borderRadius: '12px',
              padding: '15px',
              color: '#bb86fc',
              fontSize: '16px'
            }}>
              Hey, User 👋
            </div>

            <div>
              <h4 style={{ color: '#cc0066', fontSize: '14px', marginBottom: '10px' }}>Platform</h4>
              {['All', 'YouTube', 'Reddit', 'Instagram'].map(plat => (
                <button key={plat} onClick={() => setActivePlatform(plat)} style={{
                  display: 'block',
                  width: '100%',
                  background: activePlatform === plat ? 'rgba(204, 0, 102, 0.2)' : 'transparent',
                  border: activePlatform === plat ? '1px solid #cc0066' : '1px solid transparent',
                  color: activePlatform === plat ? '#ff00ff' : '#bb86fc',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontSize: '13px',
                  textAlign: 'left',
                  transition: 'all 0.3s'
                }}>
                  {plat}
                </button>
              ))}
            </div>

            <div>
              <h4 style={{ color: '#cc0066', fontSize: '14px', marginBottom: '10px' }}>Niche</h4>
              {['All', 'Marketing', 'Fitness', 'Tech', 'Business', 'Motivation'].map(niche => (
                <button key={niche} onClick={() => setActiveNiche(niche)} style={{
                  display: 'block',
                  width: '100%',
                  background: activeNiche === niche ? 'rgba(204, 0, 102, 0.2)' : 'transparent',
                  border: activeNiche === niche ? '1px solid #cc0066' : '1px solid transparent',
                  color: activeNiche === niche ? '#ff00ff' : '#bb86fc',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontSize: '13px',
                  textAlign: 'left',
                  transition: 'all 0.3s'
                }}>
                  {niche}
                </button>
              ))}
            </div>

            <div>
              <h4 style={{ color: '#cc0066', fontSize: '14px', marginBottom: '10px' }}>Tone</h4>
              {['All', 'Emotional', 'Funny', 'Fear', 'Curiosity', 'Data'].map(tone => (
                <button key={tone} onClick={() => setActiveTone(tone)} style={{
                  display: 'block',
                  width: '100%',
                  background: activeTone === tone ? 'rgba(204, 0, 102, 0.2)' : 'transparent',
                  border: activeTone === tone ? '1px solid #cc0066' : '1px solid transparent',
                  color: activeTone === tone ? '#ff00ff' : '#bb86fc',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontSize: '13px',
                  textAlign: 'left',
                  transition: 'all 0.3s'
                }}>
                  {tone}
                </button>
              ))}
            </div>

            <button style={{
              background: 'rgba(204, 0, 102, 0.2)',
              border: '1px solid #cc0066',
              color: '#ff00ff',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'center',
              marginTop: 'auto'
            }}>
              <Heart size={16} /> Saved Hooks
            </button>

            <button style={{
              background: 'transparent',
              border: '1px solid rgba(204, 0, 102, 0.3)',
              color: '#bb86fc',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'center'
            }}>
              <Settings size={16} /> Settings
            </button>
          </aside>
        )}

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '40px',
          overflow: 'auto'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 900,
              background: 'linear-gradient(90deg, #cc0066 0%, #ff00ff 50%, #8000ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px'
            }}>
              Dashboard – Hook Control Center
            </h1>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 2000);
                showToastNotification('Scraping all platforms...', 'info');
              }} style={{
                background: 'rgba(204, 0, 102, 0.2)',
                border: '2px solid #cc0066',
                color: '#ff00ff',
                padding: '12px 25px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 'bold',
                boxShadow: '0 0 15px rgba(204, 0, 102, 0.3)'
              }}>
                <Brain size={18} /> Scrape All Platforms
              </button>

              <button style={{
                background: 'rgba(204, 0, 102, 0.2)',
                border: '2px solid #cc0066',
                color: '#ff00ff',
                padding: '12px 25px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 'bold',
                boxShadow: '0 0 15px rgba(204, 0, 102, 0.3)'
              }}>
                <RefreshCw size={18} /> Refresh Data
              </button>

              <button style={{
                background: 'rgba(204, 0, 102, 0.2)',
                border: '2px solid #cc0066',
                color: '#ff00ff',
                padding: '12px 25px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 'bold',
                boxShadow: '0 0 15px rgba(204, 0, 102, 0.3)'
              }}>
                <TrendingUp size={18} /> Analyze Trends
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(204, 0, 102, 0.3)',
                borderRadius: '15px',
                padding: '25px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px) rotateX(5deg)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(204, 0, 102, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) rotateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{stat.emoji}</div>
                <div style={{ color: '#bb86fc', fontSize: '14px', marginBottom: '5px' }}>{stat.label}</div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  background: 'linear-gradient(90deg, #cc0066, #ff00ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Platform Tabs */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '30px',
            borderBottom: '2px solid rgba(204, 0, 102, 0.2)',
            position: 'relative'
          }}>
            {[
              { id: 'all', label: '⭐ All' },
              { id: 'youtube', label: '🎥 YouTube' },
              { id: 'reddit', label: '🧵 Reddit' },
              { id: 'instagram', label: '📸 Instagram' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? '#ff00ff' : '#bb86fc',
                padding: '15px 25px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                position: 'relative',
                transition: 'color 0.3s',
                borderBottom: activeTab === tab.id ? '3px solid #cc0066' : 'none',
                boxShadow: activeTab === tab.id ? '0 0 20px rgba(204, 0, 102, 0.5)' : 'none'
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Hooks Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
          }}>
            {hooks.map(hook => (
              <div key={hook.id} style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(204, 0, 102, 0.3)',
                borderRadius: '15px',
                padding: '20px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(204, 0, 102, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div style={{
                    background: getPlatformColor(hook.platform),
                    color: '#fff',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 'bold'
                  }}>
                    {getPlatformIcon(hook.platform)}
                    {hook.platform.toUpperCase()}
                  </div>
                  <div style={{
                    background: 'rgba(187, 134, 252, 0.2)',
                    color: '#bb86fc',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {hook.niche}
                  </div>
                  <div style={{
                    background: 'rgba(204, 0, 102, 0.2)',
                    color: '#ff00ff',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {hook.tone}
                  </div>
                </div>

                <p style={{
                  color: '#fff',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  marginBottom: '15px',
                  minHeight: '60px'
                }}>
                  {hook.text}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                  color: '#bb86fc',
                  fontSize: '12px'
                }}>
                  <span>👍 {hook.likes}</span>
                  <span>💬 {hook.comments}</span>
                  <span>{hook.date}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => copyToClipboard(hook.text, hook.id)} style={{
                    flex: 1,
                    background: 'rgba(204, 0, 102, 0.2)',
                    border: '1px solid #cc0066',
                    color: copiedId === hook.id ? '#00ff00' : '#ff00ff',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    fontWeight: 'bold'
                  }}>
                    {copiedId === hook.id ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === hook.id ? 'Copied!' : 'Copy'}
                  </button>

                  <button onClick={() => toggleSave(hook.id)} style={{
                    flex: 1,
                    background: savedHooks.has(hook.id) ? 'rgba(204, 0, 102, 0.3)' : 'rgba(204, 0, 102, 0.2)',
                    border: '1px solid #cc0066',
                    color: savedHooks.has(hook.id) ? '#ff0080' : '#ff00ff',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    fontWeight: 'bold'
                  }}>
                    <Heart size={14} fill={savedHooks.has(hook.id) ? '#ff0080' : 'none'} />
                    Save
                  </button>

                  <button style={{
                    flex: 1,
                    background: 'rgba(204, 0, 102, 0.2)',
                    border: '1px solid #cc0066',
                    color: '#ff00ff',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    fontWeight: 'bold'
                  }}>
                    <Eye size={14} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px'
          }}>
            <button style={{
              background: 'rgba(204, 0, 102, 0.2)',
              border: '1px solid #cc0066',
              color: '#ff00ff',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold'
            }}>
              <ChevronLeft size={16} /> Previous
            </button>

            <div style={{ display: 'flex', gap: '10px', color: '#bb86fc', fontSize: '14px' }}>
              {[1, 2, 3, 4, 5].map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} style={{
                  background: currentPage === page ? '#cc0066' : 'transparent',
                  border: '1px solid #cc0066',
                  color: currentPage === page ? '#000' : '#ff00ff',
                  width: '35px',
                  height: '35px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  {page}
                </button>
              ))}
            </div>

            <button style={{
              background: 'rgba(204, 0, 102, 0.2)',
              border: '1px solid #cc0066',
              color: '#ff00ff',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold'
            }}>
              Next <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ textAlign: 'center', color: '#bb86fc', fontSize: '14px', marginBottom: '40px' }}>
            Showing 1-6 of 1,245 hooks
          </div>
        </main>
      </div>

      {/* Floating Scraper Console */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: consoleOpen ? '400px' : '60px',
        height: consoleOpen ? '500px' : '60px',
        background: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #cc0066',
        borderRadius: '15px',
        boxShadow: '0 0 30px rgba(204, 0, 102, 0.6)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}>
        {!consoleOpen ? (
          <button onClick={() => setConsoleOpen(true)} style={{
            width: '100%',
            height: '100%',
            background: 'none',
            border: 'none',
            color: '#ff00ff',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🧠
          </button>
        ) : (
          <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{
                color: '#ff00ff',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: 0
              }}>
                🧠 Scraper Console
              </h3>
              <button onClick={() => setConsoleOpen(false)} style={{
                background: 'none',
                border: 'none',
                color: '#cc0066',
                cursor: 'pointer',
                fontSize: '20px'
              }}>
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button onClick={() => scrapeData('Reddit')} style={{
                flex: 1,
                background: 'rgba(255, 69, 0, 0.2)',
                border: '1px solid #FF4500',
                color: '#FF4500',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                Reddit
              </button>
              <button onClick={() => scrapeData('YouTube')} style={{
                flex: 1,
                background: 'rgba(255, 0, 0, 0.2)',
                border: '1px solid #FF0000',
                color: '#FF0000',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                YouTube
              </button>
              <button onClick={() => scrapeData('Instagram')} style={{
                flex: 1,
                background: 'rgba(228, 64, 95, 0.2)',
                border: '1px solid #E4405F',
                color: '#E4405F',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                Instagram
              </button>
            </div>

            <div style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(204, 0, 102, 0.3)',
              borderRadius: '8px',
              padding: '15px',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#00ff00',
              marginBottom: '10px'
            }}>
              {consoleLogs.length === 0 ? (
                <div style={{ color: '#bb86fc' }}>Console ready. Click a platform to start scraping...</div>
              ) : (
                consoleLogs.map((log, idx) => (
                  <div key={idx} style={{ marginBottom: '5px', animation: 'fadeIn 0.3s' }}>
                    {log}
                  </div>
                ))
              )}
            </div>

            <button onClick={() => setConsoleLogs([])} style={{
              background: 'rgba(204, 0, 102, 0.2)',
              border: '1px solid #cc0066',
              color: '#ff00ff',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Clear Log
            </button>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(204, 0, 102, 0.9)',
        border: '2px solid #cc0066',
        color: '#fff',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(204, 0, 102, 0.6)',
        zIndex: 999
      }}>
        ↑
      </button>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.8)',
        borderTop: '1px solid rgba(204, 0, 102, 0.3)',
        padding: '30px',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#bb86fc',
          fontSize: '16px',
          marginBottom: '15px'
        }}>
          Built with ❤️ by <span style={{
            background: 'linear-gradient(90deg, #cc0066, #ff00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>Garima Kalra</span>
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '15px'
        }}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
            color: '#E4405F',
            transition: 'transform 0.3s'
          }}>
            <Instagram size={24} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{
            color: '#bb86fc',
            transition: 'transform 0.3s'
          }}>
            <Github size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{
            color: '#0077b5',
            transition: 'transform 0.3s'
          }}>
            <Linkedin size={24} />
          </a>
        </div>

        <div style={{
          color: '#bb86fc',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>© 2024 Hook Bank. All rights reserved.</span>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        a:hover {
          transform: scale(1.1) !important;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #cc0066, #8000ff);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ff0080, #cc0066);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;