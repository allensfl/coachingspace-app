import React from 'react';
import { motion } from 'framer-motion';
import { User, WrapText as NotepadText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

export default function ProfileCard({ coachee, isEditing, onChange, onCustomFieldChange }) {
  const { state } = useAppStateContext();
  const { settings } = state;
  const customFields = settings.coacheeFields || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="md:col-span-1">
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
              <Input id="firstName" value={coachee.firstName} onChange={onChange} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname</Label>
              <Input id="lastName" value={coachee.lastName} onChange={onChange} disabled={!isEditing} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" type="email" value={coachee.email} onChange={onChange} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" value={coachee.phone} onChange={onChange} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainTopic">Hauptthema</Label>
            <Textarea id="mainTopic" value={coachee.mainTopic} onChange={onChange} disabled={!isEditing} rows={2} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confidentialNotes" className="flex items-center gap-1"><NotepadText className="h-4 w-4"/> Vertrauliche Notizen (nur für dich)</Label>
            <Textarea id="confidentialNotes" value={coachee.confidentialNotes} onChange={onChange} disabled={!isEditing} rows={4} placeholder="Diese Notizen sind privat und nur für dich sichtbar."/>
          </div>
          
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