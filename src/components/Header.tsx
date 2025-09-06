import React from 'react';
import hnLogo from '../assets/hn-logo.png';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {


  return (
    <header className="sticky top-0 z-50" style={{ 
      backgroundColor: '#00ff00',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      paddingLeft: '24px',
      paddingRight: '24px'
    }}>
      <div className="flex items-center justify-between min-h-[64px]">
        {/* Left side - Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-4">
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
            <span style={{ marginRight: '6px' }}>on</span>
            <span>ARWEAVE</span>
          </a>
        </div>
        
        {/* Right side - Hamburger Menu Button */}
        <button
          onClick={onMenuToggle}
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
      </div>
    </header>
  );
};