import { useState, useEffect, useCallback } from 'react';
import { searchMedia } from '@/services/openverseApi';
import { SearchParams, MediaType, OpenverseMedia, SearchResponse } from '@/types';
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
  const { isSignedIn } = useAuth();

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
    if ((mediaType === 'image' || mediaType === 'video') && !isSignedIn) {
      toast.error('Authentication required', {
        description: 'Please sign in to search for images and videos',
      });
      setError('Authentication required to search for images and videos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentPage = resetResults ? 1 : page;
      
      const params: SearchParams = {
        q: query,
        page: currentPage,
        page_size: pageSize,
        filter_dead: true,
      };

      console.log(`Searching for "${query}" in ${mediaType}, page ${currentPage}`);
      
      const response = await searchMedia(mediaType, params);
      console.log("Search response:", response);
      
      // Check if we got valid results
      if (!response || !response.results) {
        console.error("No valid response from API");
        throw new Error("Invalid response format from API");
      }
      
      console.log(`Results found: ${response.results.length}`);
      
      // Handle case where audio API returns different structure
      if (mediaType === 'audio' && Array.isArray(response.results)) {
        response.results = response.results.map(item => {
          // Transform audio-specific fields if needed
          return {
            ...item,
            thumbnail: item.thumbnail || '/placeholder.svg'
          };
        });
      }
      
      setTotalResults(response.result_count || 0);
      setTotalPages(response.page_count || 0);
      setHasMore(currentPage < (response.page_count || 0));

      if (resetResults) {
        setResults(response.results || []);
        setPage(1);
      } else {
        setResults(prev => [...prev, ...(response.results || [])]);
      }
      
      // Show toast only when we get results
      if (response.results && response.results.length > 0) {
        toast.success(`Found ${response.result_count} results`);
      } else if (response.result_count === 0) {
        toast.info("No results found. Try different search terms.");
      }
      
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Could not fetch search results', {
        description: err instanceof Error ? err.message : 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  }, [query, mediaType, page, pageSize, isSignedIn]);

  const handleSearch = useCallback((newQuery: string, newMediaType?: MediaType) => {
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
    loadMore,
    setMediaType,
    isAuthorized: isSignedIn || (mediaType !== 'image' && mediaType !== 'video'),
  };
}
