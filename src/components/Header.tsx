import React, { useState, useEffect } from 'react';
import hnLogo from '../assets/hn-logo.png';

interface HeaderProps {
  enhancedMode: boolean;
  onEnhancedToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ enhancedMode, onEnhancedToggle }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMobileMenu && !target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Dispatch custom event for same-window communication
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
  };

  return (
    <header className="sticky top-0 z-50" style={{ 
      backgroundColor: '#00ff00',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div 
        className="flex items-center justify-between min-h-[64px]"
        style={{ 
          paddingLeft: '24px !important', 
          paddingRight: '24px !important'
        }}
      > {/* Using inline styles with !important to ensure padding is applied */}
        <div className="flex items-center gap-2 sm:gap-4"> {/* Responsive gap: 8px mobile, 16px desktop */}
          {/* HackerNoon Logo */}
          <a 
            href="https://hackernoon.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:opacity-80 transition-opacity"
            title="Visit HackerNoon.com"
          >
            <img 
              src={hnLogo} 
              alt="HackerNoon" 
              className="h-8 sm:h-10"
            />
          </a>
            
          <div className="hidden sm:block" style={{
            height: '24px',
            width: '1px',
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}></div>
          
          {/* Arweave Link */}
          <a 
            href="https://arweave.hackernoon.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-mono font-bold hover:underline flex items-center text-xs sm:text-sm"
            style={{ 
              color: '#000000',
              letterSpacing: '0.5px'
            }}
            title="Visit arweave.hackernoon.com"
          >
            <span>on </span>
            <span>ARWEAVE</span>
          </a>
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Desktop controls - hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Enhanced Mode Toggle */}
            <button
              onClick={onEnhancedToggle}
              className="font-mono transition-all"
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                letterSpacing: '0.5px',
                backgroundColor: enhancedMode ? 'rgba(0,0,0,0.9)' : 'transparent',
                color: enhancedMode ? '#00ff00' : '#000000',
                border: '2px solid #000000',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                if (!enhancedMode) {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!enhancedMode) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              title={enhancedMode ? "Real-time article data fetching enabled" : "Click to enable real-time data"}
            >
              REALTIME {enhancedMode ? 'ON' : 'OFF'}
            </button>
            
            {/* Stats Link */}
            <a 
              href={`https://viewblock.io/arweave/address/X8se6ANj4C-gpP_JH0ZbtJJEpyHBr0XQA-crCpbZGak`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-bold transition-all flex items-center"
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                letterSpacing: '0.5px',
                backgroundColor: 'transparent',
                color: '#000000',
                border: '2px solid #000000',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.9)';
                e.currentTarget.style.color = '#00ff00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#000000';
              }}
              title="View wallet statistics on ViewBlock"
            >
              WALLET STATS
            </a>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 transition-all"
              style={{ 
                backgroundColor: 'transparent',
                color: '#000000',
                border: '2px solid #000000',
                borderRadius: '4px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.9)';
                e.currentTarget.style.color = '#00ff00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#000000';
              }}
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button - shown only on mobile */}
          <div className="md:hidden relative mobile-menu-container">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 transition-all min-w-[44px] min-h-[44px]"
              style={{ 
                backgroundColor: 'transparent',
                color: '#000000',
                border: '2px solid #000000',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.9)';
                e.currentTarget.style.color = '#00ff00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#000000';
              }}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Mobile dropdown menu */}
            {showMobileMenu && (
              <div 
                className="absolute right-0 top-full mt-1 border-2 border-black rounded-md shadow-lg z-50"
                style={{ 
                  minWidth: '220px',
                  backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff'
                }}
              >
                {/* Enhanced Mode Toggle */}
                <button
                  onClick={() => {
                    onEnhancedToggle();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-5 py-4 font-mono font-bold border-b-2 transition-colors flex items-center gap-3"
                  style={{ 
                    fontSize: '14px', 
                    letterSpacing: '0.5px',
                    borderColor: theme === 'dark' ? '#333' : '#e5e7eb',
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#333' : '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  REALTIME {enhancedMode ? 'ON' : 'OFF'}
                </button>
                
                {/* Stats Link */}
                <a 
                  href={`https://viewblock.io/arweave/address/X8se6ANj4C-gpP_JH0ZbtJJEpyHBr0XQA-crCpbZGak`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-5 py-4 font-mono font-bold border-b-2 transition-colors flex items-center gap-3"
                  style={{ 
                    fontSize: '14px', 
                    letterSpacing: '0.5px', 
                    textDecoration: 'none',
                    borderColor: theme === 'dark' ? '#333' : '#e5e7eb',
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    backgroundColor: 'transparent'
                  }}
                  onClick={() => setShowMobileMenu(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#333' : '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  WALLET STATS
                </a>
                
                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-5 py-4 font-mono font-bold flex items-center gap-3 transition-colors"
                  style={{ 
                    fontSize: '14px', 
                    letterSpacing: '0.5px',
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#333' : '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {theme === 'light' ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      DARK MODE
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                      LIGHT MODE
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};