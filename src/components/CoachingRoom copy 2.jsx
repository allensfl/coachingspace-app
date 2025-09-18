import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { 
  Video, 
  Mic, 
  PhoneMissed,
  Users,
  Wrench,
  BookOpen,
  FileText,
  ExternalLink,
  LogOut,
  Info,
  Package,
  Presentation,
  History,
  Calendar,
  Target,
  Trophy,
  CheckCircle,
  Loader2,
  BrainCircuit,
  ZoomIn,
  ClipboardCheck,
  Zap,
  Play,
  Monitor,
  Settings,
  Clock,
  Plus,
  Trash2,
  X,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { SessionStatus } from '@/types';
// import TaskManager from '@/components/TaskManager';  // Temporär deaktiviert
import { useAppStateContext } from '@/context/AppStateContext';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date)) return 'N/A';
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(date);
};

const RemoteToolIcon = ({ toolName }) => {
  const name = toolName.toLowerCase();
  if (name.includes('zoom')) {
    return <ZoomIn className="mr-2 h-4 w-4" />;
  }
  if (name.includes('google meet')) {
    return <LucideIcons.MessageSquare className="mr-2 h-4 w-4" />;
  }
  if (name.includes('teams')) {
    return <LucideIcons.Users className="mr-2 h-4 w-4" />;
  }
  return <ExternalLink className="mr-2 h-4 w-4" />;
};

