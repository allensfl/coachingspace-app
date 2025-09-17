import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Monitor,
  Loader2,
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  Eye,
  Package,
  BrainCircuit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStateContext } from '@/context/AppStateContext';

const CoacheeDisplay = () => {
  const { id } = useParams();
  const { state, actions } = useAppStateContext();
  const { getCoacheeById } = actions;
  
  const [coachee, setCoachee] = useState(null);
  const [currentTool, setCurrentTool] = useState(null);
  const [displayMode, setDisplayMode] = useState('welcome'); // welcome, tool, external
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    if (state.isLoading) return;
    
    const foundCoachee = getCoacheeById(id);
    if (foundCoachee) {
      setCoachee(foundCoachee);
    }

    // Listen for messages from parent window (CoachingRoom)
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'SHOW_TOOL') {
        const tool = event.data.tool;
        setCurrentTool(tool);
        
        if (tool.url && (tool.url.includes('miro') || tool.url.includes('jamboard') || tool.url.includes('figma'))) {
          setDisplayMode('external');
        } else {
          setDisplayMode('tool');
        }
      }
      
      if (event.data.type === 'RESET_DISPLAY') {
        setCurrentTool(null);
        setDisplayMode('welcome');
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Send ready message to parent
    if (window.opener) {
      window.opener.postMessage({ type: 'DISPLAY_READY' }, window.location.origin);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id, getCoacheeById, state.isLoading]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const resetDisplay = () => {
    setCurrentTool(null);
    setDisplayMode('welcome');
  };

  if (state.isLoading || !coachee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-slate-400">Coachee Display wird vorbereitet...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Coachee Display - {coachee.firstName} {coachee.lastName}</title>
      </Helmet>
      
      <div className="min-h-screen bg-slate-950 text-white relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-sm text-slate-400">
                {connectionStatus === 'connected' ? 'Verbunden' : 'Getrennt'}
              </span>
            </div>
            <div className="text-slate-400">
              Session mit <span className="text-white font-semibold">{coachee.firstName} {coachee.lastName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentTool && (
              <Button size="sm" variant="ghost" onClick={resetDisplay} className="text-slate-400 hover:text-white">
                <RotateCcw className="h-4 w-4 mr-2" />
                Zurücksetzen
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={toggleFullscreen} className="text-slate-400 hover:text-white">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Main Display Area */}
        <div className="p-6 h-[calc(100vh-80px)]">
          {displayMode === 'welcome' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Coachee Display</h1>
              <p className="text-xl text-slate-400 mb-8">
                Bereit für geteilte Inhalte von deinem Coach
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Tools</h3>
                    <p className="text-sm text-slate-400">Coaching-Tools und Arbeitsblätter</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <ExternalLink className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Externe Tools</h3>
                    <p className="text-sm text-slate-400">Miro, Jamboard, Figma</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardContent className="p-6 text-center">
                    <BrainCircuit className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">KI-Dialog</h3>
                    <p className="text-sm text-slate-400">Separates Fenster für KI-Chat</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 text-slate-500 text-sm">
                Warte auf geteilte Inhalte vom Coach...
              </div>
            </div>
          )}

          {displayMode === 'tool' && currentTool && (
            <Card className="glass-card h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Package className="mr-2 h-5 w-5 text-primary" />
                    {currentTool.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-primary border-primary/50">
                    {currentTool.category || 'Tool'}
                  </Badge>
                </div>
                {currentTool.description && (
                  <p className="text-slate-400 mt-2">{currentTool.description}</p>
                )}
              </CardHeader>
              <CardContent className="h-[calc(100%-120px)] overflow-hidden">
                <div className="w-full h-full bg-slate-800/30 rounded-lg p-6 border border-slate-600">
                  <div className="text-center">
                    <Package className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">{currentTool.name}</h3>
                    <p className="text-slate-400 mb-6">{currentTool.description || "Coaching-Tool wird präsentiert"}</p>
                    
                    {/* Tool-spezifische Inhalte */}
                    {currentTool.name === 'Skalenfrage' && (
                      <div className="space-y-4">
                        <div className="text-left bg-slate-700/50 rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">Anwendung:</h4>
                          <p className="text-slate-300 text-sm">Bewerte auf einer Skala von 1-10...</p>
                        </div>
                        <div className="flex justify-center">
                          <div className="flex space-x-2">
                            {[1,2,3,4,5,6,7,8,9,10].map(num => (
                              <div key={num} className="w-8 h-8 bg-primary/20 border border-primary/50 rounded flex items-center justify-center text-primary text-sm">
                                {num}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentTool.name === 'Ressourcen-Liste' && (
                      <div className="text-left bg-slate-700/50 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Sammle deine Ressourcen:</h4>
                        <div className="space-y-2 text-sm text-slate-300">
                          <div>• Persönliche Stärken</div>
                          <div>• Soziale Kontakte</div>
                          <div>• Materielle Ressourcen</div>
                          <div>• Erfahrungen & Wissen</div>
                        </div>
                      </div>
                    )}
                    
                    {currentTool.name === 'Lebensrad' && (
                      <div className="text-left bg-slate-700/50 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Lebensbereiche bewerten:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                          <div>• Karriere</div>
                          <div>• Beziehungen</div>
                          <div>• Gesundheit</div>
                          <div>• Finanzen</div>
                          <div>• Persönlichkeit</div>
                          <div>• Freizeit</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Button variant="outline" onClick={() => window.open(`/tool-presenter/${currentTool.id}`, '_blank')}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Vollversion öffnen
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {displayMode === 'external' && currentTool && (
            <Card className="glass-card h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <ExternalLink className="mr-2 h-5 w-5 text-primary" />
                    {currentTool.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-400 border-green-400/50">
                      Eingebettet
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => window.open(currentTool.url, '_blank')}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-100px)] overflow-hidden p-0">
                <iframe
                  src={currentTool.url}
                  className="w-full h-full border-0 rounded-lg"
                  title={currentTool.name}
                  allow="camera; microphone; fullscreen; display-capture"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Status Indicator */}
        {currentTool && (
          <div className="absolute bottom-4 right-4">
            <Card className="glass-card">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-slate-300">Aktiv: {currentTool.name}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default CoacheeDisplay;