import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const BetaAuthGuard = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkBetaAccess();
  }, []);

  const checkBetaAccess = () => {
    // Prüfe ob Beta-Token vorhanden
    const token = sessionStorage.getItem('beta_access_token');
    const userEmail = sessionStorage.getItem('beta_user_email');

    if (token && userEmail) {
      // User ist authorisiert
      setIsAuthorized(true);
    } else {
      // Kein Token - zurück zur Landing Page
      window.location.href = 'https://landingbetaapp.netlify.app';
    }

    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Zugriff wird geprüft...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
};

export default BetaAuthGuard;
