import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const styles: React.CSSProperties = {
    width,
    height,
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded-md h-4 w-3/4 my-1';
      case 'rectangular':
      default:
        return 'rounded-xl';
    }
  };

  return (
    <div
      style={styles}
      className={`animate-pulse bg-slate-200 dark:bg-slate-800/80 ${getVariantClass()} ${className}`}
    />
  );
};
