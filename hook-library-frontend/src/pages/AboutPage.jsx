import React from 'react';
import { Heart, Code, Coffee, Zap, Bell, User } from 'lucide-react';

<<<<<<< HEAD
// ============================================
// API SERVICE
// ============================================
class ApiService {
  constructor(baseURL = 'http://localhost:8000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  getUserProfile() {
    return this.request('/profile');
  }

  updateProfileInfo(data) {
    return this.request('/profile/info', { method: 'PUT', body: JSON.stringify(data) });
  }

  updateProfilePicture(imageData) {
    return this.request('/profile/picture', { method: 'POST', body: JSON.stringify({ image_data: imageData }) });
  }

  getQuickStats() {
    return this.request('/profile/stats/quick');
  }

  getActivityOverview(days = 7) {
    return this.request(`/profile/stats/activity?days=${days}`);
  }

  getCollections() {
    return this.request('/profile/collections');
  }

  createCollection(name) {
    return this.request('/profile/collections', { method: 'POST', body: JSON.stringify({ name }) });
  }

  deleteCollection(collectionId) {
    return this.request(`/profile/collections/${collectionId}`, { method: 'DELETE' });
  }

  copyHook(hookId) {
    return this.request(`/hooks/${hookId}/copy`, { method: 'POST' });
  }

  deleteHook(hookId) {
    return this.request(`/hooks/${hookId}`, { method: 'DELETE' });
  }

  getScrapingHistory(limit = 50) {
    return this.request(`/profile/scraping/history?limit=${limit}`);
  }

  getAchievements() {
    return this.request('/profile/achievements');
  }

  getSettings() {
    return this.request('/profile/settings');
  }

  changePassword(currentPassword, newPassword, confirmPassword) {
    return this.request('/profile/settings/password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword })
    });
  }

  enableTwoFactor() {
    return this.request('/profile/settings/2fa/enable', { method: 'POST' });
  }

  deleteAccount(password) {
    return this.request('/profile/settings/account', { method: 'DELETE', body: JSON.stringify({ password }) });
  }

  exportData(format) {
    return this.request('/profile/export', { method: 'POST', body: JSON.stringify({ format, collection_ids: [] }) });
  }

  getWeeklyReport() {
    return this.request('/reports/weekly');
  }

  logout() {
    return this.request('/auth/signout', { method: 'POST' });
  }

  shareProfile() {
    const profileUrl = window.location.origin;
    navigator.clipboard.writeText(profileUrl);
  }
}

