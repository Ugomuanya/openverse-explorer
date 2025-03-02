
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Image, Music, Video, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MediaType } from '@/types';

interface SearchBarProps {
  onSearch: (query: string, mediaType: MediaType) => void;
  initialQuery?: string;
  initialMediaType?: MediaType;
  className?: string;
  focused?: boolean;
  onFocusChange?: (focused: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialQuery = '',
  initialMediaType = 'image',
  className,
  focused = false,
  onFocusChange,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [mediaType, setMediaType] = useState<MediaType>(initialMediaType);
  const [isExpanded, setIsExpanded] = useState(focused);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);

  const handleFocus = () => {
    setIsExpanded(true);
    onFocusChange?.(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, mediaType);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleMediaTypeChange = (type: MediaType) => {
    setMediaType(type);
    if (query.trim()) {
      onSearch(query, type);
    }
  };

  return (
    <div 
      className={cn(
        "w-full transition-all duration-300 ease-bounce-in", 
        isExpanded ? "py-4" : "py-2",
        className
      )}
    >
      <form 
        onSubmit={handleSearch}
        className={cn(
          "glass-panel rounded-full flex items-center transition-all duration-300 ease-bounce-in overflow-hidden",
          isExpanded ? "p-2 pr-4" : "p-2",
        )}
      >
        <div 
          className={cn(
            "flex items-center transition-all duration-300 flex-1 gap-3",
            isExpanded ? "pl-3" : "pl-1",
          )}
        >
          <Search 
            className={cn(
              "flex-shrink-0 transition-all duration-300",
              isExpanded ? "w-5 h-5 text-primary" : "w-4 h-4 text-muted-foreground"
            )} 
          />
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for images, music, videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            className={cn(
              "flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 transition-all duration-300 placeholder:text-muted-foreground/70",
              isExpanded ? "text-lg" : "text-base"
            )}
          />
          
          {query && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={handleClear}
              className="flex-shrink-0 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        {isExpanded && (
          <div className="flex items-center space-x-2 border-l border-border/50 pl-4">
            <Button
              type="button"
              size="sm"
              variant={mediaType === 'image' ? 'default' : 'outline'}
              onClick={() => handleMediaTypeChange('image')}
              className="rounded-full h-8 gap-1.5 transition-all"
            >
              <Image className="h-3.5 w-3.5" />
              <span>Images</span>
            </Button>
            
            <Button
              type="button"
              size="sm"
              variant={mediaType === 'audio' ? 'default' : 'outline'}
              onClick={() => handleMediaTypeChange('audio')}
              className="rounded-full h-8 gap-1.5 transition-all"
            >
              <Music className="h-3.5 w-3.5" />
              <span>Audio</span>
            </Button>
            
            <Button
              type="button"
              size="sm"
              variant={mediaType === 'all' ? 'default' : 'outline'}
              onClick={() => handleMediaTypeChange('all')}
              className="rounded-full h-8 gap-1.5 transition-all"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>All</span>
            </Button>
            
            <Button 
              type="submit" 
              className="rounded-full h-8 px-4 transition-all"
            >
              Search
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
