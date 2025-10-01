import React from 'react';
import { motion } from 'framer-motion';
import { Home, Sparkles } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className={`${sizeClasses[size]} border-2 border-luxury-200 dark:border-luxury-800 rounded-full`}
          />
          
          {/* Inner rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className={`absolute inset-1 border-2 border-t-luxury-500 border-r-transparent border-b-transparent border-l-transparent rounded-full`}
          />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Home className="w-3 h-3 text-luxury-600 dark:text-luxury-400" />
            </motion.div>
          </div>
          
          {/* Sparkle effects */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="absolute -inset-2"
          >
            <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 text-luxury-400 opacity-60" />
            <Sparkles className="absolute bottom-0 right-0 w-2 h-2 text-luxury-500 opacity-40" />
            <Sparkles className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 text-luxury-600 opacity-50" />
          </motion.div>
        </div>
        
        {text && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`${textSizeClasses[size]} font-medium text-luxury-700 dark:text-luxury-300`}
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-luxury-200 dark:bg-luxury-800 rounded-lg"></div>
    </div>
  );
};

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="luxury-card animate-pulse">
      <div className="h-48 bg-luxury-200 dark:bg-luxury-800 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-luxury-200 dark:bg-luxury-800 rounded w-3/4"></div>
        <div className="h-4 bg-luxury-200 dark:bg-luxury-800 rounded w-1/2"></div>
        <div className="h-4 bg-luxury-200 dark:bg-luxury-800 rounded w-2/3"></div>
      </div>
    </div>
  );
};