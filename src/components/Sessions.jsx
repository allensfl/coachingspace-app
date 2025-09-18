import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, X, Plus, Filter } from 'lucide-react';

// Mock-Daten - ersetze durch echte Daten aus deinem System
const mockSessions = [
  { id: 1, coacheeId: 1, coacheeName: "Anna Schmidt", topic: "Karriere-Entwicklung", date: "2024-01-15T10:00:00", status: "completed" },
  { id: 2, coacheeId: 2, coacheeName: "Max Weber", topic: "Work-Life-Balance", date: "2024-01-20T14:00:00", status: "upcoming" },
  { id: 3, coacheeId: 1, coacheeName: "Anna Schmidt", topic: "Führungskompetenzen", date: "2024-01-25T09:00:00", status: "completed" },
  { id: 4, coacheeId: 3, coacheeName: "Lisa Müller", topic: "Konfliktmanagement", date: "2024-02-01T11:00:00", status: "upcoming" }
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

export default function Sessions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // URL-Parameter auslesen
  const coacheeFilter = searchParams.get('coachee');
  const nameFilter = searchParams.get('name');
  
  // Gefilterte Sessions basierend auf URL-Parametern und Suchbegriff
  const filteredSessions = useMemo(() => {
    let filtered = mockSessions;
    
    // Nach Coachee-ID filtern (URL-Parameter)
    if (coacheeFilter) {
      filtered = filtered.filter(session => session.coacheeId === parseInt(coacheeFilter));
    }
    
    // Nach Suchbegriff filtern
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.coacheeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [coacheeFilter, searchTerm]);
  
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
          <h1 className="text-3xl font-bold text-white">Sessions</h1>
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
          Neue Session
        </Button>
      </div>
      
      {/* Suchleiste */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Sessions durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {/* Sessions-Liste */}
      <div className="grid gap-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Card key={session.id} className="glass-card hover:bg-slate-800/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">{session.topic}</CardTitle>
                    <p className="text-sm text-slate-400 mt-1">
                      mit {session.coacheeName}
                    </p>
                  </div>
                  <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                    {session.status === 'completed' ? 'Abgeschlossen' : 'Geplant'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-slate-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(session.date)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                    {session.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        Notizen
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {coacheeFilter ? 
                  `Keine Sessions für ${decodeURIComponent(nameFilter || 'diesen Coachee')} gefunden` :
                  'Keine Sessions gefunden'
                }
              </h3>
              <p className="text-muted-foreground">
                {coacheeFilter ? 
                  'Für diesen Coachee sind noch keine Sessions geplant.' :
                  'Beginnen Sie mit der ersten Session.'
                }
              </p>
              {coacheeFilter && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearCoacheeFilter}
                >
                  Alle Sessions anzeigen
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">
              {filteredSessions.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {coacheeFilter ? 'Gefilterte Sessions' : 'Gesamt Sessions'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">
              {filteredSessions.filter(s => s.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Abgeschlossen</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">
              {filteredSessions.filter(s => s.status === 'upcoming').length}
            </div>
            <p className="text-sm text-muted-foreground">Geplant</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}