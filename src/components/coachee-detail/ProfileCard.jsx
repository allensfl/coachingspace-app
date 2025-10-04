import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseConfig';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Target, Gift, ExternalLink, Copy, Plus, X, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  onUpdate,
  onCustomFieldChange,
  customFields = [] 
}) {
  const [localCoachee, setLocalCoachee] = useState(coachee);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newField, setNewField] = useState({ name: '', type: 'text', label: '' });

  useEffect(() => {
    setLocalCoachee(coachee);
  }, [coachee]);

  const handleFieldChange = (field, value) => {
    const updatedCoachee = {
      ...localCoachee,
      [field]: value
    };
    
    setLocalCoachee(updatedCoachee);
    
    if (onUpdate) {
      onUpdate(updatedCoachee);
    }
    
    if (onChange) {
      onChange(field, value);
    }
  };

  const handleCustomChange = (fieldId, value) => {
    const updatedCustomData = {
      ...(localCoachee.customData || {}),
      [fieldId]: value
    };
    const updatedCoachee = {
      ...localCoachee,
      customData: updatedCustomData
    };
    
    setLocalCoachee(updatedCoachee);
    
    if (onUpdate) {
      onUpdate(updatedCoachee);
    }
    
    if (onCustomFieldChange) {
      onCustomFieldChange(fieldId, value);
    }
  };

  const handleAddField = () => {
    if (!newField.name || !newField.label) {
      alert("Bitte Feldname und Bezeichnung eingeben.");
      return;
    }

    const updatedCustomData = {
      ...(localCoachee.customData || {}),
      [newField.name]: ''
    };
    const updatedCoachee = {
      ...localCoachee,
      customData: updatedCustomData
    };
    
    setLocalCoachee(updatedCoachee);
    
    if (onUpdate) {
      onUpdate(updatedCoachee);
    }

    setShowAddFieldModal(false);
    setNewField({ name: '', type: 'text', label: '' });
    
    alert(`Feld "${newField.label}" wurde hinzugefügt`);
  };

  const generatePortalAccess = async () => {
    try {
      const oneTimeToken = crypto.randomUUID();
      const portalAccess = {
        oneTimeToken: oneTimeToken,
        permanentToken: null,
        passwordHash: null,
        expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isUsed: false,
        hasPassword: false
      };

      const customData = localCoachee.custom_data || {};
      const legacyId = customData.legacy_id || Date.now();

      // Mapping für Portal erstellen (nur wenn eingeloggt)
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase
            .from('portal_coachee_mapping')
            .upsert({
              portal_token: oneTimeToken,
              coachee_uuid: localCoachee.id,
              coachee_legacy_id: legacyId
            });
        }
      } catch (mappingError) {
        console.warn('Mapping creation failed (nicht kritisch):', mappingError);
      }

      // Legacy ID speichern
      if (!customData.legacy_id) {
        customData.legacy_id = legacyId;
      }

      // Coachee aktualisieren
      const updatedCoachee = {
        ...localCoachee,
        portal_access: portalAccess,
        custom_data: customData,
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

      if (onUpdate) {
        await onUpdate(updatedCoachee);
      }

       
      // Link IMMER generieren und kopieren
      const portalLink = `${window.location.origin}/portal/${oneTimeToken}`;
      
      // Versuche zu kopieren, aber zeige Link auch wenn es fehlschlägt
      try {
        await navigator.clipboard.writeText(portalLink);
      } catch (clipboardError) {
        console.warn('Clipboard failed, aber Link ist trotzdem verfügbar:', clipboardError);
      }
      
      return portalLink;
    } catch (error) {
      console.error('Portal link generation error:', error);
      alert('Fehler beim Erstellen des Portal-Links');
    }
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

  const age = calculateAge(localCoachee?.birthDate);
  const portalStatus = getPortalStatus();

  return (
    <>
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

            {/* Birthday Field */}
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
                  onChange={(e) => handleFieldChange('birthDate', e.target.value)}
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

            {/* DSGVO Status - REPARIERT: dsgvo → gdpr */}
            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">DSGVO-Einwilligung</span>
                <Badge 
                  variant={localCoachee?.consents?.gdpr ? "default" : "secondary"} 
                  className={localCoachee?.consents?.gdpr ? "bg-green-600" : "bg-red-600"}
                >
                  {localCoachee?.consents?.gdpr ? '✓ Erteilt' : '✗ Ausstehend'}
                </Badge>
              </div>
            </div>

            {/* Portal-Zugang Sektion */}
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
                  onClick={async () => {
                    try {
                      const portalLink = await generatePortalAccess();
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
            {(customFields.length > 0 || Object.keys(localCoachee?.customData || {}).length > 0) && (
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
                
                {Object.entries(localCoachee?.customData || {}).map(([fieldName, fieldValue]) => {
                  const isExistingField = customFields.some(field => field.id === fieldName);
                  if (isExistingField) return null;
                  
                  return (
                    <div key={fieldName} className="space-y-2">
                      <Label className="text-slate-300 capitalize">
                        {fieldName.replace(/_/g, ' ')}
                      </Label>
                      {isEditing ? (
                        <Input
                          value={fieldValue || ''}
                          onChange={(e) => handleCustomChange(fieldName, e.target.value)}
                          className="bg-slate-900 border-slate-600 text-white"
                        />
                      ) : (
                        <div className="px-3 py-2 text-white bg-slate-900/50 rounded-md">
                          {fieldValue || 'Nicht gesetzt'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inline Feld hinzufügen */}
            {isEditing && (
              <div className="pt-2 border-t border-slate-700">
                <Button
                  onClick={() => setShowAddFieldModal(true)}
                  variant="outline"
                  className="w-full border-dashed border-slate-600 text-slate-300 hover:text-white hover:border-slate-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Feld hinzufügen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Field Modal */}
      <Dialog open={showAddFieldModal} onOpenChange={setShowAddFieldModal}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Neues Feld hinzufügen</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Bezeichnung</Label>
              <Input
                value={newField.label}
                onChange={(e) => setNewField({...newField, label: e.target.value})}
                placeholder="z.B. Lieblingsfarbe, Hobbys, etc."
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Interner Name</Label>
              <Input
                value={newField.name}
                onChange={(e) => setNewField({...newField, name: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                placeholder="lieblings_farbe, hobbys, etc."
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Feldtyp</Label>
              <Select value={newField.type} onValueChange={(value) => setNewField({...newField, type: value})}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-600">
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Zahl</SelectItem>
                  <SelectItem value="date">Datum</SelectItem>
                  <SelectItem value="textarea">Textbereich</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleAddField}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Feld hinzufügen
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddFieldModal(false);
                  setNewField({ name: '', type: 'text', label: '' });
                }}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}