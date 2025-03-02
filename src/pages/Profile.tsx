
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const Profile = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
              {user?.imageUrl && (
                <img 
                  src={user.imageUrl} 
                  alt={user.fullName || 'User'} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{user?.fullName || 'User'}</h1>
              <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-4 bg-card">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="text-muted-foreground">Full Name</div>
                <div>{user?.fullName || 'Not provided'}</div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="text-muted-foreground">Email</div>
                <div>{user?.primaryEmailAddress?.emailAddress || 'Not provided'}</div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="text-muted-foreground">Username</div>
                <div>{user?.username || 'Not provided'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
