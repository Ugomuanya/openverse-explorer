
import { useState, useEffect, useCallback } from 'react';
import { searchMedia, searchAudioDirect, searchVideoDirect, searchImageDirect } from '@/services/openverseApi';
import { SearchParams, MediaType, OpenverseMedia, SearchResponse, OpenverseVideoMedia, OpenverseAudioMedia } from '@/types';
import { toast } from "sonner";
import { useAuth } from '@clerk/clerk-react';

interface UseSearchProps {
  initialQuery?: string;
  initialMediaType?: MediaType;
  pageSize?: number;
}

export function useSearch({ 
  initialQuery = '', 
  initialMediaType = 'image',
  pageSize = 20 
}: UseSearchProps = {}) {
  const [query, setQuery] = useState<string>(initialQuery);
  const [mediaType, setMediaType] = useState<MediaType>(initialMediaType);
  const [results, setResults] = useState<OpenverseMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const { isSignedIn } = useAuth();

  // Function to directly search without authentication for faster results
  const fetchDirectResults = useCallback(async (
    searchQuery: string, 
    searchMediaType: MediaType, 
    currentPage: number,
    resetResults: boolean = false
  ) => {
    try {
      console.log(`Direct search for "${searchQuery}" in ${searchMediaType}, page ${currentPage}`);
      
      let response: SearchResponse;
      
      // Use the appropriate API method based on media type for direct fast searches
      if (searchMediaType === 'audio') {
        response = await searchAudioDirect(searchQuery, currentPage, pageSize);
      } else if (searchMediaType === 'video') {
        response = await searchVideoDirect(searchQuery, currentPage, pageSize);
      } else if (searchMediaType === 'image') {
        response = await searchImageDirect(searchQuery, currentPage, pageSize);
      } else {
        // For 'all' media type, use the standard searchMedia function
        const params: SearchParams = {
          q: searchQuery,
          page: currentPage,
          page_size: pageSize,
          filter_dead: true,
        };
        response = await searchMedia(searchMediaType, params);
      }
      
      return response;
    } catch (error) {
      console.error("Error in fetchDirectResults:", error);
      // Return a valid but empty response to avoid crashing
      return {
        result_count: 0,
        page_count: 0,
        page_size: pageSize,
        page: currentPage,
        results: []
      };
    }
  }, [pageSize]);

  const fetchResults = useCallback(async (resetResults: boolean = false) => {
    if (!query.trim()) {
      if (resetResults) {
        setResults([]);
        setTotalResults(0);
        setTotalPages(0);
        setHasMore(false);
      }
      return;
    }

    // Check if user is allowed to search for this media type
    if ((mediaType === 'video' || mediaType === 'all') && !isSignedIn) {
      toast.error('Authentication required', {
        description: 'Please sign in to search for videos and all media types',
      });
      setError('Authentication required to search for videos and all media types');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentPage = resetResults ? 1 : page;
      
      console.log(`Searching for "${query}" in ${mediaType}, page ${currentPage}`);
      
      // Use direct search for faster results
      const response = await fetchDirectResults(query, mediaType, currentPage, resetResults);
      
      console.log("Search response:", response);
      
      // Check if we got valid results (with fallback to empty arrays)
      const resultArray = response?.results || [];
      
      console.log(`Results found: ${resultArray.length}`);
      
      // Process results to ensure consistent format
      const processedResults = resultArray.map(item => {
        // Check media type and ensure thumbnail is available
        if (mediaType === 'video') {
          const videoItem = item as OpenverseVideoMedia;
          return {
            ...item,
            thumbnail: item.thumbnail || videoItem.video_thumbnail || '/placeholder.svg',
            source: item.source || 'openverse',
            provider: item.provider || 'openverse',
            creator_url: item.creator_url || '#',
            license_version: item.license_version || '1.0'
          };
        } else if (mediaType === 'audio') {
          const audioItem = item as OpenverseAudioMedia;
          return {
            ...item,
            thumbnail: item.thumbnail || '/placeholder.svg',
            source: item.source || 'openverse',
            provider: item.provider || 'openverse', 
            creator_url: item.creator_url || '#',
            license_version: item.license_version || '1.0',
            url: audioItem.audio_url || audioItem.url || '', // Ensure URL is available
            foreign_landing_url: item.foreign_landing_url || item.url || '#',
          };
        } else {
          // Default case (image or other)
          return {
            ...item,
            thumbnail: item.thumbnail || '/placeholder.svg',
            source: item.source || 'openverse',
            provider: item.provider || 'openverse',
            creator_url: item.creator_url || '#',
            license_version: item.license_version || '1.0'
          };
        }
      });
      
      const resultCount = response?.result_count || resultArray.length || 0;
      const pageCount = response?.page_count || Math.ceil(resultCount / pageSize) || 0;
      
      setTotalResults(resultCount);
      setTotalPages(pageCount);
      setHasMore(currentPage < pageCount);

      if (resetResults) {
        setResults(processedResults || []);
        setPage(1);
      } else {
        setResults(prev => [...prev, ...(processedResults || [])]);
      }
      
      // Show toast only when we get results
      if (processedResults && processedResults.length > 0) {
        toast.success(`Found ${resultCount} results`);
      } else {
        toast.info("No results found. Try different search terms.");
      }
      
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Could not fetch search results', {
        description: err instanceof Error ? err.message : 'Please try again later',
      });
      
      // Reset results on error if requested
      if (resetResults) {
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, [query, mediaType, page, pageSize, isSignedIn, fetchDirectResults]);

  // Debounce search to prevent rapid-fire API calls
  const debouncedSearch = useCallback((newQuery: string, newMediaType?: MediaType) => {
    const updatedMediaType = newMediaType || mediaType;
    setQuery(newQuery);
    if (newMediaType) setMediaType(newMediaType);
    
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout for the search
    const timeout = setTimeout(() => {
      setPage(1);
      fetchResults(true);
    }, 300); // 300ms debounce delay
    
    setSearchTimeout(timeout);
  }, [mediaType, fetchResults, searchTimeout]);

  const handleSearch = useCallback((newQuery: string, newMediaType?: MediaType) => {
    // For immediate execution without debounce
    const updatedMediaType = newMediaType || mediaType;
    setQuery(newQuery);
    if (newMediaType) setMediaType(newMediaType);
    
    // Reset results for new search
    setPage(1);
    fetchResults(true);
  }, [mediaType, fetchResults]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setPage(prevPage => prevPage + 1);
  }, [loading, hasMore]);

  // Execute initial search if initialQuery is provided
  useEffect(() => {
    if (initialQuery) {
      fetchResults(true);
    }
  }, [initialQuery, fetchResults]);

  // Fetch results when page changes
  useEffect(() => {
    if (page > 1 && query) {
      fetchResults(false);
    }
  }, [page, fetchResults, query]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return {
    query,
    mediaType,
    results,
    loading,
    error,
    totalResults,
    totalPages,
    hasMore,
    page,
    handleSearch,
    debouncedSearch, // Export the debounced search function
    loadMore,
    setMediaType,
    isAuthorized: isSignedIn || (mediaType !== 'video' && mediaType !== 'all'),
  };
}
