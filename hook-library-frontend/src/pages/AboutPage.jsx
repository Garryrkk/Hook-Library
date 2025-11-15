import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Menu, X, Heart, Sparkles, Code, Zap, Target, 
  Users, Github, Linkedin, Instagram, Mail, ArrowRight,
  Rocket, Star, Award, TrendingUp, MessageCircle, Coffee
} from 'lucide-react';
import { API_URL } from "../utils/config";



const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-purple-500/20 ${
      scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl shadow-lg shadow-purple-500/10' : 'bg-[#0a0a0f]/50 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="hero-gradient-text text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Hook Bank
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              Home
            </button>
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              Dashboard
            </button>
            <button className="text-gray-300 hover:text-white transition-colors hover:underline underline-offset-4">
              Explorer
            </button>
            <button className="text-white font-semibold underline underline-offset-4 decoration-pink-500">
              About
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg shadow-purple-500/50"
            >
              Get Started
            </motion.button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-lg rounded-lg mt-2 p-4 space-y-3 mb-4"
          >
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">Home</button>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">Dashboard</button>
            <button className="block w-full text-left text-gray-300 hover:text-white py-2">Explorer</button>
            <button className="block w-full text-left text-white font-semibold py-2">About</button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

// ============================================
// CREATOR CARD COMPONENT
// ============================================
const CreatorCard = ({ name, role, description, socials, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ y: -10 }}
      className="bg-[#1a0a2e]/40 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl p-8 group hover:border-pink-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/30"
    >
      {/* Avatar */}
      <div className="relative mb-6">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-6xl font-bold text-white neon-glow-subtle group-hover:neon-glow transition-all">
          {name.charAt(0)}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-xs font-semibold">
          {role}
        </div>
      </div>

      {/* Name */}
      <h3 
        className="text-2xl font-bold text-center mb-2 hero-gradient-text"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        {name}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-center mb-6 leading-relaxed">
        {description}
      </p>

      {/* Socials */}
      <div className="flex items-center justify-center space-x-4">
        {socials.github && (
          <motion.a
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-full transition-all border border-purple-500/50 hover:border-pink-500/50"
            aria-label="GitHub"
          >
            <Github size={20} className="text-white" />
          </motion.a>
        )}
        {socials.linkedin && (
          <motion.a
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-full transition-all border border-purple-500/50 hover:border-pink-500/50"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} className="text-white" />
          </motion.a>
        )}
        {socials.instagram && (
          <motion.a
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-full transition-all border border-purple-500/50 hover:border-pink-500/50"
            aria-label="Instagram"
          >
            <Instagram size={20} className="text-white" />
          </motion.a>
        )}
        {socials.email && (
          <motion.a
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            href={`mailto:${socials.email}`}
            className="p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-full transition-all border border-purple-500/50 hover:border-pink-500/50"
            aria-label="Email"
          >
            <Mail size={20} className="text-white" />
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// STATS SECTION COMPONENT
// ============================================
const StatsSection = () => {
  const stats = [
    { icon: Code, value: '10K+', label: 'Lines of Code', color: 'from-pink-500 to-red-500' },
    { icon: Coffee, value: '∞', label: 'Cups of Coffee', color: 'from-purple-500 to-blue-500' },
    { icon: Zap, value: '100%', label: 'Passion & Dedication', color: 'from-pink-500 to-purple-500' },
    { icon: Heart, value: '2', label: 'Sisters Building Dreams', color: 'from-red-500 to-pink-500' }
  ];

  return (
    <section className="py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#1a0a2e]/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 text-center group hover:border-pink-500/50 transition-all"
          >
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center group-hover:animate-pulse-glow`}>
              <stat.icon size={32} className="text-white" />
            </div>
            <p className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              {stat.value}
            </p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// FEATURES SECTION COMPONENT
// ============================================
const FeaturesSection = () => {
  const features = [
    {
      icon: Rocket,
      title: 'Built for Speed',
      description: 'Lightning-fast performance with React and modern web technologies'
    },
    {
      icon: Target,
      title: 'Mission Driven',
      description: 'Helping content creators find viral hooks and boost their engagement'
    },
    {
      icon: Star,
      title: 'Quality First',
      description: 'Meticulously crafted with attention to every detail and user experience'
    },
    {
      icon: TrendingUp,
      title: 'Always Growing',
      description: 'Continuously improving with new features and platform integrations'
    }
  ];

  return (
    <section className="py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-bold text-center mb-12"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        <span className="hero-gradient-text">Why We Built This</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#1a0a2e]/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-pink-500/50 transition-all group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg group-hover:animate-pulse-glow">
                <feature.icon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
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
            <p className="text-gray-500 text-xs mt-1">Built with ❤️ by Garima Kalra & Aurin Desai</p>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN ABOUT PAGE COMPONENT
// ============================================
export default function AboutPage() {
  const creators = [
    {
      name: 'Garima Kalra',
      role: 'Co-Creator',
      description: 'Passionate developer and content strategist building tools to empower creators worldwide.',
      socials: {
        github: 'https://github.com/garimakalra',
        linkedin: 'https://linkedin.com/in/garimakalra',
        instagram: 'https://instagram.com/garimakalra',
        email: 'garima@hookbank.com'
      }
    },
    {
      name: 'Aurin Desai',
      role: 'Co-Creator',
      description: 'Creative technologist and design enthusiast crafting beautiful digital experiences.',
      socials: {
        github: 'https://github.com/aurindesai',
        linkedin: 'https://linkedin.com/in/aurindesai',
        instagram: 'https://instagram.com/aurindesai',
        email: 'aurin@hookbank.com'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: #000000;
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
        
        .neon-glow-subtle {
          box-shadow: 0 0 20px rgba(255, 75, 139, 0.1), 0 0 40px rgba(139, 92, 246, 0.1);
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 75, 139, 0.3), 0 0 40px rgba(139, 92, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 75, 139, 0.5), 0 0 60px rgba(139, 92, 246, 0.4);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1a0a2e;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ff4b8b, #8b5cf6);
          border-radius: 4px;
        }
      `}</style>

      <Navbar />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full mb-6"
            >
              <Heart size={16} className="text-pink-400" />
              <span className="text-sm text-gray-300">Built with Passion</span>
            </motion.div>

            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <span className="hero-gradient-text">Meet the Creators</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-4">
              Built with passion by two sisters
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-4 text-lg"
            >
              <span className="text-pink-400 font-semibold">Garima Kalra</span>
              <span className="text-gray-600">&</span>
              <span className="text-purple-400 font-semibold">Aurin Desai</span>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <StatsSection />

          {/* Creator Cards */}
          <section className="py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-center mb-12"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <span className="hero-gradient-text">The Visionaries</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {creators.map((creator, i) => (
                <CreatorCard key={i} {...creator} index={i} />
              ))}
            </div>
          </section>

          {/* Features Section */}
          <FeaturesSection />

          {/* Mission Statement */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-16"
          >
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-2 border-purple-500/30 rounded-2xl p-8 sm:p-12 text-center">
              <Sparkles size={48} className="text-pink-400 mx-auto mb-6" />
              <h2 
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                <span className="hero-gradient-text">Our Mission</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                To empower content creators with data-driven insights and viral hooks, 
                making it easier to craft compelling content that resonates with audiences 
                across YouTube, Reddit, and Instagram. We're building the future of content 
                discovery, one hook at a time.
              </p>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-16 text-center"
          >
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-6"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <span className="hero-gradient-text">Join Us on This Journey</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              We're constantly improving Hook Bank. Have feedback or want to collaborate?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/50 neon-glow flex items-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>Get in Touch</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-purple-500 text-white rounded-xl font-semibold text-lg hover:bg-purple-500/10 transition-all flex items-center space-x-2"
              >
                <span>Explore Hooks</span>
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}