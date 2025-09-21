import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseConfig";
import { Shield, Download, Copy, AlertTriangle, Check } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    website: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [password, setPassword] = useState('');

  const generateDemoPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 5; i++) {
      const code = 'COACH-' + Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + 
                   Math.random().toString(36).substr(2, 4).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validierung
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    setIsLoading(true);

    try {
      const demoPassword = generateDemoPassword();
      setPassword(demoPassword);
      
      // Backup-Codes generieren
      const codes = generateBackupCodes();
      setBackupCodes(codes);
      
      // Supabase User erstellen
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: demoPassword,
        options: {
          data: {
            is_demo_user: true,
            demo_source: 'landing_page',
            first_name: formData.firstName,
            last_name: formData.lastName,
            website: formData.website,
            full_name: `${formData.firstName} ${formData.lastName}`,
            backup_codes: codes
          }
        }
      });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Demo-Erstellung fehlgeschlagen: ${error.message}`);
      }

      console.log('Demo User erstellt:', data.user?.email);
      setShowBackupCodes(true);

    } catch (error) {
      console.error('Demo signup error:', error);
      alert('Fehler bei der Demo-Erstellung: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupCodesComplete = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (showBackupCodes) {
    return <BackupCodesDisplay codes={backupCodes} password={password} email={formData.email} onComplete={handleBackupCodesComplete} />;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Demo erfolgreich erstellt!</h2>
          <p className="text-slate-300 mb-6">
            Sie werden zur App weitergeleitet...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-semibold text-white">Coachingspace</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              KI-gestütztes triadisches Coaching
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Revolutionieren Sie Ihr Coaching mit einer DSGVO-konformen Desktop-Anwendung, 
              die echte Insights und messbare Fortschritte ermöglicht.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                title: "KI-Coaching-Assistent",
                description: "Intelligente Unterstützung bei Analyse und Interventionen"
              },
              {
                title: "Lokale Datenhaltung",
                description: "100% DSGVO-konform ohne Cloud-Speicherung"
              },
              {
                title: "Session-Management",
                description: "Strukturierte Coaching-Gespräche mit Dokumentation"
              },
              {
                title: "Progress-Tracking",
                description: "Messbare Fortschritte und detaillierte Analysen"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Demo Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Kostenlose Demo starten
                </h2>
                <p className="text-slate-300">
                  Testen Sie alle Features 30 Tage kostenfrei
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Vorname *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Nachname *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    E-Mail-Adresse *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Website (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://ihre-website.de"
                  />
                </div>

                {/* Security Info */}
                <div className="bg-slate-700/50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-sm text-slate-300">
                    <strong>Sicherheitshinweis:</strong> Nach der Demo-Erstellung müssen Sie ein 
                    sicheres Passwort für die lokale Desktop-App setzen. Sie erhalten 5 einmalige 
                    Backup-Codes für den Notfall - bewahren Sie diese sicher auf.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Demo wird erstellt...' : 'Kostenlose Demo starten'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Demo-Limits: 5 Coachees • 50 Sessions • DSGVO-konform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BackupCodesDisplay = ({ codes, password, email, onComplete }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  const downloadCodes = () => {
    const content = `COACHINGSPACE - DEMO-ZUGANG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WICHTIGE ANMELDEDATEN - SICHER VERWAHREN!

E-Mail für Anmeldung: ${email}
Temporäres Passwort: ${password}

BACKUP-CODES für Passwort-Reset:
${codes.map((code, i) => `${i + 1}. ${code}`).join('\n')}

WICHTIGE HINWEISE:
• Verwenden Sie die E-Mail-Adresse und das temporäre Passwort für die erste Anmeldung
• Setzen Sie sofort ein eigenes, sicheres Passwort
• Bewahren Sie diese 5 Backup-Codes sicher auf (ausdrucken!)
• Jeder Code funktioniert nur EINMAL bei Passwort-Verlust
• NICHT digital auf dem Computer speichern

ANLEITUNG:
1. Zur App gehen und mit E-Mail + Passwort anmelden
2. Eigenes Passwort setzen (Demo-Passwort wird ungültig)
3. Diese Backup-Codes ausdrucken und sicher verwahren
4. Bei Passwort-Vergessen einen Code verwenden

Generiert am: ${new Date().toLocaleDateString('de-DE')} um ${new Date().toLocaleTimeString('de-DE')}
Demo-Zugang gültig bis: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coachingspace-demo-zugang.txt';
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  const copyToClipboard = async () => {
    const text = codes.join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyPassword = async () => {
    await navigator.clipboard.writeText(password);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg max-w-2xl w-full p-8">
        <div className="flex items-center mb-6">
          <Shield className="w-8 h-8 text-blue-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Demo-Zugang erstellt!</h2>
        </div>
        
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-300 mb-2">Wichtig - Sofort speichern!</h3>
              <p className="text-sm text-red-200">
                Diese Daten benötigen Sie für die erste Anmeldung. Speichern Sie sie jetzt, 
                da sie nach dem Schließen dieser Seite nicht mehr verfügbar sind.
              </p>
            </div>
          </div>
        </div>

        {/* Temporäres Passwort */}
        <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3 text-white">Temporäres Passwort:</h3>
          <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 p-3 rounded font-mono text-sm">
            <code className="flex-1 text-white">{password}</code>
            <button
              onClick={copyPassword}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
            >
              {passwordCopied ? 'Kopiert!' : 'Kopieren'}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Verwenden Sie dieses Passwort für die erste Anmeldung und setzen dann sofort ein eigenes.
          </p>
        </div>

        {/* Backup Codes */}
        <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3 text-white">Ihre 5 Backup-Codes:</h3>
          <div className="grid gap-2 mb-4">
            {codes.map((code, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-700 border border-slate-600 p-3 rounded">
                <span className="font-mono text-sm text-white">{i + 1}. {code}</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={copyToClipboard}
              className="flex-1 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors text-sm"
            >
              <Copy className="w-4 h-4 inline mr-2" />
              {copied ? 'Kopiert!' : 'Codes kopieren'}
            </button>
            <button
              onClick={downloadCodes}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Als Datei speichern
            </button>
          </div>
          
          <p className="text-xs text-slate-400">
            Bei Passwort-Verlust können Sie einen dieser Codes verwenden, um ein neues Passwort zu setzen.
          </p>
        </div>

        <div className="bg-slate-700/30 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
          <h4 className="font-semibold text-white mb-2">Nächste Schritte:</h4>
          <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
            <li>Speichern Sie die Anmeldedaten (Download-Button)</li>
            <li>Gehen Sie zur App und melden sich mit E-Mail + temporärem Passwort an</li>
            <li>Setzen Sie sofort ein eigenes, sicheres Passwort</li>
            <li>Drucken Sie die Backup-Codes aus und verwahren sie sicher</li>
          </ol>
        </div>

        <button
          onClick={onComplete}
          disabled={!downloaded}
          className={`w-full px-6 py-3 rounded-lg transition-colors ${
            downloaded
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
          }`}
        >
          {downloaded ? 'Anmeldedaten gesichert - Zur App' : 'Bitte zuerst Anmeldedaten speichern'}
        </button>
      </div>
    </div>
  );
};