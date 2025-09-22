import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { SessionStatus, InvoiceStatus } from '@/types';
import { useAppStateContext } from '@/context/AppStateContext';
import * as ics from 'ics';
import { saveAs } from 'file-saver';
import { Archive, LayoutList, CalendarDays, X } from 'lucide-react';
import NewSessionDialog from './sessions/NewSessionDialog';
import SessionListView from './sessions/SessionListView';
import SessionCalendarView from './sessions/SessionCalendarView';

const Sessions = () => {
  const { state, actions } = useAppStateContext();
  const { sessions, coachees, invoices, activePackages, serviceRates, settings } = state;
  const { setSessions, setInvoices, deductFromPackage } = actions;
  
  const [isNewSessionDialogOpen, setIsNewSessionDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [date, setDate] = useState(new Date());
  const [dateFilter, setDateFilter] = useState(null); // NEU: Datum-Filter
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // NEU: URL-Parameter auswerten
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const filter = urlParams.get('filter');
    
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      setDateFilter(today);
      toast({
        title: "Filter aktiv",
        description: "Zeige nur Sessions von heute",
        className: "bg-blue-600 text-white"
      });
    }
  }, [location.search, toast]);

  // NEU: Filter zurücksetzen
  const clearDateFilter = () => {
    setDateFilter(null);
    // URL ohne Parameter
    navigate('/sessions', { replace: true });
    toast({
      title: "Filter entfernt",
      description: "Zeige alle Sessions",
    });
  };

  const handleNewSessionSubmit = (newSession) => {
    setSessions(prev => [...prev, newSession].sort((a,b) => new Date(b.date) - new Date(a.date)));
    toast({ title: "Session erstellt!", description: `Die Session mit ${newSession.coacheeName} wurde geplant.`, className: "bg-green-600 text-white" });
    setIsNewSessionDialogOpen(false);
  };

  const generateIcsFile = (session) => {
    const eventDate = new Date(session.date);
    const start = [
      eventDate.getFullYear(),
      eventDate.getMonth() + 1,
      eventDate.getDate(),
      eventDate.getHours(),
      eventDate.getMinutes()
    ];
    const duration = { minutes: session.duration };

    const event = {
      start,
      duration,
      title: `Coaching: ${session.topic}`,
      description: `Coaching Session mit ${session.coacheeName}. Notizen: ${session.coachNotes}`,
      organizer: { name: settings.company.name, email: settings.company.email },
      attendees: [
        { name: settings.company.name, email: settings.company.email, rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
        { name: session.coacheeName, email: coachees.find(c => c.id === session.coacheeId)?.email || '', rsvp: true, partstat: 'NEEDS-ACTION', role: 'REQ-PARTICIPANT' }
      ]
    };
    
    if (session.mode === 'in-person' && settings.company.street) {
        event.location = `${settings.company.street}, ${settings.company.zip} ${settings.company.city}`;
    }

    ics.createEvent(event, (error, value) => {
      if (error) {
        console.error(error);
        toast({ variant: 'destructive', title: "Fehler", description: "Kalender-Datei konnte nicht erstellt werden."});
        return;
      }
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
      saveAs(blob, `Coaching-${session.topic.replace(/ /g,"_")}.ics`);
      toast({ title: "Kalender-Datei erstellt", description: "Die .ics-Datei wurde heruntergeladen."});
    });
  };

  const handleCreateInvoiceFromSession = (session) => {
    const invoiceNumber = `CS-${new Date().getFullYear()}-${((invoices || []).length + 1).toString().padStart(3, '0')}`;
    const standardRate = serviceRates.find(r => r.name.toLowerCase().includes("standard")) || { id: null, price: 120.00 };

    const newInvoice = {
      id: Date.now(),
      invoiceNumber,
      coacheeId: session.coacheeId,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: InvoiceStatus.DRAFT,
      items: [{
        id: `session-${session.id}`,
        description: `Coaching-Session: "${session.topic}" vom ${new Date(session.date).toLocaleDateString('de-DE')}`,
        quantity: 1,
        price: standardRate.price,
        rateId: standardRate.id,
        isCustom: !standardRate.id,
        sessionId: session.id,
      }],
      taxRate: state.settings?.company?.defaultTaxRate || 19.0,
      currency: state.settings?.company?.defaultCurrency || 'EUR'
    };
    
    setInvoices(prev => [...(prev || []), newInvoice]);
    setSessions(prev => prev.map(s => s.id === session.id ? { ...s, billed: true } : s));

    toast({
      title: "Rechnung erstellt",
      description: `Ein Rechnungsentwurf für die Session wurde erstellt.`,
      action: <Button onClick={() => navigate(`/invoices/edit/${newInvoice.id}`)}>Bearbeiten</Button>,
      className: 'bg-green-600 text-white'
    });
  };

  const handleCardClick = (session) => {
    navigate(`/sessions/${session.id}/prepare`);
  };
  
  const handleToggleArchive = (sessionId) => {
    const sessionToToggle = sessions.find(s => s.id === sessionId);
    if (!sessionToToggle) return;
    const isArchiving = !sessionToToggle.archived;
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, archived: isArchiving } : s));
    toast({
      title: `Session ${isArchiving ? 'archiviert' : 'wiederhergestellt'}!`,
      description: `Die Session "${sessionToToggle.topic}" wurde ${isArchiving ? 'ins Archiv verschoben' : 'aus dem Archiv entfernt'}.`,
    });
  };
  
  const handleSessionStatusChange = (sessionId, newStatus) => {
     setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          if (newStatus === SessionStatus.COMPLETED && s.status !== SessionStatus.COMPLETED && s.packageId) {
            deductFromPackage(s.packageId);
          }
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const activeSessions = useMemo(() => (sessions || []).filter(s => !s.archived), [sessions]);
  const archivedSessions = useMemo(() => (sessions || []).filter(s => s.archived), [sessions]);

  // ERWEITERT: Filter um Datum-Filter erweitert
  const filteredActiveSessions = useMemo(() => {
    let filtered = activeSessions.filter(session => filterStatus === 'all' || session.status === filterStatus);
    
    // NEU: Datum-Filter anwenden
    if (dateFilter) {
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.date).toISOString().split('T')[0];
        return sessionDate === dateFilter;
      });
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [activeSessions, filterStatus, dateFilter]);

  const statusFilters = [
    { value: 'all', label: 'Alle' },
    { value: SessionStatus.PLANNED, label: 'Geplant' },
    { value: SessionStatus.COMPLETED, label: 'Abgeschlossen' },
    { value: SessionStatus.CANCELED, label: 'Abgesagt' },
  ];

  return (
    <>
      <Helmet>
        <title>Sessions - Coachingspace</title>
        <meta name="description" content="Verwalte deine Coaching-Sessions, plane neue Termine und dokumentiere Fortschritte." />
      </Helmet>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Sessions</h1>
            <p className="text-slate-400">Verwalte deine Coaching-Sessions</p>
            {/* NEU: Filter-Anzeige */}
            {dateFilter && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded-md">
                  Gefiltert nach: {new Date(dateFilter).toLocaleDateString('de-DE')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDateFilter}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <NewSessionDialog 
            open={isNewSessionDialogOpen} 
            onOpenChange={setIsNewSessionDialogOpen} 
            onSubmit={handleNewSessionSubmit}
            coachees={coachees}
            activePackages={activePackages}
          />
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Aktive Sessions</TabsTrigger>
              <TabsTrigger value="archive">Archiv</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-6">
            <Card className="glass-card">
              <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium text-slate-300">Filter:</p>
                  <div className="flex gap-2 flex-wrap">{statusFilters.map(filter => (<Button key={filter.value} variant={filterStatus === filter.value ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(filter.value)}>{filter.label}</Button>))}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}><LayoutList className="h-4 w-4 mr-2" />Liste</Button>
                  <Button variant={viewMode === 'calendar' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('calendar')}><CalendarDays className="h-4 w-4 mr-2" />Kalender</Button>
                </div>
              </CardContent>
            </Card>

            {viewMode === 'list' && (
              <SessionListView 
                sessions={filteredActiveSessions}
                onCardClick={handleCardClick}
                onToggleArchive={handleToggleArchive}
                onStatusChange={handleSessionStatusChange}
                onCreateInvoice={handleCreateInvoiceFromSession}
                activePackages={activePackages}
                onAddToCalendar={generateIcsFile}
              />
            )}
            {viewMode === 'calendar' && (
              <SessionCalendarView 
                date={date}
                setDate={setDate}
                sessions={activeSessions}
                onDayClick={handleCardClick}
              />
            )}
          </TabsContent>
          <TabsContent value="archive" className="mt-6">
             <SessionListView 
                sessions={archivedSessions}
                onCardClick={handleCardClick}
                onToggleArchive={handleToggleArchive}
                onStatusChange={handleSessionStatusChange}
                onCreateInvoice={handleCreateInvoiceFromSession}
                activePackages={activePackages}
                onAddToCalendar={generateIcsFile}
              />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Sessions;