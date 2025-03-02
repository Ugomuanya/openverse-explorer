
import React, { useState, useRef } from 'react';
import { useSearch } from '@/hooks/useSearch';
import SearchHero from '@/components/SearchHero';
import SearchBar from '@/components/SearchBar';
import MediaGrid from '@/components/MediaGrid';
import MediaDetail from '@/components/MediaDetail';
import { OpenverseMedia } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<OpenverseMedia | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { 
    query, 
    mediaType, 
    results, 
    loading, 
    totalResults, 
    hasMore, 
    handleSearch, 
    loadMore 
  } = useSearch();
  
  const handleSearchFocus = () => {
    setSearchFocused(true);
    if (searchBarRef.current) {
      searchBarRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleMediaClick = (media: OpenverseMedia) => {
    setSelectedMedia(media);
    setIsDetailOpen(true);
  };
  
  const hasSearched = query !== '';
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <div className="flex items-center space-x-2">
            <div className="font-bold text-xl tracking-tight">OpenVerse Explorer</div>
          </div>
          
          {(searchFocused || hasSearched || isMobile) && (
            <div className="flex-1 max-w-xl mx-4 hidden sm:block">
              <SearchBar 
                onSearch={handleSearch}
                initialQuery={query}
                initialMediaType={mediaType}
                focused={true}
              />
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchHero onSearchFocus={handleSearchFocus} />
              
              <div className="container mx-auto px-4 -mt-12 z-10 relative" ref={searchBarRef}>
                <SearchBar 
                  onSearch={handleSearch}
                  className="max-w-3xl mx-auto shadow-xl"
                  focused={searchFocused}
                  onFocusChange={setSearchFocused}
                />
              </div>
              
              <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto space-y-16 text-center">
                  <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Find the perfect creative assets</h2>
                    <p className="text-muted-foreground">
                      Access millions of images, audio files, and more for your creative projects - all open-licensed and free to use.
                    </p>
                  </section>
                  
                  <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Properly attribution made easy</h2>
                    <p className="text-muted-foreground">
                      Get ready-to-use attribution text for any media you find, making it simple to credit creators correctly.
                    </p>
                  </section>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="container mx-auto px-4 py-8"
            >
              <div className="mb-8 sm:hidden" ref={searchBarRef}>
                <SearchBar 
                  onSearch={handleSearch}
                  initialQuery={query}
                  initialMediaType={mediaType}
                  focused={true}
                />
              </div>
              
              <MediaGrid 
                media={results}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                onMediaClick={handleMediaClick}
                totalResults={totalResults}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Find open-licensed media for your creative projects
            </p>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
              Powered by <a href="https://openverse.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Openverse API</a>
            </p>
          </div>
        </div>
      </footer>
      
      <MediaDetail 
        media={selectedMedia}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};

export default Index;
