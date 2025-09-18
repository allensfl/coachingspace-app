import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, File, X } from 'lucide-react';

const UploadDocumentDialog = ({ isOpen, onClose, onUpload, coachees, categories }) => {
  const [file, setFile] = useState(null);
  const [coacheeId, setCoacheeId] = useState('unassigned'); // Changed default to "unassigned"
  const [docType, setDocType] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const handleKeywordKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
        setKeywords([...keywords, currentKeyword.trim()]);
      }
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    if (!file || !docType) {
      setError('Bitte wähle eine Datei und eine Kategorie aus.');
      return;
    }
    const documentData = {
      name: file.name,
      type: docType,
      size: formatBytes(file.size),
      format: file.type.split('/')[1].toUpperCase(),
      keywords: keywords,
    };
    
    const finalCoacheeId = coacheeId === 'unassigned' ? 'general' : coacheeId; // Handle "unassigned" value
    onUpload(finalCoacheeId, documentData);
    resetForm();
  };

  const resetForm = () => {
    setFile(null);
    setCoacheeId('unassigned'); // Reset to "unassigned"
    setDocType('');
    setKeywords([]);
    setCurrentKeyword('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px] glass-card">
        <DialogHeader>
          <DialogTitle>Dokument hochladen</DialogTitle>
          <DialogDescription>
            Füge ein neues Dokument hinzu. Wähle optional einen Coachee, um es zuzuordnen.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div
            {...getRootProps()}
            className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-primary'}`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex items-center justify-center text-left text-sm">
                <File className="h-10 w-10 mr-4 text-primary" />
                <div>
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-slate-400">{formatBytes(file.size)}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <UploadCloud className="h-10 w-10 text-slate-400" />
                <p className="font-semibold">Datei hierher ziehen oder klicken</p>
                <p className="text-xs text-slate-500">PDF, DOCX, PNG, JPG etc.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="coachee">Coachee (optional)</Label>
              <Select value={coacheeId} onValueChange={setCoacheeId}>
                <SelectTrigger id="coachee">
                  <SelectValue placeholder="Allgemeines Dokument" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="unassigned">Allgemeines Dokument</SelectItem>
                  {coachees.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.firstName} {c.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="doc-type">Kategorie</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger id="doc-type">
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="keywords">Keywords</Label>
            <div className="flex items-center flex-wrap gap-2 p-2 border border-slate-700 rounded-md">
              {keywords.map(keyword => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="ml-2 rounded-full hover:bg-slate-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                id="keywords"
                placeholder="Keywords hinzufügen..."
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Abbrechen</Button>
          <Button onClick={handleUpload}>Hochladen & Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;