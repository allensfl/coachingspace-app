import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Plus, Target, CheckSquare, Trash2, AlertTriangle, User, Calendar, FileText, Folder } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProfileCard from "./coachee-detail/ProfileCard";
import { useAppStateContext } from '@/context/AppStateContext';

// Lazy import für TasksTab
import TasksTab from "./coachee-detail/TasksTab.jsx";

export default function CoacheeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCoacheeById, updateCoachee, removeCoachee } = useAppStateContext();
  
  const [coachee, setCoachee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Ziele State
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);

  // Task Count für Tab-Anzeige
  const [taskCount, setTaskCount] = useState(0);
  const [supabaseTasks, setSupabaseTasks] = useState([]);

  useEffect(() => {
    console.log('Loading coachee with ID:', id);
    
    if (getCoacheeById) {
      const realCoachee = getCoacheeById(id);
      if (realCoachee) {
        console.log('Coachee from AppStateContext:', realCoachee);
        setCoachee(realCoachee);
        
        // Lade bestehende Ziele
        setGoals(realCoachee.goals || []);
        
        // Migriere bestehende Aufgaben zum zentralen System (einmalig)
        migrateTasksToGlobalSystem(realCoachee);
      } else {
        console.log('Coachee nicht gefunden mit ID:', id);
        setCoachee(null);
      }
    }
  }, [id, getCoacheeById]);

  // Coachee löschen - Verwendet jetzt die komplexe removeCoachee Funktion aus AppStateContext
  const handleDeleteCoachee = async () => {
    if (!coachee) return;
    
    setIsDeleting(true);
    
    try {
      // Die komplexe removeCoachee Funktion macht jetzt die gesamte Bereinigung
      await removeCoachee(coachee.id);
      
      // Zurück zur Coachees-Liste
      navigate('/coachees');
      
    } catch (error) {
      console.error('Fehler beim Löschen des Coachees:', error);
      // Error-Handling wird bereits in removeCoachee gemacht
    } finally {
      setIsDeleting(false);
    }
  };

  // Task Count laden - MIT SUPABASE INTEGRATION
  useEffect(() => {
    const loadTaskCount = async () => {
      try {
        // localStorage Tasks
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const localTasks = allTasks.filter(task => 
          task.assignedTo === coachee?.id || 
          task.assignedTo === 'me' ||
          task.coacheeId === coachee?.id
        );

        // Supabase Tasks
        let supabaseTasks = [];
        try {
          const { supabase } = await import('@/supabaseConfig');
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const { data } = await supabase
              .from('tasks')
              .select('*')
              .eq('user_id', userData.user.id)
              .eq('coachee_id', coachee.id);
            supabaseTasks = data || [];
            console.log(`Loaded ${supabaseTasks.length} Supabase tasks for coachee ${coachee.id}`);
          }
        } catch (error) {
          console.log('Supabase tasks loading failed:', error);
        }

        const totalCount = localTasks.length + supabaseTasks.length;
        console.log(`Total tasks for coachee ${coachee.id}: ${totalCount} (${localTasks.length} local + ${supabaseTasks.length} supabase)`);
        setTaskCount(totalCount);
        setSupabaseTasks(supabaseTasks); // Speichere Supabase-Tasks für TasksTab
      } catch (error) {
        console.error('Error loading task count:', error);
      }
    };

    if (coachee) {
      loadTaskCount();
      
      // Bei localStorage-Änderungen aktualisieren
      const handleStorageChange = () => loadTaskCount();
      window.addEventListener('storage', handleStorageChange);
      
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [coachee?.id]);

  // Migriere bestehende Coachee-Aufgaben zum zentralen System
  const migrateTasksToGlobalSystem = (coachee) => {
    if (!coachee.tasks || coachee.tasks.length === 0) return;

    try {
      const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      
      // Prüfe ob bereits migriert
      const existingTaskIds = allTasks.map(t => t.oldTaskId).filter(Boolean);
      const hasUnmigratedTasks = coachee.tasks.some(task => !existingTaskIds.includes(task.id));
      
      if (hasUnmigratedTasks) {
        const migratedTasks = coachee.tasks.map(task => ({
          id: Date.now() + Math.random(), // Neue ID
          oldTaskId: task.id, // Referenz zur alten ID
          title: task.title,
          description: '', // War nicht im alten Format
          priority: task.priority || 'normal',
          dueDate: task.dueDate || '',
          estimatedTime: '',
          category: '',
          notes: '',
          status: task.completed ? 'completed' : 'open',
          assignedTo: coachee.id,
          coacheeId: coachee.id,
          coacheeName: `${coachee.firstName} ${coachee.lastName}`,
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedAt: task.completedAt || null
        }));

        const updatedTasks = [...allTasks, ...migratedTasks];
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        
        console.log(`${migratedTasks.length} Aufgaben von ${coachee.firstName} zum zentralen System migriert`);
        
        // Entferne migrierte Aufgaben vom Coachee-Objekt
        const updatedCoachee = { ...coachee };
        delete updatedCoachee.tasks;
        updateCoachee(updatedCoachee);
        
        toast({
          title: "Aufgaben migriert",
          description: `${migratedTasks.length} bestehende Aufgaben wurden zum neuen System migriert.`
        });
      }
    } catch (error) {
      console.error('Error migrating tasks:', error);
    }
  };

  if (!coachee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-200 text-xl">Lade Coachee-Daten...</div>
      </div>
    );
  }

  const handleProfileUpdate = (updatedCoachee) => {
    console.log('CoacheeDetail - Profil-Update erhalten:', updatedCoachee);
    updateCoachee(updatedCoachee);
    setCoachee(updatedCoachee);
    
    toast({
      title: "Änderungen gespeichert",
      description: "Die Coachee-Daten wurden erfolgreich im System aktualisiert.",
      className: "bg-green-600 text-white"
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Bearbeitung beendet",
      description: "Alle Änderungen wurden automatisch gespeichert.",
      className: "bg-blue-600 text-white"
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
      description: `Neues Ziel "${goal.title}" wurde erstellt.`,
      className: "bg-green-600 text-white"
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
      description: `Ziel "${goal?.title}" wurde entfernt.`,
      className: "bg-red-600 text-white"
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
      description: `"${goal.title}" wurde als ${newStatus === 'completed' ? 'erreicht' : 'aktiv'} markiert.`,
      className: newStatus === 'completed' ? "bg-green-600 text-white" : "bg-blue-600 text-white"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className=" space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/coachees')}
            className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-xl border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zu Coachees
          </Button>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave}
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Speichern
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50 px-6"
                >
                  <X className="mr-2 h-4 w-4" />
                  Abbrechen
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Bearbeiten
                </Button>
                
                {/* Löschen-Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-900/20 hover:border-red-500 px-6"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Löschen
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        Coachee löschen?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400 space-y-3">
                        <p>
                          Möchtest du <strong className="text-white">{coachee.firstName} {coachee.lastName}</strong> wirklich dauerhaft löschen?
                        </p>
                        <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                          <p className="text-red-400 font-medium mb-2">Folgende Daten werden unwiderruflich gelöscht:</p>
                          <ul className="text-sm text-red-300 space-y-1">
                            <li>• Alle persönlichen Daten und Ziele</li>
                            <li>• Alle Aufgaben und Deadlines</li>
                            <li>• Alle Sessions mit diesem Coachee</li>
                            <li>• Alle Rechnungen</li>
                            <li>• Alle Dokumente und Journal-Einträge</li>
                            <li>• Portal-Zugang und geteilte Tasks</li>
                          </ul>
                        </div>
                        <p className="text-sm">
                          Diese Aktion kann nicht rückgängig gemacht werden.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600">
                        Abbrechen
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteCoachee}
                        disabled={isDeleting}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                      >
                        {isDeleting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                            Lösche...
                          </>
                        ) : (
                          'Ja, dauerhaft löschen'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl">
          <Tabs defaultValue="profil" className="w-full">
            {/* Tab Navigation */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 rounded-t-xl p-2">
              <TabsList className="w-full bg-transparent h-auto p-0 space-x-2">
                <TabsTrigger 
                  value="profil" 
                  className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </TabsTrigger>
                <TabsTrigger 
                  value="ziele" 
                  className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  <Target className="mr-2 h-4 w-4" />
                  Ziele ({goals.filter(g => g.status === 'active').length})
                </TabsTrigger>
                <TabsTrigger 
                  value="aufgaben" 
                  className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Aufgaben ({taskCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="verlauf" 
                  className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Verlauf
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <TabsContent value="profil" className="p-8 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <ProfileCard 
                    coachee={coachee}
                    onUpdate={handleProfileUpdate}
                    isEditing={isEditing} 
                  />
                </div>

                {/* Quick Navigation Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl p-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                      Quick Navigation
                    </h3>
                    
                    <div className="space-y-4">
                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/sessions?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all flex items-center justify-center gap-3"
                      >
                        <Calendar className="h-4 w-4" />
                        {coachee.firstName}s Sessions
                      </Button>

                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/journal?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all flex items-center justify-center gap-3"
                      >
                        <User className="h-4 w-4" />
                        {coachee.firstName}s Journal
                      </Button>

                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/invoices?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all flex items-center justify-center gap-3"
                      >
                        <FileText className="h-4 w-4" />
                        {coachee.firstName}s Rechnungen
                      </Button>

                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/documents?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all flex items-center justify-center gap-3"
                      >
                        <Folder className="h-4 w-4" />
                        {coachee.firstName}s Dokumente
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ZIELE TAB */}
            <TabsContent value="ziele" className="p-8 mt-0">
              <div className="space-y-8">
                {/* Neues Ziel hinzufügen */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Neues Ziel hinzufügen</h3>
                  </div>
                  
                  <div className="flex gap-3">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Ziel eingeben (z.B. Work-Life-Balance verbessern)"
                      className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 h-12"
                      onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                    />
                    <Button 
                      onClick={addGoal}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 h-12"
                      disabled={!newGoal.trim()}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Ziele Liste */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Coaching-Ziele ({goals.length})
                    </h3>
                    <div className="flex gap-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                        {goals.filter(g => g.status === 'completed').length} erreicht
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                        {goals.filter(g => g.status === 'active').length} aktiv
                      </Badge>
                    </div>
                  </div>

                  {goals.length === 0 ? (
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl">
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Noch keine Ziele definiert</h4>
                        <p className="text-slate-400 text-lg">
                          Fügen Sie das erste Coaching-Ziel für {coachee.firstName} hinzu.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {goals.map(goal => (
                        <div 
                          key={goal.id} 
                          className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl p-6 ${goal.status === 'completed' ? 'opacity-75' : ''}`}
                        >
                          {editingGoal === goal.id ? (
                            <div className="space-y-4">
                              <Input
                                value={goal.title}
                                onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                                className="bg-slate-700/50 border-slate-600 text-white h-12"
                              />
                              <Textarea
                                value={goal.description}
                                onChange={(e) => updateGoal(goal.id, { description: e.target.value })}
                                placeholder="Beschreibung (optional)"
                                className="bg-slate-700/50 border-slate-600 text-white"
                                rows={3}
                              />
                              <div className="flex gap-3">
                                <Button 
                                  size="sm" 
                                  onClick={() => setEditingGoal(null)}
                                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                >
                                  Speichern
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => setEditingGoal(null)}
                                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                  Abbrechen
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                <input
                                  type="checkbox"
                                  checked={goal.status === 'completed'}
                                  onChange={() => toggleGoalStatus(goal.id)}
                                  className="mt-2 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                                />
                                <div className="flex-1">
                                  <h4 className={`text-lg font-semibold ${goal.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                                    {goal.title}
                                  </h4>
                                  {goal.description && (
                                    <p className="text-slate-400 mt-2 leading-relaxed">{goal.description}</p>
                                  )}
                                  <div className="flex items-center gap-3 mt-4">
                                    <Badge 
                                      className={goal.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}
                                    >
                                      {goal.status === 'completed' ? 'Erreicht' : 'Aktiv'}
                                    </Badge>
                                    <span className="text-slate-500 text-sm">
                                      {goal.status === 'completed' 
                                        ? `Erreicht am ${new Date(goal.achievedAt).toLocaleDateString('de-DE')}`
                                        : `Erstellt am ${new Date(goal.createdAt).toLocaleDateString('de-DE')}`
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingGoal(goal.id)}
                                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteGoal(goal.id)}
                                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* AUFGABEN TAB */}
            <TabsContent value="aufgaben" className="p-8 mt-0">
              <Suspense fallback={
                <div className="text-center py-12">
                  <div className="text-slate-400 text-xl">Lade Aufgaben...</div>
                </div>
              }>
                <TasksTab coachee={coachee} supabaseTasks={supabaseTasks} />
              </Suspense>
            </TabsContent>

            {/* VERLAUF TAB */}
            <TabsContent value="verlauf" className="p-8 mt-0">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl p-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  Coaching-Verlauf
                </h2>
                <p className="text-slate-400 text-lg mb-8">
                  Hier wird der gesamte Coaching-Verlauf von {coachee.firstName} {coachee.lastName} angezeigt.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-700/50 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {goals.length}
                    </div>
                    <div className="text-slate-400">Ziele gesetzt</div>
                  </div>
                  
                  <div className="bg-slate-700/50 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {goals.filter(g => g.status === 'completed').length}
                    </div>
                    <div className="text-slate-400">Ziele erreicht</div>
                  </div>
                  
                  <div className="bg-slate-700/50 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      {taskCount}
                    </div>
                    <div className="text-slate-400">Aufgaben verwaltet</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}