import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppStateContext } from '@/context/AppStateContext';

const WheelOfLife = () => {
  const segments = [
    { name: 'Karriere', color: '#3b82f6', value: 8 },
    { name: 'Finanzen', color: '#10b981', value: 6 },
    { name: 'Gesundheit', color: '#ef4444', value: 7 },
    { name: 'Familie & Freunde', color: '#f97316', value: 9 },
    { name: 'Liebe & Partnerschaft', color: '#ec4899', value: 8 },
    { name: 'Persönl. Wachstum', color: '#8b5cf6', value: 7 },
    { name: 'Freizeit & Spaß', color: '#f59e0b', value: 5 },
    { name: 'Umgebung', color: '#14b8a6', value: 8 },
  ];
  const size = 400;
  const center = size / 2;
  const radius = size / 2 - 20;

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((segment, i) => {
          const angle = (i / segments.length) * 2 * Math.PI;
          const nextAngle = ((i + 1) / segments.length) * 2 * Math.PI;
          const x1 = center + Math.cos(angle) * radius * (segment.value / 10);
          const y1 = center + Math.sin(angle) * radius * (segment.value / 10);
          const x2 = center + Math.cos(nextAngle) * radius * (segment.value / 10);
          const y2 = center + Math.sin(nextAngle) * radius * (segment.value / 10);
          
          const textAngle = angle + (nextAngle - angle) / 2;
          const textX = center + Math.cos(textAngle) * (radius + 10);
          const textY = center + Math.sin(textAngle) * (radius + 10);

          return (
            <g key={segment.name}>
              <path d={`M ${center},${center} L ${x1},${y1} A ${radius * (segment.value / 10)},${radius * (segment.value / 10)} 0 0,1 ${x2},${y2} Z`} fill={segment.color} fillOpacity="0.7" />
              <text x={textX} y={textY} textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize="12">{segment.name}</text>
            </g>
          );
        })}
        {[...Array(10)].map((_, i) => (
          <circle key={i} cx={center} cy={center} r={(radius / 10) * (i + 1)} fill="none" stroke="rgba(255,255,255,0.1)" />
        ))}
      </svg>
    </div>
  );
};

const ScalingQuestion = () => {
  const [value, setValue] = useState([5]);
  return (
    <div className="w-full max-w-md mx-auto p-8">
      <h3 className="text-xl text-center text-white mb-4">Auf einer Skala von 1 bis 10...</h3>
      <Slider defaultValue={value} onValueChange={setValue} max={10} step={1} />
      <div className="text-center text-6xl font-bold text-white mt-6">{value[0]}</div>
    </div>
  );
};

const ResourceList = () => {
  const [items, setItems] = useState(['Unterstützende Familie', 'Gute Ausbildung', 'Starkes Netzwerk']);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="bg-slate-800 p-3 rounded-md text-white">{item}</li>
        ))}
      </ul>
      <div className="flex gap-2 mt-4">
        <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Neue Ressource..." className="bg-slate-700 border-slate-600 text-white" />
        <Button onClick={handleAddItem}>Hinzufügen</Button>
      </div>
    </div>
  );
};

const GoalTree = () => {
  return (
    <div className="text-white p-4 text-center">
      <div className="p-4 bg-blue-600 rounded-lg inline-block mb-4">Hauptziel</div>
      <div className="flex justify-center gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-px h-8 bg-slate-600"></div>
            <div className="p-3 bg-green-600 rounded-lg">Teilziel {i+1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const toolComponentMap = {
  'Lebensrad': WheelOfLife,
  'Skalenfrage': ScalingQuestion,
  'Ressourcen-Liste': ResourceList,
  'Zielbaum': GoalTree,
};

export default function ToolPresenter() {
  const { id } = useParams();
  const { state } = useAppStateContext();
  const { tools } = state;
  const tool = tools.find(t => t.id === parseInt(id));
  const [isFullScreen, setIsFullScreen] = useState(!!document.fullscreenElement);

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

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-slate-800">
        <h2 className="text-2xl font-bold mb-4">Tool nicht gefunden</h2>
        <Link to="/toolbox"><Button>Zurück zur Toolbox</Button></Link>
      </div>
    );
  }

  const ToolComponent = toolComponentMap[tool.name];

  return (
    <>
      <Helmet>
        <title>Präsentation: {tool.name} - Coachingspace</title>
        <meta name="description" content={`Präsentationsmodus für das Tool ${tool.name}.`} />
      </Helmet>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-slate-950 flex flex-col p-4"
      >
        <header className="flex items-center justify-between text-white mb-4 flex-shrink-0">
          <h1 className="text-xl font-bold">{tool.name}</h1>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
                    {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullScreen ? 'Vollbild verlassen' : 'Vollbild'}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/toolbox">
                    <Button variant="ghost" size="icon"><X className="h-5 w-5" /></Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Präsentation schließen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>
        <main className="flex-grow bg-white rounded-lg flex items-center justify-center overflow-auto">
          <Card className="w-full h-full max-w-4xl max-h-full bg-slate-900 border-none shadow-none flex flex-col">
            <CardHeader>
              <CardTitle className="text-white text-center">{tool.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              {ToolComponent ? <ToolComponent /> : <p className="text-slate-400">Für dieses Tool ist keine interaktive Komponente verfügbar.</p>}
            </CardContent>
          </Card>
        </main>
      </motion.div>
    </>
  );
}