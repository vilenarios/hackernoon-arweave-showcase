import React, { useState, useEffect } from 'react';
import hnLogo from '../assets/hn-logo.png';

interface HeaderProps {
  enhancedMode: boolean;
  onEnhancedToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ enhancedMode, onEnhancedToggle }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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
      <div className="flex items-center justify-between" style={{ 
        height: '56px',
        padding: '0 20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div className="flex items-center" style={{ gap: '16px' }}>
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
              style={{ height: '40px' }}
            />
          </a>
            
          <div style={{ 
            height: '24px',
            width: '1px',
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}></div>
          
          {/* Arweave Link */}
          <a 
            href="https://arweave.hackernoon.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-mono font-bold hover:underline flex items-center"
            style={{ 
              fontSize: '14px',
              color: '#000000',
              letterSpacing: '0.5px'
            }}
            title="Visit arweave.hackernoon.com"
          >
            <span className="hidden sm:inline">on</span>
            <span style={{ marginLeft: '4px' }}>ARWEAVE</span>
          </a>
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center" style={{ gap: '12px' }}>
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
            <span className="hidden sm:inline">REALTIME</span>
            <span className="sm:hidden">RT</span>
            <span style={{ marginLeft: '6px' }}>
              {enhancedMode ? 'ON' : 'OFF'}
            </span>
          </button>
          
          {/* Stats Link */}
          <a 
            href={`https://viewblock.io/arweave/address/X8se6ANj4C-gpP_JH0ZbtJJEpyHBr0XQA-crCpbZGak`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono font-bold transition-all hidden sm:flex items-center"
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
      </div>
    </header>
  );
};