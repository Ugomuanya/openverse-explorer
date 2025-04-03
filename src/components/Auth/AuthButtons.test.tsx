
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthButtons } from './AuthButtons';
import { useAuth } from '@clerk/clerk-react';

// Mock the Clerk auth hook
jest.mock('@clerk/clerk-react', () => ({
  useAuth: jest.fn(),
  SignInButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-in-button">{children}</div>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-up-button">{children}</div>,
  UserButton: () => <div data-testid="user-button">User Button</div>,
}));

describe('AuthButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state when auth is not loaded', () => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: false, isLoaded: false });
    
    render(<AuthButtons />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getAllByRole('button')[0]).toBeDisabled();
    expect(screen.getAllByRole('button')[1]).toBeDisabled();
  });

  test('renders sign in and sign up buttons when user is not signed in', () => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: false, isLoaded: true });
    
    render(<AuthButtons />);
    
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-up-button')).toBeInTheDocument();
  });

  test('renders user button when user is signed in', () => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: true, isLoaded: true });
    
    render(<AuthButtons />);
    
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });
});
