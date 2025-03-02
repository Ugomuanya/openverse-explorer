
import { UserButton as ClerkUserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export const UserButton = () => {
  return (
    <ClerkUserButton afterSignOutUrl="/">
      <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0">
        <span className="sr-only">User account</span>
      </Button>
    </ClerkUserButton>
  );
};