// ============================================
// NAVBAR COMPONENT
// ============================================
const Navbar = ({ onLogout, showNotifications, setShowNotifications, notifications }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const api = new ApiService();
      await api.logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-purple-500/20 ${
      scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl shadow-lg shadow-purple-500/10' : 'bg-[#0a0a0f]/50 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="hero-gradient-text text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Hook Bank
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">Home</button>
            <button className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
            <button className="text-white font-semibold">Profile</button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Bell Icon with Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-purple-500/20 rounded-lg transition-colors" 
                aria-label="Notifications"
              >
                <Bell size={20} className="text-purple-400" />
                {notifications && notifications.length > 0 && (
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
                      {notifications && notifications.length > 0 ? (
                        notifications.map(notif => (
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
              onClick={handleLogout}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// PROFILE HEADER
// ============================================
const ProfileHeader = ({ profile, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const api = new ApiService();
      await api.updateProfileInfo({ name: editedName });
      onEdit({ ...profile, name: editedName });
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const api = new ApiService();
    api.shareProfile();
    alert('Profile link copied to clipboard!');
  };

  const handleCameraClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const api = new ApiService();
            await api.updateProfilePicture(event.target.result);
            alert('Profile picture updated!');
          } catch (error) {
            console.error('Picture upload failed:', error);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1a0a2e]/80 to-[#0a0a0f]/80 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl p-8 mb-8"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative group">
          <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-5xl font-bold text-white">
            {profile?.avatar || profile?.name?.charAt(0) || 'U'}
          </div>
          <button
            onClick={handleCameraClick}
            className="absolute bottom-0 right-0 p-2 bg-purple-500 hover:bg-purple-600 rounded-full text-white"
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="px-4 py-2 bg-[#0a0a0f]/50 border border-purple-500/30 rounded-lg text-white focus:outline-none"
              />
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="p-2 bg-green-500 hover:bg-green-600 rounded-lg text-white disabled:opacity-50"
              >
                <Save size={20} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {profile?.name || 'User'}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <Edit2 size={18} className="text-gray-400" />
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400 text-sm mb-4">
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <span>{profile?.email || 'N/A'}</span>
              <Check size={16} className="text-green-400" />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Member since {profile?.memberSince || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-semibold">
              {profile?.role || 'User'}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
              {profile?.plan || 'Free'} Plan
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="px-4 py-2 border border-purple-500/50 text-white rounded-lg hover:bg-purple-500/10 transition-all flex items-center gap-2"
        >
          <Share2 size={16} />
          <span className="hidden sm:inline">Share</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================
// QUICK STATS
// ============================================
const QuickStats = ({ stats, isLoading }) => {
  const statCards = [
    { icon: Heart, label: 'Hooks Saved', value: stats?.saved || 0, color: 'from-pink-500 to-red-500', emoji: '💾' },
    { icon: Copy, label: 'Hooks Copied', value: stats?.copied || 0, color: 'from-purple-500 to-blue-500', emoji: '📋' },
    { icon: Folder, label: 'Collections', value: stats?.collections || 0, color: 'from-blue-500 to-cyan-500', emoji: '📁' },
    { icon: Flame, label: 'Day Streak', value: stats?.streak || 0, color: 'from-orange-500 to-red-500', emoji: '🔥' }
=======
const AboutPage = () => {
  const stats = [
    { 
      label: '10K+ Lines of Code', 
      icon: Code, 
      color: '#ff0080',
      gradient: 'linear-gradient(135deg, #ff0080, #ff00ff)'
    },
    { 
      label: '∞ Cups of Coffee', 
      icon: Coffee, 
      color: '#00ffff',
      gradient: 'linear-gradient(135deg, #00ffff, #0080ff)'
    },
    { 
      label: '100% Passion & Dedication', 
      icon: Zap, 
      color: '#ffff00',
      gradient: 'linear-gradient(135deg, #ffff00, #ff8800)'
    },
    { 
      label: '2 Sisters Building Dreams', 
      icon: Heart, 
      color: '#ff00ff',
      gradient: 'linear-gradient(135deg, #ff00ff, #8000ff)'
    },
>>>>>>> dca22dca4006ca18a41ca989da017959cd8a2fe2
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a0033 30%, #2d0066 60%, #4a0099 100%)',
      fontFamily: "'Orbitron', monospace",
      width: '100%',
      overflow: 'auto'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid #cc0066',
        padding: '15px 40px',
        width: '100%'
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
              <a href="/explorer" style={{ color: '#bb86fc', textDecoration: 'none', fontSize: '15px' }}>Explorer</a>
              <a href="/about" style={{
                color: '#ff00ff',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 'bold',
                borderBottom: '2px solid #ff00ff',
                paddingBottom: '5px'
              }}>About</a>
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

      {/* Hero Section */}
      <div style={{
        maxWidth: '1920px',
        margin: '0 auto',
        padding: '120px 80px',
        textAlign: 'center',
        animation: 'fadeIn 1s ease-out'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(204, 0, 102, 0.2)',
          border: '2px solid #cc0066',
          borderRadius: '50px',
          padding: '12px 30px',
          marginBottom: '40px',
          animation: 'fadeIn 1s ease-out 0.2s both'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Heart size={24} color="#ff00ff" fill="#ff00ff" />
            <span style={{
              color: '#ff00ff',
              fontSize: '16px',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}>
              BUILT WITH PASSION
            </span>
            <Heart size={24} color="#ff00ff" fill="#ff00ff" />
          </div>
        </div>

        <h1 style={{
          fontSize: '72px',
          fontWeight: 900,
          background: 'linear-gradient(90deg, #ff0080 0%, #ff00ff 30%, #8000ff 60%, #ff0080 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 30px 0',
          letterSpacing: '2px',
          animation: 'fadeIn 1s ease-out 0.4s both'
        }}>
          Meet the Creators
        </h1>

        <p style={{
          fontSize: '32px',
          color: '#bb86fc',
          marginBottom: '50px',
          letterSpacing: '1px',
          animation: 'fadeIn 1s ease-out 0.6s both'
        }}>
          Built with passion by two sisters
        </p>

        {/* Creators Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '40px',
          maxWidth: '1000px',
          margin: '0 auto 80px',
          animation: 'fadeIn 1s ease-out 0.8s both'
        }}>
          {/* Garima Kalra Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(204, 0, 102, 0.3)',
            borderRadius: '30px',
            padding: '50px 40px',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(255, 0, 128, 0.5)';
            e.currentTarget.style.borderColor = '#ff0080';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(204, 0, 102, 0.3)';
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff0080, #ff00ff)',
              padding: '5px',
              margin: '0 auto 30px',
              boxShadow: '0 0 40px rgba(255, 0, 128, 0.6)'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#ff00ff'
              }}>
                G
              </div>
            </div>
            <h3 style={{
              fontSize: '32px',
              fontWeight: 900,
              background: 'linear-gradient(90deg, #ff0080, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '15px'
            }}>
              Garima Kalra
            </h3>
            <p style={{
              color: '#bb86fc',
              fontSize: '18px',
              lineHeight: '1.6'
            }}>
              Full-Stack Developer & Creator
            </p>
          </div>

          {/* Aurin Desai Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(204, 0, 102, 0.3)',
            borderRadius: '30px',
            padding: '50px 40px',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(128, 0, 255, 0.5)';
            e.currentTarget.style.borderColor = '#8000ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(204, 0, 102, 0.3)';
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8000ff, #ff00ff)',
              padding: '5px',
              margin: '0 auto 30px',
              boxShadow: '0 0 40px rgba(128, 0, 255, 0.6)'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#8000ff'
              }}>
                A
              </div>
            </div>
            <h3 style={{
              fontSize: '32px',
              fontWeight: 900,
              background: 'linear-gradient(90deg, #8000ff, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '15px'
            }}>
              Aurin Desai
            </h3>
            <p style={{
              color: '#bb86fc',
              fontSize: '18px',
              lineHeight: '1.6'
            }}>
              Full-Stack Developer & Creator
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          maxWidth: '1400px',
          margin: '0 auto',
          animation: 'fadeIn 1s ease-out 1s both'
        }}>
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${stat.color}40`,
                  borderRadius: '25px',
                  padding: '40px 30px',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 20px 50px ${stat.color}60`;
                  e.currentTarget.style.borderColor = stat.color;
                  e.currentTarget.style.background = `${stat.gradient}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = `${stat.color}40`;
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: stat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px',
                  boxShadow: `0 0 30px ${stat.color}80`
                }}>
                  <Icon size={40} color="#fff" strokeWidth={2.5} />
                </div>
                <h3 style={{
                  color: '#fff',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  letterSpacing: '0.5px'
                }}>
                  {stat.label}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Mission Statement */}
        <div style={{
          marginTop: '100px',
          maxWidth: '900px',
          margin: '100px auto 0',
          padding: '50px',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(204, 0, 102, 0.3)',
          borderRadius: '30px',
          animation: 'fadeIn 1s ease-out 1.2s both'
        }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 900,
            background: 'linear-gradient(90deg, #ff0080, #ff00ff, #8000ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '30px'
          }}>
            Our Mission
          </h2>
          <p style={{
            color: '#bb86fc',
            fontSize: '20px',
            lineHeight: '1.8',
            letterSpacing: '0.5px'
          }}>
            We're on a mission to revolutionize content creation by making viral hook generation accessible to everyone. 
            Hook Bank combines cutting-edge AI technology with a deep understanding of what makes content engaging. 
            Our platform empowers creators, marketers, and businesses to never run out of ideas again.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.9)',
        borderTop: '2px solid #cc0066',
        padding: '30px',
        marginTop: '80px',
        width: '100%'
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
            Built with ❤️ by <span style={{ fontWeight: 'bold' }}>Garima Kalra & Aurin Desai</span>
          </p>
        </div>
      </footer>

<<<<<<< HEAD
      {activeSection === 'notifications' && (
        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <Bell size={20} className="text-purple-400" />
            <span>Notification Preferences</span>
          </h4>
          <div className="space-y-4">
            {['Email Notifications', 'Scrape Completion Alerts', 'Weekly Summary'].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0f]/30 rounded-lg">
                <p className="text-white font-semibold">{item}</p>
                <button className="w-12 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'privacy' && (
        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <Lock size={20} className="text-blue-400" />
            <span>Privacy Settings</span>
          </h4>
          <div className="space-y-4">
            {['Public Profile', 'Show Activity'].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0f]/30 rounded-lg">
                <p className="text-white font-semibold">{item}</p>
                <button className="w-12 h-6 bg-gray-600 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'data' && (
        <div className="bg-[#1a0a2e]/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Download size={20} className="text-cyan-400" />
            <span>Export Data</span>
          </h4>
          <p className="text-gray-400 text-sm mb-4">Download all your saved hooks and collections</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('csv')}
              disabled={isLoading}
              className="px-6 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/50 rounded-lg disabled:opacity-50"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={isLoading}
              className="px-6 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/50 rounded-lg disabled:opacity-50"
            >
              Export as JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// FOOTER
// ============================================
const Footer = () => {
  return (
    <footer className="border-t-2 border-pink-500/30 bg-[#0a0a0f] py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">© Hook Bank 2025</p>
            <p className="text-gray-500 text-xs mt-1">Built with ❤️ by Garima Kalra & Aurin Desai</p>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm">GitHub</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [hooks, setHooks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [history, setHistory] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your profile has been updated', time: '5m ago' },
    { id: 2, message: 'New achievement unlocked: Content Curator', time: '1h ago' }
  ]);

  const showToastNotification = (message, type) => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const api = new ApiService();
      
      try {
        const profileData = await api.getUserProfile();
        setProfile(profileData);
      } catch {
        setProfile({ name: 'User', email: 'user@example.com', memberSince: 'January 2025', role: 'User', plan: 'Free' });
      }

      try {
        const statsData = await api.getQuickStats();
        setStats(statsData);
      } catch {
        setStats({ saved: 247, copied: 1834, collections: 12, streak: 7 });
      }

      try {
        const activityData = await api.getActivityOverview();
        setActivity(activityData);
      } catch {
        setActivity({
          weekly: [
            { label: 'Mon', value: 12 },
            { label: 'Tue', value: 25 },
            { label: 'Wed', value: 18 },
            { label: 'Thu', value: 42 },
            { label: 'Fri', value: 35 },
            { label: 'Sat', value: 28 },
            { label: 'Sun', value: 15 }
          ]
        });
      }

      try {
        const hooksData = await api.request('/hooks/saved');
        setHooks(hooksData);
      } catch {
        setHooks([
          { id: 1, text: 'How I made $10k in 30 days with this simple trick', platform: 'YouTube', savedDate: '2 hours ago' },
          { id: 2, text: 'This Reddit comment changed my entire perspective', platform: 'Reddit', savedDate: '1 day ago' }
        ]);
      }

      try {
        const collectionsData = await api.getCollections();
        setCollections(collectionsData);
      } catch {
        setCollections([
          { id: 1, name: 'Marketing Ideas', count: 45, updated: '2 days ago' },
          { id: 2, name: 'Fitness Content', count: 32, updated: '5 days ago' }
        ]);
      }

      try {
        const achievementsData = await api.getAchievements();
        setAchievements(achievementsData);
      } catch {
        setAchievements([
          { id: 1, name: 'Hook Hunter', description: 'Save your first 10 hooks', icon: '🎯', unlocked: true, unlockedDate: '2 weeks ago', progress: 10, requirement: 10 },
          { id: 2, name: 'Content Curator', description: 'Save 100 hooks', icon: '📚', unlocked: true, unlockedDate: '1 week ago', progress: 100, requirement: 100 }
        ]);
      }

      try {
        const historyData = await api.getScrapingHistory();
        setHistory(historyData);
      } catch {
        setHistory([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-black text-white">
=======
>>>>>>> dca22dca4006ca18a41ca989da017959cd8a2fe2
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          overflow-x: hidden;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
      `}</style>
<<<<<<< HEAD

      <Navbar onLogout={handleLogout} showNotifications={showNotifications} setShowNotifications={setShowNotifications} notifications={notifications} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ProfileHeader profile={profile} onEdit={setProfile} />
          <QuickStats stats={stats} isLoading={isLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'overview' && <OverviewTab activity={activity} />}
                  {activeTab === 'saved' && <SavedHooksTab hooks={hooks} onRefresh={loadData} />}
                  {activeTab === 'collections' && <CollectionsTab collections={collections} onRefresh={loadData} />}
                  {activeTab === 'history' && <ScrapingHistoryTab history={history} />}
                  {activeTab === 'analytics' && <AnalyticsTab />}
                  {activeTab === 'achievements' && <AchievementsTab achievements={achievements} />}
                  {activeTab === 'settings' && <SettingsTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

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
=======
>>>>>>> dca22dca4006ca18a41ca989da017959cd8a2fe2
    </div>
  );
};

export default AboutPage;