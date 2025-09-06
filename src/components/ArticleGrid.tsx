import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Article } from '../types/article';
import { ArticleCard } from './ArticleCard';
import { EnhancedArticleCard } from './EnhancedArticleCard';

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isDark: boolean;
  enhancedMode: boolean;
  isFiltered?: boolean;
  totalArticles?: number;
  filteredCount?: number;
  searchTerm?: string;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  loading,
  hasMore,
  onLoadMore,
  isDark,
  enhancedMode,
  isFiltered = false,
  totalArticles = 0,
  filteredCount = 0,
  searchTerm = '',
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  return (
    <div className="w-full" style={{ padding: '32px 20px' }}>
      <div className="max-w-[1400px] mx-auto">
        {/* Search Results Header */}
        {isFiltered && (
          <div className="mb-10 text-center">
            <div className="font-mono text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              {filteredCount === 0 ? (
                <>
                  No articles found for <span className="font-bold" style={{ color: isDark ? '#ffffff' : '#000000' }}>"{searchTerm}"</span>
                </>
              ) : (
                <>
                  Showing {filteredCount} of {totalArticles} articles for <span className="font-bold" style={{ color: isDark ? '#ffffff' : '#000000' }}>"{searchTerm}"</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" style={{ gap: '24px' }}>
            {articles.map((article, index) => (
            enhancedMode ? (
              <EnhancedArticleCard 
                key={article.id} 
                article={article} 
                isDark={isDark}
                enableMetadataFetch={true}
                index={index}
              />
            ) : (
              <ArticleCard 
                key={article.id} 
                article={article} 
                isDark={isDark} 
              />
            )
          ))}
          </div>
        ) : (
          // Empty state for filtered results with no matches
          isFiltered && (
            <div className="text-center" style={{ padding: '80px 20px' }}>
              <div className="font-mono" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-lg mb-2">No articles found</div>
                <div className="text-sm mb-2">
                  for <span className="font-bold" style={{ color: isDark ? '#ffffff' : '#000000' }}>"{searchTerm}"</span>
                </div>
                <div className="text-sm">Try a different search term</div>
              </div>
            </div>
          )
        )}
        
        {hasMore && !isFiltered && (
          <div ref={ref} className="flex justify-center" style={{ padding: '48px 0' }}>
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full animate-spin" style={{ 
                  border: '3px solid transparent',
                  borderTopColor: isDark ? '#00ff00' : '#00b800',
                  borderRightColor: isDark ? '#00ff00' : '#00b800'
                }}></div>
                <span className="font-mono" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Loading more articles...
                </span>
              </div>
            ) : (
              <button 
                onClick={onLoadMore}
                className="font-mono font-bold rounded-md transition-all"
                style={{ 
                  padding: '12px 32px',
                  backgroundColor: '#00ff00',
                  color: '#000000',
                  border: '2px solid #00ff00',
                  fontSize: '14px',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#00ff00';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00ff00';
                  e.currentTarget.style.color = '#000000';
                }}
              >
                LOAD MORE ARTICLES
              </button>
            )}
          </div>
        )}
        
        {!hasMore && articles.length > 0 && (
          <div className="text-center" style={{ padding: '48px 0', color: isDark ? '#6b7280' : '#9ca3af' }}>
            <span className="font-mono text-sm">— End of archive —</span>
          </div>
        )}
      </div>
    </div>
  );
};