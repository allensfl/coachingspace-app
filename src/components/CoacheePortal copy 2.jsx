import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/supabaseConfig';
import { 
  Shield, ShieldCheck, Eye, EyeOff, AlertTriangle, 
  MessageCircle, CheckSquare, BookOpen, Upload, 
  TrendingUp, Settings, Plus, Send, Save, 
  Calendar, Clock, Share2, Lock
} from 'lucide-react';

// Helper-Funktion für Kalenderwoche
Date.prototype.getWeek = function() {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

const CoacheePortal = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [coachee, setCoachee] = useState(null);
  const [isValidToken, setIsValidToken] = useState(false);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Portal-Bereiche State
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Setup State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login State
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Journal State
  const [journalEntries, setJournalEntries] = useState([]);
  const [newJournalEntry, setNewJournalEntry] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  
  // Tasks State - MIT SUPABASE INTEGRATION
  const [tasks, setTasks] = useState([]);
  const [supabaseTasks, setSupabaseTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  
  // Shared Content State
  const [sharedContent, setSharedContent] = useState([]);
  
  // Wochenimpulse State
  const [weeklyImpulses, setWeeklyImpulses] = useState([]);
  
  // Documents State
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Progress State
  const [progressData, setProgressData] = useState({
    goals: [],
    achievements: [],
    reflections: []
  });
  
  // Zusätzliche State für Progress-Bereich
  const [newGoal, setNewGoal] = useState('');
  const [newReflection, setNewReflection] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    console.log('Portal - Validiere Token:', token);
    
    const storedCoachees = JSON.parse(localStorage.getItem('coachees') || '[]');
    
    const foundCoachee = storedCoachees.find(c => {
      const access = c.portalAccess;
      if (!access) return false;
      
      return access.oneTimeToken === token || 
             access.permanentToken === token ||
             access.initialToken === token;
    });

    console.log('Portal - Gefundener Coachee (localStorage):', foundCoachee);

    if (!foundCoachee) {
      setIsValidToken(false);
      setLoading(false);
      return;
    }

    setCoachee(foundCoachee);
    setIsValidToken(true);

    // Portal-Daten laden
    loadPortalData(foundCoachee);

    const portalAccess = foundCoachee.portalAccess;
    
    if (portalAccess.oneTimeToken === token) {
      if (portalAccess.isUsed) {
        setIsValidToken(false);
      } else if (!portalAccess.hasPassword) {
        setNeedsPasswordSetup(true);
      } else {
        setIsValidToken(false);
      }
    } else if (portalAccess.permanentToken === token) {
      if (portalAccess.hasPassword) {
        setNeedsPasswordSetup(false);
        setIsAuthenticated(false);
      } else {
        setIsValidToken(false);
      }
    }

    setLoading(false);
  }, [token]);

  // Portal-Daten laden - MIT SUPABASE INTEGRATION
  const loadPortalData = async (coacheeData) => {
    const portalData = coacheeData.portalData || {};
    
    // Lokale Portal-Daten laden
    setJournalEntries(portalData.journalEntries || []);
    setSharedContent(portalData.sharedContent || []);
    setWeeklyImpulses(portalData.weeklyImpulses || []);
    setDocuments(portalData.documents || []);
    setProgressData(portalData.progressData || {
      goals: [],
      achievements: [],
      reflections: []
    });

    // Lokale Tasks aus Portal
    const localTasks = portalData.tasks || [];
    setTasks(localTasks);

    // Supabase-Tasks für diesen Coachee laden
    await loadSupabaseTasks(coacheeData.id);
  };

  // Supabase-Tasks für Coachee laden
  const loadSupabaseTasks = async (coacheeId) => {
    try {
      console.log('Portal - Loading Supabase tasks for coachee:', coacheeId);
      
      // Versuche direkt Tasks zu laden
      const { data: allTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('coachee_id', coacheeId)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (!tasksError && allTasks) {
        console.log('Portal - Loaded Supabase tasks:', allTasks.length);
        setSupabaseTasks(allTasks);
      } else {
        console.log('Portal - Error loading tasks:', tasksError);
        setSupabaseTasks([]);
      }

    } catch (error) {
      console.error('Portal - Error loading Supabase tasks:', error);
      setSupabaseTasks([]);
    }
  };

  const savePortalData = () => {
    const storedCoachees = JSON.parse(localStorage.getItem('coachees') || '[]');
    const coacheeIndex = storedCoachees.findIndex(c => c.id === coachee.id);
    
    if (coacheeIndex !== -1) {
      storedCoachees[coacheeIndex].portalData = {
        journalEntries,
        tasks, // Nur lokale Tasks speichern
        sharedContent,
        weeklyImpulses,
        documents,
        progressData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('coachees', JSON.stringify(storedCoachees));
    }
  };

  const handlePasswordSetup = () => {
    if (password !== confirmPassword) {
      alert('Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 6) {
      alert('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    const permanentToken = crypto.randomUUID();
    const hashedPassword = btoa(password);

    const storedCoachees = JSON.parse(localStorage.getItem('coachees') || '[]');
    const coacheeIndex = storedCoachees.findIndex(c => c.id === coachee.id);
    
    if (coacheeIndex !== -1) {
      storedCoachees[coacheeIndex].portalAccess = {
        ...storedCoachees[coacheeIndex].portalAccess,
        isUsed: true,
        hasPassword: true,
        passwordHash: hashedPassword,
        permanentToken: permanentToken,
        oneTimeToken: null
      };
      
      localStorage.setItem('coachees', JSON.stringify(storedCoachees));
      window.location.href = `/portal/${permanentToken}`;
    }
  };

  const handleLogin = async () => {
    const hashedPassword = btoa(loginPassword);
    
    if (hashedPassword === coachee.portalAccess.passwordHash) {
      setIsAuthenticated(true);
      setLoginError('');
      // Nach dem Login Supabase-Tasks laden
      await loadSupabaseTasks(coachee.id);
    } else {
      setLoginError('Falsches Passwort. Bitte versuchen Sie es erneut.');
    }
  };

  // Task Funktionen - ERWEITERT FÜR SUPABASE
  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      title: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      isLocal: true
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    setNewTask('');
    
    setTimeout(savePortalData, 100);
  };

  const toggleTask = (taskId) => {
    // Prüfe ob es eine Supabase-Task ist
    const supabaseTask = supabaseTasks.find(t => t.id === taskId);
    
    if (supabaseTask) {
      alert('Diese Aufgabe kann nur von Ihrem Coach bearbeitet werden.');
      return;
    }

    // Lokale Task togglen
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    setTimeout(savePortalData, 100);
  };

  // Kombinierte Tasks für Anzeige
  const getAllTasks = () => {
    const localTasksForDisplay = tasks.map(task => ({ ...task, isLocal: true }));
    const supabaseTasksForDisplay = supabaseTasks.map(task => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      createdAt: task.created_at,
      dueDate: task.due_date,
      description: task.description,
      priority: task.priority,
      isLocal: false,
      isSupabaseTask: true
    }));
    
    return [...localTasksForDisplay, ...supabaseTasksForDisplay]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse text-slate-400">Lade Portal...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid Token
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-slate-200 mb-2">Link ungültig oder abgelaufen</h1>
            <p className="text-slate-400 mb-6">
              Dieser Portal-Link ist nicht mehr gültig. Bitte wenden Sie sich an Ihren Coach für einen neuen Zugang.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              Zurück zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Password Setup
  if (needsPasswordSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center pb-4">
            <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-200">Willkommen, {coachee.firstName}!</h1>
            <p className="text-slate-400 mt-2">
              Ihr persönlicher und geschützter Raum für Reflexion und Wachstum
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">
                <strong>Wichtiger Sicherheitshinweis:</strong> Nur Sie haben Zugang zu diesem privaten Bereich. 
                Bitte wählen Sie ein sicheres Passwort und bewahren Sie es gut auf. Ihr Coach kann Ihr Passwort nicht wiederherstellen.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Neues Passwort (mindestens 6 Zeichen)
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 glass-input"
                    placeholder="Ihr sicheres Passwort"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Passwort bestätigen
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 glass-input"
                    placeholder="Passwort wiederholen"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                onClick={handlePasswordSetup}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!password || password !== confirmPassword || password.length < 6}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Portal einrichten
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center pb-4">
            <ShieldCheck className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-200">Willkommen zurück, {coachee.firstName}!</h1>
            <p className="text-slate-400 mt-2">
              Bitte geben Sie Ihr Passwort ein, um auf Ihr Portal zuzugreifen
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Passwort
                </label>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="glass-input"
                  placeholder="Ihr Passwort"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              {loginError && (
                <div className="text-red-400 text-sm">{loginError}</div>
              )}

              <Button
                onClick={handleLogin}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={!loginPassword}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Anmelden
              </Button>

              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Passwort vergessen? Wenden Sie sich an Ihren Coach für einen neuen Zugang.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Navigation
  const navigation = [
    { id: 'dashboard', label: 'Übersicht', icon: Shield },
    { id: 'tasks', label: 'Aufgaben', icon: CheckSquare },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'documents', label: 'Dokumente', icon: Upload },
    { id: 'progress', label: 'Fortschritt', icon: TrendingUp },
    { id: 'settings', label: 'Einstellungen', icon: Settings }
  ];

  // Tasks Sektion
  const renderTasksSection = () => {
    const allTasks = getAllTasks();
    const openTasks = allTasks.filter(t => !t.completed);
    const completedTasks = allTasks.filter(t => t.completed);
    
    return (
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-200">
              <CheckSquare className="h-5 w-5 mr-2 text-blue-400" />
              Neue Aufgabe hinzufügen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Was möchten Sie erreichen?"
                className="glass-input flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <Button 
                onClick={addTask}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newTask.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">
            Meine Aufgaben ({allTasks.length})
          </h3>
          
          {/* Task-Statistiken */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{openTasks.length}</div>
                <div className="text-sm text-slate-400">Offen</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{completedTasks.length}</div>
                <div className="text-sm text-slate-400">Erledigt</div>
              </CardContent>
            </Card>
          </div>

          {allTasks.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Noch keine Aufgaben vorhanden.</p>
                <p className="text-slate-500 text-sm mt-2">Fügen Sie Ihre erste Aufgabe oben hinzu.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {allTasks.map(task => (
                <Card key={task.id} className={`glass-card ${task.isSupabaseTask ? 'ring-1 ring-blue-500/30' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                        disabled={task.isSupabaseTask}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`${task.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                            {task.title}
                          </span>
                          {task.isSupabaseTask && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                              Vom Coach
                            </Badge>
                          )}
                          {task.completed && (
                            <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                              Erledigt
                            </Badge>
                          )}
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          {task.dueDate && (
                            <span>Fällig: {new Date(task.dueDate).toLocaleDateString('de-DE')}</span>
                          )}
                          {task.priority && (
                            <Badge 
                              className={
                                task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }
                            >
                              {task.priority === 'high' ? 'Hoch' : 
                               task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                            </Badge>
                          )}
                        </div>
                        
                        {task.isSupabaseTask && (
                          <p className="text-xs text-slate-500 mt-2">
                            Diese Aufgabe wurde von Ihrem Coach erstellt und kann nur dort bearbeitet werden.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render aktive Sektion
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'tasks':
        return renderTasksSection();

      case 'journal':
        return (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Journal-Feature in Entwicklung</p>
          </div>
        );

      case 'documents':
        return (
          <div className="text-center py-8">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Dokumente-Feature in Entwicklung</p>
          </div>
        );

      case 'progress':
        return (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Fortschritt-Feature in Entwicklung</p>
          </div>
        );

      case 'settings':
        return (
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Einstellungen-Feature in Entwicklung</p>
          </div>
        );

      default:
        const allTasksForDashboard = getAllTasks();
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <CheckSquare className="h-5 w-5 mr-2 text-blue-400" />
                  Meine Aufgaben
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-2">{allTasksForDashboard.filter(t => !t.completed).length} offene Aufgaben</p>
                <p className="text-slate-400">{allTasksForDashboard.filter(t => t.completed).length} erledigte Aufgaben</p>
                <Button 
                  className="mt-4 w-full" 
                  variant="outline"
                  onClick={() => setActiveSection('tasks')}
                >
                  Aufgaben verwalten
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                  Privates Journal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Schreiben Sie Ihre Gedanken auf...</p>
                <Button 
                  className="mt-4 w-full" 
                  variant="outline"
                  onClick={() => setActiveSection('journal')}
                >
                  Journal öffnen
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                  Fortschritt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Verfolgen Sie Ihre Entwicklung...</p>
                <Button 
                  className="mt-4 w-full" 
                  variant="outline"
                  onClick={() => setActiveSection('progress')}
                >
                  Fortschritt ansehen
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  // Authenticated Portal Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ShieldCheck className="h-8 w-8 text-green-400" />
              <div>
                <h1 className="text-xl font-bold text-slate-200">
                  Willkommen in Ihrem Portal, {coachee.firstName}!
                </h1>
                <p className="text-slate-400 text-sm">Ihr privater Raum für Wachstum und Reflexion</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Shield className="h-3 w-3 mr-1" />
              Sicher verbunden
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Navigation */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveSection(item.id)}
                    className={activeSection === item.id ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default CoacheePortal;