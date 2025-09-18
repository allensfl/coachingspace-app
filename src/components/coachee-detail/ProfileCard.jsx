import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, User, Mail, Phone, Calendar, Target } from "lucide-react";

const ProfileCard = ({ coachee, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCoachee, setEditedCoachee] = useState(coachee || {});

  useEffect(() => {
    console.log('ProfileCard - Coachee empfangen:', coachee);
    console.log('ProfileCard - DSGVO consents:', coachee?.consents);
    console.log('ProfileCard - Documents:', coachee?.documents?.length || 0);
    setEditedCoachee(coachee || {});
  }, [coachee]);

  const handleSave = () => {
    console.log('ProfileCard - Speichere:', editedCoachee);
    onUpdate(editedCoachee);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCoachee(coachee);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    console.log(`ProfileCard - Feld geändert: ${field} = ${JSON.stringify(value)}`);
    setEditedCoachee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // DSGVO-Consent-Handler - arbeitet mit echten coachee.consents
  const handleConsentChange = (consentType, value) => {
    console.log(`ProfileCard - DSGVO-Änderung: ${consentType} = ${value}`);
    const updatedConsents = {
      ...editedCoachee.consents,
      [consentType]: value
    };
    handleInputChange('consents', updatedConsents);
  };

  // Alter berechnen
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    try {
      const birth = new Date(birthDate);
      if (isNaN(birth.getTime())) return null;
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      console.error('Fehler bei Altersberechnung:', error);
      return null;
    }
  };

  // Datum formatieren für Anzeige
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('de-DE');
    } catch (error) {
      console.error('Fehler bei Datumsformatierung:', error);
      return '';
    }
  };

  const age = calculateAge(editedCoachee?.birthDate);

  return (
    <Card className="w-full bg-slate-800 border-slate-700 shadow-xl">
      <CardHeader className="pb-4 border-b border-slate-700">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-200 mb-2">
              Coachee-Profil
            </CardTitle>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {editedCoachee?.status || 'Aktiv'}
            </Badge>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-1 h-4 w-4" />
                  Speichern
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <X className="mr-1 h-4 w-4" />
                  Abbrechen
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Edit className="mr-1 h-4 w-4" />
                Bearbeiten
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Name Sektion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-400">
              <User className="mr-2 h-4 w-4" />
              Vorname
            </label>
            {isEditing ? (
              <Input
                value={editedCoachee?.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="border-slate-600 bg-slate-700 text-slate-200 focus:border-blue-500"
              />
            ) : (
              <p className="text-lg font-semibold text-slate-200 p-2 bg-slate-700 rounded-md">
                {editedCoachee?.firstName || ''}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-400">
              <User className="mr-2 h-4 w-4" />
              Nachname
            </label>
            {isEditing ? (
              <Input
                value={editedCoachee?.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="border-slate-600 bg-slate-700 text-slate-200 focus:border-blue-500"
              />
            ) : (
              <p className="text-lg font-semibold text-slate-200 p-2 bg-slate-700 rounded-md">
                {editedCoachee?.lastName || ''}
              </p>
            )}
          </div>
        </div>

        {/* Kontakt Sektion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-400">
              <Mail className="mr-2 h-4 w-4" />
              E-Mail
            </label>
            {isEditing ? (
              <Input
                type="email"
                value={editedCoachee?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-slate-600 bg-slate-700 text-slate-200 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-200 p-2 bg-slate-700 rounded-md">
                {editedCoachee?.email || ''}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-400">
              <Phone className="mr-2 h-4 w-4" />
              Telefon
            </label>
            {isEditing ? (
              <Input
                value={editedCoachee?.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="border-slate-600 bg-slate-700 text-slate-200 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-200 p-2 bg-slate-700 rounded-md">
                {editedCoachee?.phone || ''}
              </p>
            )}
          </div>
        </div>

        {/* Geburtsdatum Sektion */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-400">
            <Calendar className="mr-2 h-4 w-4" />
            Geburtsdatum
          </label>
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={editedCoachee?.birthDate || ''}
                onChange={(e) => {
                  console.log('Datepicker-Änderung:', e.target.value);
                  handleInputChange('birthDate', e.target.value);
                }}
                className="border-slate-600 bg-slate-700 text-slate-200 focus:border-blue-500 max-w-xs"
              />
              <span className="text-sm text-slate-400">
                {editedCoachee?.birthDate && `(${calculateAge(editedCoachee.birthDate)} Jahre)`}
              </span>
            </div>
          ) : (
            <p className="text-slate-200 p-2 bg-slate-700 rounded-md">
              {editedCoachee?.birthDate ? (
                <>
                  {formatDate(editedCoachee.birthDate)}
                  {age && <span className="text-slate-400 ml-2">({age} Jahre)</span>}
                </>
              ) : (
                <span className="text-slate-500 italic">Nicht angegeben</span>
              )}
            </p>
          )}
        </div>

        {/* Hauptthema Sektion */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-400">
            <Target className="mr-2 h-4 w-4" />
            Hauptthema
          </label>
          {isEditing ? (
            <Input
              value={editedCoachee?.mainTopic || ''}
              onChange={(e) => handleInputChange('mainTopic', e.target.value)}
              className="border-slate-600 bg-slate-700 text-slate-200 focus:border-blue-500"
              placeholder="z.B. Karriereentwicklung, Work-Life-Balance..."
            />
          ) : (
            <p className="text-slate-200 p-2 bg-slate-700 rounded-md">
              {editedCoachee?.mainTopic || (
                <span className="text-slate-500 italic">Nicht angegeben</span>
              )}
            </p>
          )}
        </div>

        {/* DSGVO Einverständniserklärungen - REPARIERT */}
        <div className="space-y-4 pt-4 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">DSGVO Einverständniserklärungen</h3>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={editedCoachee?.consents?.gdpr || false}
                onChange={(e) => handleConsentChange('gdpr', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                disabled={!isEditing}
              />
              <span className="text-sm text-slate-300">
                Ich stimme der Verarbeitung meiner personenbezogenen Daten für Coaching-Zwecke zu.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={editedCoachee?.consents?.audioRecording || false}
                onChange={(e) => handleConsentChange('audioRecording', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                disabled={!isEditing}
              />
              <span className="text-sm text-slate-300">
                Ich stimme der Aufzeichnung von Audio-Sessions zu.
              </span>
            </label>
          </div>
          
          {/* DSGVO-Zustimmung-Status anzeigen */}
          <div className="mt-4 p-3 bg-slate-900 rounded-md border border-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">DSGVO-Status:</span>
              <Badge className={editedCoachee?.consents?.gdpr ? "bg-green-600" : "bg-red-600"}>
                {editedCoachee?.consents?.gdpr ? "Zugestimmt" : "Ausstehend"}
              </Badge>
            </div>
            {editedCoachee?.consents?.gdpr && (
              <p className="text-xs text-slate-500 mt-2">
                Einverständnis erteilt • Dokument archiviert
              </p>
            )}
          </div>
        </div>

        {/* Coaching-Status */}
        <div className="pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-400">{editedCoachee?.sessions?.length || 0}</p>
              <p className="text-xs text-slate-400">Sessions</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-400">{editedCoachee?.completedGoals?.length || 0}</p>
              <p className="text-xs text-slate-400">Ziele erreicht</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-orange-400">{editedCoachee?.goals?.length || 0}</p>
              <p className="text-xs text-slate-400">Aktive Ziele</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-400">{editedCoachee?.documents?.length || 0}</p>
              <p className="text-xs text-slate-400">Dokumente</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;