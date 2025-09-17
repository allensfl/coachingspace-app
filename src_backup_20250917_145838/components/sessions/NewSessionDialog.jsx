
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { SessionMode, SessionStatus } from '@/types';

const NewSessionDialog = ({ open, onOpenChange, onSubmit, coachees, activePackages }) => {
  const [selectedCoacheeId, setSelectedCoacheeId] = useState('');
  const coacheePackages = (activePackages || []).filter(p => p.coacheeId === parseInt(selectedCoacheeId) && p.usedUnits < p.totalUnits);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const coachee = coachees.find(c => c.id === parseInt(data.coacheeId));
    
    const combinedDateTime = new Date(`${data.date}T${data.time}`);

    const newSession = {
      id: Date.now(),
      coacheeId: parseInt(data.coacheeId),
      coacheeName: `${coachee.firstName} ${coachee.lastName}`,
      date: combinedDateTime.toISOString(),
      duration: parseInt(data.duration),
      mode: data.mode,
      status: SessionStatus.PLANNED,
      topic: data.topic,
      coachNotes: data.notes,
      packageId: data.packageId && data.packageId !== 'none' ? parseInt(data.packageId) : null,
      billed: !!(data.packageId && data.packageId !== 'none'),
    };
    
    onSubmit(newSession);
    setSelectedCoacheeId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />Neue Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-card">
        <DialogHeader><DialogTitle>Neue Session planen</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="coacheeId">Coachee</Label>
              <Select name="coacheeId" required onValueChange={setSelectedCoacheeId}>
                <SelectTrigger><SelectValue placeholder="Coachee auswählen" /></SelectTrigger>
                <SelectContent>{(coachees || []).map((coachee) => (<SelectItem key={coachee.id} value={String(coachee.id)}>{coachee.firstName} {coachee.lastName}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            {selectedCoacheeId && coacheePackages.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="packageId">Paket zuordnen (optional)</Label>
                <Select name="packageId" defaultValue="none">
                  <SelectTrigger><SelectValue placeholder="Paket auswählen..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Kein Paket</SelectItem>
                    {coacheePackages.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.packageName} ({p.usedUnits}/{p.totalUnits} verbraucht)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label htmlFor="date">Datum</Label><Input id="date" name="date" type="date" required/></div>
              <div className="grid gap-2"><Label htmlFor="time">Uhrzeit</Label><Input id="time" name="time" type="time" required/></div>
            </div>
            <div className="grid gap-2"><Label htmlFor="duration">Dauer (Minuten)</Label><Input id="duration" name="duration" type="number" placeholder="60" defaultValue="60" required/></div>
            <div className="grid gap-2"><Label htmlFor="mode">Modus</Label><Select name="mode" defaultValue={SessionMode.REMOTE} required><SelectTrigger><SelectValue placeholder="Session-Modus auswählen" /></SelectTrigger><SelectContent><SelectItem value={SessionMode.IN_PERSON}>Vor Ort</SelectItem><SelectItem value={SessionMode.REMOTE}>Remote</SelectItem><SelectItem value={SessionMode.PHONE}>Telefon</SelectItem><SelectItem value={SessionMode.HYBRID}>Hybrid</SelectItem></SelectContent></Select></div>
            <div className="grid gap-2"><Label htmlFor="topic">Thema</Label><Input id="topic" name="topic" placeholder="Session-Thema" required/></div>
            <div className="grid gap-2"><Label htmlFor="notes">Notizen (optional)</Label><Textarea name="notes" id="notes" placeholder="Vorbereitungsnotizen..." /></div>
          </div>
          <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Abbrechen</Button></DialogClose><Button type="submit" className="bg-blue-600 hover:bg-blue-700">Session erstellen</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSessionDialog;
