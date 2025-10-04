import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, ArrowLeft, ArrowRight } from 'lucide-react';

const Wertequadrat = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    ausgangswert: '',
    positiverPol: '',
    negativerPol: '',
    schwestertugend: '',
    gegentugenSchwestertugend: '',
    reflexion: '',
    balance: ''
  });

  const steps = [
    {
      title: 'Ausgangswert bestimmen',
      description: 'Welcher Wert oder welche Tugend steht im Zentrum?'
    },
    {
      title: 'Positiver Pol',
      description: 'Was ist die positive Ausprägung dieses Werts?'
    },
    {
      title: 'Negativer Pol',
      description: 'Welche Übertreibung führt zu einem Problem?'
    },
    {
      title: 'Schwestertugend',
      description: 'Welcher Gegenwert bringt Balance?'
    },
    {
      title: 'Reflexion',
      description: 'Was bedeutet das für Ihre Situation?'
    }
  ];

  const handleExport = () => {
    const content = `
WERTEQUADRAT - SESSION EXPORT
==============================

AUSGANGSWERT
${data.ausgangswert}

POSITIVER POL (Wert in Balance)
${data.positiverPol}

NEGATIVER POL (Übertreibung)
${data.negativerPol}

SCHWESTERTUGEND (Ausgleichender Wert)
${data.schwestertugend}

GEGENTUGEND DER SCHWESTERTUGEND
${data.gegentugenSchwestertugend}

REFLEXION
${data.reflexion}

BALANCE-STRATEGIE
${data.balance}

Generiert: ${new Date().toLocaleString('de-DE')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wertequadrat-${data.ausgangswert.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderQuadrat = () => {
    if (!data.positiverPol && !data.negativerPol && !data.schwestertugend && !data.gegentugenSchwestertugend) {
      return null;
    }

    return (
      <div className="bg-slate-800/50 rounded-lg p-6 my-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Ihr Wertequadrat</h3>
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Oben links - Positiver Pol */}
          <div className="bg-green-500/20 border-2 border-green-500/40 rounded-lg p-4 text-center">
            <div className="text-xs text-green-400 font-semibold mb-2">POSITIVER POL</div>
            <div className="text-sm font-medium text-green-300">
              {data.positiverPol || '?'}
            </div>
          </div>

          {/* Oben rechts - Schwestertugend */}
          <div className="bg-blue-500/20 border-2 border-blue-500/40 rounded-lg p-4 text-center">
            <div className="text-xs text-blue-400 font-semibold mb-2">SCHWESTERTUGEND</div>
            <div className="text-sm font-medium text-blue-300">
              {data.schwestertugend || '?'}
            </div>
          </div>

          {/* Unten links - Negativer Pol */}
          <div className="bg-red-500/20 border-2 border-red-500/40 rounded-lg p-4 text-center">
            <div className="text-xs text-red-400 font-semibold mb-2">NEGATIVER POL</div>
            <div className="text-sm font-medium text-red-300">
              {data.negativerPol || '?'}
            </div>
          </div>

          {/* Unten rechts - Gegentugend */}
          <div className="bg-orange-500/20 border-2 border-orange-500/40 rounded-lg p-4 text-center">
            <div className="text-xs text-orange-400 font-semibold mb-2">GEGENTUGEND</div>
            <div className="text-sm font-medium text-orange-300">
              {data.gegentugenSchwestertugend || '?'}
            </div>
          </div>
        </div>

        {/* Erklärung der Verbindungen */}
        <div className="mt-6 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/40 rounded-full" />
            <span>Positiver Pol ↔ Schwestertugend: Diese Werte ergänzen sich</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500/40 rounded-full" />
            <span>Negativer Pol ↔ Gegentugend: Diese Extreme sind zu vermeiden</span>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <Label className="text-sm mb-2 block">
                Beispiele für Ausgangswerte:
              </Label>
              <div className="text-xs text-slate-400 space-y-1">
                <div>• Sparsamkeit, Ordnung, Mut, Ehrlichkeit</div>
                <div>• Hilfsbereitschaft, Selbstständigkeit, Flexibilität</div>
                <div>• Verlässlichkeit, Spontaneität, Gründlichkeit</div>
              </div>
            </div>
            <Label>Welcher Wert steht im Zentrum Ihrer Überlegung?</Label>
            <Input
              value={data.ausgangswert}
              onChange={(e) => setData({ ...data, ausgangswert: e.target.value })}
              placeholder="z.B. Ordnung, Hilfsbereitschaft, Flexibilität..."
              className="bg-slate-800/50 border-slate-700"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-sm text-green-300">
                Der positive Pol beschreibt den Wert "{data.ausgangswert}" in seiner ausgewogenen, hilfreichen Form.
              </p>
            </div>
            <Label>Wie äußert sich "{data.ausgangswert}" positiv?</Label>
            <Textarea
              value={data.positiverPol}
              onChange={(e) => setData({ ...data, positiverPol: e.target.value })}
              placeholder={`Beschreiben Sie die positive Seite von "${data.ausgangswert}"...`}
              className="bg-slate-800/50 border-slate-700 min-h-[120px]"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-300">
                Der negative Pol zeigt, was passiert, wenn "{data.ausgangswert}" übertrieben wird.
              </p>
            </div>
            <Label>Welche Übertreibung ist problematisch?</Label>
            <Textarea
              value={data.negativerPol}
              onChange={(e) => setData({ ...data, negativerPol: e.target.value })}
              placeholder={`Was passiert, wenn "${data.ausgangswert}" zu stark ausgeprägt ist?`}
              className="bg-slate-800/50 border-slate-700 min-h-[120px]"
            />
            <div className="bg-slate-800/50 rounded-lg p-4">
              <Label className="text-sm mb-2 block">Beispiele:</Label>
              <div className="text-xs text-slate-400 space-y-1">
                <div>• Ordnung → Pedanterie, Zwanghaftigkeit</div>
                <div>• Hilfsbereitschaft → Selbstaufgabe, Grenzlosigkeit</div>
                <div>• Mut → Leichtsinn, Rücksichtslosigkeit</div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                Die Schwestertugend ist ein ergänzender Wert, der "{data.ausgangswert}" in Balance hält.
              </p>
            </div>
            <Label>Welcher Gegenwert bringt Balance?</Label>
            <Input
              value={data.schwestertugend}
              onChange={(e) => setData({ ...data, schwestertugend: e.target.value })}
              placeholder="z.B. bei 'Ordnung' könnte es 'Flexibilität' sein..."
              className="bg-slate-800/50 border-slate-700"
            />
            <Label>Übertreibung der Schwestertugend?</Label>
            <Input
              value={data.gegentugenSchwestertugend}
              onChange={(e) => setData({ ...data, gegentugenSchwestertugend: e.target.value })}
              placeholder="Was passiert bei zu viel der Schwestertugend?"
              className="bg-slate-800/50 border-slate-700"
            />
            <div className="bg-slate-800/50 rounded-lg p-4">
              <Label className="text-sm mb-2 block">Beispiele:</Label>
              <div className="text-xs text-slate-400 space-y-1">
                <div>• Ordnung ↔ Flexibilität</div>
                <div>• Sparsamkeit ↔ Großzügigkeit</div>
                <div>• Mut ↔ Vorsicht</div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            {renderQuadrat()}
            
            <Label>Reflexion: Was bedeutet dieses Wertequadrat für Ihre aktuelle Situation?</Label>
            <Textarea
              value={data.reflexion}
              onChange={(e) => setData({ ...data, reflexion: e.target.value })}
              placeholder="Welche Erkenntnisse gewinnen Sie aus diesem Wertequadrat?"
              className="bg-slate-800/50 border-slate-700 min-h-[120px]"
            />

            <Label>Wie können Sie diese Werte besser in Balance bringen?</Label>
            <Textarea
              value={data.balance}
              onChange={(e) => setData({ ...data, balance: e.target.value })}
              placeholder="Welche konkreten Schritte helfen Ihnen, die Balance zu finden?"
              className="bg-slate-800/50 border-slate-700 min-h-[120px]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-slate-900/95 border-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl">Wertequadrat nach Paul Helwig</CardTitle>
        <CardDescription>
          Schritt {step} von {steps.length}: {steps[step - 1].title}
        </CardDescription>
        <div className="w-full bg-slate-800 rounded-full h-2 mt-4">
          <div
            className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-sm text-slate-300">{steps[step - 1].description}</p>
        </div>

        {renderStepContent()}

        <div className="flex justify-between pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>

          {step === steps.length ? (
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" className="border-slate-700">
                <Download className="w-4 h-4 mr-2" />
                Exportieren
              </Button>
              <Button onClick={onClose}>
                Abschließen
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setStep(Math.min(steps.length, step + 1))}
              disabled={step === 1 && !data.ausgangswert}
            >
              Weiter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Wertequadrat;