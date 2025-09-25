import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Save, Download, Building, FileText, Calendar, Share, Bot, Users } from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';
import * as ics from 'ics';
import { saveAs } from 'file-saver';
import { SessionStatus } from '@/types';

const SettingsCard = ({ icon, title, description, children, className = "" }) => (
  <Card className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 ${className}`}>
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-white">
        {icon}
        {title}
      </CardTitle>
      {description && <CardDescription className="text-slate-400">{description}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);

export default function SettingsComponent() {
  const { state, actions } = useAppStateContext();
  const { settings, sessions, coachees } = state;
  const { setSettings, backupData } = actions;
  const [localSettings, setLocalSettings] = useState(settings);
  const { toast } = useToast();

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const keys = id.split('.');
    setLocalSettings(prev => {
      let newSettings = JSON.parse(JSON.stringify(prev));
      let current = newSettings;
      
      // Stelle sicher, dass verschachtelte Objekte existieren
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSwitchChange = (id, checked) => {
    const keys = id.split('.');
    setLocalSettings(prev => {
      let newSettings = JSON.parse(JSON.stringify(prev));
      let current = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = checked;
      return newSettings;
    });
  };

  const handleSave = () => {
    setSettings(localSettings);
    toast({
      title: "Einstellungen gespeichert!",
      description: "Deine Änderungen wurden erfolgreich übernommen.",
      className: "bg-green-600 text-white"
    });
  };

  const handleExportAllSessions = () => {
    const upcomingSessions = (sessions || []).filter(s => s.status === SessionStatus.PLANNED && new Date(s.date) >= new Date());

    if (upcomingSessions.length === 0) {
      toast({
        variant: 'destructive',
        title: "Keine zukünftigen Sessions",
        description: "Es wurden keine geplanten Sessions für den Export gefunden.",
      });
      return;
    }

    const events = upcomingSessions.map(session => {
      const coachee = coachees.find(c => c.id === session.coacheeId);
      const eventDate = new Date(session.date);
      const start = [
        eventDate.getFullYear(),
        eventDate.getMonth() + 1,
        eventDate.getDate(),
        eventDate.getHours(),
        eventDate.getMinutes()
      ];

      return {
        start,
        duration: { minutes: session.duration },
        title: `Coaching: ${session.topic}`,
        description: `Coaching Session mit ${session.coacheeName}. Notizen: ${session.coachNotes}`,
        organizer: { name: settings.company?.name || 'Coach', email: settings.company?.email || '' },
        attendees: [
          { name: settings.company?.name || 'Coach', email: settings.company?.email || '', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
          { name: session.coacheeName, email: coachee?.email || '', rsvp: true, partstat: 'NEEDS-ACTION', role: 'REQ-PARTICIPANT' }
        ]
      };
    });

    ics.createEvents(events, (error, value) => {
      if (error) {
        console.error(error);
        toast({ variant: 'destructive', title: "Fehler", description: "Kalender-Datei konnte nicht erstellt werden."});
        return;
      }
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
      saveAs(blob, 'Coachingspace_Termine.ics');
      toast({ 
        title: "Kalender-Datei erstellt", 
        description: `${upcomingSessions.length} Sessions wurden exportiert.`,
        className: "bg-green-600 text-white"
      });
    });
  };

  return (
    <>
      <Helmet>
        <title>Einstellungen - Coachingspace</title>
        <meta name="description" content="Passe dein Coachingspace an deine Bedürfnisse an." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                Einstellungen
              </h1>
              <p className="text-slate-400">Passe dein Coachingspace an deine Bedürfnisse an.</p>
            </div>
            <Button onClick={handleSave} size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
              <Save className="mr-2 h-4 w-4" /> Änderungen speichern
            </Button>
          </div>

          <div className="space-y-6">
            {/* Persönliche Daten - für Begrüßung */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SettingsCard 
                icon={<Users className="text-blue-400" />} 
                title="Persönliche Daten"
                description="Für persönliche Begrüßung und Kontakt"
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="personal.firstName" className="text-slate-300">Vorname</Label>
                    <Input 
                      id="personal.firstName" 
                      value={localSettings.personal?.firstName || ''} 
                      onChange={handleInputChange} 
                      placeholder="Dein Vorname"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personal.lastName" className="text-slate-300">Nachname</Label>
                    <Input 
                      id="personal.lastName" 
                      value={localSettings.personal?.lastName || ''} 
                      onChange={handleInputChange} 
                      placeholder="Dein Nachname"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personal.title" className="text-slate-300">Titel/Bezeichnung</Label>
                    <Input 
                      id="personal.title" 
                      value={localSettings.personal?.title || ''} 
                      onChange={handleInputChange} 
                      placeholder="z.B. Coach, Berater, Mentor"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personal.email" className="text-slate-300">E-Mail</Label>
                    <Input 
                      id="personal.email" 
                      type="email"
                      value={localSettings.personal?.email || ''} 
                      onChange={handleInputChange} 
                      placeholder="deine@email.de"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                </div>
              </SettingsCard>

              <SettingsCard 
                icon={<Building className="text-green-400" />} 
                title="Unternehmensdaten"
                description="Für professionelle Rechnungen"
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company.name" className="text-slate-300">Firma</Label>
                    <Input 
                      id="company.name" 
                      value={localSettings.company?.name || ''} 
                      onChange={handleInputChange} 
                      placeholder="Dein Unternehmensname"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company.street" className="text-slate-300">Straße & Nr.</Label>
                    <Input 
                      id="company.street" 
                      value={localSettings.company?.street || ''} 
                      onChange={handleInputChange} 
                      placeholder="Musterstraße 123"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="company.zip" className="text-slate-300">PLZ</Label>
                      <Input 
                        id="company.zip" 
                        value={localSettings.company?.zip || ''} 
                        onChange={handleInputChange} 
                        placeholder="12345"
                        className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company.city" className="text-slate-300">Stadt</Label>
                      <Input 
                        id="company.city" 
                        value={localSettings.company?.city || ''} 
                        onChange={handleInputChange} 
                        placeholder="Musterstadt"
                        className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company.phone" className="text-slate-300">Telefon</Label>
                    <Input 
                      id="company.phone" 
                      value={localSettings.company?.phone || ''} 
                      onChange={handleInputChange} 
                      placeholder="+49 123 456789"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company.email" className="text-slate-300">E-Mail</Label>
                    <Input 
                      id="company.email" 
                      type="email" 
                      value={localSettings.company?.email || ''} 
                      onChange={handleInputChange} 
                      placeholder="info@firma.de"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company.taxId" className="text-slate-300">Steuernummer</Label>
                    <Input 
                      id="company.taxId" 
                      value={localSettings.company?.taxId || ''} 
                      onChange={handleInputChange} 
                      placeholder="123/456/78901"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                </div>
              </SettingsCard>

              <SettingsCard 
                icon={<FileText className="text-purple-400" />} 
                title="Rechnungen & Finanzen"
                description="Bankdaten und Rechnungseinstellungen"
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company.bankName" className="text-slate-300">Bank</Label>
                    <Input 
                      id="company.bankName" 
                      value={localSettings.company?.bankName || ''} 
                      onChange={handleInputChange} 
                      placeholder="Musterbank AG"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company.iban" className="text-slate-300">IBAN</Label>
                    <Input 
                      id="company.iban" 
                      value={localSettings.company?.iban || ''} 
                      onChange={handleInputChange} 
                      placeholder="DE12 3456 7890 1234 5678 90"
                      className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="company.paymentDeadlineDays" className="text-slate-300">Zahlungsfrist (Tage)</Label>
                      <Input 
                        id="company.paymentDeadlineDays" 
                        type="number" 
                        value={localSettings.company?.paymentDeadlineDays || 14} 
                        onChange={handleInputChange} 
                        className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company.defaultTaxRate" className="text-slate-300">Steuersatz (%)</Label>
                      <Input 
                        id="company.defaultTaxRate" 
                        type="number" 
                        value={localSettings.company?.defaultTaxRate || 19} 
                        onChange={handleInputChange} 
                        className="bg-slate-700/50 border-slate-600/50 text-white mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <Label htmlFor="company.showBankDetailsOnInvoice" className="text-slate-300">
                      Bankdaten auf Rechnungen anzeigen
                    </Label>
                    <Switch 
                      id="company.showBankDetailsOnInvoice" 
                      checked={localSettings.company?.showBankDetailsOnInvoice || false} 
                      onCheckedChange={(checked) => handleSwitchChange('company.showBankDetailsOnInvoice', checked)} 
                    />
                  </div>
                </div>
              </SettingsCard>
            </div>

            {/* Tools - Zwei-Spalten */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SettingsCard 
                icon={<Calendar className="text-orange-400" />} 
                title="Kalender Export"
                description="Sessions als .ics für externe Kalender exportieren"
              >
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-4">
                    Exportiere alle geplanten Sessions als Kalender-Datei für Outlook, Google Calendar oder andere Kalender-Apps.
                  </p>
                  <Button 
                    onClick={handleExportAllSessions} 
                    variant="outline" 
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Share className="mr-2 h-4 w-4" />
                    Sessions exportieren (.ics)
                  </Button>
                </div>
              </SettingsCard>

              <SettingsCard 
                icon={<Bot className="text-cyan-400" />} 
                title="Daten & Backup"
                description="Alle App-Daten als JSON-Datei sichern"
              >
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-4">
                    Lade eine vollständige Sicherung aller deiner Coachees, Sessions, Dokumente und Einstellungen herunter.
                  </p>
                  <Button 
                    onClick={backupData} 
                    variant="outline" 
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Backup herunterladen (.json)
                  </Button>
                </div>
              </SettingsCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}