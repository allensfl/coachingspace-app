import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Video, Monitor, Settings, Plus, X, Play, Pause, RotateCcw, Eye, Lightbulb, Target } from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';
import { useToast } from '@/components/ui/use-toast';

const CoachingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Context mit direkter Struktur (nicht context.state)
  const context = useAppStateContext();
  const sessions = context?.sessions || [];
  const coachees = context?.coachees || [];
  
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
  const [showProviderManager, setShowProviderManager] = useState(false);
  const [showToolManager, setShowToolManager] = useState(false);
  const [showCoachingToolManager, setShowCoachingToolManager] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', url: '', description: '' });
  const [newProvider, setNewProvider] = useState({ name: '', url: '', description: '' });
  const [newCoachingTool, setNewCoachingTool] = useState({ name: '', icon: '', description: '' });
  
  // ============ ECHTE COACHING-TOOLS + DYNAMISCHE INTEGRATION ============
  const [coachingTools, setCoachingTools] = useState([]);

  // Tools laden: Hardcoded + aus localStorage
  useEffect(() => {
    const loadAllTools = () => {
      // 1. Die 5 Basis-Tools (mit IDs die im Tool-Presenter verfügbar sind)
      const baseTools = [
        { 
          id: 2, // Skalenfrage im Tool-Presenter
          name: 'Skalenarbeit', 
          icon: '📊', 
          description: 'Visualisierung von Fortschritt und Zielen durch Skalenbewertung', 
          order: 1,
          type: 'built-in'
        },
        { 
          id: 1, // Lebensrad im Tool-Presenter
          name: 'Lebensrad', 
          icon: '⚖️', 
          description: 'Ganzheitliche Bewertung verschiedener Lebensbereiche', 
          order: 2,
          type: 'built-in'
        },
        { 
          id: 3, // Ressourcen-Liste im Tool-Presenter
          name: 'Ressourcen-Liste', 
          icon: '📝', 
          description: 'Sammle deine verfügbaren Ressourcen und Stärken', 
          order: 3,
          type: 'built-in'
        },
        { 
          id: 4, // Zielbaum im Tool-Presenter
          name: 'Zielbaum', 
          icon: '🌳', 
          description: 'Visualisiere deine Ziele in einer Baumstruktur', 
          order: 4,
          type: 'built-in'
        },
        { 
          id: 5, // Werte-Kompass im Tool-Presenter
          name: 'Werte-Kompass', 
          icon: '🧭', 
          description: 'Erkunde und definiere deine wichtigsten Werte', 
          order: 5,
          type: 'built-in'
        }
      ];

      // 2. Hochgeladene Tools aus localStorage hinzufügen
      try {
        // Die richtigen localStorage-Keys aus der Toolbox verwenden
        const possibleKeys = ['professional_toolbox_tools', 'toolbox_data', 'saved_tools'];
        let customTools = [];
        
        for (const key of possibleKeys) {
          const customToolsData = localStorage.getItem(key);
          if (customToolsData) {
            try {
              const parsedData = JSON.parse(customToolsData);
              
              // Verschiedene Datenstrukturen handhaben
              let toolsArray = [];
              if (Array.isArray(parsedData)) {
                toolsArray = parsedData;
              } else if (parsedData.customTools && Array.isArray(parsedData.customTools)) {
                toolsArray = parsedData.customTools;
              } else if (parsedData.tools && Array.isArray(parsedData.tools)) {
                toolsArray = parsedData.tools;
              }
              
              if (toolsArray.length > 0) {
                customTools = toolsArray
                  .filter(tool => tool.type === 'custom') // Nur hochgeladene Tools
                  .map((tool, index) => ({
                    id: 100 + index, // Startet bei 100 um Konflikte zu vermeiden
                    name: tool.name || 'Unbenanntes Tool',
                    icon: tool.icon || '📄',
                    description: tool.description || 'Hochgeladenes Tool',
                    order: baseTools.length + index + 1,
                    type: 'custom',
                    fileData: tool.fileData,
                    fileName: tool.fileName,
                    fileType: tool.fileType
                  }));
                console.log(`Custom Tools gefunden in localStorage key: ${key}`, customTools);
                break; // Ersten gefundenen Key verwenden
              }
            } catch (parseError) {
              console.log(`Parse error for key ${key}:`, parseError);
            }
          }
        }
        
        // TEMPORÄRER WORKAROUND: Hochgeladene Tools manuell hinzufügen
        // bis die Toolbox-Speicherung repariert ist
        customTools = [
          {
            id: 100,
            name: 'Die 12 Schritte des triadischen KI-Coachings',
            icon: '📋',
            description: 'Hochgeladenes PDF-Tool aus der Toolbox',
            order: 6,
            type: 'custom',
            fileName: 'ki-coaching-12-schritte.pdf',
            fileType: 'application/pdf',
            fileData: 'data:application/pdf;base64,placeholder' // Placeholder bis echte Daten verfügbar
          }
        ];
        
        console.log('WORKAROUND: Manuell hinzugefügtes Tool:', customTools);

        // 3. Alle Tools kombinieren
        const allTools = [...baseTools, ...customTools];
        setCoachingTools(allTools);
        
        console.log('Tools geladen:', {
          baseTools: baseTools.length,
          customTools: customTools.length,
          total: allTools.length
        });
        
      } catch (error) {
        console.error('Fehler beim Laden der Custom Tools:', error);
        setCoachingTools(baseTools); // Fallback nur Basis-Tools
      }
    };

    loadAllTools();
  }, []);
  
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Session und Coachee laden
  const session = sessions.find(s => s.id === parseInt(id));
  const coachee = coachees.find(c => c.id === session?.coacheeId);

  // Debug-Logs
  console.log('CoachingRoom Debug:');
  console.log('- Session ID from URL:', id);
  console.log('- Sessions available:', sessions.length);
  console.log('- Found session:', session ? 'Yes' : 'No', session);
  console.log('- Session coacheeId:', session?.coacheeId);
  console.log('- Coachees available:', coachees.length);
  console.log('- Available coachee IDs:', coachees.map(c => c.id));
  console.log('- Found coachee:', coachee ? 'Yes' : 'No', coachee);
  console.log('- Coaching Tools loaded:', coachingTools.length);

  // Robuste Notizen-Speicherung - funktioniert auch ohne Context
  const saveSessionNotes = (notes) => {
    if (!notes.trim()) return;

    // Mehrere Speicher-Strategien für maximale Robustheit
    const storageKeys = [];
    
    // 1. Preferred: Mit Coachee-ID (falls verfügbar)
    if (coachee?.id) {
      storageKeys.push(`session-notes-${coachee.id}-${id}`);
      console.log('Saving with coachee ID:', coachee.id);
    }
    
    // 2. Fallback: Mit Session-ID only
    storageKeys.push(`session-notes-session-${id}`);
    
    // 3. Fallback: Mit Coachee-Namen (falls verfügbar)
    if (session?.coacheeName) {
      const nameKey = session.coacheeName.replace(/\s+/g, '-').toLowerCase();
      storageKeys.push(`session-notes-name-${nameKey}-${id}`);
    }
    
    // Alle Keys speichern für maximale Auffindbarkeit
    storageKeys.forEach(key => {
      localStorage.setItem(key, notes);
      console.log(`Notizen gespeichert - Key: ${key}`);
    });

    // Metadata für SessionNotes speichern
    const metadata = {
      sessionId: id,
      coacheeId: coachee?.id || null,
      coacheeName: session?.coacheeName || coachee?.firstName + ' ' + coachee?.lastName || 'Unbekannter Coachee',
      sessionTitle: session?.topic || 'Untitled Session',
      timestamp: new Date().toISOString(),
      keys: storageKeys
    };
    
    localStorage.setItem(`session-metadata-${id}`, JSON.stringify(metadata));
    console.log('Metadata gespeichert:', metadata);
  };

  // Notizen beim Laden wiederherstellen
  useEffect(() => {
    const loadSessionNotes = () => {
      // Versuche verschiedene Keys in Prioritäts-Reihenfolge
      const possibleKeys = [
        coachee?.id ? `session-notes-${coachee.id}-${id}` : null,
        `session-notes-session-${id}`,
        session?.coacheeName ? `session-notes-name-${session.coacheeName.replace(/\s+/g, '-').toLowerCase()}-${id}` : null
      ].filter(Boolean);

      for (const key of possibleKeys) {
        const notes = localStorage.getItem(key);
        if (notes) {
          setSessionNotes(notes);
          console.log(`Notizen geladen von Key: ${key}`);
          return;
        }
      }
      console.log('Keine gespeicherten Notizen gefunden');
    };

    loadSessionNotes();
  }, [id, coachee?.id, session?.coacheeName]);

  // Auto-Speichern bei Änderungen
  useEffect(() => {
    if (sessionNotes.trim()) {
      const timeoutId = setTimeout(() => {
        saveSessionNotes(sessionNotes);
      }, 1000); // 1 Sekunde Debounce

      return () => clearTimeout(timeoutId);
    }
  }, [sessionNotes, coachee?.id, session?.coacheeName, id]);

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

  const openVideoProvider = (provider) => {
    if (provider.url !== '#') {
      window.open(provider.url, '_blank');
    }
  };

  const openDisplayTool = (tool) => {
    window.open(tool.url, '_blank');
  };

  // ============ DIREKTER TOOL-ZUGANG ============
  const openCoachingTool = (tool) => {
    console.log('Opening coaching tool:', tool);
    
    if (tool.type === 'built-in') {
      // Interaktive Tools -> Große Toolbox öffnen mit Anweisung
      console.log(`Opening ${tool.name} in toolbox`);
      
      // Große Toolbox öffnen für bessere Bedienbarkeit
      window.open('/toolbox', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
      
      toast && toast({
        title: `${tool.name} öffnen`,
        description: `Klicke in der Toolbox auf "${tool.name}" um das Tool zu starten`,
        duration: 5000,
      });
    } else if (tool.type === 'custom') {
      // Custom Tools -> Zur Toolbox weiterleiten
      console.log('Opening custom tool - redirecting to toolbox');
      
      window.open('/toolbox', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
      
      toast && toast({
        title: "Hochgeladenes Tool öffnen",
        description: `Suche "${tool.name}" in der Toolbox und klicke darauf`,
        duration: 5000,
      });
    }
  };

  const shareKIDialog = () => {
    window.open('/ai-coaching/shared', '_blank', 'width=1000,height=700,scrollbars=yes,resizable=yes');
  };

  const addVideoProvider = () => {
    if (newProvider.name && newProvider.url) {
      const provider = {
        id: Date.now(),
        ...newProvider
      };
      setVideoProviders(prev => [...prev, provider]);
      setNewProvider({ name: '', url: '', description: '' });
    }
  };

  const removeVideoProvider = (id) => {
    setVideoProviders(prev => prev.filter(p => p.id !== id));
  };

  const addDisplayTool = () => {
    if (newTool.name && newTool.url) {
      const tool = {
        id: Date.now(),
        ...newTool
      };
      setDisplayTools(prev => [...prev, tool]);
      setNewTool({ name: '', url: '', description: '' });
    }
  };

  const removeDisplayTool = (id) => {
    setDisplayTools(prev => prev.filter(t => t.id !== id));
  };

  const addCoachingTool = () => {
    if (newCoachingTool.name && newCoachingTool.icon) {
      const tool = {
        id: Date.now(),
        ...newCoachingTool,
        order: coachingTools.length + 1,
        toolboxTool: false // Markiere als manuell hinzugefügt
      };
      setCoachingTools(prev => [...prev, tool].sort((a, b) => a.order - b.order));
      setNewCoachingTool({ name: '', icon: '', description: '' });
    }
  };

  const removeCoachingTool = (id) => {
    setCoachingTools(prev => prev.filter(t => t.id !== id));
  };

  const moveCoachingTool = (id, direction) => {
    setCoachingTools(prev => {
      const tools = [...prev];
      const currentIndex = tools.findIndex(t => t.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex >= 0 && newIndex < tools.length) {
        [tools[currentIndex], tools[newIndex]] = [tools[newIndex], tools[currentIndex]];
        // Update order values
        tools.forEach((tool, index) => {
          tool.order = index + 1;
        });
      }
      return tools;
    });
  };

  const editCoachingTool = (id, updates) => {
    setCoachingTools(prev => prev.map(tool => 
      tool.id === id ? { ...tool, ...updates } : tool
    ));
  };

  // Funktion um zur Toolbox zu navigieren
  const openToolbox = () => {
    window.open('/toolbox', '_blank');
  };

  const quickNoteButtons = [
    { label: 'Beobachtung', icon: Eye, text: '📋 Beobachtung: ' },
    { label: 'Erkenntnis', icon: Lightbulb, text: '💡 Erkenntnis: ' },
    { label: 'Aktion', icon: Target, text: '🎯 Aktion: ' }
  ];

  const addQuickNote = (quickText) => {
    setSessionNotes(prev => prev ? `${prev}\n\n${quickText}` : quickText);
  };

  // Display Name für Coachee
  const displayCoacheeName = coachee 
    ? `${coachee.firstName} ${coachee.lastName}`
    : session?.coacheeName 
    ? session.coacheeName
    : 'Unbekannter Coachee';

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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProviderManager(!showProviderManager)}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Provider verwalten
              </Button>

              {showProviderManager && (
                <div className="mt-4 p-4 bg-slate-800 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Name"
                      value={newProvider.name}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 bg-slate-700 rounded text-sm"
                    />
                    <input
                      placeholder="URL"
                      value={newProvider.url}
                      onChange={(e) => setNewProvider(prev => ({ ...prev, url: e.target.value }))}
                      className="px-3 py-2 bg-slate-700 rounded text-sm"
                    />
                  </div>
                  <input
                    placeholder="Beschreibung"
                    value={newProvider.description}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 rounded text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addVideoProvider}>
                      <Plus className="h-4 w-4 mr-1" /> Hinzufügen
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {videoProviders.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                        <span className="text-sm">{provider.name}</span>
                        <Button size="sm" variant="ghost" onClick={() => removeVideoProvider(provider.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowToolManager(!showToolManager)}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Tools verwalten
              </Button>

              {showToolManager && (
                <div className="mt-4 p-4 bg-slate-800 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Name"
                      value={newTool.name}
                      onChange={(e) => setNewTool(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 bg-slate-700 rounded text-sm"
                    />
                    <input
                      placeholder="URL"
                      value={newTool.url}
                      onChange={(e) => setNewTool(prev => ({ ...prev, url: e.target.value }))}
                      className="px-3 py-2 bg-slate-700 rounded text-sm"
                    />
                  </div>
                  <input
                    placeholder="Beschreibung"
                    value={newTool.description}
                    onChange={(e) => setNewTool(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 rounded text-sm"
                    />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addDisplayTool}>
                      <Plus className="h-4 w-4 mr-1" /> Hinzufügen
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {displayTools.map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                        <span className="text-sm">{tool.name}</span>
                        <Button size="sm" variant="ghost" onClick={() => removeDisplayTool(tool.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <Button
                  onClick={shareKIDialog}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  🤖 KI-Dialog teilen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ============ ÜBERARBEITETE COACHING-TOOLS SEKTION ============ */}
          <Card className="glass-card lg:col-span-1">
            <CardHeader className="flex flex-row items-center gap-2">
              <Settings className="h-5 w-5 text-orange-400" />
              <CardTitle className="text-white">Coaching-Tools</CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {coachingTools.filter(t => t.type === 'built-in').length} INT + {coachingTools.filter(t => t.type === 'custom').length} FILE
              </Badge>
            </CardHeader>
            <CardContent>
              {coachingTools.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {coachingTools.sort((a, b) => a.order - b.order).map((tool) => (
                      <Button
                        key={tool.id}
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-1 text-sm hover:bg-slate-700 relative"
                        onClick={() => openCoachingTool(tool)}
                      >
                        <Badge 
                          variant={tool.type === 'built-in' ? 'default' : 'secondary'} 
                          className="absolute top-1 right-1 text-xs px-1 py-0"
                        >
                          {tool.type === 'built-in' ? 'INT' : 'FILE'}
                        </Badge>
                        <span className="text-lg">{tool.icon}</span>
                        <span className="font-medium text-center leading-tight">{tool.name}</span>
                        <span className="text-xs text-slate-400 text-center">
                          {tool.type === 'built-in' ? 'Präsentieren' : 'Öffnen'}
                        </span>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={openToolbox}
                      className="flex-1"
                    >
                      🧰 Zur Toolbox
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCoachingToolManager(!showCoachingToolManager)}
                      className="flex-1"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Verwalten
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">
                    Keine Tools verfügbar
                  </div>
                  <Button
                    variant="outline"
                    onClick={openToolbox}
                    className="mb-2"
                  >
                    🧰 Toolbox öffnen
                  </Button>
                  <p className="text-xs text-slate-500">
                    Erstelle Tools in der Toolbox und sie erscheinen hier automatisch
                  </p>
                </div>
              )}

              {showCoachingToolManager && (
                <div className="mt-4 p-4 bg-slate-800 rounded-lg space-y-4">
                  <div className="text-sm font-medium text-white mb-3">Manuelle Tool hinzufügen</div>
                  <div className="space-y-3">
                    <input
                      placeholder="Tool-Name"
                      value={newCoachingTool.name}
                      onChange={(e) => setNewCoachingTool(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 rounded text-sm"
                    />
                    <input
                      placeholder="Icon (Emoji)"
                      value={newCoachingTool.icon}
                      onChange={(e) => setNewCoachingTool(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 rounded text-sm"
                    />
                    <input
                      placeholder="Beschreibung"
                      value={newCoachingTool.description}
                      onChange={(e) => setNewCoachingTool(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 rounded text-sm"
                    />
                    <Button size="sm" onClick={addCoachingTool} className="w-full">
                      <Plus className="h-4 w-4 mr-2" /> Tool hinzufügen
                    </Button>
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <div className="text-sm font-medium text-white mb-3">Bestehende Tools verwalten</div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {coachingTools.sort((a, b) => a.order - b.order).map((tool, index) => (
                        <div key={tool.id} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-lg">{tool.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {tool.name}
                                {tool.toolboxTool && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    Toolbox
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">{tool.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => moveCoachingTool(tool.id, 'up')}
                              disabled={index === 0}
                              className="p-1 h-8 w-8"
                            >
                              ↑
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => moveCoachingTool(tool.id, 'down')}
                              disabled={index === coachingTools.length - 1}
                              className="p-1 h-8 w-8"
                            >
                              ↓
                            </Button>
                            {!tool.toolboxTool && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => removeCoachingTool(tool.id)}
                                className="p-1 h-8 w-8 text-red-400 hover:text-red-300"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachingRoom;