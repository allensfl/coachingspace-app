
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const CreateToolDialog = ({ open, onOpenChange, onSave, categories, initialData }) => {
  const { toast } = useToast();
  const [toolName, setToolName] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  const [toolCategory, setToolCategory] = useState('');
  const [toolContent, setToolContent] = useState('');

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setToolName(initialData.name);
      setToolDescription(initialData.description);
      setToolCategory(initialData.category);
      setToolContent(initialData.content || '');
    } else {
      setToolName('');
      setToolDescription('');
      setToolCategory(categories[0] || 'Sonstige');
      setToolContent('');
    }
  }, [initialData, categories, open]);

  const handleSave = () => {
    if (!toolName || !toolDescription) {
      toast({ title: "Fehler", description: "Bitte Name und Beschreibung ausfüllen.", variant: "destructive" });
      return;
    }
    const newTool = {
      id: isEditMode ? initialData.id : Date.now(),
      name: toolName,
      category: toolCategory,
      description: toolDescription,
      icon: isEditMode ? initialData.icon : 'FileText',
      usage: 'Benutzerdefiniertes Tool',
      status: isEditMode ? initialData.status : 'active',
      usageHistory: isEditMode ? initialData.usageHistory : [],
      content: toolContent,
      type: 'text',
      isCustom: true,
      isFavorite: isEditMode ? initialData.isFavorite : false,
    };
    onSave(newTool);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">{isEditMode ? 'Text-Tool bearbeiten' : 'Neues Text-Tool erstellen'}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="tool-name">Tool-Name</Label><Input id="tool-name" value={toolName} onChange={e => setToolName(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="tool-category">Kategorie</Label>
                <Select value={toolCategory} onValueChange={setToolCategory}>
                    <SelectTrigger><SelectValue placeholder="Kategorie wählen..." /></SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="space-y-2"><Label htmlFor="tool-description">Beschreibung</Label><Textarea id="tool-description" value={toolDescription} onChange={e => setToolDescription(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="tool-content">Inhalt (Markdown unterstützt)</Label><Textarea id="tool-content" value={toolContent} onChange={e => setToolContent(e.target.value)} className="min-h-[200px] font-mono" /></div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Abbrechen</Button></DialogClose>
          <Button onClick={handleSave}>{isEditMode ? 'Änderungen speichern' : 'Tool speichern'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateToolDialog;
