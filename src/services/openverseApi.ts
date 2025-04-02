import { SearchParams, MediaType, SearchResponse } from '@/types';

// Base URL for Openverse API
const BASE_URL = 'https://api.openverse.org';
const ENGINEERING_BASE_URL = 'https://api.openverse.engineering';

// Authentication credentials
const client_id = '56qA4YKTCOwu9CafxN3xUVPYoeu6ypXCypD1UiLf'
const client_secret = 'RWncDWZrDqnsRCPZNYifiQsuXStUWjJxTyRygJEPlgaBVpTTEimeZ8YdALW2f0qzTERYNagwNgwTJyfCrH1lcnJq3yLdHoNRy8z9Z499TSjocGq9SYeeRLv7BQ2IUl2n'

// Token storage
let accessToken: string | null = null;
let tokenExpiryTime: number | null = null;

// Headers for API requests
const getHeaders = async () => {
  const token = await getAccessToken();
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

/**
 * Get an access token for the Openverse API
 */
const getAccessToken = async (): Promise<string | null> => {
  // Return existing token if it's still valid
  if (accessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return accessToken;
  }
  
  try {
    const tokenUrl = `${BASE_URL}/v1/auth_tokens/token/`;
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        grant_type: 'client_credentials'
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to get access token:', response.status);
      throw new Error(`Failed to get access token: ${response.status}`);
    }
    
    const data = await response.json();
    accessToken = data.access_token;
    // Set expiry time (token typically lasts 24 hours, set slightly shorter to be safe)
    tokenExpiryTime = Date.now() + (data.expires_in * 1000) - 60000;
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Direct search for audio content (no auth required)
 * Uses CORS proxy to bypass CORS restrictions
 * @param query - Search term
 * @param page - Page number
 * @param pageSize - Items per page
 * @returns Promise with audio search results
 */
export const searchAudioDirect = async (
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<any> => {
  try {
    // Use a CORS proxy to bypass CORS issues
    const apiUrl = `https://corsproxy.io/?${encodeURIComponent(`${ENGINEERING_BASE_URL}/v1/audio/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`)}`;
    
    console.log(`Fetching audio directly from (with CORS proxy): ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Audio API response error:', response.status, errorText);
      throw new Error(`Audio API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Direct audio search results:', data);
    
    // If we got no results but no error, return empty results set
    if (!data || !data.results) {
      return {
        result_count: 0,
        page_count: 0,
        results: []
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching audio directly:', error);
    // Return empty result set on error to prevent app from crashing
    return {
      result_count: 0,
      page_count: 0,
      results: []
    };
  }
};

/**
 * Direct search for video content 
 * Uses CORS proxy to bypass CORS restrictions
 * @param query - Search term
 * @param page - Page number
 * @param pageSize - Items per page
 * @returns Promise with video search results
 */
export const searchVideoDirect = async (
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<any> => {
  try {
    // Use a CORS proxy to bypass CORS issues
    const apiUrl = `https://corsproxy.io/?${encodeURIComponent(`${ENGINEERING_BASE_URL}/v1/video/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`)}`;
    
    console.log(`Fetching video directly from (with CORS proxy): ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Video API response error:', response.status, errorText);
      throw new Error(`Video API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Direct video search results:', data);
    
    // If we got no results but no error, return empty results set
    if (!data || !data.results) {
      return {
        result_count: 0,
        page_count: 0,
        results: []
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching video directly:', error);
    // Return empty result set on error to prevent app from crashing
    return {
      result_count: 0,
      page_count: 0,
      results: []
    };
  }
};

/**
 * Direct search for image content - faster than using authenticated API
 * Uses CORS proxy to bypass CORS restrictions
 * @param query - Search term
 * @param page - Page number
 * @param pageSize - Items per page
 * @returns Promise with image search results
 */
export const searchImageDirect = async (
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<any> => {
  try {
    // Use a CORS proxy to bypass CORS issues
    const apiUrl = `https://corsproxy.io/?${encodeURIComponent(`${ENGINEERING_BASE_URL}/v1/images/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`)}`;
    
    console.log(`Fetching images directly from (with CORS proxy): ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image API response error:', response.status, errorText);
      throw new Error(`Image API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Direct image search results:', data);
    
    // If we got no results but no error, return empty results set
    if (!data || !data.results) {
      return {
        result_count: 0,
        page_count: 0,
        results: []
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching images directly:', error);
    // Return empty result set on error to prevent app from crashing
    return {
      result_count: 0,
      page_count: 0,
      results: []
    };
  }
};

/**
 * Search for media in Openverse
 * @param mediaType - Type of media to search for (image, audio, etc.)
 * @param params - Search parameters
 * @returns Promise with search results
 */
export const searchMedia = async (mediaType: MediaType, params: SearchParams): Promise<SearchResponse> => {
  try {
    // Use direct methods for faster performance
    if (mediaType === 'audio') {
      return await searchAudioDirect(params.q, params.page, params.page_size);
    }
    
    if (mediaType === 'video') {
      return await searchVideoDirect(params.q, params.page, params.page_size);
    }
    
    if (mediaType === 'image') {
      return await searchImageDirect(params.q, params.page, params.page_size);
    }
    
    // For 'all' media type, use the standard API with authentication
    // Use a CORS proxy to bypass CORS issues
    const endpoint = '/v1/search';
    
    // Construct query string from params
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    // Add console log for debugging
    const apiUrl = `https://corsproxy.io/?${encodeURIComponent(`${BASE_URL}${endpoint}?${queryParams.toString()}`)}`;
    console.log(`Fetching from: ${apiUrl}`);
    
    // Make the request with authorization header
    const headers = await getHeaders();
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      mode: 'cors',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', response.status, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Search results:', data);
    
    // If we got no results but no error, return empty results set
    if (!data || !data.results) {
      return {
        result_count: 0,
        page_count: 0,
        page_size: pageSize,
        page: params.page || 1,
        results: []
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching media:', error);
    // Return empty result set on error to prevent app from crashing
    return {
      result_count: 0,
      page_count: 0,
      page_size: params.page_size || 20,
      page: params.page || 1,
      results: []
    };
  }
};

/**
 * Get detailed information for a specific media item
 * @param mediaType - Type of media
 * @param id - Media ID
 * @returns Promise with media details
 */
export const getMediaDetail = async (mediaType: MediaType, id: string) => {
  try {
    // Only image and audio are supported for detail endpoints
    if (mediaType !== 'image' && mediaType !== 'audio') {
      throw new Error('Invalid media type for detail view');
    }
    
    const endpoint = `/v1/${mediaType}s/${id}`;
    
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching media detail:', error);
    throw error;
  }
};

/**
 * Get related media for a specific item
 * @param mediaType - Type of media
 * @param id - Media ID
 * @returns Promise with related media
 */
export const getRelatedMedia = async (mediaType: MediaType, id: string) => {
  try {
    // Only image and audio are supported for related endpoints
    if (mediaType !== 'image' && mediaType !== 'audio') {
      throw new Error('Invalid media type for related media');
    }
    
    const endpoint = `/v1/${mediaType}s/${id}/related`;
    
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching related media:', error);
    throw error;
  }
};
