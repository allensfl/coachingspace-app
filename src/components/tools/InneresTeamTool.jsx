import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Download, RotateCcw, Plus, Trash2, Crown, MessageSquare } from 'lucide-react';

const InneresTeamTool = () => {
  const [situation, setSituation] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [dialogue, setDialogue] = useState([]);
  const [teamLeader, setTeamLeader] = useState(null);
  const [solution, setSolution] = useState('');
  const [notes, setNotes] = useState('');

  const phases = [
    { id: 0, title: 'Setup', icon: '🎯', description: 'Situation definieren und Team-Mitglieder sammeln' },
    { id: 1, title: 'Exploration', icon: '🔍', description: 'Jede Stimme detailliert verstehen' },
    { id: 2, title: 'Dialog', icon: '💬', description: 'Gespräch zwischen den Stimmen moderieren' },
    { id: 3, title: 'Lösung', icon: '✨', description: 'Konsens finden und Team-Leitung bestimmen' }
  ];

  const beispielStimmen = [
    { name: 'Der Perfektionist', voice: 'Das muss perfekt werden!', feeling: 'Angst vor Fehlern', color: '#EF4444' },
    { name: 'Der Pragmatiker', voice: 'Lass uns praktisch bleiben', feeling: 'Wunsch nach Effizienz', color: '#10B981' },
    { name: 'Der Träumer', voice: 'Was wäre wenn...', feeling: 'Sehnsucht nach Möglichkeiten', color: '#8B5CF6' },
    { name: 'Der Kritiker', voice: 'Das wird nie funktionieren', feeling: 'Schutz vor Enttäuschung', color: '#F59E0B' },
    { name: 'Der Mutige', voice: 'Einfach machen!', feeling: 'Drang nach Aktion', color: '#06B6D4' },
    { name: 'Der Ängstliche', voice: 'Was wenn es schiefgeht?', feeling: 'Sorge um Sicherheit', color: '#EC4899' },
    { name: 'Der Analytiker', voice: 'Lass uns das durchdenken', feeling: 'Bedürfnis nach Klarheit', color: '#3B82F6' },
    { name: 'Der Genießer', voice: 'Denk auch an dein Wohlbefinden', feeling: 'Sehnsucht nach Balance', color: '#84CC16' }
  ];

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#84CC16', '#EC4899'];

  const addTeamMember = (beispiel = null) => {
    const newMember = beispiel || {
      id: Date.now(),
      name: '',
      voice: '',
      feeling: '',
      strength: 5,
      color: colors[teamMembers.length % colors.length]
    };
    
    if (beispiel) {
      newMember.id = Date.now();
      newMember.strength = 5;
    }
    
    setTeamMembers([...teamMembers, newMember]);
  };

  const updateTeamMember = (id, field, value) => {
    setTeamMembers(teamMembers.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const removeTeamMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    if (teamLeader === id) setTeamLeader(null);
  };

  const addDialogueEntry = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    const entry = {
      id: Date.now(),
      memberId,
      memberName: member.name,
      color: member.color,
      message: '',
      timestamp: new Date().toISOString()
    };
    setDialogue([...dialogue, entry]);
  };

  const updateDialogueEntry = (id, message) => {
    setDialogue(dialogue.map(entry =>
      entry.id === id ? { ...entry, message } : entry
    ));
  };

  const removeDialogueEntry = (id) => {
    setDialogue(dialogue.filter(entry => entry.id !== id));
  };

  const exportSession = () => {
    const leaderName = teamMembers.find(m => m.id === teamLeader)?.name || 'Nicht festgelegt';
    
    const exportText = `
INNERES TEAM ANALYSE
====================
Datum: ${new Date().toLocaleDateString('de-DE')}

SITUATION:
${situation}

TEAM-MITGLIEDER:
${teamMembers.map((m, i) => `
${i + 1}. ${m.name}${m.id === teamLeader ? ' 👑 (Team-Leitung)' : ''}
   Stimme: "${m.voice}"
   Gefühl: ${m.feeling}
   Stärke/Einfluss: ${m.strength}/10
`).join('\n')}

DIALOG:
${dialogue.map(entry => `
[${new Date(entry.timestamp).toLocaleTimeString('de-DE')}] ${entry.memberName}:
${entry.message}
`).join('\n')}

TEAM-LEITUNG:
${leaderName}

LÖSUNG/KONSENS:
${solution}

COACH-NOTIZEN:
${notes}
    `.trim();

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inneres_team_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const reset = () => {
    if (confirm('Möchten Sie wirklich eine neue Session starten?')) {
      setSituation('');
      setTeamMembers([]);
      setDialogue([]);
      setTeamLeader(null);
      setSolution('');
      setNotes('');
      setCurrentPhase(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">👥 Inneres Team</h1>
          <p className="text-slate-400">Nach Schulz von Thun: Dialog zwischen Persönlichkeitsanteilen</p>
        </div>

        {/* Phase Navigation */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setCurrentPhase(phase.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentPhase === phase.id
                  ? 'bg-slate-700 border-blue-500'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-2xl mb-2">{phase.icon}</div>
              <div className={`font-semibold mb-1 text-sm ${currentPhase === phase.id ? 'text-white' : 'text-slate-400'}`}>
                {phase.title}
              </div>
              <div className="text-xs text-slate-500">{phase.description}</div>
            </button>
          ))}
        </div>

        {/* Phase 0: Setup */}
        {currentPhase === 0 && (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Situation definieren</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="Beschreiben Sie die Situation oder Entscheidung, bei der Sie verschiedene innere Stimmen wahrnehmen..."
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Team-Mitglieder</CardTitle>
                  <Button
                    onClick={() => addTeamMember()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Eigene Stimme
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Beispiel-Stimmen */}
                <div>
                  <p className="text-sm text-slate-400 mb-3">Schnell-Auswahl typischer Stimmen:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {beispielStimmen.map((beispiel, i) => (
                      <button
                        key={i}
                        onClick={() => addTeamMember(beispiel)}
                        className="text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors"
                      >
                        <div className="text-white text-sm font-medium">{beispiel.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{beispiel.voice}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Added Team Members */}
                {teamMembers.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <p className="text-sm text-slate-300 font-medium">Ihr Team ({teamMembers.length} Stimmen):</p>
                    {teamMembers.map((member) => (
                      <Card key={member.id} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div 
                              className="w-3 h-3 rounded-full mt-1"
                              style={{ backgroundColor: member.color }}
                            />
                            <Button
                              onClick={() => removeTeamMember(member.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 -mt-2 -mr-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input
                            value={member.name}
                            onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                            placeholder="Name der Stimme"
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                          <Input
                            value={member.voice}
                            onChange={(e) => updateTeamMember(member.id, 'voice', e.target.value)}
                            placeholder='Was sagt diese Stimme? z.B. "Das schaffst du nicht!"'
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                          <Input
                            value={member.feeling}
                            onChange={(e) => updateTeamMember(member.id, 'feeling', e.target.value)}
                            placeholder="Welches Gefühl steckt dahinter?"
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Phase 1: Exploration */}
        {currentPhase === 1 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Stimmen erforschen</CardTitle>
              <p className="text-slate-400 text-sm mt-2">
                Wie stark ist jede Stimme? Wie viel Einfluss hat sie auf Ihre Entscheidung?
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {teamMembers.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  Bitte fügen Sie zuerst Team-Mitglieder im Setup hinzu.
                </p>
              ) : (
                teamMembers.map((member) => (
                  <Card key={member.id} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: member.color }}
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium">{member.name}</div>
                          <div className="text-sm text-slate-400">"{member.voice}"</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-300">Stärke/Einfluss</span>
                          <span className="text-lg font-bold" style={{ color: member.color }}>
                            {member.strength}/10
                          </span>
                        </div>
                        <Slider
                          value={[member.strength]}
                          onValueChange={(value) => updateTeamMember(member.id, 'strength', value[0])}
                          min={0}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded">
                        Gefühl: {member.feeling}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Phase 2: Dialog */}
        {currentPhase === 2 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Dialog moderieren</CardTitle>
              <p className="text-slate-400 text-sm mt-2">
                Lassen Sie die verschiedenen Stimmen miteinander sprechen. Was sagt jede zur Situation?
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Dialog Entry Buttons */}
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((member) => (
                  <Button
                    key={member.id}
                    onClick={() => addDialogueEntry(member.id)}
                    size="sm"
                    style={{ 
                      backgroundColor: member.color + '20',
                      borderColor: member.color,
                      color: member.color
                    }}
                    className="border"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {member.name}
                  </Button>
                ))}
              </div>

              {/* Dialog Entries */}
              <div className="space-y-3 mt-6">
                {dialogue.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    Klicken Sie auf eine Stimme oben, um einen Dialog-Eintrag hinzuzufügen.
                  </p>
                ) : (
                  dialogue.map((entry) => (
                    <Card 
                      key={entry.id} 
                      className="border-l-4"
                      style={{ borderLeftColor: entry.color }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium" style={{ color: entry.color }}>
                              {entry.memberName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(entry.timestamp).toLocaleTimeString('de-DE')}
                            </div>
                          </div>
                          <Button
                            onClick={() => removeDialogueEntry(entry.id)}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={entry.message}
                          onChange={(e) => updateDialogueEntry(entry.id, e.target.value)}
                          placeholder="Was möchte diese Stimme sagen? Wie reagiert sie auf andere Stimmen?"
                          rows={3}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phase 3: Solution */}
        {currentPhase === 3 && (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Team-Leitung bestimmen</CardTitle>
                <p className="text-slate-400 text-sm mt-2">
                  Welche Stimme sollte in dieser Situation die Führung übernehmen?
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teamMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setTeamLeader(member.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        teamLeader === member.id
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: member.color }}
                          />
                          <span className="text-white font-medium">{member.name}</span>
                        </div>
                        {teamLeader === member.id && (
                          <Crown className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="text-sm text-slate-400">"{member.voice}"</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Stärke: {member.strength}/10
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Lösung & Konsens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Wie lautet der Konsens? Welche Entscheidung oder nächsten Schritte ergeben sich aus dem Dialog?"
                  rows={5}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />

                <div className="border-t border-slate-700 pt-4">
                  <label className="text-sm text-slate-300 block mb-2">
                    Coach-Notizen
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ihre Beobachtungen, Muster, Follow-up-Ideen..."
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {currentPhase < 3 && (
            <Button
              onClick={() => setCurrentPhase(currentPhase + 1)}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
            >
              Weiter zur nächsten Phase
            </Button>
          )}
          {currentPhase === 3 && (
            <Button
              onClick={exportSession}
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Session exportieren
            </Button>
          )}
          <Button
            onClick={reset}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Zurücksetzen
          </Button>
        </div>

        {/* Team Overview */}
        {teamMembers.length > 0 && (
          <Card className="mt-6 bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Team-Übersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{teamMembers.length}</div>
                  <div className="text-xs text-slate-400">Stimmen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{dialogue.length}</div>
                  <div className="text-xs text-slate-400">Dialog-Einträge</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {(teamMembers.reduce((sum, m) => sum + m.strength, 0) / teamMembers.length).toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400">Ø Stärke</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">
                    {teamLeader ? '👑' : '❓'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {teamLeader ? 'Leitung gewählt' : 'Keine Leitung'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InneresTeamTool;