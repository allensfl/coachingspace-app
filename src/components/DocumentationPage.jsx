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
    { id: 'notes', title: 'Sitzungsnotizen & KI', icon: FileText },
    { id: 'journal', title: 'Reflexionstagebuch & KI', icon: BookOpen },
    { id: 'invoicing', title: 'Rechnungswesen', icon: Calculator },
    { id: 'ai', title: 'KI-Assistent', icon: Brain },
    { id: 'toolbox', title: 'Coaching-Toolbox', icon: Zap },
    { id: 'settings', title: 'Einstellungen', icon: Settings },
    { id: 'legal', title: 'Rechtliches & DSGVO', icon: Shield },
    { id: 'business', title: 'Business-Optimierung', icon: TrendingUp },
  ];

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

  const FeatureCard = ({ icon: Icon, title, description, highlight }) => (
    <div className={`bg-slate-800 border ${highlight ? 'border-blue-500/50' : 'border-slate-700'} rounded-lg p-6`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`h-6 w-6 ${highlight ? 'text-blue-400' : 'text-slate-400'}`} />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="text-slate-300 text-sm">{description}</p>
    </div>
  );

  const TroubleshootingCard = ({ problem, solution, severity = 'medium' }) => {
    const severityColors = {
      low: 'text-green-400 border-green-500/30',
      medium: 'text-yellow-400 border-yellow-500/30',
      high: 'text-red-400 border-red-500/30'
    };

    return (
      <div className={`bg-slate-800 border ${severityColors[severity]} rounded-lg p-4`}>
        <div className="flex items-start gap-3">
          <AlertCircle className={`h-5 w-5 ${severityColors[severity].split(' ')[0]} mt-0.5`} />
          <div>
            <h4 className="font-medium text-white mb-1">{problem}</h4>
            <p className="text-slate-300 text-sm">{solution}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Coachingspace Dokumentation</h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Dein umfassender Leitfaden für professionelles, DSGVO-konformes Coaching mit KI-Unterstützung
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={Clock}
                title="10-Minuten Setup"
                description="Von der Installation bis zur ersten Session - schnell startklar"
                highlight
              />
              <FeatureCard
                icon={Shield}
                title="DSGVO-konform"
                description="Lokale Datenspeicherung und automatische Compliance-Features"
                highlight
              />
              <FeatureCard
                icon={Brain}
                title="KI-gestützt"
                description="Triadisches Coaching mit intelligenter Sessionplanung und Notizen-Analyse"
                highlight
              />
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Warum Coachingspace?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-400 mb-3">Für dich als Coach</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Strukturierte Session-Dokumentation mit KI-Analyse</li>
                    <li>• Automatische Rechnungsstellung</li>
                    <li>• DSGVO-konforme Coachee-Verwaltung</li>
                    <li>• KI-unterstützte Coaching-Tools und Musteranalyse</li>
                    <li>• Intelligente Lücken-Erkennung in Sessions</li>
                    <li>• Reflexionstagebuch mit Coach-Entwicklung</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-400 mb-3">Für deine Coachees</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Transparente Fortschrittsdokumentation</li>
                    <li>• Sichere Datenhaltung</li>
                    <li>• Zugang zu Session-Notizen</li>
                    <li>• Kontinuierliche Zielverfolgung</li>
                    <li>• Automatische E-Mail-Zusammenfassungen</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Navigation der Dokumentation</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {sections.slice(1).map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="flex items-center gap-3 p-3 text-left bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <section.icon className="h-5 w-5 text-blue-400" />
                    <span className="text-slate-300">{section.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'quickstart':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Schnellstart - 10 Minuten bis zur ersten Session</h1>
            
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Play className="h-6 w-6 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Ziel: Deine erste vollständige Session dokumentieren</h2>
              </div>
              <p className="text-green-100">
                Diese Anleitung führt dich Schritt für Schritt durch die wichtigsten Funktionen. 
                Am Ende kannst du professionell coachen und dokumentieren.
              </p>
            </div>

            <StepGuide
              title="Grundsetup (3 Minuten)"
              icon={Settings}
              steps={[
                {
                  title: "Passwort einrichten",
                  description: "Sichere Anmeldung für Ihre Coaching-Daten",
                  details: [
                    "Starkes Passwort wählen (min. 8 Zeichen)",
                    "Backup-Codes herunterladen und sicher verwahren",
                    "Erste Anmeldung bestätigen"
                  ]
                },
                {
                  title: "Grunddaten eingeben",
                  description: "Einstellungen → Unternehmensdaten ausfüllen",
                  details: [
                    "Vollständiger Name und Anschrift",
                    "Steuernummer für Rechnungen",
                    "Standard-Honorarsatz definieren",
                    "Optional: Logo und Primärfarbe"
                  ]
                }
              ]}
            />

            <StepGuide
              title="Ersten Coachee anlegen (2 Minuten)"
              icon={Users}
              steps={[
                {
                  title: "Coachee-Profil erstellen",
                  description: "Navigation: Coachees → Neuer Coachee",
                  details: [
                    "Grunddaten: Name, E-Mail, Telefon",
                    "Coaching-Ziele dokumentieren",
                    "Honorarsatz individuell anpassen",
                    "DSGVO-Einverständnis per E-Mail senden"
                  ]
                },
                {
                  title: "DSGVO-Compliance sicherstellen",
                  description: "Rechtssicherheit von Anfang an",
                  details: [
                    "E-Mail mit Datenschutzlink senden",
                    "Coachee muss Einverständnis bestätigen",
                    "Grünes Häkchen im Profil überprüfen",
                    "Ohne Einverständnis kein Coaching starten"
                  ]
                }
              ]}
            />

            <StepGuide
              title="Erste Session durchführen (5 Minuten)"
              icon={Clock}
              steps={[
                {
                  title: "Session vorbereiten",
                  description: "Sessions → Neue Session anlegen",
                  details: [
                    "Coachee auswählen und Termin eingeben",
                    "Session-Typ wählen (Erstgespräch, Folgesession, etc.)",
                    "Vorlage für Session-Struktur auswählen",
                    "KI-Assistent für Gesprächsleitfaden nutzen"
                  ]
                },
                {
                  title: "Session dokumentieren",
                  description: "Parallel oder direkt nach dem Gespräch",
                  details: [
                    "Notizen in Echtzeit oder nachträglich eingeben",
                    "Vereinbarte To-Dos und nächste Schritte festhalten",
                    "Session als 'Abgeschlossen' markieren",
                    "Automatische Rechnungsstellung aktivieren"
                  ]
                },
                {
                  title: "Follow-up organisieren",
                  description: "Den Coaching-Prozess am Laufen halten",
                  details: [
                    "Nächsten Termin direkt vereinbaren",
                    "To-Do-Liste für Coachee zusammenfassen",
                    "Session-Zusammenfassung per E-Mail senden",
                    "Rechnung generieren und versenden"
                  ]
                }
              ]}
            />

            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-6">
              <h3 className="font-semibold text-blue-400 mb-3">Herzlichen Glückwunsch! 🎉</h3>
              <p className="text-blue-100 mb-4">
                Du hast deine erste Session erfolgreich dokumentiert. Coachingspace hilft dir ab sofort bei:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-blue-100">Strukturierter Session-Dokumentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-blue-100">Automatischer Rechnungsstellung</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-blue-100">DSGVO-konformer Datenverwaltung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-blue-100">KI-gestützter Coaching-Optimierung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Passwort-System & Sicherheit</h1>
            
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">DSGVO-konforme Datensicherheit</h2>
              </div>
              <p className="text-blue-100">
                Alle Coaching-Daten werden lokal verschlüsselt gespeichert. Das Backup-Code-System 
                gewährleistet Zugang auch bei vergessenem Passwort.
              </p>
            </div>

            <StepGuide
              title="Passwort-Setup und Backup-Codes"
              icon={Shield}
              steps={[
                {
                  title: "Starkes Passwort erstellen",
                  description: "Beim ersten App-Start sicheres Passwort definieren",
                  details: [
                    "Mindestens 8 Zeichen mit Groß-/Kleinbuchstaben",
                    "Zahlen und Sonderzeichen verwenden",
                    "Passwort-Stärke wird automatisch bewertet",
                    "SHA-256 Verschlüsselung mit Salt"
                  ]
                },
                {
                  title: "Backup-Codes sicher verwahren",
                  description: "5 Notfall-Codes für Passwort-Reset generieren",
                  details: [
                    "Codes im Format COACH-XXXX-XXXX",
                    "Als Textdatei herunterladen und ausdrucken",
                    "NICHT digital auf Computer speichern",
                    "Jeder Code funktioniert nur einmal"
                  ]
                },
                {
                  title: "Session-Management",
                  description: "Automatische Sicherheitsfeatures nutzen",
                  details: [
                    "8-Stunden-Session ohne erneute Anmeldung",
                    "Automatischer Logout aus Sicherheitsgründen",
                    "Alle Daten bleiben lokal verschlüsselt",
                    "Keine Cloud-Synchronisation ohne Einverständnis"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-4">Sicherheitsfeatures</h3>
                <div className="space-y-2">
                  {[
                    "AES-256 Verschlüsselung aller Daten",
                    "Lokale Speicherung (kein Server-Upload)",
                    "Backup-Code-System für Notfälle", 
                    "Automatische Session-Timeouts",
                    "DSGVO-konforme Datenhaltung"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <TroubleshootingCard
                  problem="Passwort vergessen und keine Backup-Codes"
                  solution="Komplettreset erforderlich - alle Daten gehen verloren. Backup-Codes sind essentiell!"
                  severity="high"
                />
                <TroubleshootingCard
                  problem="Backup-Code wird nicht akzeptiert"
                  solution="Code exakt eingeben, bereits verwendete Codes sind ungültig"
                  severity="medium"
                />
              </div>
            </div>
          </div>
        );

      case 'coachees':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Coachee-Verwaltung</h1>
            
            <StepGuide
              title="Vollständiges Coachee-Profil erstellen"
              icon={Users}
              steps={[
                {
                  title: "Grunddaten erfassen",
                  description: "Alle wichtigen Informationen sammeln",
                  details: [
                    "Vollständiger Name und Kontaktdaten",
                    "Beruf und Unternehmen für Kontext",
                    "Bevorzugte Kommunikationskanäle",
                    "Verfügbarkeit und Terminpräferenzen"
                  ]
                },
                {
                  title: "Coaching-Ziele definieren",
                  description: "SMART-Ziele gemeinsam erarbeiten",
                  details: [
                    "Hauptziel des Coachings formulieren",
                    "Teilziele und Meilensteine festlegen",
                    "Messbare Erfolgskriterien definieren",
                    "Zeitrahmen und Deadlines vereinbaren"
                  ]
                },
                {
                  title: "DSGVO-Einverständnis einholen",
                  description: "Rechtssichere Grundlage schaffen",
                  details: [
                    "Automatische E-Mail mit Datenschutzlink",
                    "Coachee muss aktiv zustimmen",
                    "Einverständnis wird dokumentiert",
                    "Grünes Häkchen als Bestätigung"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                icon={Target}
                title="Ziel-Tracking"
                description="Automatische Fortschrittsmessung und Visualisierung der Coaching-Erfolge"
              />
              <FeatureCard
                icon={Calendar}
                title="Terminmanagement"
                description="Integrierte Kalenderfunktion mit Erinnerungen und Rescheduling"
              />
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Session-Management</h1>
            
            <StepGuide
              title="Professionelle Session-Durchführung"
              icon={Clock}
              steps={[
                {
                  title: "Session vorbereiten",
                  description: "Optimale Vorbereitung für maximalen Erfolg",
                  details: [
                    "Vorige Session-Notizen durchlesen",
                    "Agenda und Gesprächsleitfaden erstellen",
                    "Relevante Tools und Materialien bereitstellen",
                    "Technische Setup prüfen (bei Online-Sessions)"
                  ]
                },
                {
                  title: "Session durchführen",
                  description: "Strukturiertes Vorgehen mit Live-Dokumentation",
                  details: [
                    "Check-in: Wie geht es dem Coachee?",
                    "Review: Fortschritte seit letzter Session",
                    "Hauptteil: Kernthema bearbeiten",
                    "Wrap-up: Erkenntnisse und nächste Schritte"
                  ]
                },
                {
                  title: "Session nachbereiten",
                  description: "Kontinuität und Follow-up sicherstellen",
                  details: [
                    "Session-Notizen vervollständigen",
                    "To-Dos und Vereinbarungen dokumentieren",
                    "Nächsten Termin vereinbaren",
                    "Rechnung erstellen und versenden"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                icon={Calendar}
                title="Session-Timer"
                description="Eingebauter Timer für präzise Zeiterfassung und automatische Abrechnungsgrundlage"
              />
              <FeatureCard
                icon={FileText}
                title="Template-System"
                description="Wiederverwendbare Session-Strukturen für verschiedene Coaching-Formate"
              />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-orange-400 mb-4">Session-Status Workflow</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-gray-600 text-white rounded-full text-xs font-bold flex items-center justify-center">G</div>
                  <span className="text-slate-300">Geplant → Session ist terminiert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center">L</div>
                  <span className="text-slate-300">Laufend → Session findet statt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-green-600 text-white rounded-full text-xs font-bold flex items-center justify-center">A</div>
                  <span className="text-slate-300">Abgeschlossen → Kann abgerechnet werden</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center">S</div>
                  <span className="text-slate-300">Storniert → Nicht abrechenbar</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Sitzungsnotizen & KI-Features</h1>
            
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">KI-gestützte Session-Dokumentation</h2>
              </div>
              <p className="text-purple-100">
                Professionelle Notizen werden durch KI-Analyse ergänzt: Automatische Strukturierung, 
                Lücken-Erkennung, E-Mail-Zusammenfassungen und Muster-Analyse für optimale Coaching-Effizienz.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <Brain className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">KI-Strukturierung</h3>
                <p className="text-sm text-slate-300">Automatische Kategorisierung in Beobachtungen, Erkenntnisse und Aktionspunkte</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <AlertCircle className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Lücken-Analyse</h3>
                <p className="text-sm text-slate-300">Erkennung unvollständiger Bereiche mit Verbesserungsvorschlägen</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <Mail className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">E-Mail-Generator</h3>
                <p className="text-sm text-slate-300">Automatische Session-Zusammenfassungen für Coachees</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Muster-Analyse</h3>
                <p className="text-sm text-slate-300">Langfristige Coaching-Trends und wiederkehrende Themen</p>
              </div>
            </div>

            <StepGuide
              title="KI-Workflow für Session-Notizen"
              icon={Sparkles}
              steps={[
                {
                  title: "Session-Notizen schreiben",
                  description: "Gewohnte Dokumentation mit zusätzlicher KI-Unterstützung",
                  details: [
                    "Notizen in natürlicher Sprache während/nach der Session",
                    "Kernaussagen, Emotionen und Beobachtungen festhalten",
                    "Vereinbarungen und To-Dos dokumentieren",
                    "Keine speziellen Formate notwendig - KI versteht Fließtext"
                  ]
                },
                {
                  title: "KI-Analyse aktivieren",
                  description: "Mit einem Klick professionelle Aufbereitung",
                  details: [
                    "Brain-Button (🧠): Strukturierung in Kategorien",
                    "Alert-Button (⚠️): Vollständigkeits-Check mit Checkliste",
                    "Mail-Button (📧): E-Mail-Template für Coachee generieren",
                    "Trend-Button (📈): Muster und langfristige Entwicklungen"
                  ]
                },
                {
                  title: "Ergebnisse nutzen und speichern",
                  description: "KI-Insights in die Praxis integrieren",
                  details: [
                    "Strukturierte Ergebnisse direkt als neue Notiz speichern",
                    "E-Mail-Templates kopieren und versenden",
                    "Checklisten für Vollständigkeit abarbeiten",
                    "Muster-Erkenntnisse für zukünftige Sessions nutzen"
                  ]
                }
              ]}
            />
          </div>
        );

      case 'journal':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Reflexionstagebuch & KI-Coach-Analyse</h1>
            
            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">KI-gestützte Coach-Selbstreflexion</h2>
              </div>
              <p className="text-orange-100">
                Professionelle Entwicklung durch intelligente Analyse Ihrer Coaching-Reflexionen: 
                Blinde Flecken erkennen, Muster identifizieren und gezielt an kritischen Kompetenzen arbeiten.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <Search className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Blinde Flecken</h3>
                <p className="text-sm text-slate-300">Unbewusste Coaching-Muster und Trigger-Situationen erkennen</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Entwicklungstrends</h3>
                <p className="text-sm text-slate-300">Langfristige Coaching-Evolution und Kompetenz-Entwicklung tracken</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Coaching-Muster</h3>
                <p className="text-sm text-slate-300">Spezifische Reflexion analysieren und Kompetenz-Score berechnen</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <Target className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Entwicklungsplan</h3>
                <p className="text-sm text-slate-300">Individuelle Kompetenz-Roadmap mit messbaren Zielen</p>
              </div>
            </div>

            <StepGuide
              title="KI-Workflow für Coach-Reflexion"
              icon={Lightbulb}
              steps={[
                {
                  title: "Reflexions-Eintrag schreiben",
                  description: "Authentische Selbstreflexion zu Coaching-Erfahrungen",
                  details: [
                    "Herausfordernde oder erfolgreiche Session reflektieren",
                    "Eigene Gefühle und Reaktionen ehrlich beschreiben",
                    "Zweifel, Unsicherheiten oder Erfolge dokumentieren",
                    "Fragen zur eigenen Coaching-Haltung stellen"
                  ]
                },
                {
                  title: "KI-Analyse starten",
                  description: "Coach-spezifische Analyse mit einem Klick",
                  details: [
                    "Blinde Flecken: Unbewusste Muster und Trigger identifizieren",
                    "Entwicklungstrends: Fortschritt über Zeit erkennen",
                    "Coaching-Muster: Stärken und Entwicklungsbereiche bewerten",
                    "Entwicklungsplan: Konkrete nächste Schritte ableiten"
                  ]
                },
                {
                  title: "Insights in Supervision nutzen",
                  description: "KI-Erkenntnisse professionell weiterentwickeln",
                  details: [
                    "Supervisions-Themen aus KI-Analyse ableiten",
                    "Konkrete Situationen mit Supervisor besprechen",
                    "Entwicklungsziele für 3-6 Monate definieren",
                    "Weiterbildungs-Bedarf identifizieren"
                  ]
                }
              ]}
            />

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5" />
                Blinde Flecken Analyse im Detail
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Coaching-Muster erkennen:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                      <span className="text-slate-300"><strong>Trigger-Situationen:</strong> "eingeschüchtert", "dominant", "Machtgefälle"</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                      <span className="text-slate-300"><strong>Rollenvermischung:</strong> "Ratschlag", "Lösung vorschlagen", "helfen"</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-slate-300"><strong>Grenzthemen:</strong> "schwierig abzugrenzen", "emotional mitgenommen"</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-slate-300"><strong>Stärken:</strong> "systemische Fragen", "Aha-Moment", "Vertrauen"</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-3">Supervisions-Themen ableiten:</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div>• <strong>Selbstbehauptung:</strong> Umgang mit dominanten Coachees üben</div>
                    <div>• <strong>Abgrenzung:</strong> Coaching vs. Beratung klarer trennen</div>
                    <div>• <strong>Selbstfürsorge:</strong> Emotionale Distanz entwickeln</div>
                    <div>• <strong>Methodenkompetenz:</strong> Systemische Tools vertiefen</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Individueller Entwicklungsplan
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-900 border border-slate-600 rounded p-4">
                  <h4 className="font-semibold text-red-400 mb-3">🎯 Sofortige Maßnahmen (4 Wochen)</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• <strong>Selbstbehauptung:</strong> 45 → 60</li>
                    <li>• Supervisor-Sitzung zu dominanten Coachees</li>
                    <li>• 3 schwierige Gespräche reflektieren</li>
                    <li>• "Nein"-Sagen im Coaching üben</li>
                  </ul>
                </div>
                <div className="bg-slate-900 border border-slate-600 rounded p-4">
                  <h4 className="font-semibold text-orange-400 mb-3">📚 Mittelfristig (3 Monate)</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• <strong>Abgrenzung:</strong> 62 → 80</li>
                    <li>• Weiterbildung: Coaching vs. Beratung</li>
                    <li>• Systemische Tools-Workshop</li>
                    <li>• Peer-Coaching zu Grenzthemen</li>
                  </ul>
                </div>
                <div className="bg-slate-900 border border-slate-600 rounded p-4">
                  <h4 className="font-semibold text-green-400 mb-3">🚀 Langfristig (6 Monate)</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• <strong>Gesamt-Score:</strong> 67 → 85</li>
                    <li>• Zertifizierung: Systemisches Coaching</li>
                    <li>• Mentoring für andere Coaches</li>
                    <li>• Spezialisierung: Executive Coaching</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'invoicing':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Rechnungswesen & Honorarverwaltung</h1>
            
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Automatisierte Rechnungsstellung</h2>
              </div>
              <p className="text-blue-100">
                Von der Session-Dokumentation zur fertigen Rechnung - rechtssicher, automatisiert 
                und steuerlich korrekt für professionelle Coaching-Praxis.
              </p>
            </div>

            <StepGuide
              title="Rechtskonforme Rechnungsstellung"
              icon={Calculator}
              steps={[
                {
                  title: "Rechnungsgrundlagen einrichten",
                  description: "Einstellungen → Unternehmensdaten vollständig ausfüllen",
                  details: [
                    "Vollständige Firmenadresse und Kontaktdaten",
                    "Steuernummer oder USt-IdNr. eintragen",
                    "Standard-Honorarsätze pro Coachee definieren",
                    "Zahlungsbedingungen festlegen (Standard: 14 Tage)"
                  ]
                },
                {
                  title: "Automatische Rechnungserstellung",
                  description: "Aus abgeschlossenen Sessions direkt zur Rechnung",
                  details: [
                    "Sessions auf 'Abgeschlossen' setzen",
                    "Honorarsatz wird automatisch aus Coachee-Profil übernommen",
                    "Rechnungsnummer fortlaufend und automatisch",
                    "Alle Pflichtangaben werden automatisch eingefügt"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-4">Honorar-Modelle</h3>
                <div className="space-y-3 text-sm">
                  <div className="border-b border-slate-700 pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">Einzelsession</span>
                      <span className="text-green-400">120-180€</span>
                    </div>
                    <div className="text-slate-400 text-xs">Pro 60 Minuten, flexibel buchbar</div>
                  </div>
                  <div className="border-b border-slate-700 pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">3er-Paket</span>
                      <span className="text-green-400">15% Rabatt</span>
                    </div>
                    <div className="text-slate-400 text-xs">Ideal für kurze Coaching-Prozesse</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-blue-400 mb-4">Steuerliche Aspekte</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-1" />
                    <div>
                      <span className="font-medium text-white">Umsatzsteuer:</span>
                      <div className="text-slate-400">19% bei B2B, meist 0% bei B2C (Heilberuf)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-1" />
                    <div>
                      <span className="font-medium text-white">Kleinunternehmer:</span>
                      <div className="text-slate-400">Bis 22.000€ Jahresumsatz USt-befreit</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">KI-Assistent - Triadisches Coaching</h1>
            
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">12-Schritte-Prozess für authentisches Coaching</h2>
              </div>
              <p className="text-purple-100">
                Der KI-Assistent führt Sie durch einen bewährten triadischen Ansatz: 
                Verstehen → Entwickeln → Integrieren
              </p>
            </div>

            <StepGuide
              title="Triade 1: Verstehen & Bewusstheit schaffen"
              icon={Target}
              steps={[
                {
                  title: "1. Situationsanalyse",
                  description: "Ist-Zustand vollständig erfassen",
                  details: [
                    "Aktuelle Herausforderungen identifizieren",
                    "Emotionale Befindlichkeit erkennen",
                    "Systembetrachung (Umfeld, Stakeholder)",
                    "KI-Fragen: 'Was beschäftigt Sie am meisten?'"
                  ]
                },
                {
                  title: "2. Muster erkennen",
                  description: "Wiederkehrende Themen und Verhaltensweisen",
                  details: [
                    "Automatische Reaktionsmuster identifizieren",
                    "Erfolgreiche Strategien aus der Vergangenheit",
                    "Hindernisse und Blockaden benennen",
                    "KI-Fragen: 'Wann haben Sie das schon einmal erlebt?'"
                  ]
                }
              ]}
            />
          </div>
        );

      case 'toolbox':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Coaching-Toolbox</h1>
            
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Bewährte Coaching-Tools & Methoden</h2>
              </div>
              <p className="text-purple-100">
                Sammlung erprobter Coaching-Interventionen, Fragen und Tools für verschiedene 
                Situationen und Coachee-Typen - direkt in der Session anwendbar.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-blue-400 mb-4">Systemische Tools</h3>
                <div className="space-y-3 text-sm">
                  <div className="border-b border-slate-700 pb-2">
                    <div className="font-medium text-white">Systemische Aufstellung</div>
                    <div className="text-slate-400">Beziehungen und Rollen visualisieren</div>
                  </div>
                  <div className="border-b border-slate-700 pb-2">
                    <div className="font-medium text-white">Zirkuläre Fragen</div>
                    <div className="text-slate-400">"Was würde X über Y denken?"</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-4">Lösungsfokussierte Tools</h3>
                <div className="space-y-3 text-sm">
                  <div className="border-b border-slate-700 pb-2">
                    <div className="font-medium text-white">Wunderfrage</div>
                    <div className="text-slate-400">"Angenommen, über Nacht..."</div>
                  </div>
                  <div className="border-b border-slate-700 pb-2">
                    <div className="font-medium text-white">Skalierungsfragen</div>
                    <div className="text-slate-400">1-10 Bewertung mit Details</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-orange-400 mb-4">Kreativitäts-Tools</h3>
                <div className="space-y-3 text-sm">
                  <div className="border-b border-slate-700 pb-2">
                    <div className="font-medium text-white">6-Hut-Denken</div>
                    <div className="text-slate-400">Verschiedene Denkperspektiven</div>
                  </div>
                  <div className="border-b border-slate-700 pb-2">
                    <div className="font-medium text-white">Walt-Disney-Methode</div>
                    <div className="text-slate-400">Träumer, Realist, Kritiker</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Einstellungen & Personalisierung</h1>
            
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Coachingspace an Ihre Praxis anpassen</h2>
              </div>
              <p className="text-blue-100">
                Professionelles Branding, automatisierte Workflows und individuelle Anpassungen 
                für Ihre einzigartige Coaching-Praxis.
              </p>
            </div>

            <StepGuide
              title="Grundeinrichtung für professionellen Auftritt"
              icon={Settings}
              steps={[
                {
                  title: "Unternehmensdaten vollständig eingeben",
                  description: "Basis für Rechnungen, DSGVO und rechtssichere Kommunikation",
                  details: [
                    "Vollständiger Firmenname und Rechtsform",
                    "Komplette Geschäftsadresse mit PLZ und Ort",
                    "Steuernummer oder Umsatzsteuer-Identifikationsnummer",
                    "Kontaktdaten: Telefon, E-Mail, Website"
                  ]
                },
                {
                  title: "Corporate Design einrichten",
                  description: "Professioneller, wiedererkennbarer Auftritt",
                  details: [
                    "Logo hochladen (optimal: 300x100px, PNG/SVG)",
                    "Primärfarbe für Akzente und Buttons definieren",
                    "Sekundärfarbe für Hintergründe und Rahmen",
                    "Schriftart für Dokumente und Rechnungen"
                  ]
                }
              ]}
            />
          </div>
        );

      case 'legal':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Rechtliches & DSGVO</h1>
            
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-red-400" />
                <h2 className="text-xl font-semibold text-white">Wichtiger Rechtlicher Hinweis</h2>
              </div>
              <p className="text-red-100">
                Diese Informationen ersetzen keine Rechtsberatung. Konsultieren Sie bei rechtlichen Fragen 
                immer einen Anwalt oder Datenschutzbeauftragten.
              </p>
            </div>

            <StepGuide
              title="DSGVO-konforme Coachee-Verwaltung"
              icon={Shield}
              steps={[
                {
                  title: "Einverständniserklärung einholen",
                  description: "Rechtssichere Datenverarbeitung von Anfang an",
                  details: [
                    "DSGVO-Checkbox bei Coachee-Anlage aktivieren",
                    "Automatische E-Mail mit Datenschutzerklärung",
                    "Dokumentation der Einverständnisse",
                    "Widerrufsrecht deutlich kommunizieren"
                  ]
                }
              ]}
            />
          </div>
        );

      case 'business':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Business-Optimierung</h1>
            
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Datenbasierte Geschäftsentwicklung</h2>
              </div>
              <p className="text-blue-100">
                Nutze App-Daten für strategische Entscheidungen und nachhaltiges Wachstum 
                deines Coaching-Business.
              </p>
            </div>

            <StepGuide
              title="Monatliche Business-Analyse"
              icon={TrendingUp}
              steps={[
                {
                  title: "Core Coaching Metrics tracken",
                  description: "Dashboard → Business-Metriken analysieren",
                  details: [
                    "Auslastung: Gebuchte/Verfügbare Stunden × 100",
                    "Retentionsrate: Aktive Coachees nach 6 Monaten",
                    "Session-Effizienz: Zielerreichung pro Session",
                    "Revenue per Coachee: Jahresumsatz/Anzahl Coachees"
                  ]
                }
              ]}
            />
          </div>
        );

      default:
        return (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Sektion auswählen</h2>
            <p className="text-slate-300">Wähle eine Sektion aus dem Menü links.</p>
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span className="text-sm">{section.title}</span>
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
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <section.icon className="h-5 w-5" />
              <span className="text-sm">{section.title}</span>
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