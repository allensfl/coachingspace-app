import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Video, Monitor, Settings, Plus, X, Play, Pause, RotateCcw, Eye, Lightbulb, Target, Bot, Wrench } from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';
import { useToast } from '@/components/ui/use-toast';

const CoachingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const context = useAppStateContext();
  const sessions = context?.sessions || [];
  const coachees = context?.coachees || [];
  const { hasFeature, showPremiumFeature } = context;
  
  const [sessionNotes, setSessionNotes] = useState('');
  const [videoProviders, setVideoProviders] = useState([
    { id: 1, name: 'Zoom', url: 'https://zoom.us/', description: 'Video-Konferenz mit Zoom' },
    { id: 2, name: 'Google Meet', url: 'https://meet.google.com/', description: 'Google Meet Video-Chat' },
    { id: 3, name: 'Microsoft Teams', url: 'https://teams.microsoft.com/', description: 'Microsoft Teams Meeting' },
    { id: 4, name: 'Integriert', url: '#', description: 'Integrierte Video-Lösung' }
  ]);
  const [displayTools, setDisplayTools] = useState([
    { id: 1, name: 'Miro', url: 'https://miro.com/', description: 'Kollaboratives Whiteboard' },
    { id: 2, name: 'CoSpaces', url: 'https://cospaces.io/', description: 'VR/AR Lernumgebung' },
    { id: 3, name: 'Jamboard', url: 'https://jamboard.google.com/', description: 'Google Jamboard' },
    { id: 4, name: 'Figma', url: 'https://figma.com/', description: 'Design und Prototyping' }
  ]);
  
  
  // Toolbox States - nicht mehr benötigt
  const [availableTools, setAvailableTools] = useState([]);

  // Custom Tools aus localStorage laden - vereinfacht
  useEffect(() => {
    // Nur für Debugging - wird nicht mehr für Modal benötigt
    try {
      const storedCustomTools = localStorage.getItem('customTools');
      if (storedCustomTools) {
        console.log('Custom Tools verfügbar:', JSON.parse(storedCustomTools).length);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Custom Tools:', error);
    }
  }, []);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const session = sessions.find(s => s.id === parseInt(id));
  const coachee = coachees.find(c => c.id === session?.coacheeId);

  // Timer
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Tool in eigenem Fenster öffnen - entfernt, da nicht mehr benötigt

  const openVideoProvider = (provider) => {
    if (provider.url !== '#') {
      window.open(provider.url, '_blank');
    }
  };

  const openDisplayTool = (tool) => {
    window.open(tool.url, '_blank');
  };

  const quickNoteButtons = [
    { label: 'Beobachtung', icon: Eye, text: '📋 Beobachtung: ' },
    { label: 'Erkenntnis', icon: Lightbulb, text: '💡 Erkenntnis: ' },
    { label: 'Aktion', icon: Target, text: '🎯 Aktion: ' }
  ];

  const addQuickNote = (quickText) => {
    setSessionNotes(prev => prev ? `${prev}\n\n${quickText}` : quickText);
  };

  const displayCoacheeName = coachee 
    ? `${coachee.firstName} ${coachee.lastName}`
    : session?.coacheeName 
    ? session.coacheeName
    : 'Unbekannter Coachee';

  // Auto-Save Notizen
  const saveSessionNotes = (notes) => {
    if (!notes.trim()) return;

    const storageKeys = [];
    
    if (coachee?.id) {
      storageKeys.push(`session-notes-${coachee.id}-${id}`);
    }
    storageKeys.push(`session-notes-session-${id}`);
    
    if (session?.coacheeName) {
      const nameKey = session.coacheeName.replace(/\s+/g, '-').toLowerCase();
      storageKeys.push(`session-notes-name-${nameKey}-${id}`);
    }
    
    storageKeys.forEach(key => {
      localStorage.setItem(key, notes);
    });

    const metadata = {
      sessionId: id,
      coacheeId: coachee?.id || null,
      coacheeName: session?.coacheeName || coachee?.firstName + ' ' + coachee?.lastName || 'Unbekannter Coachee',
      sessionTitle: session?.topic || 'Untitled Session',
      timestamp: new Date().toISOString(),
      keys: storageKeys
    };
    
    localStorage.setItem(`session-metadata-${id}`, JSON.stringify(metadata));
  };

  // Notizen laden beim Start
  useEffect(() => {
    const loadSessionNotes = () => {
      const possibleKeys = [
        coachee?.id ? `session-notes-${coachee.id}-${id}` : null,
        `session-notes-session-${id}`,
        session?.coacheeName ? `session-notes-name-${session.coacheeName.replace(/\s+/g, '-').toLowerCase()}-${id}` : null
      ].filter(Boolean);

      for (const key of possibleKeys) {
        const notes = localStorage.getItem(key);
        if (notes) {
          setSessionNotes(notes);
          return;
        }
      }
    };

    loadSessionNotes();
  }, [id, coachee?.id, session?.coacheeName]);

  // Auto-Save bei Änderungen mit Debounce
  useEffect(() => {
    if (sessionNotes.trim()) {
      const timeoutId = setTimeout(() => {
        saveSessionNotes(sessionNotes);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [sessionNotes, coachee?.id, session?.coacheeName, id]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/sessions')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zu Sessions
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Coaching Session</h1>
              <p className="text-slate-400">
                {displayCoacheeName} • Session #{id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-mono">{formatTime(timerSeconds)}</div>
              <div className="text-sm text-slate-400">Session-Zeit</div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isTimerRunning ? "secondary" : "default"}
                onClick={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setTimerSeconds(0);
                  setIsTimerRunning(false);
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video-Provider */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center gap-2">
              <Video className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white">Video-Provider wählen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {videoProviders.map((provider) => (
                  <Button
                    key={provider.id}
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center gap-1 text-sm"
                    onClick={() => openVideoProvider(provider)}
                  >
                    <span className="font-medium">{provider.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Display-Tools */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center gap-2">
              <Monitor className="h-5 w-5 text-green-400" />
              <CardTitle className="text-white">Display-Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {displayTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    className="w-full justify-between h-12"
                    onClick={() => openDisplayTool(tool)}
                  >
                    <span>{tool.name}</span>
                    <span className="text-xs opacity-60">↗</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Session-Notizen */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Live Session-Notizen</CardTitle>
              <div className="flex gap-2 flex-wrap">
                {quickNoteButtons.map((button) => (
                  <Button
                    key={button.label}
                    size="sm"
                    variant="outline"
                    onClick={() => addQuickNote(button.text)}
                    className="text-xs"
                  >
                    <button.icon className="h-3 w-3 mr-1" />
                    {button.label}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-slate-400">
                  Notizen für: {displayCoacheeName} • Session #{id}
                </div>
                <Textarea
                  placeholder="Session-Notizen werden automatisch gespeichert..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="min-h-48 bg-slate-800 border-slate-600 text-white"
                />
                <div className="flex justify-between items-center text-sm text-slate-400">
                  <span>{sessionNotes.length} Zeichen • Automatisch gespeichert</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coaching-Tools - Direkter Toolbox-Zugang */}
          <Card className="glass-card lg:col-span-1">
            <CardHeader className="flex flex-row items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-400" />
              <CardTitle className="text-white">Coaching-Toolbox</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={() => window.open('/toolbox', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes')}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  <Wrench className="h-5 w-5 mr-2" />
                  Toolbox öffnen
                </Button>
                <div className="text-sm text-slate-400 text-center">
                  Die Toolbox öffnet sich in einem neuen Fenster.<br/>
                  Klicke auf ein Tool um es in einem separaten Display zu öffnen.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachingRoom;