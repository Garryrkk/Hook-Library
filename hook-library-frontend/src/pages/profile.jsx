import React, { useState } from 'react';
import { Bell, Edit2, Crown, Share2, LogOut, Camera, Copy, Heart, Folder, Activity, Settings, Award, Youtube, MessageCircle, Instagram, Trash2, Plus, X, Download, Mail, Check, Search, TrendingUp } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState('Garima Kalra');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [scrapeAlerts, setScrapeAlerts] = useState(true);
  const [newHooksAlerts, setNewHooksAlerts] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [allowFollowing, setAllowFollowing] = useState(true);
<<<<<<< HEAD
  const [showToast, setShowToast] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Profile updated successfully', time: '5m ago' },
    { id: 2, message: 'New achievement unlocked', time: '1h ago' }
  ]);
=======
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedName, setEditedName] = useState('Garima Kalra');
  const [editedEmail, setEditedEmail] = useState('garima@hookbank.com');
  const [editedBio, setEditedBio] = useState('Hook Master | Content Creator | Pro Plan Member');
>>>>>>> dca22dca4006ca18a41ca989da017959cd8a2fe2

  const stats = [
    { label: 'Hooks Saved', value: '247', emoji: '💾', color: '#ff0080' },
    { label: 'Hooks Copied', value: '1,834', emoji: '📋', color: '#00ffff' },
    { label: 'Collections', value: '12', emoji: '📁', color: '#ffff00' },
    { label: 'Day Streak', value: '7', emoji: '🔥', color: '#ff00ff' },
  ];

<<<<<<< HEAD
  const showToastNotification = (message, type) => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
