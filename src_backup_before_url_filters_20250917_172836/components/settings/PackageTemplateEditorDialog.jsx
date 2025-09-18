import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const PackageTemplateEditorDialog = ({ open, onOpenChange, onSave, template }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setTotalUnits(String(template.totalUnits));
      setPrice(String(template.price));
    } else {
      setName('');
      setDescription('');
      setTotalUnits('');
      setPrice('');
    }
  }, [template, open]);

  const handleSubmit = () => {
    const newTemplate = {
      id: template ? template.id : Date.now(),
      name,
      description,
      totalUnits: parseInt(totalUnits) || 0,
      price: parseFloat(price) || 0,
    };
    onSave(newTemplate);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle>{template ? 'Paket-Vorlage bearbeiten' : 'Neue Paket-Vorlage'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2"><Label htmlFor="template-name">Name des Pakets</Label><Input id="template-name" value={name} onChange={e => setName(e.target.value)} placeholder="z.B. 5er-Paket Karriere-Boost"/></div>
          <div className="grid gap-2"><Label htmlFor="template-desc">Beschreibung</Label><Textarea id="template-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="z.B. Fünf intensive 60-Minuten-Sessions..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2"><Label htmlFor="template-units">Anzahl Sessions/Einheiten</Label><Input id="template-units" type="number" value={totalUnits} onChange={e => setTotalUnits(e.target.value)} placeholder="5" /></div>
            <div className="grid gap-2"><Label htmlFor="template-price">Preis (€)</Label><Input id="template-price" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="550.00" /></div>
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild><Button variant="outline">Abbrechen</Button></DialogClose>
            <Button onClick={handleSubmit}><Save className="mr-2 h-4 w-4" />Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PackageTemplateEditorDialog;