import React from 'react';
import type { Article } from '../types/article';
import { getGatewayUrl } from '../lib/gateway';

interface ArticleCardProps {
  article: Article;
  isDark: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, isDark }) => {
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleClick = () => {
    const url = getGatewayUrl(article.id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Use darker green in light mode for better visibility
  const accentColor = isDark ? '#00ff00' : '#00b800';
  const borderColor = isDark ? '#00ff00' : '#00cc00';

  return (
    <article 
      onClick={handleClick}
      className="block cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 group"
      style={{ 
        backgroundColor: isDark ? '#1a1f2e' : '#ffffff',
        borderRadius: '8px',
        border: `2px solid ${isDark ? '#2a2f3e' : '#e5e7eb'}`,
        boxShadow: isDark 
          ? '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)' 
          : '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.boxShadow = isDark 
          ? '0 10px 25px rgba(0, 255, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.3)'
          : '0 10px 25px rgba(0, 184, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isDark ? '#2a2f3e' : '#e5e7eb';
        e.currentTarget.style.boxShadow = isDark 
          ? '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'
          : '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)';
      }}
    >
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
          {article.title}
        </h3>
        
        {/* Description */}
        {article.description && (
          <p className="line-clamp-2" style={{ 
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '16px',
            color: isDark ? '#9ca3af' : '#4b5563' 
          }}>
            {article.description}
          </p>
        )}
        
        {/* Metadata */}
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <div className="flex items-center gap-2" style={{ fontSize: '12px' }}>
            {article.author && (
              <>
                <span className="font-semibold" style={{ color: accentColor }}>
                  {article.author}
                </span>
                <span style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>•</span>
              </>
            )}
            {article.publishedAt && (
              <time style={{ color: isDark ? '#6b7280' : '#6b7280' }}>
                {formatDate(article.publishedAt)}
              </time>
            )}
          </div>
          
          {article.readingTime && (
            <span className="font-mono font-bold" style={{ 
              fontSize: '11px',
              color: accentColor 
            }}>
              {article.readingTime} MIN READ
            </span>
          )}
        </div>
        
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag, index) => (
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