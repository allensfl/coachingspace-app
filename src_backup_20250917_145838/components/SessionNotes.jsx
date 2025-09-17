import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, User, Calendar, FileText, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStateContext } from '@/context/AppStateContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from './ui/use-toast';

export default function SessionNotes() {
  const { state, actions } = useAppStateContext();
  const { sessionNotes, coachees, sessions } = state;
  const { setSessionNotes } = actions;
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDeleteNote = (noteId) => {
    setSessionNotes(prev => prev.filter(note => note.id !== noteId));
    toast({
      title: "Notiz gelöscht",
      description: "Die Sitzungsnotiz wurde erfolgreich entfernt.",
      variant: "destructive"
    });
  };

  const enrichedNotes = useMemo(() => {
    return (sessionNotes || [])
      .map(note => {
        const coachee = coachees.find(c => c.id === note.coacheeId);
        const session = sessions.find(s => s.id === note.sessionId);
        return {
          ...note,
          coacheeName: coachee ? `${coachee.firstName} ${coachee.lastName}` : 'Unbekannt',
          sessionTopic: session ? session.topic : 'Keine Session',
          sessionDate: session ? session.date : null,
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [sessionNotes, coachees, sessions]);

  const filteredNotes = enrichedNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.coacheeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.sessionTopic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Sitzungsnotizen - Coachingspace</title>
        <meta name="description" content="Verwalte alle deine Sitzungsnotizen an einem zentralen Ort." />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Sitzungsnotizen</h1>
            <p className="text-slate-400">Alle Notizen zu deinen Coachings an einem Ort.</p>
          </div>
          <Button onClick={() => navigate('/session-notes/new')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Neue Notiz
          </Button>
        </div>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Notizen durchsuchen (Titel, Coachee, Session)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="h-full"
            >
              <Card className="glass-card hover:bg-slate-800/50 transition-all duration-300 group h-full flex flex-col">
                <CardHeader>
                  <Link to={`/session-notes/${note.id}`} className="block">
                    <CardTitle className="text-white group-hover:text-blue-400 transition-colors text-lg line-clamp-2">
                      {note.title}
                    </CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-400">
                      <User className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{note.coacheeName}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{note.sessionDate ? new Date(note.sessionDate).toLocaleDateString('de-DE') : 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-1">{note.sessionTopic}</span>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-700 flex justify-between items-center">
                     <span className="text-xs text-slate-500">
                        Erstellt am {new Date(note.createdAt).toLocaleDateString('de-DE')}
                     </span>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Notiz wirklich löschen?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Diese Aktion kann nicht rückgängig gemacht werden. Die Notiz wird dauerhaft gelöscht.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteNote(note.id)} className="bg-red-600 hover:bg-red-700">Löschen</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Keine Notizen gefunden</h3>
              <p className="text-slate-400 mb-4">
                {searchTerm
                  ? 'Versuche andere Suchbegriffe.'
                  : 'Erstelle deine erste Sitzungsnotiz, um zu beginnen.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate('/session-notes/new')} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Erste Notiz erstellen
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}