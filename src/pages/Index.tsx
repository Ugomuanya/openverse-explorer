
import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '@/hooks/useSearch';
import SearchHero from '@/components/SearchHero';
import SearchBar from '@/components/SearchBar';
import MediaGrid from '@/components/MediaGrid';
import MediaDetail from '@/components/MediaDetail';
import { OpenverseMedia } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from "sonner";
import { ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ScreenshotToolbar from '@/components/ScreenshotToolbar';

const Index = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<OpenverseMedia | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [screenshotToolVisible, setScreenshotToolVisible] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { 
    query, 
    mediaType, 
    results, 
    loading, 
    error,
    totalResults, 
    hasMore, 
    handleSearch, 
    loadMore 
  } = useSearch();
  
  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setShowScrollTop(mainRef.current.scrollTop > 300);
      }
    };
    
    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
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
  
  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  const toggleScreenshotTool = () => {
    setScreenshotToolVisible(prev => !prev);
  };
  
  const hasSearched = query !== '';
  
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <Toaster position="top-center" />
      
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-bold text-xl tracking-tight">OpenVerse Explorer</div>
          </motion.div>
          
          {(searchFocused || hasSearched || isMobile) && (
            <motion.div 
              className="flex-1 max-w-xl mx-4 hidden sm:block"
              id="search-bar"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <SearchBar 
                onSearch={handleSearch}
                initialQuery={query}
                initialMediaType={mediaType}
                focused={true}
              />
            </motion.div>
          )}
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto" ref={mainRef} id="main-content">
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
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
                <div className="max-w-3xl mx-auto space-y-16">
                  <motion.section 
                    className="space-y-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold">Find the perfect creative assets</h2>
                    <p className="text-muted-foreground">
                      Access millions of images, audio files, and more for your creative projects - all open-licensed and free to use.
                    </p>
                  </motion.section>
                  
                  <motion.section 
                    className="space-y-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold">Properly attribution made easy</h2>
                    <p className="text-muted-foreground">
                      Get ready-to-use attribution text for any media you find, making it simple to credit creators correctly.
                    </p>
                  </motion.section>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
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
              
              {error && (
                <motion.div 
                  className="my-8 p-4 border border-destructive/20 bg-destructive/10 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-destructive font-medium">Error: {error}</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Please try again or check your connection.
                  </p>
                </motion.div>
              )}
              
              <div id="media-results">
                <MediaGrid 
                  media={results}
                  loading={loading}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  onMediaClick={handleMediaClick}
                  totalResults={totalResults}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showScrollTop && (
            <motion.div 
              className="fixed bottom-6 right-6 z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                onClick={scrollToTop} 
                size="icon" 
                className="h-10 w-10 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ChevronUp className="h-5 w-5" />
                <span className="sr-only">Scroll to top</span>
              </Button>
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
      
      <div id="media-detail">
        <MediaDetail 
          media={selectedMedia}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      </div>
      
      <AnimatePresence>
        <ScreenshotToolbar 
          visible={screenshotToolVisible} 
          onToggle={toggleScreenshotTool} 
        />
      </AnimatePresence>
    </div>
  );
};

export default Index;
