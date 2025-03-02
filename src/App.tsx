
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkLoaded, ClerkLoading, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [authError, setAuthError] = useState(false);
  const { isLoaded } = useAuth();

  // Handle auth initialization errors gracefully
  useEffect(() => {
    const handleAuthError = () => {
      if (!isLoaded) {
        const timer = setTimeout(() => {
          console.log("Auth timeout - continuing without authentication");
          setAuthError(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    };
    
    handleAuthError();
  }, [isLoaded]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {authError ? (
            // If auth fails, render the app without waiting for Clerk
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={
                <div className="container mx-auto p-8 text-center">
                  <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                  <p>You need to be signed in to view this page.</p>
                </div>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <>
              <ClerkLoading>
                <div className="min-h-screen flex items-center justify-center">
                  Loading authentication...
                </div>
              </ClerkLoading>
              <ClerkLoaded>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ClerkLoaded>
            </>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
