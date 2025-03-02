
import React from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export const AuthButtons = () => {
  const { isSignedIn } = useAuth();
  const { openSignIn, openSignUp } = useClerk();

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={() => openSignIn()}
      >
        Sign In
      </Button>
      <Button 
        onClick={() => openSignUp()}
      >
        Sign Up
      </Button>
    </div>
  );
};
