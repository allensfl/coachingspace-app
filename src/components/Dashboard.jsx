import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowUpRight,
  Users,
  Calendar,
  FileText,
  PackagePlus,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Plus,
  StickyNote,
  Receipt,
  Bell,
  MessageCircle,
  Mail,
  DollarSign,
  PartyPopper,
  CalendarPlus,
  Share2,
  Eye,
  Edit,
  Trash2,
  X,
  Target
} from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';
import OpenInvoices from './OpenInvoices';
import EventsAndBirthdays from './EventsAndBirthdays';
import QuickActions from './QuickActions';
import CalendarOverview from './CalendarOverview';

// E-Mail Template Funktionen
const emailTemplates = {
  nachfassen: (coachee, task) => ({
    subject: `Nachfassen: ${task.title}`,
    body: `Hallo ${coachee.firstName},

ich wollte kurz nachfragen, wie es mit deiner Aufgabe "${task.title}" läuft.

Deadline war heute - wie ist der Stand? Brauchst du Unterstützung oder haben sich neue Herausforderungen ergeben?

Lass uns gerne kurz telefonieren oder in der nächsten Session darüber sprechen.

Beste Grüße,
[Dein Name]`
  }),

  mahnen: (coachee) => ({
    subject: `Zahlungserinnerung - Coaching Sessions`,
    body: `Hallo ${coachee.firstName},

ich hoffe, es geht dir gut! 

Mir ist aufgefallen, dass eine Rechnung noch offen ist. Könntest du bitte einen Blick darauf werfen?

Falls es Fragen gibt oder sich etwas geändert hat, melde dich gerne bei mir.

Vielen Dank und beste Grüße,
[Dein Name]`
  }),

  gratulieren: (coachee, task) => ({
    subject: `Herzlichen Glückwunsch - ${task.title} erfolgreich abgeschlossen!`,
    body: `Hallo ${coachee.firstName},

ich freue mich riesig mit dir! Du hast dein Ziel "${task.title}" erfolgreich erreicht. 🎉

Das zeigt wieder einmal, was für eine starke und zielstrebige Person du bist. Ich bin stolz auf deinen Fortschritt!

Lass uns in der nächsten Session gemeinsam reflektieren und den nächsten Schritt planen.

Herzliche Glückwünsche,
[Dein Name]`
  }),

  terminieren: (coachee) => ({
    subject: `Terminfindung für unsere nächste Coaching Session`,
    body: `Hallo ${coachee.firstName},

es ist Zeit für unsere nächste Session! 

Wann passt es dir in den nächsten 1-2 Wochen am besten? Ich habe folgende Zeiten frei:
- [Datum/Zeit 1]
- [Datum/Zeit 2] 
- [Datum/Zeit 3]

Oder schlage gerne eigene Zeiten vor. Wir können wie gewohnt [online/in meinem Büro] treffen.

Freue mich auf unser Gespräch!

Beste Grüße,
[Dein Name]`
  }),

  kontaktieren: (coachee) => ({
    subject: `Kurzes Check-in`,
    body: `Hallo ${coachee.firstName},

ich wollte mich kurz bei dir melden und fragen, wie es dir geht.

Falls du Fragen hast oder einfach mal sprechen möchtest, melde dich gerne.

Beste Grüße,
[Dein Name]`
  })
};

const sendEmail = (coachee, templateType, task = null) => {
  if (!coachee?.email && !coachee?.emailAddress) {
    alert('Keine E-Mail-Adresse für diesen Coachee gefunden.');
    return;
  }

  const email = coachee.email || coachee.emailAddress;
  const template = emailTemplates[templateType](coachee, task);
  
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
  window.open(mailtoUrl);
};

// Task Management Functions
const saveTask = (task) => {
  const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  let updatedTasks;

  if (task.id) {
    // Update existing task
    updatedTasks = allTasks.map(t => t.id === task.id ? task : t);
  } else {
    // Create new task
    const newTaskWithId = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: 'coach'
    };
    updatedTasks = [...allTasks, newTaskWithId];
  }

  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  window.dispatchEvent(new Event('storage'));
  return task.id ? task : { ...task, id: Date.now().toString() };
};

const deleteTask = (taskId) => {
  const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const updatedTasks = allTasks.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  window.dispatchEvent(new Event('storage'));
};

const markAsContacted = (taskId) => {
  const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const updatedTasks = allTasks.map(task => 
    task.id === taskId 
      ? { ...task, contacted: true, contactedAt: new Date().toISOString() }
      : task
  );
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  window.dispatchEvent(new Event('storage'));
};

