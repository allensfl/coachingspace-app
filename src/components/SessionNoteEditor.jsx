import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Download, Trash2, FileText, User, Calendar, Book, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAppStateContext } from '@/context/AppStateContext';
import { sessionNoteTemplates } from '@/data/sessionNoteTemplates';
import { generateSessionNotePDF } from '@/lib/pdf';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export default function SessionNoteEditor({ isNew = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { state, actions } = useAppStateContext();
  const { coachees, sessions, sessionNotes } = state;
  const { setSessionNotes } = actions;

  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionIdFromQuery = queryParams.get('sessionId');
    const coacheeIdFromQuery = queryParams.get('coacheeId');

    if (isNew) {
      const session = sessions.find(s => s.id === sessionIdFromQuery);
      setNote({
        id: `note_${Date.now()}`,
        title: session ? `Notiz für: ${session.topic}` : 'Neue Sitzungsnotiz',
        content: '',
        coacheeId: coacheeIdFromQuery || 'unassigned',
        sessionId: sessionIdFromQuery || 'unassigned',
        createdAt: new Date().toISOString(),
      });
      setIsLoading(false);
    } else {
      const existingNote = sessionNotes.find(n => n.id === id);
      if (existingNote) {
        setNote(existingNote);
      } else {
        toast({ title: 'Fehler', description: 'Notiz nicht gefunden.', variant: 'destructive' });
        navigate('/session-notes');
      }
      setIsLoading(false);
    }
  }, [id, isNew, location.search, sessionNotes, sessions, toast, navigate]);

  const handleInputChange = (field, value) => {
    setNote(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (templateId) => {
    const template = sessionNoteTemplates.find(t => t.id === templateId);
    if (template) {
      setNote(prev => ({
        ...prev,
        content: prev.content ? `${prev.content}\n\n${template.content}` : template.content,
      }));
      toast({ title: 'Vorlage eingefügt', description: `Die Vorlage "${template.title}" wurde zum Inhalt hinzugefügt.` });
    }
  };

  const handleSave = () => {
    if (!note.title || !note.coacheeId || note.coacheeId === 'unassigned') {
      toast({ title: 'Fehler', description: 'Bitte gib einen Titel an und wähle einen Coachee aus.', variant: 'destructive' });
      return;
    }

    setSessionNotes(prev => {
      const existing = prev.find(n => n.id === note.id);
      if (existing) {
        return prev.map(n => n.id === note.id ? note : n);
      }
      return [...prev, note];
    });

    toast({ title: 'Gespeichert!', description: 'Die Sitzungsnotiz wurde erfolgreich gespeichert.' });
    if (isNew) {
      navigate(`/session-notes/${note.id}`);
    }
  };

  const handleDelete = () => {
    setSessionNotes(prev => prev.filter(n => n.id !== note.id));
    toast({ title: 'Gelöscht!', description: 'Die Notiz wurde entfernt.', variant: 'destructive' });
    navigate('/session-notes');
  };

  const handleDownloadPDF = () => {
    const coachee = coachees.find(c => c.id === note.coacheeId);
    const session = sessions.find(s => s.id === note.sessionId);
    generateSessionNotePDF(note, coachee, session);
    toast({ title: 'PDF wird generiert', description: 'Dein Download startet in Kürze.' });
  };

  const availableSessions = useMemo(() => {
    if (note?.coacheeId && note.coacheeId !== 'unassigned') {
      return sessions.filter(s => s.coacheeId === note.coacheeId);
    }
    return [];
  }, [note?.coacheeId, sessions]);

  if (isLoading || !note) {
    return <div className="flex justify-center items-center h-full"><ArrowLeft className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>{isNew ? 'Neue Notiz' : note.title} - Coachingspace</title>
        <meta name="description" content="Erstelle und bearbeite detaillierte Sitzungsnotizen." />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/session-notes')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Übersicht
          </Button>
          <div className="flex gap-2">
            {!isNew && (
              <Button variant="outline" onClick={handleDownloadPDF}><Download className="mr-2 h-4 w-4" /> PDF</Button>
            )}
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Speichern</Button>
            {!isNew && (
              <Button variant="destructive" onClick={handleDelete}><Trash2 className="mr-2 h-4 w-4" /> Löschen</Button>
            )}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg">Titel</Label>
                <Input id="title" value={note.title} onChange={(e) => handleInputChange('title', e.target.value)} className="text-2xl h-12" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="coachee" className="flex items-center gap-2"><User className="h-4 w-4" /> Coachee</Label>
                  <Select value={String(note.coacheeId)} onValueChange={(val) => handleInputChange('coacheeId', val === 'unassigned' ? val : parseInt(val))}>
                    <SelectTrigger><SelectValue placeholder="Coachee auswählen..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Kein Coachee</SelectItem>
                      {coachees.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.firstName} {c.lastName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Zugehörige Session</Label>
                  <Select value={note.sessionId} onValueChange={(val) => handleInputChange('sessionId', val)} disabled={availableSessions.length === 0}>
                    <SelectTrigger><SelectValue placeholder="Session auswählen..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Keine spezifische Session</SelectItem>
                      {availableSessions.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.topic} ({new Date(s.date).toLocaleDateString('de-DE')})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Book className="h-4 w-4" /> Vorlagen</Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger><SelectValue placeholder="Vorlage zum Inhalt hinzufügen..." /></SelectTrigger>
                  <SelectContent>
                    {sessionNoteTemplates.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor"><FileText className="mr-2 h-4 w-4" /> Editor</TabsTrigger>
                  <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4" /> Vorschau</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                  <Textarea
                    value={note.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Schreibe deine Notizen hier... Du kannst Markdown verwenden."
                    className="min-h-[400px] mt-4 font-mono text-base"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="prose prose-invert prose-slate max-w-none p-4 mt-4 border border-slate-700 rounded-md min-h-[400px]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content || "Kein Inhalt für die Vorschau."}</ReactMarkdown>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}