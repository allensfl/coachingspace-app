import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
import { SubscriptionOverviewWidget } from '../components/SubscriptionOverviewWidget';

// Statistik-Card Komponente
const StatCard = ({ title, value, icon, to, colorClass = "text-blue-500" }) => (
  <Card className="glass-card-enhanced transition-all duration-300 hover:scale-105 cursor-pointer group">
    <Link to={to} className="block">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`${colorClass} opacity-70 group-hover:opacity-100 transition-opacity`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Link>
  </Card>
);

// Task Komponente für bessere Organisation
const TaskItem = ({ task, onComplete, onEdit, onDelete, overdue = false }) => {
  const priorityColors = {
    high: 'border-l-red-500 bg-red-50/10',
    medium: 'border-l-yellow-500 bg-yellow-50/10',
    low: 'border-l-green-500 bg-green-50/10'
  };

  const priorityLabels = {
    high: 'Hoch',
    medium: 'Mittel', 
    low: 'Niedrig'
  };

  return (
    <div className={`p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${priorityColors[task.priority] || 'border-l-gray-500 bg-gray-50/10'} ${task.completed ? 'opacity-60' : ''} ${overdue ? 'ring-2 ring-red-500/30' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onComplete(task.id)}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                task.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {task.completed && <CheckCircle2 className="w-3 h-3" />}
            </button>
            <h4 className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h4>
            {overdue && (
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {priorityLabels[task.priority]}
            </Badge>
            {task.dueDate && (
              <span className={overdue ? 'text-red-500 font-medium' : ''}>
                {new Date(task.dueDate).toLocaleDateString('de-DE')}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { state, actions } = useAppStateContext();
  const { 
    sessions = [], 
    coachees = [], 
    packages = [],
    recurringInvoices = [],
    serviceRates = [],
    settings = {}
  } = state;
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Personalisierungs-Daten
  const userData = useMemo(() => {
    const companyData = settings?.company || {};
    const personalData = settings?.personal || {};
    
    return {
      firstName: personalData.firstName || "Coach",
      lastName: personalData.lastName || "",
      companyName: companyData.name || personalData.firstName ? `${personalData.firstName}s Coaching` : "Dein Coaching Business",
      logoUrl: companyData.logoUrl || "https://via.placeholder.com/120x40/3B82F6/FFFFFF?text=CC", // Fallback Logo
      primaryColor: companyData.primaryColor || "#3B82F6"
    };
  }, [settings]);

  const currentTime = new Date().getHours();
  const getGreeting = () => {
    if (currentTime < 12) return "Guten Morgen";
    if (currentTime < 18) return "Guten Tag";
    return "Guten Abend";
  };

  // Task-Management State
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Session-Notes für Maria Müller fertigstellen",
      description: "Notizen von der letzten Session strukturieren und wichtige Erkenntnisse dokumentieren",
      priority: "high",
      dueDate: "2024-12-28",
      completed: false,
      category: "documentation"
    },
    {
      id: 2,
      title: "Neue Coaching-Materialien vorbereiten",
      description: "Übungen für Stressbewältigung und Zeitmanagement erstellen",
      priority: "medium",
      dueDate: "2024-12-30",
      completed: false,
      category: "preparation"
    },
    {
      id: 3,
      title: "Feedback von letzter Woche einarbeiten",
      description: "Coachee-Feedback analysieren und Verbesserungen ableiten",
      priority: "low",
      dueDate: "2025-01-02",
      completed: false,
      category: "improvement"
    }
  ]);

  const [coacheeDeadlines, setCoacheeDeadlines] = useState([
    {
      id: 1,
      coacheeId: 2,
      title: "Karriereplan bis Jahresende",
      description: "Finalisierung des 5-Jahres-Karriereplans",
      dueDate: "2024-12-31",
      category: "goal",
      completed: false
    },
    {
      id: 2,
      coacheeId: 1,
      title: "Präsentation für Beförderung",
      description: "Vorbereitung der Präsentation für das Management",
      dueDate: "2025-01-05",
      category: "presentation",
      completed: false
    }
  ]);

  // Task Dialog States
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'general'
  });

  // Coachee Deadline Dialog States
  const [showDeadlineDialog, setShowDeadlineDialog] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [deadlineForm, setDeadlineForm] = useState({
    coacheeId: '',
    title: '',
    description: '',
    dueDate: '',
    category: 'goal'
  });

  // Berechnete Werte
  const activeCoachees = useMemo(() => {
    return coachees.filter(coachee => coachee.status === 'active').length;
  }, [coachees]);

  const sessionsThisWeek = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    }).length;
  }, [sessions]);

  const activePackages = useMemo(() => {
    return packages.filter(pkg => pkg.status === 'active').length;
  }, [packages]);

  const upcomingSessions = useMemo(() => {
    const now = new Date();
    return sessions
      .filter(session => new Date(session.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [sessions]);

  const overdueTasks = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    );
  }, [tasks]);

  const overdueDeadlines = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return coacheeDeadlines.filter(deadline => 
      !deadline.completed && 
      new Date(deadline.dueDate) < now
    );
  }, [coacheeDeadlines]);

  // Task Management Functions
  const handleTaskComplete = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category
    });
    setShowTaskDialog(true);
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task gelöscht",
      description: "Der Task wurde erfolgreich entfernt.",
    });
  };

  const handleTaskSave = () => {
    if (!taskForm.title.trim()) return;

    if (editingTask) {
      setTasks(prev => prev.map(task =>
        task.id === editingTask.id
          ? { ...task, ...taskForm }
          : task
      ));
      toast({
        title: "Task aktualisiert",
        description: "Der Task wurde erfolgreich bearbeitet.",
      });
    } else {
      const newTask = {
        ...taskForm,
        id: Date.now(),
        completed: false
      };
      setTasks(prev => [...prev, newTask]);
      toast({
        title: "Task erstellt",
        description: "Der neue Task wurde erfolgreich hinzugefügt.",
      });
    }

    setShowTaskDialog(false);
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'general'
    });
  };

  // Coachee Deadline Functions
  const handleDeadlineComplete = (deadlineId) => {
    setCoacheeDeadlines(prev => prev.map(deadline => 
      deadline.id === deadlineId 
        ? { ...deadline, completed: !deadline.completed }
        : deadline
    ));
  };

  const handleDeadlineEdit = (deadline) => {
    setEditingDeadline(deadline);
    setDeadlineForm({
      coacheeId: deadline.coacheeId,
      title: deadline.title,
      description: deadline.description,
      dueDate: deadline.dueDate,
      category: deadline.category
    });
    setShowDeadlineDialog(true);
  };

  const handleDeadlineDelete = (deadlineId) => {
    setCoacheeDeadlines(prev => prev.filter(deadline => deadline.id !== deadlineId));
    toast({
      title: "Coachee-Deadline gelöscht",
      description: "Die Deadline wurde erfolgreich entfernt.",
    });
  };

  const handleDeadlineSave = () => {
    if (!deadlineForm.title.trim() || !deadlineForm.coacheeId) return;

    const coachee = coachees.find(c => c.id.toString() === deadlineForm.coacheeId);
    if (!coachee) return;

    if (editingDeadline) {
      setCoacheeDeadlines(prev => prev.map(deadline =>
        deadline.id === editingDeadline.id
          ? { ...deadline, ...deadlineForm, coacheeId: parseInt(deadlineForm.coacheeId) }
          : deadline
      ));
      toast({
        title: "Coachee-Deadline aktualisiert",
        description: "Die Deadline wurde erfolgreich bearbeitet.",
      });
    } else {
      const newDeadline = {
        ...deadlineForm,
        id: Date.now(),
        coacheeId: parseInt(deadlineForm.coacheeId),
        completed: false
      };
      setCoacheeDeadlines(prev => [...prev, newDeadline]);
      toast({
        title: "Coachee-Deadline erstellt",
        description: "Die neue Deadline wurde erfolgreich hinzugefügt.",
      });
    }

    setShowDeadlineDialog(false);
    setEditingDeadline(null);
    setDeadlineForm({
      coacheeId: '',
      title: '',
      description: '',
      dueDate: '',
      category: 'goal'
    });
  };

  // Auto-Hide überfällige Deadlines nach 7 Tagen
  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    setCoacheeDeadlines(prev => 
      prev.filter(deadline => {
        if (deadline.completed) return true;
        const dueDate = new Date(deadline.dueDate);
        return dueDate >= sevenDaysAgo;
      })
    );
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard - {userData.companyName}</title>
        <meta name="description" content="Übersicht über deine Coaching-Aktivitäten" />
      </Helmet>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingTask ? 'Task bearbeiten' : 'Neuen Task erstellen'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Titel</label>
              <Input
                value={taskForm.title}
                onChange={(e) => setTaskForm(prev => ({...prev, title: e.target.value}))}
                placeholder="Task-Titel"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Beschreibung</label>
              <Textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm(prev => ({...prev, description: e.target.value}))}
                placeholder="Beschreibung des Tasks"
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Priorität</label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm(prev => ({...prev, priority: value}))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="low">Niedrig</SelectItem>
                    <SelectItem value="medium">Mittel</SelectItem>
                    <SelectItem value="high">Hoch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Fälligkeitsdatum</label>
                <Input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm(prev => ({...prev, dueDate: e.target.value}))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleTaskSave}>
                {editingTask ? 'Aktualisieren' : 'Erstellen'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coachee Deadline Dialog */}
      <Dialog open={showDeadlineDialog} onOpenChange={setShowDeadlineDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingDeadline ? 'Coachee-Deadline bearbeiten' : 'Neue Coachee-Deadline erstellen'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Coachee</label>
              <Select value={deadlineForm.coacheeId} onValueChange={(value) => setDeadlineForm(prev => ({...prev, coacheeId: value}))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Coachee auswählen" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {coachees.map(coachee => (
                    <SelectItem key={coachee.id} value={coachee.id.toString()}>
                      {coachee.firstName} {coachee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Titel</label>
              <Input
                value={deadlineForm.title}
                onChange={(e) => setDeadlineForm(prev => ({...prev, title: e.target.value}))}
                placeholder="Deadline-Titel"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Beschreibung</label>
              <Textarea
                value={deadlineForm.description}
                onChange={(e) => setDeadlineForm(prev => ({...prev, description: e.target.value}))}
                placeholder="Beschreibung der Deadline"
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Fälligkeitsdatum</label>
              <Input
                type="date"
                value={deadlineForm.dueDate}
                onChange={(e) => setDeadlineForm(prev => ({...prev, dueDate: e.target.value}))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDeadlineDialog(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleDeadlineSave}>
                {editingDeadline ? 'Aktualisieren' : 'Erstellen'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto p-6 space-y-6">
        {/* Personalisierter Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            {getGreeting()}, {userData.firstName}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Hier ist deine Übersicht für heute.
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

        {/* Abonnement-Übersicht Widget */}
        <SubscriptionOverviewWidget
          recurringInvoices={recurringInvoices}
          serviceRates={serviceRates}
          coachees={coachees}
          onNavigateToSubscriptions={() => navigate('/recurring-invoices')}
        />

        {/* Primärer Bereich - Tasks und Deadlines */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Deine Tasks - ERWEITERT */}
          <Card className="glass-card-enhanced">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Deine Tasks</CardTitle>
                  {overdueTasks.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {overdueTasks.length} überfällig
                    </Badge>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setEditingTask(null);
                        setTaskForm({
                          title: '',
                          description: '',
                          priority: 'medium',
                          dueDate: '',
                          category: 'general'
                        });
                        setShowTaskDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Task
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardCheck className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>Keine Tasks vorhanden</p>
                </div>
              ) : (
                <>
                  {/* Überfällige Tasks zuerst */}
                  {overdueTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      overdue={true}
                      onComplete={handleTaskComplete}
                      onEdit={handleTaskEdit}
                      onDelete={handleTaskDelete}
                    />
                  ))}
                  {/* Normale Tasks */}
                  {tasks.filter(task => 
                    !overdueTasks.some(overdueTask => overdueTask.id === task.id)
                  ).slice(0, 5).map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onComplete={handleTaskComplete}
                      onEdit={handleTaskEdit}
                      onDelete={handleTaskDelete}
                    />
                  ))}
                </>
              )}
              {tasks.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm">
                    Alle {tasks.length} Tasks anzeigen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coachee Deadlines - MIT AUTO-VERSCHWINDEN */}
          <Card className="glass-card-enhanced">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg">Coachee Deadlines</CardTitle>
                  {overdueDeadlines.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {overdueDeadlines.length} überfällig
                    </Badge>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setEditingDeadline(null);
                        setDeadlineForm({
                          coacheeId: '',
                          title: '',
                          description: '',
                          dueDate: '',
                          category: 'goal'
                        });
                        setShowDeadlineDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Deadline
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {coacheeDeadlines.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>Keine Coachee-Deadlines vorhanden</p>
                </div>
              ) : (
                <>
                  {coacheeDeadlines.map(deadline => {
                    const coachee = coachees.find(c => c.id === deadline.coacheeId);
                    const isOverdue = !deadline.completed && new Date(deadline.dueDate) < new Date();
                    
                    return (
                      <div 
                        key={deadline.id} 
                        className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                          deadline.completed 
                            ? 'border-gray-200 bg-gray-50/50 opacity-60' 
                            : isOverdue 
                              ? 'border-red-200 bg-red-50/10 ring-2 ring-red-500/20' 
                              : 'border-gray-200 bg-white/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <button
                                onClick={() => handleDeadlineComplete(deadline.id)}
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  deadline.completed 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'border-gray-300 hover:border-green-500'
                                }`}
                              >
                                {deadline.completed && <CheckCircle2 className="w-3 h-3" />}
                              </button>
                              <h4 className={`font-medium truncate ${deadline.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {deadline.title}
                              </h4>
                              {isOverdue && (
                                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {deadline.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium">
                                {coachee ? `${coachee.firstName} ${coachee.lastName}` : 'Unbekannt'}
                              </span>
                              <span>•</span>
                              <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                                {new Date(deadline.dueDate).toLocaleDateString('de-DE')}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleDeadlineEdit(deadline)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeadlineDelete(deadline.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              {coacheeDeadlines.length > 0 && (
                <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                  💡 Überfällige Deadlines verschwinden automatisch nach 7 Tagen
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sekundärer Bereich */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Kalender - Sessions + Termine kombiniert */}
          <CalendarOverview sessions={upcomingSessions} coachees={coachees} />
          
          {/* Weitere Bereiche */}
          <div className="grid gap-6 lg:grid-cols-2 lg:col-span-2">
            <OpenInvoices />
            <QuickActions />
          </div>
        </div>
      </div>
    </>
  );
}