import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Import Pages
import HomePage from './pages/homepage';
import DashboardPage from './pages/dashboard';
import ExplorerPage from './pages/hook_explorer';
import ScraperPage from './pages/scraper_console';
import AboutPage from './pages/AboutPage.jsx';

function App() {
  const location = useLocation();

  return (
    <>
      {/* Global Styles & Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: #0a0a0f;
          color: #ffffff;
          overflow-x: hidden;
          min-height: 100vh;
        }
        
        /* Root Variables - Pink & Purple Theme */
        :root {
          --bg-primary: #0a0a0f;
          --bg-secondary: #1a0a2e;
          --pinky: #ff4b8b;
          --purpley: #8b5cf6;
          --text-primary: #ffffff;
          --text-secondary: #a0a0a0;
        }
        
        /* Gradient Text Utility */
        .hero-gradient-text {
          background: linear-gradient(90deg, #ff4b8b, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        
        /* Neon Glow Effects */
        .neon-glow {
          filter: drop-shadow(0 0 8px #ff4b8b) drop-shadow(0 0 16px #8b5cf6);
        }
        
        .neon-glow-subtle {
          box-shadow: 
            0 0 20px rgba(255, 75, 139, 0.1), 
            0 0 40px rgba(139, 92, 246, 0.1);
        }
        
        .neon-border {
          border: 2px solid transparent;
          background: linear-gradient(#0a0a0f, #0a0a0f) padding-box,
                      linear-gradient(90deg, #ff4b8b, #8b5cf6) border-box;
        }
        
        /* Glass Morphism */
        .glass-blur {
          background: rgba(26, 10, 46, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        /* Custom Scrollbar - Pink & Purple Gradient */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1a0a2e;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ff4b8b, #8b5cf6);
          border-radius: 5px;
          transition: background 0.3s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ff4b8b, #ff4b8b);
        }
        
        /* Firefox Scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #8b5cf6 #1a0a2e;
        }
        
        /* Selection Styling */
        ::selection {
          background: #ff4b8b;
          color: white;
        }
        
        ::-moz-selection {
          background: #ff4b8b;
          color: white;
        }
        
        /* Focus Visible for Accessibility */
        :focus-visible {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }
        
        /* Floating Animation for Icons */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Pulse Glow Animation */
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
        
        /* Shimmer Loading Effect */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(
            to right,
            rgba(139, 92, 246, 0.1) 0%,
            rgba(255, 75, 139, 0.2) 20%,
            rgba(139, 92, 246, 0.1) 40%,
            rgba(139, 92, 246, 0.1) 100%
          );
          background-size: 1000px 100%;
        }
        
        /* Gradient Border Animation */
        @keyframes gradient-border {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .gradient-border-animate {
          background: linear-gradient(90deg, #ff4b8b, #8b5cf6, #ff4b8b);
          background-size: 200% 200%;
          animation: gradient-border 3s ease infinite;
        }
        
        /* Button Gradient Hover Effect */
        .btn-gradient {
          background: linear-gradient(135deg, #ff4b8b 0%, #8b5cf6 100%);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .btn-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #8b5cf6 0%, #ff4b8b 100%);
          transition: left 0.3s ease;
        }
        
        .btn-gradient:hover::before {
          left: 0;
        }
        
        .btn-gradient > * {
          position: relative;
          z-index: 1;
        }
        
        /* Card Hover Effect */
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 
            0 10px 30px rgba(255, 75, 139, 0.2),
            0 5px 15px rgba(139, 92, 246, 0.2);
        }
        
        /* Responsive Typography */
        @media (max-width: 640px) {
          html {
            font-size: 14px;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          html {
            font-size: 15px;
          }
        }
        
        @media (min-width: 1025px) {
          html {
            font-size: 16px;
          }
        }
        
        /* Accessibility - Reduce Motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Line Clamp Utilities */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Platform Icon Styles */
        .platform-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff4b8b, #8b5cf6);
          padding: 4px;
        }
        
        /* Tooltip Styles */
        .tooltip {
          position: relative;
        }
        
        .tooltip::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 8px;
          background: rgba(26, 10, 46, 0.95);
          color: white;
          font-size: 12px;
          border-radius: 4px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
          border: 1px solid #8b5cf6;
        }
        
        .tooltip:hover::after {
          opacity: 1;
        }
      `}</style>

      {/* Main App Container with Background */}
      <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-x-hidden">
        {/* Animated Background Pattern */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} 
            />
          </div>
          
          {/* Glowing Orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }} />
        </div>

        {/* Page Content with Animations */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route 
                path="/" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <HomePage />
                  </motion.div>
                } 
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <DashboardPage />
                  </motion.div>
                } 
              />
              
              <Route 
                path="/explorer" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <ExplorerPage />
                  </motion.div>
                } 
              />
              
              <Route 
                path="/scraper" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <ScraperPage />
                  </motion.div>
                } 
              />
              
              <Route 
                path="/about" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <AboutPage />
                  </motion.div>
                } 
              />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default App;