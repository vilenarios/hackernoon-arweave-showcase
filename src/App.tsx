import { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './lib/apollo-client';
import { useHackernoonArticles } from './hooks/useHackernoonArticles';
import { Header } from './components/Header';
import { ArticleGrid } from './components/ArticleGrid';
import { RightFlyout } from './components/RightFlyout';

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const { articles, loading, error, hasMore, loadMore, isFiltered, totalArticles, filteredCount } = useHackernoonArticles(searchTerm);
  const [isDark, setIsDark] = useState(true);
  const [enhancedMode, setEnhancedMode] = useState(true);
  const [showFlyout, setShowFlyout] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(savedTheme ? savedTheme === 'dark' : prefersDark);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const handleStorageChange = () => {
      const theme = localStorage.getItem('theme');
      setIsDark(theme === 'dark');
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-window theme changes
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setIsDark(customEvent.detail === 'dark');
    };
    window.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleMenuToggle = () => {
    setShowFlyout(!showFlyout);
  };

  const handleFlyoutClose = () => {
    setShowFlyout(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDark ? '#0f1419' : '#f5f5f5' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#ff0000' }}>Error Loading Articles</h2>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded transition-colors"
            style={{ backgroundColor: '#00ff00', color: '#000000' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDark ? '#0f1419' : '#f5f5f5' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full animate-spin" style={{ 
            border: '4px solid transparent',
            borderTopColor: '#00ff00',
            borderRightColor: '#00ff00'
          }}></div>
          <span className="text-xl font-mono" style={{ color: isDark ? '#ffffff' : '#000000' }}>Loading HackerNoon archive...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: isDark ? '#0f1419' : '#f5f5f5', minHeight: '100vh' }}>
      <Header 
        onMenuToggle={handleMenuToggle}
      />
      <main>
        {articles.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2" style={{ color: isDark ? '#ffffff' : '#000000' }}>No Articles Found</h2>
              <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No articles have been uploaded by this wallet yet.</p>
            </div>
          </div>
        ) : (
          <ArticleGrid 
            articles={articles}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            isDark={isDark}
            enhancedMode={enhancedMode}
            isFiltered={isFiltered}
            totalArticles={totalArticles}
            filteredCount={filteredCount}
            searchTerm={searchTerm}
          />
        )}
      </main>
      
      {/* Right Flyout */}
      <RightFlyout 
        isOpen={showFlyout}
        onClose={handleFlyoutClose}
        isDark={isDark}
        enhancedMode={enhancedMode}
        onEnhancedToggle={() => setEnhancedMode(!enhancedMode)}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AppContent />
    </ApolloProvider>
  );
}

export default App;
