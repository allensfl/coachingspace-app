
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const UploadToolDialog = ({ open, onOpenChange, onSave, categories, initialData }) => {
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [toolName, setToolName] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  const [toolCategory, setToolCategory] = useState('');
  
  const isEditMode = !!initialData;
  const [existingFileUrl, setExistingFileUrl] = useState(null);

  useEffect(() => {
    if (initialData) {
      setToolName(initialData.name);
      setToolDescription(initialData.description);
      setToolCategory(initialData.category);
      setExistingFileUrl(initialData.fileUrl);
      setFile(null);
    } else {
      setToolName('');
      setToolDescription('');
      setToolCategory(categories.find(c => c === 'Checklisten') || categories[0] || 'Sonstige');
      setExistingFileUrl(null);
      setFile(null);
    }
  }, [initialData, categories, open]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      if (!toolName) {
        setToolName(acceptedFiles[0].name.split('.').slice(0, -1).join('.'));
      }
    }
  }, [toolName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

  const handleSave = () => {
    if ((!file && !isEditMode) || !toolName || !toolDescription) {
      toast({ title: "Fehler", description: "Bitte alle Felder ausfüllen und eine Datei auswählen.", variant: "destructive" });
      return;
    }
    
    let fileUrl = existingFileUrl;
    if (file) {
      if (existingFileUrl) {
        URL.revokeObjectURL(existingFileUrl);
      }
      fileUrl = URL.createObjectURL(file);
    }

    const newTool = {
      id: isEditMode ? initialData.id : Date.now(),
      name: toolName,
      category: toolCategory,
      description: toolDescription,
      icon: isEditMode ? initialData.icon : 'Upload',
      usage: 'Dateibasiertes Tool',
      status: isEditMode ? initialData.status : 'active',
      usageHistory: isEditMode ? initialData.usageHistory : [],
      type: 'file',
      fileUrl: fileUrl,
      fileName: file ? file.name : (isEditMode ? initialData.fileName : ''),
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
          <DialogTitle className="text-2xl text-white">{isEditMode ? 'Datei-Tool bearbeiten' : 'Datei-Tool hochladen'}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-primary'}`}>
            <input {...getInputProps()} />
            {file ? <p>Neue Datei: {file.name}</p> : (isEditMode && initialData.fileName ? <p>Aktuelle Datei: {initialData.fileName}. Ziehe eine neue Datei hierher, um sie zu ersetzen.</p> : <p>Datei hierher ziehen oder klicken.</p>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="upload-tool-name">Tool-Name</Label><Input id="upload-tool-name" value={toolName} onChange={e => setToolName(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="upload-tool-category">Kategorie</Label>
                <Select value={toolCategory} onValueChange={setToolCategory}>
                    <SelectTrigger><SelectValue placeholder="Kategorie wählen..." /></SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="space-y-2"><Label htmlFor="upload-tool-description">Beschreibung</Label><Textarea id="upload-tool-description" value={toolDescription} onChange={e => setToolDescription(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Abbrechen</Button></DialogClose>
          <Button onClick={handleSave}>{isEditMode ? 'Änderungen speichern' : 'Tool hochladen'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadToolDialog;
