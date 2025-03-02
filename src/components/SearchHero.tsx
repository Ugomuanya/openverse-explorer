
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchHeroProps {
  onSearchFocus: () => void;
  className?: string;
}

const SearchHero: React.FC<SearchHeroProps> = ({ onSearchFocus, className }) => {
  return (
    <div className={cn("relative py-24 overflow-hidden", className)}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent"></div>
      <div className="absolute inset-0 bg-noise opacity-[0.015]"></div>
      
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 dark:bg-primary/5"
            style={{
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 80 + 40}px`,
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
            }}
            initial={{ y: 0, opacity: 0.5 }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      <div className="container relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.span 
            className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary inline-block mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            Discover Open-Licensed Media
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Find perfect media for your next project
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explore millions of freely usable images, music, and more — all properly licensed for creative projects.
          </motion.p>
        </motion.div>
        
        <motion.div
          onClick={onSearchFocus}
          className="animate-pulse-soft cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="h-14 rounded-full bg-background shadow-lg border border-border/50 flex items-center justify-center text-muted-foreground">
            <span>Click to start searching...</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchHero;
