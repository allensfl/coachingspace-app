import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, Pause, Play, Square, Maximize, Minimize, Target, File, Plus, Save, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAppStateContext } from '@/context/AppStateContext';

export default function LiveSession() {
  const { id } = useParams();
  const { toast } = useToast();
  const { state } = useAppStateContext();
  const { sessions, tools } = state;
  const session = sessions.find(s => s.id === parseInt(id));

  const [notes, setNotes] = useState('');
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const notesRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  useEffect(() => {
    const savedNotes = localStorage.getItem(`session_notes_${id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [id]);

  const handleNoteChange = (e) => {
    setNotes(e.target.value);
    localStorage.setItem(`session_notes_${id}`, e.target.value);
  };

  const formatTime = (seconds) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = `${Math.floor(seconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const stopSession = () => {
    setIsActive(false);
    toast({ title: "✅ Session beendet", description: "Vergiss nicht, deine Notizen zu speichern!" });
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const handleSaveNotes = () => {
    toast({
      title: "✅ Notizen gespeichert!",
      description: "Deine Notizen wurden erfolgreich gesichert (simuliert)."
    });
    localStorage.removeItem(`session_notes_${id}`);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white">
        <h2 className="text-2xl font-bold mb-4">Session nicht gefunden</h2>
        <Link to="/sessions"><Button>Zurück zur Session-Übersicht</Button></Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Live Session: {session.topic} - Coachingspace</title>
        <meta name="description" content={`Live-Modus für die Coaching-Session mit ${session.coacheeName}.`} />
      </Helmet>
      <div className="flex flex-col h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 gap-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link to="/sessions" className="text-sm text-blue-400 hover:underline">← Zurück zu den Sessions</Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{session.topic}</h1>
            <p className="text-slate-400">Live-Session mit {session.coacheeName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={toggleFullScreen}>
              {isFullScreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
              {isFullScreen ? 'Vollbild verlassen' : 'Vollbild'}
            </Button>
            <Button onClick={handleSaveNotes} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Notizen speichern
            </Button>
          </div>
        </header>

        <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          <motion.div layout className="lg:col-span-2 flex flex-col h-full">
            <Card className="glass-card flex-grow flex flex-col">
              <CardHeader>
                <CardTitle className="text-white">Echtzeit-Notizen</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <Textarea
                  ref={notesRef}
                  value={notes}
                  onChange={handleNoteChange}
                  placeholder="Beginne hier mit deinen Notizen... (wird lokal gespeichert)"
                  className="w-full h-full bg-slate-900 border-slate-700 text-base resize-none"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div layout className="flex flex-col gap-6 h-full">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center"><Timer className="mr-2" />Timer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-5xl font-mono font-bold text-white mb-4">{formatTime(time)}</p>
                <div className="flex justify-center gap-2">
                  <Button onClick={toggleTimer} variant="outline" size="lg">
                    {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                    {isActive ? 'Pause' : 'Start'}
                  </Button>
                  <Button onClick={stopSession} variant="destructive" size="lg">
                    <Square className="h-5 w-5 mr-2" />
                    Beenden
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card flex-grow">
              <CardHeader>
                <CardTitle className="text-white">Schnellzugriff</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-400">Verwendete Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {tools.slice(0, 3).map(tool => (
                    <Badge key={tool.id} variant="outline">{tool.name}</Badge>
                  ))}
                  <Button variant="ghost" size="sm"><Plus className="h-4 w-4 mr-1" /> Tool</Button>
                </div>
                <h4 className="text-sm font-semibold text-slate-400 pt-2">Anhänge</h4>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" /> Datei anhängen
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </>
  );
}