=======
  const handleShareProfile = () => {
    setShowShareModal(true);
  };

  const shareToWhatsApp = () => {
    const profileUrl = `${window.location.origin}/profile/${userName.toLowerCase().replace(/\s+/g, '-')}`;
    const text = `Check out my Hook Bank profile! ${profileUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToInstagram = () => {
    alert('Instagram sharing: Copy the link and paste it in your Instagram bio or story!');
    const profileUrl = `${window.location.origin}/profile/${userName.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(profileUrl);
  };

  const shareToTwitter = () => {
    const profileUrl = `${window.location.origin}/profile/${userName.toLowerCase().replace(/\s+/g, '-')}`;
    const text = `Check out my Hook Bank profile!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    const profileUrl = `${window.location.origin}/profile/${userName.toLowerCase().replace(/\s+/g, '-')}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const profileUrl = `${window.location.origin}/profile/${userName.toLowerCase().replace(/\s+/g, '-')}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, '_blank');
  };

  const shareToEmail = () => {
    const profileUrl = `${window.location.origin}/profile/${userName.toLowerCase().replace(/\s+/g, '-')}`;
    const subject = 'Check out my Hook Bank profile!';
    const body = `Hi,\n\nCheck out my Hook Bank profile: ${profileUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${userName.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(profileUrl);
    alert('Profile link copied to clipboard!');
  };

  const handleEditProfile = () => {
    setEditedName(userName);
    setEditedEmail('garima@hookbank.com');
    setShowEditModal(true);
  };

  const saveProfileChanges = () => {
    setUserName(editedName);
    setShowEditModal(false);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logging out...');
      // Add your logout logic here
      // e.g., window.location.href = '/login';
    }
  };

  const handleProfilePictureUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Profile picture "${file.name}" selected! (Upload functionality would be implemented here)`);
        // Add your upload logic here
      }
    };
    input.click();
>>>>>>> dca22dca4006ca18a41ca989da017959cd8a2fe2
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      style={{
        width: '60px',
        height: '30px',
        borderRadius: '15px',
        border: 'none',
        background: checked ? 'linear-gradient(90deg, #00ff00, #00cc00)' : 'rgba(187, 134, 252, 0.3)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s',
        boxShadow: checked ? '0 0 20px rgba(0, 255, 0, 0.6)' : 'none'
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: '3px',
        left: checked ? '33px' : '3px',
        transition: 'all 0.3s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }} />
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a0033 30%, #2d0066 60%, #4a0099 100%)',
      fontFamily: "'Orbitron', monospace",
      width: '100%'
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Bell 
                size={22} 
                color="#bb86fc" 
                style={{ cursor: 'pointer' }}
                onClick={() => setShowNotifications(!showNotifications)}
              />
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
              }}>2</span>
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: '0',
                  background: 'rgba(0, 0, 0, 0.95)',
                  border: '1px solid rgba(204, 0, 102, 0.5)',
                  borderRadius: '15px',
                  minWidth: '300px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  boxShadow: '0 10px 30px rgba(204, 0, 102, 0.3)',
                  zIndex: 1000
                }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid rgba(204, 0, 102, 0.3)' }}>
                    <h3 style={{ color: '#ff00ff', fontSize: '14px', margin: 0 }}>Notifications</h3>
                  </div>
                  {notifications.map(notif => (
                    <div key={notif.id} style={{
                      padding: '12px 15px',
                      borderBottom: '1px solid rgba(204, 0, 102, 0.2)',
                      color: '#bb86fc',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(204, 0, 102, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <p style={{ margin: 0, marginBottom: '4px' }}>{notif.message}</p>
                      <p style={{ margin: 0, color: '#8888aa', fontSize: '11px' }}>{notif.time}</p>
                    </div>
                  ))}
                </div>
              )}
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
            }}>G</div>
          </div>
        </div>
      </nav>

      <div style={{
        maxWidth: '1920px',
        margin: '0 auto',
        padding: '40px',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '2px solid #cc0066',
          borderRadius: '30px',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: '0 0 40px rgba(204, 0, 102, 0.4)'
        }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #cc0066, #ff00ff, #8000ff)',
                padding: '4px',
                boxShadow: '0 0 40px rgba(255, 0, 255, 0.6)'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  fontWeight: 'bold',
                  color: '#ff00ff'
                }}>
                  G
                </div>
              </div>
              <button 
                onClick={handleProfilePictureUpload}
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #cc0066, #ff00ff)',
                  border: '2px solid #000',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(255, 0, 255, 0.6)'
                }}>
                <Camera size={20} />
              </button>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                {isEditingName ? (
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    autoFocus
                    style={{
                      background: 'rgba(204, 0, 102, 0.1)',
                      border: '1px solid #cc0066',
                      borderRadius: '10px',
                      padding: '10px 15px',
                      color: '#fff',
                      fontSize: '36px',
                      fontWeight: 'bold',
                      outline: 'none',
                      fontFamily: "'Orbitron', monospace"
                    }}
                  />
                ) : (
                  <>
                    <h1 style={{
                      fontSize: '42px',
                      fontWeight: 900,
                      background: 'linear-gradient(90deg, #ff00ff, #8000ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      margin: 0
                    }}>
                      {userName}
                    </h1>
                    <button
                      onClick={handleEditProfile}
                      style={{
                        background: 'rgba(204, 0, 102, 0.2)',
                        border: '1px solid #cc0066',
                        color: '#ff00ff',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Edit2 size={16} />
                    </button>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={18} color="#bb86fc" />
                  <span style={{ color: '#bb86fc', fontSize: '16px' }}>garima@hookbank.com</span>
                  <Check size={16} color="#00ff00" />
                </div>
                <div style={{ color: '#bb86fc', fontSize: '14px' }}>
                  Member since Nov 2024
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #cc0066, #ff00ff)',
                  padding: '8px 20px',
                  borderRadius: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)'
                }}>
                  <Crown size={18} color="#fff" />
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Hook Master</span>
                </div>
                <div style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  padding: '8px 20px',
                  borderRadius: '25px',
                  border: '1px solid #FFD700',
                  color: '#FFD700',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  ⭐ Pro Plan
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
<<<<<<< HEAD
                  onClick={() => showToastNotification('Profile shared!', 'success')}
=======
                  onClick={handleShareProfile}
>>>>>>> dca22dca4006ca18a41ca989da017959cd8a2fe2
                  style={{
                    background: 'rgba(204, 0, 102, 0.2)',
                    border: '1px solid #cc0066',
                    color: '#ff00ff',
                    padding: '12px 25px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: "'Orbitron', monospace"
                  }}>
                  <Share2 size={16} /> Share Profile
                </button>
                <button 
<<<<<<< HEAD
                  onClick={() => showToastNotification('Logging out...', 'info')}
=======
                  onClick={handleLogout}
>>>>>>> dca22dca4006ca18a41ca989da017959cd8a2fe2
                  style={{
                    background: 'rgba(255, 0, 0, 0.2)',
                    border: '1px solid #ff0000',
                    color: '#ff0000',
                    padding: '12px 25px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: "'Orbitron', monospace"
                  }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${stat.color}40`,
                borderRadius: '20px',
                padding: '25px',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 10px 30px ${stat.color}60`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{stat.emoji}</div>
              <div style={{ color: '#bb86fc', fontSize: '14px', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{
                fontSize: '36px',
                fontWeight: 900,
                color: stat.color
              }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(204, 0, 102, 0.3)',
          borderRadius: '20px',
          padding: '60px',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: '#ff00ff',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            Profile Page - Full Version Coming Soon! 🚀
          </h2>
          <p style={{ color: '#bb86fc', fontSize: '18px', marginBottom: '30px' }}>
            Tabs: Overview | Saved Hooks | Collections | Achievements | Settings
          </p>
          
          <div style={{
            background: 'rgba(204, 0, 102, 0.1)',
            border: '1px solid rgba(204, 0, 102, 0.3)',
            borderRadius: '15px',
            padding: '30px',
            marginTop: '30px'
          }}>
            <h3 style={{ color: '#ff00ff', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              ⚙️ Settings Preview
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              <div style={{
                padding: '15px',
                background: 'rgba(204, 0, 102, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: '600px'
              }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                    Two-Factor Authentication
                  </div>
                  <div style={{ color: '#bb86fc', fontSize: '12px' }}>
                    Add an extra layer of security
                  </div>
                </div>
                <ToggleSwitch checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
              </div>

              <div style={{
                padding: '15px',
                background: 'rgba(204, 0, 102, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: '600px'
              }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                    Email Notifications
                  </div>
                  <div style={{ color: '#bb86fc', fontSize: '12px' }}>
                    Receive updates via email
                  </div>
                </div>
                <ToggleSwitch checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
              </div>

              <div style={{
                padding: '15px',
                background: 'rgba(204, 0, 102, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: '600px'
              }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                    Public Profile
                  </div>
                  <div style={{ color: '#bb86fc', fontSize: '12px' }}>
                    Make your profile visible to others
                  </div>
                </div>
                <ToggleSwitch checked={publicProfile} onChange={() => setPublicProfile(!publicProfile)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer style={{
        background: 'rgba(0, 0, 0, 0.9)',
        borderTop: '2px solid #cc0066',
        padding: '30px',
        marginTop: '60px',
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
            Built with ❤️ by <span style={{ fontWeight: 'bold' }}>Garima Kalra</span>
          </p>
        </div>
      </footer>

      {/* Share Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowShareModal(false)}>
          <div style={{
            background: 'linear-gradient(135deg, #1a0033 0%, #2d0066 100%)',
            border: '2px solid #cc0066',
            borderRadius: '25px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 0 60px rgba(204, 0, 102, 0.6)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ color: '#ff00ff', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
                Share Profile
              </h2>
              <button onClick={() => setShowShareModal(false)} style={{
                background: 'transparent',
                border: 'none',
                color: '#ff00ff',
                cursor: 'pointer',
                padding: '5px'
              }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <button onClick={shareToWhatsApp} style={{
                background: 'rgba(37, 211, 102, 0.2)',
                border: '2px solid #25D366',
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <MessageCircle size={32} color="#25D366" />
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>WhatsApp</span>
              </button>

              <button onClick={shareToInstagram} style={{
                background: 'rgba(225, 48, 108, 0.2)',
                border: '2px solid #E1306C',
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <Instagram size={32} color="#E1306C" />
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>Instagram</span>
              </button>

              <button onClick={shareToTwitter} style={{
                background: 'rgba(29, 155, 240, 0.2)',
                border: '2px solid #1DA1F2',
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <span style={{ fontSize: '32px' }}>𝕏</span>
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>Twitter</span>
              </button>

              <button onClick={shareToFacebook} style={{
                background: 'rgba(24, 119, 242, 0.2)',
                border: '2px solid #1877F2',
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <span style={{ fontSize: '32px', color: '#1877F2' }}>f</span>
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>Facebook</span>
              </button>

              <button onClick={shareToLinkedIn} style={{
                background: 'rgba(10, 102, 194, 0.2)',
                border: '2px solid #0A66C2',
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <span style={{ fontSize: '32px', color: '#0A66C2', fontWeight: 'bold' }}>in</span>
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>LinkedIn</span>
              </button>

              <button onClick={shareToEmail} style={{
                background: 'rgba(234, 67, 53, 0.2)',
                border: '2px solid #EA4335',
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s'
              }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <Mail size={32} color="#EA4335" />
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>Email</span>
              </button>
            </div>

            <button onClick={copyProfileLink} style={{
              background: 'rgba(204, 0, 102, 0.3)',
              border: '2px solid #cc0066',
              borderRadius: '15px',
              padding: '15px',
              width: '100%',
              marginTop: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#ff00ff',
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: "'Orbitron', monospace"
            }}>
              <Copy size={20} />
              Copy Profile Link
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowEditModal(false)}>
          <div style={{
            background: 'linear-gradient(135deg, #1a0033 0%, #2d0066 100%)',
            border: '2px solid #cc0066',
            borderRadius: '25px',
            padding: '40px',
            maxWidth: '550px',
            width: '90%',
            boxShadow: '0 0 60px rgba(204, 0, 102, 0.6)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ color: '#ff00ff', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
                Edit Profile
              </h2>
              <button onClick={() => setShowEditModal(false)} style={{
                background: 'transparent',
                border: 'none',
                color: '#ff00ff',
                cursor: 'pointer',
                padding: '5px'
              }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                <label style={{ color: '#bb86fc', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(204, 0, 102, 0.1)',
                    border: '2px solid #cc0066',
                    borderRadius: '12px',
                    padding: '15px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: "'Orbitron', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#bb86fc', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(204, 0, 102, 0.1)',
                    border: '2px solid #cc0066',
                    borderRadius: '12px',
                    padding: '15px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: "'Orbitron', monospace"
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#bb86fc', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                  Bio
                </label>
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    background: 'rgba(204, 0, 102, 0.1)',
                    border: '2px solid #cc0066',
                    borderRadius: '12px',
                    padding: '15px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: "'Orbitron', monospace",
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button onClick={saveProfileChanges} style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #cc0066, #ff00ff)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '15px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  fontFamily: "'Orbitron', monospace",
                  boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)'
                }}>
                  Save Changes
                </button>
                <button onClick={() => setShowEditModal(false)} style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid #bb86fc',
                  borderRadius: '12px',
                  padding: '15px',
                  cursor: 'pointer',
                  color: '#bb86fc',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  fontFamily: "'Orbitron', monospace"
                }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default ProfilePage;