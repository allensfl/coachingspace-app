import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/supabaseConfig';
import { useNavigate } from 'react-router-dom';
import { classes } from '../styles/standardClasses';
import { useAppStateContext } from '@/context/AppStateContext';
import {
  Users, Calendar, FileText, PackagePlus, Target, Plus, 
  Check, Edit, Trash2, Send, User, AlertTriangle, 
  CheckCircle, Clock, CalendarDays, MessageCircle,
  Settings, DollarSign, TrendingUp, BookOpen, Download, Upload, Share2
} from 'lucide-react';

// Simple toast replacement
const toast = {
  success: (message) => alert(`✅ ${message}`),
  error: (message) => alert(`❌ ${message}`)
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { state } = useAppStateContext();
  
  // All State declarations
  const [coachees, setCoachees] = useState([]);
  const [personalTasks, setPersonalTasks] = useState([]);
  const [newPersonalTask, setNewPersonalTask] = useState('');
  const [coacheeDeadlines, setCoacheeDeadlines] = useState([]);
  const [showDeadlineDialog, setShowDeadlineDialog] = useState(false);
  const [deadlineForm, setDeadlineForm] = useState({
    title: '',
    description: '',
    date: '',
    coacheeId: ''
  });
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [todaySessions, setTodaySessions] = useState([]);
  const [stats, setStats] = useState({
    totalCoachees: 0,
    activeSessions: 0,
    completedTasks: 0,
    upcomingDeadlines: 0
  });
const [selectedSharedItem, setSelectedSharedItem] = useState(null);
  // Load data on component mount
  useEffect(() => {
    // Load coachees from localStorage
    const loadCoachees = () => {
      const storedCoachees = JSON.parse(localStorage.getItem('coachees') || '[]');
      setCoachees(storedCoachees);
    };
    
    loadCoachees();
    
    // Load sessions from localStorage and filter today's sessions
    const storedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const todaysSessionsFiltered = storedSessions.filter(session => 
      session.date.startsWith(today)
    );
    setTodaySessions(todaysSessionsFiltered);
    
    loadTasksFromSupabase();
    
    // Reload coachees every 5 seconds to catch shared content updates
    const interval = setInterval(loadCoachees, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateStats();
  }, [coachees, personalTasks, coacheeDeadlines]);

  // Load tasks from Supabase
  const loadTasksFromSupabase = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        return;
      }

      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      // Separate tasks into personal tasks and coachee deadlines
      const personalTasksList = [];
      const coacheeDeadlinesList = [];

      tasks.forEach(task => {
        if (task.coachee_id) {
          coacheeDeadlinesList.push({
            id: task.id,
            title: task.title,
            description: task.description,
            date: task.due_date,
            completed: task.completed,
            coacheeId: task.coachee_id,
            createdAt: task.created_at
          });
        } else {
          personalTasksList.push({
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            createdAt: task.created_at
          });
        }
      });

      setPersonalTasks(personalTasksList);
      setCoacheeDeadlines(coacheeDeadlinesList);

    } catch (error) {
      console.error('Error loading tasks from Supabase:', error);
    }
  };

  // Update statistics
  const updateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingCount = coacheeDeadlines.filter(deadline => {
      const deadlineDate = new Date(deadline.date);
      deadlineDate.setHours(0, 0, 0, 0);
      return deadlineDate >= today && !deadline.completed;
    }).length;

    setStats({
      totalCoachees: coachees.length,
      activeSessions: todaySessions.length,
      completedTasks: personalTasks.filter(task => task.completed).length + coacheeDeadlines.filter(d => d.completed).length,
      upcomingDeadlines: upcomingCount
    });
  };

  // Personalisierte Begrüßung aus AppStateContext
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    // Name aus dem AppStateContext holen
    const settings = state?.settings || {};
    const personalData = settings.personal || {};
    const firstName = personalData.firstName || personalData.name || 'Coach';
    
    let greeting = '';
    if (hour < 12) {
      greeting = 'Guten Morgen';
    } else if (hour < 18) {
      greeting = 'Guten Tag';
    } else {
      greeting = 'Guten Abend';
    }
    
    return `${greeting}, ${firstName}!`;
  };

  // Personal Tasks Functions
  const handlePersonalTaskAdd = async () => {
    if (!newPersonalTask.trim()) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast.error('Nicht authentifiziert');
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userData.user.id,
          title: newPersonalTask,
          completed: false,
          coachee_id: null
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        toast.error('Fehler beim Hinzufügen der Aufgabe');
        return;
      }

      const newTask = {
        id: data.id,
        title: data.title,
        completed: data.completed,
        createdAt: data.created_at
      };

      setPersonalTasks(prev => [newTask, ...prev]);
      setNewPersonalTask('');
      toast.success('Aufgabe hinzugefügt');
    } catch (error) {
      console.error('Error adding personal task:', error);
      toast.error('Fehler beim Hinzufügen der Aufgabe');
    }
  };

  const handlePersonalTaskToggle = async (taskId) => {
    try {
      const task = personalTasks.find(t => t.id === taskId);
      const newCompleted = !task.completed;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: newCompleted })
        .eq('id', taskId);

      if (error) {
        console.error('Supabase update error:', error);
        toast.error('Fehler beim Aktualisieren der Aufgabe');
        return;
      }

      setPersonalTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, completed: newCompleted } : task
        )
      );

      toast.success(newCompleted ? 'Aufgabe erledigt' : 'Aufgabe wieder geöffnet');
    } catch (error) {
      console.error('Error toggling personal task:', error);
      toast.error('Fehler beim Aktualisieren der Aufgabe');
    }
  };

  const handlePersonalTaskDelete = async (taskId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Supabase delete error:', error);
        toast.error('Fehler beim Löschen der Aufgabe');
        return;
      }

      setPersonalTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Aufgabe gelöscht');
    } catch (error) {
      console.error('Error deleting personal task:', error);
      toast.error('Fehler beim Löschen der Aufgabe');
    }
  };

  // Coachee Deadline Functions
  const handleDeadlineSave = async () => {
    if (!deadlineForm.title || !deadlineForm.date || !deadlineForm.coacheeId) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast.error('Nicht authentifiziert');
        return;
      }

      if (editingDeadline) {
        const { error } = await supabase
          .from('tasks')
          .update({
            title: deadlineForm.title,
            description: deadlineForm.description,
            due_date: deadlineForm.date,
            coachee_id: deadlineForm.coacheeId
          })
          .eq('id', editingDeadline.id);

        if (error) {
          console.error('Supabase update error:', error);
          toast.error('Fehler beim Aktualisieren der Deadline');
          return;
        }

        setCoacheeDeadlines(prev =>
          prev.map(deadline =>
            deadline.id === editingDeadline.id
              ? {
                  ...deadline,
                  title: deadlineForm.title,
                  description: deadlineForm.description,
                  date: deadlineForm.date,
                  coacheeId: deadlineForm.coacheeId
                }
              : deadline
          )
        );

        toast.success('Deadline aktualisiert');
      } else {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            user_id: userData.user.id,
            title: deadlineForm.title,
            description: deadlineForm.description,
            due_date: deadlineForm.date,
            coachee_id: deadlineForm.coacheeId,
            completed: false
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          toast.error('Die Deadline konnte nicht gespeichert werden');
          return;
        }

        const newDeadline = {
          id: data.id,
          title: data.title,
          description: data.description,
          date: data.due_date,
          completed: data.completed,
          coacheeId: data.coachee_id,
          createdAt: data.created_at
        };

        setCoacheeDeadlines(prev => [newDeadline, ...prev]);
        toast.success('Die neue Deadline wurde erfolgreich hinzugefügt und gespeichert');
      }

      setDeadlineForm({ title: '', description: '', date: '', coacheeId: '' });
      setEditingDeadline(null);
      setShowDeadlineDialog(false);
    } catch (error) {
      console.error('Error in handleDeadlineSave:', error);
      toast.error('Die Deadline konnte nicht gespeichert werden');
    }
  };

  const handleDeadlineComplete = async (deadlineId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { error } = await supabase
          .from('tasks')
          .update({ completed: true })
          .eq('id', deadlineId)
          .eq('user_id', userData.user.id);

        if (error) {
          console.error('Supabase update error:', error);
          toast.error('Fehler beim Aktualisieren der Deadline');
          return;
        }
      }

      setCoacheeDeadlines(prev => 
        prev.map(deadline => 
          deadline.id === deadlineId 
            ? { ...deadline, completed: true }
            : deadline
        )
      );

      toast.success('Deadline als erledigt markiert');
    } catch (error) {
      console.error('Error completing deadline:', error);
      toast.error('Fehler beim Markieren der Deadline');
    }
  };

  const handlePushToPortal = async (deadline) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast.error('Nicht authentifiziert');
        return;
      }

      const { data, error } = await supabase
        .from('pushed_tasks')
        .insert({
          coach_id: userData.user.id,
          coachee_id: deadline.coacheeId,
          original_task_id: deadline.id,
          title: deadline.title,
          description: deadline.description || `Deadline: ${new Date(deadline.date).toLocaleDateString('de-DE')}`,
          status: 'sent'
        })
        .select()
        .single();

      if (error) {
        console.error('Error pushing task to portal:', error);
        toast.error('Fehler beim Senden an Portal');
        return;
      }
      
      const coachee = coachees.find(c => c.id == deadline.coacheeId);
      const coacheeName = coachee ? `${coachee.firstName} ${coachee.lastName}` : 'Coachee';
      
      toast.success(`Aufgabe an ${coacheeName}s Portal gesendet`);
    } catch (error) {
      console.error('Error in handlePushToPortal:', error);
      toast.error('Fehler beim Senden an Portal');
    }
  };

  const handleDeadlineDelete = async (deadlineId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', deadlineId)
          .eq('user_id', userData.user.id);

        if (error) {
          console.error('Supabase delete error:', error);
          toast.error('Fehler beim Löschen der Deadline');
          return;
        }
      }

      setCoacheeDeadlines(prev => prev.filter(deadline => deadline.id !== deadlineId));
      toast.success('Deadline gelöscht');
    } catch (error) {
      console.error('Error deleting deadline:', error);
      toast.error('Fehler beim Löschen der Deadline');
    }
  };

  // Helper functions
  const isOverdue = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(date);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate < today;
  };

  const isToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(date);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate.getTime() === today.getTime();
  };

  const getOverdueCount = () => {
    return coacheeDeadlines.filter(deadline => 
      isOverdue(deadline.date) && !deadline.completed
    ).length;
  };

  const getTodayCount = () => {
    return coacheeDeadlines.filter(deadline => 
      isToday(deadline.date) && !deadline.completed
    ).length;
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.contentWrapper}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {getGreeting()}
          </h1>
          <p className="text-slate-400 text-lg">Hier ist deine Übersicht für heute.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={classes.card + " cursor-pointer hover:bg-slate-700/30 transition-colors"} onClick={() => navigate('/coachees')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-slate-800/50 text-blue-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Coachees</p>
                  <p className="text-2xl font-bold text-slate-200">{stats.totalCoachees}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={classes.card + " cursor-pointer hover:bg-slate-700/30 transition-colors"} onClick={() => navigate('/sessions?filter=today')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-slate-800/50 text-green-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Heutige Sessions</p>
                  <p className="text-2xl font-bold text-slate-200">{stats.activeSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-slate-800/50 text-purple-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Erledigte Tasks</p>
                  <p className="text-2xl font-bold text-slate-200">{stats.completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-slate-800/50 text-orange-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Kommende Deadlines</p>
                  <p className="text-2xl font-bold text-slate-200">{stats.upcomingDeadlines}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Personal Tasks */}
          <Card className={classes.card}>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-200">
                <Target className="h-5 w-5 mr-2 text-blue-400" />
                Deine Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Neue Aufgabe hinzufügen..."
                  value={newPersonalTask}
                  onChange={(e) => setNewPersonalTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePersonalTaskAdd()}
                  className="glass-input"
                />
                <button 
                  onClick={handlePersonalTaskAdd}
                  disabled={!newPersonalTask.trim()}
                  className={classes.btnPrimary}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {personalTasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Keine persönlichen Aufgaben</p>
                    <p className="text-sm text-slate-500 mt-1">Fügen Sie Ihre erste Aufgabe hinzu</p>
                  </div>
                ) : (
                  personalTasks.map(task => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg group">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handlePersonalTaskToggle(task.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`flex-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePersonalTaskDelete(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Coachee Deadlines */}
          <Card className={classes.card}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle className="flex items-center text-slate-200">
                    <CalendarDays className="h-5 w-5 mr-2 text-orange-400" />
                    Coachee Deadlines
                  </CardTitle>
                  {getOverdueCount() > 0 && (
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {getOverdueCount()} überfällig
                    </Badge>
                  )}
                  {getTodayCount() > 0 && (
                    <Badge variant="outline" className="text-orange-400 border-orange-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTodayCount()} heute
                    </Badge>
                  )}
                </div>
                <Dialog open={showDeadlineDialog} onOpenChange={setShowDeadlineDialog}>
                  <DialogTrigger asChild>
                    <button className={classes.btnPrimary}>
                      <Plus className="h-4 w-4 mr-2" />
                      Deadline
                    </button>
                  </DialogTrigger>
                  <DialogContent className={classes.card + " border-slate-700"}>
                    <DialogHeader>
                      <DialogTitle className="text-slate-200">
                        {editingDeadline ? 'Deadline bearbeiten' : 'Neue Deadline erstellen'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Titel *</label>
                        <Input
                          placeholder="Was soll erreicht werden?"
                          value={deadlineForm.title}
                          onChange={(e) => setDeadlineForm(prev => ({ ...prev, title: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Beschreibung</label>
                        <Input
                          placeholder="Zusätzliche Details (optional)"
                          value={deadlineForm.description}
                          onChange={(e) => setDeadlineForm(prev => ({ ...prev, description: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Coachee *</label>
                        <Select
                          value={deadlineForm.coacheeId}
                          onValueChange={(value) => setDeadlineForm(prev => ({ ...prev, coacheeId: value }))}
                        >
                          <SelectTrigger className="glass-input">
                            <SelectValue placeholder="Coachee auswählen" />
                          </SelectTrigger>
                          <SelectContent className="glass-card border-slate-700">
                            {coachees.map(coachee => (
                              <SelectItem key={coachee.id} value={coachee.id.toString()}>
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4" />
                                  <span>{coachee.firstName} {coachee.lastName}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Fälligkeitsdatum *</label>
                        <Input
                          type="date"
                          value={deadlineForm.date}
                          onChange={(e) => setDeadlineForm(prev => ({ ...prev, date: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={handleDeadlineSave}
                          className={`flex-1 ${classes.btnPrimary}`}
                          disabled={!deadlineForm.title || !deadlineForm.date || !deadlineForm.coacheeId}
                        >
                          {editingDeadline ? 'Aktualisieren' : 'Erstellen'}
                        </button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowDeadlineDialog(false);
                            setEditingDeadline(null);
                            setDeadlineForm({ title: '', description: '', date: '', coacheeId: '' });
                          }}
                          className="flex-1"
                        >
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {coacheeDeadlines.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Keine Coachee Deadlines</p>
                    <p className="text-sm text-slate-500 mt-1">Erstellen Sie die erste Deadline</p>
                  </div>
                ) : (
                  coacheeDeadlines.map(deadline => {
                    const coachee = coachees.find(c => c.id == deadline.coacheeId);
                    const coacheeName = coachee ? `${coachee.firstName} ${coachee.lastName}` : 'Unbekannt';
                    
                    return (
                      <div
                        key={deadline.id}
                        className={`p-3 rounded-lg border group transition-colors ${
                          deadline.completed
                            ? 'bg-green-900/20 border-green-700/30'
                            : isOverdue(deadline.date)
                            ? 'bg-red-900/20 border-red-700/30'
                            : isToday(deadline.date)
                            ? 'bg-orange-900/20 border-orange-700/30'
                            : 'bg-slate-800/30 border-slate-700/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {isOverdue(deadline.date) && !deadline.completed && (
                                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                              )}
                              {isToday(deadline.date) && !deadline.completed && (
                                <Clock className="h-4 w-4 text-orange-400 flex-shrink-0" />
                              )}
                              <h4 className={`font-medium truncate ${
                                deadline.completed ? 'text-slate-400 line-through' : 'text-slate-200'
                              }`}>
                                {deadline.title}
                              </h4>
                              {deadline.completed && (
                                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-slate-300">{coacheeName}</span>
                              <span className="text-slate-400">
                                {new Date(deadline.date).toLocaleDateString('de-DE')}
                              </span>
                            </div>
                            {deadline.description && (
                              <p className="text-sm text-slate-400 mt-1">
                                {deadline.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePushToPortal(deadline)}
                              className={classes.btnIcon}
                              title="An Coachee-Portal senden"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeadlineComplete(deadline.id)}
                              className={classes.btnIconGreen}
                              disabled={deadline.completed}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingDeadline(deadline);
                                setDeadlineForm({
                                  title: deadline.title,
                                  description: deadline.description,
                                  date: deadline.date,
                                  coacheeId: deadline.coacheeId.toString()
                                });
                                setShowDeadlineDialog(true);
                              }}
                              className={classes.btnIconBlue}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeadlineDelete(deadline.id)}
                              className={classes.btnIconRed}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geteilte Dokumente von Coachees - Volle Breite */}
        <Card className={classes.card + " mb-8"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-slate-200">
                <Share2 className="h-5 w-5 mr-2 text-green-400" />
                Geteilte Inhalte von Coachees
              </CardTitle>
              <Badge variant="outline" className="text-green-400 border-green-400">
                {(() => {
                  const totalShared = coachees.reduce((count, coachee) => {
                    const portalData = coachee.portalData || {};
                    const sharedContent = portalData.sharedContent || [];
                    return count + sharedContent.length;
                  }, 0);
                  return `${totalShared} insgesamt`;
                })()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(() => {
                const allSharedContent = coachees.flatMap(coachee => {
                  const portalData = coachee.portalData || {};
                  const sharedContent = portalData.sharedContent || [];
                  return sharedContent.map(item => ({
                    ...item,
                    coacheeId: coachee.id,
                    coacheeName: `${coachee.firstName} ${coachee.lastName}`
                  }));
                });

                const sortedContent = allSharedContent.sort((a, b) => 
                  new Date(b.sharedAt) - new Date(a.sharedAt)
                );

                if (sortedContent.length === 0) {
                  return (
                    <div className="text-center py-8 text-slate-400">
                      <Share2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Keine geteilten Inhalte</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Coachees können Inhalte über ihr Portal mit Ihnen teilen
                      </p>
                    </div>
                  );
                }

                return sortedContent.slice(0, 10).map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedSharedItem(item)}
                    className="p-4 rounded-lg border border-slate-700/30 bg-slate-800/20 hover:bg-slate-700/30 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${
                          item.type === 'journal' ? 'bg-purple-600/20' : 'bg-blue-600/20'
                        }`}>
                          {item.type === 'journal' ? (
                            <BookOpen className="h-4 w-4 text-purple-400" />
                          ) : (
                            <Upload className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            von {item.coacheeName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge 
                          variant="outline" 
                          className={item.type === 'journal' 
                            ? 'text-purple-400 border-purple-400 text-xs' 
                            : 'text-blue-400 border-blue-400 text-xs'
                          }
                        >
                          {item.type === 'journal' ? 'Journal' : 'Dokument'}
                        </Badge>
                        {!item.viewedByCoach && (
                          <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">
                            Neu
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                      {item.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(item.sharedAt).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </span>
                      <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Details ansehen →
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className={classes.card}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-200 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-blue-400" />
              Quick Actions
            </CardTitle>
            <p className="text-slate-400 text-sm mt-1">Schnelle Aktionen für deinen Coaching-Alltag</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
               className={classes.btnSecondary + " h-20 flex-col space-y-2"}
                onClick={() => navigate('/sessions')}
              >
                <Calendar className="h-6 w-6 text-blue-400" />
                <span className="text-sm text-slate-300">Neue Session</span>
              </button>

              <button 
                className={classes.btnSecondary + " h-20 flex-col space-y-2"}
                onClick={() => navigate('/coachees')}
              >
                <Users className="h-6 w-6 text-green-400" />
                <span className="text-sm text-slate-300">Coachee hinzufügen</span>
              </button>

              <button 
                className={classes.btnSecondary + " h-20 flex-col space-y-2"}
                onClick={() => {
                  setEditingDeadline(null);
                  setDeadlineForm({ title: '', description: '', date: '', coacheeId: '' });
                  setShowDeadlineDialog(true);
                }}
              >
                <Plus className="h-6 w-6 text-purple-400" />
                <span className="text-sm text-slate-300">Task erstellen</span>
              </button>

              <button 
                className={classes.btnSecondary + " h-20 flex-col space-y-2"}
                onClick={() => navigate('/invoices')}
              >
                <DollarSign className="h-6 w-6 text-yellow-400" />
                <span className="text-sm text-slate-300">Rechnung erstellen</span>
              </button>

              <button 
               className={classes.btnSecondary + " h-20 flex-col space-y-2"}
                onClick={() => navigate('/journal')}
              >
                <BookOpen className="h-6 w-6 text-indigo-400" />
                <span className="text-sm text-slate-300">Journal-Eintrag</span>
              </button>

              <button 
                className={classes.btnSecondary + " h-20 flex-col space-y-2"}
                onClick={() => {
                  toast.success('Backup wird erstellt...');
                }}
              >
                <Download className="h-6 w-6 text-slate-400" />
                <span className="text-sm text-slate-300">Backup erstellen</span>
              </button>

              <button 
                className={classes.btnSecondary + " h-20 flex-col space-y-2"}
                onClick={() => navigate('/documents')}
              >
                <Upload className="h-6 w-6 text-orange-400" />
                <span className="text-sm text-slate-300">Dokument hochladen</span>
              </button>

              <button 
                className={classes.btnSecondary + " h-20 flex-col space-y-2"}
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-6 w-6 text-slate-400" />
                <span className="text-sm text-slate-300">Einstellungen</span>
              </button>
            </div>
          </CardContent>
        </Card>
        {/* Modal für geteilte Inhalte Details */}
        {selectedSharedItem && (
          <Dialog open={!!selectedSharedItem} onOpenChange={() => setSelectedSharedItem(null)}>
            <DialogContent className={classes.card + " border-slate-700 max-w-2xl"}>
              <DialogHeader>
                <DialogTitle className="text-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {selectedSharedItem.type === 'journal' ? (
                      <BookOpen className="h-5 w-5 text-purple-400" />
                    ) : (
                      <Upload className="h-5 w-5 text-blue-400" />
                    )}
                    <span>{selectedSharedItem.title}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={selectedSharedItem.type === 'journal' 
                      ? 'text-purple-400 border-purple-400' 
                      : 'text-blue-400 border-blue-400'
                    }
                  >
                    {selectedSharedItem.type === 'journal' ? 'Journal' : 'Dokument'}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm text-slate-400">
                  Von {selectedSharedItem.coacheeName} • {new Date(selectedSharedItem.sharedAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                
                <div className="p-4 bg-slate-800/30 rounded-lg max-h-96 overflow-y-auto">
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedSharedItem.content}</p>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      navigate(`/coachees/${selectedSharedItem.coacheeId}`);
                      setSelectedSharedItem(null);
                    }}
                    className={classes.btnPrimary + " flex-1"}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Zum Coachee-Profil
                  </Button>
                  <Button
                    onClick={() => setSelectedSharedItem(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Schließen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Dashboard;