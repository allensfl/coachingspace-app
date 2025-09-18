import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Target, Gift, ExternalLink, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CustomFieldInput = ({ field, value, onChange, disabled }) => {
  const commonProps = {
    id: field.id,
    value: value || '',
    onChange: onChange,
    disabled: disabled,
    className: "mt-1"
  };

  switch (field.type) {
    case 'textarea':
      return <Textarea {...commonProps} />;
    case 'date':
      return <Input type="date" {...commonProps} />;
    case 'number':
      return <Input type="number" {...commonProps} />;
    case 'text':
    default:
      return <Input type="text" {...commonProps} />;
  }
};

// Alter berechnen
const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export default function ProfileCard({ 
  coachee, 
  isEditing, 
  onChange, 
  onUpdate, // ← WICHTIG: Für Auto-Save
  onCustomFieldChange,
  customFields = [] 
}) {
  // ← NEUER STATE für lokale Änderungen
  const [localCoachee, setLocalCoachee] = useState(coachee);

  // State aktualisieren wenn coachee prop sich ändert
  useEffect(() => {
    setLocalCoachee(coachee);
  }, [coachee]);

  const handleFieldChange = (field, value) => {
    console.log(`ProfileCard - Feld geändert: ${field} = ${value}`);
    
    // ← NEUE LOGIK: Lokalen State und Parent gleichzeitig aktualisieren
    const updatedCoachee = {
      ...localCoachee,
      [field]: value
    };
    
    setLocalCoachee(updatedCoachee);
    
    // Sofortiges Auto-Save wenn onUpdate vorhanden ist
    if (onUpdate) {
      onUpdate(updatedCoachee);
    }
    
    // Fallback für onChange
    if (onChange) {
      onChange(field, value);
    }
  };

  const handleCustomChange = (fieldId, value) => {
    if (onCustomFieldChange) {
      onCustomFieldChange(fieldId, value);
    }
  };

  // ← PORTAL-FUNKTIONEN HINZUGEFÜGT
  const generatePortalAccess = () => {
    // Erstelle Portal-Zugang-Struktur wie im CoacheePortal erwartet
    const oneTimeToken = crypto.randomUUID();
    const portalAccess = {
      oneTimeToken: oneTimeToken,
      permanentToken: null,
      passwordHash: null,
      expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      isUsed: false,
      hasPassword: false
    };

    // Coachee mit Portal-Zugang aktualisieren
    const updatedCoachee = {
      ...localCoachee,
      portalAccess: portalAccess,
      portalData: {
        journalEntries: [],
        tasks: [],
        documents: [],
        weeklyImpulses: [],
        progressData: { goals: [], achievements: [], reflections: [] },
        sharedContent: [],
        lastUpdated: new Date().toISOString()
      }
    };

    setLocalCoachee(updatedCoachee);

    // Auto-Save
    if (onUpdate) {
      onUpdate(updatedCoachee);
    }

    // Portal-Link erstellen und kopieren
    const portalLink = `${window.location.origin}/portal/${oneTimeToken}`;
    navigator.clipboard.writeText(portalLink);

    return portalLink;
  };

  const getPortalStatus = () => {
    const access = localCoachee?.portalAccess;
    if (!access) return { status: 'none', text: 'Nicht eingerichtet', color: 'text-slate-400' };

    if (access.hasPassword && access.permanentToken) {
      return { status: 'active', text: 'Aktiv', color: 'text-green-400' };
    }

    if (access.oneTimeToken && !access.isUsed) {
      const expiry = new Date(access.expirationTime);
      const now = new Date();
      if (now > expiry) {
        return { status: 'expired', text: 'Abgelaufen', color: 'text-red-400' };
      }
      return { status: 'pending', text: 'Wartet auf Setup', color: 'text-yellow-400' };
    }

    return { status: 'used', text: 'Verwendet', color: 'text-blue-400' };
  };

  const age = calculateAge(localCoachee?.birthDate); // ← localCoachee verwenden
  const portalStatus = getPortalStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Profil Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-slate-300">Vorname</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={localCoachee?.firstName || ''}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              ) : (
                <div className="px-3 py-2 text-white bg-slate-900/50 rounded-md">
                  {localCoachee?.firstName || 'Nicht gesetzt'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-slate-300">Nachname</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={localCoachee?.lastName || ''}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              ) : (
                <div className="px-3 py-2 text-white bg-slate-900/50 rounded-md">
                  {localCoachee?.lastName || 'Nicht gesetzt'}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-Mail
            </Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={localCoachee?.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="bg-slate-900 border-slate-600 text-white"
              />
            ) : (
              <div className="px-3 py-2 text-white bg-slate-900/50 rounded-md">
                {localCoachee?.email || 'Nicht gesetzt'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-300 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefon
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                type="tel"
                value={localCoachee?.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="bg-slate-900 border-slate-600 text-white"
              />
            ) : (
              <div className="px-3 py-2 text-white bg-slate-900/50 rounded-md">
                {localCoachee?.phone || 'Nicht gesetzt'}
              </div>
            )}
          </div>

          {/* ← REPARIERTES BIRTHDAY FIELD mit Auto-Save */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-slate-300 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Geburtstag
              {age && <Badge variant="secondary" className="ml-2">{age} Jahre</Badge>}
            </Label>
            {isEditing ? (
              <Input
                id="birthDate"
                type="date"
                value={localCoachee?.birthDate || ''}
                onChange={(e) => {
                  console.log('Geburtstag geändert:', e.target.value);
                  handleFieldChange('birthDate', e.target.value);
                }}
                className="bg-slate-900 border-slate-600 text-white"
              />
            ) : (
              <div className="px-3 py-2 text-white bg-slate-900/50 rounded-md">
                {localCoachee?.birthDate ? (
                  <>
                    {new Date(localCoachee.birthDate).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {age && <span className="text-slate-400 ml-2">({age} Jahre)</span>}
                  </>
                ) : (
                  'Nicht gesetzt'
                )}
              </div>
            )}
          </div>

          {/* Main Topic */}
          <div className="space-y-2">
            <Label htmlFor="mainTopic" className="text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Hauptthema
            </Label>
            {isEditing ? (
              <Textarea
                id="mainTopic"
                value={localCoachee?.mainTopic || ''}
                onChange={(e) => handleFieldChange('mainTopic', e.target.value)}
                className="bg-slate-900 border-slate-600 text-white min-h-[80px]"
                placeholder="Hauptthema des Coachings..."
              />
            ) : (
              <div className="px-3 py-2 text-white bg-slate-900/50 rounded-md min-h-[80px]">
                {localCoachee?.mainTopic || 'Nicht gesetzt'}
              </div>
            )}
          </div>

          {/* DSGVO Status */}
          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">DSGVO-Einwilligung</span>
              <Badge 
                variant={localCoachee?.consents?.dsgvo ? "default" : "secondary"} 
                className={localCoachee?.consents?.dsgvo ? "bg-green-600" : "bg-red-600"}
              >
                {localCoachee?.consents?.dsgvo ? '✓ Erteilt' : '✗ Ausstehend'}
              </Badge>
            </div>
          </div>

          {/* ← PORTAL-ZUGANG SEKTION HINZUGEFÜGT */}
          <div className="pt-4 border-t border-slate-700">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Coachee-Portal</span>
                <Badge 
                  variant="outline" 
                  className={`${portalStatus.color} border-current`}
                >
                  {portalStatus.text}
                </Badge>
              </div>
              
              <p className="text-slate-400 text-sm">
                Sicherer, privater Bereich für {localCoachee?.firstName} mit Passwort-Schutz. 
                Nur geteilte Inhalte sind für Sie als Coach sichtbar.
              </p>

              <Button
                onClick={() => {
                  try {
                    const portalLink = generatePortalAccess();
                    // Toast-ähnliche Benachrichtigung (falls verfügbar)
                    console.log('Portal-Link generiert und kopiert:', portalLink);
                    
                    // Einfache Alert-Nachricht
                    alert(`Portal-Link für ${localCoachee?.firstName} wurde erstellt und kopiert!\n\nLink: ${portalLink}\n\nGültigkeit: 24 Stunden\nNach dem ersten Login wird ein permanenter Zugang eingerichtet.`);
                  } catch (error) {
                    console.error('Fehler beim Portal-Link:', error);
                    alert('Fehler beim Erstellen des Portal-Links');
                  }
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Portal-Link generieren
              </Button>
              
              {portalStatus.status === 'active' && (
                <Button
                  onClick={() => {
                    const permanentLink = `${window.location.origin}/portal/${localCoachee?.portalAccess?.permanentToken}`;
                    navigator.clipboard.writeText(permanentLink);
                    alert(`Permanenter Portal-Link kopiert!\n\n${permanentLink}`);
                  }}
                  variant="outline"
                  className="w-full border-purple-500 text-purple-400 hover:bg-purple-900/20"
                  size="sm"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Permanenten Link kopieren
                </Button>
              )}
            </div>
          </div>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <div className="pt-4 border-t border-slate-700 space-y-4">
              <h3 className="text-lg font-semibold text-white">Zusätzliche Informationen</h3>
              {customFields.map(field => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-slate-300">
                    {field.label}
                  </Label>
                  <CustomFieldInput
                    field={field}
                    value={localCoachee.customData?.[field.id]}
                    onChange={(e) => handleCustomChange(field.id, e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}