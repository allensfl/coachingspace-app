import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Play, 
  User, 
  Target, 
  Clock, 
  Plus, 
  Trash2,
  Brain,
  MessageCircle,
  Eye,
  Search,
  Video,
  ExternalLink
} from 'lucide-react';

const coachingApproaches = [
  {
    id: 'solution-focused',
    name: 'Lösungsorientiert',
    description: 'Fokus auf Lösungen und Ressourcen',
    methods: ['Skalierungsfragen', 'Ausnahmeerkundung', 'Wunderfrage'],
    duration: '60-90 min',
    color: 'bg-blue-500'
  },
  {
    id: 'resource-oriented', 
    name: 'Ressourcenorientiert',
    description: 'Stärken und Fähigkeiten aktivieren',
    methods: ['Stärkenanalyse', 'Erfolgsgeschichten', 'Ressourcenmapping'],
    duration: '45-75 min',
    color: 'bg-green-500'
  },
  {
    id: 'systemic',
    name: 'Systemisch', 
    description: 'Systemzusammenhänge erkunden',
    methods: ['Genogramm', 'Systemaufstellung', 'Zirkuläre Fragen'],
    duration: '75-120 min',
    color: 'bg-purple-500'
  },
  {
    id: 'triadic-ai',
    name: 'Triadisches Coaching (mit KI)',
    description: 'Coach, Coachee und KI als dritte Instanz',
    methods: ['KI-Perspektivwechsel', 'Automatische Mustererkennung', 'KI-Reflexionsfragen'],
    duration: '60-90 min',
    requiresAI: true,
    color: 'bg-orange-500'
  },
  {
    id: 'individual',
    name: 'Individueller Ansatz',
    description: 'Flexibler Mix verschiedener Methoden',
    methods: ['Situativ angepasst'],
    duration: 'Variabel',
    color: 'bg-gray-500'
  }
];

const aiRoles = [
  {
    id: 'observer',
    name: 'Beobachter',
    description: 'KI analysiert Kommunikationsmuster und Emotionen',
    icon: Eye
  },
  {
    id: 'questioner', 
    name: 'Fragensteller',
    description: 'KI stellt ergänzende, systemische Fragen',
    icon: MessageCircle
  },
  {
    id: 'pattern-finder',
    name: 'Mustererkenner',
    description: 'KI erkennt wiederkehrende Themen und Blockaden',
    icon: Search
  }
];

