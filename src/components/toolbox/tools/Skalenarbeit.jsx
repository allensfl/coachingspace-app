import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Download, ArrowLeft, ArrowRight } from 'lucide-react';

const Skalenarbeit = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    thema: '',
    istWert: 5,
    sollWert: 8,
    bedeutungIst: '',
    bedeutungSoll: '',
    ressourcen: '',
    naechsterSchritt: '',
    hindernisse: ''
  });

  const steps = [
    { title: 'Thema definieren', field: 'thema' },
    { title: 'IST-Wert', field: 'istWert' },
    { title: 'SOLL-Wert', field: 'sollWert' },
    { title: 'Bedeutung IST', field: 'bedeutungIst' },
    { title: 'Bedeutung SOLL', field: 'bedeutungSoll' },
    { title: 'Ressourcen', field: 'ressourcen' },
    { title: 'Nächster Schritt', field: 'naechsterSchritt' }
  ];

  const handleExport = () => {
    const content = `
SKALENARBEIT - SESSION EXPORT
==============================

Thema: ${data.thema}

IST-Wert: ${data.istWert}/10
Bedeutung: ${data.bedeutungIst}

SOLL-Wert: ${data.sollWert}/10
Bedeutung: ${data.bedeutungSoll}

Ressourcen:
${data.ressourcen}

Nächster Schritt:
${data.naechsterSchritt}

Hindernisse:
${data.hindernisse}

Generiert: ${new Date().toLocaleString('de-DE')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skalenarbeit-${data.thema.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <Label>Welches Thema möchten Sie bearbeiten?</Label>
            <Input
              value={data.thema}
              onChange={(e) => setData({...data, thema: e.target.value})}
              placeholder="z.B. Arbeitszufriedenheit, Work-Life-Balance..."
              className="bg-slate-800/50 border-slate-700"
            />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg mb-4 block">Wo stehen Sie aktuell?</Label>
              <div className="text-center mb-4">
                <span className="text-5xl font-bold text-blue-400">{data.istWert}</span>
                <span className="text-2xl text-slate-400">/10</span>
              </div>
              <Slider
                value={[data.istWert]}
                onValueChange={([value]) => setData({...data, istWert: value})}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>1 - Sehr schlecht</span>
                <span>10 - Perfekt</span>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg mb-4 block">Wo möchten Sie hin?</Label>
              <div className="text-center mb-4">
                <span className="text-5xl font-bold text-green-400">{data.sollWert}</span>
                <span className="text-2xl text-slate-400">/10</span>
              </div>
              <Slider
                value={[data.sollWert]}
                onValueChange={([value]) => setData({...data, sollWert: value})}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>1 - Minimum</span>
                <span>10 - Ideal</span>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <Label>Was bedeutet für Sie der aktuelle Wert von {data.istWert}?</Label>
            <Textarea
              value={data.bedeutungIst}
              onChange={(e) => setData({...data, bedeutungIst: e.target.value})}
              placeholder="Warum haben Sie sich für diesen Wert entschieden? Was macht den Unterschied zu einem niedrigeren Wert aus?"
              className="bg-slate-800/50 border-slate-700 min-h-[120px]"
            />
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <Label>Was würde der Zielwert von {data.sollWert} für Sie bedeuten?</Label>
            <Textarea
              value={data.bedeutungSoll}
              onChange={(e) => setData({...data, bedeutungSoll: e.target.value})}
              placeholder="Wie würde sich Ihr Leben verändern? Was wäre dann anders?"
              className="bg-slate-800/50 border-slate-700 min-h-[120px]"
            />
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-4">
            <Label>Welche Ressourcen haben Sie bereits?</Label>
            <Textarea
              value={data.ressourcen}
              onChange={(e) => setData({...data, ressourcen: e.target.value})}
              placeholder="Fähigkeiten, Erfahrungen, Personen, Wissen... Was hat Ihnen schon einmal geholfen?"
              className="bg-slate-800/50 border-slate-700 min-h-[120px]"
            />
          </div>
        );
      
      case 7:
        return (
          <div className="space-y-4">
            <Label>Was ist Ihr nächster konkreter Schritt?</Label>
            <Textarea
              value={data.naechsterSchritt}
              onChange={(e) => setData({...data, naechsterSchritt: e.target.value})}
              placeholder="Was können Sie diese Woche tun, um von {data.istWert} auf {data.istWert + 1} zu kommen?"
              className="bg-slate-800/50 border-slate-700 min-h-[100px]"
            />
            <Label>Mögliche Hindernisse</Label>
            <Textarea
              value={data.hindernisse}
              onChange={(e) => setData({...data, hindernisse: e.target.value})}
              placeholder="Was könnte Sie davon abhalten? Wie können Sie damit umgehen?"
              className="bg-slate-800/50 border-slate-700 min-h-[100px]"
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
        <CardTitle className="text-2xl">Skalenarbeit</CardTitle>
        <CardDescription>
          Schritt {step} von {steps.length}: {steps[step-1]?.title}
        </CardDescription>
        <div className="w-full bg-slate-800 rounded-full h-2 mt-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}
        
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
              disabled={step === 1 && !data.thema}
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

export default Skalenarbeit;