export default function CoachingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, actions } = useAppStateContext();
  const { getCoacheeById } = actions;
  const { settings, tools } = state;
  
  // FIX: Safe fallback für remoteTools
  const remoteTools = settings?.remoteTools || [];
  const toolbox = tools || [];
  
  // Standard Video-Provider (sauber getrennt von Settings)
  const standardVideoProviders = [
    { name: 'Zoom', url: 'https://zoom.us/start/videomeeting', icon: 'ZoomIn' },
    { name: 'Google Meet', url: 'https://meet.google.com/new', icon: 'MessageSquare' },
    { name: 'Microsoft Teams', url: 'https://teams.microsoft.com', icon: 'Users' }
  ];
  
  // Display-Tools (getrennt von Video-Providern)
  const standardDisplayTools = [
    { name: 'Miro', url: 'https://miro.com/app/board/uXjVK-6-nts=/', icon: 'ExternalLink' },
    { name: 'CoSpaces', url: 'https://cospaces.io/edu/', icon: 'Cube' },
    { name: 'Jamboard', url: 'https://jamboard.google.com/', icon: 'PenTool' },
    { name: 'Figma', url: 'https://figma.com', icon: 'Figma' }
  ];
  
  const [coachee, setCoachee] = useState(null);
  const [videoWindowOpen, setVideoWindowOpen] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [showProviderSelect, setShowProviderSelect] = useState(false);
  const [showToolManager, setShowToolManager] = useState(false);
  const [customDisplayTools, setCustomDisplayTools] = useState([]);
  const [newToolName, setNewToolName] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');

  useEffect(() => {
    if (state.isLoading) return;
    const foundCoachee = getCoacheeById(id);
    if (foundCoachee) {
      setCoachee(foundCoachee);
    } else {
      toast({
        title: 'Fehler',
        description: 'Coachee für diese Session konnte nicht gefunden werden.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [id, getCoacheeById, navigate, toast, state.isLoading]);

  const handleStartVideoCall = () => {
    setShowProviderSelect(true);
  };

  const handleProviderSelect = (provider) => {
    // FIX: Null-check für provider
    if (!provider) {
      console.error('Provider is null or undefined');
      return;
    }

    // Starte Video-Call je nach Provider
    if (provider.url) {
      // Externe Provider (Zoom, Google Meet) - öffne deren URL
      window.open(provider.url, '_blank', 'noopener,noreferrer');
      toast({
        title: `${provider.name} gestartet`,
        description: 'Der externe Video-Service wurde geöffnet.',
      });
    } else {
      // Integrierter Video-Call - öffne Coachee Display
      try {
        const displayWindow = window.open(
          `/coachee-display/${id}`, 
          'coacheeDisplay',
          'width=1200,height=800,resizable=yes,scrollbars=yes,menubar=no,toolbar=yes,location=yes'
        );
        
        if (displayWindow) {
          setVideoWindowOpen(true);
          toast({
            title: 'Coachee Display geöffnet',
            description: 'Das Display-Fenster für Video und geteilte Inhalte wurde gestartet.',
          });
        } else {
          toast({
            title: 'Popup wurde blockiert',
            description: 'Bitte erlaube Popups für diese Seite in deinen Browser-Einstellungen.',
            variant: 'destructive',
          });
          return;
        }
      } catch (error) {
        toast({
          title: 'Fehler beim Öffnen',
          description: 'Das Display-Fenster konnte nicht geöffnet werden. Bitte prüfe deine Browser-Einstellungen.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Session als gestartet markieren
    setSessionStarted(true);
    setSessionStartTime(new Date());
    setShowProviderSelect(false);
  };

  const handleShareAiDialog = () => {
    window.open('/ai-coaching/shared', '_blank', 'width=800,height=600,resizable=yes,scrollbars=yes');
    toast({ title: 'Freigabe-Fenster geöffnet', description: 'Das Fenster für den Coachee ist bereit.' });
  };

  const addCustomTool = () => {
    if (newToolName.trim() && newToolUrl.trim()) {
      const newTool = {
        id: Date.now(),
        name: newToolName.trim(),
        url: newToolUrl.trim(),
        icon: 'ExternalLink'
      };
      setCustomDisplayTools(prev => [...prev, newTool]);
      setNewToolName('');
      setNewToolUrl('');
    }
  };

  const removeCustomTool = (toolId) => {
    setCustomDisplayTools(prev => prev.filter(tool => tool.id !== toolId));
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return '00:00';
    const now = new Date();
    const diff = now - sessionStartTime;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (state.isLoading || !coachee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-slate-400">Coaching Raum wird vorbereitet...</p>
      </div>
    );
  }

  const handleToolClick = (tool) => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
    toast({
        title: `Öffne ${tool.name}`,
        description: `Das Tool wird in einem neuen Tab geöffnet.`
    });
  };

  const handlePresentTool = (tool) => {
    console.log('Presenting tool:', tool);
    
    // Unterscheidung zwischen Display-Tools und Coaching-Tools
    const isDisplayTool = standardDisplayTools.some(t => t.name === tool.name) || 
                         customDisplayTools.some(t => t.id === tool.id);
    
    if (isDisplayTool) {
      // Display-Tools: Versuche Display-Fenster, sonst direkte URL
      if (videoWindowOpen) {
        try {
          const displayWindow = window.open('', 'coacheeDisplay');
          if (displayWindow && !displayWindow.closed) {
            displayWindow.postMessage({
              type: 'SHOW_TOOL',
              tool: tool
            }, window.location.origin);
            
            toast({
              title: `${tool.name} wird präsentiert`,
              description: 'Das Tool wird im Display-Fenster angezeigt.',
            });
            return;
          }
        } catch (e) {
          console.error('PostMessage failed:', e);
        }
      }
      
      // Fallback: Display-Tool direkt öffnen
      window.open(tool.url, '_blank', 'width=1200,height=800,resizable=yes');
      toast({
        title: `${tool.name} geöffnet`,
        description: 'Das Tool wurde in einem separaten Fenster geöffnet.',
      });
    } else {
      // Coaching-Tools: Tool-Presenter verwenden
      if (tool.id) {
        navigate(`/tool-presenter/${tool.id}`);
        toast({
          title: `Präsentiere: ${tool.name}`,
          description: 'Tool wird im Präsentationsmodus geöffnet.'
        });
      } else {
        toast({
          title: 'Fehler',
          description: 'Tool-ID nicht gefunden.',
          variant: 'destructive'
        });
      }
    }
  };

  // FIX: Safe fallbacks für alle Array-Operationen
  const previousSessions = (coachee.sessions || []).filter(s => s.status === SessionStatus.COMPLETED);
  const openGoals = (coachee.goals || []).filter(g => g.subGoals && g.subGoals.some(sg => !sg.completed));
  const usedTools = toolbox.filter(t => t.usageHistory && t.usageHistory.some(h => h.coachee === `${coachee.firstName} ${coachee.lastName}`));

  return (
    <>
      <Helmet>
        <title>Coaching Session - {coachee.firstName} {coachee.lastName} - Coachingspace</title>
        <meta name="description" content={`Session-Management für ${coachee.firstName} ${coachee.lastName}.`} />
      </Helmet>
      
      <div className="min-h-screen bg-slate-950 text-white p-6">
        {/* Session Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Session Management</h1>
              <p className="text-slate-400">Coaching mit <span className="text-primary font-semibold">{coachee.firstName} {coachee.lastName}</span></p>
            </div>
            <div className="flex items-center gap-4">
              {sessionStarted && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Clock className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-mono text-sm">{getSessionDuration()}</span>
                </div>
              )}
              <Link to={`/coachees/${coachee.id}`}>
                <Button variant="outline" className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  Session beenden
                </Button>
              </Link>
            </div>
          </div>

          {/* Video Call Control */}
          {!sessionStarted ? (
            <Card className="glass-card bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <CardContent className="p-6">
                {!showProviderSelect ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Video-Call starten</h3>
                      <p className="text-slate-400">Wähle deinen Video-Provider und beginne die Session mit {coachee.firstName}</p>
                    </div>
                    <Button size="lg" className="bg-primary hover:bg-primary/80 text-white px-8" onClick={handleStartVideoCall}>
                      <Monitor className="mr-2 h-5 w-5" />
                      Provider wählen
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Video-Provider wählen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Standard Video-Provider (einfach und crash-sicher) */}
                      {standardVideoProviders.map((provider, index) => (
                        <Button 
                          key={index}
                          variant="outline" 
                          className="h-16 flex flex-col items-center justify-center bg-slate-800/50 hover:bg-slate-700/50 border-slate-600"
                          onClick={() => handleProviderSelect(provider)}
                        >
                          <RemoteToolIcon toolName={provider.name} />
                          <span className="mt-1 text-sm">{provider.name}</span>
                        </Button>
                      ))}
                      
                      {/* Integrierter Video-Call */}
                      <Button 
                        variant="outline" 
                        className="h-16 flex flex-col items-center justify-center bg-primary/10 hover:bg-primary/20 border-primary/50"
                        onClick={() => handleProviderSelect({ name: 'Integriert', url: null })}
                      >
                        <Monitor className="h-6 w-6 mb-1" />
                        <span className="text-sm">Integriert</span>
                      </Button>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowProviderSelect(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card bg-green-500/5 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold">Video-Call aktiv</span>
                    <span className="text-slate-400">- Session läuft seit {getSessionDuration()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      try {
                        window.open(`/coachee-display/${id}`, 'coacheeDisplay', 'width=1200,height=800,resizable=yes');
                      } catch (e) {
                        toast({ title: 'Popup blockiert', description: 'Bitte erlaube Popups und versuche es erneut.', variant: 'destructive' });
                      }
                    }}>
                      <Monitor className="mr-2 h-4 w-4" />
                      Display öffnen
                    </Button>
                    <Button size="sm" variant="outline" className="text-orange-400 border-orange-400/50">
                      <Settings className="mr-2 h-4 w-4" />
                      Einstellungen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          
          {/* Left Column - Session Control */}
          <div className="xl:col-span-1">
            <Tabs defaultValue="info" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="history">Verlauf</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="flex-1 overflow-y-auto mt-4 space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Users className="mr-2 h-5 w-5" /> Teilnehmer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="font-bold">C</span>
                      </div>
                      <p className="font-medium">Coach (Du)</p>
                      <Badge variant="outline" className="ml-auto text-green-400 border-green-400/50">Host</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                        <span className="font-bold">{coachee.firstName[0]}{coachee.lastName[0]}</span>
                      </div>
                      <p className="font-medium">{coachee.firstName} {coachee.lastName}</p>
                      {sessionStarted && <Badge variant="outline" className="text-green-400 border-green-400/50">Online</Badge>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileText className="mr-2 h-5 w-5" /> Coachee-Kontext
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-300 mb-1">Vertrauliche Notizen</h4>
                      <p className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded-md">
                        {coachee.confidentialNotes || "Keine vertraulichen Notizen vorhanden."}
                      </p>
                    </div>
                    {coachee.quickNotes && coachee.quickNotes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-300 mb-2">Schnellnotizen</h4>
                        <div className="flex flex-wrap gap-2">
                          {coachee.quickNotes.map((note, index) => (
                            <Badge key={index} variant="secondary">{note}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tools" className="flex-1 overflow-y-auto mt-4 space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <Wrench className="mr-2 h-5 w-5" /> Display-Tools
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowToolManager(true)}
                        className="text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Verwalten
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-slate-400 mb-3">Tools für das Display-Fenster des Coachees</p>
                    
                    {/* Standard Display-Tools */}
                    {standardDisplayTools.map((tool, index) => (
                      <div key={`standard-${index}`} className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 justify-start" onClick={() => handleToolClick(tool)}>
                          <RemoteToolIcon toolName={tool.name} />
                          {tool.name}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-primary border-primary/50 hover:bg-primary/10"
                          onClick={() => handlePresentTool(tool)}
                        >
                          <Presentation className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {/* Custom Display-Tools */}
                    {customDisplayTools.map((tool) => (
                      <div key={tool.id} className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 justify-start bg-blue-800/20 border-blue-600/50 text-blue-200" 
                          onClick={() => handleToolClick(tool)}
                        >
                          <RemoteToolIcon toolName={tool.name} />
                          {tool.name}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-primary border-primary/50 hover:bg-primary/10"
                          onClick={() => handlePresentTool(tool)}
                        >
                          <Presentation className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                          onClick={() => removeCustomTool(tool.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {customDisplayTools.length === 0 && (
                      <p className="text-xs text-slate-500 mt-2">Keine benutzerdefinierten Tools. Klicke "Verwalten" zum Hinzufügen.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BrainCircuit className="mr-2 h-5 w-5" /> KI-Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={handleShareAiDialog}>
                      <ExternalLink className="mr-2 h-4 w-4" /> KI-Dialog teilen
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Package className="mr-2 h-5 w-5" /> Coaching-Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {toolbox.filter(t => t.status === 'active').map(tool => { 
                      const Icon = LucideIcons[tool.icon] || Package; 
                      return (
                        <Card key={tool.id} className="glass-card hover:bg-slate-800/50 transition-colors">
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-semibold text-white text-sm">{tool.name}</p>
                                <p className="text-xs text-slate-400">{tool.category}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handlePresentTool(tool)} className="text-primary border-primary/50 hover:bg-primary/10">
                              <Presentation className="h-4 w-4 mr-1" />
                              Präsentieren
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                    {toolbox.filter(t => t.status === 'active').length === 0 && (
                      <p className="text-sm text-slate-400 text-center py-2">Keine aktiven Tools verfügbar.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="flex-1 overflow-y-auto mt-4 space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="mr-2 h-5 w-5" /> Aktuelle Ziele
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {openGoals.length > 0 ? 
                      openGoals.slice(0, 2).map(g => (
                        <div key={g.id}>
                          <p className="text-slate-300 font-semibold">{g.title}</p>
                          <ul className="list-disc list-inside pl-2 text-slate-400">
                            {(g.subGoals || []).filter(sg => !sg.completed).slice(0, 2).map(sg => 
                              <li key={sg.id}>{sg.title}</li>
                            )}
                          </ul>
                        </div>
                      )) : 
                      <p className="text-slate-500">Keine offenen Ziele.</p>
                    }
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Calendar className="mr-2 h-5 w-5" /> Letzte Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {previousSessions.slice(0, 3).map(s => (
                      <div key={s.id} className="flex justify-between items-center">
                        <p className="text-slate-300 truncate">{s.topic}</p>
                        <p className="text-slate-500">{formatDate(s.date)}</p>
                      </div>
                    ))}
                    {previousSessions.length === 0 && (
                      <p className="text-slate-500">Keine vorherigen Sessions.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Center + Right Columns - Live Notizen */}
          <div className="xl:col-span-2">
            <Card className="glass-card h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                    Live Session-Notizen
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date().toLocaleDateString('de-DE')} - {coachee.firstName} {coachee.lastName}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
                {/* Kompakte Schnell-Buttons */}
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10"
                    onClick={() => {
                      const timestamp = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                      const textarea = document.getElementById('live-notes-textarea');
                      const newNote = `[${timestamp}] 👁️ BEOBACHTUNG: `;
                      textarea.value += (textarea.value ? '\n\n' : '') + newNote;
                      textarea.focus();
                      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                    }}
                  >
                    👁️ Beobachtung
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10"
                    onClick={() => {
                      const timestamp = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                      const textarea = document.getElementById('live-notes-textarea');
                      const newNote = `[${timestamp}] 💡 ERKENNTNIS: `;
                      textarea.value += (textarea.value ? '\n\n' : '') + newNote;
                      textarea.focus();
                      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                    }}
                  >
                    💡 Erkenntnis
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-green-400 border-green-400/50 hover:bg-green-400/10"
                    onClick={() => {
                      const timestamp = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                      const textarea = document.getElementById('live-notes-textarea');
                      const newNote = `[${timestamp}] ✅ AKTION: `;
                      textarea.value += (textarea.value ? '\n\n' : '') + newNote;
                      textarea.focus();
                      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                    }}
                  >
                    ✅ Aktion
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-purple-400 border-purple-400/50 hover:bg-purple-400/10 ml-auto"
                    onClick={() => {
                      const timestamp = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                      const textarea = document.getElementById('live-notes-textarea');
                      const newNote = `\n--- PAUSE [${timestamp}] ---\n`;
                      textarea.value += newNote;
                    }}
                  >
                    ⏸️ Pause
                  </Button>
                </div>
                
                {/* Großes Live-Notizen Textarea */}
                <textarea 
                  id="live-notes-textarea"
                  className="w-full flex-1 bg-slate-800/30 border border-slate-600 rounded-lg p-6 text-base text-slate-300 focus:ring-2 focus:ring-primary focus:border-primary font-mono leading-relaxed resize-none"
                  placeholder={`Session-Notizen für ${coachee.firstName} ${coachee.lastName}
${new Date().toLocaleDateString('de-DE')} - ${new Date().toLocaleTimeString('de-DE')}

💡 Nutze die Buttons für strukturierte Einträge:
👁️ Beobachtung - Was fällt dir auf?
💡 Erkenntnis - Aha-Momente und Durchbrüche
✅ Aktion - Vereinbarte nächste Schritte
⏸️ Pause - Abschnitte markieren

Deine Live-Notizen hier...`}
                ></textarea>
                
                {/* Session Status */}
                <div className="flex justify-between items-center text-sm text-slate-500 pt-2 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    {sessionStarted ? (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Live Session aktiv</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                        <span>Session vorbereitet</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <span>Dauer: {getSessionDuration()}</span>
                    <span>Autosave aktiv</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Tool Manager Modal */}
        {showToolManager && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Display-Tools verwalten
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowToolManager(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Neues Tool hinzufügen */}
                <div className="p-4 bg-slate-800/30 rounded-lg">
                  <h3 className="text-white font-semibold mb-3">Neues Tool hinzufügen</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Tool-Name</label>
                      <Input
                        placeholder="z.B. Padlet, Canva, Mentimeter..."
                        value={newToolName}
                        onChange={(e) => setNewToolName(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Tool-URL</label>
                      <Input
                        placeholder="https://padlet.com/..."
                        value={newToolUrl}
                        onChange={(e) => setNewToolUrl(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <Button 
                      onClick={addCustomTool}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={!newToolName.trim() || !newToolUrl.trim()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tool hinzufügen
                    </Button>
                  </div>
                </div>
                
                {/* Standard-Tools */}
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    Standard-Tools
                  </h3>
                  <div className="space-y-2">
                    {standardDisplayTools.map((tool, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <RemoteToolIcon toolName={tool.name} />
                          <div>
                            <div className="text-white font-medium">{tool.name}</div>
                            <div className="text-xs text-slate-400">{tool.url}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-slate-400">Standard</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Benutzerdefinierte Tools */}
                {customDisplayTools.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Benutzerdefinierte Tools
                    </h3>
                    <div className="space-y-2">
                      {customDisplayTools.map((tool) => (
                        <div key={tool.id} className="flex items-center justify-between p-3 bg-blue-800/20 rounded-lg border border-blue-600/30">
                          <div className="flex items-center gap-3">
                            <RemoteToolIcon toolName={tool.name} />
                            <div>
                              <div className="text-blue-200 font-medium">{tool.name}</div>
                              <div className="text-xs text-blue-300/70">{tool.url}</div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeCustomTool(tool.id)}
                            className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Hinweise */}
                <div className="text-xs text-slate-400 bg-slate-800/20 p-3 rounded-lg">
                  <div className="font-medium text-slate-300 mb-1">Hinweise:</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>"Öffnen" öffnet das Tool in einem neuen Tab für dich</li>
                    <li>"Präsentieren" zeigt das Tool im Display-Fenster für den Coachee</li>
                    <li>Standard-Tools können nicht bearbeitet werden, du kannst aber eigene Versionen erstellen</li>
                    <li>Benutzerdefinierte Tools werden nur für diese Session gespeichert</li>
                  </ul>
                </div>
                
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}