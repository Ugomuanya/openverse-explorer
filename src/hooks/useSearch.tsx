import { useState, useEffect, useCallback } from 'react';
import { searchMedia } from '@/services/openverseApi';
import { SearchParams, MediaType, OpenverseMedia, SearchResponse } from '@/types';
import { toast } from "sonner";

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

      const response = await searchMedia(mediaType, params);
      
      setTotalResults(response.result_count);
      setTotalPages(response.page_count);
      setHasMore(currentPage < response.page_count);

      if (resetResults) {
        setResults(response.results);
        setPage(1);
      } else {
        setResults(prev => [...prev, ...response.results]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Could not fetch search results', {
        description: err instanceof Error ? err.message : 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  }, [query, mediaType, page, pageSize]);

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
  };
}
