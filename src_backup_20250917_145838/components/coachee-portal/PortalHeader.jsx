import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { saveAs } from 'file-saver';
import { Settings, KeyRound, Eye, EyeOff, Download, ShieldCheck } from 'lucide-react';

const PortalHeader = ({ coachee, updateCoacheeData, portalData }) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      toast({ title: "Fehler", description: "Die Passwörter stimmen nicht überein.", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Fehler", description: "Das Passwort muss mindestens 8 Zeichen lang sein.", variant: "destructive" });
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    updateCoacheeData({ portalAccess: { ...coachee.portalAccess, passwordHash } });
    
    setShowPasswordDialog(false);
    setPassword('');
    setConfirmPassword('');
    toast({ title: "Passwort gesetzt!", description: "Dein Portal ist jetzt mit einem Passwort geschützt.", className: 'bg-green-600 text-white' });
  };

  const handleDownloadData = () => {
    try {
      const dataToSave = JSON.stringify(portalData, null, 2);
      const blob = new Blob([dataToSave], {type: "application/json;charset=utf-8"});
      saveAs(blob, `coachingspace_portal_backup_${coachee.firstName}_${new Date().toISOString().split('T')[0]}.json`);
      toast({title: "Daten heruntergeladen"});
    } catch (error) {
      toast({title: "Fehler beim Download", variant: "destructive"});
    }
  };

  return (
    <header className="mb-8 text-center relative">
      <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-3xl">{coachee.firstName[0]}{coachee.lastName[0]}</span>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-white">Willkommen, {coachee.firstName}!</h1>
      <p className="text-slate-400 mt-2">Dein persönlicher und geschützter Raum für Reflexion und Wachstum.</p>
      
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-0 right-0 text-slate-400 hover:text-white">
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Portal-Einstellungen</DialogTitle>
            <DialogDescription>Hier kannst du dein Portal absichern und deine Daten verwalten.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <h3 className="font-semibold flex items-center gap-2"><KeyRound/> Passwortschutz</h3>
            {coachee.portalAccess?.passwordHash ? (
              <div className="flex items-center gap-2 text-green-400"><ShieldCheck/><span>Dein Portal ist geschützt.</span></div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Sichere dein Portal mit einem Passwort.</p>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Neues Passwort" value={password} onChange={e => setPassword(e.target.value)} />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff/> : <Eye/>}</Button>
                </div>
                <Input type={showPassword ? "text" : "password"} placeholder="Passwort bestätigen" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            )}
            <h3 className="font-semibold flex items-center gap-2 pt-4"><Download/> Daten-Backup</h3>
            <Button variant="outline" className="w-full" onClick={handleDownloadData}>Alle Portal-Daten herunterladen</Button>
          </div>
          <DialogFooter>{!coachee.portalAccess?.passwordHash && (<Button onClick={handleSetPassword}>Passwort speichern</Button>)}</DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default PortalHeader;