
import React from "react";
import { UserButton as ClerkUserButton } from "@clerk/clerk-react";

export const UserButton = () => {
  return (
    <ClerkUserButton 
      appearance={{
        elements: {
          userButtonAvatarBox: "w-9 h-9"
        }
      }}
    />
  );
};