export default function SessionPreparationModal({ 
  open, 
  onOpenChange, 
  session, 
  coachee, 
  onStartCoaching 
}) {
  const [selectedApproach, setSelectedApproach] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [selectedAiRole, setSelectedAiRole] = useState('observer');
  const [agenda, setAgenda] = useState([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [externalTools, setExternalTools] = useState({
    zoom: '',
    miro: '',
    custom: []
  });

  const addAgendaItem = () => {
    const newItem = {
      id: Date.now(),
      time: '',
      topic: '',
      method: '',
      duration: 15
    };
    setAgenda([...agenda, newItem]);
  };

  const updateAgendaItem = (id, field, value) => {
    setAgenda(agenda.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeAgendaItem = (id) => {
    setAgenda(agenda.filter(item => item.id !== id));
  };

  const addCustomTool = () => {
    const name = prompt('Name des externen Tools:');
    const url = prompt('URL des Tools:');
    if (name && url) {
      setExternalTools({
        ...externalTools,
        custom: [...externalTools.custom, { name, url }]
      });
    }
  };

  const handleStartCoaching = () => {
    const preparationData = {
      approach: selectedApproach,
      aiEnabled,
      aiRole: selectedAiRole,
      agenda,
      notes: sessionNotes,
      externalTools
    };
    
    console.log('Starting coaching with preparation:', preparationData);
    onStartCoaching(session, preparationData);
    onOpenChange(false);
  };

  const handleReset = () => {
    setSelectedApproach('');
    setAiEnabled(false);
    setSelectedAiRole('observer');
    setAgenda([]);
    setSessionNotes('');
    setExternalTools({ zoom: '', miro: '', custom: [] });
  };

  if (!session || !coachee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900 border-slate-700 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center justify-between">
            <span>Session Vorbereitung</span>
            <div className="text-sm font-normal text-slate-400">
              {coachee.firstName} {coachee.lastName} • {new Date(session.date).toLocaleDateString('de-DE')}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="context" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="context" className="text-slate-300">
              <User className="mr-2 h-4 w-4" />
              Kontext
            </TabsTrigger>
            <TabsTrigger value="approach" className="text-slate-300">
              <Target className="mr-2 h-4 w-4" />
              Ansatz
            </TabsTrigger>
            <TabsTrigger value="agenda" className="text-slate-300">
              <Clock className="mr-2 h-4 w-4" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-slate-300">
              <ExternalLink className="mr-2 h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>

          {/* Kontext Tab */}
          <TabsContent value="context" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-lg">
                    <User className="mr-2 h-5 w-5" />
                    Coachee-Profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-slate-300">
                  <div><strong>Name:</strong> {coachee.firstName} {coachee.lastName}</div>
                  <div><strong>Hauptthema:</strong> {coachee.mainTopic}</div>
                  <div><strong>E-Mail:</strong> {coachee.email}</div>
                  <div><strong>Status:</strong> <Badge variant="secondary">{coachee.status}</Badge></div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-lg">
                    <Target className="mr-2 h-5 w-5" />
                    Coaching-Ziele
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-slate-300">
                  {coachee.goals?.map((goal, index) => (
                    <div key={index} className="p-2 bg-slate-700 rounded text-sm">
                      {goal}
                    </div>
                  )) || <div className="text-slate-400">Keine Ziele definiert</div>}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Session-Notizen</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Vorbereitende Notizen für diese Session..."
                  className="min-h-24 bg-slate-700 border-slate-600 text-slate-300"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ansatz Tab */}
          <TabsContent value="approach" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {coachingApproaches.map((approach) => (
                <Card 
                  key={approach.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedApproach === approach.id 
                      ? 'bg-blue-600/20 border-blue-500' 
                      : 'bg-slate-800 border-slate-600 hover:bg-slate-700'
                  }`}
                  onClick={() => setSelectedApproach(approach.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${approach.color}`} />
                      <CardTitle className="text-white text-base">{approach.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <p className="text-slate-300 text-xs">{approach.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {approach.methods.map((method, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-slate-400 text-xs">Dauer: {approach.duration}</p>
                    {approach.requiresAI && (
                      <Badge className="bg-orange-600 text-xs">KI-Unterstützung</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* KI-Integration wenn triadisch gewählt */}
            {selectedApproach === 'triadic-ai' && (
              <Card className="bg-slate-800 border-orange-500 border-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-orange-500" />
                    KI-Konfiguration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={aiEnabled}
                      onCheckedChange={setAiEnabled}
                    />
                    <span className="text-slate-300">KI-Unterstützung aktivieren</span>
                  </div>
                  
                  {aiEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {aiRoles.map((role) => {
                        const Icon = role.icon;
                        return (
                          <Card 
                            key={role.id}
                            className={`cursor-pointer transition-all ${
                              selectedAiRole === role.id 
                                ? 'bg-orange-600/20 border-orange-500' 
                                : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                            }`}
                            onClick={() => setSelectedAiRole(role.id)}
                          >
                            <CardContent className="p-3 text-center">
                              <Icon className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                              <h4 className="text-white font-medium text-sm">{role.name}</h4>
                              <p className="text-slate-400 text-xs mt-1">{role.description}</p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Agenda Tab */}
          <TabsContent value="agenda" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Agenda planen</h3>
              <Button onClick={addAgendaItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Element hinzufügen
              </Button>
            </div>

            <div className="space-y-2">
              {agenda.map((item) => (
                <Card key={item.id} className="bg-slate-800 border-slate-600">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                      <Input
                        placeholder="Zeit (z.B. 14:00)"
                        value={item.time}
                        onChange={(e) => updateAgendaItem(item.id, 'time', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-slate-300"
                      />
                      <Input
                        placeholder="Thema/Aktivität"
                        value={item.topic}
                        onChange={(e) => updateAgendaItem(item.id, 'topic', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-slate-300"
                      />
                      <Select value={item.method} onValueChange={(value) => updateAgendaItem(item.id, 'method', value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-300">
                          <SelectValue placeholder="Methode wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discussion">Gespräch</SelectItem>
                          <SelectItem value="questions">Fragerunde</SelectItem>
                          <SelectItem value="exercise">Übung</SelectItem>
                          <SelectItem value="reflection">Reflektion</SelectItem>
                          <SelectItem value="planning">Planung</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={item.duration}
                          onChange={(e) => updateAgendaItem(item.id, 'duration', parseInt(e.target.value))}
                          className="w-16 bg-slate-700 border-slate-600 text-slate-300"
                          min="5"
                          max="120"
                        />
                        <span className="text-slate-400 text-sm">min</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeAgendaItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {agenda.length > 0 && (
              <div className="text-slate-300 text-sm">
                <strong>Geschätzte Gesamtdauer: </strong>
                {agenda.reduce((total, item) => total + (item.duration || 0), 0)} Minuten
              </div>
            )}
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-lg">
                    <Video className="mr-2 h-5 w-5" />
                    Video-Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="https://zoom.us/j/..."
                    value={externalTools.zoom}
                    onChange={(e) => setExternalTools({...externalTools, zoom: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-slate-300"
                  />
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-lg">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Kollaborations-Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="https://miro.com/..."
                    value={externalTools.miro}
                    onChange={(e) => setExternalTools({...externalTools, miro: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-slate-300"
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Weitere Tools</CardTitle>
                  <Button onClick={addCustomTool} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Tool hinzufügen
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {externalTools.custom.length > 0 ? (
                  <div className="space-y-2">
                    {externalTools.custom.map((tool, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                        <div>
                          <span className="text-slate-300 font-medium">{tool.name}</span>
                          <p className="text-slate-400 text-xs">{tool.url}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const filtered = externalTools.custom.filter((_, i) => i !== index);
                            setExternalTools({...externalTools, custom: filtered});
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">Keine zusätzlichen Tools konfiguriert</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer mit Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-700">
          <Button variant="outline" onClick={handleReset}>
            Zurücksetzen
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleStartCoaching}
              className="bg-green-600 hover:bg-green-700"
              disabled={!selectedApproach}
            >
              <Play className="mr-2 h-4 w-4" />
              Session starten
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}