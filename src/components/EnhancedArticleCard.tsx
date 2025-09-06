import React, { useState, useEffect } from 'react';
import type { Article } from '../types/article';
import { getGatewayUrl } from '../lib/gateway';
import { fetchArticleMetadata } from '../lib/article-parser';

interface EnhancedArticleCardProps {
  article: Article;
  isDark: boolean;
  enableMetadataFetch?: boolean;
}

export const EnhancedArticleCard: React.FC<EnhancedArticleCardProps> = ({ 
  article, 
  isDark,
  enableMetadataFetch = true 
}) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    if (!enableMetadataFetch) return;
    
    const controller = new AbortController();
    let timeoutId: number;
    
    // Fetch metadata after a short delay to avoid unnecessary requests
    timeoutId = setTimeout(() => {
      setLoading(true);
      fetchArticleMetadata(article.id, controller.signal)
        .then(data => {
          if (data) {
            setMetadata(data);
          }
        })
        .finally(() => setLoading(false));
    }, 500);
    
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [article.id, enableMetadataFetch]);
  
  const formatDate = (date?: Date | string) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date.replace(/\//g, '-')) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(dateObj);
  };
  
  const handleClick = () => {
    const url = getGatewayUrl(article.id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  // Use darker green in light mode for better visibility
  const accentColor = isDark ? '#00ff00' : '#00b800';
  const borderColor = isDark ? '#00ff00' : '#00cc00';
  
  // Use metadata if available, fallback to original article data
  const displayTitle = metadata?.title || article.title;
  const displayDescription = metadata?.tldr || metadata?.description || article.description;
  const displayAuthor = metadata?.author || article.author;
  const displayDate = metadata?.publishedDate || article.publishedAt;
  const displayTags = metadata?.tags || article.tags;
  const displayReadingTime = metadata?.readingTime || article.readingTime;
  
  return (
    <article 
      onClick={handleClick}
      className="relative block cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 group"
      style={{ 
        backgroundColor: isDark ? '#1a1f2e' : '#ffffff',
        borderRadius: '8px',
        border: `2px solid ${loading ? borderColor : isDark ? '#2a2f3e' : '#e5e7eb'}`,
        boxShadow: isDark 
          ? '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)' 
          : '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        setShowPreview(true);
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.boxShadow = isDark 
          ? '0 10px 25px rgba(0, 255, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.3)'
          : '0 10px 25px rgba(0, 184, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        setShowPreview(false);
        e.currentTarget.style.borderColor = loading ? borderColor : (isDark ? '#2a2f3e' : '#e5e7eb');
        e.currentTarget.style.boxShadow = isDark 
          ? '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'
          : '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)';
      }}
    >
      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-5 h-5 rounded-full animate-spin" style={{ 
            border: '2px solid transparent',
            borderTopColor: accentColor,
            borderRightColor: accentColor
          }}></div>
        </div>
      )}
      
      {/* TLDR Preview Tooltip - Only on desktop */}
      {showPreview && displayDescription && window.innerWidth > 1024 && (
        <div 
          className="hidden lg:block absolute z-20 rounded-lg shadow-2xl pointer-events-none"
          style={{
            backgroundColor: isDark ? '#0f1419' : '#ffffff',
            border: `2px solid ${borderColor}`,
            padding: '16px',
            top: '50%',
            left: 'calc(100% + 12px)',
            transform: 'translateY(-50%)',
            width: '320px',
            maxWidth: '320px'
          }}
        >
          <div className="font-mono font-bold" style={{ 
            fontSize: '11px',
            color: accentColor,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            TL;DR
          </div>
          <p style={{ 
            fontSize: '13px',
            lineHeight: '1.5',
            color: isDark ? '#ffffff' : '#000000' 
          }}>
            {displayDescription}
          </p>
        </div>
      )}
      
      <div style={{ padding: '20px' }}>
        {/* Title */}
        <h3 className="font-mono font-bold line-clamp-2 transition-colors duration-200"
            style={{ 
              fontSize: '18px',
              lineHeight: '1.4',
              marginBottom: '12px',
              color: isDark ? '#ffffff' : '#000000'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = accentColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isDark ? '#ffffff' : '#000000';
            }}>
          {displayTitle}
        </h3>
        
        {/* Description */}
        {displayDescription && (
          <p className="line-clamp-2" style={{ 
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '16px',
            color: isDark ? '#9ca3af' : '#4b5563' 
          }}>
            {displayDescription.slice(0, 150)}...
          </p>
        )}
        
        {/* Metadata */}
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <div className="flex items-center gap-2" style={{ fontSize: '12px' }}>
            {displayAuthor && (
              <>
                <span className="font-semibold" style={{ color: accentColor }}>
                  {displayAuthor}
                </span>
                <span style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>•</span>
              </>
            )}
            {displayDate && (
              <time style={{ color: isDark ? '#6b7280' : '#6b7280' }}>
                {formatDate(displayDate)}
              </time>
            )}
          </div>
          
          {displayReadingTime && (
            <span className="font-mono font-bold" style={{ 
              fontSize: '11px',
              color: accentColor 
            }}>
              {displayReadingTime} MIN READ
            </span>
          )}
        </div>
        
        {/* Tags */}
        {displayTags && displayTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayTags.slice(0, 3).map((tag: string, index: number) => (
              <span 
                key={index}
                className="inline-block font-mono"
                style={{ 
                  padding: '4px 8px',
                  fontSize: '11px',
                  backgroundColor: isDark ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 184, 0, 0.08)',
                  color: accentColor,
                  border: `1px solid ${isDark ? 'rgba(0, 255, 0, 0.3)' : 'rgba(0, 184, 0, 0.25)'}`,
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};