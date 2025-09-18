import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Plus, Target, CheckSquare, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import ProfileCard from "./coachee-detail/ProfileCard";
import { useAppStateContext } from '@/context/AppStateContext';

export default function CoacheeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCoacheeById, updateCoachee } = useAppStateContext();
  
  const [coachee, setCoachee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Ziele State
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);

  // Aufgaben State
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  useEffect(() => {
    console.log('Loading coachee with ID:', id);
    
    if (getCoacheeById) {
      const realCoachee = getCoacheeById(id);
      if (realCoachee) {
        console.log('Coachee from AppStateContext:', realCoachee);
        setCoachee(realCoachee);
        
        // Lade bestehende Ziele und Aufgaben
        setGoals(realCoachee.goals || []);
        setTasks(realCoachee.tasks || []);
      } else {
        console.log('Coachee nicht gefunden mit ID:', id);
        setCoachee(null);
      }
    }
  }, [id, getCoacheeById]);

  if (!coachee) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-200 text-lg">Lade Coachee-Daten...</div>
      </div>
    );
  }

  const handleProfileUpdate = (updatedCoachee) => {
    console.log('CoacheeDetail - Profil-Update erhalten:', updatedCoachee);
    updateCoachee(updatedCoachee);
    setCoachee(updatedCoachee);
    
    toast({
      title: "Änderungen gespeichert",
      description: "Die Coachee-Daten wurden erfolgreich im System aktualisiert."
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Bearbeitung beendet",
      description: "Alle Änderungen wurden automatisch gespeichert."
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    const freshCoachee = getCoacheeById(id);
    if (freshCoachee) {
      setCoachee(freshCoachee);
    }
  };

  // ZIELE-FUNKTIONEN
  const saveGoalsToCoachee = (updatedGoals) => {
    const updatedCoachee = { ...coachee, goals: updatedGoals };
    updateCoachee(updatedCoachee);
    setCoachee(updatedCoachee);
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;

    const goal = {
      id: Date.now(),
      title: newGoal.trim(),
      description: '',
      status: 'active',
      createdAt: new Date().toISOString(),
      targetDate: null,
      achievedAt: null
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    saveGoalsToCoachee(updatedGoals);
    setNewGoal('');

    toast({
      title: "Ziel hinzugefügt",
      description: `Neues Ziel "${goal.title}" wurde erstellt.`
    });
  };

  const updateGoal = (goalId, updates) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    setGoals(updatedGoals);
    saveGoalsToCoachee(updatedGoals);
  };

  const deleteGoal = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    saveGoalsToCoachee(updatedGoals);

    toast({
      title: "Ziel gelöscht",
      description: `Ziel "${goal?.title}" wurde entfernt.`
    });
  };

  const toggleGoalStatus = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    const newStatus = goal.status === 'completed' ? 'active' : 'completed';
    const updates = {
      status: newStatus,
      achievedAt: newStatus === 'completed' ? new Date().toISOString() : null
    };
    
    updateGoal(goalId, updates);

    toast({
      title: newStatus === 'completed' ? "Ziel erreicht!" : "Ziel reaktiviert",
      description: `"${goal.title}" wurde als ${newStatus === 'completed' ? 'erreicht' : 'aktiv'} markiert.`
    });
  };

  // AUFGABEN-FUNKTIONEN
  const saveTasksToCoachee = (updatedTasks) => {
    const updatedCoachee = { ...coachee, tasks: updatedTasks };
    updateCoachee(updatedCoachee);
    setCoachee(updatedCoachee);
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask.trim(),
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasksToCoachee(updatedTasks);
    
    setNewTask('');
    setNewTaskPriority('medium');
    setNewTaskDueDate('');

    toast({
      title: "Aufgabe hinzugefügt",
      description: `Neue Aufgabe "${task.title}" wurde erstellt.`
    });
  };

  const toggleTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : null
          } 
        : task
    );
    setTasks(updatedTasks);
    saveTasksToCoachee(updatedTasks);

    toast({
      title: !task.completed ? "Aufgabe erledigt!" : "Aufgabe reaktiviert",
      description: `"${task.title}" wurde als ${!task.completed ? 'erledigt' : 'offen'} markiert.`
    });
  };

  const deleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToCoachee(updatedTasks);

    toast({
      title: "Aufgabe gelöscht",
      description: `Aufgabe "${task?.title}" wurde entfernt.`
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Hoch';
      case 'medium': return 'Mittel';
      case 'low': return 'Niedrig';
      default: return 'Normal';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/coachees')}
            className="flex items-center gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zu Coachees
          </Button>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Speichern
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Abbrechen
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Bearbeiten
              </Button>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <Tabs defaultValue="profil" className="w-full">
            <TabsList className="w-full bg-slate-900 rounded-t-lg border-b border-slate-700 p-0">
              <TabsTrigger 
                value="profil" 
                className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Profil
              </TabsTrigger>
              <TabsTrigger 
                value="ziele" 
                className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Ziele ({goals.filter(g => g.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger 
                value="aufgaben" 
                className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Aufgaben ({tasks.filter(t => !t.completed).length})
              </TabsTrigger>
              <TabsTrigger 
                value="verlauf" 
                className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Verlauf
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profil" className="p-6 bg-slate-800">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <ProfileCard 
                    coachee={coachee}
                    onUpdate={handleProfileUpdate}
                    isEditing={isEditing} 
                  />
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-6">
                    <h3 className="font-semibold text-slate-200 text-lg mb-6">
                      Quick Navigation
                    </h3>
                    
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/sessions?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        {coachee.firstName}s Sessions
                      </Button>

                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/journal?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        {coachee.firstName}s Journal
                      </Button>

                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/invoices?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        {coachee.firstName}s Rechnungen
                      </Button>

                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/documents?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        {coachee.firstName}s Dokumente
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ZIELE TAB - VOLLSTÄNDIG FUNKTIONAL */}
            <TabsContent value="ziele" className="p-6 bg-slate-800">
              <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-400" />
                      Neues Ziel hinzufügen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Ziel eingeben (z.B. Work-Life-Balance verbessern)"
                        className="flex-1 bg-slate-800 border-slate-600 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                      />
                      <Button 
                        onClick={addGoal}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={!newGoal.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Ziele Liste */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-200">
                      Coaching-Ziele ({goals.length})
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {goals.filter(g => g.status === 'completed').length} erreicht
                      </Badge>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {goals.filter(g => g.status === 'active').length} aktiv
                      </Badge>
                    </div>
                  </div>

                  {goals.length === 0 ? (
                    <Card className="bg-slate-900 border-slate-700">
                      <CardContent className="p-8 text-center">
                        <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">Noch keine Ziele definiert.</p>
                        <p className="text-slate-500 text-sm mt-2">
                          Fügen Sie das erste Coaching-Ziel für {coachee.firstName} hinzu.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {goals.map(goal => (
                        <Card 
                          key={goal.id} 
                          className={`bg-slate-900 border-slate-700 ${goal.status === 'completed' ? 'opacity-75' : ''}`}
                        >
                          <CardContent className="p-4">
                            {editingGoal === goal.id ? (
                              <div className="space-y-3">
                                <Input
                                  value={goal.title}
                                  onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                                  className="bg-slate-800 border-slate-600 text-white"
                                />
                                <Textarea
                                  value={goal.description}
                                  onChange={(e) => updateGoal(goal.id, { description: e.target.value })}
                                  placeholder="Beschreibung (optional)"
                                  className="bg-slate-800 border-slate-600 text-white"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => setEditingGoal(null)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Speichern
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => setEditingGoal(null)}
                                  >
                                    Abbrechen
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={goal.status === 'completed'}
                                    onChange={() => toggleGoalStatus(goal.id)}
                                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <div className="flex-1">
                                    <h4 className={`font-medium ${goal.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                      {goal.title}
                                    </h4>
                                    {goal.description && (
                                      <p className="text-slate-400 text-sm mt-1">{goal.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge 
                                        variant="outline" 
                                        className={goal.status === 'completed' ? 'text-green-400 border-green-400' : 'text-blue-400 border-blue-400'}
                                      >
                                        {goal.status === 'completed' ? 'Erreicht' : 'Aktiv'}
                                      </Badge>
                                      <span className="text-slate-500 text-xs">
                                        {goal.status === 'completed' 
                                          ? `Erreicht am ${new Date(goal.achievedAt).toLocaleDateString('de-DE')}`
                                          : `Erstellt am ${new Date(goal.createdAt).toLocaleDateString('de-DE')}`
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1 ml-4">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingGoal(goal.id)}
                                    className="border-slate-600"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deleteGoal(goal.id)}
                                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* AUFGABEN TAB - VOLLSTÄNDIG FUNKTIONAL */}
            <TabsContent value="aufgaben" className="p-6 bg-slate-800">
              <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-blue-400" />
                      Neue Aufgabe hinzufügen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Aufgabe eingeben"
                        className="md:col-span-2 bg-slate-800 border-slate-600 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      />
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value)}
                        className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                      >
                        <option value="low">Niedrig</option>
                        <option value="medium">Mittel</option>
                        <option value="high">Hoch</option>
                      </select>
                      <Button 
                        onClick={addTask}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={!newTask.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white max-w-xs"
                      placeholder="Fälligkeitsdatum (optional)"
                    />
                  </CardContent>
                </Card>

                {/* Aufgaben Liste */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-200">
                      Aufgaben ({tasks.length})
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {tasks.filter(t => t.completed).length} erledigt
                      </Badge>
                      <Badge variant="outline" className="text-red-400 border-red-400">
                        {tasks.filter(t => !t.completed).length} offen
                      </Badge>
                    </div>
                  </div>

                  {tasks.length === 0 ? (
                    <Card className="bg-slate-900 border-slate-700">
                      <CardContent className="p-8 text-center">
                        <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">Noch keine Aufgaben erstellt.</p>
                        <p className="text-slate-500 text-sm mt-2">
                          Fügen Sie die erste Aufgabe für {coachee.firstName} hinzu.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-3">
                      {tasks.map(task => (
                        <Card 
                          key={task.id} 
                          className={`bg-slate-900 border-slate-700 ${task.completed ? 'opacity-75' : ''}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => toggleTask(task.id)}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <h4 className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getPriorityColor(task.priority)} text-white border-transparent`}
                                    >
                                      {getPriorityText(task.priority)}
                                    </Badge>
                                    {task.dueDate && (
                                      <Badge variant="outline" className="text-xs text-slate-400 border-slate-400">
                                        Fällig: {new Date(task.dueDate).toLocaleDateString('de-DE')}
                                      </Badge>
                                    )}
                                    <span className="text-slate-500 text-xs">
                                      {task.completed 
                                        ? `Erledigt am ${new Date(task.completedAt).toLocaleDateString('de-DE')}`
                                        : `Erstellt am ${new Date(task.createdAt).toLocaleDateString('de-DE')}`
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteTask(task.id)}
                                className="border-red-600 text-red-400 hover:bg-red-900/20 ml-4"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="verlauf" className="p-6 bg-slate-800">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 text-slate-200">Coaching-Verlauf</h2>
                <p className="text-slate-400 mb-6">
                  Hier wird der gesamte Coaching-Verlauf von {coachee.firstName} {coachee.lastName} angezeigt.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-800 border-slate-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {goals.length}
                      </div>
                      <div className="text-sm text-slate-400">Ziele gesetzt</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800 border-slate-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {goals.filter(g => g.status === 'completed').length}
                      </div>
                      <div className="text-sm text-slate-400">Ziele erreicht</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800 border-slate-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {tasks.filter(t => t.completed).length}
                      </div>
                      <div className="text-sm text-slate-400">Aufgaben erledigt</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}