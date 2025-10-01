import React, { useState, useEffect, createContext, useContext } from 'react';
import { Eye, EyeOff, Lock, Shield, Download, AlertTriangle, Copy, Check } from 'lucide-react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utility functions
const generateSalt = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const hashPassword = async (password, salt) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 5; i++) {
    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    codes.push(`COACH-${part1}-${part2}`);
  }
  return codes;
};

const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  const strength = score < 3 ? 'schwach' : score < 4 ? 'mittel' : 'stark';
  const color = score < 3 ? 'text-red-400' : score < 4 ? 'text-yellow-400' : 'text-green-400';
  
  return { checks, score, strength, color };
};

const BackupCodesDisplay = ({ codes, onComplete }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const downloadCodes = () => {
    const content = `COACHING-APP BACKUP-CODES - SICHER VERWAHREN!

Diese 5 Codes ermöglichen es Ihnen, ein vergessenes Passwort zurückzusetzen.
Jeder Code kann nur EINMAL verwendet werden.

Backup-Codes:
${codes.map((code, i) => `${i + 1}. ${code}`).join('\n')}

WICHTIGE HINWEISE:
- Drucken Sie diese Codes aus und verwahren Sie sie sicher
- Verwahren Sie sie NICHT digital auf Ihrem Computer
- Jeder Code funktioniert nur EINMAL
- Bei Verlust aller Codes sind Ihre Daten unwiderruflich verloren

Generiert am: ${new Date().toLocaleDateString('de-DE')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coaching-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const copyToClipboard = () => {
    const text = codes.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-slate-700">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-blue-400 mr-2" />
          <h2 className="text-xl font-bold text-white">Backup-Codes generiert</h2>
        </div>
        
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-300">Wichtig!</h3>
              <p className="text-sm text-red-200">
                Diese Codes ermöglichen Passwort-Reset. Verwahren Sie sie sicher und NICHT digital.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2 text-white">Ihre Backup-Codes:</h3>
          <div className="space-y-1 font-mono text-sm">
            {codes.map((code, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-600/50 p-2 rounded border border-slate-500">
                <span className="text-gray-200">{i + 1}. {code}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={downloadCodes}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Als Textdatei herunterladen
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Kopiert!' : 'In Zwischenablage kopieren'}
          </button>

          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-sm text-yellow-200">
              <strong>Nächste Schritte:</strong> Drucken Sie die Codes aus und verwahren Sie sie an einem sicheren Ort. 
              Digital gespeicherte Codes sind ein Sicherheitsrisiko.
            </p>
          </div>

          <button
            onClick={onComplete}
            disabled={!downloaded}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              downloaded
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {downloaded ? 'Codes gesichert - Weiter zur App' : 'Bitte zuerst herunterladen'}
          </button>
        </div>
      </div>
    </div>
  );
};

const BackupCodeInput = ({ onSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateBackupCode = async () => {
    if (!code.trim()) {
      setError('Bitte geben Sie einen Backup-Code ein');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const storedCodes = JSON.parse(localStorage.getItem('backupCodes') || '[]');
      const normalizedCode = code.trim().toUpperCase();
      
      if (storedCodes.includes(normalizedCode)) {
        // Code verwenden (entfernen)
        const remainingCodes = storedCodes.filter(c => c !== normalizedCode);
        localStorage.setItem('backupCodes', JSON.stringify(remainingCodes));
        
        onSuccess(remainingCodes.length);
      } else {
        setError('Ungültiger oder bereits verwendeter Backup-Code');
      }
    } catch (err) {
      setError('Fehler bei der Code-Validierung');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-slate-700">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-blue-400 mr-2" />
          <h2 className="text-xl font-bold text-white">Passwort mit Backup-Code zurücksetzen</h2>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-300 mb-4">
            Geben Sie einen Ihrer 5 Backup-Codes ein, um ein neues Passwort zu setzen.
          </p>
          
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-200">
              <strong>Hinweis:</strong> Jeder Code kann nur einmal verwendet werden.
            </p>
          </div>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="COACH-XXXX-XXXX"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            autoFocus
          />
          
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={validateBackupCode}
            disabled={isValidating}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isValidating ? 'Prüfe...' : 'Code verwenden'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [showBackupCodeInput, setShowBackupCodeInput] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const hasPassword = localStorage.getItem('appPasswordHash');
      const sessionValid = localStorage.getItem('sessionValid');
      const sessionTime = localStorage.getItem('sessionTime');
      
      if (!hasPassword) {
        setShowSetup(true);
        setIsLoading(false);
        return;
      }

      if (sessionValid && sessionTime) {
        const now = new Date().getTime();
        const session = parseInt(sessionTime);
        const eightHours = 8 * 60 * 60 * 1000;
        
        if (now - session < eightHours) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }
      
      localStorage.removeItem('sessionValid');
      localStorage.removeItem('sessionTime');
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const setupPassword = async () => {
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    const strength = checkPasswordStrength(password);
    if (strength.score < 3) {
      setError('Passwort ist zu schwach. Mindestens 8 Zeichen mit Groß-/Kleinbuchstaben und Zahlen');
      return;
    }

    setIsSettingUp(true);
    
    try {
      const salt = generateSalt();
      const hashedPassword = await hashPassword(password, salt);
      const codes = generateBackupCodes();
      
      localStorage.setItem('appPasswordHash', hashedPassword);
      localStorage.setItem('appPasswordSalt', salt);
      localStorage.setItem('backupCodes', JSON.stringify(codes));
      
      setBackupCodes(codes);
      setShowSetup(false);
      setShowBackupCodes(true);
      setError('');
    } catch (err) {
      setError('Fehler beim Erstellen des Passworts');
    } finally {
      setIsSettingUp(false);
    }
  };

  const login = async () => {
    try {
      const storedHash = localStorage.getItem('appPasswordHash');
      const storedSalt = localStorage.getItem('appPasswordSalt');
      
      if (!storedHash || !storedSalt) {
        setError('Kein Passwort gefunden');
        return;
      }

      const hashedInput = await hashPassword(loginPassword, storedSalt);
      
      if (hashedInput === storedHash) {
        localStorage.setItem('sessionValid', 'true');
        localStorage.setItem('sessionTime', new Date().getTime().toString());
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Falsches Passwort');
      }
    } catch (err) {
      setError('Fehler beim Login');
    }
  };

  const logout = () => {
    localStorage.removeItem('sessionValid');
    localStorage.removeItem('sessionTime');
    setIsAuthenticated(false);
    setLoginPassword('');
  };

  const resetPasswordWithBackupCode = (remainingCodes) => {
    setShowBackupCodeInput(false);
    setShowSetup(true);
    setPassword('');
    setConfirmPassword('');
    setError('');
    
    // Warnung über verbleibende Codes
    if (remainingCodes > 0) {
      setError(`Passwort zurückgesetzt. Sie haben noch ${remainingCodes} Backup-Code(s) übrig.`);
    } else {
      setError('Passwort zurückgesetzt. ALLE Backup-Codes sind aufgebraucht. Erstellen Sie neue Codes!');
    }
  };

  const completeBackupCodesSetup = () => {
    setShowBackupCodes(false);
    localStorage.setItem('sessionValid', 'true');
    localStorage.setItem('sessionTime', new Date().getTime().toString());
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showBackupCodes) {
    return (
      <BackupCodesDisplay 
        codes={backupCodes} 
        onComplete={completeBackupCodesSetup}
      />
    );
  }

  if (showBackupCodeInput) {
    return (
      <BackupCodeInput
        onSuccess={resetPasswordWithBackupCode}
        onCancel={() => setShowBackupCodeInput(false)}
      />
    );
  }

  if (showSetup) {
    const strength = checkPasswordStrength(password);
    
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-8 border border-slate-700">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Coaching-App einrichten</h1>
            <p className="text-gray-300 mt-2">
              Erstellen Sie ein sicheres Passwort für Ihre Coaching-Daten
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Neues Passwort
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Mindestens 8 Zeichen"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className={`text-sm ${strength.color}`}>
                    Passwort-Stärke: {strength.strength}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {!strength.checks.length && '• Mindestens 8 Zeichen'}
                    {!strength.checks.uppercase && '• Großbuchstabe'}
                    {!strength.checks.lowercase && '• Kleinbuchstabe'}
                    {!strength.checks.number && '• Zahl'}
                    {!strength.checks.special && '• Sonderzeichen'}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Passwort bestätigen
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Passwort wiederholen"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/30 border border-red-500/30 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-300">Backup-Codes</h3>
                  <p className="text-sm text-blue-200">
                    Sie erhalten 5 Backup-Codes für den Notfall. Diese ermöglichen Passwort-Reset bei Vergessen.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={setupPassword}
              disabled={isSettingUp || strength.score < 3 || password !== confirmPassword}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSettingUp ? 'Wird eingerichtet...' : 'Passwort erstellen & Backup-Codes generieren'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-8 border border-slate-700">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Coaching-App</h1>
            <p className="text-gray-300 mt-2">
              Geben Sie Ihr Passwort ein, um fortzufahren
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Passwort
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && login()}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Ihr Passwort eingeben"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/30 border border-red-500/30 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={login}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Anmelden
            </button>

            <div className="text-center">
              <button
                onClick={() => setShowBackupCodeInput(true)}
                className="text-sm text-blue-400 hover:text-blue-300 underline"
              >
                Passwort vergessen? Mit Backup-Code zurücksetzen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};