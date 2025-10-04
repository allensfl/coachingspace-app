import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Plus, Trash2, Users, MessageSquare, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

const InneresTeam = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [thema, setThema] = useState('');
  const [teammitglieder, setTeammitglieder] = useState([]);
  const [neuesMitglied, setNeuesMitglied] = useState({ 
    name: '', 
    stimme: '', 
    gefuehl: '',
    beduerfrnis: '',
    farbe: '#3b82f6' 
  });
  const [showAddMitglied, setShowAddMitglied] = useState(false);
  const [dialog, setDialog] = useState([]);
  const [aktuellerSprecher, setAktuellerSprecher] = useState(null);
  const [neueAussage, setNeueAussage] = useState('');
  const [konfliktbearbeitung, setKonfliktbearbeitung] = useState('');
  const [vereinbarung, setVereinbarung] = useState('');

  const farben = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#06b6d4'
  ];

  const beispielStimmen = [
    { name: 'Der Perfektionist', stimme: 'Das muss perfekt werden!', gefuehl: 'Angst vor Fehlern', beduerfrnis: 'Sicherheit durch Perfektion' },
    { name: 'Der Pragmatiker', stimme: 'Lass uns praktisch bleiben', gefuehl: 'Wunsch nach Effizienz', beduerfrnis: 'Schnelle Ergebnisse' },
    { name: 'Der Träumer', stimme: 'Was wäre wenn...', gefuehl: 'Sehnsucht nach Möglichkeiten', beduerfrnis: 'Kreativität und Freiheit' },
    { name: 'Der Kritiker', stimme: 'Das wird nie funktionieren', gefuehl: 'Schutz vor Enttäuschung', beduerfrnis: 'Sicherheit' },
    { name: 'Der Mutige', stimme: 'Einfach machen!', gefuehl: 'Tatendrang', beduerfrnis: 'Action und Fortschritt' },
    { name: 'Der Vorsichtige', stimme: 'Wir sollten das nochmal überdenken', gefuehl: 'Sorge', beduerfrnis: 'Absicherung' },
    { name: 'Die Harmoniesuchende', stimme: 'Alle sollen zufrieden sein', gefuehl: 'Wunsch nach Frieden', beduerfrnis: 'Ausgleich' },
    { name: 'Der Ehrgeizige', stimme: 'Wir können mehr erreichen!', gefuehl: 'Ambition', beduerfrnis: 'Erfolg und Anerkennung' }
  ];

  const beispielSchnellhinzufuegen = (beispiel) => {
    const farbe = farben[teammitglieder.length % farben.length];
    setTeammitglieder([...teammitglieder, { ...beispiel, id: Date.now(), farbe }]);
  };

  const steps = [
    { title: 'Thema definieren', description: 'Welches Thema oder welche Entscheidung beschäftigt Sie?' },
    { title: 'Team sammeln', description: 'Welche inneren Stimmen melden sich zu Wort?' },
    { title: 'Dialog führen', description: 'Lassen Sie die Stimmen miteinander sprechen' },
    { title: 'Konflikte bearbeiten', description: 'Wo gibt es Spannungen zwischen den Stimmen?' },
    { title: 'Vereinbarung treffen', description: 'Welche Entscheidung ergibt sich daraus?' }
  ];

  const mitgliedHinzufuegen = () => {
    if (neuesMitglied.name.trim() && neuesMitglied.stimme.trim()) {
      setTeammitglieder([...teammitglieder, { ...neuesMitglied, id: Date.now() }]);
      setNeuesMitglied({ 
        name: '', 
        stimme: '', 
        gefuehl: '', 
        beduerfrnis: '',
        farbe: farben[teammitglieder.length % farben.length] 
      });
      setShowAddMitglied(false);
    }
  };

  const mitgliedLoeschen = (id) => {
    setTeammitglieder(teammitglieder.filter(m => m.id !== id));
    setDialog(dialog.filter(d => d.mitgliedId !== id));
  };

  const aussageHinzufuegen = () => {
    if (aktuellerSprecher && neueAussage.trim()) {
      const mitglied = teammitglieder.find(m => m.id === aktuellerSprecher);
      setDialog([
        ...dialog,
        {
          mitgliedId: aktuellerSprecher,
          name: mitglied.name,
          farbe: mitglied.farbe,
          aussage: neueAussage,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setNeueAussage('');
    }
  };

  const handleExport = () => {
    const content = `
INNERES TEAM - SESSION EXPORT
==============================
nach Friedemann Schulz von Thun

THEMA/ENTSCHEIDUNG
${thema}

TEAMMITGLIEDER
${teammitglieder.map((m, i) => `
${i + 1}. ${m.name}
   Stimme: "${m.stimme}"
   ${m.gefuehl ? `Gefühl: ${m.gefuehl}` : ''}
   ${m.beduerfrnis ? `Bedürfnis: ${m.beduerfrnis}` : ''}
`).join('\n')}

DIALOG
${dialog.map(d => `[${d.timestamp}] ${d.name}: ${d.aussage}`).join('\n')}

KONFLIKTBEARBEITUNG
${konfliktbearbeitung}

VEREINBARUNG/ENTSCHEIDUNG
${vereinbarung}

Generiert: ${new Date().toLocaleString('de-DE')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inneres-team-${thema.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                Das Innere Team hilft bei Entscheidungen und inneren Konflikten. Verschiedene Persönlichkeitsanteile 
                werden als "Teammitglieder" visualisiert und können miteinander in Dialog treten.
              </p>
            </div>
            <Label>Welches Thema oder welche Entscheidung beschäftigt Sie?</Label>
            <Input
              value={thema}
              onChange={(e) => setThema(e.target.value)}
              placeholder="z.B. Jobwechsel, Beziehungsfrage, schwierige Entscheidung..."
              className="bg-slate-800/50 border-slate-700"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Beispiel-Stimmen Schnellauswahl */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <Label className="mb-3 block">Schnell-Auswahl: Häufige Stimmen</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {beispielStimmen.map((beispiel, i) => (
                  <button
                    key={i}
                    onClick={() => beispielSchnellhinzufuegen(beispiel)}
                    className="text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors"
                  >
                    <div className="text-white text-sm font-medium">{beispiel.name}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">{beispiel.stimme}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Label className="text-lg">Teammitglieder ({teammitglieder.length})</Label>
              <Button
                size="sm"
                onClick={() => setShowAddMitglied(!showAddMitglied)}
                variant="outline"
                className="border-slate-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Eigene Stimme
              </Button>
            </div>

            {showAddMitglied && (
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <Input
                  placeholder="Name (z.B. Der Vorsichtige, Die Mutige, Der Perfektionist)"
                  value={neuesMitglied.name}
                  onChange={(e) => setNeuesMitglied({...neuesMitglied, name: e.target.value})}
                  className="bg-slate-900/50 border-slate-700"
                />
                <Textarea
                  placeholder='Was sagt diese Stimme? (z.B. "Tu es nicht, es ist zu riskant!")'
                  value={neuesMitglied.stimme}
                  onChange={(e) => setNeuesMitglied({...neuesMitglied, stimme: e.target.value})}
                  className="bg-slate-900/50 border-slate-700 min-h-[80px]"
                />
                <Input
                  placeholder="Welches Gefühl steckt dahinter? (optional)"
                  value={neuesMitglied.gefuehl}
                  onChange={(e) => setNeuesMitglied({...neuesMitglied, gefuehl: e.target.value})}
                  className="bg-slate-900/50 border-slate-700"
                />
                <Input
                  placeholder="Welches Bedürfnis hat diese Stimme? (optional)"
                  value={neuesMitglied.beduerfrnis}
                  onChange={(e) => setNeuesMitglied({...neuesMitglied, beduerfrnis: e.target.value})}
                  className="bg-slate-900/50 border-slate-700"
                />
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={neuesMitglied.farbe}
                    onChange={(e) => setNeuesMitglied({...neuesMitglied, farbe: e.target.value})}
                    className="w-20 h-10 bg-slate-900/50 border-slate-700"
                  />
                  <Button onClick={mitgliedHinzufuegen} className="flex-1">
                    Hinzufügen
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddMitglied(false)}
                    className="border-slate-700"
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {teammitglieder.length === 0 ? (
                <div className="bg-slate-800/50 rounded-lg p-8 text-center text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  Noch keine Teammitglieder. Fügen Sie innere Stimmen hinzu.
                </div>
              ) : (
                teammitglieder.map((mitglied) => (
                  <div
                    key={mitglied.id}
                    className="bg-slate-800/50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: mitglied.farbe }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-white">{mitglied.name}</div>
                          <div className="text-sm text-slate-300 mt-1">💬 "{mitglied.stimme}"</div>
                          {mitglied.gefuehl && (
                            <div className="text-xs text-slate-400 mt-1">Gefühl: {mitglied.gefuehl}</div>
                          )}
                          {mitglied.beduerfrnis && (
                            <div className="text-xs text-slate-400">Bedürfnis: {mitglied.beduerfrnis}</div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => mitgliedLoeschen(mitglied.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-sm text-purple-300">
                Lassen Sie die Stimmen miteinander sprechen. Was sagen sie zueinander? Wo sind sie einig, wo unterschiedlich?
              </p>
            </div>

            {teammitglieder.length === 0 ? (
              <div className="bg-slate-800/50 rounded-lg p-8 text-center text-slate-400">
                Fügen Sie erst Teammitglieder hinzu (Schritt 2)
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {teammitglieder.map((mitglied) => (
                    <Button
                      key={mitglied.id}
                      size="sm"
                      onClick={() => setAktuellerSprecher(mitglied.id)}
                      variant={aktuellerSprecher === mitglied.id ? 'default' : 'outline'}
                      className={`justify-start ${aktuellerSprecher === mitglied.id ? '' : 'border-slate-700'}`}
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: mitglied.farbe }}
                      />
                      {mitglied.name}
                    </Button>
                  ))}
                </div>

                {aktuellerSprecher && (
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: teammitglieder.find(m => m.id === aktuellerSprecher)?.farbe }}
                      />
                      <span className="font-semibold text-sm">
                        {teammitglieder.find(m => m.id === aktuellerSprecher)?.name} sagt:
                      </span>
                    </div>
                    <Textarea
                      value={neueAussage}
                      onChange={(e) => setNeueAussage(e.target.value)}
                      placeholder="Was möchte diese Stimme im Dialog sagen?"
                      className="bg-slate-900/50 border-slate-700 min-h-[80px]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          aussageHinzufuegen();
                        }
                      }}
                    />
                    <Button onClick={aussageHinzufuegen} disabled={!neueAussage.trim()} className="w-full">
                      Zum Dialog hinzufügen
                    </Button>
                  </div>
                )}

                <div className="bg-slate-800/50 rounded-lg p-4 space-y-3 max-h-80 overflow-y-auto">
                  <Label>Dialog-Verlauf:</Label>
                  {dialog.length === 0 ? (
                    <div className="text-center text-slate-400 py-4 text-sm">
                      Noch keine Dialog-Beiträge. Wählen Sie eine Stimme und lassen Sie sie sprechen.
                    </div>
                  ) : (
                    dialog.map((eintrag, index) => (
                      <div key={index} className="space-y-1 pb-3 border-b border-slate-700 last:border-0">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{eintrag.timestamp}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div
                            className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                            style={{ backgroundColor: eintrag.farbe }}
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-sm">{eintrag.name}:</span>
                            <p className="text-sm text-slate-300 mt-1">{eintrag.aussage}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="text-sm text-orange-300">
                Wo gibt es Spannungen zwischen den Stimmen? Welche Bedürfnisse stehen im Konflikt?
              </p>
            </div>
            <Label>Konfliktbearbeitung</Label>
            <Textarea
              value={konfliktbearbeitung}
              onChange={(e) => setKonfliktbearbeitung(e.target.value)}
              placeholder="Welche Konflikte oder Spannungen zeigen sich? Wie können diese Stimmen einen Kompromiss finden?"
              className="bg-slate-800/50 border-slate-700 min-h-[150px]"
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-sm text-green-300">
                Was sagt Ihnen dieser Dialog? Welche Entscheidung oder Vereinbarung ergibt sich daraus?
              </p>
            </div>
            <Label>Vereinbarung & Entscheidung</Label>
            <Textarea
              value={vereinbarung}
              onChange={(e) => setVereinbarung(e.target.value)}
              placeholder="Welche Entscheidung treffen Sie? Wie können alle Stimmen berücksichtigt werden?"
              className="bg-slate-800/50 border-slate-700 min-h-[150px]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-900/95 border-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Users className="w-6 h-6" />
          Inneres Team nach Schulz von Thun
        </CardTitle>
        <CardDescription>
          Schritt {step} von {steps.length}: {steps[step - 1].title}
        </CardDescription>
        <div className="w-full bg-slate-800 rounded-full h-2 mt-4">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-sm text-slate-300">{steps[step - 1].description}</p>
        </div>

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
              disabled={step === 1 && !thema}
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

export default InneresTeam;