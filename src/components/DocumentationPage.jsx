import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Users, FileText, Calculator, Brain, Settings, CheckCircle, AlertCircle, Play, BookOpen, Target, Zap, Shield, TrendingUp, Calendar, DollarSign, Search, Menu, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CoachingspaceDocumentation = () => {
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
    { id: 'coachees', title: 'Coachee-Verwaltung', icon: Users },
    { id: 'sessions', title: 'Session-Management', icon: Clock },
    { id: 'notes', title: 'Sitzungsnotizen', icon: FileText },
    { id: 'invoicing', title: 'Rechnungswesen', icon: Calculator },
    { id: 'toolbox', title: 'Coaching-Toolbox', icon: Zap },
    { id: 'settings', title: 'Einstellungen', icon: Settings },
    { id: 'legal', title: 'Rechtliches & DSGVO', icon: Shield },
    { id: 'business', title: 'Business-Optimierung', icon: TrendingUp },
  ];

  const QuickStartCard = ({ title, duration, steps, icon: Icon, color }) => (
    <div className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg p-6 hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          <p className="text-sm text-slate-400">{duration}</p>
        </div>
      </div>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-semibold flex items-center justify-center mt-0.5 flex-shrink-0">
              {index + 1}
            </div>
            <p className="text-sm text-slate-300">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const FeatureCard = ({ title, description, icon: Icon, color, badge }) => (
    <div className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {badge && (
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );

  const StepGuide = ({ title, steps, icon: Icon }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-semibold text-white text-xl">{title}</h3>
      </div>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white mb-1">{step.title}</h4>
              <p className="text-slate-400 text-sm mb-2">{step.description}</p>
              {step.details && (
                <div className="bg-slate-700 border border-slate-600 rounded-lg p-3">
                  <div className="space-y-1">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TroubleshootingCard = ({ problem, solution, severity = 'medium' }) => {
    const severityColors = {
      low: 'border-yellow-500/30 bg-yellow-500/10',
      medium: 'border-orange-500/30 bg-orange-500/10',
      high: 'border-red-500/30 bg-red-500/10'
    };
    
    const severityIcons = {
      low: <AlertCircle className="h-5 w-5 text-yellow-400" />,
      medium: <AlertCircle className="h-5 w-5 text-orange-400" />,
      high: <AlertCircle className="h-5 w-5 text-red-400" />
    };

    return (
      <div className={`border rounded-lg p-4 ${severityColors[severity]}`}>
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {severityIcons[severity]}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white mb-2">Problem: {problem}</h4>
            <p className="text-sm text-slate-300">{solution}</p>
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
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-full mb-6">
                <Brain className="h-6 w-6" />
                <span className="font-semibold">Coachingspace Dokumentation</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Ihre vollständige Coaching-Plattform
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Professionelles Coaching-Management mit KI-Unterstützung, DSGVO-Compliance und allem was Sie für erfolgreiches Coaching brauchen.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                title="Smart Session-Management"
                description="Automatische Terminplanung, Session-Vorbereitung und Nachbereitung mit KI-Unterstützung"
                icon={Calendar}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
                badge="KI-Power"
              />
              <FeatureCard
                title="DSGVO-konforme Datenverarbeitung"
                description="Sichere Speicherung aller Coachee-Daten mit automatischen Backup-Systemen"
                icon={Shield}
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
              <FeatureCard
                title="Intelligente Rechnungsstellung"
                description="Automatische Rechnungserstellung, Honorarsätze und Zahlungsverfolgung"
                icon={Calculator}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <FeatureCard
                title="KI-Coaching-Assistent"
                description="Personalisierte Coaching-Empfehlungen und Session-Analysen"
                icon={Brain}
                color="bg-gradient-to-br from-orange-500 to-orange-600"
                badge="Beta"
              />
              <FeatureCard
                title="Umfassende Dokumentation"
                description="Sitzungsnotizen, Fortschrittstracking und detaillierte Coachee-Profile"
                icon={FileText}
                color="bg-gradient-to-br from-teal-500 to-teal-600"
              />
              <FeatureCard
                title="Business Analytics"
                description="Performance-Metriken, Umsatzanalysen und Wachstumstrends"
                icon={TrendingUp}
                color="bg-gradient-to-br from-indigo-500 to-indigo-600"
              />
            </div>

            <div className="bg-blue-600 text-white rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Bereit zu starten?</h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Folgen Sie unserem 10-Minuten Schnellstart-Guide und richten Sie Ihr Coaching-Business professionell ein.
                </p>
                <button 
                  onClick={() => setActiveSection('quickstart')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Jetzt starten
                </button>
              </div>
            </div>
          </div>
        );

      case 'quickstart':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">10-Minuten Schnellstart</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Richten Sie Coachingspace in wenigen Minuten ein und starten Sie direkt mit Ihrem ersten Coachee.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <QuickStartCard
                title="Grundeinrichtung"
                duration="3 Minuten"
                icon={Settings}
                color="bg-blue-600"
                steps={[
                  "Einstellungen → Unternehmensdaten ausfüllen",
                  "Ihr Logo hochladen",
                  "Bankdaten für Rechnungen hinterlegen",
                  "Standardstundensatz festlegen"
                ]}
              />
              <QuickStartCard
                title="Ersten Coachee anlegen"
                duration="2 Minuten"
                icon={Users}
                color="bg-green-600"
                steps={[
                  "Coachees → 'Neuer Coachee' klicken",
                  "Kontaktdaten eingeben",
                  "DSGVO-Einverständnis einholen",
                  "Coaching-Ziele definieren"
                ]}
              />
              <QuickStartCard
                title="Erste Session planen"
                duration="2 Minuten"
                icon={Calendar}
                color="bg-purple-600"
                steps={[
                  "Sessions → 'Neue Session' erstellen",
                  "Coachee und Datum auswählen",
                  "Session-Typ festlegen",
                  "Optional: Vorbereitung mit KI"
                ]}
              />
              <QuickStartCard
                title="Erste Rechnung"
                duration="3 Minuten"
                icon={DollarSign}
                color="bg-orange-600"
                steps={[
                  "Rechnungen → 'Neue Rechnung'",
                  "Coachee und Sessions auswählen",
                  "Rechnung generieren lassen",
                  "Per E-Mail versenden"
                ]}
              />
            </div>

            <StepGuide
              title="Detaillierte Ersteinrichtung"
              icon={Target}
              steps={[
                {
                  title: "Unternehmensprofil vervollständigen",
                  description: "Navigieren Sie zu Einstellungen → Unternehmensdaten",
                  details: [
                    "Firmenname und Rechtsform eingeben",
                    "Vollständige Adresse mit PLZ hinterlegen",
                    "Steuernummer und ggf. USt-IdNr. eintragen",
                    "Kontaktdaten (Telefon, E-Mail, Website) vervollständigen"
                  ]
                },
                {
                  title: "Branding anpassen",
                  description: "Personalisieren Sie das Erscheinungsbild",
                  details: [
                    "Logo hochladen (PNG/JPG, max. 5MB)",
                    "Primärfarbe aus Farbpalette wählen",
                    "Dark/Light Mode nach Präferenz",
                    "Vorschau der Rechnungsvorlage prüfen"
                  ]
                },
                {
                  title: "Honorarsätze definieren",
                  description: "Legen Sie Ihre Standard-Preisstruktur fest",
                  details: [
                    "Einzelcoaching-Stundensatz (z.B. 120€)",
                    "Gruppencoaching-Sätze definieren",
                    "Paket-Preise für Mehrfach-Sessions",
                    "Sonderkonditionen für spezielle Zielgruppen"
                  ]
                }
              ]}
            />
          </div>
        );

      case 'coachees':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Coachee-Verwaltung</h1>
            
            <StepGuide
              title="Neuen Coachee anlegen"
              icon={Users}
              steps={[
                {
                  title: "Grunddaten erfassen",
                  description: "Coachees → 'Neuer Coachee' → Stammdaten eingeben",
                  details: [
                    "Vor- und Nachname (Pflichtfelder)",
                    "E-Mail-Adresse für Kommunikation",
                    "Telefonnummer für Notfälle",
                    "Geburtsdatum für Altersgruppen-Analysen"
                  ]
                },
                {
                  title: "DSGVO-Einverständnis einholen",
                  description: "Rechtssichere Datenverarbeitung gewährleisten",
                  details: [
                    "DSGVO-Checkbox aktivieren",
                    "Einverständniserklärung per E-Mail senden",
                    "Bestätigung abwarten und dokumentieren",
                    "Bei Minderjährigen: Elterliche Zustimmung"
                  ]
                },
                {
                  title: "Coaching-Profil erstellen",
                  description: "Individuelle Ziele und Präferenzen festhalten",
                  details: [
                    "Hauptziele des Coachings definieren",
                    "Persönlichkeitstyp und Kommunikationsstil",
                    "Verfügbarkeiten und Terminpräferenzen",
                    "Besondere Bedürfnisse oder Einschränkungen"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-500/20 bg-green-50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                    <li>• Coachee-Profile regelmäßig aktualisieren</li>
                    <li>• Notizen nach jeder Session ergänzen</li>
                    <li>• Fortschritte visuell dokumentieren</li>
                    <li>• Backup-Kontakte hinterlegen</li>
                    <li>• Coaching-Vereinbarung hochladen</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <TroubleshootingCard
                  problem="Coachee antwortet nicht auf DSGVO-Anfrage"
                  solution="Nachfassen per Telefon, alternative E-Mail versuchen, bei Minderjährigen Eltern kontaktieren"
                  severity="medium"
                />
                <TroubleshootingCard
                  problem="Doppelte Coachee-Einträge entstanden"
                  solution="Profile zusammenführen über Actions → Duplikat entfernen, Daten manuell übertragen"
                  severity="low"
                />
              </div>
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Session-Management</h1>
            
            <StepGuide
              title="Neue Session erstellen"
              icon={Calendar}
              steps={[
                {
                  title: "Session-Basis anlegen",
                  description: "Sessions → 'Neue Session' → Grunddaten eingeben",
                  details: [
                    "Coachee aus Dropdown auswählen",
                    "Datum und Uhrzeit festlegen",
                    "Session-Typ wählen (Einzelcoaching, Gruppencoaching)",
                    "Dauer in Minuten eingeben (Standard: 60 Min)"
                  ]
                },
                {
                  title: "Session-Vorbereitung mit KI",
                  description: "Intelligente Vorbereitung basierend auf bisherigen Sessions",
                  details: [
                    "KI-Assistent → 'Session vorbereiten' klicken",
                    "Ziele der Session definieren",
                    "Passende Coaching-Tools vorschlagen lassen",
                    "Reflexionsfragen automatisch generieren"
                  ]
                },
                {
                  title: "Session durchführen",
                  description: "Live-Unterstützung während des Coachings",
                  details: [
                    "Session starten → Timer aktiviert automatisch",
                    "Notizen in Echtzeit erfassen",
                    "KI-Vorschläge für Gesprächswendungen nutzen",
                    "Übungen und Tools direkt aus der App heraus verwenden"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Session-Typen
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Einzelcoaching</span>
                    <span className="text-blue-400">60-90 Min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Gruppencoaching</span>
                    <span className="text-blue-400">90-120 Min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Schnupper-Session</span>
                    <span className="text-blue-400">30 Min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Follow-up</span>
                    <span className="text-blue-400">30-45 Min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <TroubleshootingCard
                  problem="Session-Timer funktioniert nicht"
                  solution="Browser-Berechtigungen prüfen, Seite neu laden, bei iOS: Safari verwenden statt andere Browser"
                  severity="medium"
                />
                <TroubleshootingCard
                  problem="Coachee erscheint nicht in Dropdown"
                  solution="Prüfen ob Coachee aktiviert ist, DSGVO-Status überprüfen, ggf. Seite aktualisieren"
                  severity="low"
                />
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Sitzungsnotizen & Dokumentation</h1>
            
            <StepGuide
              title="Professionelle Sitzungsnotizen erstellen"
              icon={FileText}
              steps={[
                {
                  title: "Notizen während der Session",
                  description: "Echtzeit-Dokumentation für bessere Nachbereitung",
                  details: [
                    "Stichworte und Kernaussagen sofort festhalten",
                    "Emotionale Wendepunkte markieren",
                    "Aktions-Items und Hausaufgaben notieren",
                    "Templates für strukturierte Dokumentation nutzen"
                  ]
                },
                {
                  title: "KI-unterstützte Nachbearbeitung",
                  description: "Intelligente Aufbereitung und Strukturierung",
                  details: [
                    "Automatische Zusammenfassung generieren lassen",
                    "Kernerkenntnisse und Muster identifizieren",
                    "Handlungsempfehlungen ableiten",
                    "Fortschritt im Vergleich zu vorherigen Sessions"
                  ]
                },
                {
                  title: "Strukturierte Ablage",
                  description: "Systematische Organisation für langfristige Betreuung",
                  details: [
                    "Chronologische Sortierung nach Coachee",
                    "Verschlagwortung nach Themen und Zielen",
                    "Verlinkung zu relevanten Dokumenten",
                    "Export für externe Verwendung"
                  ]
                }
              ]}
            />

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Notizen-Templates</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2">GROW-Modell Template</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Goal: Was will der Coachee erreichen?</li>
                    <li>• Reality: Wie ist die aktuelle Situation?</li>
                    <li>• Options: Welche Möglichkeiten gibt es?</li>
                    <li>• Will: Was wird konkret umgesetzt?</li>
                  </ul>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-medium text-green-400 mb-2">Reflexions-Template</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Erkenntnisse der Session</li>
                    <li>• Emotionale Entwicklung</li>
                    <li>• Hindernisse und Ressourcen</li>
                    <li>• Nächste Schritte definiert</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'invoicing':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Rechnungswesen & Finanzen</h1>
            
            <StepGuide
              title="Professionelle Rechnungsstellung"
              icon={Calculator}
              steps={[
                {
                  title: "Rechnung erstellen",
                  description: "Rechnungen → 'Neue Rechnung' → Automatische Generierung",
                  details: [
                    "Coachee auswählen und Sessions hinzufügen",
                    "Automatische Berechnung nach Honorarsätzen",
                    "Steuerberechnung nach aktuellen Sätzen",
                    "Professional Invoice Template mit Ihrem Branding"
                  ]
                },
                {
                  title: "Abonnements und wiederkehrende Rechnungen",
                  description: "Langfristige Coaching-Pakete automatisiert abrechnen",
                  details: [
                    "Monatliche/quartalsweise Abrechnung einrichten",
                    "Automatische Rechnungsstellung zum Stichtag",
                    "E-Mail-Versand mit Zahlungserinnerungen",
                    "Übersicht über alle aktiven Abonnements"
                  ]
                },
                {
                  title: "Zahlungsverfolgung",
                  description: "Überblick über Zahlungseingänge und Ausstände",
                  details: [
                    "Dashboard zeigt offene Forderungen",
                    "Automatische Mahnungen nach Zahlungsziel",
                    "Zahlungsbestätigungen per E-Mail",
                    "Umsatzstatistiken und Finanzberichte"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-4">Honorarsätze</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Einzelcoaching</span>
                    <span className="text-white">120€/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Gruppencoaching</span>
                    <span className="text-white">80€/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Online-Session</span>
                    <span className="text-white">100€/h</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-blue-400 mb-4">Zahlungsziele</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Standard</span>
                    <span className="text-white">14 Tage</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Firmenkunden</span>
                    <span className="text-white">30 Tage</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Sofortzahlung</span>
                    <span className="text-white">3% Skonto</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-orange-400 mb-4">Steuersätze</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Coaching (USt-befreit)</span>
                    <span className="text-white">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Materialien</span>
                    <span className="text-white">19%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Reisekosten</span>
                    <span className="text-white">19%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">KI-Assistent für Coaches</h1>
            
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Ihr intelligenter Coaching-Partner</h2>
              </div>
              <p className="text-blue-100">
                Der KI-Assistent analysiert Ihre Coaching-Sessions, Coachee-Profile und Fortschritte, 
                um Ihnen personalisierte Empfehlungen und Insights zu geben.
              </p>
            </div>

            <StepGuide
              title="KI-Features effektiv nutzen"
              icon={Brain}
              steps={[
                {
                  title: "Session-Vorbereitung mit KI",
                  description: "Intelligente Vorbereitung basierend auf Coachee-History",
                  details: [
                    "Automatische Analyse der bisherigen Sessions",
                    "Vorschläge für Session-Ziele und Schwerpunkte",
                    "Passende Coaching-Tools und Techniken",
                    "Potentielle Gesprächsthemen und Reflexionsfragen"
                  ]
                },
                {
                  title: "Live-Coaching-Unterstützung",
                  description: "Echtzeit-Hilfe während der Session",
                  details: [
                    "Diskrete Empfehlungen für Gesprächsführung",
                    "Vorschläge bei stockenden Gesprächen",
                    "Hinweise auf emotionale Muster des Coachees",
                    "Alternative Coaching-Ansätze vorschlagen"
                  ]
                },
                {
                  title: "Session-Nachbereitung und Analyse",
                  description: "Intelligente Auswertung und Dokumentation",
                  details: [
                    "Automatische Zusammenfassung der Kernpunkte",
                    "Identifikation von Fortschritten und Mustern",
                    "Vorschläge für Follow-up Sessions",
                    "Langzeit-Entwicklung des Coachees verfolgen"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-purple-400 mb-4">KI-Analyse Beispiele</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-700 p-3 rounded">
                    <p className="text-slate-300 mb-1">"Sarah zeigt in den letzten 3 Sessions verstärkt Selbstzweifel..."</p>
                    <p className="text-blue-400">→ Empfehlung: Stärken-Inventar durchführen</p>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <p className="text-slate-300 mb-1">"Markus umgeht regelmäßig Gespräche über Karriereziele..."</p>
                    <p className="text-blue-400">→ Empfehlung: Metaphern-Arbeit einsetzen</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-4">Datenschutz & KI</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Alle Daten bleiben lokal auf Ihrem Gerät</li>
                  <li>• Keine Übertragung zu externen KI-Servern</li>
                  <li>• DSGVO-konforme lokale Verarbeitung</li>
                  <li>• Coachee-Daten werden anonymisiert analysiert</li>
                  <li>• Jederzeit KI-Features deaktivierbar</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Einstellungen & Konfiguration</h1>
            
            <StepGuide
              title="App-Einstellungen optimieren"
              icon={Settings}
              steps={[
                {
                  title: "Unternehmensprofil vervollständigen",
                  description: "Professionelle Darstellung in Rechnungen und E-Mails",
                  details: [
                    "Vollständige Firmendaten mit Steuernummer",
                    "Professionelles Logo hochladen",
                    "Bankverbindung für Rechnungen",
                    "Kontaktdaten und Website verlinken"
                  ]
                },
                {
                  title: "Branding anpassen",
                  description: "Individuelle Gestaltung Ihrer Coaching-Marke",
                  details: [
                    "Farbschema aus vorgefertigten Paletten wählen",
                    "Logo-Integration in Rechnungen und E-Mails",
                    "Dark/Light Mode nach Präferenz",
                    "Typografie und Schriftgrößen anpassen"
                  ]
                },
                {
                  title: "Workflow-Einstellungen",
                  description: "App-Verhalten an Ihre Arbeitsweise anpassen",
                  details: [
                    "Standard-Session-Dauer festlegen",
                    "Automatische E-Mail-Templates konfigurieren",
                    "Reminder und Benachrichtigungen einstellen",
                    "Backup-Intervalle definieren"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-blue-400 mb-4">Wichtige Einstellungen</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Automatische Backups</span>
                    <span className="text-green-400">Täglich</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Session-Erinnerungen</span>
                    <span className="text-blue-400">24h vorher</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Rechnungs-Versand</span>
                    <span className="text-orange-400">Automatisch</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">DSGVO-Compliance</span>
                    <span className="text-green-400">Aktiv</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <TroubleshootingCard
                  problem="E-Mail-Versand funktioniert nicht"
                  solution="SMTP-Einstellungen prüfen, Spam-Ordner kontrollieren, bei Gmail: App-Passwort verwenden"
                  severity="high"
                />
                <TroubleshootingCard
                  problem="Logo wird nicht korrekt angezeigt"
                  solution="Dateiformat prüfen (PNG/JPG), Dateigröße unter 5MB, Browser-Cache leeren"
                  severity="low"
                />
              </div>
            </div>
          </div>
        );

      case 'toolbox':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Coaching-Toolbox</h1>
            
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Ihre digitale Werkzeugkiste</h2>
              </div>
              <p className="text-purple-100">
                Die Toolbox enthält bewährte Coaching-Methoden, die sowohl in Präsenz- als auch Online-Sessions 
                einsetzbar sind. Alle Tools sind für Video-Coaching optimiert und DSGVO-konform.
              </p>
            </div>

            <StepGuide
              title="Tool-Management Workflow"
              icon={Target}
              steps={[
                {
                  title: "Tools durchsuchen und filtern",
                  description: "Toolbox → Kategorien oder Suchfunktion verwenden",
                  details: [
                    "Nach Kategorien filtern: Zielsetzung, Reflexion, Persönlichkeit",
                    "Suchfunktion für spezifische Tools verwenden", 
                    "Favoriten-System für häufig genutzte Tools",
                    "Status-Filter: Aktive vs. archivierte Tools"
                  ]
                },
                {
                  title: "Tool in Session verwenden",
                  description: "Präsentations-Modus für professionelle Anwendung",
                  details: [
                    "Tool öffnen → 'Präsentieren' klicken",
                    "Vollbild-Modus für optimale Sichtbarkeit",
                    "Screen-Sharing für Online-Sessions",
                    "Verwendung wird automatisch in Historie dokumentiert"
                  ]
                },
                {
                  title: "Eigene Tools erstellen",
                  description: "Individuelle Coaching-Materialien entwickeln",
                  details: [
                    "Neue Tools mit Rich-Text-Editor erstellen",
                    "Datei-Upload für externe Arbeitsblätter",
                    "Kategorisierung und Icon-Auswahl",
                    "Vorlagen und Templates verwenden"
                  ]
                }
              ]}
            />

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-400 mb-4">Klassische Coaching-Tools</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-medium text-white mb-1">GROW-Modell</h4>
                      <p className="text-sm text-slate-300">Strukturierter 4-Phasen-Prozess: Goal, Reality, Options, Will</p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-medium text-white mb-1">Lebensrad (Wheel of Life)</h4>
                      <p className="text-sm text-slate-300">Visuelle Bewertung verschiedener Lebensbereiche</p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-medium text-white mb-1">Inneres Team</h4>
                      <p className="text-sm text-slate-300">Visualisierung innerer Stimmen nach Schulz von Thun</p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-medium text-white mb-1">SMART-Ziele</h4>
                      <p className="text-sm text-slate-300">Spezifisch, Messbar, Attraktiv, Realistisch, Terminiert</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <h3 className="font-semibold text-green-400 mb-4">Online-Coaching Anpassungen</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Digitale Whiteboards für gemeinsame Visualisierung</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Screen-Sharing für Tool-Präsentation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Kamera-Positionierung für körperorientierte Übungen</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Vorab-Materialien per E-Mail versenden</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <h3 className="font-semibold text-orange-400 mb-4">Skalenarbeit im Detail</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-orange-400 pl-3">
                      <h4 className="font-medium text-white text-sm">Standortbestimmung</h4>
                      <p className="text-xs text-slate-400">"Auf einer Skala von 1-10, wie zuversichtlich sind Sie?"</p>
                    </div>
                    <div className="border-l-4 border-blue-400 pl-3">
                      <h4 className="font-medium text-white text-sm">Fortschrittsmessung</h4>
                      <p className="text-xs text-slate-400">Vergleich zwischen Sessions für sichtbare Entwicklung</p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-3">
                      <h4 className="font-medium text-white text-sm">Ressourcenaktivierung</h4>
                      <p className="text-xs text-slate-400">"Was müsste passieren für den nächsten Schritt?"</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-400 mb-4">Körperorientierte Tools (Online)</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-medium text-white">Belastungsübung:</span>
                      <span className="text-slate-300 ml-2">Bücher auf ausgestreckte Hand stapeln</span>
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-medium text-white">Leerer Stuhl:</span>
                      <span className="text-slate-300 ml-2">Zwei Stühle oder Handflächen nutzen</span>
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-medium text-white">Bindungsübung:</span>
                      <span className="text-slate-300 ml-2">Schal an Handgelenk und Gegenstand binden</span>
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="font-medium text-white">Tetralemma:</span>
                      <span className="text-slate-300 ml-2">Entscheidungsfindung mit Körperfühlebene</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Visualisierungs-Tools für Online-Coaching</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-400">Aufstellungsarbeit</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Soziogramm auf Papier/Whiteboard</li>
                    <li>• Post-its für Verschiebungen</li>
                    <li>• Beziehungsmuster skizzieren</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-400">Metaphern-Arbeit</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Panoramaarbeit visualisieren</li>
                    <li>• Ressourcenbaum zeichnen</li>
                    <li>• Coaching-Landkarte erstellen</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-400">Digitale Hilfsmittel</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• PowerPoint für Folien-Arbeit</li>
                    <li>• Digitales Whiteboard nutzen</li>
                    <li>• Screenshots für Dokumentation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <TroubleshootingCard
                  problem="Tool-Präsentation stockt oder ruckelt"
                  solution="Internetverbindung prüfen, andere Programme schließen, Bildschirmauflösung reduzieren"
                  severity="medium"
                />
                <TroubleshootingCard
                  problem="Coachee kann Tool-Content nicht sehen"
                  solution="Screen-Sharing aktivieren, Tool-Link per E-Mail senden, Backup als PDF bereithalten"
                  severity="high"
                />
              </div>

              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-blue-400 mb-2">💡 Profi-Tipp</h3>
                <p className="text-sm text-blue-100">
                  Bereiten Sie 2-3 Tools vor jeder Session vor und halten Sie analoge Backup-Versionen 
                  bereit. Bei technischen Problemen können Sie nahtlos zu Papier und Stift wechseln.
                </p>
              </div>
            </div>
          </div>
        );
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
                },
                {
                  title: "Datensparsamkeit praktizieren",
                  description: "Nur notwendige Daten erheben und verarbeiten",
                  details: [
                    "Pflichtfelder auf Minimum beschränken",
                    "Sensible Daten besonders schützen",
                    "Regelmäßige Löschung alter Daten",
                    "Zugriffsprotokolle führen"
                  ]
                },
                {
                  title: "Technische Schutzmaßnahmen",
                  description: "Sichere Speicherung und Verarbeitung",
                  details: [
                    "Lokale Verschlüsselung aller Coachee-Daten",
                    "Regelmäßige Sicherheits-Updates",
                    "Backup-Verschlüsselung aktivieren",
                    "Keine Cloud-Synchronisation ohne Einverständnis"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-4">DSGVO-Checklist</h3>
                <div className="space-y-2">
                  {[
                    "Datenschutzerklärung vorhanden",
                    "Einverständniserklärungen dokumentiert", 
                    "Widerrufsrecht kommuniziert",
                    "Datenminimierung praktiziert",
                    "Technische Schutzmaßnahmen aktiv",
                    "Löschkonzept implementiert"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-orange-400 mb-4">Coaching-Recht</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Schweigepflicht beachten (auch nach Coaching)</li>
                  <li>• Grenzen der Beratung einhalten</li>
                  <li>• Keine therapeutischen Diagnosen stellen</li>
                  <li>• Coaching-Vereinbarungen schriftlich fixieren</li>
                  <li>• Haftungsausschlüsse vereinbaren</li>
                  <li>• Berufshaftpflicht abschließen</li>
                </ul>
              </div>
            </div>
          </div>
        );
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">Business-Optimierung</h1>
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <StepGuide
                  title="Monatliche Business-Analyse"
                  icon={TrendingUp}
                  steps={[
                    {
                      title: "KPIs überprüfen",
                      description: "Dashboard → Business-Metriken analysieren",
                      details: [
                        "Anzahl aktiver Coachees vs. Vormonat",
                        "Durchschnittlicher Umsatz pro Coachee",
                        "Session-Auslastung und freie Kapazitäten",
                        "Zahlungseingänge und offene Forderungen"
                      ]
                    },
                    {
                      title: "Wachstumspotenziale identifizieren",
                      description: "Datenbasierte Entscheidungen treffen",
                      details: [
                        "Erfolgreiche Coaching-Methoden identifizieren",
                        "Zielgruppen mit höchster Conversion",
                        "Optimale Session-Häufigkeit ermitteln",
                        "Preisoptimierung basierend auf Nachfrage"
                      ]
                    }
                  ]}
                />
              </div>

              <div className="space-y-4">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-primary mb-2">💡 Pro-Tipp</h3>
                    <p className="text-sm text-muted-foreground">
                      Nutzen Sie die KI-Analyse für personalisierte Business-Empfehlungen basierend auf Ihren Daten.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange-500/20 bg-orange-50 dark:bg-orange-950/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">⚠️ Wichtiger Hinweis</h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      Backup-Routine: Exportieren Sie monatlich Ihre Daten als JSON-Datei für Sicherheit.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Bereich in Entwicklung</h2>
            <p className="text-gray-600">
              Diese Dokumentationsseite wird gerade überarbeitet.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
        <h1 className="font-semibold text-white">Dokumentation</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <div>
                <h1 className="font-bold text-white">Dein Coaching Business</h1>
                <p className="text-sm text-slate-400">Dokumentation</p>
              </div>
            </div>

            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:pl-0">
          <div className="max-w-5xl mx-auto p-6 lg:p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CoachingspaceDocumentation;