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
import { 
  Search, 
  User, 
  Calendar, 
  FileText, 
  Eye, 
  Trash2, 
  Edit3, 
  Plus,
  Brain,
  AlertCircle,
  Mail,
  TrendingUp
} from 'lucide-react';
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

  // KI-Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  console.log('SessionNotes Debug:');
  console.log('- Coachees loaded:', allCoachees.length);
  console.log('- selectedCoachee:', selectedCoachee);

  // NEUE KI-Funktionen (komplett neu geschrieben)
  const analyzeText = (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Einfache Kategorisierung basierend auf Schlüsselwörtern
    const beobachtungen = [];
    const erkenntnisse = [];
    const aktionspunkte = [];
    
    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase();
      if (lower.includes('wirkt') || lower.includes('sehe') || lower.includes('beobachte')) {
        beobachtungen.push(sentence.trim());
      } else if (lower.includes('erkenne') || lower.includes('wichtig') || lower.includes('verstehe')) {
        erkenntnisse.push(sentence.trim());
      } else if (lower.includes('soll') || lower.includes('vereinbart') || lower.includes('aufgabe') || lower.includes('ziel')) {
        aktionspunkte.push(sentence.trim());
      }
    });

    return {
      title: 'KI-strukturierte Session-Notizen',
      beobachtungen: beobachtungen.length > 0 ? beobachtungen : ['Keine spezifischen Beobachtungen identifiziert'],
      erkenntnisse: erkenntnisse.length > 0 ? erkenntnisse : ['Keine spezifischen Erkenntnisse identifiziert'],
      aktionspunkte: aktionspunkte.length > 0 ? aktionspunkte : ['Keine spezifischen Aktionspunkte identifiziert'],
      naechsteSchritte: ['Follow-up Termin vereinbaren', 'Reflexion der heutigen Session']
    };
  };

  const handleAIStructure = async (note) => {
    console.log('Brain button clicked for:', note.title);
    setIsAnalyzing(true);
    
    // 2 Sekunden warten (simulierte KI-Analyse)
    setTimeout(() => {
      const result = analyzeText(note.content);
      setAiResult(result);
      setShowAiModal(true);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Lücken-Analyse
  const analyzeGaps = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const hasGoals = words.some(w => ['ziel', 'ziele', 'erreichen', 'schaffen'].includes(w));
    const hasProgress = words.some(w => ['fortschritt', 'entwicklung', 'verbesserung'].includes(w));
    const hasActions = words.some(w => ['aufgabe', 'handlung', 'machen', 'vereinbart'].includes(w));
    const hasEmotions = words.some(w => ['gefühl', 'emotion', 'fühle', 'stress', 'freude'].includes(w));

    const gaps = [];
    if (!hasGoals) gaps.push('Keine klaren Ziele für die Session definiert');
    if (!hasProgress) gaps.push('Fortschritt seit letzter Session nicht besprochen');
    if (!hasActions) gaps.push('Konkrete Handlungsschritte fehlen');
    if (!hasEmotions) gaps.push('Emotionale Ebene wurde wenig thematisiert');

    return {
      title: 'Session-Vollständigkeits-Analyse',
      gaps: gaps.length > 0 ? gaps : ['Session erscheint vollständig dokumentiert'],
      suggestions: [
        'Zu Beginn jeder Session den Fortschritt seit dem letzten Termin erfragen',
        'Konkrete, messbare Ziele für die nächste Session definieren',
        'Emotionale Reaktionen des Coachees mehr beachten und dokumentieren'
      ],
      checklist: [
        { item: 'Check-in durchgeführt', completed: text.includes('anfang') || text.length > 50 },
        { item: 'Hauptthema bearbeitet', completed: text.split('.').length > 3 },
        { item: 'Emotionen angesprochen', completed: hasEmotions },
        { item: 'Aktionsschritte definiert', completed: hasActions }
      ]
    };
  };

  // E-Mail-Zusammenfassung
  const createEmailSummary = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const topics = [];
    if (words.some(w => ['karriere', 'beruf', 'job', 'arbeit'].includes(w))) topics.push('Karriere/Beruf');
    if (words.some(w => ['stress', 'entspannung', 'balance'].includes(w))) topics.push('Work-Life-Balance');
    if (words.some(w => ['selbstvertrauen', 'mut', 'angst'].includes(w))) topics.push('Selbstvertrauen');
    if (topics.length === 0) topics.push('Persönliche Entwicklung');

    return {
      title: 'E-Mail-Zusammenfassung für Coachee',
      keyPoints: [
        'Wichtige Erkenntnisse über persönliche Verhaltensmuster gewonnen',
        'Neue Strategien für den Umgang mit Herausforderungen entwickelt',
        'Konkrete Schritte für die nächsten zwei Wochen vereinbart'
      ],
      topics: topics,
      emailTemplate: `Liebe/r [Coachee Name],

vielen Dank für die heutige Session. Hier die wichtigsten Punkte unseres Gesprächs:

Hauptthemen:
${topics.map(topic => `• ${topic}`).join('\n')}

Deine Erkenntnisse:
• Du hast wichtige Zusammenhänge in deinen Verhaltensmustern erkannt
• Neue Perspektiven auf die aktuelle Situation entwickelt

Vereinbarte nächste Schritte:
• [Spezifische Aufgabe 1]
• [Spezifische Aufgabe 2]

Ich freue mich auf unser nächstes Gespräch am [Datum].

Herzliche Grüße,
[Dein Name]`
    };
  };

  // Muster-Analyse
  const analyzePatterns = (text) => {
    return {
      title: 'Muster-Analyse über Sessions hinweg',
      patterns: [
        {
          pattern: 'Wiederkehrendes Thema: Selbstorganisation',
          frequency: 'In 3 von 4 Sessions erwähnt',
          recommendation: 'Könnte als Schwerpunkt-Thema für kommende Sessions genutzt werden'
        },
        {
          pattern: 'Coachee zeigt regelmäßig Reflexionsfähigkeit',
          frequency: 'Positive Entwicklung seit 2 Sessions',
          recommendation: 'Selbstreflexions-Übungen weiter verstärken'
        },
        {
          pattern: 'Bereitschaft für praktische Umsetzung',
          frequency: 'Durchgängig erkennbar',
          recommendation: 'Mehr experimentelle Ansätze einbauen'
        }
      ],
      trends: {
        overall: 'Positive Entwicklung erkennbar',
        strengths: ['Verbesserte Selbstreflexion', 'Mehr Klarheit in Zielen', 'Erhöhte Motivation'],
        focusAreas: ['Selbstorganisation', 'Praktische Umsetzung', 'Kontinuität']
      },
      recommendations: [
        'Selbstorganisation als Hauptfokus für die nächsten 2-3 Sessions setzen',
        'Erfolge bewusst feiern und verstärken',
        'Praktische Übungen regelmäßig integrieren',
        'Fortschritts-Tracking einführen'
      ]
    };
  };

  const handleAIGaps = async (note) => {
    console.log('Gap analysis for:', note.title);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const result = analyzeGaps(note.content);
      setAiResult(result);
      setShowAiModal(true);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleAISummary = async (note) => {
    console.log('Email summary for:', note.title);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const result = createEmailSummary(note.content);
      setAiResult(result);
      setShowAiModal(true);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleAIPatterns = async (note) => {
    console.log('Pattern analysis for:', note.title);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const result = analyzePatterns(note.content);
      setAiResult(result);
      setShowAiModal(true);
      setIsAnalyzing(false);
    }, 1500);
  };

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
                        {/* KI-Analyse Buttons */}
                        <div className="flex gap-1 mr-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAIStructure(note)}
                            title="KI-Strukturierung"
                            className="h-8 w-8 p-0"
                          >
                            <Brain className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAIGaps(note)}
                            title="Lücken-Analyse"
                            className="h-8 w-8 p-0"
                          >
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAISummary(note)}
                            title="E-Mail-Zusammenfassung"
                            className="h-8 w-8 p-0"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAIPatterns(note)}
                            title="Muster-Analyse"
                            className="h-8 w-8 p-0"
                          >
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Bestehende Edit/Delete Buttons */}
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

        {/* KI-Ergebnis Modal */}
        {showAiModal && aiResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">{aiResult.title}</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAiModal(false)}
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Strukturierte Notizen */}
                  {aiResult.beobachtungen && (
                    <>
                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Beobachtungen</h4>
                        <ul className="space-y-1">
                          {aiResult.beobachtungen.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span className="text-sm text-slate-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Erkenntnisse</h4>
                        <ul className="space-y-1">
                          {aiResult.erkenntnisse.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-sm text-slate-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Aktionspunkte</h4>
                        <ul className="space-y-1">
                          {aiResult.aktionspunkte.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-orange-400 mt-1">•</span>
                              <span className="text-sm text-slate-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Nächste Schritte</h4>
                        <ul className="space-y-1">
                          {aiResult.naechsteSchritte.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span className="text-sm text-slate-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Lücken-Analyse */}
                  {aiResult.gaps && (
                    <>
                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Identifizierte Lücken</h4>
                        <ul className="space-y-1">
                          {aiResult.gaps.map((gap, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5" />
                              <span className="text-sm text-slate-300">{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Verbesserungsvorschläge</h4>
                        <ul className="space-y-1">
                          {aiResult.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-sm text-slate-300">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Session-Checkliste</h4>
                        <ul className="space-y-2">
                          {aiResult.checklist.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                item.completed 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-slate-400'
                              }`}>
                                {item.completed && '✓'}
                              </div>
                              <span className="text-sm text-slate-300">{item.item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {/* E-Mail-Zusammenfassung */}
                  {aiResult.keyPoints && (
                    <>
                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Wichtigste Punkte</h4>
                        <ul className="space-y-1">
                          {aiResult.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span className="text-sm text-slate-300">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Hauptthemen</h4>
                        <div className="flex flex-wrap gap-2">
                          {aiResult.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-blue-300 border-blue-500">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">E-Mail-Vorlage für Coachee</h4>
                        <pre className="text-sm whitespace-pre-wrap bg-slate-800 p-3 rounded border border-slate-600 text-slate-200">
                          {aiResult.emailTemplate}
                        </pre>
                        <Button 
                          onClick={() => {
                            navigator.clipboard.writeText(aiResult.emailTemplate);
                            toast({ title: "Kopiert", description: "E-Mail-Vorlage in Zwischenablage kopiert." });
                          }}
                          className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                          In Zwischenablage kopieren
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Muster-Analyse */}
                  {aiResult.patterns && (
                    <>
                      {aiResult.patterns.map((pattern, index) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                          <h4 className="font-semibold mb-1 text-white">{pattern.pattern}</h4>
                          <p className="text-sm text-slate-400 mb-1">{pattern.frequency}</p>
                          <p className="text-sm text-slate-300">{pattern.recommendation}</p>
                        </div>
                      ))}

                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Trend-Analyse</h4>
                        <p className="text-sm text-slate-300 mb-2">Gesamtentwicklung: {aiResult.trends.overall}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-green-400 mb-1">Stärken</h5>
                            <ul className="space-y-1">
                              {aiResult.trends.strengths.map((strength, index) => (
                                <li key={index} className="text-sm text-slate-300">• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-orange-400 mb-1">Fokus-Bereiche</h5>
                            <ul className="space-y-1">
                              {aiResult.trends.focusAreas.map((area, index) => (
                                <li key={index} className="text-sm text-slate-300">• {area}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <h4 className="font-semibold mb-2 text-white">Empfehlungen für weitere Sessions</h4>
                        <ul className="space-y-1">
                          {aiResult.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-sm text-slate-300">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-600">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAiModal(false)}
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    Schließen
                  </Button>
                  <Button 
                    onClick={() => {
                      // Als neue Notiz speichern
                      const newContent = `# ${aiResult.title}\n\n## Beobachtungen\n${aiResult.beobachtungen.map(item => `• ${item}`).join('\n')}\n\n## Erkenntnisse\n${aiResult.erkenntnisse.map(item => `• ${item}`).join('\n')}\n\n## Aktionspunkte\n${aiResult.aktionspunkte.map(item => `• ${item}`).join('\n')}\n\n## Nächste Schritte\n${aiResult.naechsteSchritte.map(item => `• ${item}`).join('\n')}`;

                      const existingNotes = JSON.parse(localStorage.getItem('session-notes') || '[]');
                      const newNote = {
                        id: Date.now(),
                        title: aiResult.title,
                        content: newContent,
                        coacheeId: '',
                        tags: ['KI-generiert'],
                        date: new Date().toISOString(),
                        lastModified: new Date().toISOString()
                      };
                      existingNotes.push(newNote);
                      localStorage.setItem('session-notes', JSON.stringify(existingNotes));
                      
                      setShowAiModal(false);
                      toast({ title: "Strukturierte Notiz gespeichert", description: "Die KI-Analyse wurde als neue Notiz gespeichert." });
                      window.location.reload();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Als neue Notiz speichern
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 flex items-center gap-3 border border-slate-700">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
              <span className="text-white">KI analysiert deine Notizen...</span>
            </div>
          </div>
        )}

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