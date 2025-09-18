import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStateContext } from '@/context/AppStateContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Video, 
  Monitor, 
  ExternalLink,
  Plus,
  Settings,
  Trash2,
  Edit3,
  MessageSquare,
  Bot,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export default function CoachingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useAppStateContext();

  // States
  const [selectedProvider, setSelectedProvider] = useState('integriert');
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showProviderManager, setShowProviderManager] = useState(false);
  const [showCustomToolManager, setShowCustomToolManager] = useState(false);
  const [customTools, setCustomTools] = useState([]);
  const [newToolName, setNewToolName] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');

  // Konfigurierbare Video-Provider
  const [videoProviders, setVideoProviders] = useState([
    {
      id: 'zoom',
      name: 'Zoom',
      icon: Video,
      url: 'https://zoom.us/start/videomeeting',
      description: 'Zoom Meeting starten',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'google-meet',
      name: 'Google Meet',
      icon: Video,
      url: 'https://meet.google.com/new',
      description: 'Google Meet Meeting erstellen',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: Users,
      url: 'https://teams.microsoft.com/l/meetup-join/',
      description: 'Teams Meeting beitreten',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'integriert',
      name: 'Integriert',
      icon: Monitor,
      url: null,
      description: 'Browser-basiertes Video-System',
      color: 'bg-slate-600 hover:bg-slate-700'
    }
  ]);

  // Neuer Provider State
  const [newProvider, setNewProvider] = useState({
    name: '',
    url: '',
    description: ''
  });
  const [editingProvider, setEditingProvider] = useState(null);

  // Standard Display-Tools
  const standardDisplayTools = [
    { id: 'miro', name: 'Miro', url: 'https://miro.com/app/dashboard/' },
    { id: 'cospaces', name: 'CoSpaces', url: 'https://cospaces.io/edu/' },
    { id: 'jamboard', name: 'Jamboard', url: 'https://jamboard.google.com/' },
    { id: 'figma', name: 'Figma', url: 'https://www.figma.com/' }
  ];

  // Context Daten
  const session = context?.state?.sessions?.find(s => s.id === parseInt(id));
  const coachee = session ? context?.state?.coachees?.find(c => c.id === session.coacheeId) : null;
  const tools = context?.state?.tools || [];

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && sessionStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - sessionStartTime);
      }, 1000);
    } else if (!isTimerRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, sessionStartTime]);

  // Timer Funktionen
  const startSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    setIsTimerRunning(true);
  };

  const pauseSession = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetSession = () => {
    setSessionStartTime(null);
    setIsTimerRunning(false);
    setElapsedTime(0);
  };

  // Zeit formatieren
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  // Video-Provider Funktionen
  const addProvider = () => {
    if (newProvider.name && newProvider.url) {
      const provider = {
        id: `custom-${Date.now()}`,
        name: newProvider.name,
        icon: Video,
        url: newProvider.url,
        description: newProvider.description || `${newProvider.name} Meeting`,
        color: 'bg-indigo-600 hover:bg-indigo-700',
        custom: true
      };
      setVideoProviders([...videoProviders, provider]);
      setNewProvider({ name: '', url: '', description: '' });
    }
  };

  const editProvider = (provider) => {
    setEditingProvider(provider);
    setNewProvider({
      name: provider.name,
      url: provider.url || '',
      description: provider.description
    });
  };

  const updateProvider = () => {
    if (editingProvider && newProvider.name) {
      setVideoProviders(videoProviders.map(p => 
        p.id === editingProvider.id 
          ? { ...p, name: newProvider.name, url: newProvider.url, description: newProvider.description }
          : p
      ));
      setEditingProvider(null);
      setNewProvider({ name: '', url: '', description: '' });
    }
  };

  const deleteProvider = (providerId) => {
    setVideoProviders(videoProviders.filter(p => p.id !== providerId));
  };

  // Tool-Management
  const addCustomTool = () => {
    if (newToolName && newToolUrl) {
      const tool = {
        id: `custom-${Date.now()}`,
        name: newToolName,
        url: newToolUrl,
        custom: true
      };
      setCustomTools([...customTools, tool]);
      setNewToolName('');
      setNewToolUrl('');
    }
  };

  const removeCustomTool = (toolId) => {
    setCustomTools(customTools.filter(t => t.id !== toolId));
  };

  // Schnell-Notizen
  const addQuickNote = (type) => {
    const timestamp = new Date().toLocaleTimeString();
    const noteTemplates = {
      observation: `[${timestamp}] Beobachtung: `,
      insight: `[${timestamp}] Erkenntnis: `,
      action: `[${timestamp}] Aktion: `
    };
    
    const newNote = noteTemplates[type] || `[${timestamp}] Notiz: `;
    setSessionNotes(sessionNotes + newNote + '\n');
  };

  const startVideoCall = (provider) => {
    if (provider.url) {
      window.open(provider.url, '_blank', 'width=1200,height=800');
    }
    setSelectedProvider(provider.id);
  };

  const openDisplayTool = (tool) => {
    window.open(tool.url, '_blank', 'width=1200,height=800');
  };

  const presentCoachingTool = (tool) => {
    window.open(`/tool-presenter/${tool.id}`, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const shareAiDialog = () => {
    window.open('/ai-coaching/shared', '_blank', 'width=1000,height=700,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/sessions')}
              variant="outline" 
              size="sm"
              className="border-slate-600 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu Sessions
            </Button>
            <div>
              <h1 className="text-xl font-bold">Coaching Session</h1>
              <p className="text-slate-400 text-sm">
                {coachee?.name || 'Unbekannter Coachee'} • Session #{id}
              </p>
            </div>
          </div>
          
          {/* Session Timer */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-mono">
                {formatTime(elapsedTime)}
              </div>
              <div className="text-xs text-slate-400">Session-Zeit</div>
            </div>
            <div className="flex space-x-2">
              {!sessionStartTime ? (
                <Button onClick={startSession} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              ) : (
                <>
                  <Button onClick={pauseSession} size="sm" variant="outline" className="border-slate-600">
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button onClick={resetSession} size="sm" variant="outline" className="border-slate-600">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Video-Provider Auswahl */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Video className="w-5 h-5 mr-2" />
              Video-Provider wählen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {videoProviders.map((provider) => {
                const IconComponent = provider.icon;
                return (
                  <button
                    key={provider.id}
                    onClick={() => startVideoCall(provider)}
                    className={`p-4 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                      selectedProvider === provider.id 
                        ? 'border-blue-500 bg-slate-800/60' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <IconComponent className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-medium">{provider.name}</div>
                  </button>
                );
              })}
            </div>
            
            {/* Provider-Manager Toggle */}
            <div className="mt-4 flex justify-center">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowProviderManager(!showProviderManager)}
                className="border-slate-600 hover:bg-slate-800"
              >
                <Settings className="w-4 h-4 mr-2" />
                Provider verwalten
              </Button>
            </div>

            {/* Provider-Manager */}
            {showProviderManager && (
              <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                <h4 className="font-semibold mb-3">Provider verwalten</h4>
                
                {/* Neuer Provider / Provider bearbeiten */}
                <div className="space-y-2 mb-4">
                  <Input
                    placeholder="Provider Name"
                    value={newProvider.name}
                    onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Input
                    placeholder="Provider URL"
                    value={newProvider.url}
                    onChange={(e) => setNewProvider({...newProvider, url: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Input
                    placeholder="Beschreibung (optional)"
                    value={newProvider.description}
                    onChange={(e) => setNewProvider({...newProvider, description: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={editingProvider ? updateProvider : addProvider}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {editingProvider ? 'Aktualisieren' : 'Hinzufügen'}
                    </Button>
                    {editingProvider && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingProvider(null);
                          setNewProvider({ name: '', url: '', description: '' });
                        }}
                        className="border-slate-600"
                      >
                        Abbrechen
                      </Button>
                    )}
                  </div>
                </div>

                {/* Provider-Liste zum Bearbeiten */}
                <div className="space-y-2">
                  {videoProviders.filter(p => p.custom).map(provider => (
                    <div key={provider.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                      <span className="text-sm">{provider.name}</span>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => editProvider(provider)}
                          className="p-1 h-auto"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteProvider(provider.id)}
                          className="p-1 h-auto text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Display-Tools */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Monitor className="w-5 h-5 mr-2" />
              Display-Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Standard Tools */}
              {standardDisplayTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => openDisplayTool(tool)}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{tool.name}</span>
                    <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-70" />
                  </div>
                </button>
              ))}
              
              {/* Custom Tools */}
              {customTools.map((tool) => (
                <div key={tool.id} className="flex items-center space-x-2">
                  <button
                    onClick={() => openDisplayTool(tool)}
                    className="flex-1 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{tool.name}</span>
                      <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-70" />
                    </div>
                  </button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeCustomTool(tool.id)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Tool-Manager Toggle */}
            <div className="mt-4 flex justify-center">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowCustomToolManager(!showCustomToolManager)}
                className="border-slate-600 hover:bg-slate-800"
              >
                <Settings className="w-4 h-4 mr-2" />
                Tools verwalten
              </Button>
            </div>

            {/* Tool-Manager */}
            {showCustomToolManager && (
              <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                <h4 className="font-semibold mb-3">Custom Tools hinzufügen</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Tool Name"
                    value={newToolName}
                    onChange={(e) => setNewToolName(e.target.value)}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Input
                    placeholder="Tool URL"
                    value={newToolUrl}
                    onChange={(e) => setNewToolUrl(e.target.value)}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Button 
                    size="sm" 
                    onClick={addCustomTool}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tool hinzufügen
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session-Notizen */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="w-5 h-5 mr-2" />
              Live Session-Notizen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Schnell-Buttons */}
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                onClick={() => addQuickNote('observation')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Beobachtung
              </Button>
              <Button 
                size="sm" 
                onClick={() => addQuickNote('insight')}
                className="bg-green-600 hover:bg-green-700"
              >
                Erkenntnis
              </Button>
              <Button 
                size="sm" 
                onClick={() => addQuickNote('action')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Aktion
              </Button>
            </div>
            
            {/* Notizen-Textarea mit Coachee-Info */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400">
                Notizen für: {coachee?.name || 'Unbekannter Coachee'} • Session #{id}
              </div>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Session-Notizen werden automatisch gespeichert..."
                className="w-full h-40 p-3 bg-slate-800 border border-slate-600 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-slate-400">
                {sessionNotes ? `${sessionNotes.length} Zeichen • ` : ''}Automatisch gespeichert
              </div>
            </div>
            
            {/* KI-Dialog teilen */}
            <Button 
              onClick={shareAiDialog}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Bot className="w-4 h-4 mr-2" />
              KI-Dialog teilen
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Coaching-Tools aus der Toolbox */}
      {tools && tools.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Settings className="w-5 h-5 mr-2" />
                Coaching-Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    onClick={() => presentCoachingTool(tool)}
                    className="p-4 h-auto bg-slate-800 hover:bg-slate-700 border border-slate-600 flex flex-col items-center space-y-2"
                  >
                    <Settings className="w-6 h-6" />
                    <span className="text-sm font-medium">{tool.name}</span>
                    <span className="text-xs text-slate-400">Präsentieren</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}