
import React from 'react';
import { SignInButton, SignUpButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "./UserButton";
import { motion } from "framer-motion";

export const AuthButtons = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div className="w-20 h-8"></div>;
  }

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm">Sign in</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button variant="default" size="sm">Sign up</Button>
      </SignUpButton>
    </motion.div>
  );
};
