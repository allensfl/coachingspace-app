import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Save, Download, Trash2, Plus, Palette, Building, Link as LinkIcon, Bot, ListPlus, Package, FileText, Calendar, Share } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStateContext } from '@/context/AppStateContext';
import PackageTemplates from './settings/PackageTemplates';
import * as ics from 'ics';
import { saveAs } from 'file-saver';
import { SessionStatus } from '@/types';


const SettingsCard = ({ icon, title, description, children }) => (
  <Card className="glass-card">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-white">
        {icon}
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);

const CustomFieldsManager = ({ fields, onUpdate }) => {
  const [localFields, setLocalFields] = useState(fields || []);
  const { toast } = useToast();

  useEffect(() => {
    setLocalFields(fields || []);
  }, [fields]);

  const addField = () => {
    const newField = { id: `custom_${Date.now()}`, label: '', type: 'text' };
    setLocalFields([...localFields, newField]);
  };

  const updateField = (index, key, value) => {
    const updatedFields = [...localFields];
    updatedFields[index][key] = value;
    setLocalFields(updatedFields);
  };

  const removeField = (index) => {
    const updatedFields = localFields.filter((_, i) => i !== index);
    setLocalFields(updatedFields);
  };

  const handleSave = () => {
    onUpdate(localFields);
    toast({
      title: "Coachee-Felder gespeichert!",
      description: "Deine Änderungen sind sofort wirksam.",
    });
  };

  return (
    <div className="space-y-4">
      {localFields.map((field, index) => (
        <div key={field.id || index} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
          <Input
            placeholder="Feldname (z.B. Branche)"
            value={field.label}
            onChange={(e) => updateField(index, 'label', e.target.value)}
            className="flex-grow"
          />
          <Select value={field.type} onValueChange={(value) => updateField(index, 'type', value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="textarea">Textbereich</SelectItem>
              <SelectItem value="date">Datum</SelectItem>
              <SelectItem value="number">Zahl</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={() => removeField(index)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={addField}>
          <Plus className="mr-2 h-4 w-4" /> Feld hinzufügen
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Felder speichern
        </Button>
      </div>
    </div>
  );
};


export default function SettingsComponent() {
  const { state, actions } = useAppStateContext();
  const { settings, packageTemplates, sessions, coachees } = state;
  const { setSettings, setPackageTemplates, backupData } = actions;
  const [localSettings, setLocalSettings] = useState(settings);
  const { toast } = useToast();

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const keys = id.split('.');
    setLocalSettings(prev => {
      let newSettings = JSON.parse(JSON.stringify(prev)); // Deep copy
      let current = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
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
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = checked;
        return newSettings;
      });
  };

  const handleRemoteToolChange = (index, key, value) => {
    const newTools = [...localSettings.remoteTools];
    newTools[index][key] = value;
    setLocalSettings(prev => ({ ...prev, remoteTools: newTools }));
  };

  const addRemoteTool = () => {
    setLocalSettings(prev => ({
      ...prev,
      remoteTools: [...prev.remoteTools, { name: '', url: '' }]
    }));
  };

  const removeRemoteTool = (index) => {
    const newTools = localSettings.remoteTools.filter((_, i) => i !== index);
    setLocalSettings(prev => ({ ...prev, remoteTools: newTools }));
  };

  const handleCustomFieldsUpdate = (updatedFields) => {
    const newSettings = { ...localSettings, coacheeFields: updatedFields };
    setLocalSettings(newSettings);
    setSettings(newSettings); // Immediately save to global state
  };

  const handleSave = () => {
    setSettings(localSettings);
    toast({
      title: "Einstellungen gespeichert!",
      description: "Deine Änderungen wurden erfolgreich übernommen.",
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
        organizer: { name: settings.company.name, email: settings.company.email },
        attendees: [
          { name: settings.company.name, email: settings.company.email, rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
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
      toast({ title: "Kalender-Datei erstellt", description: `${upcomingSessions.length} Sessions wurden exportiert.`});
    });
  };

  return (
    <>
      <Helmet>
        <title>Einstellungen - Coachingspace</title>
        <meta name="description" content="Passe dein Coachingspace an deine Bedürfnisse an." />
      </Helmet>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Einstellungen</h2>
            <p className="text-slate-400">Passe dein Coachingspace an deine Bedürfnisse an.</p>
          </div>
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Änderungen speichern</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <SettingsCard icon={<Palette className="text-primary" />} title="Branding & Design">
              <div className="space-y-2">
                <Label htmlFor="theme.primaryColor.hex">Primärfarbe (HEX)</Label>
                <Input id="theme.primaryColor.hex" value={localSettings.theme.primaryColor.hex} onChange={handleInputChange} placeholder="#3b82f6" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <Switch id="darkMode" checked={localSettings.darkMode} onCheckedChange={(checked) => handleSwitchChange('darkMode', checked)} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="company.logoUrl">Logo URL</Label>
                  <Input id="company.logoUrl" value={localSettings.company.logoUrl} onChange={handleInputChange} placeholder="https://beispiel.com/logo.png" />
                  <p className="text-xs text-slate-400">Lade dein Logo bei einem Bild-Hoster hoch und füge den Link hier ein.</p>
              </div>
            </SettingsCard>

            <SettingsCard icon={<Building className="text-primary" />} title="Unternehmensdaten">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="company.name">Firmenname</Label><Input id="company.name" value={localSettings.company.name} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="company.owner">Inhaber/in</Label><Input id="company.owner" value={localSettings.company.owner} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="company.street">Strasse & Nr.</Label><Input id="company.street" value={localSettings.company.street} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="company.zip">PLZ</Label><Input id="company.zip" value={localSettings.company.zip} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="company.city">Stadt</Label><Input id="company.city" value={localSettings.company.city} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="company.country">Land</Label><Input id="company.country" value={localSettings.company.country} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="company.phone">Telefon</Label><Input id="company.phone" value={localSettings.company.phone} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="company.email">E-Mail</Label><Input id="company.email" type="email" value={localSettings.company.email} onChange={handleInputChange} /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="company.website">Website</Label><Input id="company.website" value={localSettings.company.website} onChange={handleInputChange} /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="company.taxId">Steuernummer / USt-IdNr.</Label><Input id="company.taxId" value={localSettings.company.taxId} onChange={handleInputChange} /></div>
                </div>
            </SettingsCard>
            
            <SettingsCard icon={<ListPlus className="text-primary" />} title="Coachee-Felder" description="Definiere eigene Felder für deine Coachee-Profile. Änderungen werden sofort gespeichert.">
              <CustomFieldsManager fields={localSettings.coacheeFields} onUpdate={handleCustomFieldsUpdate} />
            </SettingsCard>
            
            <SettingsCard icon={<Calendar className="text-primary" />} title="Kalender-Synchronisation">
              <p className="text-sm text-slate-400">Exportiere alle deine zukünftigen Sessions als .ics-Datei, um sie in deinen externen Kalender (Google, Outlook, etc.) zu importieren.</p>
              <Button variant="secondary" onClick={handleExportAllSessions} className="w-full">
                <Share className="mr-2 h-4 w-4" />
                Alle zukünftigen Sessions exportieren
              </Button>
            </SettingsCard>
          </div>

          <div className="space-y-8">
             <SettingsCard icon={<FileText className="text-primary" />} title="Rechnungen & Finanzen">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="company.bankName">Bank</Label><Input id="company.bankName" value={localSettings.company.bankName} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="company.iban">IBAN</Label><Input id="company.iban" value={localSettings.company.iban} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="company.paymentDeadlineDays">Zahlungsfrist (Tage)</Label><Input id="company.paymentDeadlineDays" type="number" value={localSettings.company.paymentDeadlineDays} onChange={handleInputChange} /></div>
                    <div className="space-y-2"><Label htmlFor="company.defaultTaxRate">Standard-Steuersatz (%)</Label><Input id="company.defaultTaxRate" type="number" value={localSettings.company.defaultTaxRate} onChange={handleInputChange} /></div>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <Label htmlFor="company.showBankDetailsOnInvoice">Bankverbindung auf Rechnungen anzeigen</Label>
                    <Switch id="company.showBankDetailsOnInvoice" checked={localSettings.company.showBankDetailsOnInvoice} onCheckedChange={(checked) => handleSwitchChange('company.showBankDetailsOnInvoice', checked)} />
                </div>
             </SettingsCard>
            <SettingsCard icon={<Package className="text-primary" />} title="Coaching-Pakete" description="Definiere Vorlagen für deine Coaching-Pakete.">
              <PackageTemplates packageTemplates={packageTemplates} setPackageTemplates={setPackageTemplates} />
            </SettingsCard>
            <SettingsCard icon={<LinkIcon className="text-primary" />} title="Remote-Tools">
              {localSettings.remoteTools.map((tool, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input placeholder="Name (z.B. Zoom)" value={tool.name} onChange={(e) => handleRemoteToolChange(index, 'name', e.target.value)} />
                  <Input placeholder="URL" value={tool.url} onChange={(e) => handleRemoteToolChange(index, 'url', e.target.value)} />
                  <Button variant="ghost" size="icon" onClick={() => removeRemoteTool(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addRemoteTool}><Plus className="mr-2 h-4 w-4" /> Tool hinzufügen</Button>
            </SettingsCard>

            <SettingsCard icon={<Bot className="text-primary" />} title="Daten & Backup">
              <p className="text-sm text-slate-400">Sichere deine gesamten App-Daten als JSON-Datei. Dies beinhaltet Coachees, Sessions, Rechnungen und Einstellungen.</p>
              <Button variant="secondary" onClick={backupData} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Daten-Backup herunterladen
              </Button>
            </SettingsCard>
          </div>
        </div>
      </div>
    </>
  );
}