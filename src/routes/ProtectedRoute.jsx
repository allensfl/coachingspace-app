
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStateContext } from '@/context/AppStateContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, packageId }) => {
  const { state } = useAppStateContext();
  const { activePackages, isLoading } = state;
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (packageId && activePackages && !activePackages.includes(packageId)) {
    return <Navigate to="/store" replace />;
  }

  return children;
};

export default ProtectedRoute;
