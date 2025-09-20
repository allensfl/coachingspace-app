import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Save, Download, Palette, Building, FileText, Calendar, Share, Bot, Upload, X, Eye, EyeOff, Copy } from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';
import * as ics from 'ics';
import { saveAs } from 'file-saver';
import { SessionStatus } from '@/types';

// Professionelle Farbpaletten für Coaches
const colorPresets = [
  { name: 'Vertrauen', primary: '#3B82F6', secondary: '#1E40AF', description: 'Seriös und vertrauensvoll' },
  { name: 'Wachstum', primary: '#10B981', secondary: '#047857', description: 'Entwicklung und Natur' },
  { name: 'Energie', primary: '#F59E0B', secondary: '#D97706', description: 'Motivation und Dynamik' },
  { name: 'Balance', primary: '#8B5CF6', secondary: '#7C3AED', description: 'Harmonie und Weisheit' },
  { name: 'Klarheit', primary: '#06B6D4', secondary: '#0891B2', description: 'Fokus und Klarheit' },
  { name: 'Warmth', primary: '#EF4444', secondary: '#DC2626', description: 'Herzlichkeit und Leidenschaft' },
  { name: 'Eleganz', primary: '#6B7280', secondary: '#374151', description: 'Zeitlos und professionell' },
  { name: 'Innovation', primary: '#EC4899', secondary: '#DB2777', description: 'Kreativ und modern' }
];

