import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const JournalEntryDialog = ({ open, onOpenChange, onSave, coachees, categories, initialEntry }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [coacheeId, setCoacheeId] = useState('unassigned');

  useEffect(() => {
    if (open) {
      if (initialEntry) {
        setTitle(initialEntry.title);
        setDate(initialEntry.date);
        setCategoryId(initialEntry.categoryId || '');
        setContent(initialEntry.content);
        setCoacheeId(initialEntry.coacheeId ? String(initialEntry.coacheeId) : 'unassigned');
      } else {
        setTitle('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategoryId('');
        setContent('');
        setCoacheeId('unassigned');
      }
    }
  }, [initialEntry, open]);

  const handleSubmit = () => {
    const entryData = {
      id: initialEntry?.id || `coach_${Date.now()}`,
      title,
      date,
      categoryId,
      content,
      coacheeId: coacheeId === 'unassigned' ? null : parseInt(coacheeId),
      isShared: false,
    };
    onSave(entryData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] glass-card">
        <DialogHeader>
          <DialogTitle>{initialEntry ? 'Journal-Eintrag bearbeiten' : 'Neuer Journal-Eintrag'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2"><Label htmlFor="title">Titel</Label><Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel des Eintrags" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2"><Label htmlFor="date">Datum</Label><Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
            <div className="grid gap-2"><Label htmlFor="category">Kategorie</Label><Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Kategorie wählen" /></SelectTrigger>
                <SelectContent>
                    {(categories || []).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select></div>
          </div>
          <div className="grid gap-2"><Label htmlFor="coachee">Coachee (optional)</Label><Select value={coacheeId} onValueChange={setCoacheeId}>
            <SelectTrigger><SelectValue placeholder="Coachee zuordnen" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="unassigned">Kein Coachee</SelectItem>
                {(coachees || []).map(c => <SelectItem key={c.id} value={String(c.id)}>{c.firstName} {c.lastName}</SelectItem>)}
            </SelectContent>
          </Select></div>
          <div className="grid gap-2"><Label htmlFor="content">Inhalt</Label><Textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Schreibe deine Gedanken..." className="min-h-[150px]" /></div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Abbrechen</Button></DialogClose>
          <Button onClick={handleSubmit}>{initialEntry ? 'Änderungen speichern' : 'Eintrag speichern'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JournalEntryDialog;