import React from 'react';

interface SkeletonCardProps {
  isDark: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ isDark }) => {
  const shimmerColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const baseColor = isDark ? '#1a1f2e' : '#f3f4f6';

  return (
    <div 
      className="relative block transition-all duration-300 animate-pulse"
      style={{ 
        backgroundColor: baseColor,
        borderRadius: '8px',
        border: `2px solid ${isDark ? '#2a2f3e' : '#e5e7eb'}`,
        boxShadow: isDark 
          ? '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)' 
          : '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '20px' }}>
        {/* Title skeleton */}
        <div 
          className="rounded mb-3"
          style={{ 
            height: '20px', 
            backgroundColor: shimmerColor,
            width: '85%'
          }} 
        />
        <div 
          className="rounded mb-4"
          style={{ 
            height: '20px', 
            backgroundColor: shimmerColor,
            width: '65%'
          }} 
        />
        
        {/* Description skeleton */}
        <div 
          className="rounded mb-2"
          style={{ 
            height: '14px', 
            backgroundColor: shimmerColor,
            width: '100%'
          }} 
        />
        <div 
          className="rounded mb-4"
          style={{ 
            height: '14px', 
            backgroundColor: shimmerColor,
            width: '80%'
          }} 
        />
        
        {/* Metadata skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div 
            className="rounded"
            style={{ 
              height: '12px', 
              backgroundColor: shimmerColor,
              width: '120px'
            }} 
          />
          <div 
            className="rounded"
            style={{ 
              height: '12px', 
              backgroundColor: shimmerColor,
              width: '80px'
            }} 
          />
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div 
            className="rounded"
            style={{ 
              height: '24px', 
              backgroundColor: shimmerColor,
              width: '60px'
            }} 
          />
          <div 
            className="rounded"
            style={{ 
              height: '24px', 
              backgroundColor: shimmerColor,
              width: '80px'
            }} 
          />
          <div 
            className="rounded"
            style={{ 
              height: '24px', 
              backgroundColor: shimmerColor,
              width: '70px'
            }} 
          />
        </div>
      </div>
    </div>
  );
};