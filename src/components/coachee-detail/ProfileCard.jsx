import React from 'react';
import { motion } from 'framer-motion';
import { User, WrapText as NotepadText, Calendar, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAppStateContext } from '@/context/AppStateContext';

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

// Hilfsfunktion für Geburtstags-Berechnung
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

// Hilfsfunktion für nächsten Geburtstag
const getNextBirthday = (birthDate) => {
  if (!birthDate) return null;
  
  const today = new Date();
  const birth = new Date(birthDate);
  const currentYear = today.getFullYear();
  
  // Geburtstag in diesem Jahr
  let nextBirthday = new Date(currentYear, birth.getMonth(), birth.getDate());
  
  // Falls Geburtstag in diesem Jahr schon vorbei, nächstes Jahr nehmen
  if (nextBirthday < today) {
    nextBirthday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
  }
  
  // Tage bis zum Geburtstag
  const diffTime = nextBirthday - today;
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    date: nextBirthday,
    daysUntil: daysUntil,
    isToday: daysUntil === 0,
    isTomorrow: daysUntil === 1,
    isThisWeek: daysUntil <= 7
  };
};

export default function ProfileCard({ coachee, isEditing, onChange, onCustomFieldChange }) {
  const { state } = useAppStateContext();
  const { settings } = state;
  const customFields = settings.coacheeFields || [];

  const age = calculateAge(coachee.birthDate);
  const nextBirthday = getNextBirthday(coachee.birthDate);

  const getBirthdayBadge = () => {
    if (!nextBirthday) return null;
    
    if (nextBirthday.isToday) {
      return <Badge className="bg-green-500 text-white">🎉 Heute Geburtstag!</Badge>;
    }
    if (nextBirthday.isTomorrow) {
      return <Badge className="bg-blue-500 text-white">🎂 Morgen Geburtstag</Badge>;
    }
    if (nextBirthday.isThisWeek) {
      return <Badge variant="outline">🎈 In {nextBirthday.daysUntil} Tagen</Badge>;
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }} 
      className="md:col-span-1"
    >
      <Card className="glass-card h-full">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="mr-2 h-5 w-5" />
            Profilinformationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname</Label>
              <Input 
                id="firstName" 
                value={coachee.firstName} 
                onChange={(e) => onChange(e)}
                disabled={!isEditing} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname</Label>
              <Input 
                id="lastName" 
                value={coachee.lastName} 
                onChange={onChange} 
                disabled={!isEditing} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input 
              id="email" 
              type="email" 
              value={coachee.email} 
              onChange={onChange} 
              disabled={!isEditing} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input 
              id="phone" 
              value={coachee.phone} 
              onChange={onChange} 
              disabled={!isEditing} 
            />
          </div>

          {/* Neues Geburtsdatum-Feld */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Geburtsdatum
            </Label>
            <Input 
              id="birthDate" 
              type="date" 
              value={coachee.birthDate || ''} 
              onChange={onChange} 
              disabled={!isEditing} 
            />
            {/* Geburtstags-Info anzeigen wenn Datum vorhanden */}
            {coachee.birthDate && (
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                <span>
                  {age !== null && `${age} Jahre`}
                  {age !== null && nextBirthday && ' • '}
                  {nextBirthday && !nextBirthday.isToday && `Nächster Geburtstag in ${nextBirthday.daysUntil} Tagen`}
                </span>
                {getBirthdayBadge()}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainTopic">Hauptthema</Label>
            <Textarea 
              id="mainTopic" 
              value={coachee.mainTopic} 
              onChange={onChange} 
              disabled={!isEditing} 
              rows={2} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confidentialNotes" className="flex items-center gap-1">
              <NotepadText className="h-4 w-4"/> 
              Vertrauliche Notizen (nur für dich)
            </Label>
            <Textarea 
              id="confidentialNotes" 
              value={coachee.confidentialNotes} 
              onChange={onChange} 
              disabled={!isEditing} 
              rows={4} 
              placeholder="Diese Notizen sind privat und nur für dich sichtbar."
            />
          </div>

          {/* Custom Fields Section */}
          {customFields.length > 0 && (
            <div className="pt-4 border-t border-slate-700 space-y-4">
              <h3 className="text-lg font-semibold text-white">Zusätzliche Informationen</h3>
              {customFields.map(field => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <CustomFieldInput
                    field={field}
                    value={coachee.customData?.[field.id]}
                    onChange={onCustomFieldChange}
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