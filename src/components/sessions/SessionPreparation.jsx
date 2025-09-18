import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Play, 
  Plus, 
  Trash2, 
  Clock, 
  User, 
  Target, 
  BookOpen,
  Calendar,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';

const SessionPreparation = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const context = useAppStateContext();
  
  const [session, setSession] = useState(null);
  const [coachee, setCoachee] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Preparation state
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [agenda, setAgenda] = useState([]);
  const [sessionGoals, setSessionGoals] = useState('');
  const [preparationNotes, setPreparationNotes] = useState('');

  // Load session data
  useEffect(() => {
    if (context && sessionId) {
      // Find session with type flexibility
      const foundSession = context.sessions?.find(s => 
        s.id === sessionId || s.id === parseInt(sessionId) || String(s.id) === sessionId
      );
      
      if (foundSession) {
        setSession(foundSession);
        
        // Find coachee
        const foundCoachee = context.coachees?.find(c => c.id === foundSession.coacheeId);
        setCoachee(foundCoachee);
        
        // Initialize default agenda
        setAgenda([
          { 
            id: 1, 
            title: 'Check-in & Zielsetzung', 
            method: 'conversation',
            duration: 10,
            notes: 'Wie geht es dem Coachee? Was ist das Ziel für heute?'
          },
          { 
            id: 2, 
            title: 'Hauptteil', 
            method: 'exploration',
            duration: 40,
            notes: 'Kernthema der Session bearbeiten'
          },
          { 
            id: 3, 
            title: 'Abschluss & nächste Schritte', 
            method: 'action-planning',
            duration: 10,
            notes: 'Zusammenfassung und konkrete Maßnahmen'
          }
        ]);
      }
    }
    
    setLoading(false);
  }, [sessionId, context]);

  const coachingApproaches = [
    {
      id: 'solution-focused',
      name: 'Lösungsfokussiert',
      description: 'Fokus auf Lösungen und Ressourcen',
      color: 'bg-blue-500',
      methods: ['scaling', 'miracle-question', 'resource-activation']
    },
    {
      id: 'systemic',
      name: 'Systemisch',
      description: 'Betrachtung des Systems und Beziehungen',
      color: 'bg-green-500',
      methods: ['genogram', 'constellation', 'perspective-change']
    },
    {
      id: 'cognitive',
      name: 'Kognitiv',
      description: 'Arbeit mit Denkmustern',
      color: 'bg-purple-500',
      methods: ['belief-work', 'reframing', 'thought-analysis']
    },
    {
      id: 'gestalt',
      name: 'Gestalt',
      description: 'Hier und Jetzt, Emotionen',
      color: 'bg-orange-500',
      methods: ['empty-chair', 'body-awareness', 'here-now']
    }
  ];

  const methodsLibrary = {
    'conversation': 'Gespräch',
    'exploration': 'Erkundung',
    'action-planning': 'Aktionsplanung',
    'scaling': 'Skalierung',
    'miracle-question': 'Wunderfrage',
    'resource-activation': 'Ressourcenaktivierung',
    'genogram': 'Genogramm',
    'constellation': 'Aufstellung',
    'perspective-change': 'Perspektivwechsel',
    'belief-work': 'Glaubenssatzarbeit',
    'reframing': 'Reframing',
    'thought-analysis': 'Gedankenanalyse',
    'empty-chair': 'Leerer Stuhl',
    'body-awareness': 'Körperwahrnehmung',
    'here-now': 'Hier und Jetzt'
  };

  const updateAgendaItem = (id, field, value) => {
    setAgenda(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addAgendaItem = () => {
    const newItem = {
      id: Date.now(),
      title: 'Neuer Agenda-Punkt',
      method: 'conversation',
      duration: 15,
      notes: ''
    };
    setAgenda(prev => [...prev, newItem]);
  };

  const removeAgendaItem = (id) => {
    setAgenda(prev => prev.filter(item => item.id !== id));
  };

  const handleStartCoaching = () => {
    // Save preparation data to localStorage
    const preparationData = {
      sessionId,
      coacheeId: coachee.id,
      selectedApproach,
      agenda,
      sessionGoals,
      preparationNotes,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`session_prep_${sessionId}`, JSON.stringify(preparationData));
    
    // Navigate to coaching room
    navigate(`/coaching-room/${coachee.id}?session_id=${sessionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Lade Session-Daten...</div>
      </div>
    );
  }

  if (!session || !coachee) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Session oder Coachee nicht gefunden</div>
      </div>
    );
  }

  const totalDuration = agenda.reduce((sum, item) => sum + (item.duration || 0), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/sessions')}
            className="mb-4 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zu Sessions
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Session Vorbereitung</h1>
              <p className="text-slate-400">
                {coachee.name} • {session.scheduledDate ? new Date(session.scheduledDate).toLocaleDateString('de-DE') : 'Datum nicht gesetzt'} • 
                Geplant: {session.duration || 60} Min
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">{totalDuration} Min</div>
              <div className="text-sm text-slate-400">Geplante Agenda</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Coaching Approach */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Coaching-Ansatz wählen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {coachingApproaches.map((approach) => (
                    <div
                      key={approach.id}
                      onClick={() => setSelectedApproach(approach)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedApproach?.id === approach.id
                          ? 'border-white bg-white/10'
                          : 'border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full ${approach.color} mt-1 flex-shrink-0`} />
                        <div>
                          <h3 className="text-white font-semibold text-sm">{approach.name}</h3>
                          <p className="text-slate-400 text-xs mt-1">{approach.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Session Agenda */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Session-Ablauf ({totalDuration} Min)
                  </span>
                  <Button onClick={addAgendaItem} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Punkt hinzufügen
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agenda.map((item, index) => (
                    <div key={item.id} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder="Agenda-Punkt Titel"
                            value={item.title}
                            onChange={(e) => updateAgendaItem(item.id, 'title', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                          
                          <div className="grid grid-cols-2 gap-3">
                            <Select 
                              value={item.method}
                              onValueChange={(value) => updateAgendaItem(item.id, 'method', value)}
                            >
                              <SelectTrigger className="bg-slate-700 border-slate-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(methodsLibrary).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Select 
                              value={String(item.duration)}
                              onValueChange={(value) => updateAgendaItem(item.id, 'duration', parseInt(value))}
                            >
                              <SelectTrigger className="bg-slate-700 border-slate-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5 Min</SelectItem>
                                <SelectItem value="10">10 Min</SelectItem>
                                <SelectItem value="15">15 Min</SelectItem>
                                <SelectItem value="20">20 Min</SelectItem>
                                <SelectItem value="30">30 Min</SelectItem>
                                <SelectItem value="45">45 Min</SelectItem>
                                <SelectItem value="60">60 Min</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Textarea
                            placeholder="Notizen zu diesem Punkt..."
                            value={item.notes}
                            onChange={(e) => updateAgendaItem(item.id, 'notes', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            rows={2}
                          />
                        </div>
                        
                        <Button
                          onClick={() => removeAgendaItem(item.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Session Goals & Notes */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Ziele & Notizen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm font-medium block mb-2">
                    Session-Ziele
                  </label>
                  <Textarea
                    placeholder="Was soll in dieser Session erreicht werden?"
                    value={sessionGoals}
                    onChange={(e) => setSessionGoals(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-slate-300 text-sm font-medium block mb-2">
                    Vorbereitungsnotizen
                  </label>
                  <Textarea
                    placeholder="Wichtige Punkte, Fragen, Bedenken..."
                    value={preparationNotes}
                    onChange={(e) => setPreparationNotes(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Session Overview */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Session-Übersicht
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Coachee:</span>
                  <span className="text-white">{coachee.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400">{session.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Geplant:</span>
                  <span className="text-white">{session.duration || 60} Min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Agenda:</span>
                  <span className="text-white">{totalDuration} Min</span>
                </div>
              </CardContent>
            </Card>

            {/* Selected Approach Info */}
            {selectedApproach && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <div className={`w-4 h-4 rounded-full ${selectedApproach.color} mr-2`} />
                    {selectedApproach.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-3">{selectedApproach.description}</p>
                  <div className="text-xs text-slate-400">
                    Typische Methoden: {selectedApproach.methods.map(m => methodsLibrary[m]).join(', ')}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preparation Checklist */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Vorbereitung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className={`w-4 h-4 mt-0.5 ${selectedApproach ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-slate-300">Coaching-Ansatz gewählt</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className={`w-4 h-4 mt-0.5 ${agenda.length > 0 ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-slate-300">Agenda erstellt</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className={`w-4 h-4 mt-0.5 ${sessionGoals ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-slate-300">Ziele definiert</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className={`w-4 h-4 mt-0.5 ${Math.abs(totalDuration - (session.duration || 60)) <= 10 ? 'text-emerald-400' : 'text-yellow-400'}`} />
                    <span className="text-slate-300">Zeiten abgestimmt</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Start Session Button */}
            <Button 
              onClick={handleStartCoaching}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Coaching starten
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPreparation;