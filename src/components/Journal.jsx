import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, X, Plus, Filter, Calendar, Heart, Star } from 'lucide-react';

// Mock-Daten - ersetze durch echte Daten aus deinem System
const mockJournalEntries = [
  { 
    id: 1, 
    coacheeId: 1, 
    coacheeName: "Anna Schmidt", 
    title: "Erkenntnisse zur Führung", 
    content: "Heute habe ich verstanden, dass authentische Führung von innen heraus kommt. Die Session hat mir geholfen zu erkennen, wie wichtig es ist, bei sich selbst zu bleiben.",
    date: "2024-01-15T14:30:00", 
    mood: "optimistic",
    category: "leadership",
    isShared: true
  },
  { 
    id: 2, 
    coacheeId: 2, 
    coacheeName: "Max Weber", 
    title: "Work-Life-Balance Reflexion", 
    content: "Die Grenzen zwischen Arbeit und Freizeit verschwimmen immer mehr. Ich muss lernen, bewusster abzuschalten.",
    date: "2024-01-20T19:15:00", 
    mood: "reflective",
    category: "balance",
    isShared: false
  },
  { 
    id: 3, 
    coacheeId: 1, 
    coacheeName: "Anna Schmidt", 
    title: "Erfolg im Team", 
    content: "Das Meeting heute lief viel besser als erwartet. Die neuen Kommunikationsstrategien aus dem Coaching zeigen bereits Wirkung.",
    date: "2024-01-25T10:45:00", 
    mood: "happy",
    category: "team",
    isShared: true
  },
  { 
    id: 4, 
    coacheeId: 3, 
    coacheeName: "Lisa Müller", 
    title: "Konflikte verstehen", 
    content: "Nicht jeder Konflikt ist schlecht. Manchmal führen sie zu besseren Lösungen, wenn man sie konstruktiv angeht.",
    date: "2024-02-01T16:20:00", 
    mood: "neutral",
    category: "conflict",
    isShared: true
  }
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getMoodIcon = (mood) => {
  const moodConfig = {
    happy: { icon: '😊', color: 'text-green-400', label: 'Glücklich' },
    optimistic: { icon: '🌟', color: 'text-yellow-400', label: 'Optimistisch' },
    reflective: { icon: '🤔', color: 'text-blue-400', label: 'Nachdenklich' },
    neutral: { icon: '😐', color: 'text-gray-400', label: 'Neutral' },
    concerned: { icon: '😟', color: 'text-orange-400', label: 'Besorgt' }
  };
  
  return moodConfig[mood] || moodConfig.neutral;
};

const getCategoryBadge = (category) => {
  const categoryConfig = {
    leadership: { label: 'Führung', color: 'bg-purple-600' },
    balance: { label: 'Work-Life', color: 'bg-green-600' },
    team: { label: 'Team', color: 'bg-blue-600' },
    conflict: { label: 'Konflikt', color: 'bg-orange-600' },
    personal: { label: 'Persönlich', color: 'bg-pink-600' }
  };
  
  const config = categoryConfig[category] || { label: category, color: 'bg-gray-600' };
  return (
    <Badge className={`${config.color} text-white`}>
      {config.label}
    </Badge>
  );
};

export default function Journal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // URL-Parameter auslesen
  const coacheeFilter = searchParams.get('coachee');
  const nameFilter = searchParams.get('name');
  
  // Gefilterte Journal-Einträge basierend auf URL-Parametern und Suchbegriff
  const filteredEntries = useMemo(() => {
    let filtered = mockJournalEntries;
    
    // Nach Coachee-ID filtern (URL-Parameter)
    if (coacheeFilter) {
      filtered = filtered.filter(entry => entry.coacheeId === parseInt(coacheeFilter));
    }
    
    // Nach Suchbegriff filtern
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.coacheeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [coacheeFilter, searchTerm]);
  
  // Statistiken berechnen
  const stats = useMemo(() => {
    const total = filteredEntries.length;
    const shared = filteredEntries.filter(entry => entry.isShared).length;
    const categories = [...new Set(filteredEntries.map(entry => entry.category))].length;
    const thisWeek = filteredEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length;
    
    return { total, shared, categories, thisWeek };
  }, [filteredEntries]);
  
  // Filter entfernen
  const clearCoacheeFilter = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('coachee');
    newParams.delete('name');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);
  
  return (
    <div className="space-y-6">
      {/* Header mit Filter-Anzeige */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Journal</h1>
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
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neuer Eintrag
        </Button>
      </div>
      
      {/* Statistiken */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">
              {stats.total}
            </div>
            <p className="text-sm text-muted-foreground">
              {coacheeFilter ? 'Gefilterte Einträge' : 'Gesamt Einträge'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">
              {stats.shared}
            </div>
            <p className="text-sm text-muted-foreground">Geteilt</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">
              {stats.categories}
            </div>
            <p className="text-sm text-muted-foreground">Kategorien</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {stats.thisWeek}
            </div>
            <p className="text-sm text-muted-foreground">Diese Woche</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Suchleiste */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Journal durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {/* Journal-Einträge */}
      <div className="grid gap-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => {
            const mood = getMoodIcon(entry.mood);
            return (
              <Card key={entry.id} className="glass-card hover:bg-slate-800/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg text-white">{entry.title}</CardTitle>
                        {entry.isShared && (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            <Heart className="w-3 h-3 mr-1" />
                            Geteilt
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>{entry.coacheeName}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(entry.date)}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{mood.icon}</span>
                          <span className={mood.color}>{mood.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getCategoryBadge(entry.category)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4 line-clamp-3">
                    {entry.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-400">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {entry.content.split(' ').length} Wörter
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Lesen
                      </Button>
                      <Button variant="outline" size="sm">
                        Bearbeiten
                      </Button>
                      {entry.isShared && (
                        <Button variant="outline" size="sm">
                          <Star className="w-3 h-3 mr-1" />
                          Feedback
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {coacheeFilter ? 
                  `Keine Journal-Einträge von ${decodeURIComponent(nameFilter || 'diesem Coachee')} gefunden` :
                  'Keine Journal-Einträge gefunden'
                }
              </h3>
              <p className="text-muted-foreground">
                {coacheeFilter ? 
                  'Dieser Coachee hat noch keine Journal-Einträge geteilt.' :
                  'Beginnen Sie mit dem ersten Journal-Eintrag.'
                }
              </p>
              {coacheeFilter && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearCoacheeFilter}
                >
                  Alle Journal-Einträge anzeigen
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}