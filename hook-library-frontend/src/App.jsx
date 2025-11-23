import React, { useState, useEffect } from 'react';
import { Camera, Mic, Mail, Pen, MessageCircle, Instagram, Video, User } from 'lucide-react';
import Dashboard from './pages/dashboard';
import HookExplorer from './pages/hook_explorer';
import ScraperConsole from './pages/scraper_console';
import ProfilePage from './pages/profile';
import AboutPage from './pages/AboutPage';

const HookBankLanding = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [floatingIcons, setFloatingIcons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/some-endpoint")  // your FastAPI endpoint
    const icons = [
      { Icon: Camera, color: '#ff00ff', id: 1 },
      { Icon: Mic, color: '#00ffff', id: 2 },
      { Icon: Mail, color: '#ff0080', id: 3 },
      { Icon: Pen, color: '#ffff00', id: 4 },
      { Icon: Instagram, color: '#ff00ff', id: 6 },
      { Icon: Video, color: '#ff0080', id: 7 },
      { Icon: Camera, color: '#00ffff', id: 8 },
      { Icon: Mic, color: '#ffff00', id: 9 },
      { Icon: Mail, color: '#00ff00', id: 10 },
      { Icon: Pen, color: '#ff00ff', id: 11 },
      { Icon: MessageCircle, color: '#ff0080', id: 12 },
    ];

    const positioned = icons.map((icon, idx) => ({
      ...icon,
      top: Math.random() * 80 + 10,
      left: Math.random() * 90 + 5,
      delay: idx * 0.5,
      duration: 15 + Math.random() * 10,
    }));

    setFloatingIcons(positioned);
  }, []);

  // Navigation handler
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch(currentPage) {
      case 'scraper':
        return <ScraperConsole />;
      case 'dashboard':
        return <Dashboard />;
      case 'explorer':
        return <HookExplorer />;
      case 'profile':
        return <ProfilePage />;
      case 'about':
        return <AboutPage />;
      default:
        return renderLandingPage();
    }
  };

  const renderLandingPage = () => (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #000000 0%, #1a0033 30%, #2d0066 60%, #4a0099 100%)',
      fontFamily: "'Orbitron', 'Courier New', monospace"
    }}>
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, color, id, top, left, delay, duration }) => (
        <div
          key={id}
          style={{
            position: 'absolute',
            top: `${top}%`,
            left: `${left}%`,
            opacity: 0.4,
            animation: `float ${duration}s ease-in-out ${delay}s infinite`,
            filter: `drop-shadow(0 0 15px ${color})`,
            zIndex: 1
          }}
        >
          <Icon size={50} color={color} strokeWidth={2} />
        </div>
      ))}

      {/* Navigation Bar */}
      <nav style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '30px 80px',
        maxWidth: '1920px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <button
          onClick={() => navigateTo('landing')}
          style={{
            fontSize: '36px',
            fontWeight: 900,
            background: 'linear-gradient(90deg, #da408dff 0%, #ff00ff 50%, #8000ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '3px',
            fontFamily: "'Orbitron', monospace",
            padding: 0
          }}
        >
          HOOK BANK
        </button>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '50px'
        }}>
          <button
            onClick={() => navigateTo('scraper')}
            style={{
              fontSize: '18px',
              color: '#bb86fc',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s',
              letterSpacing: '1px',
              fontFamily: "'Orbitron', monospace"
            }}
            onMouseEnter={(e) => e.target.style.color = '#ff0080'}
            onMouseLeave={(e) => e.target.style.color = '#bb86fc'}
          >
            Scraper-Console
          </button>
          <button
            onClick={() => navigateTo('dashboard')}
            style={{
              fontSize: '18px',
              color: '#bb86fc',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s',
              letterSpacing: '1px',
              fontFamily: "'Orbitron', monospace"
            }}
            onMouseEnter={(e) => e.target.style.color = '#ff0080'}
            onMouseLeave={(e) => e.target.style.color = '#bb86fc'}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigateTo('explorer')}
            style={{
              fontSize: '18px',
              color: '#bb86fc',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s',
              letterSpacing: '1px',
              fontFamily: "'Orbitron', monospace"
            }}
            onMouseEnter={(e) => e.target.style.color = '#ff0080'}
            onMouseLeave={(e) => e.target.style.color = '#bb86fc'}
          >
            Hook-Explorer
          </button>
          <button
            onClick={() => navigateTo('about')}
            style={{
              fontSize: '18px',
              color: '#bb86fc',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s',
              letterSpacing: '1px',
              fontFamily: "'Orbitron', monospace"
            }}
            onMouseEnter={(e) => e.target.style.color = '#ff0080'}
            onMouseLeave={(e) => e.target.style.color = '#bb86fc'}
          >
            About
          </button>
          <button
            onClick={() => navigateTo('profile')}
            style={{
              background: 'rgba(204, 0, 102, 0.2)',
              border: '2px solid #cc0066',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 0 15px rgba(204, 0, 102, 0.4)',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 25px rgba(204, 0, 102, 0.8)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(204, 0, 102, 0.4)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <User size={24} color="#ff00ff" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '100px 80px',
        maxWidth: '1920px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 300px)'
      }}>
        {/* Left Column - Content */}
        <div style={{
          width: '45%',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px'
        }}>
          <h1 style={{
            fontSize: '72px',
            fontWeight: 900,
            lineHeight: '1.2',
            background: 'linear-gradient(90deg, #ff0080 0%, #ff00ff 30%, #8000ff 60%, #ff0080 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '2px'
          }}>
            Generate Viral Hooks with AI Power
          </h1>
          
          <p style={{
            fontSize: '28px',
            color: '#bb86fc',
            margin: 0,
            letterSpacing: '1px'
          }}>
            Never Run Out of Content Ideas Again
          </p>

          <button
            onClick={() => navigateTo('scraper')}
            style={{
              padding: '20px 50px',
              fontSize: '24px',
              fontWeight: 700,
              color: '#000',
              background: '#cc0066',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(204, 0, 102, 0.6)',
              animation: 'pulseGlow 2s ease-in-out infinite',
              letterSpacing: '2px',
              fontFamily: "'Orbitron', monospace"
            }}
          >
            Start Creating →
          </button>
        </div>

        {/* Right Column - Visual Element */}
        <div style={{
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: '600px'
        }}>
          {/* Central Circle */}
          <div style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            border: '5px solid #cc0066',
            boxShadow: '0 0 40px rgba(204, 0, 102, 0.5), inset 0 0 40px rgba(204, 0, 102, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '96px',
                fontWeight: 900,
                background: 'linear-gradient(90deg, #ff0080 0%, #ff00ff 50%, #8000ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '3px'
              }}>
                100K+
              </div>
              <div style={{
                fontSize: '28px',
                color: '#bb86fc',
                marginTop: '10px',
                letterSpacing: '2px'
              }}>
                Hooks Generated
              </div>
            </div>
          </div>

          {/* Orbiting Icons */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
            const radius = 280;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const IconComponent = [Mic, Mail, Pen, MessageCircle, Instagram, Video, Mic, Mail][idx];
            const colors = ['#ff0080', '#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0080', '#00ffff', '#ff00ff'];

            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: `3px solid ${colors[idx]}`,
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  // expose CSS variables so the `orbit` keyframes can reference them
                  '--x': `${x}px`,
                  '--y': `${y}px`,
                  boxShadow: `0 0 30px ${colors[idx]}`,
                  animation: `orbit 25s linear ${idx * 0.5}s infinite`
                }}
              >
                <IconComponent size={36} color={colors[idx]} strokeWidth={2.5} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 10
      }}>
        <p style={{
          fontSize: '20px',
          color: '#bb86fc',
          margin: '0 0 10px 0',
          letterSpacing: '1px'
        }}>
          Built with 💜 by Hook Bank Team
        </p>
        <p style={{
          fontSize: '18px',
          color: '#ff0080',
          margin: 0,
          letterSpacing: '1px'
        }}>
          Two sisters Garima and Aurin
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-40px) rotate(5deg);
          }
          50% {
            transform: translateY(-80px) rotate(-5deg);
          }
          75% {
            transform: translateY(-40px) rotate(3deg);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(204, 0, 102, 0.6);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 30px rgba(204, 0, 102, 0.8);
            transform: scale(1.05);
          }
        }

        @keyframes orbit {
          0% {
            transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(0deg);
          }
          100% {
            transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(360deg);
          }
        }

        button:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );

  return renderPage();
};

export default HookBankLanding;