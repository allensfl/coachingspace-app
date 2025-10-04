import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, ChevronLeft, ChevronRight, Star, Plus, Trash2 } from 'lucide-react';

const GrowModell = ({ onClose }) => {
  const [phase, setPhase] = useState(0);
  const [data, setData] = useState({
    goal: '',
    reality: '',
    options: [],
    will: ''
  });
  const [neueOption, setNeueOption] = useState('');
  const [optionBewertungen, setOptionBewertungen] = useState({});

  const phasen = [
    {
      key: 'goal',
      titel: 'Goal - Ziel',
      beschreibung: 'Was möchten Sie erreichen? Definieren Sie Ihr Ziel klar und spezifisch.',
      fragen: [
        'Was genau möchten Sie erreichen?',
        'Woran werden Sie merken, dass Sie das Ziel erreicht haben?',
        'Bis wann möchten Sie dieses Ziel erreichen?',
        'Warum ist dieses Ziel wichtig für Sie?'
      ],
      farbe: 'blue'
    },
    {
      key: 'reality',
      titel: 'Reality - Realität',
      beschreibung: 'Wo stehen Sie aktuell? Analysieren Sie die Ist-Situation objektiv.',
      fragen: [
        'Wie ist die aktuelle Situation?',
        'Was haben Sie bereits versucht?',
        'Welche Ressourcen stehen Ihnen zur Verfügung?',
        'Was hindert Sie aktuell daran, Ihr Ziel zu erreichen?'
      ],
      farbe: 'green'
    },
    {
      key: 'options',
      titel: 'Options - Optionen',
      beschreibung: 'Welche Möglichkeiten haben Sie? Sammeln Sie alle denkbaren Handlungsoptionen.',
      fragen: [
        'Welche verschiedenen Wege könnten Sie einschlagen?',
        'Was würden Sie einem Freund in dieser Situation raten?',
        'Welche kreativen oder unkonventionellen Lösungen gibt es?',
        'Was würden Sie tun, wenn Geld/Zeit keine Rolle spielen würde?'
      ],
      farbe: 'purple'
    },
    {
      key: 'will',
      titel: 'Will/Way Forward - Weg nach vorn',
      beschreibung: 'Was werden Sie konkret tun? Legen Sie die nächsten Schritte fest.',
      fragen: [
        'Für welche Option entscheiden Sie sich?',
        'Was ist Ihr erster konkreter Schritt?',
        'Wann werden Sie diesen Schritt gehen?',
        'Wer oder was könnte Sie dabei unterstützen?',
        'Wie werden Sie sich selbst zur Verantwortung ziehen?'
      ],
      farbe: 'orange'
    }
  ];

  const aktuellePhase = phasen[phase];

  const optionHinzufuegen = () => {
    if (neueOption.trim()) {
      setData({
        ...data,
        options: [...data.options, neueOption.trim()]
      });
      setNeueOption('');
    }
  };

  const optionLoeschen = (index) => {
    setData({
      ...data,
      options: data.options.filter((_, i) => i !== index)
    });
    const neueBewertungen = { ...optionBewertungen };
    delete neueBewertungen[index];
    setOptionBewertungen(neueBewertungen);
  };

  const optionBewerten = (index, sterne) => {
    setOptionBewertungen({
      ...optionBewertungen,
      [index]: sterne
    });
  };

  const handleExport = () => {
    const content = `
GROW-MODELL - SESSION EXPORT
=============================

GOAL - ZIEL
-----------
${data.goal}

REALITY - REALITÄT
------------------
${data.reality}

OPTIONS - OPTIONEN
------------------
${data.options.length > 0 ? data.options.map((opt, i) => {
  const bewertung = optionBewertungen[i] || 0;
  return `${i + 1}. ${opt} ${bewertung > 0 ? `(${bewertung}/5 Sterne)` : ''}`;
}).join('\n') : 'Keine Optionen erfasst'}

Top bewertete Optionen:
${Object.entries(optionBewertungen)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 3)
  .map(([idx, rating]) => `- ${data.options[idx]} (${rating}/5 Sterne)`)
  .join('\n')}

WILL/WAY FORWARD - WEG NACH VORN
---------------------------------
${data.will}

Generiert: ${new Date().toLocaleString('de-DE')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grow-modell-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFarbeKlassen = (farbe) => {
    const farben = {
      blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      green: 'bg-green-500/20 border-green-500/30 text-green-400',
      purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
      orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400'
    };
    return farben[farbe] || farben.blue;
  };

  const renderPhaseContent = () => {
    if (aktuellePhase.key === 'options') {
      return (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
            <Label>Neue Option hinzufügen</Label>
            <div className="flex gap-2">
              <Textarea
                value={neueOption}
                onChange={(e) => setNeueOption(e.target.value)}
                placeholder="Beschreiben Sie eine mögliche Handlungsoption..."
                className="bg-slate-900/50 border-slate-700 min-h-[80px]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    optionHinzufuegen();
                  }
                }}
              />
            </div>
            <Button onClick={optionHinzufuegen} disabled={!neueOption.trim()} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Option hinzufügen
            </Button>
          </div>

          <div className="space-y-3">
            <Label>Erfasste Optionen ({data.options.length})</Label>
            {data.options.length === 0 ? (
              <div className="bg-slate-800/50 rounded-lg p-8 text-center text-slate-400">
                Noch keine Optionen erfasst. Fügen Sie oben Ihre erste Option hinzu.
              </div>
            ) : (
              data.options.map((option, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">Option {index + 1}</p>
                      <p className="text-slate-300">{option}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => optionLoeschen(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Bewertung:</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((stern) => (
                        <button
                          key={stern}
                          onClick={() => optionBewerten(index, stern)}
                          className="transition-colors"
                        >
                          <Star
                            className="w-5 h-5"
                            fill={stern <= (optionBewertungen[index] || 0) ? 'rgb(251, 191, 36)' : 'none'}
                            stroke={stern <= (optionBewertungen[index] || 0) ? 'rgb(251, 191, 36)' : 'rgb(100, 116, 139)'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Textarea
          value={data[aktuellePhase.key]}
          onChange={(e) => setData({ ...data, [aktuellePhase.key]: e.target.value })}
          placeholder={`Ihre Gedanken zur Phase "${aktuellePhase.titel}"...`}
          className="bg-slate-800/50 border-slate-700 min-h-[200px]"
        />
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-900/95 border-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl">GROW-Modell</CardTitle>
        <CardDescription>
          Strukturierter 4-Phasen-Prozess für zielorientiertes Coaching
        </CardDescription>
        
        {/* Phasen-Navigation */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {phasen.map((p, index) => (
            <button
              key={p.key}
              onClick={() => setPhase(index)}
              className={`p-3 rounded-lg border-2 transition-all ${
                index === phase
                  ? getFarbeKlassen(p.farbe)
                  : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-xs font-semibold mb-1">Phase {index + 1}</div>
              <div className="text-sm">{p.titel.split(' - ')[0]}</div>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Aktuell Phase Info */}
        <div className={`rounded-lg border-2 p-4 ${getFarbeKlassen(aktuellePhase.farbe)}`}>
          <h3 className="text-xl font-bold mb-2">{aktuellePhase.titel}</h3>
          <p className="text-sm mb-4 opacity-90">{aktuellePhase.beschreibung}</p>
          
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Leitfragen:</Label>
            <ul className="text-sm space-y-1">
              {aktuellePhase.fragen.map((frage, i) => (
                <li key={i} className="flex gap-2">
                  <span className="opacity-60">•</span>
                  <span className="opacity-90">{frage}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Phase Content */}
        {renderPhaseContent()}

        {/* Navigation und Actions */}
        <div className="flex justify-between pt-4 border-t border-slate-800">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPhase(Math.max(0, phase - 1))}
              disabled={phase === 0}
              className="border-slate-700"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            <Button
              variant="outline"
              onClick={() => setPhase(Math.min(phasen.length - 1, phase + 1))}
              disabled={phase === phasen.length - 1}
              className="border-slate-700"
            >
              Weiter
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" className="border-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Exportieren
            </Button>
            <Button onClick={onClose}>
              Abschließen
            </Button>
          </div>
        </div>

        {/* Fortschrittsanzeige */}
        <div className="text-center">
          <div className="text-sm text-slate-400">
            Phase {phase + 1} von {phasen.length}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((phase + 1) / phasen.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowModell;