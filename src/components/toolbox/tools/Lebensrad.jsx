import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Download, Plus, Trash2 } from 'lucide-react';

const Lebensrad = ({ onClose }) => {
  const [bereiche, setBereiche] = useState([
    { name: 'Karriere', wert: 5, farbe: '#3b82f6' },
    { name: 'Finanzen', wert: 5, farbe: '#10b981' },
    { name: 'Gesundheit', wert: 5, farbe: '#f59e0b' },
    { name: 'Beziehungen', wert: 5, farbe: '#ef4444' },
    { name: 'Familie', wert: 5, farbe: '#8b5cf6' },
    { name: 'Persönliche Entwicklung', wert: 5, farbe: '#ec4899' },
    { name: 'Freizeit', wert: 5, farbe: '#06b6d4' },
    { name: 'Spiritualität', wert: 5, farbe: '#84cc16' }
  ]);

  const [neuBereich, setNeuBereich] = useState({ name: '', farbe: '#3b82f6' });
  const [showAddBereich, setShowAddBereich] = useState(false);

  const bereichHinzufuegen = () => {
    if (neuBereich.name.trim()) {
      setBereiche([...bereiche, { ...neuBereich, wert: 5 }]);
      setNeuBereich({ name: '', farbe: '#3b82f6' });
      setShowAddBereich(false);
    }
  };

  const bereichLoeschen = (index) => {
    setBereiche(bereiche.filter((_, i) => i !== index));
  };

  const wertAendern = (index, neuerWert) => {
    const neueBereiche = [...bereiche];
    neueBereiche[index].wert = neuerWert;
    setBereiche(neueBereiche);
  };

  const durchschnitt = bereiche.length > 0 
    ? bereiche.reduce((sum, b) => sum + b.wert, 0) / bereiche.length 
    : 0;

  const balance = bereiche.length > 0
    ? 100 - (Math.max(...bereiche.map(b => b.wert)) - Math.min(...bereiche.map(b => b.wert))) * 10
    : 100;

  const handleExport = () => {
    const content = `
LEBENSRAD - SESSION EXPORT
==========================

Lebensbereiche und Bewertungen:
${bereiche.map((b, i) => `${i + 1}. ${b.name}: ${b.wert}/10`).join('\n')}

Durchschnittliche Zufriedenheit: ${durchschnitt.toFixed(1)}/10
Balance-Score: ${balance.toFixed(0)}%

${balance > 70 ? 'Sehr ausgewogenes Leben - die Bereiche sind gut balanced.' :
  balance > 50 ? 'Moderate Balance - einige Bereiche könnten mehr Aufmerksamkeit brauchen.' :
  'Unausgewogenes Leben - große Unterschiede zwischen den Bereichen.'}

Bereiche mit niedrigster Bewertung:
${bereiche.sort((a, b) => a.wert - b.wert).slice(0, 3).map((b, i) => `${i + 1}. ${b.name} (${b.wert}/10)`).join('\n')}

Generiert: ${new Date().toLocaleString('de-DE')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lebensrad-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // SVG Rad generieren
  const generateSpiderChart = () => {
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 150;
    const angleStep = (2 * Math.PI) / bereiche.length;
    
    // Hintergrund-Kreise (Raster)
    const backgroundCircles = [2, 4, 6, 8, 10].map(level => {
      const radius = (level / 10) * maxRadius;
      return (
        <circle
          key={`bg-${level}`}
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="1"
        />
      );
    });

    // Achsen (Speichen)
    const axes = bereiche.map((bereich, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      
      return (
        <line
          key={`axis-${i}`}
          x1={centerX}
          y1={centerY}
          x2={x}
          y2={y}
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="1"
        />
      );
    });

    // Datenpunkte und Polygon
    const points = bereiche.map((bereich, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const radius = (bereich.wert / 10) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return `${x},${y}`;
    }).join(' ');

    // Labels
    const labels = bereiche.map((bereich, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = maxRadius + 30;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      return (
        <g key={`label-${i}`}>
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgb(226, 232, 240)"
            fontSize="12"
            fontWeight="500"
          >
            {bereich.name}
          </text>
          <text
            x={x}
            y={y + 15}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={bereich.farbe}
            fontSize="14"
            fontWeight="bold"
          >
            {bereich.wert}/10
          </text>
        </g>
      );
    });

    return (
      <svg width="100%" height="500" viewBox="0 0 400 400" className="mx-auto">
        {backgroundCircles}
        {axes}
        
        {/* Datenfläche */}
        <polygon
          points={points}
          fill="rgba(99, 102, 241, 0.3)"
          stroke="rgb(99, 102, 241)"
          strokeWidth="2"
        />
        
        {/* Datenpunkte */}
        {bereiche.map((bereich, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const radius = (bereich.wert / 10) * maxRadius;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          return (
            <circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r="5"
              fill={bereich.farbe}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
        
        {labels}
      </svg>
    );
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-slate-900/95 border-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl">Lebensrad</CardTitle>
        <CardDescription>
          Visualisieren Sie verschiedene Lebensbereiche und deren Balance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Linke Spalte - Rad */}
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              {generateSpiderChart()}
            </div>
            
            {/* Statistiken */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {durchschnitt.toFixed(1)}
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Durchschnitt
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">
                  {balance.toFixed(0)}%
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Balance-Score
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Interpretation:</h4>
              <p className="text-sm text-slate-300">
                {balance > 70 
                  ? 'Sehr ausgewogenes Leben - die Bereiche sind gut balanced.' 
                  : balance > 50 
                  ? 'Moderate Balance - einige Bereiche könnten mehr Aufmerksamkeit brauchen.' 
                  : 'Unausgewogenes Leben - fokussieren Sie auf die schwächeren Bereiche.'}
              </p>
            </div>
          </div>

          {/* Rechte Spalte - Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Lebensbereiche</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddBereich(!showAddBereich)}
                className="border-slate-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Bereich
              </Button>
            </div>

            {showAddBereich && (
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <Input
                  placeholder="Bereichsname..."
                  value={neuBereich.name}
                  onChange={(e) => setNeuBereich({...neuBereich, name: e.target.value})}
                  className="bg-slate-900/50 border-slate-700"
                />
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={neuBereich.farbe}
                    onChange={(e) => setNeuBereich({...neuBereich, farbe: e.target.value})}
                    className="w-20 h-10 bg-slate-900/50 border-slate-700"
                  />
                  <Button onClick={bereichHinzufuegen} className="flex-1">
                    Hinzufügen
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddBereich(false)}
                    className="border-slate-700"
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {bereiche.map((bereich, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: bereich.farbe }}
                      />
                      <Label className="font-medium">{bereich.name}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold" style={{ color: bereich.farbe }}>
                        {bereich.wert}
                      </span>
                      {bereiche.length > 3 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => bereichLoeschen(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Slider
                    value={[bereich.wert]}
                    onValueChange={([value]) => wertAendern(index, value)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>1 - Sehr unzufrieden</span>
                    <span>10 - Sehr zufrieden</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-700"
          >
            Schließen
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportieren
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Lebensrad;