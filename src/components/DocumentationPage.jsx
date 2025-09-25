import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Users, FileText, Calculator, Brain, Settings, CheckCircle, AlertCircle, Play, BookOpen, Target, Zap, Shield, TrendingUp, Calendar, DollarSign, Search, Menu, X, Mail, Sparkles, Lightbulb, BarChart3, Copy, Save, Upload, Folder, Trash2, Edit, Download, Eye } from 'lucide-react';

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
    { id: 'documents', title: 'Dokumenten-Management', icon: Folder },
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
              <h1 className="text-4xl font-bold text-white mb-4">Coachingspace - Vollversion</h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Professionelles Coaching-Management mit vollständiger Funktionalität - 
                alle Core-Features sind verfügbar und einsatzbereit
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
                icon={Folder}
                title="Dokumenten-Management"
                description="Upload, Kategorisierung und Verwaltung aller Coaching-Dokumente mit Coachee-Zuweisung."
                highlight={true}
              />
              <FeatureCard
                icon={Calculator}
                title="Rechnungswesen"
                description="Vollständige Rechnungserstellung mit Abonnements, Honorarsätzen und Finanzverwaltung."
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
                icon={Settings}
                title="Einstellungen"
                description="Vereinfachte Konfiguration mit Fokus auf persönliche Daten und Firmendaten."
                highlight={true}
              />
              <FeatureCard
                icon={Brain}
                title="KI-Coach-Assistent"
                description="Intelligente Coaching-Unterstützung mit triadischem System und Prompt-Bibliothek."
                status="coming"
              />
            </div>

            <div className="bg-gradient-to-r from-blue-900/50 to-green-900/50 border border-blue-500/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Vollständig funktionsfähige Coaching-Platform</h2>
              <div className="grid md:grid-cols-2 gap-6 text-slate-300">
                <div>
                  <h3 className="font-semibold text-white mb-2">✅ Alle Core-Features verfügbar</h3>
                  <ul className="space-y-1">
                    <li>• Coachee-Verwaltung mit vollständigen Profilen</li>
                    <li>• Session-Management & Terminplanung</li>
                    <li>• Strukturierte Sitzungsnotizen mit Templates</li>
                    <li>• Dokumenten-Upload mit Drag & Drop</li>
                    <li>• Vollständiges Rechnungswesen mit Delete-Funktionen</li>
                    <li>• Reflexionstagebuch für Coach-Entwicklung</li>
                    <li>• Vereinfachte Settings ohne Branding-Komplexität</li>
                    <li>• DSGVO-konforme Sicherheit</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-300 mb-2">🚧 Zukünftige KI-Features</h3>
                  <ul className="space-y-1 text-orange-200">
                    <li>• KI-Coach-Assistent mit triadischem System</li>
                    <li>• Automatische Sitzungsanalyse</li>
                    <li>• Intelligente Fortschrittsmetriken</li>
                    <li>• Prompt-Bibliothek für Coaches</li>
                    <li>• Personalisierte KI-Insights</li>
                    <li>• Session-Optimierungsvorschläge</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Dokumenten-Management</h1>
              <p className="text-xl text-slate-300">Professionelle Verwaltung aller Coaching-Dokumente mit Upload und Kategorisierung</p>
            </div>

            <StepGuide
              title="Dokumente hochladen"
              icon={Upload}
              steps={[
                {
                  title: "Upload-Dialog öffnen",
                  description: "Starten Sie den Dokumenten-Upload über den 'Hochladen' Button",
                  details: [
                    "Button 'Hochladen' im Dokumenten-Bereich klicken",
                    "Upload-Dialog mit Drag & Drop Zone öffnet sich",
                    "Mehrere Dateien gleichzeitig unterstützt"
                  ]
                },
                {
                  title: "Dateien auswählen",
                  description: "Wählen Sie Ihre Dokumente per Drag & Drop oder File-Browser",
                  details: [
                    "Dateien in die Drag & Drop Zone ziehen",
                    "Oder 'Dateien auswählen' für Browser-Upload",
                    "Multiple Dateien werden in der Liste angezeigt"
                  ]
                },
                {
                  title: "Kategorisierung und Zuweisung",
                  description: "Ordnen Sie die Dokumente Kategorien und Coachees zu",
                  details: [
                    "Kategorie auswählen (Pflichtfeld)",
                    "Optional: Coachee-Zuweisung für personalisierte Dokumente",
                    "Beschreibung hinzufügen für bessere Auffindbarkeit"
                  ]
                },
                {
                  title: "Upload abschließen",
                  description: "Finalisieren Sie den Upload-Prozess",
                  details: [
                    "'Hochladen' Button klicken",
                    "Erfolgsbestätigung abwarten",
                    "Dokumente erscheinen in der Übersicht"
                  ]
                }
              ]}
            />

            <StepGuide
              title="Kategorien verwalten"
              icon={Folder}
              steps={[
                {
                  title: "Kategorie-Manager öffnen",
                  description: "Verwalten Sie Ihre Dokumenten-Kategorien über den Manager",
                  details: [
                    "Button 'Kategorien' im Dokumenten-Bereich",
                    "Kategorie-Manager-Dialog öffnet sich",
                    "Übersicht aller bestehenden Kategorien"
                  ]
                },
                {
                  title: "Neue Kategorie erstellen",
                  description: "Fügen Sie neue Kategorien für bessere Organisation hinzu",
                  details: [
                    "Kategorie-Namen eingeben (z.B. 'Führungskompetenz')",
                    "Farbe für visuelle Unterscheidung wählen",
                    "'Kategorie hinzufügen' klicken"
                  ]
                },
                {
                  title: "Kategorien löschen",
                  description: "Entfernen Sie nicht mehr benötigte Kategorien",
                  details: [
                    "Trash-Icon neben der Kategorie klicken",
                    "Löschung bestätigen",
                    "Zugewiesene Dokumente werden 'Ohne Kategorie' zugeordnet"
                  ]
                }
              ]}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard
                icon={Upload}
                title="Drag & Drop Upload"
                description="Intuitiver Upload durch Ziehen der Dateien in den Browser."
              />
              <FeatureCard
                icon={Folder}
                title="Kategorie-System"
                description="Flexible Kategorisierung mit farblicher Kennzeichnung."
              />
              <FeatureCard
                icon={Users}
                title="Coachee-Zuweisung"
                description="Dokumente können spezifischen Coachees zugewiesen werden."
              />
              <FeatureCard
                icon={Search}
                title="Intelligente Suche"
                description="Schnelle Suche durch alle Dokumente nach Name, Kategorie oder Coachee."
              />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Dokumenten-Aktionen</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Verfügbare Aktionen</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-400" />
                      <span><strong>Ansehen:</strong> Dokument im Browser öffnen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-400" />
                      <span><strong>Download:</strong> Datei herunterladen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-purple-400" />
                      <span><strong>Teilen:</strong> Dokument per E-Mail versenden</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Edit className="h-4 w-4 text-yellow-400" />
                      <span><strong>Bearbeiten:</strong> Metadaten und Zuweisungen ändern</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-400" />
                      <span><strong>Löschen:</strong> Dokument permanent entfernen</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-3">Best Practices</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Aussagekräftige Dateinamen verwenden</li>
                    <li>• Kategorien konsistent nutzen</li>
                    <li>• Coachee-spezifische Dokumente zuweisen</li>
                    <li>• Regelmäßige Aufräumung alter Dokumente</li>
                    <li>• Beschreibungen für komplexe Inhalte</li>
                    <li>• Vertrauliche Dokumente kennzeichnen</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <TroubleshootingCard
                issue="Upload schlägt fehl"
                solution="Prüfen Sie die Dateigröße (max. 10MB) und das Dateiformat. Stellen Sie sicher, dass Sie eine stabile Internetverbindung haben."
                type="warning"
              />
              <TroubleshootingCard
                issue="Kategorie lässt sich nicht löschen"
                solution="Kategorien mit zugewiesenen Dokumenten können nicht gelöscht werden. Verschieben Sie erst alle Dokumente in andere Kategorien."
                type="info"
              />
            </div>
          </div>
        );

      case 'invoicing':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Rechnungswesen</h1>
              <p className="text-xl text-slate-300">Vollständiges Finanzmanagement mit Rechnungen, Abonnements und Honorarsätzen</p>
            </div>

            <StepGuide
              title="Rechnungsstellung verwalten"
              icon={Calculator}
              steps={[
                {
                  title: "Honorarsätze definieren",
                  description: "Legen Sie Ihre verschiedenen Service-Preise fest",
                  details: [
                    "Tab 'Honorarsätze' öffnen",
                    "Neue Honorarsätze mit Namen und Preisen anlegen",
                    "Verschiedene Coaching-Typen unterscheiden"
                  ]
                },
                {
                  title: "Abonnements einrichten",
                  description: "Erstellen Sie wiederkehrende Rechnungszyklen für regelmäßige Kunden",
                  details: [
                    "Tab 'Abonnements' öffnen",
                    "Coachee und Honorarsatz auswählen",
                    "Intervall und Quantität festlegen"
                  ]
                },
                {
                  title: "Rechnungen bearbeiten",
                  description: "Verwalten Sie alle Ihre Rechnungen mit vollständiger Kontrolle",
                  details: [
                    "Tab 'Rechnungen' für Übersicht",
                    "Alle Aktionen verfügbar: Ansehen, Bearbeiten, Download, Löschen",
                    "Status-Verfolgung für Zahlungen"
                  ]
                }
              ]}
            />

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Rechnungswesen-Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Honorarsätze</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Flexible Preisgestaltung</li>
                    <li>• Verschiedene Service-Typen</li>
                    <li>• Individuelle Honorarsätze pro Coachee</li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-400" />
                      <span><strong>Delete-Button:</strong> Honorarsätze entfernen</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-3">Abonnements</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Wiederkehrende Rechnungen</li>
                    <li>• Automatische Generierung</li>
                    <li>• Flexible Intervalle</li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-400" />
                      <span><strong>Delete-Button:</strong> Abonnements beenden</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-3">Rechnungen</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-400" />
                      <span>Ansehen & Prüfen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Edit className="h-4 w-4 text-yellow-400" />
                      <span>Bearbeiten & Anpassen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-400" />
                      <span>PDF-Download</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-400" />
                      <span>Löschen mit Bestätigung</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6">
                <h4 className="font-semibold text-green-400 mb-3">Neue Features</h4>
                <ul className="text-green-200 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Delete-Funktionen:</strong> Abonnements und Honorarsätze können gelöscht werden</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Vollständige Rechnungsaktionen:</strong> Alle 4 Buttons funktionieren</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Bestätigungsdialoge:</strong> Sicherheitsabfragen vor dem Löschen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Toast-Benachrichtigungen:</strong> Feedback für alle Aktionen</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-400 mb-3">Workflow-Tipps</h4>
                <ul className="text-blue-200 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Honorarsätze vor Abonnements anlegen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Abonnements für wiederkehrende Kunden nutzen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Regelmäßige Kontrolle der Rechnungsstellung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Delete-Funktionen mit Bedacht verwenden</span>
                  </li>
                </ul>
              </div>
            </div>

            <TroubleshootingCard
              issue="Delete-Button funktioniert nicht"
              solution="Stellen Sie sicher, dass Sie die Berechtigung haben und das Element nicht in anderen Bereichen verwendet wird. Prüfen Sie die Browser-Konsole für Fehlermeldungen."
              type="warning"
            />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Einstellungen</h1>
              <p className="text-xl text-slate-300">Vereinfachte Konfiguration mit Fokus auf das Wesentliche</p>
            </div>

            <StepGuide
              title="Vereinfachte Settings-Konfiguration"
              icon={Settings}
              steps={[
                {
                  title: "Persönliche Daten",
                  description: "Konfigurieren Sie Ihre persönlichen Informationen für korrekte Begrüßung",
                  details: [
                    "Vorname, Nachname und Titel eingeben",
                    "E-Mail-Adresse für Kontakte",
                    "Diese Daten werden für die App-Begrüßung verwendet"
                  ]
                },
                {
                  title: "Firmendaten",
                  description: "Hinterlegen Sie Ihre Business-Informationen für Rechnungen",
                  details: [
                    "Firmenname und vollständige Adresse",
                    "Telefon, E-Mail und Website",
                    "Steuernummer und Umsatzsteuer-ID"
                  ]
                },
                {
                  title: "Bankdaten",
                  description: "Bankverbindung für Rechnungen und Zahlungsabwicklung",
                  details: [
                    "IBAN und BIC für Überweisungen",
                    "Bank-Name für vollständige Informationen",
                    "Diese Daten erscheinen auf Rechnungen"
                  ]
                }
              ]}
            />

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Einstellungs-Bereiche</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Persönliche Daten</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Vorname und Nachname</li>
                    <li>• Titel für professionelle Anrede</li>
                    <li>• E-Mail-Adresse</li>
                    <li>• Diese Daten werden für App-Begrüßung verwendet</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-3">Firmendaten</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Firmenname und Adresse</li>
                    <li>• Kontaktdaten (Telefon, E-Mail, Website)</li>
                    <li>• Steuernummer und Umsatzsteuer-ID</li>
                    <li>• Werden auf Rechnungen verwendet</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-3">Bankdaten</h4>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• IBAN und BIC</li>
                    <li>• Bank-Name</li>
                    <li>• Erscheinen auf Rechnungen</li>
                    <li>• Für Zahlungsabwicklung</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={Users}
                title="Persönliche Daten"
                description="Name, Titel und Kontaktdaten für korrekte App-Begrüßung."
              />
              <FeatureCard
                icon={DollarSign}
                title="Business-Daten"
                description="Firmendaten und Bankverbindung für professionelle Rechnungen."
              />
              <FeatureCard
                icon={Download}
                title="Export-Tools"
                description="Kalender-Export und Backup-Funktionen für Datenportabilität."
              />
            </div>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-400 mb-3">Warum vereinfacht?</h4>
              <p className="text-blue-200 mb-4">
                Da Coachingspace als internes lokales Tool verwendet wird, wurde die Komplexität 
                auf das Wesentliche reduziert. Branding-Features sind nicht nötig, wenn nur Sie 
                die App verwenden.
              </p>
              <ul className="text-blue-200 space-y-2 text-sm">
                <li>• <strong>Fokus auf Funktionalität:</strong> Nur Features die wirklich gebraucht werden</li>
                <li>• <strong>Weniger Ablenkung:</strong> Keine unnötigen Design-Optionen</li>
                <li>• <strong>Schnellere Konfiguration:</strong> Weniger Einstellungen = schnelleres Setup</li>
                <li>• <strong>Bessere Wartbarkeit:</strong> Weniger Code = weniger Fehlerquellen</li>
              </ul>
            </div>
          </div>
        );

      // Alle anderen cases bleiben gleich...
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
                  title: "Einstellungen konfigurieren",
                  description: "Richten Sie Ihre persönlichen und Business-Daten ein",
                  details: [
                    "Persönliche Daten für korrekte Begrüßung",
                    "Firmendaten für Rechnungen hinterlegen",
                    "Bankdaten für Zahlungsabwicklung eingeben"
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
                }
              ]}
            />
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
                  title: "Session durchführen",
                  description: "Beginnen Sie strukturiert Ihre Coaching-Session",
                  details: [
                    "Session im System als 'aktiv' markieren",
                    "Notizen-Bereich vorbereiten",
                    "Live-Notizen während der Session erstellen"
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
                    "Feste Zeiten für Reflexion einplanen",
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
                description="Intelligente Echtzeit-Unterstützung während Coaching-Sessions."
                status="coming"
              />
              <FeatureCard
                icon={Lightbulb}
                title="Smart Prompt-Bibliothek"
                description="Kuratierte Sammlung bewährter Coaching-Fragen und -Techniken."
                status="coming"
              />
              <FeatureCard
                icon={BarChart3}
                title="Session-Analytics"
                description="Tiefgreifende Analyse von Coaching-Verläufen mit KI-Insights."
                status="coming"
              />
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
                }
              ]}
            />
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