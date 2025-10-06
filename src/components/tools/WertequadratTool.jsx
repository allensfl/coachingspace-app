import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Download, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const WertequadratTool = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionData, setSessionData] = useState({
    kernwert: '',
    schwestertugend: '',
    positivUebertreibung: '',
    negativUebertreibung: '',
    situation: '',
    reflexion: '',
    balance: '',
    notes: ''
  });

  const steps = [
    {
      title: 'Situation & Kernwert',
      description: 'In welcher Situation befinden Sie sich? Welcher Wert ist besonders wichtig?'
    },
    {
      title: 'Schwestertugend',
      description: 'Welcher ergänzende Wert steht in produktiver Spannung zu Ihrem Kernwert?'
    },
    {
      title: 'Übertreibungen erkennen',
      description: 'Was passiert, wenn Sie einen Wert übertreiben?'
    },
    {
      title: 'Reflexion',
      description: 'Wo stehen Sie? Was brauchen Sie für mehr Balance?'
    },
    {
      title: 'Balance-Plan',
      description: 'Wie können Sie beide Werte in Einklang bringen?'
    }
  ];

  const beispielWerte = [
    { kernwert: 'Ordnung', schwestertugend: 'Flexibilität', posUeber: 'Pedanterie', negUeber: 'Chaos' },
    { kernwert: 'Sparsamkeit', schwestertugend: 'Großzügigkeit', posUeber: 'Geiz', negUeber: 'Verschwendung' },
    { kernwert: 'Mut', schwestertugend: 'Vorsicht', posUeber: 'Waghalsigkeit', negUeber: 'Feigheit' },
    { kernwert: 'Selbständigkeit', schwestertugend: 'Verbundenheit', posUeber: 'Isolation', negUeber: 'Abhängigkeit' },
    { kernwert: 'Ehrgeiz', schwestertugend: 'Gelassenheit', posUeber: 'Karrierismus', negUeber: 'Gleichgültigkeit' }
  ];

  const [showBeispiele, setShowBeispiele] = useState(false);

  const exportSession = () => {
    const exportText = `
WERTEQUADRAT ANALYSE
===================
Datum: ${new Date().toLocaleDateString('de-DE')}

SITUATION:
${sessionData.situation}

WERTEQUADRAT:
┌────────────────────────────────────────┐
│  ${sessionData.kernwert.toUpperCase().padEnd(18)} ←→ ${sessionData.schwestertugend.toUpperCase()}  │
│                                        │
│         ↕                     ↕        │
│                                        │
│  ${sessionData.positivUebertreibung.padEnd(18)}    ${sessionData.negativUebertreibung}  │
└────────────────────────────────────────┘

Kernwert: ${sessionData.kernwert}
Schwestertugend: ${sessionData.schwestertugend}
Positive Übertreibung: ${sessionData.positivUebertreibung}
Negative Übertreibung: ${sessionData.negativUebertreibung}

REFLEXION:
${sessionData.reflexion}

BALANCE-PLAN:
${sessionData.balance}

COACH-NOTIZEN:
${sessionData.notes}
    `.trim();

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wertequadrat_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const reset = () => {
    if (confirm('Möchten Sie wirklich eine neue Session starten?')) {
      setSessionData({
        kernwert: '',
        schwestertugend: '',
        positivUebertreibung: '',
        negativUebertreibung: '',
        situation: '',
        reflexion: '',
        balance: '',
        notes: ''
      });
      setCurrentStep(0);
    }
  };

  const useBeispiel = (beispiel) => {
    setSessionData({
      ...sessionData,
      kernwert: beispiel.kernwert,
      schwestertugend: beispiel.schwestertugend,
      positivUebertreibung: beispiel.posUeber,
      negativUebertreibung: beispiel.negUeber
    });
    setShowBeispiele(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💎 Wertequadrat</h1>
          <p className="text-slate-400">Nach Schulz von Thun: Werte in produktiver Spannung</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Schritt {currentStep + 1} von {steps.length}</span>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% abgeschlossen
            </Badge>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{steps[currentStep].title}</CardTitle>
            <p className="text-slate-400 mt-2">{steps[currentStep].description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Situation & Kernwert */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Beschreiben Sie die Situation oder das Dilemma
                  </label>
                  <Textarea
                    value={sessionData.situation}
                    onChange={(e) => setSessionData({ ...sessionData, situation: e.target.value })}
                    placeholder="In welcher Situation befinden Sie sich? Was beschäftigt Sie?"
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Welcher Wert ist Ihnen in dieser Situation besonders wichtig?
                  </label>
                  <Input
                    value={sessionData.kernwert}
                    onChange={(e) => setSessionData({ ...sessionData, kernwert: e.target.value })}
                    placeholder="z.B. Ordnung, Ehrlichkeit, Selbständigkeit..."
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <Button
                  onClick={() => setShowBeispiele(!showBeispiele)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300"
                >
                  {showBeispiele ? 'Beispiele ausblenden' : 'Beispiele anzeigen'}
                </Button>

                {showBeispiele && (
                  <div className="grid gap-2 mt-4">
                    {beispielWerte.map((bsp, i) => (
                      <button
                        key={i}
                        onClick={() => useBeispiel(bsp)}
                        className="text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors"
                      >
                        <div className="text-white font-medium">{bsp.kernwert} ↔ {bsp.schwestertugend}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          Übertreibungen: {bsp.posUeber} / {bsp.negUeber}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Schwestertugend */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-purple-300 text-sm">
                    Ihr Kernwert: <span className="font-bold">{sessionData.kernwert}</span>
                  </p>
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Welcher Wert würde Ihren Kernwert sinnvoll ergänzen oder ausbalancieren?
                  </label>
                  <Input
                    value={sessionData.schwestertugend}
                    onChange={(e) => setSessionData({ ...sessionData, schwestertugend: e.target.value })}
                    placeholder="z.B. wenn Kernwert 'Ordnung' ist, könnte es 'Flexibilität' sein"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    💡 Tipp: Die Schwestertugend steht in produktiver Spannung zum Kernwert. Sie ergänzt ihn, ohne ihn zu negieren.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Übertreibungen */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-300">
                      <span className="font-bold">{sessionData.kernwert}</span>
                    </span>
                    <span className="text-slate-500">↔</span>
                    <span className="text-purple-300">
                      <span className="font-bold">{sessionData.schwestertugend}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Was passiert, wenn Sie "{sessionData.kernwert}" übertreiben?
                  </label>
                  <Input
                    value={sessionData.positivUebertreibung}
                    onChange={(e) => setSessionData({ ...sessionData, positivUebertreibung: e.target.value })}
                    placeholder="z.B. Ordnung wird zu Pedanterie"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    ⚠️ Die positive Übertreibung ist das Laster, das entsteht, wenn ein Wert zu einseitig gelebt wird.
                  </p>
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Was passiert, wenn Sie "{sessionData.schwestertugend}" übertreiben?
                  </label>
                  <Input
                    value={sessionData.negativUebertreibung}
                    onChange={(e) => setSessionData({ ...sessionData, negativUebertreibung: e.target.value })}
                    placeholder="z.B. Flexibilität wird zu Chaos"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    ⚠️ Die negative Übertreibung zeigt, was passiert, wenn der komplementäre Wert zu stark wird.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Reflexion */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {/* Wertequadrat Visualisierung */}
                <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4">
                      <div className="text-green-400 font-bold text-lg">{sessionData.kernwert}</div>
                      <div className="text-xs text-slate-400 mt-1">Kernwert</div>
                    </div>
                    <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-4">
                      <div className="text-blue-400 font-bold text-lg">{sessionData.schwestertugend}</div>
                      <div className="text-xs text-slate-400 mt-1">Schwestertugend</div>
                    </div>
                    <div className="bg-orange-500/20 border-2 border-orange-500 rounded-lg p-4">
                      <div className="text-orange-400 font-bold">{sessionData.positivUebertreibung}</div>
                      <div className="text-xs text-slate-400 mt-1">Übertreibung ↓</div>
                    </div>
                    <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-4">
                      <div className="text-red-400 font-bold">{sessionData.negativUebertreibung}</div>
                      <div className="text-xs text-slate-400 mt-1">Übertreibung ↓</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Reflexion: Wo stehen Sie aktuell in diesem Spannungsfeld?
                  </label>
                  <Textarea
                    value={sessionData.reflexion}
                    onChange={(e) => setSessionData({ ...sessionData, reflexion: e.target.value })}
                    placeholder="Tendieren Sie eher zu einem Wert? Haben Sie eine Übertreibung bei sich bemerkt? Welche Muster sehen Sie?"
                    rows={5}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Balance-Plan */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="text-green-400 font-bold">{sessionData.kernwert}</div>
                      <div className="text-slate-500 my-2">↕</div>
                      <div className="text-orange-400">{sessionData.positivUebertreibung}</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold">{sessionData.schwestertugend}</div>
                      <div className="text-slate-500 my-2">↕</div>
                      <div className="text-red-400">{sessionData.negativUebertreibung}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">
                    Wie können Sie beide Werte in Balance bringen?
                  </label>
                  <Textarea
                    value={sessionData.balance}
                    onChange={(e) => setSessionData({ ...sessionData, balance: e.target.value })}
                    placeholder="Welche konkreten Schritte würden helfen? Welche Situationen erfordern mehr vom einen oder anderen Wert?"
                    rows={5}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    💡 Ziel ist nicht, einen Wert aufzugeben, sondern beide Werte je nach Kontext flexibel einzusetzen.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-700">
                  <label className="text-sm text-slate-300 block mb-2">
                    Coach-Notizen
                  </label>
                  <Textarea
                    value={sessionData.notes}
                    onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
                    placeholder="Ihre Beobachtungen, Hypothesen, Follow-up-Ideen..."
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-6 border-t border-slate-700">
              <Button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>

              <Button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
              >
                Weiter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>

              {currentStep === steps.length - 1 && (
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

export default WertequadratTool;