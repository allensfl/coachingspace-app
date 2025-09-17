import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Info, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export default function ConsentsCard({ coachee, isEditing, onConsentChange, onGenerateConsentLink }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Einwilligungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gdpr-consent"
              checked={coachee.consents.gdpr}
              onCheckedChange={(checked) => onConsentChange('gdpr', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="gdpr-consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">DSGVO-Einwilligung</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="audio-recording-consent"
              checked={coachee.consents.audioRecording}
              onCheckedChange={(checked) => onConsentChange('audioRecording', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="audio-recording-consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Einwilligung zur Audioaufnahme</Label>
          </div>
          {!coachee.consents.gdpr && !isEditing && (
            <div className="pt-2">
              <p className="text-sm text-yellow-400 flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Wichtiger Hinweis: Ohne DSGVO-Einwilligung darf keine Coaching-Sitzung stattfinden.</span>
              </p>
              <Button onClick={onGenerateConsentLink} variant="outline" size="sm" className="mt-3 w-full">
                <LinkIcon className="mr-2 h-4 w-4" />
                Consent-Link für Coachee generieren
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}