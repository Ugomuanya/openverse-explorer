
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Set Clerk publishable key
// Use import.meta.env for Vite environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_dG9sZXJhbnQtZmlzaC05Mi5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: { colorPrimary: '#3B82F6' }
      }}
      // Add the following options to work in preview environments
      allowedRedirectOrigins={[
        /^https?:\/\/localhost(:\d+)?$/,
        /^https?:\/\/[\w-]+\.lovableproject\.com$/,
        /^https?:\/\/[\w-]+\.netlify\.app$/,
        /^https?:\/\/[\w-]+\.vercel\.app$/
      ]}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
