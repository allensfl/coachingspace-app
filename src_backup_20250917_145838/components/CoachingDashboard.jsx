import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Eye, ExternalLink, Target, Globe, Settings } from 'lucide-react';

const CoachingDashboard = () => {
  const [sessionStatus, setSessionStatus] = useState('ready'); // ready, live, paused
  const [sessionTime, setSessionTime] = useState(0);
  const [coacheeDisplayWindow, setCoacheeDisplayWindow] = useState(null);
  
  // Mock-Daten
  const coachee = { firstName: 'Max', lastName: 'Mustermann', email: 'max@example.com' };
  
  const externalTools = [
    { name: 'Miro', url: 'https://miro.com/app/board/', description: 'Kollaboratives Whiteboard', icon: Globe },
    { name: 'CoSpaces', url: 'https://cospaces.io/edu/', description: 'VR/AR Umgebungen', icon: Globe },
    { name: 'Jamboard', url: 'https://jamboard.google.com/', description: 'Google Whiteboard', icon: Globe },
    { name: 'Figma', url: 'https://figma.com/', description: 'Design & Prototyping', icon: Globe }
  ];
  
  const coachingTools = [
    { id: 1, name: 'Skalenfrage', description: '1-10 Bewertungsskala', category: 'Bewertung', icon: Target },
    { id: 2, name: 'Lebensrad', description: 'Lebensbereiche bewerten', category: 'Selbstreflexion', icon: Target },
    { id: 3, name: 'Ressourcen-Liste', description: 'Stärken identifizieren', category: 'Stärken', icon: Target },
    { id: 4, name: 'SMART Ziele', description: 'Ziele strukturiert setzen', category: 'Planung', icon: Target }
  ];

  // Session Timer
  useEffect(() => {
    let interval;
    if (sessionStatus === 'live') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    console.log('🎯 Session starten');
    
    // CoacheeDisplay öffnen
    const displayWindow = window.open(
      '/coachee-display/test',
      'coacheeDisplay',
      'width=1200,height=800'
    );
    
    setCoacheeDisplayWindow(displayWindow);
    setSessionStatus('live');
    setSessionTime(0);
    
    console.log('✅ CoacheeDisplay geöffnet');
  };

  const pauseSession = () => {
    setSessionStatus(sessionStatus === 'paused' ? 'live' : 'paused');
  };

  const endSession = () => {
    setSessionStatus('ready');
    setSessionTime(0);
    
    if (coacheeDisplayWindow && !coacheeDisplayWindow.closed) {
      coacheeDisplayWindow.close();
    }
    setCoacheeDisplayWindow(null);
    
    console.log('Session beendet');
  };

  const presentTool = (tool) => {
    console.log('🎯 Präsentiere Tool:', tool.name);
    
    if (!coacheeDisplayWindow || coacheeDisplayWindow.closed) {
      alert('⚠️ CoacheeDisplay ist nicht geöffnet. Bitte starten Sie zuerst die Session.');
      return;
    }
    
    const message = {
      type: 'PRESENT_TOOL',
      tool: {
        ...tool,
        id: tool.id || tool.name.toLowerCase().replace(/\s+/g, '-'),
        isExternal: !!tool.url
      }
    };
    
    try {
      coacheeDisplayWindow.postMessage(message, '*');
      coacheeDisplayWindow.focus();
      
      // Visueller Erfolg
      const button = document.querySelector(`[data-tool="${tool.name}"]`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Gesendet!';
        button.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '';
        }, 1000);
      }
      
      console.log('✅ Tool erfolgreich gesendet');
      
    } catch (error) {
      console.error('❌ Fehler beim Senden:', error);
      alert('Fehler beim Präsentieren des Tools');
    }
  };

  const openToolDirect = (tool) => {
    if (tool.url) {
      window.open(tool.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Coaching Dashboard</h1>
              <p className="text-gray-600">Session mit {coachee.firstName} {coachee.lastName}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {sessionStatus === 'ready' && (
                <button
                  onClick={startSession}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium"
                >
                  <Play className="h-5 w-5" />
                  <span>Session starten</span>
                </button>
              )}
              
              {sessionStatus === 'live' && (
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Live • {formatTime(sessionTime)}
                  </div>
                  <button
                    onClick={pauseSession}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </button>
                  <button
                    onClick={endSession}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1"
                  >
                    <Square className="h-4 w-4" />
                    <span>Beenden</span>
                  </button>
                </div>
              )}
              
              {sessionStatus === 'paused' && (
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Pausiert • {formatTime(sessionTime)}
                  </div>
                  <button
                    onClick={pauseSession}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1"
                  >
                    <Play className="h-4 w-4" />
                    <span>Fortsetzen</span>
                  </button>
                  <button
                    onClick={endSession}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1"
                  >
                    <Square className="h-4 w-4" />
                    <span>Beenden</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fenster-Management */}
        {sessionStatus === 'live' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Fenster-Management</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => window.open('/coachee-display/test', 'display', 'width=1200,height=800')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>CoacheeDisplay</span>
              </button>
              <button
                onClick={() => window.open('/video-call/test', 'video', 'width=800,height=600')}
                className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Video-Call</span>
              </button>
            </div>
          </div>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Externe Tools */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <span>Externe Tools</span>
            </h2>
            
            <div className="space-y-3">
              {externalTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div key={tool.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-6 w-6 text-blue-500" />
                      <div>
                        <h3 className="font-medium text-gray-800">{tool.name}</h3>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        data-tool={tool.name}
                        onClick={() => presentTool(tool)}
                        disabled={sessionStatus !== 'live'}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          sessionStatus === 'live'
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Präsentieren
                      </button>
                      <button
                        onClick={() => openToolDirect(tool)}
                        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium"
                      >
                        Direkt öffnen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coaching Tools */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <span>Coaching-Tools</span>
            </h2>
            
            <div className="space-y-3">
              {coachingTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div key={tool.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-6 w-6 text-green-500" />
                      <div>
                        <h3 className="font-medium text-gray-800">{tool.name}</h3>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-1">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      data-tool={tool.name}
                      onClick={() => presentTool(tool)}
                      disabled={sessionStatus !== 'live'}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        sessionStatus === 'live'
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Präsentieren
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {sessionStatus === 'live' && (
          <div className="bg-gray-100 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Debug-Information</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Session Status: {sessionStatus}</p>
              <p>Session Zeit: {formatTime(sessionTime)}</p>
              <p>CoacheeDisplay: {coacheeDisplayWindow && !coacheeDisplayWindow.closed ? '✅ Offen' : '❌ Geschlossen'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachingDashboard;