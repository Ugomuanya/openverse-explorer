
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="outline" className="mb-8" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto bg-card rounded-lg border shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-muted shrink-0">
                {user?.imageUrl && (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || "Profile"} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.fullName || "User"}</h2>
                <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium">Email:</span> {user?.primaryEmailAddress?.emailAddress}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Account created:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
