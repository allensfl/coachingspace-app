import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Einfache Alert-Komponente da sie nicht existiert
const Alert = ({ children, className }) => (
  <div className={`rounded-lg p-3 ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children, className }) => (
  <p className={className}>
    {children}
  </p>
);
import { Shield, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

// Einfache Verschlüsselung für lokalen Speicher
const encrypt = (text, password) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ password.charCodeAt(i % password.length));
  }
  return btoa(result);
};

const decrypt = (encryptedText, password) => {
  try {
    const text = atob(encryptedText);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ password.charCodeAt(i % password.length));
    }
    return result;
  } catch {
    return null;
  }
};

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
  }
  return context;
};

// Passwort-Stärke-Prüfung
const checkPasswordStrength = (password) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  
  return {
    score,
    isStrong: score >= 4,
    feedback: score < 2 ? 'Sehr schwach' : score < 3 ? 'Schwach' : score < 4 ? 'Mittel' : score < 5 ? 'Stark' : 'Sehr stark',
    color: score < 2 ? 'text-red-500' : score < 3 ? 'text-orange-500' : score < 4 ? 'text-yellow-500' : score < 5 ? 'text-green-500' : 'text-emerald-500'
  };
};

// Login/Setup Screen
const AuthScreen = ({ onAuthenticated }) => {
  const [mode, setMode] = useState('check');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasPassword = localStorage.getItem('coaching_auth_hash');
    setMode(hasPassword ? 'login' : 'setup');
  }, []);

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSetup = async () => {
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    const strength = checkPasswordStrength(password);
    if (!strength.isStrong) {
      setError('Bitte wähle ein stärkeres Passwort (mindestens 8 Zeichen, Groß-/Kleinbuchstaben, Zahlen)');
      return;
    }

    setIsLoading(true);
    try {
      const hash = await hashPassword(password);
      localStorage.setItem('coaching_auth_hash', hash);
      localStorage.setItem('coaching_auth_setup', new Date().toISOString());
      onAuthenticated(password);
    } catch (err) {
      setError('Fehler beim Speichern des Passworts');
    }
    setIsLoading(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const storedHash = localStorage.getItem('coaching_auth_hash');
      const inputHash = await hashPassword(password);
      
      if (storedHash === inputHash) {
        onAuthenticated(password);
      } else {
        setError('Falsches Passwort');
        setPassword('');
      }
    } catch (err) {
      setError('Fehler bei der Anmeldung');
    }
    setIsLoading(false);
  };

  const passwordStrength = password ? checkPasswordStrength(password) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/95 border-gray-700 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-white">
            {mode === 'setup' ? 'Sicherheit einrichten' : 'Coachingspace entsperren'}
          </CardTitle>
          <p className="text-gray-400 text-sm mt-2">
            {mode === 'setup' 
              ? 'Schütze deine Coaching-Daten mit einem sicheren Passwort'
              : 'Gib dein Passwort ein um fortzufahren'
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              {mode === 'setup' ? 'Neues Passwort' : 'Passwort'}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="bg-gray-700 border-gray-600 text-white pr-10"
                placeholder="Sicheres Passwort eingeben"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 w-4" />}
              </Button>
            </div>
            
            {mode === 'setup' && passwordStrength && (
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Passwort-Stärke:</span>
                  <span className={passwordStrength.color}>{passwordStrength.feedback}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      passwordStrength.score < 2 ? 'bg-red-500' :
                      passwordStrength.score < 3 ? 'bg-orange-500' :
                      passwordStrength.score < 4 ? 'bg-yellow-500' :
                      passwordStrength.score < 5 ? 'bg-green-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {mode === 'setup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Passwort wiederholen"
                disabled={isLoading}
              />
            </div>
          )}

          <Button
            onClick={mode === 'setup' ? handleSetup : handleLogin}
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading || !password || (mode === 'setup' && !confirmPassword)}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {mode === 'setup' ? 'Einrichten...' : 'Anmelden...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {mode === 'setup' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {mode === 'setup' ? 'Passwort einrichten' : 'Entsperren'}
              </div>
            )}
          </Button>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
            <div className="text-blue-400 text-sm font-medium mb-1">🔒 Datenschutz-konform</div>
            <p className="text-xs text-gray-400">
              Alle Daten werden nur lokal gespeichert. Kein Server-Upload.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authKey, setAuthKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Session-Check: 8 Stunden angemeldet bleiben
    const sessionKey = sessionStorage.getItem('coaching_session');
    const sessionTime = sessionStorage.getItem('coaching_session_time');
    
    if (sessionKey && sessionTime) {
      const now = new Date().getTime();
      const sessionStart = parseInt(sessionTime);
      const eightHours = 8 * 60 * 60 * 1000;
      
      if (now - sessionStart < eightHours) {
        setAuthKey(sessionKey);
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem('coaching_session');
        sessionStorage.removeItem('coaching_session_time');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleAuthenticated = (password) => {
    setAuthKey(password);
    setIsAuthenticated(true);
    
    sessionStorage.setItem('coaching_session', password);
    sessionStorage.setItem('coaching_session_time', new Date().getTime().toString());
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthKey(null);
    sessionStorage.removeItem('coaching_session');
    sessionStorage.removeItem('coaching_session_time');
  };

  const value = {
    isAuthenticated,
    authKey,
    logout,
    encrypt: (data) => authKey ? encrypt(JSON.stringify(data), authKey) : null,
    decrypt: (encryptedData) => {
      if (!authKey || !encryptedData) return null;
      const decrypted = decrypt(encryptedData, authKey);
      try {
        return decrypted ? JSON.parse(decrypted) : null;
      } catch {
        return null;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Lade Coachingspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};