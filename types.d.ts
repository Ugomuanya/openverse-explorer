
// Global type declarations for testing libraries
import '@testing-library/jest-dom';

// Declare Jest globals
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(className: string): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }
}
