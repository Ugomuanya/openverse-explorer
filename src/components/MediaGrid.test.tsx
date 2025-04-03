
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaGrid from './MediaGrid';
import { OpenverseMedia } from '@/types';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('MediaGrid Component', () => {
  const mockMedia: OpenverseMedia[] = [
    {
      id: '1',
      title: 'Test Media 1',
      creator: 'Test Creator',
      creator_url: 'https://example.com/creator',
      url: 'https://example.com/media1',
      foreign_landing_url: 'https://example.com/media1/source',
      license: 'CC0',
      license_version: '1.0',
      license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
      provider: 'test-provider',
      source: 'test-source',
      thumbnail: 'https://example.com/thumbnail1.jpg',
      detail_url: 'https://example.com/detail1',
      related_url: 'https://example.com/related1',
    },
    {
      id: '2',
      title: 'Test Media 2',
      creator: 'Test Creator 2',
      creator_url: 'https://example.com/creator2',
      url: 'https://example.com/media2',
      foreign_landing_url: 'https://example.com/media2/source',
      license: 'CC BY',
      license_version: '4.0',
      license_url: 'https://creativecommons.org/licenses/by/4.0/',
      provider: 'test-provider',
      source: 'test-source',
      thumbnail: 'https://example.com/thumbnail2.jpg',
      detail_url: 'https://example.com/detail2',
      related_url: 'https://example.com/related2',
    }
  ];

  const mockProps = {
    media: mockMedia,
    loading: false,
    hasMore: true,
    onLoadMore: jest.fn(),
    onMediaClick: jest.fn(),
    totalResults: 100,
  };

  test('renders media items correctly', () => {
    render(<MediaGrid {...mockProps} />);
    
    expect(screen.getByText('Test Media 1')).toBeInTheDocument();
    expect(screen.getByText('Test Media 2')).toBeInTheDocument();
    expect(screen.getByText('Found 100 results')).toBeInTheDocument();
  });

  test('calls onLoadMore when Load more button is clicked', () => {
    render(<MediaGrid {...mockProps} />);
    
    const loadMoreButton = screen.getByText('Load more');
    fireEvent.click(loadMoreButton);
    
    expect(mockProps.onLoadMore).toHaveBeenCalledTimes(1);
  });

  test('shows loading state', () => {
    render(<MediaGrid {...mockProps} loading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('shows empty state when no results', () => {
    render(<MediaGrid {...mockProps} media={[]} />);
    
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or browse for different media types.')).toBeInTheDocument();
  });

  test('shows end of results message when no more results', () => {
    render(<MediaGrid {...mockProps} hasMore={false} />);
    
    expect(screen.getByText("You've reached the end of the results")).toBeInTheDocument();
  });
});
