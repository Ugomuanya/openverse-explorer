
import '@testing-library/jest-dom';

// Mock the Clerk library
jest.mock('@clerk/clerk-react', () => ({
  useAuth: jest.fn(),
  SignInButton: ({ children }) => <div data-testid="sign-in-button">{children}</div>,
  SignUpButton: ({ children }) => <div data-testid="sign-up-button">{children}</div>,
  UserButton: ({ afterSignOutUrl }) => <div data-testid="user-button" data-url={afterSignOutUrl}></div>,
}));

// Mock matchMedia for components that might need it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
