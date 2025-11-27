import React from 'react';
import { Heart, Code, Coffee, Zap, Bell, User } from 'lucide-react';

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
    </div>
  );
};

export default AboutPage;