// Kompakte StatCard
const StatCard = ({ title, value, icon, to, colorClass }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden h-full flex flex-col justify-between glass-card-enhanced hover:shadow-lg transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">{title}</CardTitle>
          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
            {React.cloneElement(icon, { className: 'h-3 w-3 text-primary group-hover:scale-110 transition-transform duration-300' })}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{value}</div>
          {to && (
            <Link to={to} className="text-xs text-primary hover:text-primary/80 mt-1 flex items-center group-hover:translate-x-1 transition-all duration-300">
              Details <ArrowUpRight className="h-3 w-3 ml-1 group-hover:scale-110 transition-transform duration-300" />
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Formatdatum-Helfer
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Heute';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Morgen';
  } else {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  }
};

export default function Dashboard() {
  const { state, actions } = useAppStateContext();
  const { 
    sessions = [], 
    coachees = [], 
    packages = []
  } = state;
  const { 
    getSharedJournalEntries = () => [] // Fallback-Funktion
  } = actions;
  
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: 'me',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'open'
  });
  const [taskUpdateTrigger, setTaskUpdateTrigger] = useState(0);

  const { toast } = useToast();

  // Force re-render when tasks change
  useEffect(() => {
    const handleStorageChange = () => {
      setTaskUpdateTrigger(prev => prev + 1);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Geteilte Journal-Einträge temporär deaktiviert bis Funktion repariert ist
  const sharedEntries = useMemo(() => {
    return []; // Temporär deaktiviert
  }, []);

  // Sessions für die nächsten 3 Tage
  const upcomingSessions = useMemo(() => {
    if (!sessions) return [];
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    
    return sessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= today && sessionDate <= threeDaysLater;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [sessions]);

  // Persönliche Tasks für heute (zentrales System)
  const todaysTasks = useMemo(() => {
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const today = new Date().toDateString();
    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toDateString();
      return taskDate === today && task.assignedTo === 'me';
    });
  }, [taskUpdateTrigger]);

  // Coachee-Deadlines für heute (zentrales System) - OHNE kontaktierte  
  const coacheeDeadlines = useMemo(() => {
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const today = new Date().toDateString();
    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toDateString();
      return taskDate === today && 
             task.assignedTo !== 'me' && 
             task.status !== 'completed' && 
             !task.contacted; // Neue Bedingung: nicht kontaktiert
    });
  }, [taskUpdateTrigger]);

  // Statistiken berechnen
  const activeCoachees = coachees?.filter(c => c.status === 'active').length || 0;
  const sessionsThisWeek = sessions?.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  }).length || 0;
  const activePackages = packages?.filter(p => p.status === 'active').length || 0;

  const toggleTask = (taskId) => {
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = allTasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'open' : 'completed' }
        : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTaskUpdateTrigger(prev => prev + 1);
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Titel für die Aufgabe ein.",
        variant: "destructive"
      });
      return;
    }

    saveTask(newTask);
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: 'me',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'open'
    });
    
    setShowNewTaskDialog(false);
    setEditingTask(null);
    setTaskUpdateTrigger(prev => prev + 1);
    
    toast({
      title: "Aufgabe erstellt",
      description: `Neue Aufgabe wurde ${newTask.assignedTo === 'me' ? 'dir' : 'einem Coachee'} zugewiesen.`
    });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setShowNewTaskDialog(true);
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    setTaskUpdateTrigger(prev => prev + 1);
    toast({
      title: "Aufgabe gelöscht",
      description: "Die Aufgabe wurde erfolgreich entfernt."
    });
  };

  const handleNachfassen = (coachee, task) => {
    // Send email
    sendEmail(coachee, 'nachfassen', task);
    
    // Mark as contacted so it disappears from deadline list
    markAsContacted(task.id);
    setTaskUpdateTrigger(prev => prev + 1);
    
    toast({
      title: "Nachfass-E-Mail gesendet",
      description: `E-Mail an ${coachee.firstName} wurde geöffnet. Aufgabe als kontaktiert markiert.`
    });
  };

  const openEntryDetail = (entry) => {
    setSelectedEntry(entry);
    setIsDetailOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Coaching Plattform</title>
        <meta name="description" content="Übersicht über Ihre Coaching-Aktivitäten" />
      </Helmet>

      {/* New Task Dialog */}
      <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
        <DialogContent className="glass-card border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingTask ? 'Aufgabe bearbeiten' : 'Neue persönliche Aufgabe'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Titel *
              </label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Aufgabentitel eingeben..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Beschreibung
              </label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Weitere Details zur Aufgabe..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Priorität
                </label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => setNewTask({...newTask, priority: value})}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="low" className="text-white">Niedrig</SelectItem>
                    <SelectItem value="medium" className="text-white">Mittel</SelectItem>
                    <SelectItem value="high" className="text-white">Hoch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Fälligkeitsdatum
                </label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleCreateTask}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {editingTask ? 'Aktualisieren' : 'Erstellen'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNewTaskDialog(false);
                  setEditingTask(null);
                  setNewTask({
                    title: '',
                    description: '',
                    priority: 'medium',
                    assignedTo: 'me',
                    dueDate: new Date().toISOString().split('T')[0],
                    status: 'open'
                  });
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Entry Detail Modal */}
      {isDetailOpen && selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedEntry.title || 'Geteilter Eintrag'}</h2>
                  <p className="text-slate-400 text-sm">
                    Von {selectedEntry.sharedBy} • {selectedEntry.date ? new Date(selectedEntry.date).toLocaleDateString('de-DE') : 'Kein Datum'}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsDetailOpen(false)}>
                  ✕
                </Button>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-200 whitespace-pre-wrap">{selectedEntry.content || 'Kein Inhalt verfügbar'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Willkommen zurück! Hier ist Ihre Übersicht für heute.
          </p>
        </div>

        {/* Kompakte Statistik-Karten */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Aktive Coachees"
            value={activeCoachees}
            icon={<Users />}
            to="/coachees"
            colorClass="text-blue-500"
          />
          <StatCard
            title="Sessions diese Woche"
            value={sessionsThisWeek}
            icon={<Calendar />}
            to="/sessions"
            colorClass="text-green-500"
          />
          <StatCard
            title="Offene Dokumente"
            value="12"
            icon={<FileText />}
            to="/documents"
            colorClass="text-orange-500"
          />
          <StatCard
            title="Aktive Pakete"
            value={activePackages}
            icon={<PackagePlus />}
            to="/settings"
            colorClass="text-purple-500"
          />
        </div>

        {/* To-Do Bereich - separate Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Persönliche Tasks - ERWEITERT */}
          <Card className="glass-card-enhanced">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-foreground text-lg">
                  <CheckCircle2 className="mr-3 h-6 w-6 text-green-500" />
                  Meine Aufgaben heute ({todaysTasks.length})
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => setShowNewTaskDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Neue Aufgabe
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {todaysTasks.length > 0 ? (
                <div className="space-y-3">
                  {todaysTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border/50 hover:bg-background/80 transition-colors group">
                      <CheckCircle2 
                        className={`h-5 w-5 cursor-pointer transition-colors ${
                          task.status === 'completed' 
                            ? 'text-green-500' 
                            : 'text-muted-foreground hover:text-green-500'
                        }`}
                        onClick={() => toggleTask(task.id)}
                      />
                      <div className="flex-1">
                        <p className={`text-sm font-medium transition-colors ${
                          task.status === 'completed' 
                            ? 'text-muted-foreground line-through' 
                            : 'text-foreground group-hover:text-primary'
                        }`}>
                          {task.title || 'Unbenannte Aufgabe'}
                        </p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {task.priority === 'high' ? 'Hoch' : 
                           task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTask(task)}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTask(task.id)}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                  <p className="text-muted-foreground mb-4">Keine Aufgaben für heute.</p>
                  <Button 
                    onClick={() => setShowNewTaskDialog(true)}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Erste Aufgabe erstellen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coachee Deadlines - MIT AUTO-VERSCHWINDEN */}
          <Card className="glass-card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground text-lg">
                <AlertTriangle className="mr-3 h-6 w-6 text-orange-500" />
                Coachee-Deadlines heute ({coacheeDeadlines.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coacheeDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {coacheeDeadlines.slice(0, 5).map((task) => {
                    const coachee = coachees?.find(c => c.id.toString() === task.assignedTo.toString());
                    const isOverdue = new Date(task.dueDate) < new Date();
                    return (
                      <div key={task.id} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border/50 hover:bg-background/80 transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={coachee?.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {coachee ? `${coachee.firstName?.[0] || coachee.name?.[0] || ''}${coachee.lastName?.[0] || ''}` : '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {coachee ? (coachee.firstName ? `${coachee.firstName} ${coachee.lastName}` : coachee.name) : 'Unbekannt'}
                            {task.category && ` • ${task.category}`}
                          </p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                          )}
                        </div>
                        <div className="text-right space-y-2">
                          <Badge variant={isOverdue ? "destructive" : "default"} className="text-xs">
                            {isOverdue ? 'Überfällig' : 'Fällig heute'}
                          </Badge>
                          {coachee && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-7 w-full hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => handleNachfassen(coachee, task)}
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Nachfassen
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">Keine Deadlines heute.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sekundärer Bereich */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Kalender - kombiniert Sessions + Termine */}
          <CalendarOverview sessions={upcomingSessions} coachees={coachees} />
          
          {/* Weitere Bereiche in der oberen Zeile */}
          <div className="grid gap-6 lg:grid-cols-2 lg:col-span-2">
            <OpenInvoices />
            <QuickActions />
          </div>
        </div>
      </div>
    </>
  );
}