import React, { useEffect, useState, useRef } from 'react';

interface RightFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  enhancedMode: boolean;
  onEnhancedToggle: () => void;
  onSearchChange: (searchTerm: string) => void;
}

export const RightFlyout: React.FC<RightFlyoutProps> = ({
  isOpen,
  onClose,
  isDark,
  enhancedMode,
  onEnhancedToggle,
  onSearchChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const flyoutRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearchChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    // Dispatch custom event for same-window communication
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
    onClose();
  };

  // Prevent body scroll when flyout is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Handle click outside flyout
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Focus search input when flyout opens
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100); // Small delay to allow animation to start
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 transition-opacity duration-200"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: isOpen ? 1 : 0
        }}
        onClick={onClose}
      />
      
      {/* Flyout Panel */}
      <div 
        ref={flyoutRef}
        className={`absolute top-0 right-0 h-full transition-transform duration-200 ease-out shadow-xl`}
        style={{
          width: '100vw',
          maxWidth: '320px',
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          borderLeft: `2px solid ${isDark ? '#333' : '#e5e7eb'}`
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header with close button */}
          <div className="flex items-center justify-between border-b-2" style={{ 
            borderColor: isDark ? '#333' : '#e5e7eb',
            padding: '20px 24px',
            minHeight: '64px',
            position: 'relative'
          }}>
            <div className="flex-1 text-center">
              <div className="font-mono font-bold" style={{ 
                color: isDark ? '#ffffff' : '#000000',
                fontSize: '18px',
                letterSpacing: '1px'
              }}>
                MENU
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-md transition-colors"
              style={{ 
                color: isDark ? '#ffffff' : '#000000',
                backgroundColor: 'transparent',
                padding: '8px',
                position: 'absolute',
                right: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Section */}
            <div className="p-4 border-b-2" style={{ borderColor: isDark ? '#333' : '#e5e7eb' }}>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search articles..."
                  className="w-full font-mono transition-all"
                  style={{
                    padding: '12px 40px 12px 16px',
                    fontSize: '14px',
                    backgroundColor: 'transparent',
                    color: isDark ? '#ffffff' : '#000000',
                    border: `2px solid ${isDark ? '#666' : '#000000'}`,
                    borderRadius: '0px',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#00ff00';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = isDark ? '#666' : '#000000';
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors"
                    style={{ 
                      color: isDark ? '#ffffff' : '#000000',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4">
              {/* Enhanced Mode Toggle */}
              <button
                onClick={() => {
                  onEnhancedToggle();
                  onClose();
                }}
                className="w-full text-left font-mono font-bold rounded-md transition-colors flex items-center gap-3"
                style={{ 
                  fontSize: '14px', 
                  letterSpacing: '0.5px',
                  color: isDark ? '#ffffff' : '#000000',
                  backgroundColor: 'transparent',
                  padding: '16px',
                  marginBottom: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div 
                  className="p-2 rounded-md"
                  style={{ 
                    backgroundColor: enhancedMode ? '#00ff00' : (isDark ? '#333' : '#e5e7eb'),
                    color: enhancedMode ? '#000000' : (isDark ? '#ffffff' : '#666666')
                  }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold">REALTIME {enhancedMode ? 'ON' : 'OFF'}</div>
                  <div className="text-xs opacity-70 font-normal">
                    {enhancedMode ? 'Enhanced metadata loading' : 'Basic article info only'}
                  </div>
                </div>
              </button>
              
              {/* Wallet Stats Link */}
              <a 
                href={`https://viewblock.io/arweave/address/X8se6ANj4C-gpP_JH0ZbtJJEpyHBr0XQA-crCpbZGak`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left font-mono font-bold rounded-md transition-colors"
                style={{ 
                  fontSize: '14px', 
                  letterSpacing: '0.5px', 
                  textDecoration: 'none',
                  color: isDark ? '#ffffff' : '#000000',
                  backgroundColor: 'transparent',
                  padding: '16px',
                  marginBottom: '12px'
                }}
                onClick={onClose}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-md"
                    style={{ 
                      backgroundColor: isDark ? '#333' : '#e5e7eb',
                      color: isDark ? '#ffffff' : '#666666'
                    }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">WALLET STATS</div>
                    <div className="text-xs opacity-70 font-normal">View on ViewBlock</div>
                  </div>
                </div>
              </a>
              
              {/* Visit HackerNoon Link */}
              <a 
                href="https://hackernoon.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left font-mono font-bold rounded-md transition-colors"
                style={{ 
                  fontSize: '14px', 
                  letterSpacing: '0.5px', 
                  textDecoration: 'none',
                  color: isDark ? '#ffffff' : '#000000',
                  backgroundColor: 'transparent',
                  padding: '16px',
                  marginBottom: '12px'
                }}
                onClick={onClose}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-md"
                    style={{ 
                      backgroundColor: isDark ? '#333' : '#e5e7eb',
                      color: isDark ? '#ffffff' : '#666666'
                    }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">VISIT HACKERNOON</div>
                    <div className="text-xs opacity-70 font-normal">Go to hackernoon.com</div>
                  </div>
                </div>
              </a>
              
              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className="w-full text-left font-mono font-bold rounded-md transition-colors"
                style={{ 
                  fontSize: '14px', 
                  letterSpacing: '0.5px',
                  color: isDark ? '#ffffff' : '#000000',
                  backgroundColor: 'transparent',
                  padding: '16px',
                  marginBottom: '0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-md"
                    style={{ 
                      backgroundColor: isDark ? '#333' : '#e5e7eb',
                      color: isDark ? '#ffffff' : '#666666'
                    }}
                  >
                    {isDark ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{isDark ? 'LIGHT MODE' : 'DARK MODE'}</div>
                    <div className="text-xs opacity-70 font-normal">Switch color scheme</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};