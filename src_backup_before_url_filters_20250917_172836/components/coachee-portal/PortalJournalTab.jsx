import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, FilePlus, Share2, UploadCloud, FileText, Trash2, Edit, Save, X, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const PortalJournalTab = ({ coachee, portalData, updatePortalData, onShareJournalEntry }) => {
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const { toast } = useToast();

  const handleSaveJournalEntry = () => {
    if (newEntryContent.trim() === '' || newEntryTitle.trim() === '') {
      toast({ variant: "destructive", title: "Fehler", description: "Bitte gib einen Titel und Inhalt ein." });
      return;
    }
    const entry = {
      id: editingEntry ? editingEntry.id : `portal_${Date.now()}`,
      title: newEntryTitle,
      date: new Date().toISOString(),
      content: newEntryContent,
      shared: editingEntry ? editingEntry.shared : false,
      isShared: editingEntry ? editingEntry.isShared : false, // This is for coach's view
      coacheeId: coachee.id
    };
    
    let updatedEntries;
    if (editingEntry) {
      updatedEntries = portalData.journalEntries.map(e => e.id === editingEntry.id ? entry : e);
      toast({ title: "Journaleintrag aktualisiert" });
    } else {
      updatedEntries = [entry, ...(portalData.journalEntries || [])];
      toast({ title: "Journaleintrag hinzugefügt" });
    }
    
    updatePortalData({ journalEntries: updatedEntries });
    setNewEntryTitle('');
    setNewEntryContent('');
    setEditingEntry(null);
  };
  
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setNewEntryTitle(entry.title);
    setNewEntryContent(entry.content);
  }

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setNewEntryTitle('');
    setNewEntryContent('');
  }

  const handleDelete = (entryId) => {
    updatePortalData({ journalEntries: portalData.journalEntries.filter(e => e.id !== entryId) });
    toast({ title: "Eintrag gelöscht" });
  }

  const handleShare = (entry) => {
    onShareJournalEntry(prevEntries => {
      // Find if entry is already shared
      const existing = (prevEntries || []).find(e => e.id === entry.id);
      if (existing) {
        // Just update shared status if it exists
        return (prevEntries || []).map(e => e.id === entry.id ? { ...e, isShared: true } : e);
      } else {
        // Add new entry
        return [{...entry, isShared: true}, ...(prevEntries || [])];
      }
    });

    updatePortalData({
      journalEntries: portalData.journalEntries.map(e => e.id === entry.id ? { ...e, shared: true } : e)
    });
    toast({ title: "Eintrag geteilt!", description: "Dein Coach kann diesen Eintrag jetzt sehen." });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(), name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`, uploadDate: new Date().toISOString(), shared: false,
    }));
    updatePortalData({ documents: [...newFiles, ...portalData.documents] });
    toast({ title: "Upload erfolgreich", description: `${newFiles.length} Datei(en) hochgeladen.` });
  }, [updatePortalData, portalData.documents, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-slate-900/50 border border-slate-800 flex flex-col">
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen /> Dein privates Journal</CardTitle></CardHeader>
        <CardContent className="space-y-4 flex-grow">
          <Input value={newEntryTitle} onChange={(e) => setNewEntryTitle(e.target.value)} placeholder="Titel des Eintrags" className="bg-slate-800/50 border-slate-700"/>
          <Textarea value={newEntryContent} onChange={(e) => setNewEntryContent(e.target.value)} placeholder="Was beschäftigt dich heute?" className="min-h-[120px] bg-slate-800/50 border-slate-700"/>
          <div className="flex gap-2">
            <Button onClick={handleSaveJournalEntry} className="w-full sm:w-auto"><Save className="mr-2 h-4 w-4" /> {editingEntry ? 'Änderung speichern' : 'Eintrag speichern'}</Button>
            {editingEntry && <Button onClick={handleCancelEdit} variant="outline"><X className="mr-2 h-4 w-4" /> Abbrechen</Button>}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start space-y-4 pt-4 max-h-[50vh] overflow-y-auto pr-2">
            {(portalData.journalEntries || []).map(entry => (
              <div key={entry.id} className="p-4 bg-slate-800/50 rounded-lg w-full">
                <p className="font-bold text-white">{entry.title}</p>
                <p className="text-sm text-slate-400 mb-2">{format(new Date(entry.date), 'dd.MM.yyyy HH:mm', { locale: de })}</p>
                <p className="text-slate-300 whitespace-pre-wrap">{entry.content}</p>
                <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
                  {entry.shared ? <Badge variant="outline" className="text-green-400 border-green-500/50"><Eye className="mr-2 h-3 w-3" /> Für Coach sichtbar</Badge> : <Button size="sm" variant="ghost" onClick={() => handleShare(entry)}><Share2 className="mr-2 h-4 w-4"/> Freigeben</Button>}
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(entry)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-red-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Sicher?</AlertDialogTitle><AlertDialogDescription>Möchtest du diesen Eintrag wirklich löschen?</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(entry.id)} className="bg-red-600">Löschen</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
        </CardFooter>
      </Card>
      <Card className="bg-slate-900/50 border border-slate-800">
        <CardHeader><CardTitle className="flex items-center gap-2"><UploadCloud /> Dokumente hochladen & teilen</CardTitle></CardHeader>
        <CardContent>
          <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-slate-600'}`}>
            <input {...getInputProps()} />
            <p>Dateien hierher ziehen oder klicken.</p>
          </div>
          <div className="space-y-3 mt-4 max-h-96 overflow-y-auto pr-2">
            {portalData.documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-slate-400" /><div><p className="text-slate-300">{doc.name}</p><p className="text-xs text-slate-500">{doc.size}</p></div></div>
                <div className="flex items-center gap-2">
                  {doc.shared ? <Badge variant="outline" className="text-green-400 border-green-500/50">Sichtbar</Badge> : <Button size="sm" variant="ghost" onClick={() => handleShare('documents', doc.id)}><Share2 className="mr-2 h-4 w-4"/> Freigeben</Button>}
                  <Button size="icon" variant="ghost" className="text-slate-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalJournalTab;