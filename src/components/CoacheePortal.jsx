import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/supabaseConfig';
import { 
  Shield, ShieldCheck, Eye, EyeOff, AlertTriangle, 
  MessageCircle, CheckSquare, BookOpen, Upload, Download,
  TrendingUp, Settings, Plus, Send, Save, 
  Calendar, Clock, Share2, Lock, Trash2, Edit, FileText  // <- FileText hinzufügen
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
  
  // Task-Dialog State - ERWEITERT
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // NEU: Für Edit-Mode
  const [activeDialogTab, setActiveDialogTab] = useState('details');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: [],
    status: 'open',
    estimatedTime: '',
    notes: '',
    subtasks: [],
    attachments: [],
    attachedTools: [], // NEU
    recurring: {
      enabled: false,
      frequency: 'weekly',
      interval: 1
    },
    reminder: {
      enabled: false,
      daysBefore: 1
    },
    linkedGoalId: null
  });
  const [newSubtask, setNewSubtask] = useState('');
  const [availableTags] = useState([
    'Beruflich', 'Persönlich', 'Gesundheit', 'Lernen', 
    'Finanzen', 'Familie', 'Hobbies', 'Dringend'
  ]);
  
  // Shared Content State
  const [sharedContent, setSharedContent] = useState([]);

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

  // NEU: Expanded Tasks State - welche Tasks sind aufgeklappt
  const [expandedTasks, setExpandedTasks] = useState(new Set());
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
      description: task.description,
      completed: task.completed || false,
      createdAt: task.created_at,
      dueDate: task.due_date,
      priority: task.priority,
      status: task.status,
      tags: task.tags || [],
      estimatedTime: task.estimated_time,
      notes: task.notes,
      subtasks: task.subtasks || [],
      attachments: task.attachments || [],
      attachedTools: task.attached_tools || [],
      recurring: task.recurring || { enabled: false, frequency: 'weekly', interval: 1 },
      reminder: task.reminder || { enabled: false, daysBefore: 1 },
      linkedGoalId: task.linked_goal_id
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
    setSharedContent(portalData.sharedContent || []);
    setDocuments(portalData.documents || []);
    setProgressData(portalData.progressData || {
      goals: [],
      achievements: [],
      reflections: []
    });
    
    const realCoacheeId = coacheeData.id;
    
    console.log('Loading tasks for coachee ID:', realCoacheeId, 'Type:', typeof realCoacheeId);
    
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const myLocalTasks = allTasks.filter(t => {
      return t.assignedTo == realCoacheeId;
    });
    
    console.log('Portal: Filtered tasks', {
      allTasks: allTasks.length,
      myLocalTasks: myLocalTasks.length,
      coacheeId: realCoacheeId
    });
    
    const combinedTasks = [
      ...(portalData.tasks || []),
      ...myLocalTasks
    ];
    
    setTasks(combinedTasks);
  };

  const savePortalData = () => {
    const storedCoachees = JSON.parse(localStorage.getItem('coachees') || '[]');
    const coacheeIndex = storedCoachees.findIndex(c => c.id === coachee.id);
    
    if (coacheeIndex !== -1) {
      storedCoachees[coacheeIndex].portalData = {
        journalEntries,
        tasks,
        sharedContent,
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

  // NEU: Task aufklappen/zuklappen
  const toggleExpandTask = (taskId) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // NEU: Task zum Bearbeiten öffnen
  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || '',
      tags: task.tags || [],
      status: task.status || 'open',
      estimatedTime: task.estimatedTime || '',
      notes: task.notes || '',
      subtasks: task.subtasks || [],
      attachments: task.attachments || [],
      attachedTools: task.attachedTools || [],
      recurring: task.recurring || { enabled: false, frequency: 'weekly', interval: 1 },
      reminder: task.reminder || { enabled: false, daysBefore: 1 },
      linkedGoalId: task.linkedGoalId || null
    });
    setShowTaskDialog(true);
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
      newSharedContent = [...sharedContent, {
        id: `journal_${entryId}`,
        type: 'journal',
        title: entry.title,
        content: entry.content,
        sharedAt: new Date().toISOString(),
        viewedByCoach: false
      }];
    } else {
      newSharedContent = sharedContent.filter(item => item.id !== `journal_${entryId}`);
    }
    
    setJournalEntries(updatedEntries);
    setSharedContent(newSharedContent);
    
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

  // NEU: Task togglen mit Supabase-Update
  const toggleTask = async (taskId, isSupabaseTask) => {
    if (isSupabaseTask) {
      // Supabase Task togglen
      const task = supabaseTasks.find(t => t.id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating Supabase task:', error);
        alert('Fehler beim Aktualisieren der Aufgabe');
        return;
      }

      // Lokalen State aktualisieren
      setSupabaseTasks(prev => 
        prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      );
    } else {
      // localStorage Task togglen
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
      
      // Auch in globalem localStorage aktualisieren
      const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedAllTasks = allTasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      localStorage.setItem('tasks', JSON.stringify(updatedAllTasks));
      
      setTimeout(savePortalData, 100);
    }
  };

  // File-Upload für Tasks
  const handleTaskFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`Datei ${file.name} ist zu groß (max. 10MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          content: e.target.result,
          uploadedAt: new Date().toISOString()
        };
        
        setTaskForm(prev => ({
          ...prev,
          attachments: [...prev.attachments, newAttachment]
        }));
      };
      
      reader.readAsDataURL(file);
    });
    
    event.target.value = '';
  };

  const removeTaskAttachment = (attachmentId) => {
    setTaskForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachmentId)
    }));
  };

  // Subtask Management
  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const subtask = {
      id: Date.now(),
      text: newSubtask,
      completed: false
    };
    
    setTaskForm(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, subtask]
    }));
    setNewSubtask('');
  };

  const toggleSubtask = (subtaskId) => {
    setTaskForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    }));
  };

  const removeSubtask = (subtaskId) => {
    setTaskForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
    }));
  };

  // Tags Management
  const toggleTag = (tag) => {
    setTaskForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // Dialog Reset
  const resetTaskDialog = () => {
    setShowTaskDialog(false);
    setEditingTask(null); // NEU
    setActiveDialogTab('details');
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      tags: [],
      status: 'open',
      estimatedTime: '',
      notes: '',
      subtasks: [],
      attachments: [],
      attachedTools: [],
      recurring: {
        enabled: false,
        frequency: 'weekly',
        interval: 1
      },
      reminder: {
        enabled: false,
        daysBefore: 1
      },
      linkedGoalId: null
    });
    setNewSubtask('');
  };

  // NEU: Task speichern (Create oder Update)
  const saveTask = async () => {
    if (!taskForm.title.trim()) {
      alert('Bitte geben Sie einen Titel ein.');
      return;
    }

    if (editingTask) {
      // EDIT MODE - Task aktualisieren
      if (editingTask.isSupabaseTask) {
        // Supabase Task updaten
        const { error } = await supabase
          .from('tasks')
          .update({
            title: taskForm.title,
            description: taskForm.description,
            due_date: taskForm.dueDate,
            priority: taskForm.priority,
            status: taskForm.status,
            tags: taskForm.tags,
            estimated_time: taskForm.estimatedTime,
            notes: taskForm.notes,
            subtasks: taskForm.subtasks,
            attachments: taskForm.attachments,
            attached_tools: taskForm.attachedTools,
            recurring: taskForm.recurring,
            reminder: taskForm.reminder,
            linked_goal_id: taskForm.linkedGoalId
          })
          .eq('id', editingTask.id);

        if (error) {
          console.error('Error updating Supabase task:', error);
          alert('Fehler beim Aktualisieren der Aufgabe');
          return;
        }

        // Lokalen State aktualisieren
        setSupabaseTasks(prev =>
          prev.map(t => t.id === editingTask.id ? {
            ...t,
            title: taskForm.title,
            description: taskForm.description,
            due_date: taskForm.dueDate,
            priority: taskForm.priority,
            status: taskForm.status,
            tags: taskForm.tags,
            estimated_time: taskForm.estimatedTime,
            notes: taskForm.notes,
            subtasks: taskForm.subtasks,
            attachments: taskForm.attachments,
            attached_tools: taskForm.attachedTools,
            recurring: taskForm.recurring,
            reminder: taskForm.reminder,
            linked_goal_id: taskForm.linkedGoalId
          } : t)
        );

        alert('✅ Aufgabe erfolgreich aktualisiert');
      } else {
        // localStorage Task updaten
        const updatedTasks = tasks.map(t =>
          t.id === editingTask.id ? {
            ...t,
            ...taskForm,
            dueDate: taskForm.dueDate
          } : t
        );
        setTasks(updatedTasks);

        // Auch in globalem localStorage aktualisieren
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const updatedAllTasks = allTasks.map(t =>
          t.id === editingTask.id ? {
            ...t,
            ...taskForm,
            dueDate: taskForm.dueDate
          } : t
        );
        localStorage.setItem('tasks', JSON.stringify(updatedAllTasks));

        setTimeout(savePortalData, 100);
        alert('✅ Aufgabe erfolgreich aktualisiert');
      }
    } else {
      // CREATE MODE - Neue Task erstellen
      const newTask = {
        id: Date.now(),
        ...taskForm,
        completed: false,
        createdAt: new Date().toISOString(),
        assignedTo: coachee.id,
        isSupabaseTask: false
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);

      // Task in localStorage speichern
      const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      allTasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(allTasks));

      setTimeout(savePortalData, 100);
      alert('✅ Aufgabe erfolgreich erstellt');
    }

    resetTaskDialog();
  };

  // Task löschen
  const deletePortalTask = async (taskId, isSupabaseTask) => {
    if (!confirm('Aufgabe wirklich löschen?')) {
      return;
    }

    if (isSupabaseTask) {
      // Supabase Task löschen
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Error deleting Supabase task:', error);
        alert('Fehler beim Löschen der Aufgabe');
        return;
      }

      // Aus lokalem State entfernen
      setSupabaseTasks(prev => prev.filter(t => t.id !== taskId));
      alert('✅ Aufgabe gelöscht');
    } else {
      // localStorage Task löschen
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);

      // Aus localStorage entfernen
      const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const filteredTasks = allTasks.filter(t => t.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(filteredTasks));

      setTimeout(savePortalData, 100);
      alert('✅ Aufgabe gelöscht');
    }
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
      newSharedContent = [...sharedContent, {
        id: `doc_${docId}`,
        type: 'document',
        title: doc.name,
        content: `Dokument: ${doc.name}`,
        sharedAt: new Date().toISOString(),
        viewedByCoach: false
      }];
    } else {
      newSharedContent = sharedContent.filter(item => item.id !== `doc_${docId}`);
    }
    
    setDocuments(updatedDocs);
    setSharedContent(newSharedContent);
    
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

// Task-Dialog Render
  const renderTaskDialog = () => {
    if (!showTaskDialog) return null;

    const tabs = [
      { id: 'details', label: 'Details', icon: '📝' },
      { id: 'extended', label: 'Erweitert', icon: '⚙️' },
      { id: 'files', label: 'Dateien', icon: '📎' },
      { id: 'subtasks', label: 'Subtasks', icon: '✓' },
      { id: 'tools', label: 'Tools', icon: '🛠️' }
    ];

    const selectStyle = {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      borderColor: 'rgb(71, 85, 105)',
      color: 'rgb(226, 232, 240)',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      width: '100%',
      border: '1px solid rgb(71, 85, 105)'
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <Card className="glass-card w-full max-w-3xl my-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-200">
                {editingTask ? 'Aufgabe bearbeiten' : 'Neue Aufgabe erstellen'}
              </CardTitle>
              <button
                onClick={resetTaskDialog}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-2 mt-4 border-b border-slate-600">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDialogTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeDialogTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
            {/* TAB 1: Details */}
            {activeDialogTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Titel *
                  </label>
                  <Input
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="Aufgabentitel eingeben..."
                    className="glass-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Beschreibung
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    placeholder="Weitere Details zur Aufgabe..."
                    className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Priorität
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      style={selectStyle}
                    >
                      <option value="low">Niedrig</option>
                      <option value="medium">Mittel</option>
                      <option value="high">Hoch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Fälligkeitsdatum
                    </label>
                    <Input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="glass-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Status
                    </label>
                    <select
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                      style={selectStyle}
                    >
                      <option value="open">Offen</option>
                      <option value="in_progress">In Arbeit</option>
                      <option value="blocked">Blockiert</option>
                      <option value="done">Erledigt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Geschätzter Aufwand
                    </label>
                    <select
                      value={taskForm.estimatedTime}
                      onChange={(e) => setTaskForm({ ...taskForm, estimatedTime: e.target.value })}
                      style={selectStyle}
                    >
                      <option value="">Keine Angabe</option>
                      <option value="15min">15 Minuten</option>
                      <option value="30min">30 Minuten</option>
                      <option value="1h">1 Stunde</option>
                      <option value="2h">2 Stunden</option>
                      <option value="4h">4 Stunden</option>
                      <option value="1d">1 Tag</option>
                      <option value="2d">2-3 Tage</option>
                      <option value="1w">1 Woche</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Erweitert */}
            {activeDialogTab === 'extended' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Tags / Kategorien
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`cursor-pointer transition-colors ${
                          taskForm.tags.includes(tag)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'text-slate-400 border-slate-600 hover:border-blue-400'
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Notizen
                  </label>
                  <textarea
                    value={taskForm.notes}
                    onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                    placeholder="Private Notizen zu dieser Aufgabe..."
                    className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Mit Ziel verknüpfen
                  </label>
                  <select
                    value={taskForm.linkedGoalId || ''}
                    onChange={(e) => setTaskForm({ ...taskForm, linkedGoalId: e.target.value || null })}
                    style={selectStyle}
                  >
                    <option value="">Kein Ziel</option>
                    {progressData.goals.map(goal => (
                      <option key={goal.id} value={goal.id}>
                        {goal.text}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <label className="flex items-center space-x-2 text-slate-200 mb-3">
                    <input
                      type="checkbox"
                      checked={taskForm.recurring.enabled}
                      onChange={(e) => setTaskForm({
                        ...taskForm,
                        recurring: { ...taskForm.recurring, enabled: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Wiederkehrende Aufgabe</span>
                  </label>
                  
                  {taskForm.recurring.enabled && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Frequenz</label>
                        <select
                          value={taskForm.recurring.frequency}
                          onChange={(e) => setTaskForm({
                            ...taskForm,
                            recurring: { ...taskForm.recurring, frequency: e.target.value }
                          })}
                          style={selectStyle}
                        >
                          <option value="daily">Täglich</option>
                          <option value="weekly">Wöchentlich</option>
                          <option value="monthly">Monatlich</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Alle X Tage/Wochen</label>
                        <Input
                          type="number"
                          min="1"
                          value={taskForm.recurring.interval}
                          onChange={(e) => setTaskForm({
                            ...taskForm,
                            recurring: { ...taskForm.recurring, interval: parseInt(e.target.value) || 1 }
                          })}
                          className="glass-input text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <label className="flex items-center space-x-2 text-slate-200 mb-3">
                    <input
                      type="checkbox"
                      checked={taskForm.reminder.enabled}
                      onChange={(e) => setTaskForm({
                        ...taskForm,
                        reminder: { ...taskForm.reminder, enabled: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Erinnerung aktivieren</span>
                  </label>
                  
                  {taskForm.reminder.enabled && (
                    <div className="ml-6">
                      <label className="block text-xs text-slate-400 mb-1">Tage vor Fälligkeit</label>
                      <Input
                        type="number"
                        min="0"
                        value={taskForm.reminder.daysBefore}
                        onChange={(e) => setTaskForm({
                          ...taskForm,
                          reminder: { ...taskForm.reminder, daysBefore: parseInt(e.target.value) || 0 }
                        })}
                        className="glass-input text-sm w-32"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Dateien */}
            {activeDialogTab === 'files' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">
                    Dateien zu dieser Aufgabe hinzufügen
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleTaskFileUpload}
                    className="hidden"
                    id="task-file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg,.xlsx,.xls"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('task-file-upload').click()}
                  >
                    Dateien auswählen
                  </Button>
                  <p className="text-slate-500 text-xs mt-2">
                    PDF, DOC, Bilder, Excel (max. 10MB pro Datei)
                  </p>
                </div>

                {taskForm.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-200">
                      Angehängte Dateien ({taskForm.attachments.length})
                    </h4>
                    {taskForm.attachments.map(attachment => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded bg-blue-600/20 flex items-center justify-center">
                            <Upload className="h-4 w-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-slate-200 text-sm font-medium">{attachment.name}</p>
                            <p className="text-slate-400 text-xs">
                              {(attachment.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTaskAttachment(attachment.id)}
                          className="text-red-400 border-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Subtasks */}
            {activeDialogTab === 'subtasks' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Checkliste / Teilaufgaben
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="Neue Teilaufgabe hinzufügen..."
                      className="glass-input flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                    />
                    <Button 
                      onClick={addSubtask}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!newSubtask.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {taskForm.subtasks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-200">
                      Teilaufgaben ({taskForm.subtasks.filter(st => st.completed).length}/{taskForm.subtasks.length})
                    </h4>
                    {taskForm.subtasks.map(subtask => (
                      <div
                        key={subtask.id}
                        className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleSubtask(subtask.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className={`flex-1 text-sm ${
                          subtask.completed 
                            ? 'text-slate-400 line-through' 
                            : 'text-slate-200'
                        }`}>
                          {subtask.text}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeSubtask(subtask.id)}
                          className="text-red-400 border-red-400 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {taskForm.subtasks.length === 0 && (
                  <div className="text-center py-8">
                    <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="text-slate-400 text-sm">
                      Keine Teilaufgaben hinzugefügt
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Tools */}
            {activeDialogTab === 'tools' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Vom Coach angehängte Tools
                  </label>
                  <p className="text-xs text-slate-400 mb-4">
                    Ihr Coach hat diese Ressourcen für diese Aufgabe bereitgestellt.
                  </p>
                </div>

                {(!taskForm.attachedTools || taskForm.attachedTools.length === 0) ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="text-slate-400 text-sm">
                      Keine Tools angehängt
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      Ihr Coach kann Tools zu dieser Aufgabe hinzufügen
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-200">
                      Angehängte Tools ({taskForm.attachedTools.length})
                    </h4>
                    <div className="text-center py-6 bg-slate-800/20 rounded-lg border border-slate-700">
                      <FileText className="h-10 w-10 text-blue-400 mx-auto mb-2" />
                      <p className="text-slate-300 text-sm">
                        {taskForm.attachedTools.length} Tool(s) vom Coach bereitgestellt
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Tools werden in der Vollversion hier angezeigt
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <div className="border-t border-slate-600 p-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-400">
                {taskForm.attachments.length > 0 && (
                  <span className="mr-4">📎 {taskForm.attachments.length} Dateien</span>
                )}
                {taskForm.subtasks.length > 0 && (
                  <span className="mr-4">✓ {taskForm.subtasks.length} Subtasks</span>
                )}
                {taskForm.tags.length > 0 && (
                  <span className="mr-4">🏷️ {taskForm.tags.length} Tags</span>
                )}
                {taskForm.attachedTools && taskForm.attachedTools.length > 0 && (
                  <span>🛠️ {taskForm.attachedTools.length} Tools</span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={resetTaskDialog}
                  variant="outline"
                >
                  Abbrechen
                </Button>
                <Button
                  onClick={saveTask}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!taskForm.title.trim()}
                >
                  {editingTask ? 'Speichern' : 'Erstellen'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
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
            {renderTaskDialog()}
            
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-slate-200">
                    <CheckSquare className="h-5 w-5 mr-2 text-blue-400" />
                    Meine Aufgaben
                  </CardTitle>
                  <Button
                    onClick={() => {
                      setEditingTask(null);
                      setShowTaskDialog(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Neue Aufgabe
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {openTasks.length} offen
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {completedTasks.length} erledigt
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {allTasks.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-400 mb-4">Keine Aufgaben vorhanden</p>
                  <Button
                    onClick={() => {
                      setEditingTask(null);
                      setShowTaskDialog(true);
                    }}
                    variant="outline"
                  >
                    Erste Aufgabe erstellen
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {openTasks.length > 0 && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-slate-200">Offene Aufgaben</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {openTasks.map(task => {
                        const isExpanded = expandedTasks.has(task.id);
                        
                        return (
                          <Card 
                            key={`${task.isSupabaseTask ? 'supabase' : 'local'}_${task.id}`} 
                            className="glass-card border-slate-700"
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Kompakte Header-Zeile */}
                                <div className="flex items-start space-x-3">
                                  <input
                                    type="checkbox"
                                    checked={false}
                                    onChange={() => toggleTask(task.id, task.isSupabaseTask)}
                                    className="w-4 h-4 mt-1 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <button
                                        onClick={() => toggleExpandTask(task.id)}
                                        className="flex-1 text-left"
                                      >
                                        <span className="font-medium text-slate-200 text-lg hover:text-blue-400 transition-colors">
                                          {task.title}
                                        </span>
                                      </button>
                                      <div className="flex items-center space-x-1 flex-shrink-0">
                                        {/* Priority Badge */}
                                        {task.priority && (
                                          <Badge 
                                            variant="outline" 
                                            className={`text-xs ${
                                              task.priority === 'high' ? 'text-red-400 border-red-400' :
                                              task.priority === 'medium' ? 'text-yellow-400 border-yellow-400' :
                                              'text-green-400 border-green-400'
                                            }`}
                                          >
                                            {task.priority === 'high' ? 'Hoch' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                                          </Badge>
                                        )}
                                        
                                        {/* Coach Badge */}
                                        {task.isSupabaseTask && (
                                          <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                                            Coach
                                          </Badge>
                                        )}
                                        
                                        {/* Edit Button */}
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => openEditTask(task)}
                                          className="text-blue-400 border-blue-400 h-7 w-7 p-0"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        
                                        {/* Delete Button */}
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => deletePortalTask(task.id, task.isSupabaseTask)}
                                          className="text-red-400 border-red-400 h-7 w-7 p-0"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    {/* Meta Info - immer sichtbar */}
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-slate-400 text-xs">
                                      {task.dueDate && (
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="h-3 w-3" />
                                          <span>
                                            {new Date(task.dueDate).toLocaleDateString('de-DE', {
                                              day: '2-digit',
                                              month: '2-digit',
                                              year: 'numeric'
                                            })}
                                          </span>
                                        </div>
                                      )}
                                      
                                      {task.estimatedTime && (
                                        <div className="flex items-center space-x-1">
                                          <Clock className="h-3 w-3" />
                                          <span>{task.estimatedTime}</span>
                                        </div>
                                      )}
                                      
                                      {task.status && task.status !== 'open' && (
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${
                                            task.status === 'in_progress' ? 'text-blue-400 border-blue-400' :
                                            task.status === 'blocked' ? 'text-orange-400 border-orange-400' :
                                            'text-green-400 border-green-400'
                                          }`}
                                        >
                                          {task.status === 'in_progress' ? 'In Arbeit' : 
                                           task.status === 'blocked' ? 'Blockiert' : 'Erledigt'}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Expandierte Details */}
                                {isExpanded && (
                                  <div className="pl-7 space-y-3 border-l-2 border-slate-700 ml-2">
                                    {/* Description */}
                                    {task.description && (
                                      <div>
                                        <h4 className="text-xs font-semibold text-slate-400 mb-1">Beschreibung:</h4>
                                        <p className="text-slate-300 text-sm">{task.description}</p>
                                      </div>
                                    )}
                                    
                                    {/* Tags */}
                                    {task.tags && task.tags.length > 0 && (
                                      <div>
                                        <h4 className="text-xs font-semibold text-slate-400 mb-1">Tags:</h4>
                                        <div className="flex flex-wrap gap-1">
                                          {task.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs text-slate-400 border-slate-600">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Subtasks */}
                                    {task.subtasks && task.subtasks.length > 0 && (
                                      <div>
                                        <h4 className="text-xs font-semibold text-slate-400 mb-2">
                                          Teilaufgaben ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}):
                                        </h4>
                                        <div className="space-y-1">
                                          {task.subtasks.map(subtask => (
                                            <div key={subtask.id} className="flex items-center space-x-2 text-xs">
                                              <CheckSquare className={`h-3 w-3 ${subtask.completed ? 'text-green-400' : 'text-slate-500'}`} />
                                              <span className={subtask.completed ? 'text-slate-500 line-through' : 'text-slate-300'}>
                                                {subtask.text}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Attachments */}
                                    {task.attachments && task.attachments.length > 0 && (
                                      <div>
                                        <h4 className="text-xs font-semibold text-slate-400 mb-2">Dateien:</h4>
                                        <div className="flex flex-wrap gap-2">
                                          {task.attachments.map(attachment => (
                                            <button
                                              key={attachment.id}
                                              onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = attachment.content;
                                                link.download = attachment.name;
                                                link.click();
                                              }}
                                              className="flex items-center space-x-2 px-2 py-1 bg-slate-800/50 border border-slate-600 rounded text-xs text-slate-300 hover:border-blue-400 transition-colors"
                                            >
                                              <Upload className="h-3 w-3" />
                                              <span>{attachment.name}</span>
                                              <Download className="h-3 w-3" />
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Notes */}
                                    {task.notes && (
                                      <div>
                                        <h4 className="text-xs font-semibold text-slate-400 mb-1">Notizen:</h4>
                                        <p className="text-slate-300 text-sm italic">{task.notes}</p>
                                      </div>
                                    )}
                                    
                                    {/* Additional Meta */}
                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700">
                                      {task.recurring && task.recurring.enabled && (
                                        <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs">
                                          🔁 Wiederkehrend ({task.recurring.frequency})
                                        </Badge>
                                      )}
                                      
                                      {task.reminder && task.reminder.enabled && (
                                        <Badge variant="outline" className="text-amber-400 border-amber-400 text-xs">
                                          🔔 Erinnerung ({task.reminder.daysBefore} Tage vorher)
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}

                {completedTasks.length > 0 && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-slate-200">Erledigte Aufgaben</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {completedTasks.map(task => (
                        <Card 
                          key={`${task.isSupabaseTask ? 'supabase' : 'local'}_${task.id}`} 
                          className="glass-card border-green-700/30 bg-green-900/10"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <input
                                type="checkbox"
                                checked={true}
                                onChange={() => toggleTask(task.id, task.isSupabaseTask)}
                                className="w-4 h-4 mt-1 text-green-600 rounded focus:ring-green-500"
                              />
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <span className="font-medium text-slate-400 line-through">
                                    {task.title}
                                  </span>
                                  <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                                    <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                                      Erledigt
                                    </Badge>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => deletePortalTask(task.id, task.isSupabaseTask)}
                                      className="text-red-400 border-red-400 h-6 w-6 p-0"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {task.description && (
                                  <p className="text-slate-500 text-sm line-through">{task.description}</p>
                                )}
                                
                                {task.dueDate && (
                                  <div className="flex items-center space-x-1 text-slate-500 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      War fällig: {new Date(task.dueDate).toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
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
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      Datei auswählen
                    </Button>
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
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = doc.content;
                                link.download = doc.name;
                                link.click();
                              }}
                              className="text-blue-400 border-blue-400"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (confirm('Dokument wirklich löschen?')) {
                                  const updatedDocs = documents.filter(d => d.id !== doc.id);
                                  const newSharedContent = sharedContent.filter(item => item.id !== `doc_${doc.id}`);
                                  
                                  setDocuments(updatedDocs);
                                  setSharedContent(newSharedContent);
                                  
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
                                }
                              }}
                              className="text-red-400 border-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => alert("⚙️ Passwort-Änderung\n\nDiese Funktion wird in der Vollversion verfügbar sein.\nIn der Beta-Phase wird Ihr Passwort vom Coach verwaltet.")}
                    >
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

        {renderActiveSection()}
      </div>
    </div>
  );
};

export default CoacheePortal;