const SettingsCard = ({ icon, title, description, children, className = "" }) => (
  <Card className={`glass-card ${className}`}>
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

const LogoUploader = ({ logoUrl, onLogoChange }) => {
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(logoUrl);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: "Ungültiges Dateiformat",
        description: "Bitte wähle eine Bilddatei (PNG, JPG, SVG)."
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        variant: 'destructive',
        title: "Datei zu groß",
        description: "Die Datei darf maximal 5MB groß sein."
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreviewUrl(dataUrl);
      onLogoChange(dataUrl);
      toast({
        title: "Logo hochgeladen",
        description: "Dein Logo wurde erfolgreich aktualisiert."
      });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setPreviewUrl('');
    onLogoChange('');
  };

  return (
    <div className="space-y-4">
      <Label>Firmenlogo</Label>
      
      {/* Logo Vorschau */}
      {previewUrl && (
        <div className="relative inline-block p-4 bg-white rounded-lg border">
          <img src={previewUrl} alt="Logo Preview" className="h-16 max-w-48 object-contain" />
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
            onClick={removeLogo}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Bereich */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-300">
          <span className="font-medium text-primary cursor-pointer">Klicken zum Hochladen</span> oder Logo hierher ziehen
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG oder SVG bis 5MB</p>
      </div>

      {/* URL Input als Alternative */}
      <div className="space-y-2">
        <Label htmlFor="logoUrl" className="text-sm">Oder Logo-URL eingeben</Label>
        <Input
          id="logoUrl"
          value={logoUrl}
          onChange={(e) => {
            onLogoChange(e.target.value);
            setPreviewUrl(e.target.value);
          }}
          placeholder="https://beispiel.com/logo.png"
          className="text-sm"
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
      />
    </div>
  );
};

const ColorPicker = ({ value, onChange, presets = colorPresets }) => {
  const [showPresets, setShowPresets] = useState(true);
  const [customColor, setCustomColor] = useState(value);
  const { toast } = useToast();

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Farbe kopiert",
      description: `${color} wurde in die Zwischenablage kopiert.`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Primärfarbe</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPresets(!showPresets)}
        >
          {showPresets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPresets ? 'Paletten ausblenden' : 'Paletten anzeigen'}
        </Button>
      </div>

      {/* Farbpaletten */}
      {showPresets && (
        <div className="grid grid-cols-2 gap-3">
          {presets.map((preset) => (
            <div
              key={preset.name}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                value === preset.primary 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => onChange(preset.primary)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: preset.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: preset.secondary }}
                />
                <span className="font-medium text-sm text-white">{preset.name}</span>
              </div>
              <p className="text-xs text-gray-400">{preset.description}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">{preset.primary}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(preset.primary);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Color Input */}
      <div className="space-y-2">
        <Label htmlFor="customColor">Oder eigene Farbe (HEX)</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="customColor"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                if (e.target.value.match(/^#[0-9A-F]{6}$/i)) {
                  onChange(e.target.value);
                }
              }}
              placeholder="#3B82F6"
              className="pl-10"
            />
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded border border-white/20"
              style={{ backgroundColor: customColor.match(/^#[0-9A-F]{6}$/i) ? customColor : '#gray' }}
            />
          </div>
          <input
            type="color"
            value={customColor.match(/^#[0-9A-F]{6}$/i) ? customColor : '#3B82F6'}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onChange(e.target.value);
            }}
            className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Color Preview */}
      <div className="p-4 rounded-lg border border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white">Vorschau</span>
          <div className="text-xs text-gray-400">{value}</div>
        </div>
        <Button style={{ backgroundColor: value }} className="text-white">
          Beispiel Button
        </Button>
      </div>
    </div>
  );
};

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

  const handleLogoChange = (logoUrl) => {
    setLocalSettings(prev => ({
      ...prev,
      company: { ...prev.company, logoUrl }
    }));
  };

  const handleColorChange = (color) => {
    setLocalSettings(prev => ({
      ...prev,
      theme: { ...prev.theme, primaryColor: { hex: color } }
    }));
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
          <Button onClick={handleSave} size="lg">
            <Save className="mr-2 h-4 w-4" /> Änderungen speichern
          </Button>
        </div>

        {/* Kompakte, organisierte Layout-Struktur */}
        <div className="space-y-6">
          {/* Branding - Vollbreite, kompakt */}
          <SettingsCard 
            icon={<Palette className="text-primary" />} 
            title="Branding & Design"
            description="Logo, Farben und Design-Einstellungen"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Logo - kompakte Version */}
              <div className="space-y-3">
                <Label>Logo</Label>
                {localSettings.company.logoUrl && (
                  <div className="relative inline-block p-2 bg-white rounded border">
                    <img src={localSettings.company.logoUrl} alt="Logo" className="h-8 max-w-24 object-contain" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs"
                      onClick={() => handleLogoChange('')}
                    >
                      ×
                    </Button>
                  </div>
                )}
                <Input
                  placeholder="Logo-URL"
                  value={localSettings.company.logoUrl}
                  onChange={(e) => handleLogoChange(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Farbpaletten - kompakt */}
              <div className="space-y-3">
                <Label>Farbpalette</Label>
                <div className="grid grid-cols-4 gap-2">
                  {colorPresets.slice(0, 8).map((preset) => (
                    <button
                      key={preset.name}
                      className={`p-2 rounded border cursor-pointer transition-all hover:scale-105 ${
                        localSettings.theme.primaryColor.hex === preset.primary 
                          ? 'border-primary ring-2 ring-primary/30' 
                          : 'border-gray-600'
                      }`}
                      onClick={() => handleColorChange(preset.primary)}
                      title={`${preset.name} - ${preset.description}`}
                    >
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: preset.primary }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color & Dark Mode */}
              <div className="space-y-3">
                <Label>Anpassungen</Label>
                <div className="flex gap-2">
                  <Input
                    value={localSettings.theme.primaryColor.hex}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 text-sm"
                  />
                  <input
                    type="color"
                    value={localSettings.theme.primaryColor.hex}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-10 h-10 rounded border border-gray-600 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode" className="text-sm">Dark Mode</Label>
                  <Switch 
                    id="darkMode" 
                    checked={localSettings.darkMode} 
                    onCheckedChange={(checked) => handleSwitchChange('darkMode', checked)} 
                  />
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* Zwei-Spalten Layout für den Rest */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unternehmensdaten - kompakter */}
            <SettingsCard icon={<Building className="text-primary" />} title="Unternehmensdaten">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label htmlFor="company.name">Firma</Label>
                  <Input id="company.name" value={localSettings.company.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="company.owner">Inhaber</Label>
                  <Input id="company.owner" value={localSettings.company.owner} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="company.street">Straße & Nr.</Label>
                  <Input id="company.street" value={localSettings.company.street} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="company.zip">PLZ</Label>
                  <Input id="company.zip" value={localSettings.company.zip} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="company.city">Stadt</Label>
                  <Input id="company.city" value={localSettings.company.city} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="company.country">Land</Label>
                  <Input id="company.country" value={localSettings.company.country} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="company.phone">Telefon</Label>
                  <Input id="company.phone" value={localSettings.company.phone} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="company.email">E-Mail</Label>
                  <Input id="company.email" type="email" value={localSettings.company.email} onChange={handleInputChange} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="company.website">Website</Label>
                  <Input id="company.website" value={localSettings.company.website} onChange={handleInputChange} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="company.taxId">Steuernummer</Label>
                  <Input id="company.taxId" value={localSettings.company.taxId} onChange={handleInputChange} />
                </div>
              </div>
            </SettingsCard>

            {/* Finanzen - kompakter */}
            <SettingsCard icon={<FileText className="text-primary" />} title="Rechnungen & Finanzen">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label htmlFor="company.bankName">Bank</Label>
                  <Input id="company.bankName" value={localSettings.company.bankName} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="company.iban">IBAN</Label>
                  <Input id="company.iban" value={localSettings.company.iban} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="company.paymentDeadlineDays">Zahlungsfrist (Tage)</Label>
                  <Input id="company.paymentDeadlineDays" type="number" value={localSettings.company.paymentDeadlineDays} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="company.defaultTaxRate">Steuersatz (%)</Label>
                  <Input id="company.defaultTaxRate" type="number" value={localSettings.company.defaultTaxRate} onChange={handleInputChange} />
                </div>
                <div className="col-span-2 flex items-center justify-between pt-2 border-t border-gray-700">
                  <Label htmlFor="company.showBankDetailsOnInvoice" className="text-sm">Bankdaten auf Rechnungen</Label>
                  <Switch id="company.showBankDetailsOnInvoice" checked={localSettings.company.showBankDetailsOnInvoice} onCheckedChange={(checked) => handleSwitchChange('company.showBankDetailsOnInvoice', checked)} />
                </div>
              </div>
            </SettingsCard>

            {/* Kalender Export - kompakt */}
            <SettingsCard icon={<Calendar className="text-primary" />} title="Kalender Export">
              <p className="text-sm text-slate-400 mb-3">Sessions als .ics für externe Kalender exportieren</p>
              <Button variant="outline" onClick={handleExportAllSessions} className="w-full" size="sm">
                <Share className="mr-2 h-4 w-4" />
                Sessions exportieren
              </Button>
            </SettingsCard>

            {/* Backup - kompakt */}
            <SettingsCard icon={<Bot className="text-primary" />} title="Daten & Backup">
              <p className="text-sm text-slate-400 mb-3">Alle App-Daten als JSON-Datei sichern</p>
              <Button variant="outline" onClick={backupData} className="w-full" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Backup herunterladen
              </Button>
            </SettingsCard>
          </div>
        </div>
      </div>
    </>
  );
}