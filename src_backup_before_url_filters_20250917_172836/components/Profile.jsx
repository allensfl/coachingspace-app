import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Lock, Save, Briefcase, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAppStateContext } from '@/context/AppStateContext';

export default function Profile() {
  const { state, actions } = useAppStateContext();
  const { settings } = state;
  const { setSettings } = actions;
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState(settings.coachProfile || { name: 'Coach', email: 'coach@example.com' });
  const [companyData, setCompanyData] = useState(settings.company || {});
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.id]: e.target.value });
  };

  const handleCompanyChange = (e) => {
    setCompanyData({ ...companyData, [e.target.id]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };

  const handleProfileSave = () => {
    setSettings(prev => ({
      ...prev,
      coachProfile: profileData,
      company: companyData,
    }));
    toast({
      title: "Profil gespeichert!",
      description: "Deine Profil- und Unternehmensdaten wurden aktualisiert.",
      className: 'bg-green-600 text-white',
    });
  };

  const handlePasswordSave = () => {
    if (passwordData.new.length < 8) {
      toast({ title: 'Fehler', description: 'Das neue Passwort muss mindestens 8 Zeichen lang sein.', variant: 'destructive' });
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      toast({ title: 'Fehler', description: 'Die neuen Passwörter stimmen nicht überein.', variant: 'destructive' });
      return;
    }
    // In a real app, you would call an API here.
    toast({
      title: "Passwort geändert!",
      description: "Dein Passwort wurde erfolgreich aktualisiert.",
      className: 'bg-green-600 text-white',
    });
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <>
      <Helmet>
        <title>Mein Profil - Coachingspace</title>
        <meta name="description" content="Verwalte deine Profilinformationen und Sicherheitseinstellungen." />
      </Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mein Profil</h1>
          <p className="text-muted-foreground">Verwalte deine persönlichen Daten und Sicherheitseinstellungen.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    Persönliche Informationen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Dein Name</Label>
                    <Input id="name" value={profileData.name} onChange={handleProfileChange} placeholder="Max Mustermann" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail-Adresse</Label>
                    <Input id="email" type="email" value={profileData.email} onChange={handleProfileChange} placeholder="max.mustermann@email.com" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    Unternehmensdaten
                  </CardTitle>
                  <CardDescription>Diese Daten erscheinen auf Rechnungen.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Firmenname</Label>
                      <Input id="name" value={companyData.name || ''} onChange={handleCompanyChange} placeholder="Dein Unternehmen" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Steuernummer / USt-IdNr.</Label>
                      <Input id="taxId" value={companyData.taxId || ''} onChange={handleCompanyChange} placeholder="DE123456789" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex justify-end"
            >
              <Button onClick={handleProfileSave}>
                <Save className="mr-2 h-4 w-4" />
                Profil-Änderungen speichern
              </Button>
            </motion.div>
          </div>
          
          <div className="lg:col-span-1 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-primary" />
                    Passwort ändern
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Aktuelles Passwort</Label>
                    <Input id="current" type="password" value={passwordData.current} onChange={handlePasswordChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">Neues Passwort</Label>
                    <Input id="new" type="password" value={passwordData.new} onChange={handlePasswordChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Neues Passwort bestätigen</Label>
                    <Input id="confirm" type="password" value={passwordData.confirm} onChange={handlePasswordChange} />
                  </div>
                  <Button onClick={handlePasswordSave} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Neues Passwort speichern
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}