import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Download, RotateCcw, Edit2 } from 'lucide-react';

const LebensradTool = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Karriere', value: 5, color: '#3B82F6' },
    { id: 2, name: 'Finanzen', value: 5, color: '#10B981' },
    { id: 3, name: 'Gesundheit', value: 5, color: '#EF4444' },
    { id: 4, name: 'Familie', value: 5, color: '#F59E0B' },
    { id: 5, name: 'Beziehungen', value: 5, color: '#8B5CF6' },
    { id: 6, name: 'Persönliche Entwicklung', value: 5, color: '#EC4899' },
    { id: 7, name: 'Freizeit', value: 5, color: '#06B6D4' },
    { id: 8, name: 'Spiritualität', value: 5, color: '#84CC16' }
  ]);
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState('');

  const updateCategory = (id, value) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, value } : cat
    ));
  };

  const updateCategoryName = (id, name) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name } : cat
    ));
  };

  const calculateBalance = () => {
    const values = categories.map(c => c.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const balanceScore = Math.max(0, 100 - (stdDev * 15));
    return Math.round(balanceScore);
  };

  const exportData = () => {
    const exportText = `
LEBENSRAD ANALYSE
=================
Datum: ${new Date().toLocaleDateString('de-DE')}

BEREICHE:
${categories.map(cat => `${cat.name}: ${cat.value}/10`).join('\n')}

Balance-Score: ${calculateBalance()}/100

NOTIZEN:
${notes}
    `.trim();

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lebensrad_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const reset = () => {
    if (confirm('Möchten Sie wirklich alle Werte zurücksetzen?')) {
      setCategories(categories.map(cat => ({ ...cat, value: 5 })));
      setNotes('');
    }
  };

  // SVG Spinnendiagramm Generator
  const generateWheel = () => {
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 150;
    const angleStep = (2 * Math.PI) / categories.length;

    // Berechne Punkte für das Polygon (die Werte verbinden)
    const polygonPoints = categories.map((cat, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const radius = (maxRadius * cat.value) / 10;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="400" height="450" viewBox="0 0 400 450" className="mx-auto">
        {/* Konzentrische Kreise für die Skala */}
        {[2, 4, 6, 8, 10].map((level) => (
          <g key={level}>
            <circle
              cx={centerX}
              cy={centerY}
              r={(maxRadius * level) / 10}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
              opacity="0.3"
            />
            {/* Wert-Labels an den Kreisen */}
            {level % 2 === 0 && (
              <text
                x={centerX + 5}
                y={centerY - (maxRadius * level) / 10 + 4}
                fill="#64748b"
                fontSize="10"
                opacity="0.7"
              >
                {level}
              </text>
            )}
          </g>
        ))}

        {/* Achsen vom Zentrum zu jedem Lebensbereich */}
        {categories.map((cat, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const endX = centerX + Math.cos(angle) * maxRadius;
          const endY = centerY + Math.sin(angle) * maxRadius;
          
          // Label Position (weiter außen)
          const labelRadius = maxRadius + 40;
          const labelX = centerX + Math.cos(angle) * labelRadius;
          const labelY = centerY + Math.sin(angle) * labelRadius;

          return (
            <g key={cat.id}>
              {/* Achsenlinie */}
              <line
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke="#475569"
                strokeWidth="1"
                opacity="0.5"
              />
              
              {/* Kategorie Label */}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
                fontWeight="500"
              >
                {cat.name}
              </text>

              {/* Wert auf der Achse */}
              <circle
                cx={centerX + Math.cos(angle) * (maxRadius * cat.value / 10)}
                cy={centerY + Math.sin(angle) * (maxRadius * cat.value / 10)}
                r="4"
                fill={cat.color}
                stroke="white"
                strokeWidth="2"
              />
              
              {/* Wert-Text */}
              <text
                x={centerX + Math.cos(angle) * (maxRadius * cat.value / 10 + 15)}
                y={centerY + Math.sin(angle) * (maxRadius * cat.value / 10)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={cat.color}
                fontSize="13"
                fontWeight="bold"
              >
                {cat.value}
              </text>
            </g>
          );
        })}

        {/* Ausgefülltes Polygon für die aktuellen Werte */}
        <polygon
          points={polygonPoints}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Zentrum Punkt */}
        <circle cx={centerX} cy={centerY} r="5" fill="#1e293b" stroke="white" strokeWidth="2" />
      </svg>
    );
  };

  const balanceScore = calculateBalance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⚖️ Lebensrad (Wheel of Life)</h1>
          <p className="text-slate-400">Ganzheitliche Bewertung Ihrer Lebensbereiche</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wheel Visualization */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Visualisierung</CardTitle>
                <Badge 
                  variant="outline" 
                  className={`${
                    balanceScore >= 80 ? 'border-green-500 text-green-400' :
                    balanceScore >= 60 ? 'border-yellow-500 text-yellow-400' :
                    'border-orange-500 text-orange-400'
                  }`}
                >
                  Balance: {balanceScore}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {generateWheel()}
              
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-400">
                  {balanceScore >= 80 ? '✨ Sehr ausgewogen!' :
                   balanceScore >= 60 ? '⚖️ Gute Balance mit Optimierungspotenzial' :
                   '⚠️ Bereiche mit großen Unterschieden'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Lebensbereiche</CardTitle>
                <Button
                  onClick={() => setEditMode(!editMode)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {editMode ? 'Fertig' : 'Bearbeiten'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    {editMode ? (
                      <Input
                        value={cat.name}
                        onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white text-sm mr-2 flex-1"
                      />
                    ) : (
                      <span className="text-slate-300 text-sm">{cat.name}</span>
                    )}
                    <span 
                      className="text-lg font-bold px-3 py-1 rounded"
                      style={{ color: cat.color }}
                    >
                      {cat.value}
                    </span>
                  </div>
                  <Slider
                    value={[cat.value]}
                    onValueChange={(value) => updateCategory(cat.id, value[0])}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notes Section */}
        <Card className="mt-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Reflexion & Notizen</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Welche Bereiche benötigen mehr Aufmerksamkeit? Was sind Ihre nächsten Schritte?"
              rows={4}
              className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={exportData}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportieren
          </Button>
          <Button
            onClick={reset}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Zurücksetzen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LebensradTool;