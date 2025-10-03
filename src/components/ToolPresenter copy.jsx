import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStateContext } from '@/context/AppStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, AlertTriangle, Circle, Target, List, TreePine, Compass } from 'lucide-react';

// Temporäre Tool-Komponenten (bis echte Dateien erstellt werden)
const Lebensrad = () => (
  <div className="text-center p-8">
    <Circle className="w-16 h-16 mx-auto mb-4 text-blue-400" />
    <h2 className="text-2xl font-bold mb-4">Lebensrad</h2>
    <p className="text-slate-300 mb-6">Bewerte verschiedene Lebensbereiche auf einer Skala von 1-10.</p>
    <div className="bg-slate-800 p-6 rounded-lg">
      <p className="text-yellow-400">Tool-Komponente wird geladen...</p>
      <p className="text-sm text-slate-400 mt-2">Die interaktive Lebensrad-Komponente wird hier angezeigt.</p>
    </div>
  </div>
);

const Skalenfrage = () => (
  <div className="text-center p-8">
    <Target className="w-16 h-16 mx-auto mb-4 text-green-400" />
    <h2 className="text-2xl font-bold mb-4">Skalenfrage</h2>
    <p className="text-slate-300 mb-6">Bewerte deine aktuelle Situation auf einer Skala.</p>
    <div className="bg-slate-800 p-6 rounded-lg">
      <p className="text-yellow-400">Tool-Komponente wird geladen...</p>
      <p className="text-sm text-slate-400 mt-2">Die interaktive Skalenfrage-Komponente wird hier angezeigt.</p>
    </div>
  </div>
);

const RessourcenListe = () => (
  <div className="text-center p-8">
    <List className="w-16 h-16 mx-auto mb-4 text-purple-400" />
    <h2 className="text-2xl font-bold mb-4">Ressourcen-Liste</h2>
    <p className="text-slate-300 mb-6">Sammle deine verfügbaren Ressourcen und Stärken.</p>
    <div className="bg-slate-800 p-6 rounded-lg">
      <p className="text-yellow-400">Tool-Komponente wird geladen...</p>
      <p className="text-sm text-slate-400 mt-2">Die interaktive Ressourcen-Listen-Komponente wird hier angezeigt.</p>
    </div>
  </div>
);

const Zielbaum = () => (
  <div className="text-center p-8">
    <TreePine className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
    <h2 className="text-2xl font-bold mb-4">Zielbaum</h2>
    <p className="text-slate-300 mb-6">Visualisiere deine Ziele in einer Baumstruktur.</p>
    <div className="bg-slate-800 p-6 rounded-lg">
      <p className="text-yellow-400">Tool-Komponente wird geladen...</p>
      <p className="text-sm text-slate-400 mt-2">Die interaktive Zielbaum-Komponente wird hier angezeigt.</p>
    </div>
  </div>
);

const WerteKompass = () => (
  <div className="text-center p-8">
    <Compass className="w-16 h-16 mx-auto mb-4 text-orange-400" />
    <h2 className="text-2xl font-bold mb-4">Werte-Kompass</h2>
    <p className="text-slate-300 mb-6">Erkunde und definiere deine wichtigsten Werte.</p>
    <div className="bg-slate-800 p-6 rounded-lg">
      <p className="text-yellow-400">Tool-Komponente wird geladen...</p>
      <p className="text-sm text-slate-400 mt-2">Die interaktive Werte-Kompass-Komponente wird hier angezeigt.</p>
    </div>
  </div>
);

// Tool-Komponenten-Map für dynamisches Rendern
const TOOL_COMPONENTS = {
  1: Lebensrad,
  2: Skalenfrage, 
  3: RessourcenListe,
  4: Zielbaum,
  5: WerteKompass,
  'lebensrad': Lebensrad,
  'skalenfrage': Skalenfrage,
  'ressourcen-liste': RessourcenListe,
  'zielbaum': Zielbaum,
  'werte-kompass': WerteKompass,
};

