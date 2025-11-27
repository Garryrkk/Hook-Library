import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X, Filter, Youtube, MessageCircle, Instagram, Heart, Copy, ExternalLink, TrendingUp, RefreshCw, ChevronUp, Check, AlertCircle, BarChart3, Clock, Github, Share2, Facebook, Linkedin, Twitter, Mail } from 'lucide-react';

const HookExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [selectedTone, setSelectedTone] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [savedHooks, setSavedHooks] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [visibleHooks, setVisibleHooks] = useState(9);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(null);

  const allHooks = [
    { id: 1, platform: 'youtube', text: '5 mistakes killing your productivity and how to fix them', niche: 'Business', tone: 'Curiosity', likes: 12400, comments: 890, views: 45000, date: '2024-11-20', copied: 234 },
    { id: 2, platform: 'reddit', text: 'I tried every productivity hack for 30 days. Here is what actually worked.', niche: 'Lifestyle', tone: 'Informative', likes: 8900, comments: 1560, views: 28000, date: '2024-11-19', copied: 189 },
    { id: 3, platform: 'instagram', text: 'Stop doing cardio. Here is why strength training changed everything.', niche: 'Fitness', tone: 'Urgent', likes: 23400, comments: 2340, views: 67000, date: '2024-11-21', copied: 456 },
    { id: 4, platform: 'youtube', text: 'The psychology trick that made me $100K in 6 months', niche: 'Business', tone: 'Curiosity', likes: 34500, comments: 4210, views: 120000, date: '2024-11-15', copied: 678 },
    { id: 5, platform: 'reddit', text: 'My company went from 0 to 1M users. Here are the 7 things we did right.', niche: 'Tech', tone: 'Informative', likes: 18900, comments: 3120, views: 52000, date: '2024-11-18', copied: 345 },
    { id: 6, platform: 'instagram', text: 'You are doing push-ups wrong. This one change doubled my results.', niche: 'Fitness', tone: 'Curiosity', likes: 15600, comments: 1780, views: 41000, date: '2024-11-21', copied: 267 },
    { id: 7, platform: 'youtube', text: 'I quit my 9-5 to build this. Here is what happened.', niche: 'Lifestyle', tone: 'Emotional', likes: 28900, comments: 5670, views: 98000, date: '2024-11-17', copied: 523 },
    { id: 8, platform: 'reddit', text: 'After 10 years of coding, these are the only skills that matter', niche: 'Tech', tone: 'Informative', likes: 21300, comments: 2890, views: 61000, date: '2024-11-16', copied: 412 },
    { id: 9, platform: 'instagram', text: 'Nobody talks about this muscle. Fix it and watch your gains explode.', niche: 'Fitness', tone: 'Urgent', likes: 19800, comments: 2340, views: 54000, date: '2024-11-20', copied: 389 },
    { id: 10, platform: 'youtube', text: 'The brutal truth about passive income from someone making $50k per month', niche: 'Business', tone: 'Emotional', likes: 41200, comments: 6780, views: 156000, date: '2024-11-14', copied: 789 },
    { id: 11, platform: 'reddit', text: 'I analyzed 1000 viral posts. Here is the formula.', niche: 'Tech', tone: 'Informative', likes: 16700, comments: 2450, views: 48000, date: '2024-11-19', copied: 298 },
    { id: 12, platform: 'instagram', text: 'Your sleep is broken. Here is the science-backed fix.', niche: 'Health', tone: 'Urgent', likes: 27800, comments: 3120, views: 72000, date: '2024-11-21', copied: 534 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    loadSavedHooks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuOpen && !e.target.closest('[data-share-menu]')) {
        setShareMenuOpen(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [shareMenuOpen]);

  const loadSavedHooks = async () => {
    try {
      const result = await window.storage.get('saved-hooks');
      if (result && result.value) {
        const savedIds = JSON.parse(result.value);
        setSavedHooks(new Set(savedIds));
      }
    } catch (error) {
      console.log('No saved hooks found');
    }
  };

  const saveSavedHooks = async (savedSet) => {
    try {
      const savedArray = Array.from(savedSet);
      await window.storage.set('saved-hooks', JSON.stringify(savedArray));
    } catch (error) {
      console.error('Error saving hooks:', error);
      showToastNotification('Error saving hook', 'error');
    }
  };

  const filteredHooks = allHooks.filter(hook => {
    const matchesSearch = hook.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         hook.niche.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'All' || hook.platform === selectedPlatform.toLowerCase();
    const matchesNiche = selectedNiche === 'All' || hook.niche === selectedNiche;
    const matchesTone = selectedTone === 'All' || hook.tone === selectedTone;
    return matchesSearch && matchesPlatform && matchesNiche && matchesTone;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'newest': return new Date(b.date) - new Date(a.date);
      case 'popular': return b.likes - a.likes;
      case 'copied': return b.copied - a.copied;
      case 'engagement': return (b.likes + b.comments) - (a.likes + a.comments);
      default: return 0;
    }
  });

  const displayedHooks = filteredHooks.slice(0, visibleHooks);
  const remainingHooks = filteredHooks.length - visibleHooks;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToastNotification('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSave = async (id) => {
    const newSaved = new Set(savedHooks);
    if (newSaved.has(id)) {
      newSaved.delete(id);
      showToastNotification('Removed from saved', 'info');
    } else {
      newSaved.add(id);
      showToastNotification('Saved successfully!', 'success');
    }
    setSavedHooks(newSaved);
    await saveSavedHooks(newSaved);
  };

  const shareHook = (hook, platform) => {
    const text = encodeURIComponent(hook.text);
    const url = encodeURIComponent(window.location.href);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=Check out this hook&body=${text}`,
      copy: null
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(hook.text);
      showToastNotification('Link copied to clipboard!', 'success');
      setShareMenuOpen(null);
      return;
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShareMenuOpen(null);
      showToastNotification(`Sharing to ${platform}...`, 'success');
    }
  };

  const showToastNotification = (message, type) => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('All');
    setSelectedNiche('All');
    setSelectedTone('All');
    setSortBy('newest');
    showToastNotification('Filters reset', 'info');
  };

  const viewHook = (hook) => {
    setRecentlyViewed(prev => {
      const updated = [hook, ...prev.filter(h => h.id !== hook.id)].slice(0, 5);
      return updated;
    });
  };

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'youtube': return <Youtube size={14} />;
      case 'reddit': return <MessageCircle size={14} />;
      case 'instagram': return <Instagram size={14} />;
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

  const topHooks = [...allHooks].sort((a, b) => b.copied - a.copied).slice(0, 5);

  const platformStats = {
    youtube: allHooks.filter(h => h.platform === 'youtube').length,
    reddit: allHooks.filter(h => h.platform === 'reddit').length,
    instagram: allHooks.filter(h => h.platform === 'instagram').length
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a0033 30%, #2d0066 60%, #4a0099 100%)',
      fontFamily: "'Orbitron', monospace",
      position: 'relative'
    }}>
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
              <a href="/explorer" style={{
                color: '#ff00ff',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 'bold',
                borderBottom: '2px solid #ff00ff',
                paddingBottom: '5px'
              }}>Explorer</a>
              <a href="/about" style={{ color: '#bb86fc', textDecoration: 'none', fontSize: '15px' }}>About</a>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(204, 0, 102, 0.1)',
              border: '1px solid rgba(204, 0, 102, 0.3)',
              borderRadius: '25px',
              padding: '8px 20px',
              gap: '10px'
            }}>
              <Search size={18} color="#bb86fc" />
              <input
                type="text"
                placeholder="Quick search..."
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  outline: 'none',
                  width: '200px',
                  fontSize: '14px'
                }}
              />
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
                }}>5</span>
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
        display: 'flex',
        maxWidth: '1920px',
        margin: '0 auto',
        padding: '40px',
        gap: '30px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(204, 0, 102, 0.3)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(204, 0, 102, 0.1)',
                border: '2px solid rgba(204, 0, 102, 0.4)',
                borderRadius: '15px',
                padding: '15px 25px',
                gap: '15px'
              }}>
                <Search size={24} color="#ff00ff" />
                <input
                  type="text"
                  placeholder="Search hooks about marketing, fitness..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '16px',
                    fontFamily: "'Orbitron', monospace"
                  }}
                />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} style={{
                background: 'rgba(204, 0, 102, 0.2)',
                border: '2px solid #cc0066',
                color: '#ff00ff',
                padding: '15px 25px',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 'bold',
                fontFamily: "'Orbitron', monospace"
              }}>
                <Filter size={18} />
                Filters
              </button>
            </div>

            {showFilters && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '15px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(204, 0, 102, 0.3)',
                animation: 'fadeIn 0.3s'
              }}>
                <div>
                  <label style={{ color: '#bb86fc', fontSize: '12px', marginBottom: '8px', display: 'block' }}>Platform</label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid #cc0066',
                      color: '#ff00ff',
                      padding: '12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: "'Orbitron', monospace"
                    }}
                  >
                    <option value="All">All Platforms</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Reddit">Reddit</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: '#bb86fc', fontSize: '12px', marginBottom: '8px', display: 'block' }}>Niche</label>
                  <select
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid #cc0066',
                      color: '#ff00ff',
                      padding: '12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: "'Orbitron', monospace"
                    }}
                  >
                    <option value="All">All Niches</option>
                    <option value="Business">Business</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Tech">Tech</option>
                    <option value="Health">Health</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: '#bb86fc', fontSize: '12px', marginBottom: '8px', display: 'block' }}>Tone</label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid #cc0066',
                      color: '#ff00ff',
                      padding: '12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: "'Orbitron', monospace"
                    }}
                  >
                    <option value="All">All Tones</option>
                    <option value="Emotional">Emotional</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Curiosity">Curiosity</option>
                    <option value="Informative">Informative</option>
                    <option value="Funny">Funny</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: '#bb86fc', fontSize: '12px', marginBottom: '8px', display: 'block' }}>Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid #cc0066',
                      color: '#ff00ff',
                      padding: '12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: "'Orbitron', monospace"
                    }}
                  >
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                    <option value="copied">Most Copied</option>
                    <option value="engagement">Highest Engagement</option>
                  </select>
                </div>

                <button onClick={resetFilters} style={{
                  gridColumn: 'span 4',
                  background: 'rgba(204, 0, 102, 0.1)',
                  border: '1px solid rgba(204, 0, 102, 0.3)',
                  color: '#bb86fc',
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: "'Orbitron', monospace",
                  fontWeight: 'bold'
                }}>
                  Reset All Filters
                </button>
              </div>
            )}

            <div style={{
              marginTop: '15px',
              color: '#bb86fc',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Showing {displayedHooks.length} of {filteredHooks.length} hooks</span>
              <span>💾 {savedHooks.size} saved</span>
            </div>
          </div>

          {displayedHooks.length === 0 ? (
            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(204, 0, 102, 0.3)',
              borderRadius: '20px',
              padding: '60px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ color: '#ff00ff', fontSize: '24px', marginBottom: '10px' }}>No hooks found</h3>
              <p style={{ color: '#bb86fc', fontSize: '16px' }}>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                gap: '25px',
                marginBottom: '40px'
              }}>
                {displayedHooks.map((hook) => (
                  <div
                    key={hook.id}
                    style={{
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(204, 0, 102, 0.3)',
                      borderRadius: '20px',
                      padding: '25px',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(204, 0, 102, 0.5)';
                      e.currentTarget.style.borderColor = '#cc0066';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(204, 0, 102, 0.3)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: getPlatformColor(hook.platform),
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 'bold'
                      }}>
                        {getPlatformIcon(hook.platform)}
                        {hook.platform.toUpperCase()}
                      </div>
                      <div style={{
                        background: 'rgba(187, 134, 252, 0.2)',
                        color: '#bb86fc',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: '1px solid rgba(187, 134, 252, 0.3)'
                      }}>
                        🔖 {hook.niche}
                      </div>
                      <div style={{
                        background: 'rgba(255, 0, 255, 0.2)',
                        color: '#ff00ff',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: '1px solid rgba(255, 0, 255, 0.3)'
                      }}>
                        💬 {hook.tone}
                      </div>
                    </div>

                    <p style={{
                      color: '#fff',
                      fontSize: '16px',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      minHeight: '75px',
                      fontWeight: '500'
                    }}>
                      ✏️ {hook.text}
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '10px',
                      marginBottom: '20px',
                      paddingBottom: '15px',
                      borderBottom: '1px solid rgba(204, 0, 102, 0.2)'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#ff00ff', fontSize: '16px', fontWeight: 'bold' }}>
                          {(hook.views / 1000).toFixed(1)}K
                        </div>
                        <div style={{ color: '#bb86fc', fontSize: '10px' }}>Views</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#ff00ff', fontSize: '16px', fontWeight: 'bold' }}>
                          {hook.copied}
                        </div>
                        <div style={{ color: '#bb86fc', fontSize: '10px' }}>Copied</div>
                      </div>
                    </div>

                    <div style={{
                      color: '#bb86fc',
                      fontSize: '12px',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      📅 {new Date(hook.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => copyToClipboard(hook.text, hook.id)}
                        style={{
                          flex: 1,
                          background: 'rgba(204, 0, 102, 0.2)',
                          border: '1px solid #cc0066',
                          color: copiedId === hook.id ? '#00ff00' : '#ff00ff',
                          padding: '12px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontWeight: 'bold',
                          fontFamily: "'Orbitron', monospace"
                        }}
                      >
                        {copiedId === hook.id ? <Check size={14} /> : <Copy size={14} />}
                        {copiedId === hook.id ? 'Copied!' : 'Copy'}
                      </button>

                      <button
                        onClick={() => toggleSave(hook.id)}
                        style={{
                          flex: 1,
                          background: savedHooks.has(hook.id) ? 'rgba(204, 0, 102, 0.3)' : 'rgba(204, 0, 102, 0.2)',
                          border: '1px solid #cc0066',
                          color: savedHooks.has(hook.id) ? '#ff0080' : '#ff00ff',
                          padding: '12px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontWeight: 'bold',
                          fontFamily: "'Orbitron', monospace"
                        }}
                      >
                        <Heart size={14} fill={savedHooks.has(hook.id) ? '#ff0080' : 'none'} />
                        {savedHooks.has(hook.id) ? 'Saved' : 'Save'}
                      </button>

                      <div style={{ position: 'relative', flex: 1 }} data-share-menu>
                        <button
                          onClick={() => setShareMenuOpen(shareMenuOpen === hook.id ? null : hook.id)}
                          style={{
                            width: '100%',
                            background: 'rgba(204, 0, 102, 0.2)',
                            border: '1px solid #cc0066',
                            color: '#ff00ff',
                            padding: '12px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontWeight: 'bold',
                            fontFamily: "'Orbitron', monospace"
                          }}
                        >
                          <Share2 size={14} />
                          Share
                        </button>

                        {shareMenuOpen === hook.id && (
                          <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            right: 0,
                            marginBottom: '10px',
                            background: 'rgba(0, 0, 0, 0.95)',
                            border: '2px solid #cc0066',
                            borderRadius: '15px',
                            padding: '15px',
                            minWidth: '200px',
                            boxShadow: '0 10px 40px rgba(204, 0, 102, 0.5)',
                            zIndex: 1000,
                            animation: 'fadeIn 0.2s'
                          }}>
                            <div style={{
                              color: '#ff00ff',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              marginBottom: '12px',
                              paddingBottom: '10px',
                              borderBottom: '1px solid rgba(204, 0, 102, 0.3)'
                            }}>
                              Share via
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <button
                                onClick={() => shareHook(hook, 'whatsapp')}
                                style={{
                                  background: 'rgba(37, 211, 102, 0.1)',
                                  border: '1px solid rgba(37, 211, 102, 0.3)',
                                  color: '#25D366',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  fontFamily: "'Orbitron', monospace",
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(37, 211, 102, 0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)'}
                              >
                                <MessageCircle size={16} />
                                WhatsApp
                              </button>

                              <button
                                onClick={() => shareHook(hook, 'linkedin')}
                                style={{
                                  background: 'rgba(0, 119, 181, 0.1)',
                                  border: '1px solid rgba(0, 119, 181, 0.3)',
                                  color: '#0077B5',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  fontFamily: "'Orbitron', monospace",
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 119, 181, 0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0, 119, 181, 0.1)'}
                              >
                                <Linkedin size={16} />
                                LinkedIn
                              </button>

                              <button
                                onClick={() => shareHook(hook, 'facebook')}
                                style={{
                                  background: 'rgba(24, 119, 242, 0.1)',
                                  border: '1px solid rgba(24, 119, 242, 0.3)',
                                  color: '#1877F2',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  fontFamily: "'Orbitron', monospace",
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(24, 119, 242, 0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(24, 119, 242, 0.1)'}
                              >
                                <Facebook size={16} />
                                Facebook
                              </button>

                              <button
                                onClick={() => shareHook(hook, 'twitter')}
                                style={{
                                  background: 'rgba(29, 161, 242, 0.1)',
                                  border: '1px solid rgba(29, 161, 242, 0.3)',
                                  color: '#1DA1F2',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  fontFamily: "'Orbitron', monospace",
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(29, 161, 242, 0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(29, 161, 242, 0.1)'}
                              >
                                <Twitter size={16} />
                                Twitter
                              </button>

                              <button
                                onClick={() => shareHook(hook, 'email')}
                                style={{
                                  background: 'rgba(234, 67, 53, 0.1)',
                                  border: '1px solid rgba(234, 67, 53, 0.3)',
                                  color: '#EA4335',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  fontFamily: "'Orbitron', monospace",
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(234, 67, 53, 0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(234, 67, 53, 0.1)'}
                              >
                                <Mail size={16} />
                                Email
                              </button>

                              <button
                                onClick={() => shareHook(hook, 'copy')}
                                style={{
                                  background: 'rgba(204, 0, 102, 0.1)',
                                  border: '1px solid rgba(204, 0, 102, 0.3)',
                                  color: '#ff00ff',
                                  padding: '10px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  fontFamily: "'Orbitron', monospace",
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(204, 0, 102, 0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(204, 0, 102, 0.1)'}
                              >
                                <Copy size={16} />
                                Copy Link
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {remainingHooks > 0 && (
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <button
                    onClick={() => setVisibleHooks(prev => prev + 9)}
                    style={{
                      background: 'rgba(204, 0, 102, 0.2)',
                      border: '2px solid #cc0066',
                      color: '#ff00ff',
                      padding: '15px 40px',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      fontFamily: "'Orbitron', monospace",
                      boxShadow: '0 0 20px rgba(204, 0, 102, 0.3)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(204, 0, 102, 0.6)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(204, 0, 102, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Load More Hooks ({remainingHooks} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <aside style={{
          width: '350px',
          display: 'flex',
          flexDirection: 'column',
          gap: '25px'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(204, 0, 102, 0.3)',
            borderRadius: '20px',
            padding: '25px',
            position: 'sticky',
            top: '100px'
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
              🔥 Top Hooks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {topHooks.map((hook) => (
                <div key={hook.id} style={{
                  background: 'rgba(204, 0, 102, 0.1)',
                  border: '1px solid rgba(204, 0, 102, 0.2)',
                  borderRadius: '12px',
                  padding: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(204, 0, 102, 0.2)';
                  e.currentTarget.style.borderColor = '#cc0066';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(204, 0, 102, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(204, 0, 102, 0.2)';
                }}>
                  <div style={{
                    color: '#fff',
                    fontSize: '13px',
                    marginBottom: '10px',
                    lineHeight: '1.4'
                  }}>
                    {hook.text.substring(0, 60)}...
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: '#bb86fc',
                      fontSize: '11px'
                    }}>
                      {hook.niche}
                    </span>
                    <span style={{
                      color: '#ff00ff',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {hook.copied} copies
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <BarChart3 size={20} /> Hook Stats
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Youtube size={18} color="#FF0000" />
                  <span style={{ color: '#bb86fc', fontSize: '14px' }}>YouTube</span>
                </div>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>
                  {platformStats.youtube}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255, 69, 0, 0.1)',
                border: '1px solid rgba(255, 69, 0, 0.3)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageCircle size={18} color="#FF4500" />
                  <span style={{ color: '#bb86fc', fontSize: '14px' }}>Reddit</span>
                </div>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>
                  {platformStats.reddit}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(228, 64, 95, 0.1)',
                border: '1px solid rgba(228, 64, 95, 0.3)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Instagram size={18} color="#E4405F" />
                  <span style={{ color: '#bb86fc', fontSize: '14px' }}>Instagram</span>
                </div>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>
                  {platformStats.instagram}
                </span>
              </div>
            </div>
          </div>

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
              🪩 Filter Presets
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{
                background: 'rgba(204, 0, 102, 0.2)',
                border: '1px solid #cc0066',
                color: '#ff00ff',
                padding: '12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                textAlign: 'left',
                fontFamily: "'Orbitron', monospace"
              }}>
                🔥 Viral Hooks Only
              </button>
              <button style={{
                background: 'rgba(204, 0, 102, 0.2)',
                border: '1px solid #cc0066',
                color: '#ff00ff',
                padding: '12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                textAlign: 'left',
                fontFamily: "'Orbitron', monospace"
              }}>
                💔 Emotional Hooks
              </button>
              <button style={{
                background: 'rgba(204, 0, 102, 0.2)',
                border: '1px solid #cc0066',
                color: '#ff00ff',
                padding: '12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                textAlign: 'left',
                fontFamily: "'Orbitron', monospace"
              }}>
                🧠 Educational
              </button>
            </div>
          </div>

          {recentlyViewed.length > 0 && (
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
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Clock size={20} /> Recently Viewed
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentlyViewed.map(hook => (
                  <div key={hook.id} style={{
                    color: '#bb86fc',
                    fontSize: '12px',
                    padding: '10px',
                    background: 'rgba(204, 0, 102, 0.1)',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    {hook.text.substring(0, 50)}...
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: 'rgba(204, 0, 102, 0.9)',
            border: '2px solid #cc0066',
            color: '#fff',
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(204, 0, 102, 0.6)',
            zIndex: 999,
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 0 35px rgba(204, 0, 102, 0.8)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(204, 0, 102, 0.6)';
          }}
        >
          <ChevronUp size={28} />
        </button>
      )}

      <button
        onClick={() => showToastNotification('Refreshing data...', 'info')}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          background: 'linear-gradient(135deg, #cc0066, #ff00ff)',
          border: '2px solid #ff00ff',
          color: '#fff',
          width: '55px',
          height: '55px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(255, 0, 255, 0.6)',
          zIndex: 999,
          transition: 'all 0.3s'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 0 35px rgba(255, 0, 255, 0.8)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
          e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 0, 255, 0.6)';
        }}
      >
        <RefreshCw size={24} />
      </button>

      <footer style={{
        background: 'rgba(0, 0, 0, 0.9)',
        borderTop: '2px solid',
        borderImage: 'linear-gradient(90deg, #cc0066, #ff00ff, #8000ff) 1',
        padding: '40px',
        marginTop: '60px'
      }}>
        <div style={{
          maxWidth: '1920px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
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

          <div style={{
            display: 'flex',
            gap: '25px'
          }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{
              color: '#bb86fc',
              transition: 'all 0.3s'
            }}>
              <Github size={28} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
              color: '#E4405F',
              transition: 'all 0.3s'
            }}>
              <Instagram size={28} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{
              color: '#0077b5',
              transition: 'all 0.3s'
            }}>
              <TrendingUp size={28} />
            </a>
          </div>

          <div style={{
            color: '#bb86fc',
            fontSize: '12px'
          }}>
            Version 1.0.0
          </div>
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
          }
          to {
            opacity: 1;
          }
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #cc0066, #8000ff);
          borderRadius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ff0080, #cc0066);
        }

        a:hover {
          transform: scale(1.15) !important;
        }
      `}</style>
    </div>
  );
};

export default HookExplorer;       