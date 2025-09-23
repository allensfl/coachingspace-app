import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Users, FileText, Calculator, Brain, Settings, CheckCircle, AlertCircle, Play, BookOpen, Target, Zap, Shield, TrendingUp, Calendar, DollarSign, Search, Menu, X, Mail, Sparkles, Lightbulb, BarChart3, Copy, Save } from 'lucide-react';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    { id: 'overview', title: 'Übersicht', icon: BookOpen },
    { id: 'quickstart', title: 'Schnellstart (10 Min)', icon: Play },
    { id: 'password', title: 'Passwort & Sicherheit', icon: Shield },
    { id: 'coachees', title: 'Coachee-Verwaltung', icon: Users },
    { id: 'sessions', title: 'Session-Management', icon: Clock },
    { id: 'notes', title: 'Sitzungsnotizen', icon: FileText },
    { id: 'journal', title: 'Reflexionstagebuch', icon: BookOpen },
    { id: 'invoicing', title: 'Rechnungswesen', icon: Calculator },
    { id: 'ai', title: 'KI-Features (Coming Soon)', icon: Brain, badge: 'In Entwicklung' },
    { id: 'toolbox', title: 'Coaching-Toolbox', icon: Zap },
    { id: 'settings', title: 'Einstellungen', icon: Settings },
    { id: 'legal', title: 'Rechtliches & DSGVO', icon: Shield },
    { id: 'business', title: 'Business-Optimierung', icon: TrendingUp },
  ];

  // StepGuide Komponente
  const StepGuide = ({ title, icon: Icon, steps }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-600 text-white rounded-full text-sm font-bold flex items-center justify-center">
                {index + 1}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-slate-300 mb-3">{step.description}</p>
              {step.details && (
                <ul className="space-y-1">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // FeatureCard Komponente
  const FeatureCard = ({ icon: Icon, title, description, highlight, status = 'available' }) => (
    <div className={`bg-slate-800 border ${highlight ? 'border-blue-500/50' : 'border-slate-700'} rounded-lg p-6 relative`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`h-6 w-6 ${highlight ? 'text-blue-400' : status === 'coming' ? 'text-orange-400' : 'text-slate-400'}`} />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="text-slate-300 text-sm">{description}</p>
      {status === 'coming' && (
        <div className="absolute top-3 right-3">
          <span className="text-xs px-2 py-1 bg-orange-500/30 text-orange-300 rounded font-medium">
            In Entwicklung
          </span>
        </div>
      )}
    </div>
  );

  // TroubleshootingCard Komponente
  const TroubleshootingCard = ({ issue, solution, type = 'info' }) => {
    const iconColor = type === 'warning' ? 'text-yellow-400' : type === 'error' ? 'text-red-400' : 'text-blue-400';
    
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-3">
        <div className="flex items-start gap-3">
          <AlertCircle className={`h-5 w-5 ${iconColor} mt-0.5 flex-shrink-0`} />
          <div className="flex-1">
            <h4 className="font-medium text-white mb-2">{issue}</h4>
            <p className="text-slate-300 text-sm">{solution}</p>
          </div>
        </div>
      </div>
    );
  };

  // ComingSoonSection Komponente für KI-Features
  const ComingSoonSection = ({ title, description, features }) => (
    <div className="bg-gradient-to-br from-orange-900/20 to-slate-800 border border-orange-500/30 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="h-6 w-6 text-orange-400" />
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className="px-3 py-1 bg-orange-500/30 text-orange-300 text-sm rounded-full font-medium">
          In Entwicklung
        </span>
      </div>
      <p className="text-slate-300 mb-4">{description}</p>
      {features && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <span className="text-slate-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Coachingspace Core-Version</h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Professionelles Coaching-Management mit DSGVO-konformem Setup - 
                KI-Features werden als Premium-Add-On hinzugefügt
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Users}
                title="Coachee-Verwaltung"
                description="Umfassende Verwaltung Ihrer Coaching-Klienten mit Profilen, Kontaktdaten und Historie."
                highlight={true}
              />
              <FeatureCard
                icon={Clock}
                title="Session-Management"
                description="Terminplanung, Session-Tracking und strukturierte Dokumentation aller Coaching-Sitzungen."
                highlight={true}
              />
              <FeatureCard
                icon={FileText}
                title="Sitzungsnotizen"
                description="Strukturierte Notizen mit Templates, Tags und Suchfunktion für alle Sessions."
                highlight={true}
              />
              <FeatureCard
                icon={Calculator}
                title="Rechnungswesen"
                description="Automatisierte Rechnungserstellung und Finanz-Tracking für Ihr Coaching-Business."
                highlight={true}
              />
              <FeatureCard
                icon={BookOpen}
                title="Reflexionstagebuch"
                description="Persönliches Journal für Coaching-Reflexionen und Entwicklungsfortschritte."
                highlight={true}
              />
              <FeatureCard
                icon={Shield}
                title="DSGVO-konform"
                description="Vollständig DSGVO-konforme Datenverarbeitung und Sicherheitsmaßnahmen."
                highlight={true}
              />
              <FeatureCard
                icon={Brain}
                title="KI-Coach-Assistent"
                description="Intelligente Coaching-Unterstützung mit triadischem System und Prompt-Bibliothek."
                status="coming"
              />
              <FeatureCard
                icon={Lightbulb}
                title="KI-Sitzungsanalyse"
                description="Automatische Analyse von Notizen und Sessions mit Erkennungsmustern."
                status="coming"
              />
              <FeatureCard
                icon={BarChart3}
                title="KI-Fortschrittsanalyse"
                description="Intelligente Auswertung von Coaching-Verläufen und Erfolgsmetriken."
                status="coming"
              />
            </div>

            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Sofort verfügbare Core-Features</h2>
              <div className="grid md:grid-cols-2 gap-6 text-slate-300">
                <div>
                  <h3 className="font-semibold text-white mb-2">✅ Vollständig funktional</h3>
                  <ul className="space-y-1">
                    <li>• Coachee-Verwaltung mit Profilen</li>
                    <li>• Session-Management & Terminplanung</li>
                    <li>• Strukturierte Sitzungsnotizen</li>
                    <li>• Rechnungswesen & Finanzen</li>
                    <li>• Reflexionstagebuch</li>
                    <li>• DSGVO-konforme Sicherheit</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-300 mb-2">🚧 Premium Add-On (in Entwicklung)</h3>
                  <ul className="space-y-1 text-orange-200">
                    <li>• KI-Coach-Assistent</li>
                    <li>• Automatische Sitzungsanalyse</li>
                    <li>• Intelligente Fortschrittsmetriken</li>
                    <li>• Prompt-Bibliothek für Coaches</li>
                    <li>• Triadisches Coaching-System</li>
                    <li>• Personalisierte KI-Insights</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quickstart':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Schnellstart Guide - 10 Minuten Setup</h1>
              <p className="text-xl text-slate-300">Von der Registration bis zur ersten Session</p>
            </div>

            <StepGuide
              title="Account-Setup & Sicherheit"
              icon={Shield}
              steps={[
                {
                  title: "Registration & Login",
                  description: "Erstellen Sie Ihr Coachingspace-Konto mit sicheren Credentials",
                  details: [
                    "Email und sicheres Passwort wählen",
                    "Email-Bestätigung abschließen",
                    "Erste Anmeldung durchführen"
                  ]
                },
                {
                  title: "Passwort-Manager Setup",
                  description: "Konfigurieren Sie starke Sicherheit für Ihren Account",
                  details: [
                    "Passwort-Manager verwenden (1Password, Bitwarden)",
                    "Starkes Master-Passwort generieren",
                    "Backup-Codes sicher speichern"
                  ]
                }
              ]}
            />

            <StepGuide
              title="Erste Coaching-Daten"
              icon={Users}
              steps={[
                {
                  title: "Ersten Coachee anlegen",
                  description: "Erstellen Sie Ihr erstes Coaching-Profil",
                  details: [
                    "Navigation: Dashboard → Coachees → Neuer Coachee",
                    "Grunddaten eingeben (Name, Kontakt, Ziele)",
                    "Coaching-Rahmen definieren"
                  ]
                },
                {
                  title: "Session planen",
                  description: "Terminieren Sie Ihre erste Coaching-Session",
                  details: [
                    "Session-Kalender öffnen",
                    "Termin mit Coachee vereinbaren",
                    "Session-Typ und Dauer festlegen"
                  ]
                }
              ]}
            />

            <StepGuide
              title="Session durchführen"
              icon={Clock}
              steps={[
                {
                  title: "Session-Notizen erstellen",
                  description: "Dokumentieren Sie strukturiert Ihre Coaching-Session",
                  details: [
                    "Session starten → Notizen-Bereich öffnen",
                    "Strukturierte Templates verwenden",
                    "Wichtige Erkenntnisse festhalten"
                  ]
                },
                {
                  title: "Follow-up planen",
                  description: "Nächste Schritte und Termine definieren",
                  details: [
                    "Hausaufgaben und Action Items notieren",
                    "Nächsten Termin vereinbaren",
                    "Session abschließen und archivieren"
                  ]
                }
              ]}
            />

            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h3 className="text-xl font-semibold text-white">Herzlichen Glückwunsch!</h3>
              </div>
              <p className="text-slate-300 mb-4">
                Sie haben erfolgreich Ihr Coachingspace-Setup abgeschlossen. Ihr professionelles 
                Coaching-Management ist jetzt betriebsbereit.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Nächste Schritte:</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Weitere Coachees hinzufügen</li>
                    <li>• Rechnungseinstellungen konfigurieren</li>
                    <li>• Coaching-Toolbox erkunden</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-300 mb-2">Kommende Features:</h4>
                  <ul className="text-sm text-orange-200 space-y-1">
                    <li>• KI-Coach-Assistent (Premium Add-On)</li>
                    <li>• Automatische Session-Analyse</li>
                    <li>• Erweiterte Analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Passwort & Sicherheit</h1>
              <p className="text-xl text-slate-300">Schützen Sie Ihre sensiblen Coaching-Daten optimal</p>
            </div>

            <StepGuide
              title="Passwort-Manager Setup"
              icon={Shield}
              steps={[
                {
                  title: "Passwort-Manager wählen",
                  description: "Verwenden Sie eine professionelle Lösung für maximale Sicherheit",
                  details: [
                    "Empfohlen: 1Password, Bitwarden, Dashlane",
                    "Browser-integrierte Manager vermeiden",
                    "Business-Version für Coaches empfohlen"
                  ]
                },
                {
                  title: "Master-Passwort erstellen",
                  description: "Ihr wichtigstes Passwort - stark und einprägsam",
                  details: [
                    "Mindestens 16 Zeichen verwenden",
                    "Kombination aus Wörtern + Zahlen + Sonderzeichen",
                    "Beispiel: 'MeinCoaching$2024!Sicher'"
                  ]
                },
                {
                  title: "Coachingspace-Passwort generieren",
                  description: "Lassen Sie den Passwort-Manager ein starkes Passwort erstellen",
                  details: [
                    "Mindestens 20 Zeichen",
                    "Vollständig zufällig generiert",
                    "Automatisch in Manager speichern"
                  ]
                }
              ]}
            />

            <StepGuide
              title="Backup & Recovery"
              icon={Copy}
              steps={[
                {
                  title: "Backup-Codes erstellen",
                  description: "Sichern Sie sich gegen Passwort-Verlust ab",
                  details: [
                    "Passwort-Manager Backup-Codes generieren",
                    "Codes in separatem, sicheren Ort speichern",
                    "Nie digital als Plaintext speichern"
                  ]
                },
                {
                  title: "Recovery-Plan dokumentieren",
                  description: "Erstellen Sie einen Notfall-Zugangsplan",
                  details: [
                    "Backup-Email-Adresse hinterlegen",
                    "Vertrauenswürdige Kontaktperson definieren",
                    "Recovery-Prozess mindestens 1x testen"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <TroubleshootingCard
                issue="Passwort vergessen"
                solution="Verwenden Sie die 'Passwort vergessen' Funktion auf der Login-Seite. Ein Reset-Link wird an Ihre Email geschickt."
                type="info"
              />
              <TroubleshootingCard
                issue="Passwort-Manager synchronisiert nicht"
                solution="Prüfen Sie Ihre Internet-Verbindung und loggen Sie sich erneut in Ihren Passwort-Manager ein."
                type="warning"
              />
              <TroubleshootingCard
                issue="Account temporär gesperrt"
                solution="Nach 5 fehlgeschlagenen Login-Versuchen wird Ihr Account für 30 Minuten gesperrt. Kontaktieren Sie den Support bei anhaltenden Problemen."
                type="error"
              />
              <TroubleshootingCard
                issue="Verdächtige Aktivitäten"
                solution="Ändern Sie sofort Ihr Passwort und kontaktieren Sie unseren Support. Prüfen Sie alle aktiven Sessions."
                type="error"
              />
            </div>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Sicherheits-Checkliste</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">✅ Empfohlene Maßnahmen</h4>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Passwort-Manager verwenden</li>
                    <li>• Regelmäßige Passwort-Updates</li>
                    <li>• Backup-Codes sicher verwahren</li>
                    <li>• Login-Aktivitäten überwachen</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-300 mb-2">❌ Zu vermeiden</h4>
                  <ul className="text-red-200 space-y-1 text-sm">
                    <li>• Passwörter wiederverwenden</li>
                    <li>• Passwörter im Browser speichern</li>
                    <li>• Schwache oder vorhersagbare Passwörter</li>
                    <li>• Passwörter unverschlüsselt notieren</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'coachees':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Coachee-Verwaltung</h1>
              <p className="text-xl text-slate-300">Professionelle Klienten-Organisation für erfolgreiches Coaching</p>
            </div>

            <StepGuide
              title="Neuen Coachee anlegen"
              icon={Users}
              steps={[
                {
                  title: "Grunddaten erfassen",
                  description: "Erfassen Sie die wichtigsten Informationen zu Ihrem neuen Coachee",
                  details: [
                    "Name, Vorname und bevorzugte Anrede",
                    "Kontaktdaten (Email, Telefon)",
                    "Berufliche Position und Unternehmen"
                  ]
                },
                {
                  title: "Coaching-Kontext definieren",
                  description: "Bestimmen Sie den Rahmen für das Coaching-Verhältnis",
                  details: [
                    "Coaching-Ziele und gewünschte Outcomes",
                    "Coaching-Art (Business, Life, Executive)",
                    "Geplante Session-Anzahl und Dauer"
                  ]
                },
                {
                  title: "Individuelle Einstellungen",
                  description: "Personalisieren Sie die Betreuung für optimale Ergebnisse",
                  details: [
                    "Präferierte Kommunikationskanäle",
                    "Session-Häufigkeit und bevorzugte Zeiten",
                    "Besondere Notizen oder Bedürfnisse"
                  ]
                }
              ]}
            />

            <StepGuide
              title="Coachee-Profile verwalten"
              icon={FileText}
              steps={[
                {
                  title: "Profile regelmäßig aktualisieren",
                  description: "Halten Sie die Coachee-Daten aktuell und vollständig",
                  details: [
                    "Kontaktdaten bei Änderungen updaten",
                    "Coaching-Fortschritte dokumentieren",
                    "Neue Ziele oder Schwerpunkte ergänzen"
                  ]
                },
                {
                  title: "Session-Historie verfolgen",
                  description: "Behalten Sie den Überblick über alle Coaching-Aktivitäten",
                  details: [
                    "Vergangene Sessions mit Notizen einsehen",
                    "Fortschritte und Entwicklungen analysieren",
                    "Muster und Trends erkennen"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={Users}
                title="Coachee-Dashboard"
                description="Zentrale Übersicht aller Ihrer Coaching-Klienten mit Status und nächsten Terminen."
              />
              <FeatureCard
                icon={Calendar}
                title="Session-Planung"
                description="Integrierte Terminplanung direkt aus dem Coachee-Profil heraus."
              />
              <FeatureCard
                icon={FileText}
                title="Notizen-System"
                description="Strukturierte Notizen und Dokumentation für jeden Coachee einzeln."
              />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Tipps für effektive Coachee-Verwaltung</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Best Practices</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Profile vollständig ausfüllen für bessere Betreuung</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Regelmäßige Aktualisierung der Coaching-Ziele</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Tags für Kategorisierung nutzen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Notizen zeitnah nach Sessions erstellen</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-400 mb-3">Häufige Fehler</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Unvollständige Profile führen zu Verwirrung</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Veraltete Kontaktdaten verhindern Kommunikation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Fehlende Dokumentation von Coaching-Zielen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>Zu seltene Updates der Profile</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <ComingSoonSection
              title="KI-unterstützte Coachee-Analyse"
              description="Erweiterte Funktionen für tiefere Einblicke in Coaching-Verläufe werden als Premium-Add-On verfügbar."
              features={[
                "Automatische Fortschrittsanalyse basierend auf Session-Notizen",
                "Personalisierte Coaching-Empfehlungen durch KI",
                "Mustererkennung in Coachee-Entwicklungen",
                "Prädiktive Analytics für Coaching-Erfolg"
              ]}
            />
          </div>
        );

      case 'sessions':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Session-Management</h1>
              <p className="text-xl text-slate-300">Strukturierte Planung und Durchführung Ihrer Coaching-Sessions</p>
            </div>

            <StepGuide
              title="Session planen"
              icon={Calendar}
              steps={[
                {
                  title: "Termin vereinbaren",
                  description: "Planen Sie strukturiert Ihre Coaching-Termine",
                  details: [
                    "Kalender-Integration für Terminübersicht",
                    "Coachee-spezifische Verfügbarkeiten berücksichtigen",
                    "Session-Dauer und -Art definieren"
                  ]
                },
                {
                  title: "Session-Typ festlegen",
                  description: "Bestimmen Sie den Fokus und die Struktur der Session",
                  details: [
                    "Ersttermin, Follow-up oder Abschlussgespräch",
                    "Spezielle Schwerpunkte oder Methoden",
                    "Vorbereitung und benötigte Materialien"
                  ]
                },
                {
                  title: "Vorbereitung dokumentieren",
                  description: "Bereiten Sie sich optimal auf die Session vor",
                  details: [
                    "Notizen aus vorherigen Sessions reviewen",
                    "Coaching-Ziele und aktuellen Status prüfen",
                    "Agenda und Gesprächsleitfaden erstellen"
                  ]
                }
              ]}
            />

            <StepGuide
              title="Session durchführen"
              icon={Clock}
              steps={[
                {
                  title: "Session starten",
                  description: "Beginnen Sie strukturiert Ihre Coaching-Session",
                  details: [
                    "Session im System als 'aktiv' markieren",
                    "Notizen-Bereich vorbereiten",
                    "Timer für Session-Dauer starten"
                  ]
                },
                {
                  title: "Live-Notizen erstellen",
                  description: "Dokumentieren Sie wichtige Inhalte während der Session",
                  details: [
                    "Strukturierte Templates für Notizen verwenden",
                    "Wichtige Quotes und Erkenntnisse festhalten",
                    "Action Items und nächste Schritte notieren"
                  ]
                },
                {
                  title: "Session abschließen",
                  description: "Beenden Sie die Session strukturiert und vollständig",
                  details: [
                    "Zusammenfassung und Key Takeaways dokumentieren",
                    "Nächste Session terminieren",
                    "Follow-up Aktionen definieren"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard
                icon={Play}
                title="Session-Timer"
                description="Integrierter Timer für präzise Session-Dauer und Pausen."
              />
              <FeatureCard
                icon={FileText}
                title="Live-Notizen"
                description="Echtzeit-Dokumentation während der laufenden Session."
              />
              <FeatureCard
                icon={Target}
                title="Ziel-Tracking"
                description="Fortschrittsverfolgung zu definierten Coaching-Zielen."
              />
              <FeatureCard
                icon={Calendar}
                title="Follow-up Planung"
                description="Automatische Terminierung von Folge-Sessions."
              />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Session-Templates</h3>
              <p className="text-slate-300 mb-4">
                Nutzen Sie vorgefertigte Templates für strukturierte und professionelle Sessions:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Ersttermin</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Kennenlernen & Rapport</li>
                    <li>• Ziele definieren</li>
                    <li>• Coaching-Rahmen vereinbaren</li>
                    <li>• Nächste Schritte planen</li>
                  </ul>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Standard Session</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Check-in & Status</li>
                    <li>• Arbeitsthemen bearbeiten</li>
                    <li>• Erkenntnisse & Insights</li>
                    <li>• Action Items definieren</li>
                  </ul>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Abschlussgespräch</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Coaching-Rückblick</li>
                    <li>• Erfolge würdigen</li>
                    <li>• Lernings dokumentieren</li>
                    <li>• Zukunft & Transfer</li>
                  </ul>
                </div>
              </div>
            </div>

            <ComingSoonSection
              title="KI-unterstützte Session-Führung"
              description="Intelligente Assistenz für noch effektivere Coaching-Sessions wird als Premium-Add-On verfügbar."
              features={[
                "Echtzeit-Coaching-Vorschläge basierend auf Gesprächsverlauf",
                "Automatische Erkennung von Coaching-Momenten und Interventionspunkten",
                "KI-gestützte Fragetechniken und Interventionsvorschläge",
                "Automatisches Zusammenfassen von Session-Inhalten"
              ]}
            />
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Sitzungsnotizen</h1>
              <p className="text-xl text-slate-300">Strukturierte Dokumentation für professionelles Coaching</p>
            </div>

            <StepGuide
              title="Notizen während der Session"
              icon={FileText}
              steps={[
                {
                  title: "Template auswählen",
                  description: "Nutzen Sie passende Vorlagen für strukturierte Notizen",
                  details: [
                    "Session-Typ entsprechendes Template wählen",
                    "Individuelle Anpassungen vornehmen",
                    "Wiederkehrende Elemente vordefinieren"
                  ]
                },
                {
                  title: "Echtzeitnotizen erfassen",
                  description: "Dokumentieren Sie wichtige Inhalte direkt während des Gesprächs",
                  details: [
                    "Schlüsselmomente und Wendepunkte festhalten",
                    "Wichtige Zitate und Aussagen des Coachee notieren",
                    "Emotionen und nonverbale Signale dokumentieren"
                  ]
                },
                {
                  title: "Struktur und Tags verwenden",
                  description: "Organisieren Sie Ihre Notizen für spätere Wiederfindung",
                  details: [
                    "Themen-Tags für Kategorisierung nutzen",
                    "Prioritäten und Wichtigkeit markieren",
                    "Verknüpfungen zu vorherigen Sessions erstellen"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={FileText}
                title="Template-System"
                description="Professionelle Vorlagen für verschiedene Session-Typen und Coaching-Ansätze."
              />
              <FeatureCard
                icon={Search}
                title="Intelligente Suche"
                description="Schnelle Suche durch alle Notizen mit Tags, Stichwörtern und Zeiträumen."
              />
              <FeatureCard
                icon={Copy}
                title="Notizen-Export"
                description="Export von Notizen für externe Verwendung oder Archivierung."
              />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Notizen-Best Practices</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-400 mb-3">✅ Empfohlene Methoden</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Notizen zeitnah nach Session finalisieren</li>
                    <li>• Konsistente Struktur und Templates verwenden</li>
                    <li>• Wichtige Quotes wörtlich festhalten</li>
                    <li>• Action Items klar von Beobachtungen trennen</li>
                    <li>• Tags für spätere Analyse verwenden</li>
                    <li>• Vertraulichkeit und DSGVO beachten</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 mb-3">❌ Zu vermeidende Fehler</h4>
                  <ul className="text-red-200 space-y-2 text-sm">
                    <li>• Zu viele unwichtige Details dokumentieren</li>
                    <li>• Interpretationen als Fakten darstellen</li>
                    <li>• Unstrukturierte oder chaotische Notizen</li>
                    <li>• Verzögerung bei der Notizen-Erstellung</li>
                    <li>• Fehlende Kategorisierung und Tags</li>
                    <li>• Vertrauliche Daten unsicher speichern</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <TroubleshootingCard
                issue="Notizen werden nicht gespeichert"
                solution="Prüfen Sie Ihre Internetverbindung und speichern Sie manuell mit Strg+S. Bei anhaltenden Problemen kontaktieren Sie den Support."
                type="warning"
              />
              <TroubleshootingCard
                issue="Template lässt sich nicht anpassen"
                solution="Templates können über die Einstellungen personalisiert werden. Stellen Sie sicher, dass Sie die nötigen Berechtigungen haben."
                type="info"
              />
            </div>

            <ComingSoonSection
              title="KI-gestützte Notizen-Analyse"
              description="Erweiterte Funktionen für intelligente Auswertung Ihrer Session-Notizen werden als Premium-Add-On verfügbar."
              features={[
                "Automatische Zusammenfassung von Session-Inhalten",
                "Erkennung von Coaching-Themen und Mustern",
                "Vorschläge für Follow-up-Aktionen basierend auf Notizen",
                "Intelligente Verknüpfung zwischen Sessions verschiedener Zeiträume"
              ]}
            />
          </div>
        );

      case 'journal':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Reflexionstagebuch</h1>
              <p className="text-xl text-slate-300">Persönliche Entwicklung durch strukturierte Selbstreflexion</p>
            </div>

            <StepGuide
              title="Tagebuch-Einträge erstellen"
              icon={BookOpen}
              steps={[
                {
                  title: "Reflexions-Routine etablieren",
                  description: "Entwickeln Sie eine regelmäßige Praxis der Selbstreflexion",
                  details: [
                    "Feste Zeiten für Reflexion einplanen (z.B. Ende des Coaching-Tages)",
                    "Ruhige Umgebung für ungestörte Reflexion schaffen",
                    "Ehrliche und offene Selbstbetrachtung praktizieren"
                  ]
                },
                {
                  title: "Strukturierte Reflexion",
                  description: "Nutzen Sie bewährte Reflexions-Frameworks für tiefere Einsichten",
                  details: [
                    "Was lief heute besonders gut in meinen Sessions?",
                    "Welche Herausforderungen bin ich begegnet?",
                    "Was habe ich über meine Coaching-Praxis gelernt?"
                  ]
                },
                {
                  title: "Entwicklungsziele ableiten",
                  description: "Transformieren Sie Reflexionen in konkrete Entwicklungsschritte",
                  details: [
                    "Verbesserungsmöglichkeiten identifizieren",
                    "Konkrete Lernziele für die Zukunft definieren",
                    "Erfolge würdigen und darauf aufbauen"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard
                icon={BookOpen}
                title="Strukturierte Templates"
                description="Bewährte Reflexions-Vorlagen für verschiedene Coaching-Situationen."
              />
              <FeatureCard
                icon={Calendar}
                title="Routine-Tracking"
                description="Verfolgen Sie Ihre Reflexions-Gewohnheiten und Entwicklungsfortschritte."
              />
              <FeatureCard
                icon={Search}
                title="Einsichten-Suche"
                description="Suchen Sie nach Mustern und Entwicklungen in Ihren Reflexionen."
              />
              <FeatureCard
                icon={TrendingUp}
                title="Fortschritts-Analyse"
                description="Visualisieren Sie Ihre persönliche Entwicklung über Zeit."
              />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Reflexions-Templates</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Tägliche Reflexion</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• <strong>Höhepunkt:</strong> Was war heute mein größter Coaching-Erfolg?</li>
                    <li>• <strong>Herausforderung:</strong> Welche Situation war besonders schwierig?</li>
                    <li>• <strong>Lerning:</strong> Was habe ich heute über mich/meine Praxis gelernt?</li>
                    <li>• <strong>Morgen:</strong> Was nehme ich mir für morgen vor?</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-3">Wöchentliche Reflexion</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• <strong>Entwicklung:</strong> Wie habe ich mich diese Woche entwickelt?</li>
                    <li>• <strong>Muster:</strong> Welche Muster erkenne ich in meinen Sessions?</li>
                    <li>• <strong>Ziele:</strong> Welche Fortschritte habe ich bei meinen Zielen gemacht?</li>
                    <li>• <strong>Anpassung:</strong> Was möchte ich nächste Woche anders machen?</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6">
                <h4 className="font-semibold text-green-400 mb-3">Vorteile der Reflexion</h4>
                <ul className="text-green-200 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Erhöhte Selbstwahrnehmung als Coach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Kontinuierliche Verbesserung der Coaching-Qualität</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Erkennung von Entwicklungsmustern</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Stressreduktion durch bewusste Verarbeitung</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-400 mb-3">Reflexions-Tipps</h4>
                <ul className="text-blue-200 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Ehrlichkeit ist wichtiger als Perfektion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Regelmäßigkeit schlägt ausführliche Einzeleinträge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Sowohl Erfolge als auch Herausforderungen reflektieren</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Konkrete Aktionen aus Reflexionen ableiten</span>
                  </li>
                </ul>
              </div>
            </div>

            <ComingSoonSection
              title="KI-Coach für Reflexions-Analyse"
              description="Intelligente Analyse Ihrer Reflexionseinträge für noch tiefere Selbsterkenntnis wird als Premium-Add-On verfügbar."
              features={[
                "Automatische Mustererkennung in Ihren Reflexionen",
                "Personalisierte Entwicklungsvorschläge basierend auf Ihren Einträgen",
                "KI-gestützte Coaching-Supervision und Feedback",
                "Intelligente Verbindung zwischen Reflexionen und Session-Erfahrungen"
              ]}
            />
          </div>
        );

      case 'invoicing':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Rechnungswesen</h1>
              <p className="text-xl text-slate-300">Professionelle Rechnungsstellung für Ihr Coaching-Business</p>
            </div>

            <StepGuide
              title="Rechnungen erstellen"
              icon={Calculator}
              steps={[
                {
                  title: "Grundeinstellungen konfigurieren",
                  description: "Richten Sie Ihre Rechnungsdetails ein",
                  details: [
                    "Firmenadresse und Kontaktdaten hinterlegen",
                    "Steuernummer und USt-IdNr. eintragen",
                    "Standard-Zahlungsbedingungen definieren"
                  ]
                },
                {
                  title: "Rechnung aus Session erstellen",
                  description: "Generieren Sie automatisch Rechnungen aus Ihren Sessions",
                  details: [
                    "Abgerechnete Sessions auswählen",
                    "Stundensätze und Leistungen prüfen",
                    "Rechnung generieren und versenden"
                  ]
                },
                {
                  title: "Zahlungsverfolgung",
                  description: "Behalten Sie den Überblick über offene und bezahlte Rechnungen",
                  details: [
                    "Status von Rechnungen verfolgen",
                    "Mahnungen bei Zahlungsverzug",
                    "Zahlungseingänge dokumentieren"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard
                icon={Calculator}
                title="Auto-Rechnungserstellung"
                description="Automatische Rechnungen basierend auf durchgeführten Sessions."
              />
              <FeatureCard
                icon={DollarSign}
                title="Flexible Preisgestaltung"
                description="Verschiedene Stundensätze für unterschiedliche Coaching-Services."
              />
              <FeatureCard
                icon={FileText}
                title="Professionelle Templates"
                description="Ansprechende Rechnungsvorlagen für verschiedene Business-Typen."
              />
              <FeatureCard
                icon={TrendingUp}
                title="Umsatz-Analytics"
                description="Detaillierte Analyse Ihrer Coaching-Umsätze und -Trends."
              />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Rechnungstypen & Services</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Einzelsessions</h4>
                  <p className="text-sm text-slate-300 mb-3">Standard-Coaching-Sessions mit flexibler Abrechnung</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Stundensatz-basierte Abrechnung</li>
                    <li>• Anpassbare Session-Längen</li>
                    <li>• Verschiedene Coaching-Typen</li>
                  </ul>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Coaching-Pakete</h4>
                  <p className="text-sm text-slate-300 mb-3">Vorausbezahlte Session-Pakete mit Rabatten</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• 5er, 10er oder 20er Pakete</li>
                    <li>• Automatische Rabattberechnung</li>
                    <li>• Session-Verbrauch tracking</li>
                  </ul>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Zusatzleistungen</h4>
                  <p className="text-sm text-slate-300 mb-3">Ergänzende Services und Materialien</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Assessment-Tools</li>
                    <li>• Coaching-Materialien</li>
                    <li>• Follow-up Services</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6">
                <h4 className="font-semibold text-green-400 mb-3">Steuerliche Vorteile</h4>
                <ul className="text-green-200 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>DSGVO-konforme Rechnungsarchivierung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Automatische Umsatzsteuer-Berechnung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Export für Steuerberater-Software</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>GoBD-konforme Buchführung</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-400 mb-3">Business-Features</h4>
                <ul className="text-blue-200 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Mehrere Währungen unterstützt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Wiederkehrende Rechnungen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Automatischer Email-Versand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Detaillierte Umsatz-Reports</span>
                  </li>
                </ul>
              </div>
            </div>

            <TroubleshootingCard
              issue="Rechnung lässt sich nicht erstellen"
              solution="Prüfen Sie, ob alle Pflichtfelder ausgefüllt sind (Kunde, Leistung, Steuersatz). Kontaktieren Sie den Support bei technischen Problemen."
              type="warning"
            />
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">KI-Features</h1>
              <span className="inline-block px-4 py-2 bg-orange-500/30 text-orange-300 rounded-full font-medium mb-4">
                Premium Add-On in Entwicklung
              </span>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Revolutionäre KI-Unterstützung für Ihr Coaching wird als Premium-Add-On verfügbar
              </p>
            </div>

            <ComingSoonSection
              title="Triadisches Coaching-System"
              description="Ein revolutionäres KI-System, das drei spezialisierte Coach-Persönlichkeiten kombiniert für optimale Coaching-Ergebnisse."
              features={[
                "Empathischer Coach: Fokus auf Emotionen und menschliche Verbindung",
                "Analytischer Coach: Datengetriebene Insights und strukturierte Ansätze", 
                "Kreativer Coach: Innovative Lösungen und kreative Durchbrüche",
                "Dynamische Anpassung je nach Coachee-Bedürfnissen und Session-Typ"
              ]}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Brain}
                title="KI-Coach-Assistent"
                description="Intelligente Echtzeit-Unterstützung während Coaching-Sessions mit personalisierter Beratung."
                status="coming"
              />
              <FeatureCard
                icon={Lightbulb}
                title="Smart Prompt-Bibliothek"
                description="Kuratierte Sammlung bewährter Coaching-Fragen und -Techniken, KI-optimiert."
                status="coming"
              />
              <FeatureCard
                icon={BarChart3}
                title="Session-Analytics"
                description="Tiefgreifende Analyse von Coaching-Verläufen mit KI-gestützten Erkenntnissen."
                status="coming"
              />
              <FeatureCard
                icon={Target}
                title="Ziel-Tracking KI"
                description="Intelligente Verfolgung und Anpassung von Coaching-Zielen basierend auf Fortschritten."
                status="coming"
              />
              <FeatureCard
                icon={Sparkles}
                title="Personalisierte Insights"
                description="Maßgeschneiderte Coaching-Empfehlungen für jeden individuellen Coachee."
                status="coming"
              />
              <FeatureCard
                icon={FileText}
                title="Auto-Dokumentation"
                description="Automatische Zusammenfassung und Strukturierung von Session-Inhalten."
                status="coming"
              />
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Das triadische KI-Coaching-System</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 rounded-lg p-6 border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💙</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Empathischer Coach</h3>
                      <p className="text-xs text-blue-300">Emotional & Menschlich</p>
                    </div>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li>• Emotionale Intelligenz & Empathie</li>
                    <li>• Beziehungsaufbau und Vertrauen</li>
                    <li>• Motivationsförderung</li>
                    <li>• Krisenintervention</li>
                  </ul>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-6 border border-green-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🧠</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Analytischer Coach</h3>
                      <p className="text-xs text-green-300">Daten & Struktur</p>
                    </div>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li>• Datengetriebene Insights</li>
                    <li>• Strukturierte Problemlösung</li>
                    <li>• Ziel- und Fortschrittsmessung</li>
                    <li>• Strategische Planung</li>
                  </ul>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Kreativer Coach</h3>
                      <p className="text-xs text-purple-300">Innovation & Kreativität</p>
                    </div>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li>• Kreative Problemlösungsansätze</li>
                    <li>• Innovative Coaching-Methoden</li>
                    <li>• Perspektivenwechsel</li>
                    <li>• Breakthrough-Momente</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Geplante KI-Features im Detail</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-white mb-2">Echtzeit-Coaching-Unterstützung</h4>
                  <p className="text-slate-300 text-sm mb-3">
                    Während Ihrer Session analysiert die KI den Gesprächsverlauf und bietet diskrete 
                    Vorschläge für Interventionen, Fragen oder Coaching-Techniken.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Live-Analyse von Gesprächsmustern</li>
                    <li>• Vorschläge für passende Coaching-Fragen</li>
                    <li>• Erkennung von Coaching-Momenten</li>
                    <li>• Anpassung an individuellen Coaching-Stil</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-white mb-2">Intelligente Session-Analyse</h4>
                  <p className="text-slate-300 text-sm mb-3">
                    Nach jeder Session erstellt die KI automatisch strukturierte Zusammenfassungen, 
                    identifiziert wichtige Erkenntnisse und schlägt Follow-up-Aktionen vor.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Automatische Session-Zusammenfassungen</li>
                    <li>• Erkennung von Schlüssel-Insights</li>
                    <li>• Vorschläge für nächste Schritte</li>
                    <li>• Trend-Analyse über mehrere Sessions</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-white mb-2">Personalisierte Coach-Entwicklung</h4>
                  <p className="text-slate-300 text-sm mb-3">
                    Die KI analysiert Ihren Coaching-Stil und schlägt personalisierte 
                    Entwicklungsmöglichkeiten und Lernressourcen vor.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Analyse Ihres individuellen Coaching-Stils</li>
                    <li>• Personalisierte Entwicklungsempfehlungen</li>
                    <li>• Kuratierte Lernressourcen</li>
                    <li>• Kontinuierliche Verbesserungsvorschläge</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 border border-orange-500/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Entwicklungsstand & Timeline</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-orange-300 mb-3">Aktueller Status</h4>
                  <ul className="text-orange-200 space-y-2 text-sm">
                    <li>🔬 KI-Modelle werden entwickelt und trainiert</li>
                    <li>🧪 Erste Prototypen in interner Beta-Phase</li>
                    <li>📊 User Research für optimale Integration</li>
                    <li>🔒 DSGVO-konforme KI-Architektur in Arbeit</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-300 mb-3">Geplante Verfügbarkeit</h4>
                  <ul className="text-yellow-200 space-y-2 text-sm">
                    <li>💡 Premium-Add-On sobald entwickelt</li>
                    <li>👥 Beta-Zugang für ausgewählte Coaches</li>
                    <li>🚀 Schrittweise Einführung neuer Features</li>
                    <li>💎 Vollständige KI-Suite als Premium-Paket</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'toolbox':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Coaching-Toolbox</h1>
              <p className="text-xl text-slate-300">Professionelle Tools und Techniken für erfolgreiches Coaching</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Target}
                title="SMART-Ziele Framework"
                description="Strukturiertes Framework für die Definition und Verfolgung von Coaching-Zielen."
              />
              <FeatureCard
                icon={Zap}
                title="GROW-Modell"
                description="Bewährtes Coaching-Modell für strukturierte Gesprächsführung."
              />
              <FeatureCard
                icon={BookOpen}
                title="Fragen-Bibliothek"
                description="Kuratierte Sammlung kraftvoller Coaching-Fragen für verschiedene Situationen."
              />
              <FeatureCard
                icon={BarChart3}
                title="Assessment-Tools"
                description="Professionelle Bewertungsinstrumente für Coaching-Diagnose."
              />
              <FeatureCard
                icon={Lightbulb}
                title="Kreativitäts-Techniken"
                description="Innovative Methoden für Problemlösung und Ideenfindung."
              />
              <FeatureCard
                icon={Users}
                title="Kommunikationsmodelle"
                description="Bewährte Frameworks für effektive Kommunikation im Coaching."
              />
            </div>

            <StepGuide
              title="SMART-Ziele mit Coachees entwickeln"
              icon={Target}
              steps={[
                {
                  title: "Spezifisch - Was genau soll erreicht werden?",
                  description: "Helfen Sie dem Coachee bei der präzisen Definition des Ziels",
                  details: [
                    "Konkrete Beschreibung des gewünschten Ergebnisses",
                    "Vermeidung vager oder allgemeiner Formulierungen",
                    "Fokus auf ein spezifisches Ergebnis oder Verhalten"
                  ]
                },
                {
                  title: "Messbar - Wie kann der Fortschritt gemessen werden?",
                  description: "Definieren Sie klare Erfolgskriterien und Metriken",
                  details: [
                    "Quantitative oder qualitative Messgrößen festlegen",
                    "Zwischenziele für Fortschrittsmessung definieren",
                    "Bewertungskriterien gemeinsam entwickeln"
                  ]
                },
                {
                  title: "Erreichbar - Ist das Ziel realistisch?",
                  description: "Bewerten Sie die Machbarkeit unter gegebenen Umständen",
                  details: [
                    "Ressourcen und Fähigkeiten des Coachee berücksichtigen",
                    "Herausfordernd aber erreichbar gestalten",
                    "Hindernisse identifizieren und Lösungen entwickeln"
                  ]
                }
              ]}
            />

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">GROW-Modell Template</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-400 mb-3">Goal (Ziel)</h4>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Was möchten Sie erreichen?</li>
                    <li>• Wie würde Erfolg aussehen?</li>
                    <li>• Wann möchten Sie das Ziel erreichen?</li>
                  </ul>
                  
                  <h4 className="font-semibold text-blue-400 mb-3 mt-6">Reality (Realität)</h4>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Wo stehen Sie aktuell?</li>
                    <li>• Was haben Sie bereits versucht?</li>
                    <li>• Welche Hindernisse gibt es?</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-3">Options (Optionen)</h4>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Welche Möglichkeiten haben Sie?</li>
                    <li>• Was könnten Sie anders machen?</li>
                    <li>• Welche Ressourcen stehen zur Verfügung?</li>
                  </ul>
                  
                  <h4 className="font-semibold text-purple-400 mb-3 mt-6">Will (Wille/Weg)</h4>
                  <ul className="text-slate-300 space-y-1 text-sm">
                    <li>• Was werden Sie konkret tun?</li>
                    <li>• Bis wann werden Sie das umsetzen?</li>
                    <li>• Wie messen Sie Ihren Erfolg?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Einstellungen</h1>
              <p className="text-xl text-slate-300">Personalisieren Sie Ihr Coachingspace-Erlebnis</p>
            </div>

            <StepGuide
              title="Grundeinstellungen konfigurieren"
              icon={Settings}
              steps={[
                {
                  title: "Profil vervollständigen",
                  description: "Richten Sie Ihr Coach-Profil ein",
                  details: [
                    "Profilbild und persönliche Informationen",
                    "Coaching-Spezialisierungen und Qualifikationen",
                    "Kontaktinformationen und Business-Details"
                  ]
                },
                {
                  title: "Arbeitszeiten definieren",
                  description: "Legen Sie Ihre Verfügbarkeitszeiten fest",
                  details: [
                    "Standard-Arbeitszeiten für Session-Planung",
                    "Urlaubszeiten und Ausnahmen",
                    "Zeitzone und Terminpräferenzen"
                  ]
                },
                {
                  title: "Benachrichtigungen anpassen",
                  description: "Steuern Sie, wie und wann Sie informiert werden",
                  details: [
                    "Email-Benachrichtigungen für Termine und Deadlines",
                    "Push-Notifications für mobile App",
                    "Erinnerungen für wichtige Coaching-Aktivitäten"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Users}
                title="Profil-Management"
                description="Verwalten Sie Ihre Coach-Identität und öffentliche Informationen."
              />
              <FeatureCard
                icon={Shield}
                title="Datenschutz-Einstellungen"
                description="Kontrollieren Sie den Umgang mit Ihren und Coachee-Daten."
              />
              <FeatureCard
                icon={Mail}
                title="Kommunikationseinstellungen"
                description="Anpassung aller Benachrichtigungen und Email-Präferenzen."
              />
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Rechtliches & DSGVO</h1>
              <p className="text-xl text-slate-300">Vollständige Compliance für Ihr Coaching-Business</p>
            </div>

            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-green-400" />
                <h3 className="text-xl font-semibold text-white">DSGVO-Konformität gewährleistet</h3>
              </div>
              <p className="text-green-200 mb-4">
                Coachingspace wurde von Grund auf DSGVO-konform entwickelt und erfüllt alle 
                Anforderungen für den professionellen Umgang mit sensiblen Coaching-Daten.
              </p>
            </div>

            <StepGuide
              title="Datenschutz-Compliance"
              icon={Shield}
              steps={[
                {
                  title: "Einverständniserklärungen einholen",
                  description: "Dokumentieren Sie die Zustimmung Ihrer Coachees zur Datenverarbeitung",
                  details: [
                    "Explizite Einwilligung zur Datenspeicherung",
                    "Transparente Information über Datenverwendung",
                    "Widerrufsmöglichkeiten klar kommunizieren"
                  ]
                },
                {
                  title: "Datenminimierung praktizieren",
                  description: "Erfassen Sie nur die notwendigen Daten für Ihr Coaching",
                  details: [
                    "Regelmäßige Überprüfung gespeicherter Daten",
                    "Löschung nicht mehr benötigter Informationen",
                    "Zweckgebundene Datenverarbeitung"
                  ]
                }
              ]}
            />
          </div>
        );

      case 'business':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Business-Optimierung</h1>
              <p className="text-xl text-slate-300">Strategien für erfolgreiches Coaching-Business Management</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={TrendingUp}
                title="Business-Analytics"
                description="Detaillierte Analyse Ihrer Coaching-Performance und Umsatzentwicklung."
              />
              <FeatureCard
                icon={DollarSign}
                title="Preisoptimierung"
                description="Strategien für optimale Preisgestaltung Ihrer Coaching-Services."
              />
              <FeatureCard
                icon={Users}
                title="Kunden-Akquisition"
                description="Bewährte Methoden für nachhaltiges Coachee-Wachstum."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Sektion auswählen</h2>
            <p className="text-slate-300">Wählen Sie eine Sektion aus dem Menü links.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Dokumentation</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <nav className="p-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 relative ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span className="text-sm flex-1">{section.title}</span>
                  {section.badge && (
                    <span className="text-xs px-2 py-1 bg-orange-500/30 text-orange-300 rounded">
                      {section.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-slate-800 border-r border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Dokumentation</h2>
        </div>
        <nav className="p-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 relative ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <section.icon className="h-5 w-5" />
              <span className="text-sm flex-1">{section.title}</span>
              {section.badge && (
                <span className="text-xs px-2 py-1 bg-orange-500/30 text-orange-300 rounded">
                  {section.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5 text-slate-400" />
            </button>
            <h1 className="text-lg font-semibold text-white">Coachingspace Docs</h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;