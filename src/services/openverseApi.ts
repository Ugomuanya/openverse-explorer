
import { SearchParams, MediaType, SearchResponse } from '@/types';

// Base URL for Openverse API
const BASE_URL = 'https://api.openverse.engineering';

// Headers for API requests
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

/**
 * Search for media in Openverse
 * @param mediaType - Type of media to search for (image, audio, etc.)
 * @param params - Search parameters
 * @returns Promise with search results
 */
export const searchMedia = async (mediaType: MediaType, params: SearchParams): Promise<SearchResponse> => {
  try {
    // Construct the URL based on media type
    const endpoint = mediaType === 'all' ? '/v1/search' : `/v1/${mediaType}s`;
    
    // Construct query string from params
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    // Make the request
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams.toString()}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching media:', error);
    throw error;
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
