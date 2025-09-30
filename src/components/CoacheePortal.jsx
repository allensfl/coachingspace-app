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
  
  // Tasks State
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

  // Supabase Tasks laden
  const loadSupabaseTasks = async (coacheeId) => {
    try {
      console.log('Loading Supabase tasks for coachee ID:', coacheeId);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        console.log('No authenticated user found');
        return [];
      }

      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('coachee_id', coacheeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading Supabase tasks:', error);
        return [];
      }

      console.log(`Found ${tasks?.length || 0} Supabase tasks for this coachee:`, tasks);
      return tasks || [];
    } catch (error) {
      console.error('Failed to load Supabase tasks:', error);
      return [];
    }
  };

  // Alle Tasks kombiniert abrufen
  const getAllTasks = () => {
    const localTasks = tasks.map(task => ({ ...task, isSupabaseTask: false }));
    const remoteTasks = supabaseTasks.map(task => ({ 
      ...task, 
      isSupabaseTask: true,
      id: task.id,
      title: task.title,
      completed: task.completed || false,
      createdAt: task.created_at
    }));
    
    console.log('Local tasks:', localTasks.length);
    console.log('Supabase tasks:', remoteTasks.length);
    
    return [...localTasks, ...remoteTasks];
  };

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

  // Nach erfolgreicher Authentifizierung Supabase-Tasks laden
  useEffect(() => {
    if (isAuthenticated && coachee) {
      console.log('Authenticated - loading Supabase tasks for coachee:', coachee.id);
      loadSupabaseTasks(coachee.id).then(tasks => {
        setSupabaseTasks(tasks);
      });
    }
  }, [isAuthenticated, coachee]);

  const loadPortalData = (coacheeData) => {
    const portalData = coacheeData.portalData || {};
    setJournalEntries(portalData.journalEntries || []);
    setTasks(portalData.tasks || []);
    setSharedContent(portalData.sharedContent || []);
    setWeeklyImpulses(portalData.weeklyImpulses || []);
    setDocuments(portalData.documents || []);
    setProgressData(portalData.progressData || {
      goals: [],
      achievements: [],
      reflections: []
    });
  };

  const savePortalData = () => {
    const storedCoachees = JSON.parse(localStorage.getItem('coachees') || '[]');
    const coacheeIndex = storedCoachees.findIndex(c => c.id === coachee.id);
    
    if (coacheeIndex !== -1) {
      storedCoachees[coacheeIndex].portalData = {
        journalEntries,
        tasks,
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

  const handleLogin = () => {
    const hashedPassword = btoa(loginPassword);
    
    if (hashedPassword === coachee.portalAccess.passwordHash) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Falsches Passwort. Bitte versuchen Sie es erneut.');
    }
  };

  // Journal Funktionen
  const addJournalEntry = () => {
    if (!newJournalEntry.trim() || !journalTitle.trim()) return;
    
    const entry = {
      id: Date.now(),
      title: journalTitle,
      content: newJournalEntry,
      date: new Date().toISOString(),
      isShared: false
    };
    
    const updatedEntries = [entry, ...journalEntries];
    setJournalEntries(updatedEntries);
    setNewJournalEntry('');
    setJournalTitle('');
    
    // Auto-save
    setTimeout(savePortalData, 100);
  };

  const shareJournalEntry = (entryId) => {
  const entry = journalEntries.find(e => e.id === entryId);
  if (!entry) return;
  
  const updatedEntries = journalEntries.map(e => {
    if (e.id === entryId) {
      return { ...e, isShared: !e.isShared };
    }
    return e;
  });
  
  let newSharedContent;
  if (!entry.isShared) {
    // Entry wird geteilt
    newSharedContent = [...sharedContent, {
      id: `journal_${entryId}`,
      type: 'journal',
      title: entry.title,
      content: entry.content,
      sharedAt: new Date().toISOString(),
      viewedByCoach: false
    }];
  } else {
    // Entry wird nicht mehr geteilt
    newSharedContent = sharedContent.filter(item => item.id !== `journal_${entryId}`);
  }
  
  setJournalEntries(updatedEntries);
  setSharedContent(newSharedContent);
  
  // WICHTIG: Direkt mit den neuen Werten speichern
  const storedCoachees = JSON.parse(localStorage.getItem('coachees') || '[]');
  const coacheeIndex = storedCoachees.findIndex(c => c.id === coachee.id);
  
  if (coacheeIndex !== -1) {
    storedCoachees[coacheeIndex].portalData = {
      ...storedCoachees[coacheeIndex].portalData,
      journalEntries: updatedEntries,
      sharedContent: newSharedContent,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('coachees', JSON.stringify(storedCoachees));
  }
};

  // Task Funktionen
  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      title: newTask,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    setNewTask('');
    
    setTimeout(savePortalData, 100);
  };

  const toggleTask = (taskId, isSupabaseTask) => {
    if (isSupabaseTask) {
      // Supabase-Task - nur Warnung anzeigen
      alert('Dashboard-Tasks können nur im Dashboard bearbeitet werden.');
      return;
    }

    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    setTimeout(savePortalData, 100);
  };

  // Dokument Funktionen
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newDocument = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        content: e.target.result,
        uploadedAt: new Date().toISOString(),
        isShared: false
      };
      
      const updatedDocs = [...documents, newDocument];
      setDocuments(updatedDocs);
      setTimeout(savePortalData, 100);
      
      setSelectedFile(null);
      event.target.value = '';
    };
    
    if (file.type.startsWith('text/')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

 const shareDocument = (docId) => {
  const doc = documents.find(d => d.id === docId);
  if (!doc) return;
  
  const updatedDocs = documents.map(d => {
    if (d.id === docId) {
      return { ...d, isShared: !d.isShared };
    }
    return d;
  });
  
  let newSharedContent;
  if (!doc.isShared) {
    // Dokument wird geteilt
    newSharedContent = [...sharedContent, {
      id: `doc_${docId}`,
      type: 'document',
      title: doc.name,
      content: `Dokument: ${doc.name}`,
      sharedAt: new Date().toISOString(),
      viewedByCoach: false
    }];
  } else {
    // Dokument wird nicht mehr geteilt
    newSharedContent = sharedContent.filter(item => item.id !== `doc_${docId}`);
  }
  
  setDocuments(updatedDocs);
  setSharedContent(newSharedContent);
  
  // WICHTIG: Direkt mit den neuen Werten speichern
  const storedCoachees = JSON.parse(localStorage.getItem('coachees') || '[]');
  const coacheeIndex = storedCoachees.findIndex(c => c.id === coachee.id);
  
  if (coacheeIndex !== -1) {
    storedCoachees[coacheeIndex].portalData = {
      ...storedCoachees[coacheeIndex].portalData,
      documents: updatedDocs,
      sharedContent: newSharedContent,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('coachees', JSON.stringify(storedCoachees));
  }
};

  // Fortschritt Funktionen
  const addGoal = (goalText) => {
    const newGoal = {
      id: Date.now(),
      text: goalText,
      createdAt: new Date().toISOString(),
      achieved: false
    };
    
    const updatedProgress = {
      ...progressData,
      goals: [...progressData.goals, newGoal]
    };
    setProgressData(updatedProgress);
    setTimeout(savePortalData, 100);
  };

  const toggleGoal = (goalId) => {
    const updatedGoals = progressData.goals.map(goal => {
      if (goal.id === goalId) {
        const toggledGoal = { ...goal, achieved: !goal.achieved };
        if (toggledGoal.achieved && !goal.achieved) {
          // Ziel erreicht - als Achievement hinzufügen
          const newAchievement = {
            id: Date.now(),
            title: goal.text,
            achievedAt: new Date().toISOString()
          };
          setProgressData(prev => ({
            ...prev,
            achievements: [...prev.achievements, newAchievement]
          }));
        }
        return toggledGoal;
      }
      return goal;
    });
    
    setProgressData(prev => ({ ...prev, goals: updatedGoals }));
    setTimeout(savePortalData, 100);
  };

  const addReflection = (reflectionText) => {
    const newReflection = {
      id: Date.now(),
      text: reflectionText,
      createdAt: new Date().toISOString()
    };
    
    const updatedProgress = {
      ...progressData,
      reflections: [...progressData.reflections, newReflection]
    };
    setProgressData(updatedProgress);
    setTimeout(savePortalData, 100);
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
    { id: 'impulses', label: 'Wochenimpulse', icon: MessageCircle },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'tasks', label: 'Aufgaben', icon: CheckSquare },
    { id: 'documents', label: 'Dokumente', icon: Upload },
    { id: 'progress', label: 'Fortschritt', icon: TrendingUp },
    { id: 'shared', label: 'Geteilt', icon: Share2 },
    { id: 'settings', label: 'Einstellungen', icon: Settings }
  ];

  // Render aktive Sektion
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'impulses':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-400" />
                  Wochenimpulse vom Coach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Hier erhalten Sie wöchentliche Impulse und Inspirationen von Ihrem Coach für Ihre persönliche Entwicklung.
                </p>
                
                {weeklyImpulses.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">Noch keine Wochenimpulse erhalten.</p>
                    <p className="text-slate-500 text-sm mt-2">Ihr Coach wird Ihnen regelmäßig inspirierende Inhalte senden.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {weeklyImpulses.map(impulse => (
                      <Card key={impulse.id} className="glass-card border border-blue-400/20">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-slate-200">{impulse.title}</CardTitle>
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              KW {impulse.week}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm">
                            {new Date(impulse.date).toLocaleDateString('de-DE')}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-invert max-w-none">
                            <p className="text-slate-300 whitespace-pre-wrap">{impulse.content}</p>
                          </div>
                          {impulse.reflection && (
                            <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                              <h5 className="text-sm font-medium text-slate-200 mb-2">Reflexionsfrage:</h5>
                              <p className="text-slate-400 text-sm italic">{impulse.reflection}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const demoImpulse = {
                        id: Date.now(),
                        title: "Selbstreflexion: Ihre Stärken erkennen",
                        content: "Diese Woche möchte ich Sie einladen, einen bewussten Blick auf Ihre Stärken zu werfen. Oft konzentrieren wir uns auf das, was wir verbessern möchten, und übersehen dabei unsere bereits vorhandenen Fähigkeiten.\n\nNehmen Sie sich täglich 10 Minuten Zeit, um zu reflektieren: Was ist Ihnen heute gut gelungen? Welche Ihrer Stärken haben Sie eingesetzt? Schreiben Sie diese Erkenntnisse in Ihr Journal.",
                        reflection: "Welche drei Stärken haben Sie diese Woche am häufigsten eingesetzt und wie können Sie diese noch bewusster nutzen?",
                        week: new Date().getWeek(),
                        date: new Date().toISOString()
                      };
                      setWeeklyImpulses([demoImpulse, ...weeklyImpulses]);
                      setTimeout(savePortalData, 100);
                    }}
                    className="text-xs"
                  >
                    Demo-Impuls hinzufügen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <Upload className="h-5 w-5 mr-2 text-blue-400" />
                  Dokumente hochladen und teilen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">
                      Laden Sie Dokumente hoch, die Sie mit Ihrem Coach teilen möchten.
                    </p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Datei auswählen
                      </Button>
                    </label>
                    <p className="text-slate-500 text-xs mt-2">
                      Unterstützt: PDF, DOC, DOCX, TXT, JPG, PNG (max. 10MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Meine Dokumente</h3>
              {documents.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="p-8 text-center">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">Noch keine Dokumente hochgeladen.</p>
                    <p className="text-slate-500 text-sm mt-2">Laden Sie Ihre erste Datei hoch, um sie mit Ihrem Coach zu teilen.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {documents.map(doc => (
                    <Card key={doc.id} className="glass-card">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                              <Upload className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-slate-200 font-medium">{doc.name}</h4>
                              <p className="text-slate-400 text-sm">
                                {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.uploadedAt).toLocaleDateString('de-DE')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.isShared && (
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                <Share2 className="h-3 w-3 mr-1" />
                                Geteilt
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => shareDocument(doc.id)}
                              className={doc.isShared ? 'border-green-400 text-green-400' : ''}
                            >
                              {doc.isShared ? <Lock className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                            </Button>
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

      case 'progress':        
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                  Meine Ziele
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Neues Ziel hinzufügen..."
                    className="glass-input flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newGoal.trim()) {
                        addGoal(newGoal);
                        setNewGoal('');
                      }
                    }}
                  />
                  <Button 
                    onClick={() => {
                      if (newGoal.trim()) {
                        addGoal(newGoal);
                        setNewGoal('');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!newGoal.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {progressData.goals.map(goal => (
                    <div key={goal.id} className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg">
                      <input
                        type="checkbox"
                        checked={goal.achieved}
                        onChange={() => toggleGoal(goal.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`flex-1 ${goal.achieved ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                        {goal.text}
                      </span>
                      {goal.achieved && (
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          Erreicht
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-slate-200">Meine Erfolge</CardTitle>
              </CardHeader>
              <CardContent>
                {progressData.achievements.length === 0 ? (
                  <div className="text-center py-6">
                    <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Noch keine Erfolge verzeichnet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {progressData.achievements.map(achievement => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                          <CheckSquare className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-slate-200 font-medium">{achievement.title}</h4>
                          <p className="text-slate-400 text-sm">
                            Erreicht am {new Date(achievement.achievedAt).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-slate-200">Fortschritts-Reflexionen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={newReflection}
                  onChange={(e) => setNewReflection(e.target.value)}
                  placeholder="Reflektieren Sie über Ihren Fortschritt..."
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <Button
                  onClick={() => {
                    if (newReflection.trim()) {
                      addReflection(newReflection);
                      setNewReflection('');
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!newReflection.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Reflexion speichern
                </Button>
                
                <div className="space-y-3">
                  {progressData.reflections.map(reflection => (
                    <div key={reflection.id} className="p-4 bg-slate-800/30 rounded-lg">
                      <p className="text-slate-300 mb-2">{reflection.text}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(reflection.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'journal':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                  Neuer Journal-Eintrag
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  placeholder="Titel für Ihren Eintrag..."
                  className="glass-input"
                />
                <textarea
                  value={newJournalEntry}
                  onChange={(e) => setNewJournalEntry(e.target.value)}
                  placeholder="Schreiben Sie hier Ihre Gedanken und Reflexionen..."
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                />
                <Button 
                  onClick={addJournalEntry}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!newJournalEntry.trim() || !journalTitle.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Eintrag speichern
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Meine Journal-Einträge</h3>
              {journalEntries.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">Noch keine Journal-Einträge vorhanden.</p>
                    <p className="text-slate-500 text-sm mt-2">Beginnen Sie mit Ihrem ersten Eintrag oben.</p>
                  </CardContent>
                </Card>
              ) : (
                journalEntries.map(entry => (
                  <Card key={entry.id} className="glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-slate-200">{entry.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {entry.isShared && (
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              <Share2 className="h-3 w-3 mr-1" />
                              Geteilt
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareJournalEntry(entry.id)}
                            className={entry.isShared ? 'border-green-400 text-green-400' : ''}
                          >
                            {entry.isShared ? <Lock className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm">
                        {new Date(entry.date).toLocaleDateString('de-DE', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 whitespace-pre-wrap">{entry.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        );

      case 'tasks':
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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-200">Meine Aufgaben</h3>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {openTasks.length} offen
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {completedTasks.length} erledigt
                  </Badge>
                </div>
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
                    <Card 
                      key={`${task.isSupabaseTask ? 'supabase' : 'local'}_${task.id}`} 
                      className={`glass-card ${task.isSupabaseTask ? 'ring-1 ring-blue-500/30' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id, task.isSupabaseTask)}
                            disabled={task.isSupabaseTask}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                          />
                          <span className={`flex-1 ${task.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                            {task.title}
                          </span>
                          <div className="flex items-center space-x-2">
                            {task.isSupabaseTask && (
                              <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                                Vom Coach
                              </Badge>
                            )}
                            {task.completed && (
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                Erledigt
                              </Badge>
                            )}
                          </div>
                        </div>
                        {task.isSupabaseTask && (
                          <p className="text-slate-500 text-xs mt-2">
                            Diese Aufgabe wurde von Ihrem Coach erstellt und kann nur im Dashboard bearbeitet werden.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'shared':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <Share2 className="h-5 w-5 mr-2 text-blue-400" />
                  Mit Coach geteilte Inhalte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">
                  Hier sehen Sie alle Inhalte, die Sie mit Ihrem Coach geteilt haben.
                  Ihr Coach kann nur diese geteilten Inhalte einsehen, alles andere bleibt privat.
                </p>
              </CardContent>
            </Card>

            {sharedContent.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Share2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Noch keine Inhalte geteilt.</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Teilen Sie Journal-Einträge oder andere Inhalte mit Ihrem Coach.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sharedContent.map(item => (
                  <Card key={item.id} className="glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-slate-200">{item.title}</CardTitle>
                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                          {item.type === 'journal' ? 'Journal' : 'Dokument'}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm">
                        Geteilt am: {new Date(item.sharedAt).toLocaleDateString('de-DE')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300">{item.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-200">
                <Settings className="h-5 w-5 mr-2 text-blue-400" />
                Portal-Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-200 mb-3">Sicherheit</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <span className="text-slate-300">Passwort ändern</span>
                    <Button variant="outline" size="sm">
                      Ändern
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <span className="text-slate-300">Portal-Zugang sperren</span>
                    <Button variant="outline" size="sm">
                      Sperren
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-200 mb-3">Datenschutz</h4>
                <div className="p-4 bg-slate-800/20 rounded-lg">
                  <p className="text-slate-400 text-sm">
                    Alle Ihre Daten werden nur lokal gespeichert und sind vollständig verschlüsselt.
                    Ihr Coach kann nur die Inhalte sehen, die Sie explizit mit ihm teilen.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        const dashboardAllTasks = getAllTasks();
        const dashboardOpenTasks = dashboardAllTasks.filter(t => !t.completed);
        const dashboardCompletedTasks = dashboardAllTasks.filter(t => t.completed);
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-400" />
                  Wochenimpuls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Neue Impulse von Ihrem Coach warten auf Sie...</p>
                <Button 
                  className="mt-4 w-full" 
                  variant="outline"
                  onClick={() => setActiveSection('impulses')}
                >
                  Impulse ansehen
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <CheckSquare className="h-5 w-5 mr-2 text-blue-400" />
                  Meine Aufgaben
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-2">{dashboardOpenTasks.length} offene Aufgaben</p>
                <p className="text-slate-400">{dashboardCompletedTasks.length} erledigte Aufgaben</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-slate-400 border-slate-400 text-xs">
                    {tasks.length} eigene
                  </Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                    {supabaseTasks.length} vom Coach
                  </Badge>
                </div>
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
                <p className="text-slate-400 mb-2">{journalEntries.length} Einträge</p>
                <p className="text-slate-400">{journalEntries.filter(e => e.isShared).length} mit Coach geteilt</p>
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
                  <Upload className="h-5 w-5 mr-2 text-blue-400" />
                  Dokumente hochladen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Teilen Sie Inhalte mit Ihrem Coach...</p>
                <Button 
                  className="mt-4 w-full" 
                  variant="outline"
                  onClick={() => setActiveSection('documents')}
                >
                  Dokument hochladen
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

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <Share2 className="h-5 w-5 mr-2 text-blue-400" />
                  Geteilte Inhalte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-2">{sharedContent.length} Inhalte geteilt</p>
                <Button 
                  className="mt-4 w-full" 
                  variant="outline"
                  onClick={() => setActiveSection('shared')}
                >
                  Geteilte Inhalte
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