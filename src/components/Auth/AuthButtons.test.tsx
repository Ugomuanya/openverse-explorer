
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthButtons } from './AuthButtons';
import { useAuth } from '@clerk/clerk-react';

// Mock the useAuth hook from Clerk
jest.mock('@clerk/clerk-react', () => ({
  ...jest.requireActual('@clerk/clerk-react'),
  useAuth: jest.fn(),
}));

describe('AuthButtons', () => {
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
  });

  test('shows loading state when auth is not loaded', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: false,
      isSignedIn: false,
    });

    render(<AuthButtons />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Sign In').closest('button')).toBeDisabled();
    expect(screen.getByText('Sign Up').closest('button')).toBeDisabled();
  });

  test('shows sign in and sign up buttons when user is not signed in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });

    render(<AuthButtons />);
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-up-button')).toBeInTheDocument();
  });

  test('shows user button when user is signed in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });

    render(<AuthButtons />);
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });
});
