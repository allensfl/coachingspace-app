import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Search, User, Calendar, FileText, Eye, Trash2, Edit3, Plus } from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';

const SessionNotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Robustes Context-Loading mit Fallback
  const context = useAppStateContext();
  const coachees = context?.coachees || context?.state?.coachees || [];
  
  // Fallback: Coachees aus localStorage laden
  const [fallbackCoachees, setFallbackCoachees] = useState([]);
  
  useEffect(() => {
    if (coachees.length === 0) {
      try {
        const storedCoachees = JSON.parse(localStorage.getItem('coachees') || '[]');
        setFallbackCoachees(storedCoachees);
      } catch (error) {
        console.error('Error loading fallback coachees:', error);
      }
    }
  }, [coachees.length]);
  
  const allCoachees = coachees.length > 0 ? coachees : fallbackCoachees;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoachee, setSelectedCoachee] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    coacheeId: '',
    tags: []
  });

  console.log('SessionNotes Debug:');
  console.log('- Coachees loaded:', allCoachees.length);
  console.log('- selectedCoachee:', selectedCoachee);

  // Alle Notizen laden (ohne Duplikate)
  const loadAllNotes = () => {
    const notes = [];
    const seenContent = new Set(); // Duplikat-Vermeidung

    // 1. Live-Notizen aus localStorage laden (nur einmal pro Session)
    const processedSessions = new Set();
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('session-notes-') && !key.includes('metadata')) {
        try {
          const content = localStorage.getItem(key);
          if (content) {
            // Extrahiere Session-ID aus verschiedenen Key-Formaten
            let sessionId = null;
            
            if (key.includes('session-notes-session-')) {
              sessionId = key.split('-').pop();
            } else if (key.includes('session-notes-name-')) {
              sessionId = key.split('-').pop();
            } else {
              // Format: session-notes-{coacheeId}-{sessionId}
              const parts = key.split('-');
              if (parts.length >= 4) {
                sessionId = parts[3];
              }
            }

            // Skip wenn diese Session schon verarbeitet wurde
            if (processedSessions.has(sessionId)) {
              return;
            }
            processedSessions.add(sessionId);

            // Coachee-Info ermitteln - bevorzuge coacheeId aus Key
            let coacheeId = null;
            let coacheeName = 'Unbekannt';
            
            const keyParts = key.split('-');
            if (keyParts[2] !== 'session' && keyParts[2] !== 'name' && !isNaN(keyParts[2])) {
              coacheeId = parseInt(keyParts[2]);
              const coachee = allCoachees.find(c => c.id === coacheeId);
              if (coachee) {
                coacheeName = `${coachee.firstName} ${coachee.lastName}`;
              }
            }

            notes.push({
              id: `live-${sessionId}`,
              title: `Live-Notizen: Session ${sessionId}`,
              content: content,
              coacheeId: coacheeId,
              coacheeName: coacheeName,
              sessionId: sessionId,
              date: new Date().toISOString(),
              type: 'live',
              storageKey: key
            });
          }
        } catch (error) {
          console.error('Error parsing live note:', key, error);
        }
      }
    });

    // 2. Manuelle Notizen aus localStorage laden
    const manualNotes = JSON.parse(localStorage.getItem('session-notes') || '[]').map(note => ({
      ...note,
      type: 'manual',
      coacheeName: allCoachees.find(c => c.id === note.coacheeId)?.firstName + ' ' + allCoachees.find(c => c.id === note.coacheeId)?.lastName || 'Unbekannt'
    }));

    return [...notes, ...manualNotes];
  };

  const allNotes = useMemo(() => loadAllNotes(), [allCoachees]);

  // Gefilterte Notizen
  const filteredNotes = useMemo(() => {
    let filtered = allNotes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.coacheeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCoachee !== 'all') {
      filtered = filtered.filter(note => note.coacheeId === parseInt(selectedCoachee));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'coachee':
          return a.coacheeName.localeCompare(b.coacheeName);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filtered;
  }, [allNotes, searchTerm, selectedCoachee, sortBy]);

  // Statistiken
  const stats = useMemo(() => {
    const liveNotes = allNotes.filter(n => n.type === 'live');
    const manualNotes = allNotes.filter(n => n.type === 'manual');
    const uniqueCoachees = new Set(allNotes.filter(n => n.coacheeId).map(n => n.coacheeId)).size;

    return {
      total: allNotes.length,
      live: liveNotes.length,
      manual: manualNotes.length,
      coachees: uniqueCoachees
    };
  }, [allNotes]);

  // Notizen nach Coachees gruppieren
  const notesByCoachee = useMemo(() => {
    const grouped = {};
    filteredNotes.forEach(note => {
      const key = note.coacheeName || 'Unbekannt';
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(note);
    });
    return grouped;
  }, [filteredNotes]);

  const handleEditNote = (note) => {
    if (note.type === 'live') {
      setNewNote({
        title: `Bearbeitet: ${note.title}`,
        content: note.content,
        coacheeId: note.coacheeId || '',
        tags: []
      });
      setEditingNote(note);
      setShowNewNoteDialog(true);
    } else {
      setNewNote({ ...note });
      setEditingNote(note);
      setShowNewNoteDialog(true);
    }
  };

  const handleDeleteNote = (note) => {
    if (note.type === 'live') {
      // Alle localStorage-Keys für diese Session löschen
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('session-notes-') && key.includes(note.sessionId)) {
          localStorage.removeItem(key);
        }
      });
      toast({ title: "Live-Notiz gelöscht", description: "Die Session-Notiz wurde entfernt." });
    } else {
      const existingNotes = JSON.parse(localStorage.getItem('session-notes') || '[]');
      const updatedNotes = existingNotes.filter(n => n.id !== note.id);
      localStorage.setItem('session-notes', JSON.stringify(updatedNotes));
      toast({ title: "Notiz gelöscht", description: "Die manuelle Notiz wurde entfernt." });
    }
    window.location.reload();
  };

  const handleSaveNote = () => {
    const existingNotes = JSON.parse(localStorage.getItem('session-notes') || '[]');
    
    if (editingNote) {
      if (editingNote.type === 'live') {
        const newManualNote = {
          id: Date.now(),
          ...newNote,
          date: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };
        existingNotes.push(newManualNote);
        toast({ title: "Notiz gespeichert", description: "Live-Notiz wurde als manuelle Notiz gespeichert." });
      } else {
        const noteIndex = existingNotes.findIndex(n => n.id === editingNote.id);
        if (noteIndex !== -1) {
          existingNotes[noteIndex] = { ...newNote, lastModified: new Date().toISOString() };
          toast({ title: "Notiz aktualisiert", description: "Die Änderungen wurden gespeichert." });
        }
      }
    } else {
      const newManualNote = {
        id: Date.now(),
        ...newNote,
        date: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      existingNotes.push(newManualNote);
      toast({ title: "Notiz erstellt", description: "Die neue Notiz wurde gespeichert." });
    }
    
    localStorage.setItem('session-notes', JSON.stringify(existingNotes));
    setShowNewNoteDialog(false);
    setEditingNote(null);
    setNewNote({ title: '', content: '', coacheeId: '', tags: [] });
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Session-Notizen - Coachingspace</title>
        <meta name="description" content="Verwalte alle Notizen aus deinen Coaching-Sessions und manuellen Einträgen." />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Session-Notizen</h1>
            <p className="text-slate-400">Alle Notizen aus Coaching-Sessions und manuelle Einträge</p>
          </div>
          
          <Dialog open={showNewNoteDialog} onOpenChange={setShowNewNoteDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Neue Notiz
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-800 text-white">
              <DialogHeader>
                <DialogTitle>{editingNote ? 'Notiz bearbeiten' : 'Neue Sitzungsnotiz'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Titel der Notiz"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                />
                <Select 
                  value={newNote.coacheeId.toString()} 
                  onValueChange={(value) => setNewNote(prev => ({ ...prev, coacheeId: parseInt(value) }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Coachee auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCoachees.map(coachee => (
                      <SelectItem key={coachee.id} value={coachee.id.toString()}>
                        {coachee.firstName} {coachee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Notiz-Inhalt"
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-32 bg-slate-700 border-slate-600"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveNote} className="bg-green-600 hover:bg-green-700">
                    Speichern
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewNoteDialog(false)}>
                    Abbrechen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistiken */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-slate-400">Gesamt</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="h-8 w-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.live}</div>
              <div className="text-sm text-slate-400">Live-Notizen</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Edit3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.manual}</div>
              <div className="text-sm text-slate-400">Manuelle</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.coachees}</div>
              <div className="text-sm text-slate-400">Coachees</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter und Suche */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Notizen durchsuchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedCoachee} onValueChange={setSelectedCoachee}>
                  <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Alle Coachees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Coachees</SelectItem>
                    {allCoachees.map(coachee => (
                      <SelectItem key={coachee.id} value={coachee.id.toString()}>
                        {coachee.firstName} {coachee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Nach Datum</SelectItem>
                    <SelectItem value="coachee">Nach Coachee</SelectItem>
                    <SelectItem value="title">Nach Titel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notizen gruppiert nach Coachees */}
        <div className="space-y-6">
          {Object.entries(notesByCoachee).map(([coacheeName, notes]) => (
            <Card key={coacheeName} className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-blue-400" />
                  {coacheeName}
                  <Badge variant="outline" className="ml-auto">
                    {notes.length} Notizen
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="border border-slate-600 rounded-lg p-4 bg-slate-800/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">{note.title}</h3>
                          <Badge variant={note.type === 'live' ? 'default' : 'secondary'} className="text-xs">
                            {note.type === 'live' ? 'CoachingRoom Live-Notizen' : 'Manuelle Notiz'}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">
                          {note.content.length > 200 ? 
                            `${note.content.substring(0, 200)}...` : 
                            note.content
                          }
                        </p>
                        <div className="text-xs text-slate-400">
                          {new Date(note.date).toLocaleDateString('de-DE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditNote(note)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteNote(note)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Keine Notizen gefunden</h3>
              <p className="text-slate-400">
                {searchTerm || selectedCoachee !== 'all' 
                  ? 'Passe deine Filter an oder erstelle eine neue Notiz.'
                  : 'Beginne mit deiner ersten Coaching-Session oder erstelle eine manuelle Notiz.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default SessionNotes;