import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, User, Tag, AlertCircle, CheckCircle2, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppStateContext } from '../context/AppStateContext';

const TaskManager = () => {
  const { tasks, coachees, addTask, updateTask, deleteTask } = useAppStateContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignment, setFilterAssignment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('faelligkeitsdatum');

  const [newTask, setNewTask] = useState({
    titel: '',
    thema: '',
    konkretesToDo: '',
    faelligkeitsdatum: new Date().toISOString().split('T')[0],
    prioritaet: 'Normal',
    zugewiesenAn: 'self',
    zeitschaetzung: '',
    notizen: ''
  });

  const themen = [
    { value: 'coaching', label: 'Coaching', icon: '📖' },
    { value: 'marketing', label: 'Marketing', icon: '🎯' },
    { value: 'administration', label: 'Administration', icon: '⚙️' },
    { value: 'kundenbetreuung', label: 'Kundenbetreuung', icon: '🤝' },
    { value: 'weiterbildung', label: 'Weiterbildung', icon: '📚' },
    { value: 'networking', label: 'Networking', icon: '🌐' },
    { value: 'finanzen', label: 'Finanzen', icon: '💰' },
    { value: 'strategie', label: 'Strategie', icon: '🎲' }
  ];

  const prioritaeten = ['Niedrig', 'Normal', 'Hoch', 'Dringend'];
  
  const getPriorityColor = (prioritaet) => {
    switch (prioritaet) {
      case 'Dringend': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Hoch': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Normal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Niedrig': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getThemeIcon = (thema) => {
    const theme = themen.find(t => t.value === thema);
    return theme ? theme.icon : '📝';
  };

  const getThemeLabel = (thema) => {
    const theme = themen.find(t => t.value === thema);
    return theme ? theme.label : thema;
  };

  const isOverdue = (faelligkeitsdatum) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(faelligkeitsdatum);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCreateTask = () => {
    console.log('Available coachees:', coachees);
    console.log('Creating task:', newTask);
    
    if (!newTask.titel.trim()) {
      alert('Bitte geben Sie einen Titel ein.');
      return;
    }

    if (typeof addTask !== 'function') {
      console.error('addTask is not a function');
      alert('Fehler: Task kann nicht erstellt werden.');
      return;
    }

    const taskToAdd = {
      ...newTask,
      id: Date.now().toString(),
      abgeschlossen: false,
      erstelltAm: new Date().toISOString(),
      faelligkeitsdatum: newTask.faelligkeitsdatum || new Date().toISOString().split('T')[0],
      zugewiesenAn: newTask.zugewiesenAn === 'self' ? null : newTask.zugewiesenAn
    };

    try {
      addTask(taskToAdd);
      console.log('Task successfully created');
      
      // Reset form
      setNewTask({
        titel: '',
        thema: '',
        konkretesToDo: '',
        faelligkeitsdatum: new Date().toISOString().split('T')[0],
        prioritaet: 'Normal',
        zugewiesenAn: 'self',
        zeitschaetzung: '',
        notizen: ''
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Fehler beim Erstellen der Aufgabe.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask({
      ...task,
      zugewiesenAn: task.zugewiesenAn || 'self'
    });
    setEditDialogOpen(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask.titel.trim()) {
      alert('Bitte geben Sie einen Titel ein.');
      return;
    }

    const updatedTask = {
      ...editingTask,
      zugewiesenAn: editingTask.zugewiesenAn === 'self' ? null : editingTask.zugewiesenAn
    };

    updateTask(editingTask.id, updatedTask);
    setEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?')) {
      deleteTask(taskId);
    }
  };

  const handleToggleComplete = (task) => {
    updateTask(task.id, { abgeschlossen: !task.abgeschlossen });
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks || [];

    // Filter by status
    if (filterStatus === 'completed') {
      filtered = filtered.filter(task => task.abgeschlossen);
    } else if (filterStatus === 'active') {
      filtered = filtered.filter(task => !task.abgeschlossen);
    } else if (filterStatus === 'overdue') {
      filtered = filtered.filter(task => !task.abgeschlossen && isOverdue(task.faelligkeitsdatum));
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.prioritaet === filterPriority);
    }

    // Filter by assignment
    if (filterAssignment !== 'all') {
      const matchesAssignment = filterAssignment === 'self' ? 
        (task) => !task.zugewiesenAn : 
        (task) => task.zugewiesenAn === filterAssignment;
      filtered = filtered.filter(matchesAssignment);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.konkretesToDo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.thema.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'faelligkeitsdatum':
          return new Date(a.faelligkeitsdatum) - new Date(b.faelligkeitsdatum);
        case 'prioritaet':
          const priorityOrder = { 'Dringend': 4, 'Hoch': 3, 'Normal': 2, 'Niedrig': 1 };
          return (priorityOrder[b.prioritaet] || 2) - (priorityOrder[a.prioritaet] || 2);
        case 'titel':
          return a.titel.localeCompare(b.titel);
        case 'erstelltAm':
          return new Date(b.erstelltAm) - new Date(a.erstelltAm);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, filterStatus, filterPriority, filterAssignment, searchTerm, sortBy]);

  return (
    <div className="p-6 ">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Aufgaben-Management</h1>
          <p className="text-muted-foreground mt-2">Verwalten Sie Ihre Coaching-Aufgaben strukturiert</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="glass-button">
              <Plus className="h-4 w-4 mr-2" />
              Neue Aufgabe
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card-enhanced max-w-2xl">
            <DialogHeader>
              <DialogTitle>Neue Aufgabe erstellen</DialogTitle>
              <DialogDescription>
                Strukturieren Sie Ihre Aufgabe mit Titel, Thema und konkretem To-Do
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titel">Titel *</Label>
                  <Input
                    id="titel"
                    placeholder="z.B. LinkedIn-Content erstellen"
                    value={newTask.titel}
                    onChange={(e) => setNewTask({...newTask, titel: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thema">Thema</Label>
                  <Select 
                    value={newTask.thema} 
                    onValueChange={(value) => setNewTask({...newTask, thema: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Thema wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {themen.map(thema => (
                        <SelectItem key={thema.value} value={thema.value}>
                          <span className="flex items-center gap-2">
                            {thema.icon} {thema.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="konkretesToDo">Konkretes To-Do *</Label>
                <Textarea
                  id="konkretesToDo"
                  placeholder="Beschreiben Sie genau, was zu tun ist..."
                  value={newTask.konkretesToDo}
                  onChange={(e) => setNewTask({...newTask, konkretesToDo: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prioritaet">Priorität</Label>
                  <Select 
                    value={newTask.prioritaet} 
                    onValueChange={(value) => setNewTask({...newTask, prioritaet: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prioritaeten.map(prio => (
                        <SelectItem key={prio} value={prio}>{prio}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zeitschaetzung">Zeitschätzung</Label>
                  <Input
                    id="zeitschaetzung"
                    placeholder="z.B. 2h, 30min"
                    value={newTask.zeitschaetzung}
                    onChange={(e) => setNewTask({...newTask, zeitschaetzung: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faelligkeitsdatum">Fälligkeitsdatum</Label>
                  <Input
                    id="faelligkeitsdatum"
                    type="date"
                    value={newTask.faelligkeitsdatum}
                    onChange={(e) => setNewTask({...newTask, faelligkeitsdatum: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zugewiesenAn">Zugewiesen an</Label>
                  <Select 
                    value={newTask.zugewiesenAn} 
                    onValueChange={(value) => setNewTask({...newTask, zugewiesenAn: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Mir selbst</SelectItem>
                      {coachees?.map(coachee => (
                        <SelectItem key={coachee.id} value={coachee.id}>
                          {coachee.firstName || coachee.vorname} {coachee.lastName || coachee.nachname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notizen">Zusätzliche Notizen</Label>
                <Textarea
                  id="notizen"
                  placeholder="Weitere Details, Links, Kontext..."
                  value={newTask.notizen}
                  onChange={(e) => setNewTask({...newTask, notizen: e.target.value})}
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleCreateTask} className="glass-button">
                Aufgabe erstellen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Suche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Aufgaben durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
                <SelectItem value="overdue">Überfällig</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priorität filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Prioritäten</SelectItem>
                {prioritaeten.map(prio => (
                  <SelectItem key={prio} value={prio}>{prio}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sortieren nach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faelligkeitsdatum">Fälligkeitsdatum</SelectItem>
                <SelectItem value="prioritaet">Priorität</SelectItem>
                <SelectItem value="titel">Titel</SelectItem>
                <SelectItem value="erstelltAm">Erstellungsdatum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredAndSortedTasks.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Keine Aufgaben gefunden</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                    ? 'Keine Aufgaben entsprechen Ihren aktuellen Filterkriterien.'
                    : 'Sie haben noch keine Aufgaben erstellt.'}
                </p>
                {!searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
                  <Button onClick={() => setIsOpen(true)} className="glass-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Erste Aufgabe erstellen
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedTasks.map((task) => (
            <Card key={task.id} className={`glass-card transition-all duration-300 hover:shadow-lg ${task.abgeschlossen ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleComplete(task)}
                        className={`p-1 h-6 w-6 rounded-full border-2 transition-all duration-200 ${
                          task.abgeschlossen 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-muted-foreground/30 hover:border-primary'
                        }`}
                      >
                        {task.abgeschlossen && <CheckCircle2 className="h-3 w-3" />}
                      </Button>
                      <h3 className={`text-lg font-semibold ${task.abgeschlossen ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.titel}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getThemeIcon(task.thema)}</span>
                        <Badge variant="outline" className="text-xs">
                          {getThemeLabel(task.thema)}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {task.konkretesToDo}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className={isOverdue(task.faelligkeitsdatum) && !task.abgeschlossen ? 'text-red-400 font-medium' : ''}>
                          {formatDate(task.faelligkeitsdatum)}
                        </span>
                        {isOverdue(task.faelligkeitsdatum) && !task.abgeschlossen && (
                          <Badge variant="outline" className="ml-2 text-red-400 border-red-400/30 bg-red-500/10">
                            Überfällig
                          </Badge>
                        )}
                      </div>
                      
                      {task.zeitschaetzung && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{task.zeitschaetzung}</span>
                        </div>
                      )}
                      
                      {task.zugewiesenAn && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>
                            {coachees?.find(c => c.id === task.zugewiesenAn)?.firstName || 
                             coachees?.find(c => c.id === task.zugewiesenAn)?.vorname || 'Unbekannt'}
                          </span>
                        </div>
                      )}
                      
                      <Badge className={getPriorityColor(task.prioritaet)}>
                        {task.prioritaet}
                      </Badge>
                    </div>

                    {task.notizen && (
                      <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Notizen:</strong> {task.notizen}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                      className="h-8 w-8 p-0 hover:bg-blue-500/20"
                    >
                      <Edit2 className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="h-8 w-8 p-0 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="glass-card-enhanced max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aufgabe bearbeiten</DialogTitle>
            <DialogDescription>
              Ändern Sie die Details Ihrer Aufgabe
            </DialogDescription>
          </DialogHeader>
          
          {editingTask && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-titel">Titel *</Label>
                  <Input
                    id="edit-titel"
                    value={editingTask.titel}
                    onChange={(e) => setEditingTask({...editingTask, titel: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-thema">Thema</Label>
                  <Select 
                    value={editingTask.thema} 
                    onValueChange={(value) => setEditingTask({...editingTask, thema: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themen.map(thema => (
                        <SelectItem key={thema.value} value={thema.value}>
                          <span className="flex items-center gap-2">
                            {thema.icon} {thema.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-konkretesToDo">Konkretes To-Do *</Label>
                <Textarea
                  id="edit-konkretesToDo"
                  value={editingTask.konkretesToDo}
                  onChange={(e) => setEditingTask({...editingTask, konkretesToDo: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-prioritaet">Priorität</Label>
                  <Select 
                    value={editingTask.prioritaet} 
                    onValueChange={(value) => setEditingTask({...editingTask, prioritaet: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prioritaeten.map(prio => (
                        <SelectItem key={prio} value={prio}>{prio}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-zeitschaetzung">Zeitschätzung</Label>
                  <Input
                    id="edit-zeitschaetzung"
                    value={editingTask.zeitschaetzung || ''}
                    onChange={(e) => setEditingTask({...editingTask, zeitschaetzung: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-faelligkeitsdatum">Fälligkeitsdatum</Label>
                  <Input
                    id="edit-faelligkeitsdatum"
                    type="date"
                    value={editingTask.faelligkeitsdatum}
                    onChange={(e) => setEditingTask({...editingTask, faelligkeitsdatum: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-zugewiesenAn">Zugewiesen an</Label>
                  <Select 
                    value={editingTask.zugewiesenAn} 
                    onValueChange={(value) => setEditingTask({...editingTask, zugewiesenAn: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Mir selbst</SelectItem>
                      {coachees?.map(coachee => (
                        <SelectItem key={coachee.id} value={coachee.id}>
                          {coachee.firstName || coachee.vorname} {coachee.lastName || coachee.nachname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notizen">Zusätzliche Notizen</Label>
                <Textarea
                  id="edit-notizen"
                  value={editingTask.notizen || ''}
                  onChange={(e) => setEditingTask({...editingTask, notizen: e.target.value})}
                  rows={2}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleUpdateTask} className="glass-button">
              Änderungen speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManager;