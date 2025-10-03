import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Download, RotateCcw, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

const GrowModellTool = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [sessionData, setSessionData] = useState({
    goal: {
      description: '',
      why: '',
      success: '',
      deadline: ''
    },
    reality: {
      currentSituation: '',
      obstacles: '',
      resources: '',
      attempts: ''
    },
    options: [],
    will: {
      nextSteps: '',
      commitment: 5,
      support: '',
      tracking: ''
    },
    notes: ''
  });

  const phases = [
    {
      id: 'goal',
      title: 'Goal (Ziel)',
      icon: '🎯',
      color: 'text-blue-400',
      description: 'Was möchten Sie erreichen?'
    },
    {
      id: 'reality',
      title: 'Reality (Realität)',
      icon: '🔍',
      color: 'text-green-400',
      description: 'Wo stehen Sie aktuell?'
    },
    {
      id: 'options',
      title: 'Options (Optionen)',
      icon: '💡',
      color: 'text-purple-400',
      description: 'Welche Möglichkeiten haben Sie?'
    },
    {
      id: 'will',
      title: 'Will (Wille)',
      icon: '⚡',
      color: 'text-orange-400',
      description: 'Was werden Sie konkret tun?'
    }
  ];

  const addOption = () => {
    setSessionData({
      ...sessionData,
      options: [
        ...sessionData.options,
        { id: Date.now(), description: '', pros: '', cons: '', rating: 5 }
      ]
    });
  };

  const updateOption = (id, field, value) => {
    setSessionData({
      ...sessionData,
      options: sessionData.options.map(opt =>
        opt.id === id ? { ...opt, [field]: value } : opt
      )
    });
  };

  const removeOption = (id) => {
    setSessionData({
      ...sessionData,
      options: sessionData.options.filter(opt => opt.id !== id)
    });
  };

  const exportSession = () => {
    const exportText = `
GROW-MODELL COACHING SESSION
============================
Datum: ${new Date().toLocaleDateString('de-DE')}

🎯 GOAL (Ziel)
--------------
Beschreibung: ${sessionData.goal.description}
Warum wichtig: ${sessionData.goal.why}
Erfolgsmaßstab: ${sessionData.goal.success}
Deadline: ${sessionData.goal.deadline}

🔍 REALITY (Realität)
---------------------
Aktuelle Situation: ${sessionData.reality.currentSituation}
Hindernisse: ${sessionData.reality.obstacles}
Ressourcen: ${sessionData.reality.resources}
Bisherige Versuche: ${sessionData.reality.attempts}

💡 OPTIONS (Optionen)
---------------------
${sessionData.options.map((opt, i) => `
Option ${i + 1}: ${opt.description}
  Vorteile: ${opt.pros}
  Nachteile: ${opt.cons}
  Bewertung: ${opt.rating}/10
`).join('\n')}

⚡ WILL (Wille)
--------------
Nächste Schritte: ${sessionData.will.nextSteps}
Commitment-Level: ${sessionData.will.commitment}/10
Unterstützung: ${sessionData.will.support}
Fortschrittskontrolle: ${sessionData.will.tracking}

COACH-NOTIZEN
-------------
${sessionData.notes}
    `.trim();

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grow_session_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const reset = () => {
    if (confirm('Möchten Sie wirklich eine neue Session starten?')) {
      setSessionData({
        goal: { description: '', why: '', success: '', deadline: '' },
        reality: { currentSituation: '', obstacles: '', resources: '', attempts: '' },
        options: [],
        will: { nextSteps: '', commitment: 5, support: '', tracking: '' },
        notes: ''
      });
      setCurrentPhase(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎯 GROW-Modell</h1>
          <p className="text-slate-400">Strukturiertes Coaching-Gespräch für Zielerreichung</p>
        </div>

        {/* Phase Navigation */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {phases.map((phase, index) => (
            <button
              key={phase.id}
              onClick={() => setCurrentPhase(index)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentPhase === index
                  ? 'bg-slate-700 border-blue-500'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-2xl mb-2">{phase.icon}</div>
              <div className={`font-semibold mb-1 ${currentPhase === index ? 'text-white' : 'text-slate-400'}`}>
                {phase.title}
              </div>
              <div className="text-xs text-slate-500">{phase.description}</div>
            </button>
          ))}
        </div>

        {/* Content Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className={`text-2xl ${phases[currentPhase].color}`}>
              {phases[currentPhase].icon} {phases[currentPhase].title}
            </CardTitle>
            <p className="text-slate-400 mt-2">{phases[currentPhase].description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Goal Phase */}
            {currentPhase === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Was ist Ihr Ziel? Beschreiben Sie es so konkret wie möglich.
                  </label>
                  <Textarea
                    value={sessionData.goal.description}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      goal: { ...sessionData.goal, description: e.target.value }
                    })}
                    placeholder="z.B. Ich möchte in den nächsten 3 Monaten..."
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Warum ist dieses Ziel wichtig für Sie?
                  </label>
                  <Textarea
                    value={sessionData.goal.why}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      goal: { ...sessionData.goal, why: e.target.value }
                    })}
                    placeholder="Welche Bedeutung hat dieses Ziel? Was wird sich ändern?"
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Woran werden Sie merken, dass Sie das Ziel erreicht haben?
                  </label>
                  <Input
                    value={sessionData.goal.success}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      goal: { ...sessionData.goal, success: e.target.value }
                    })}
                    placeholder="Messbare Erfolgskriterien..."
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Bis wann möchten Sie das Ziel erreichen?
                  </label>
                  <Input
                    type="date"
                    value={sessionData.goal.deadline}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      goal: { ...sessionData.goal, deadline: e.target.value }
                    })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            )}

            {/* Reality Phase */}
            {currentPhase === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Wo stehen Sie aktuell in Bezug auf Ihr Ziel?
                  </label>
                  <Textarea
                    value={sessionData.reality.currentSituation}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      reality: { ...sessionData.reality, currentSituation: e.target.value }
                    })}
                    placeholder="Beschreiben Sie Ihre aktuelle Situation..."
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Welche Hindernisse oder Herausforderungen sehen Sie?
                  </label>
                  <Textarea
                    value={sessionData.reality.obstacles}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      reality: { ...sessionData.reality, obstacles: e.target.value }
                    })}
                    placeholder="Was steht Ihnen im Weg?"
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Welche Ressourcen und Stärken haben Sie bereits?
                  </label>
                  <Textarea
                    value={sessionData.reality.resources}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      reality: { ...sessionData.reality, resources: e.target.value }
                    })}
                    placeholder="Fähigkeiten, Unterstützung, Erfahrungen..."
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Was haben Sie bereits versucht?
                  </label>
                  <Textarea
                    value={sessionData.reality.attempts}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      reality: { ...sessionData.reality, attempts: e.target.value }
                    })}
                    placeholder="Welche Ansätze haben Sie schon ausprobiert?"
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            {/* Options Phase */}
            {currentPhase === 2 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-slate-300">
                    Sammeln Sie verschiedene Optionen und bewerten Sie diese.
                  </p>
                  <Button
                    onClick={addOption}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Option hinzufügen
                  </Button>
                </div>

                {sessionData.options.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Noch keine Optionen hinzugefügt. Klicken Sie auf "Option hinzufügen".
                  </div>
                )}

                {sessionData.options.map((option, index) => (
                  <Card key={option.id} className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-white">
                          Option {index + 1}
                        </CardTitle>
                        <Button
                          onClick={() => removeOption(option.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Input
                        value={option.description}
                        onChange={(e) => updateOption(option.id, 'description', e.target.value)}
                        placeholder="Beschreibung der Option..."
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                      <Textarea
                        value={option.pros}
                        onChange={(e) => updateOption(option.id, 'pros', e.target.value)}
                        placeholder="Vorteile / Pro..."
                        rows={2}
                        className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-500"
                      />
                      <Textarea
                        value={option.cons}
                        onChange={(e) => updateOption(option.id, 'cons', e.target.value)}
                        placeholder="Nachteile / Contra..."
                        rows={2}
                        className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-500"
                      />
                      <div>
                        <label className="text-xs text-slate-400 block mb-2">
                          Bewertung: {option.rating}/10
                        </label>
                        <Slider
                          value={[option.rating]}
                          onValueChange={(value) => updateOption(option.id, 'rating', value[0])}
                          min={0}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Will Phase */}
            {currentPhase === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Was werden Sie konkret tun? Welche Schritte gehen Sie als nächstes?
                  </label>
                  <Textarea
                    value={sessionData.will.nextSteps}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      will: { ...sessionData.will, nextSteps: e.target.value }
                    })}
                    placeholder="Konkrete, messbare Aktionen mit Deadlines..."
                    rows={4}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Wie hoch ist Ihr Commitment? (0 = gar nicht, 10 = absolut sicher)
                  </label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[sessionData.will.commitment]}
                      onValueChange={(value) => setSessionData({
                        ...sessionData,
                        will: { ...sessionData.will, commitment: value[0] }
                      })}
                      min={0}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-blue-400 w-12">
                      {sessionData.will.commitment}
                    </span>
                  </div>
                  {sessionData.will.commitment < 7 && (
                    <p className="text-xs text-orange-400 mt-2">
                      ⚠️ Bei niedrigem Commitment: Was bräuchten Sie, um sicherer zu sein?
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Welche Unterstützung benötigen Sie?
                  </label>
                  <Textarea
                    value={sessionData.will.support}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      will: { ...sessionData.will, support: e.target.value }
                    })}
                    placeholder="Von wem oder was brauchen Sie Hilfe?"
                    rows={2}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Wie werden Sie Ihren Fortschritt messen und kontrollieren?
                  </label>
                  <Textarea
                    value={sessionData.will.tracking}
                    onChange={(e) => setSessionData({
                      ...sessionData,
                      will: { ...sessionData.will, tracking: e.target.value }
                    })}
                    placeholder="Check-in Termine, Metriken, Reflexionspunkte..."
                    rows={2}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            {/* Coach Notes */}
            <div className="pt-6 border-t border-slate-700">
              <label className="text-sm text-slate-300 block mb-2">
                Coach-Notizen
              </label>
              <Textarea
                value={sessionData.notes}
                onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
                placeholder="Ihre Beobachtungen und Hypothesen..."
                rows={3}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-6 border-t border-slate-700">
              <Button
                onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
                disabled={currentPhase === 0}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>

              <Button
                onClick={() => setCurrentPhase(Math.min(3, currentPhase + 1))}
                disabled={currentPhase === 3}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              >
                Weiter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>

              {currentPhase === 3 && (
                <Button
                  onClick={exportSession}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>

            <Button
              onClick={reset}
              variant="ghost"
              className="w-full text-slate-500 hover:text-slate-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Neue Session starten
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrowModellTool;