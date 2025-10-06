import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Download, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const SkalenarbeitTool = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionData, setSessionData] = useState({
    thema: '',
    istWert: 5,
    sollWert: 8,
    gruende: '',
    naechsterSchritt: '',
    ressourcen: '',
    hindernisse: '',
    coachNotes: ''
  });
  const [history, setHistory] = useState([]);

  const steps = [
    { 
      title: 'Thema definieren', 
      description: 'Was möchten Sie heute auf der Skala betrachten?',
      question: 'Welches Thema oder Ziel steht im Fokus?'
    },
    { 
      title: 'IST-Zustand', 
      description: 'Wo stehen Sie aktuell auf einer Skala von 0-10?',
      question: 'Bewerten Sie Ihre aktuelle Situation'
    },
    { 
      title: 'SOLL-Zustand', 
      description: 'Wo möchten Sie idealerweise stehen?',
      question: 'Was wäre Ihr Wunschzustand?'
    },
    { 
      title: 'Gründe für IST', 
      description: 'Warum sind Sie bereits bei dieser Zahl und nicht niedriger?',
      question: 'Was haben Sie bereits erreicht? Welche Ressourcen nutzen Sie schon?'
    },
    { 
      title: 'Nächster Schritt', 
      description: 'Was würde Sie einen Punkt höher bringen?',
      question: 'Welcher kleine, konkrete Schritt führt von Ihrem IST-Wert zum nächsten Punkt?'
    },
    { 
      title: 'Ressourcen', 
      description: 'Was unterstützt Sie auf diesem Weg?',
      question: 'Welche Fähigkeiten, Menschen oder Hilfsmittel stehen Ihnen zur Verfügung?'
    },
    { 
      title: 'Hindernisse', 
      description: 'Was könnte Sie aufhalten?',
      question: 'Welche Herausforderungen sehen Sie? Wie können Sie damit umgehen?'
    }
  ];

  const getEmoji = (value) => {
    if (value <= 3) return '😟';
    if (value <= 5) return '😐';
    if (value <= 7) return '🙂';
    return '😊';
  };

  const handleInputChange = (field, value) => {
    setSessionData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveSession = () => {
    const session = {
      date: new Date().toISOString(),
      ...sessionData
    };
    setHistory([...history, session]);
    alert('Session gespeichert!');
  };

  const exportSession = () => {
    const exportData = `
SKALENARBEIT SESSION
===================
Datum: ${new Date().toLocaleDateString('de-DE')}

THEMA: ${sessionData.thema}

IST-Zustand: ${sessionData.istWert}/10 ${getEmoji(sessionData.istWert)}
SOLL-Zustand: ${sessionData.sollWert}/10 ${getEmoji(sessionData.sollWert)}

GRÜNDE FÜR AKTUELLEN STAND:
${sessionData.gruende}

NÄCHSTER SCHRITT:
${sessionData.naechsterSchritt}

RESSOURCEN:
${sessionData.ressourcen}

HINDERNISSE:
${sessionData.hindernisse}

COACH-NOTIZEN:
${sessionData.coachNotes}
    `.trim();

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skalenarbeit_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const resetSession = () => {
    if (confirm('Möchten Sie wirklich eine neue Session starten? Alle Eingaben gehen verloren.')) {
      setSessionData({
        thema: '',
        istWert: 5,
        sollWert: 8,
        gruende: '',
        naechsterSchritt: '',
        ressourcen: '',
        hindernisse: '',
        coachNotes: ''
      });
      setCurrentStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Skalenarbeit</h1>
          <p className="text-slate-400">Strukturierter Coaching-Prozess zur Standortbestimmung und Zielerreichung</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Schritt {currentStep + 1} von {steps.length}</span>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% abgeschlossen
            </Badge>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
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
            {/* Step Content */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <label className="text-sm text-slate-300 block">
                  {steps[currentStep].question}
                </label>
                <Input
                  value={sessionData.thema}
                  onChange={(e) => handleInputChange('thema', e.target.value)}
                  placeholder="z.B. Karriereentwicklung, Work-Life-Balance, Selbstvertrauen..."
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <label className="text-sm text-slate-300 block">
                  {steps[currentStep].question}
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{getEmoji(sessionData.istWert)}</span>
                    <span className="text-5xl font-bold text-blue-400">{sessionData.istWert}</span>
                  </div>
                  <Slider
                    value={[sessionData.istWert]}
                    onValueChange={(value) => handleInputChange('istWert', value[0])}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0 - Sehr schlecht</span>
                    <span>10 - Perfekt</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <label className="text-sm text-slate-300 block">
                  {steps[currentStep].question}
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{getEmoji(sessionData.sollWert)}</span>
                    <span className="text-5xl font-bold text-green-400">{sessionData.sollWert}</span>
                  </div>
                  <Slider
                    value={[sessionData.sollWert]}
                    onValueChange={(value) => handleInputChange('sollWert', value[0])}
                    min={sessionData.istWert}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Aktuell: {sessionData.istWert}</span>
                    <span>10 - Zielzustand</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <label className="text-sm text-slate-300 block">
                  {steps[currentStep].question}
                </label>
                <Textarea
                  value={sessionData.gruende}
                  onChange={(e) => handleInputChange('gruende', e.target.value)}
                  placeholder="Welche Erfolge haben Sie bereits? Was läuft gut? Welche Fähigkeiten setzen Sie ein?"
                  rows={5}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <p className="text-blue-300 text-sm">
                    Von <span className="font-bold">{sessionData.istWert}</span> auf <span className="font-bold">{sessionData.istWert + 1}</span>
                  </p>
                </div>
                <label className="text-sm text-slate-300 block">
                  {steps[currentStep].question}
                </label>
                <Textarea
                  value={sessionData.naechsterSchritt}
                  onChange={(e) => handleInputChange('naechsterSchritt', e.target.value)}
                  placeholder="Welcher konkrete, kleine Schritt bringt Sie einen Punkt weiter?"
                  rows={5}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <label className="text-sm text-slate-300 block">
                  {steps[currentStep].question}
                </label>
                <Textarea
                  value={sessionData.ressourcen}
                  onChange={(e) => handleInputChange('ressourcen', e.target.value)}
                  placeholder="Menschen, Fähigkeiten, Erfahrungen, Tools..."
                  rows={5}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <label className="text-sm text-slate-300 block">
                  {steps[currentStep].question}
                </label>
                <Textarea
                  value={sessionData.hindernisse}
                  onChange={(e) => handleInputChange('hindernisse', e.target.value)}
                  placeholder="Welche Herausforderungen sehen Sie? Wie können Sie damit umgehen?"
                  rows={5}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
                
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <label className="text-sm text-slate-300 block mb-2">
                    Coach-Notizen (optional)
                  </label>
                  <Textarea
                    value={sessionData.coachNotes}
                    onChange={(e) => handleInputChange('coachNotes', e.target.value)}
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
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              
              <Button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              >
                Weiter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>

              {currentStep === steps.length - 1 && (
                <>
                  <Button
                    onClick={saveSession}
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600/10"
                  >
                    Speichern
                  </Button>
                  <Button
                    onClick={exportSession}
                    variant="outline"
                    className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </>
              )}
            </div>

            <Button
              onClick={resetSession}
              variant="ghost"
              className="w-full text-slate-500 hover:text-slate-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Neue Session starten
            </Button>
          </CardContent>
        </Card>

        {/* Summary Card */}
        {sessionData.thema && (
          <Card className="mt-6 bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Session-Übersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-slate-400">Thema:</span>
                <span className="text-white ml-2">{sessionData.thema}</span>
              </div>
              <div>
                <span className="text-slate-400">IST → SOLL:</span>
                <span className="text-blue-400 ml-2">{sessionData.istWert}</span>
                <span className="text-slate-500 mx-2">→</span>
                <span className="text-green-400">{sessionData.sollWert}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SkalenarbeitTool;