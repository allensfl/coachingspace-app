import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, X, Plus, Filter, Calendar, Heart, Star, Brain, Target, Users, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';

// Mock-Daten für Reflexions-Einträge
const mockReflectionEntries = [
  { 
    id: 1, 
    coacheeId: 1, 
    coacheeName: "Anna Schmidt", 
    title: "Session-Reflexion: Führungsstil entwickeln", 
    content: "Die Session mit Anna verlief sehr konstruktiv. Sie zeigte große Bereitschaft zur Selbstreflexion. Mein systemischer Ansatz mit der Aufstellungsarbeit hat gut funktioniert. Nächstes Mal möchte ich mehr auf ihre Körpersprache achten.",
    date: "2024-01-15T14:30:00", 
    reflectionType: "session",
    insights: ["Systemische Methoden wirken bei Anna", "Körpersprache beachten", "Selbstreflexion stärken"],
    category: "leadership",
    coachingMethod: "systemisch",
    effectiveness: 4,
    isPrivate: false
  },
  { 
    id: 2, 
    coacheeId: 2, 
    coacheeName: "Max Weber", 
    title: "Selbstreflexion: Herausfordernde Session", 
    content: "Max war heute sehr widerständig gegen Veränderungen. Ich merkte, wie meine eigene Ungeduld aufkam. Das war ein wichtiger Lernmoment für mich - ich muss an meiner eigenen Gelassenheit arbeiten und verschiedene Zugänge ausprobieren.",
    date: "2024-01-20T19:15:00", 
    reflectionType: "self",
    insights: ["Eigene Ungeduld erkannt", "Widerstand als Information nutzen", "Verschiedene Zugänge entwickeln"],
    category: "self-development",
    coachingMethod: "lösungsorientiert",
    effectiveness: 2,
    isPrivate: true
  },
  { 
    id: 3, 
    coacheeId: 1, 
    coacheeName: "Anna Schmidt", 
    title: "Methodenreflexion: Visualisierungstechniken", 
    content: "Die eingesetzte Visualisierungstechnik hat bei Anna einen Durchbruch bewirkt. Sie konnte ihre Ziele viel klarer formulieren. Diese Methode werde ich in mein Standard-Repertoire aufnehmen und weiter verfeinern.",
    date: "2024-01-25T10:45:00", 
    reflectionType: "method",
    insights: ["Visualisierung sehr effektiv", "In Standard-Repertoire aufnehmen", "Technik weiter verfeinern"],
    category: "methods",
    coachingMethod: "visualisierung",
    effectiveness: 5,
    isPrivate: false
  },
  { 
    id: 4, 
    coacheeId: null, 
    coacheeName: null, 
    title: "Wochenreflexion: Muster in meiner Coaching-Praxis", 
    content: "Diese Woche fiel mir auf, dass ich bei Konflikthemen oft zu schnell in die Lösungsfindung gehe. Ich sollte mehr Zeit für das Verstehen und Würdigen des Problems einplanen. Auch meine Fragetechnik kann ich noch verfeinern - weniger 'Warum', mehr 'Wie' und 'Was'.",
    date: "2024-02-01T16:20:00", 
    reflectionType: "weekly",
    insights: ["Zu schnell in Lösung", "Mehr Zeit für Problemverständnis", "Fragetechnik verbessern"],
    category: "patterns",
    coachingMethod: "allgemein",
    effectiveness: 3,
    isPrivate: true
  }
];

// Reflexions-Templates für verschiedene Arten der Selbstreflexion
const reflectionTemplates = {
  session: {
    title: "Session-Reflexion",
    prompts: [
      "Was lief in der Session besonders gut?",
      "Welche Coaching-Methoden haben funktioniert?",
      "Was würde ich beim nächsten Mal anders machen?",
      "Welche Reaktionen des Coachees haben mich überrascht?",
      "Wie war die Beziehungsqualität heute?"
    ]
  },
  self: {
    title: "Selbstreflexion",
    prompts: [
      "Wie habe ich mich heute als Coach gefühlt?",
      "Welche eigenen Themen sind aufgetaucht?",
      "Wo bin ich an meine Grenzen gestoßen?",
      "Was habe ich über mich gelernt?",
      "Welche persönliche Entwicklung nehme ich wahr?"
    ]
  },
  method: {
    title: "Methodenreflexion", 
    prompts: [
      "Wie effektiv war die eingesetzte Methode?",
      "Was hat besonders gut funktioniert?",
      "Welche Anpassungen würde ich vornehmen?",
      "Für welche Klient*innen ist diese Methode geeignet?",
      "Wie kann ich die Methode weiterentwickeln?"
    ]
  },
  weekly: {
    title: "Wochenreflexion",
    prompts: [
      "Welche Muster erkenne ich in meiner Coaching-Praxis?",
      "Was waren die wichtigsten Lernmomente der Woche?",
      "Welche Herausforderungen sind wiederholt aufgetreten?",
      "Wie hat sich meine Coaching-Kompetenz entwickelt?",
      "Was möchte ich nächste Woche verbessern oder ausprobieren?"
    ]
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getReflectionTypeIcon = (type) => {
  const typeConfig = {
    session: { icon: <Users className="w-4 h-4" />, color: 'text-blue-400', label: 'Session' },
    self: { icon: <Brain className="w-4 h-4" />, color: 'text-purple-400', label: 'Selbstreflexion' },
    method: { icon: <Target className="w-4 h-4" />, color: 'text-green-400', label: 'Methode' },
    weekly: { icon: <TrendingUp className="w-4 h-4" />, color: 'text-orange-400', label: 'Wochenreflexion' }
  };
  
  return typeConfig[type] || typeConfig.session;
};

const getCategoryBadge = (category) => {
  const categoryConfig = {
    leadership: { label: 'Führung', color: 'bg-purple-600' },
    'self-development': { label: 'Selbstentwicklung', color: 'bg-green-600' },
    methods: { label: 'Methoden', color: 'bg-blue-600' },
    patterns: { label: 'Muster', color: 'bg-orange-600' },
    relationship: { label: 'Beziehung', color: 'bg-pink-600' }
  };
  
  const config = categoryConfig[category] || { label: category, color: 'bg-gray-600' };
  return (
    <Badge className={`${config.color} text-white`}>
      {config.label}
    </Badge>
  );
};

const EffectivenessStars = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`w-3 h-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} 
        />
      ))}
      <span className="text-xs text-slate-400 ml-1">({rating}/5)</span>
    </div>
  );
};

export default function Reflexionstagebuch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest, effectiveness
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    reflectionType: 'session',
    category: 'leadership',
    coacheeId: '',
    coachingMethod: '',
    effectiveness: 3,
    insights: [],
    isPrivate: false
  });
  
  // URL-Parameter auslesen
  const coacheeFilter = searchParams.get('coachee');
  const nameFilter = searchParams.get('name');
  
  // Gefilterte Reflexions-Einträge
  const filteredEntries = useMemo(() => {
    let filtered = mockReflectionEntries;
    
    // Nach Coachee-ID filtern (URL-Parameter)
    if (coacheeFilter) {
      filtered = filtered.filter(entry => entry.coacheeId === parseInt(coacheeFilter));
    }
    
    // Nach Suchbegriff filtern
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.coacheeName && entry.coacheeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        entry.insights.some(insight => insight.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sortierung anwenden
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'effectiveness':
          return (b.effectiveness || 0) - (a.effectiveness || 0);
        case 'newest':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  }, [coacheeFilter, searchTerm, sortOrder]);
  
  // Statistiken berechnen
  const stats = useMemo(() => {
    const total = filteredEntries.length;
    const sessionReflections = filteredEntries.filter(entry => entry.reflectionType === 'session').length;
    const selfReflections = filteredEntries.filter(entry => entry.reflectionType === 'self').length;
    const avgEffectiveness = filteredEntries.reduce((sum, entry) => sum + (entry.effectiveness || 0), 0) / total || 0;
    const thisWeek = filteredEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length;
    
    return { total, sessionReflections, selfReflections, avgEffectiveness: avgEffectiveness.toFixed(1), thisWeek };
  }, [filteredEntries]);
  
  // Filter entfernen
  const clearCoacheeFilter = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('coachee');
    newParams.delete('name');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleCreateEntry = () => {
    // Hier würde die Speicher-Logik implementiert werden
    console.log('Neue Reflexion erstellen:', newEntry);
    setShowNewEntryDialog(false);
    setNewEntry({
      title: '',
      content: '',
      reflectionType: 'session',
      category: 'leadership',
      coacheeId: '',
      coachingMethod: '',
      effectiveness: 3,
      insights: [],
      isPrivate: false
    });
  };

  const currentTemplate = reflectionTemplates[newEntry.reflectionType] || reflectionTemplates.session;
  
  return (
    <div className="space-y-6">
      {/* Header mit Filter-Anzeige */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Reflexionstagebuch</h1>
          <p className="text-slate-400 mt-1">Analysieren Sie Ihre Coaching-Praxis und fördern Sie Ihr Wachstum</p>
          {coacheeFilter && nameFilter && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Gefiltert nach: {decodeURIComponent(nameFilter)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  onClick={clearCoacheeFilter}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          )}
        </div>
        
        <Dialog open={showNewEntryDialog} onOpenChange={setShowNewEntryDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Neue Reflexion
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl glass-card border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Neue Reflexion erstellen</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Reflexionsart
                  </label>
                  <Select 
                    value={newEntry.reflectionType} 
                    onValueChange={(value) => setNewEntry({...newEntry, reflectionType: value})}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="session" className="text-white">Session-Reflexion</SelectItem>
                      <SelectItem value="self" className="text-white">Selbstreflexion</SelectItem>
                      <SelectItem value="method" className="text-white">Methodenreflexion</SelectItem>
                      <SelectItem value="weekly" className="text-white">Wochenreflexion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Kategorie
                  </label>
                  <Select 
                    value={newEntry.category} 
                    onValueChange={(value) => setNewEntry({...newEntry, category: value})}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="leadership" className="text-white">Führung</SelectItem>
                      <SelectItem value="self-development" className="text-white">Selbstentwicklung</SelectItem>
                      <SelectItem value="methods" className="text-white">Methoden</SelectItem>
                      <SelectItem value="patterns" className="text-white">Muster</SelectItem>
                      <SelectItem value="relationship" className="text-white">Beziehung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Titel
                </label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  placeholder={`${currentTemplate.title} - ${new Date().toLocaleDateString('de-DE')}`}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              {/* Reflexions-Prompts */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Reflexionsfragen für {currentTemplate.title}:</h4>
                <ul className="space-y-1 text-xs text-slate-400">
                  {currentTemplate.prompts.map((prompt, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {prompt}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Reflexionsinhalt
                </label>
                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  placeholder="Beschreiben Sie Ihre Reflexion, Erkenntnisse und Beobachtungen..."
                  className="bg-slate-700 border-slate-600 text-white min-h-32"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Coaching-Methode
                  </label>
                  <Input
                    value={newEntry.coachingMethod}
                    onChange={(e) => setNewEntry({...newEntry, coachingMethod: e.target.value})}
                    placeholder="z.B. systemisch, lösungsorientiert..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Effektivität (1-5)
                  </label>
                  <Select 
                    value={newEntry.effectiveness.toString()} 
                    onValueChange={(value) => setNewEntry({...newEntry, effectiveness: parseInt(value)})}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="1" className="text-white">1 - Wenig effektiv</SelectItem>
                      <SelectItem value="2" className="text-white">2 - Eher wenig effektiv</SelectItem>
                      <SelectItem value="3" className="text-white">3 - Neutral</SelectItem>
                      <SelectItem value="4" className="text-white">4 - Effektiv</SelectItem>
                      <SelectItem value="5" className="text-white">5 - Sehr effektiv</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateEntry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Reflexion speichern
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewEntryDialog(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Abbrechen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Statistiken */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">
              {stats.total}
            </div>
            <p className="text-sm text-muted-foreground">
              Reflexionen
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">
              {stats.sessionReflections}
            </div>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-400">
              {stats.selfReflections}
            </div>
            <p className="text-sm text-muted-foreground">Selbstreflexion</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {stats.avgEffectiveness}
            </div>
            <p className="text-sm text-muted-foreground">Ø Effektivität</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">
              {stats.thisWeek}
            </div>
            <p className="text-sm text-muted-foreground">Diese Woche</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Suchleiste und Sortierung */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Reflexionen durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Sortieren:</label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="newest" className="text-white">Neueste zuerst</SelectItem>
              <SelectItem value="oldest" className="text-white">Älteste zuerst</SelectItem>
              <SelectItem value="effectiveness" className="text-white">Nach Effektivität</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Reflexions-Einträge */}
      <div className="grid gap-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => {
            const typeConfig = getReflectionTypeIcon(entry.reflectionType);
            return (
              <Card key={entry.id} className="glass-card hover:bg-slate-800/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg text-white">{entry.title}</CardTitle>
                        {entry.isPrivate && (
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                            Privat
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400 mb-2">
                        <div className="flex items-center gap-1">
                          {typeConfig.icon}
                          <span className={typeConfig.color}>{typeConfig.label}</span>
                        </div>
                        {entry.coacheeName && (
                          <>
                            <span>•</span>
                            <span>{entry.coacheeName}</span>
                          </>
                        )}
                        <span>•</span>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(entry.date)}
                        </div>
                      </div>
                      {entry.coachingMethod && (
                        <div className="text-xs text-slate-500">
                          Methode: {entry.coachingMethod}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getCategoryBadge(entry.category)}
                      {entry.effectiveness && <EffectivenessStars rating={entry.effectiveness} />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4 line-clamp-3">
                    {entry.content}
                  </p>
                  
                  {entry.insights && entry.insights.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-slate-300 mb-2">Wichtige Erkenntnisse:</h5>
                      <div className="flex flex-wrap gap-2">
                        {entry.insights.map((insight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {insight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-400">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {entry.content.split(' ').length} Wörter
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        Lesen
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3 mr-1" />
                        Bearbeiten
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {coacheeFilter ? 
                  `Keine Reflexionen zu ${decodeURIComponent(nameFilter || 'diesem Coachee')} gefunden` :
                  'Noch keine Reflexionen vorhanden'
                }
              </h3>
              <p className="text-muted-foreground">
                {coacheeFilter ? 
                  'Zu diesem Coachee wurden noch keine Reflexionen erstellt.' :
                  'Beginnen Sie mit Ihrer ersten Reflexion, um Ihre Coaching-Praxis zu entwickeln.'
                }
              </p>
              {coacheeFilter && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearCoacheeFilter}
                >
                  Alle Reflexionen anzeigen
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}