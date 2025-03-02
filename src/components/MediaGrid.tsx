
import React from 'react';
import { OpenverseMedia } from '@/types';
import MediaCard from './MediaCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MediaGridProps {
  media: OpenverseMedia[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onMediaClick: (media: OpenverseMedia) => void;
  totalResults?: number;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  loading,
  hasMore,
  onLoadMore,
  onMediaClick,
  totalResults = 0,
}) => {
  if (media.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="glass-panel rounded-xl p-8 max-w-md">
          <h3 className="text-xl font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or browse for different media types.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {totalResults > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Found {totalResults.toLocaleString()} results
          </p>
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="media-grid"
      >
        {media.map((item) => (
          <MediaCard key={item.id} media={item} onClick={onMediaClick} />
        ))}
        
        {/* Loading placeholders */}
        {loading && [...Array(4)].map((_, index) => (
          <div 
            key={`skeleton-${index}`} 
            className="rounded-lg border border-border/40 bg-card animate-pulse"
          >
            <div className="aspect-[4/3] bg-muted"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </motion.div>
      
      {media.length > 0 && (
        <div className="flex justify-center pt-4">
          {hasMore && (
            <Button
              variant="outline"
              size="lg"
              onClick={onLoadMore}
              disabled={loading}
              className="rounded-full px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load more'
              )}
            </Button>
          )}
          
          {!hasMore && media.length > 10 && (
            <p className="text-muted-foreground text-sm">
              You've reached the end of the results
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaGrid;
