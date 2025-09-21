// Desktop-optimierte Landing Page für CoachingSpace
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Users, Star, Play, ArrowRight, Brain, FileText, BookOpen, Shield, Monitor, Lock, Zap, BarChart3, Clock, Download } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDemoSignup = async () => {
    if (!email) {
      alert('Bitte geben Sie eine E-Mail-Adresse ein.');
      return;
    }
    
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Demo SignUp für:', email);
      
      setIsSubmitted(true);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      alert('Fehler bei der Anmeldung: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return <DemoSuccessPage email={email} navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Desktop Header */}
      <header className="relative z-10 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
            <span className="text-2xl font-bold text-white">CoachingSpace</span>
          </div>
          <div className="flex items-center gap-6 text-slate-300">
            <span className="text-sm">Beta-Version</span>
            <div className="h-4 w-px bg-slate-600"></div>
            <span className="text-sm">Nur für Desktop</span>
          </div>
        </div>
      </header>

      {/* Hero Section - Desktop optimiert */}
      <section className="relative px-8 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-slate-900"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-12 items-center">
            {/* Linke Spalte - Hauptcontent */}
            <div className="col-span-7">
              <div className="inline-flex items-center gap-3 bg-green-600/20 border border-green-500/30 rounded-full px-6 py-3 mb-8">
                <Play className="h-5 w-5 text-green-400" />
                <span className="text-green-300 font-medium">Beta-Demo verfügbar</span>
                <span className="text-green-200 text-sm">• Vollversion kommt als Desktop-App</span>
              </div>
              
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                <span className="text-blue-400">CoachingSpace</span>
                <br />
                <span className="text-white">Professionelles</span>
                <br />
                <span className="text-slate-200">Coaching-Management</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
                Die erste DSGVO-konforme Desktop-Anwendung für Coaches in Deutschland. 
                Intelligente KI-Unterstützung, vollständige Offline-Funktionalität und 
                100% lokale Datenspeicherung für maximalen Datenschutz.
              </p>

              <div className="flex items-center gap-8 text-slate-400 mb-12">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">127+ Beta-Tester</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="font-medium">4.8/5 Bewertung</span>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-blue-400" />
                  <span className="font-medium">Desktop-First</span>
                </div>
              </div>

              {/* Desktop-spezifische Highlights */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
                  <Lock className="h-8 w-8 text-green-400 mb-3" />
                  <h3 className="font-semibold text-white mb-2">100% Offline</h3>
                  <p className="text-sm text-slate-400">Keine Cloud, keine Internet-Verbindung nötig</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
                  <Zap className="h-8 w-8 text-yellow-400 mb-3" />
                  <h3 className="font-semibold text-white mb-2">KI-Power</h3>
                  <p className="text-sm text-slate-400">Lokale KI-Verarbeitung für Session-Analyse</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
                  <BarChart3 className="h-8 w-8 text-purple-400 mb-3" />
                  <h3 className="font-semibold text-white mb-2">Analytics</h3>
                  <p className="text-sm text-slate-400">Coaching-Trends und Entwicklungsmetriken</p>
                </div>
              </div>
            </div>

            {/* Rechte Spalte - Demo Form */}
            <div className="col-span-5">
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🚀</div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Web-Demo starten
                  </h2>
                  <p className="text-slate-400">
                    Teste alle Features 30 Tage kostenlos.<br />
                    <span className="text-sm text-slate-500">Vollversion wird Desktop-App</span>
                  </p>
                </div>

                <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Demo-Umfang (30 Tage)
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">5 Coachees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">50 Sessions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">KI-Features</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">15 Reflexionen</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">Rechnungen</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">Datenexport</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      E-Mail für Demo-Zugang
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ihre.email@coaching-praxis.de"
                      className="w-full px-4 py-4 bg-slate-700/80 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                    />
                  </div>
                  
                  <button
                    onClick={handleDemoSignup}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-blue-500/25"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Demo wird eingerichtet...
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        Jetzt Demo starten
                      </>
                    )}
                  </button>

                  <div className="text-center text-xs text-slate-500 leading-relaxed">
                    <p>
                      Mit der Anmeldung akzeptieren Sie unsere{' '}
                      <span className="text-blue-400 hover:underline cursor-pointer">Datenschutzbestimmungen</span>.
                      <br />
                      Demo-Daten werden nach 30 Tagen automatisch gelöscht.
                      <br />
                      <span className="text-slate-600">Vollversion: 100% offline & DSGVO-konform</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature-Übersicht - Desktop Layout */}
      <section className="px-8 py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Alles was professionelle Coaches brauchen
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Von der Session-Planung bis zur Abrechnung - CoachingSpace bietet alle Tools 
              für erfolgreiches Coaching-Business in einer Desktop-Anwendung.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:bg-slate-800/70 transition-all duration-300 group">
              <Brain className="h-12 w-12 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-4">KI-Coach-Assistent</h3>
              <p className="text-slate-400 leading-relaxed">
                Intelligente Session-Analyse, automatische Notizen-Strukturierung und 
                Coaching-Muster-Erkennung für kontinuierliche Verbesserung.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:bg-slate-800/70 transition-all duration-300 group">
              <FileText className="h-12 w-12 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-4">Session-Management</h3>
              <p className="text-slate-400 leading-relaxed">
                Vollständige Dokumentation von Coaching-Sessions mit KI-Support, 
                SMART-Zielen und automatischer Nachverfolgung.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:bg-slate-800/70 transition-all duration-300 group">
              <BookOpen className="h-12 w-12 text-orange-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-4">Reflexionstagebuch</h3>
              <p className="text-slate-400 leading-relaxed">
                KI-gestützte Coach-Entwicklung mit Blinde-Flecken-Analyse und 
                automatischer Supervisions-Vorbereitung.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 hover:bg-slate-800/70 transition-all duration-300 group">
              <Shield className="h-12 w-12 text-green-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-4">DSGVO & Datenschutz</h3>
              <p className="text-slate-400 leading-relaxed">
                100% lokale Datenspeicherung, keine Cloud-Abhängigkeit und 
                vollständige DSGVO-Compliance für deutschen Coaching-Markt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop-App Hinweis */}
      <section className="px-8 py-16 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <Monitor className="h-16 w-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Vollversion wird Desktop-App
          </h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Diese Web-Demo zeigt alle Features. Die finale Version kommt als sichere Desktop-Anwendung 
            mit 100% Offline-Funktionalität und lokaler Datenspeicherung - perfekt für DSGVO-Compliance.
          </p>
          <div className="flex items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-400" />
              <span>Offline-First</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-400" />
              <span>Lokale Installation</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Success Page für Desktop
function DemoSuccessPage({ email, navigate }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-8xl mb-8">🎉</div>
        <h1 className="text-5xl font-bold text-white mb-6">
          Demo-Zugang wurde eingerichtet!
        </h1>
        <p className="text-xl text-slate-300 mb-12">
          Willkommen bei CoachingSpace! Sie sind jetzt angemeldet als <strong className="text-blue-400">{email}</strong>
        </p>
        
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-8 mb-12 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4">Sie werden automatisch weitergeleitet...</h3>
          <p className="text-slate-300 mb-6">
            Falls die Weiterleitung nicht funktioniert, klicken Sie den Button unten.
          </p>
          <div className="text-sm text-slate-500 bg-slate-700/50 rounded-lg p-4">
            <p className="mb-2">📍 <strong>Demo-Erinnerung:</strong></p>
            <p>Dies ist eine Web-Demo. Die finale Version wird eine Desktop-App mit 100% Offline-Funktionalität.</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-semibold transition-all inline-flex items-center gap-3 text-lg shadow-lg hover:shadow-blue-500/25"
        >
          <ArrowRight className="h-6 w-6" />
          Zur Demo-App starten
        </button>
      </div>
    </div>
  );
}