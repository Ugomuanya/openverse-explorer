
import React from 'react';
import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";

export const AuthButtons = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // If authentication is still loading or has error, show disabled buttons
  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>Sign In</Button>
        <Button size="sm" disabled>Sign Up</Button>
      </div>
    );
  }

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />;
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <Button variant="outline" size="sm">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button size="sm">Sign Up</Button>
      </SignUpButton>
    </div>
  );
};
