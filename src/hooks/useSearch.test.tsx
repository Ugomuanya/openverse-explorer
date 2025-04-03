
import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';
import { searchMedia, searchAudioDirect, searchImageDirect, searchVideoDirect } from '@/services/openverseApi';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/services/openverseApi');
jest.mock('@clerk/clerk-react', () => ({
  useAuth: jest.fn(),
}));
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('useSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: true });
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useSearch());
    
    expect(result.current.query).toBe('');
    expect(result.current.mediaType).toBe('image');
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.page).toBe(1);
    expect(result.current.totalResults).toBe(0);
    expect(result.current.hasMore).toBe(false);
  });

  test('should initialize with provided values', () => {
    const { result } = renderHook(() => useSearch({
      initialQuery: 'test',
      initialMediaType: 'audio',
      pageSize: 10,
    }));
    
    expect(result.current.query).toBe('test');
    expect(result.current.mediaType).toBe('audio');
  });

  test('should require auth for video search', async () => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: false });
    
    const { result } = renderHook(() => useSearch({
      initialQuery: 'test',
      initialMediaType: 'video',
    }));

    await act(async () => {
      result.current.handleSearch('test');
    });
    
    expect(toast.error).toHaveBeenCalledWith('Authentication required', expect.any(Object));
    expect(result.current.error).toBe('Authentication required to search for videos and all media types');
  });

  test('should fetch results when search is called', async () => {
    const mockResponse = {
      result_count: 10,
      page_count: 1,
      page_size: 20,
      page: 1,
      results: [{ id: '1', title: 'Test Result', thumbnail: 'thumbnail.jpg' }],
    };

    (searchImageDirect as jest.Mock).mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useSearch());
    
    await act(async () => {
      result.current.handleSearch('test');
    });
    
    expect(searchImageDirect).toHaveBeenCalledWith('test', 1, 20);
    expect(result.current.results.length).toBe(1);
    expect(result.current.totalResults).toBe(10);
    expect(toast.success).toHaveBeenCalledWith('Found 10 results');
  });
});