export default function ToolPresenter() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const context = useAppStateContext();
  const [debugInfo, setDebugInfo] = useState(null);

  // Context und Tools sicher laden
  const tools = context?.state?.tools || [];
  const isContextAvailable = !!context;

  useEffect(() => {
    // Debug-Information sammeln
    const debug = {
      contextAvailable: isContextAvailable,
      toolId: toolId,
      toolIdType: typeof toolId,
      toolsCount: tools.length,
      toolIds: tools.map(t => ({ id: t.id, type: typeof t.id, name: t.name })),
      hasToolComponents: Object.keys(TOOL_COMPONENTS).length
    };
    
    setDebugInfo(debug);
    console.log('ToolPresenter Debug:', debug);
  }, [toolId, tools, isContextAvailable]);

  // Tool finden - Mehrfach-Suche für verschiedene ID-Typen
  const findTool = () => {
    if (!tools || tools.length === 0) return null;
    
    // Verschiedene ID-Matching-Strategien
    return tools.find(t => 
      String(t.id) === String(toolId) ||     // String-Vergleich
      t.id === parseInt(toolId) ||           // Number-Vergleich  
      t.id === toolId ||                     // Direkte Übereinstimmung
      t.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') === toolId  // Name-basierte Suche
    ) || null;
  };

  const tool = findTool();

  // Tool-Komponente finden
  const getToolComponent = () => {
    // Erst nach ID suchen
    if (TOOL_COMPONENTS[toolId]) {
      return TOOL_COMPONENTS[toolId];
    }
    
    // Dann nach numerischer ID
    if (TOOL_COMPONENTS[parseInt(toolId)]) {
      return TOOL_COMPONENTS[parseInt(toolId)];
    }
    
    // Als letztes über Tool-Name
    if (tool?.name) {
      const nameKey = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return TOOL_COMPONENTS[nameKey];
    }
    
    return null;
  };

  const ToolComponent = getToolComponent();

  // Fallback: Context-Problem
  if (!isContextAvailable) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => navigate('/coaching-room/' + (sessionStorage.getItem('currentSessionId') || '1'))}
            className="mb-6 bg-slate-800 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zum CoachingRoom
          </Button>
          
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Context-Problem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Der AppStateContext ist nicht verfügbar. ToolPresenter kann nicht auf die Toolbox zugreifen.
              </p>
              <div className="bg-slate-800 p-4 rounded-lg">
                <pre className="text-sm text-green-400">
{`Lösung:
1. Stelle sicher, dass ToolPresenter innerhalb des AppStateProvider läuft
2. Prüfe ob die Route korrekt konfiguriert ist
3. Context muss auf derselben Ebene wie CoachingRoom verfügbar sein`}
                </pre>
              </div>
              
              {/* Notfall-Tool-Auswahl */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Direkte Tool-Auswahl:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(TOOL_COMPONENTS).filter(([key]) => !isNaN(key)).map(([id, Component]) => (
                    <Button
                      key={id}
                      onClick={() => navigate(`/tool-presenter/${id}`)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Tool {id}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tool nicht gefunden
  if (!tool && !ToolComponent) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => navigate('/coaching-room/' + (sessionStorage.getItem('currentSessionId') || '1'))}
            className="mb-6 bg-slate-800 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zum CoachingRoom
          </Button>
          
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-yellow-400">Tool nicht gefunden</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Das Tool mit ID "{toolId}" konnte nicht gefunden werden.
              </p>
              
              {debugInfo && (
                <div className="bg-slate-800 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2 text-green-400">Debug-Info:</h4>
                  <pre className="text-sm text-slate-300">
{`Gesuchte ID: ${debugInfo.toolId}
Context verfügbar: ${debugInfo.contextAvailable}
Verfügbare Tools: ${debugInfo.toolsCount}
Tool-Komponenten: ${debugInfo.hasToolComponents}

Tool-IDs aus Context:
${debugInfo.toolIds.map(t => `* ID: ${t.id} (${t.type}) - ${t.name}`).join('\n')}

Verfügbare Tool-Komponenten:
${Object.keys(TOOL_COMPONENTS).map(id => `* ${id}`).join(', ')}`}
                  </pre>
                </div>
              )}
              
              {tools.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Verfügbare Tools:</h4>
                  {tools.map(t => (
                    <Button
                      key={t.id}
                      onClick={() => navigate(`/tool-presenter/${t.id}`)}
                      className="block w-full text-left bg-slate-800 hover:bg-slate-700 p-3"
                    >
                      {t.name} (ID: {t.id})
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tool erfolgreich gefunden und geladen
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/coaching-room/' + (sessionStorage.getItem('currentSessionId') || '1'))}
              className="bg-slate-800 hover:bg-slate-700"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum CoachingRoom
            </Button>
            <h1 className="text-xl font-bold">{tool?.name || `Tool ${toolId}`}</h1>
          </div>
          
          <Button 
            onClick={() => window.open(window.location.href, '_blank')}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            In neuem Tab öffnen
          </Button>
        </div>
      </div>

      {/* Tool-Inhalt */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {ToolComponent ? (
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
              <ToolComponent />
            </div>
          ) : (
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Tool wird geladen...</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Das Tool "{tool?.name || toolId}" wird vorbereitet.
                </p>
                {tool?.description && (
                  <p className="text-slate-400 mt-2">{tool.description}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Debug-Panel (nur in Development) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-xs p-3 rounded-lg border border-slate-600 max-w-sm">
          <details>
            <summary className="cursor-pointer font-semibold">Debug Info</summary>
            <pre className="mt-2 text-slate-300">
{JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}