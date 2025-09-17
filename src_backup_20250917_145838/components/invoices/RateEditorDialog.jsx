import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const RateEditorDialog = ({ open, onOpenChange, onSave, rate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (rate) {
      setName(rate.name);
      setDescription(rate.description);
      setPrice(String(rate.price));
    } else {
      setName('');
      setDescription('');
      setPrice('');
    }
  }, [rate, open]);

  const handleSubmit = () => {
    const newRate = {
      id: rate ? rate.id : Date.now(),
      name,
      description,
      price: parseFloat(price) || 0,
    };
    onSave(newRate);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle>{rate ? 'Honorarsatz bearbeiten' : 'Neuer Honorarsatz'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2"><Label htmlFor="rate-name">Name</Label><Input id="rate-name" value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Standard Coaching-Session"/></div>
          <div className="grid gap-2"><Label htmlFor="rate-desc">Beschreibung</Label><Textarea id="rate-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="z.B. 60 Minuten 1:1 Coaching" /></div>
          <div className="grid gap-2"><Label htmlFor="rate-price">Preis (€)</Label><Input id="rate-price" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="120.00" /></div>
        </div>
        <DialogFooter>
            <DialogClose asChild><Button variant="outline">Abbrechen</Button></DialogClose>
            <Button onClick={handleSubmit}><Save className="mr-2 h-4 w-4" />Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RateEditorDialog;