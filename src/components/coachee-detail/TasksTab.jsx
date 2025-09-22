import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit, 
  Trash2, 
  Share, 
  Calendar as CalendarLucide,
  Target,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const TasksTab = ({ coachee, supabaseTasks = [] }) => {
  const [tasks, setTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: coachee?.id || '',
    dueDate: null,
    category: 'general',
    estimatedTime: '',
    status: 'open'
  });

  const { toast } = useToast();

  // Load tasks from localStorage AND Supabase
  useEffect(() => {
    if (!coachee?.id) return;

    console.log('TasksTab: Loading tasks for coachee', coachee.id);
    console.log('TasksTab: Received supabaseTasks:', supabaseTasks);

    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Tasks assigned TO this coachee from localStorage
    const localCoacheeTasks = allTasks.filter(task => task.assignedTo === coachee.id);
    
    // My tasks ABOUT this coachee from localStorage
    const localRelatedTasks = allTasks.filter(task => 
      task.assignedTo === 'me' && 
      task.relatedCoachee === coachee.id
    );

    // Convert Supabase tasks to display format
    const supabaseCoacheeTasks = supabaseTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      assignedTo: coachee.id,
      dueDate: task.due_date,
      category: task.category || 'general',
      estimatedTime: '',
      status: task.completed ? 'completed' : 'open',
      createdAt: task.created_at,
      isSupabaseTask: true // Mark as Supabase task
    }));

    // Combine localStorage and Supabase tasks
    const combinedCoacheeTasks = [...localCoacheeTasks, ...supabaseCoacheeTasks];
    
    console.log('TasksTab: Combined coachee tasks:', combinedCoacheeTasks.length);
    console.log('TasksTab: Local tasks:', localCoacheeTasks.length, 'Supabase tasks:', supabaseCoacheeTasks.length);
    
    setTasks(combinedCoacheeTasks);
    setMyTasks(localRelatedTasks);
  }, [coachee?.id, supabaseTasks]);

  const saveTask = (task) => {
    // Only save to localStorage (Supabase tasks are managed elsewhere)
    if (task.isSupabaseTask) {
      toast({
        title: "Info",
        description: "Supabase-Tasks können nur im Dashboard bearbeitet werden.",
        variant: "default"
      });
      return;
    }

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
    
    // Reload tasks (keep Supabase tasks)
    const localCoacheeTasks = updatedTasks.filter(task => task.assignedTo === coachee.id);
    const localRelatedTasks = updatedTasks.filter(task => 
      task.assignedTo === 'me' && 
      task.relatedCoachee === coachee.id
    );
    
    const supabaseCoacheeTasks = supabaseTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      assignedTo: coachee.id,
      dueDate: task.due_date,
      category: task.category || 'general',
      estimatedTime: '',
      status: task.completed ? 'completed' : 'open',
      createdAt: task.created_at,
      isSupabaseTask: true
    }));

    const combinedCoacheeTasks = [...localCoacheeTasks, ...supabaseCoacheeTasks];
    
    setTasks(combinedCoacheeTasks);
    setMyTasks(localRelatedTasks);
  };

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    
    if (taskToDelete?.isSupabaseTask) {
      toast({
        title: "Info",
        description: "Supabase-Tasks können nur im Dashboard gelöscht werden.",
        variant: "default"
      });
      return;
    }

    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = allTasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    // Reload tasks (keep Supabase tasks)
    const localCoacheeTasks = updatedTasks.filter(task => task.assignedTo === coachee.id);
    const localRelatedTasks = updatedTasks.filter(task => 
      task.assignedTo === 'me' && 
      task.relatedCoachee === coachee.id
    );
    
    const supabaseCoacheeTasks = supabaseTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      assignedTo: coachee.id,
      dueDate: task.due_date,
      category: task.category || 'general',
      estimatedTime: '',
      status: task.completed ? 'completed' : 'open',
      createdAt: task.created_at,
      isSupabaseTask: true
    }));

    const combinedCoacheeTasks = [...localCoacheeTasks, ...supabaseCoacheeTasks];
    
    setTasks(combinedCoacheeTasks);
    setMyTasks(localRelatedTasks);

    toast({
      title: "Aufgabe gelöscht",
      description: "Die Aufgabe wurde erfolgreich entfernt."
    });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    
    if (taskToUpdate?.isSupabaseTask) {
      toast({
        title: "Info",
        description: "Supabase-Tasks können nur im Dashboard bearbeitet werden.",
        variant: "default"
      });
      return;
    }

    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = allTasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    );
    
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    // Reload tasks (keep Supabase tasks)
    const localCoacheeTasks = updatedTasks.filter(task => task.assignedTo === coachee.id);
    const localRelatedTasks = updatedTasks.filter(task => 
      task.assignedTo === 'me' && 
      task.relatedCoachee === coachee.id
    );
    
    const supabaseCoacheeTasks = supabaseTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      assignedTo: coachee.id,
      dueDate: task.due_date,
      category: task.category || 'general',
      estimatedTime: '',
      status: task.completed ? 'completed' : 'open',
      createdAt: task.created_at,
      isSupabaseTask: true
    }));

    const combinedCoacheeTasks = [...localCoacheeTasks, ...supabaseCoacheeTasks];
    
    setTasks(combinedCoacheeTasks);
    setMyTasks(localRelatedTasks);
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

    const taskToSave = {
      ...newTask,
      relatedCoachee: newTask.assignedTo === 'me' ? coachee.id : null
    };

    saveTask(taskToSave);
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: coachee?.id || '',
      dueDate: null,
      category: 'general',
      estimatedTime: '',
      status: 'open'
    });
    
    setShowNewTaskDialog(false);
    
    toast({
      title: "Aufgabe erstellt",
      description: `Neue Aufgabe wurde ${newTask.assignedTo === 'me' ? 'dir' : coachee?.firstName || coachee?.name} zugewiesen.`
    });
  };

  const generateShareLink = () => {
    const token = btoa(`${coachee.id}-${Date.now()}`);
    const shareUrl = `${window.location.origin}/coachee-tasks/${(coachee.firstName || coachee.name || '').toLowerCase().replace(/\s+/g, '-')}-${token}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link kopiert!",
      description: "Der Aufgaben-Link wurde in die Zwischenablage kopiert."
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'open': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const TaskCard = ({ task, isMyTask = false }) => (
    <Card className={`glass-card border-slate-700/50 ${task.isSupabaseTask ? 'ring-1 ring-blue-500/30' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-white">{task.title}</h4>
            {task.isSupabaseTask && (
              <Badge className="mt-1 bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                Dashboard
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (task.isSupabaseTask) {
                  toast({
                    title: "Info",
                    description: "Dashboard-Tasks können nur im Dashboard bearbeitet werden.",
                    variant: "default"
                  });
                  return;
                }
                setEditingTask(task);
                setNewTask(task);
                setShowNewTaskDialog(true);
              }}
              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteTask(task.id)}
              className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {task.description && (
          <p className="text-sm text-slate-400 mb-3">{task.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority === 'high' ? 'Hoch' : 
             task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
          </Badge>
          
          <Badge className={getStatusColor(task.status)}>
            {task.status === 'completed' ? 'Abgeschlossen' :
             task.status === 'in-progress' ? 'In Bearbeitung' : 'Offen'}
          </Badge>
          
          {task.dueDate && (
            <Badge variant="outline" className="text-slate-400 border-slate-600">
              <CalendarLucide className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), 'dd.MM.yyyy', { locale: de })}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (task.isSupabaseTask) {
                toast({
                  title: "Info",
                  description: "Dashboard-Tasks können nur im Dashboard bearbeitet werden.",
                  variant: "default"
                });
                return;
              }
              updateTaskStatus(task.id, 
                task.status === 'completed' ? 'open' : 
                task.status === 'open' ? 'in-progress' : 'completed'
              )
            }}
            className="flex-1"
          >
            {task.status === 'completed' ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Wiedereröffnen
              </>
            ) : task.status === 'open' ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Starten
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Abschließen
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Statistics
  const totalTasks = tasks.length + myTasks.length;
  const completedTasks = [...tasks, ...myTasks].filter(t => t.status === 'completed').length;
  const inProgressTasks = [...tasks, ...myTasks].filter(t => t.status === 'in-progress').length;
  const openTasks = [...tasks, ...myTasks].filter(t => t.status === 'open').length;

  const coacheeName = coachee?.firstName || coachee?.lastName || coachee?.name || 'Coachee';

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalTasks}</div>
              <div className="text-sm text-slate-400">Gesamt</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
              <div className="text-sm text-slate-400">Abgeschlossen</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{inProgressTasks}</div>
              <div className="text-sm text-slate-400">In Arbeit</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-400">{openTasks}</div>
              <div className="text-sm text-slate-400">Offen</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Neue Aufgabe
            </Button>
          </DialogTrigger>
          
          <DialogContent className="glass-card border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingTask ? 'Aufgabe bearbeiten' : 'Neue Aufgabe erstellen'}
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
                    Zugewiesen an
                  </label>
                  <Select 
                    value={newTask.assignedTo} 
                    onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value={coachee?.id} className="text-white">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {coacheeName}
                        </div>
                      </SelectItem>
                      <SelectItem value="me" className="text-white">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Mir selbst
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Fälligkeitsdatum
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-white",
                        !newTask.dueDate && "text-slate-400"
                      )}
                    >
                      <CalendarLucide className="mr-2 h-4 w-4" />
                      {newTask.dueDate ? format(new Date(newTask.dueDate), 'dd.MM.yyyy', { locale: de }) : "Datum auswählen"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-700 border-slate-600">
                    <Calendar
                      mode="single"
                      selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                      onSelect={(date) => setNewTask({...newTask, dueDate: date?.toISOString()})}
                      initialFocus
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
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
                      assignedTo: coachee?.id || '',
                      dueDate: null,
                      category: 'general',
                      estimatedTime: '',
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
        
        <Button 
          variant="outline" 
          onClick={generateShareLink}
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <Share className="h-4 w-4 mr-2" />
          Link teilen
        </Button>
      </div>

      {/* Tasks */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coachee Tasks */}
        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Aufgaben für {coacheeName} ({tasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                  <p className="text-slate-400">Keine Aufgaben für {coacheeName} vorhanden</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* My Tasks */}
        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Meine Aufgaben zu {coacheeName} ({myTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {myTasks.length > 0 ? (
                myTasks.map((task) => (
                  <TaskCard key={task.id} task={task} isMyTask={true} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Target className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                  <p className="text-slate-400">Keine eigenen Aufgaben zu {coacheeName} vorhanden</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TasksTab;