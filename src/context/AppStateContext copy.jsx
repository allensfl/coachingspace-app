import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { dummyCoachees } from '@/data/coachees';
import { appSettings as defaultSettings } from '@/data/settings';
import { dummyTools } from '@/data/tools';
import { dummySessions } from '@/data/sessions';
import { dummyInvoices, dummyRecurringInvoices, dummyActivePackages, dummyPackageTemplates } from '@/data/invoices';
import { dummyJournalEntries } from '@/data/journal';
import { DefaultDocumentCategories, DefaultJournalCategories } from '@/types';
import { promptLibrary as defaultPrompts } from '@/data/prompts';

const AppStateContext = createContext(null);

const useLocalStorage = (key, initialValue, initializer) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsedItem = item ? JSON.parse(item) : initialValue;
      return initializer ? initializer(parsedItem) : parsedItem;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}" on init:`, error);
      return initializer ? initializer(initialValue) : initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

const defaultRemoteTools = [
  { name: 'Zoom starten', url: 'https://zoom.us/start/meeting' },
  { name: 'Google Meet starten', url: 'https://meet.google.com/new' },
  { name: 'Microsoft Teams starten', url: 'https://teams.microsoft.com/l/meeting/new' }
];

const defaultServiceRates = [
    { id: 1, name: 'Standard Coaching-Session', description: '60 Minuten 1:1 Coaching', price: 120.00 },
    { id: 2, name: 'Extended Coaching-Session', description: '90 Minuten 1:1 Coaching', price: 180.00 },
    { id: 3, name: 'Team-Workshop (halber Tag)', description: '4 Stunden Workshop für Teams bis 8 Personen', price: 800.00 },
];

const defaultToolCategories = ['Zielklärung', 'Ressourcen', 'Entscheidungshilfen', 'Reflexion', 'Checklisten', 'Sonstige'];

const useAppState = () => {
  const { toast } = useToast();
  const [isCommandOpen, setCommandOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [coachees, setCoachees] = useLocalStorage('coachees', dummyCoachees);
  const [sessions, setSessions] = useLocalStorage('sessions', dummySessions);
  const [invoices, setInvoices] = useLocalStorage('invoices', dummyInvoices);
  const [journalEntries, setJournalEntries] = useLocalStorage('journalEntries', dummyJournalEntries);
  const [generalDocuments, setGeneralDocuments] = useLocalStorage('generalDocuments', []);
  const [documents, setDocuments] = useLocalStorage('coaching_documents', []); // Neue zentrale Documents
  const [tools, setTools] = useLocalStorage('tools', dummyTools);
  const [activePackages, setActivePackages] = useLocalStorage('activePackages', []);
  const [serviceRates, setServiceRates] = useLocalStorage('serviceRates', defaultServiceRates);
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [sessionNotes, setSessionNotes] = useLocalStorage('sessionNotes', []);
  const [recurringInvoices, setRecurringInvoices] = useLocalStorage('recurringInvoices', dummyRecurringInvoices);
  const [packageTemplates, setPackageTemplates] = useLocalStorage('packageTemplates', dummyPackageTemplates);

  const [settings, setSettings] = useLocalStorage('appSettings', defaultSettings, (savedSettings) => {
    const parsedSettings = savedSettings || {};
    const customPrompts = parsedSettings.ai?.prompts || [];
    const allPrompts = [...defaultPrompts, ...customPrompts];
    const uniquePrompts = allPrompts.filter((prompt, index, self) =>
      index === self.findIndex((p) => p.title === prompt.title && p.prompt === prompt.prompt)
    );
    return {
      ...defaultSettings,
      ...parsedSettings,
      company: { ...defaultSettings.company, ...(parsedSettings.company || {}) },
      theme: { ...defaultSettings.theme, ...(parsedSettings.theme || {}) },
      remoteTools: parsedSettings.remoteTools && parsedSettings.remoteTools.length > 0 ? parsedSettings.remoteTools : defaultRemoteTools,
      ai: { ...defaultSettings.ai, ...(parsedSettings.ai || {}), prompts: uniquePrompts },
      documentCategories: parsedSettings.documentCategories || DefaultDocumentCategories,
      journalCategories: parsedSettings.journalCategories || DefaultJournalCategories,
      toolCategories: parsedSettings.toolCategories || defaultToolCategories,
      coacheeFields: parsedSettings.coacheeFields || defaultSettings.coacheeFields,
    };
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const root = document.documentElement;
      if (settings.theme?.primaryColor?.hsl) {
        root.style.setProperty('--primary-hsl', settings.theme.primaryColor.hsl);
        root.style.setProperty('--primary', `hsl(${settings.theme.primaryColor.hsl})`);
      }
      root.classList.toggle('dark', settings.darkMode);

      const hasVisitedBefore = localStorage.getItem('hasVisitedCoachingspace');
      if (!hasVisitedBefore) {
        toast({
          title: "Willkommen zu Coachingspace!",
          description: "Drücke ⌘+K um die globale Suche zu öffnen. Lass uns gemeinsam Großes erreichen!",
          duration: 7000,
        });
        localStorage.setItem('hasVisitedCoachingspace', 'true');
      }
    }
  }, [isLoading, settings, toast]);

  const addCoachee = useCallback((newCoacheeData) => {
    setCoachees(prevCoachees => {
      const newCoachee = {
        ...newCoacheeData,
        id: (prevCoachees || []).length > 0 ? Math.max(...prevCoachees.map(c => c.id)) + 1 : 1,
        portalAccess: {
          initialToken: window.crypto.randomUUID(),
          permanentToken: null,
          passwordHash: null,
        },
        sessions: [],
        documents: [],
        invoices: [],
        goals: [],
        consents: { gdpr: false, audioRecording: false },
        auditLog: [{ timestamp: new Date().toISOString(), user: 'Coach', action: 'Coachee erstellt' }],
        coachId: 1,
        customData: newCoacheeData.customData || {},
      };
      return [...(prevCoachees || []), newCoachee];
    });
  }, [setCoachees]);

  const updateCoachee = useCallback((updatedCoachee) => {
    setCoachees(prev => (prev || []).map(c => c.id === updatedCoachee.id ? updatedCoachee : c));
  }, [setCoachees]);
  
  const deductFromPackage = useCallback((packageId) => {
    setActivePackages(prevPackages => {
        const updatedPackages = (prevPackages || []).map(p => {
            if (p.id === packageId && p.usedUnits < p.totalUnits) {
                const updatedPackage = { ...p, usedUnits: p.usedUnits + 1 };
                toast({
                    title: "Paket-Einheit verbraucht",
                    description: `Eine Einheit von "${updatedPackage.packageName}" wurde verbucht. Verbleibend: ${updatedPackage.totalUnits - updatedPackage.usedUnits}`,
                    className: "bg-blue-600 text-white"
                });
                return updatedPackage;
            }
            return p;
        });
        return updatedPackages;
    });
}, [setActivePackages, toast]);

  const getCoacheeById = useCallback((id) => {
    if (!coachees) return null;
    const coachee = coachees.find(c => c.id === parseInt(id));
    if (!coachee) return null;
    const coacheeSessions = (sessions || []).filter(s => s.coacheeId === coachee.id);
    const coacheeInvoices = (invoices || []).filter(i => i.coacheeId === coachee.id);
    const coacheeJournal = (journalEntries || []).filter(j => j.coacheeId === coachee.id);
    const completedGoals = (coachee.goals || []).flatMap(g => g.subGoals?.filter(sg => sg.completed) || []);
    
    return { 
      ...coachee, 
      sessions: coacheeSessions, 
      invoices: coacheeInvoices,
      journalEntries: coacheeJournal,
      completedGoals 
    };
  }, [coachees, sessions, invoices, journalEntries]);

  const getCoacheeByToken = useCallback((token) => {
    if (!token || !coachees) return null;
    return coachees.find(c => 
      c.portalAccess?.initialToken === token || 
      c.portalAccess?.permanentToken === token ||
      c.portalAccess?.oneTimeToken === token
    );
  }, [coachees]);

  const ensurePermanentTokenForDemo = useCallback((coachee) => {
    if (coachee && !coachee.portalAccess.permanentToken) {
      const newPermanentToken = window.crypto.randomUUID();
      const updatedCoachee = {
        ...coachee,
        portalAccess: { ...coachee.portalAccess, initialToken: null, permanentToken: newPermanentToken },
      };
      updateCoachee(updatedCoachee);
      return newPermanentToken;
    }
    return coachee?.portalAccess.permanentToken;
  }, [updateCoachee]);

  const getToolById = useCallback((id) => (tools || []).find(t => t.id === parseInt(id)), [tools]);
  
  const addToolUsage = useCallback((toolId, coacheeId) => {
      const coachee = coachees.find(c => c.id === coacheeId);
      if (!coachee) return;
      
      setTools(prevTools => prevTools.map(tool => {
        if (tool.id === toolId) {
          const newUsage = {
            coacheeId: coachee.id,
            coacheeName: `${coachee.firstName} ${coachee.lastName}`,
            date: new Date().toISOString().split('T')[0]
          };
          return {
            ...tool,
            usageHistory: [...tool.usageHistory, newUsage]
          };
        }
        return tool;
      }));
    }, [setTools, coachees]);

  const updateCoacheeConsent = useCallback((coacheeId, consentKey, value, pdfBlob) => {
    setCoachees(prevCoachees => prevCoachees.map(coachee => {
      if (coachee.id === parseInt(coacheeId)) {
        let updatedCoachee = {
          ...coachee,
          consents: { ...coachee.consents, [consentKey]: value },
          auditLog: [...(coachee.auditLog || []), { 
            timestamp: new Date().toISOString(), 
            user: 'Coachee', 
            action: `Einwilligung '${consentKey}' ${value ? 'erteilt' : 'entzogen'}` 
          }],
        };

        if (consentKey === 'gdpr' && value && pdfBlob) {
          const consentDocument = {
            id: Date.now() + Math.random(),
            name: `DSGVO-Einwilligung_${coachee.lastName}_${new Date().toLocaleDateString('de-DE').replace(/\./g, '-')}.pdf`,
            type: 'contract',
            uploadDate: new Date().toISOString(),
            size: `${(pdfBlob.size / 1024).toFixed(2)} KB`,
            format: 'PDF',
            coacheeId: coachee.id,
            coacheeName: `${coachee.firstName} ${coachee.lastName}`,
            isConsentDocument: true,
            consentType: 'gdpr',
            status: 'signed',
            category: 'Legal'
          };
          
          // Speichere sowohl in coachee.documents (alte Struktur) als auch in zentralen documents
          updatedCoachee.documents = [...(updatedCoachee.documents || []), consentDocument];
          
          // Füge auch zu zentralen documents hinzu
          setDocuments(prevDocs => [...(prevDocs || []), consentDocument]);
          
          updatedCoachee.auditLog.push({ 
            timestamp: new Date().toISOString(), 
            user: 'System', 
            action: 'DSGVO-Einwilligungs-Dokument automatisch archiviert' 
          });
        }
        
        return updatedCoachee;
      }
      return coachee;
    }));
  }, [setCoachees, setDocuments]);

  const getAllCoacheeDocuments = useCallback(() => {
    // Kombiniere alle Dokumente: zentrale documents + coachee.documents + generalDocuments
    const coacheeDocuments = (coachees || []).flatMap(c => c.documents || []);
    const centralDocuments = documents || [];
    const general = generalDocuments || [];
    
    // Entferne Duplikate basierend auf ID
    const allDocs = [...centralDocuments, ...coacheeDocuments, ...general];
    const uniqueDocs = allDocs.filter((doc, index, self) => 
      index === self.findIndex(d => d.id === doc.id)
    );
    
    return uniqueDocs;
  }, [coachees, documents, generalDocuments]);

  // Neue Documents-Funktionen für zentrale Verwaltung
  const addDocumentToContext = useCallback((documentData) => {
    const newDocument = { 
      ...documentData, 
      id: Date.now() + Math.random(),
      uploadDate: new Date().toISOString() 
    };
    setDocuments(prev => [...(prev || []), newDocument]);
    return newDocument;
  }, [setDocuments]);

  const updateDocumentInContext = useCallback((documentId, updates) => {
    setDocuments(prev => (prev || []).map(doc => 
      doc.id === documentId ? { ...doc, ...updates } : doc
    ));
  }, [setDocuments]);

  const removeDocumentFromContext = useCallback((documentId) => {
    setDocuments(prev => (prev || []).filter(doc => doc.id !== documentId));
  }, [setDocuments]);

  const getCoacheeDocuments = useCallback((coacheeId) => {
    if (!coacheeId) return getAllCoacheeDocuments();
    const id = parseInt(coacheeId);
    return getAllCoacheeDocuments().filter(doc => doc.coacheeId === id);
  }, [getAllCoacheeDocuments]);

  const addDocument = useCallback((coacheeId, documentData) => {
    const newDocument = { ...documentData, id: Date.now(), uploadDate: new Date().toISOString() };
    if (coacheeId && coacheeId !== 'general') {
      setCoachees(prev => (prev || []).map(c =>
        c.id === parseInt(coacheeId)
          ? { ...c, documents: [...(c.documents || []), { ...newDocument, coacheeId: parseInt(coacheeId) }] }
          : c
      ));
    } else {
      setGeneralDocuments(prev => [...(prev || []), newDocument]);
    }
  }, [setCoachees, setGeneralDocuments]);
  
  const updateSettings = useCallback((newSettings) => {
     setSettings(prev => ({...prev, ...newSettings}));
  }, [setSettings]);

  const updateJournalCategories = useCallback((newCategories) => {
    setSettings(prev => ({
      ...prev,
      journalCategories: newCategories
    }));
  }, [setSettings]);
  
  const updateToolCategories = useCallback((newCategories) => {
    setSettings(prev => ({
      ...prev,
      toolCategories: newCategories
    }));
  }, [setSettings]);

  const activatePackage = useCallback((packageId) => {
    setActivePackages(prev => {
      if (prev.includes(packageId)) {
        return prev;
      }
      toast({
        title: "Paket aktiviert!",
        description: "Das neue Paket steht dir jetzt zur Verfügung.",
        className: 'bg-green-600 text-white'
      });
      return [...prev, packageId];
    });
  }, [setActivePackages, toast]);

  const addTask = useCallback((newTask) => {
    setTasks(prevTasks => [...(prevTasks || []), newTask]);
    toast({
      title: "Aufgabe erstellt",
      description: `"${newTask.titel}" wurde zu deinen Aufgaben hinzugefügt.`,
    });
  }, [setTasks, toast]);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prevTasks => 
      (prevTasks || []).map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks(prevTasks => (prevTasks || []).filter(task => task.id !== taskId));
    toast({
      title: "Aufgabe gelöscht",
      description: taskToDelete ? `"${taskToDelete.titel}" wurde entfernt.` : "Die Aufgabe wurde erfolgreich entfernt.",
    });
  }, [setTasks, tasks, toast]);

  const backupData = useCallback(() => {
    const dataToBackup = { coachees, sessions, invoices, journalEntries, generalDocuments, documents, settings, tools, activePackages, serviceRates, tasks, sessionNotes, recurringInvoices, packageTemplates };
    const dataStr = JSON.stringify(dataToBackup, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coachingspace_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Backup erfolgreich", description: "Deine Daten wurden als JSON-Datei heruntergeladen." });
  }, [coachees, sessions, invoices, journalEntries, generalDocuments, documents, settings, tools, activePackages, serviceRates, tasks, sessionNotes, recurringInvoices, packageTemplates, toast]);

  const contextValue = useMemo(() => ({
    isLoading,
    isCommandOpen,
    coachees, sessions, invoices, journalEntries, generalDocuments, documents, tools, activePackages, settings, serviceRates, tasks, sessionNotes, recurringInvoices, packageTemplates,
    setCommandOpen,
    setCoachees, setSessions, setInvoices, setJournalEntries, setGeneralDocuments, setDocuments, setTools, setActivePackages, setServiceRates, setTasks, setSessionNotes, setRecurringInvoices, setPackageTemplates,
    
    addCoachee, updateCoachee, getCoacheeById, getCoacheeByToken, ensurePermanentTokenForDemo,
    getToolById, updateCoacheeConsent, getAllCoacheeDocuments, getCoacheeDocuments, addDocument, addDocumentToContext, updateDocumentInContext, removeDocumentFromContext, updateSettings, backupData, deductFromPackage, updateJournalCategories, addToolUsage, updateToolCategories,
    activatePackage, addTask, updateTask, deleteTask,

    state: {
      isLoading,
      isCommandOpen,
      coachees, sessions, invoices, journalEntries, generalDocuments, documents, tools, activePackages, settings, serviceRates, tasks, sessionNotes, recurringInvoices, packageTemplates
    },
    actions: {
      setCommandOpen,
      setCoachees, setSessions, setInvoices, setJournalEntries, setGeneralDocuments, setDocuments, setTools, setActivePackages, setServiceRates, setTasks, setSessionNotes, setRecurringInvoices, setPackageTemplates,
      addCoachee, updateCoachee, getCoacheeById, getCoacheeByToken, ensurePermanentTokenForDemo,
      getToolById, updateCoacheeConsent, getAllCoacheeDocuments, getCoacheeDocuments, addDocument, addDocumentToContext, updateDocumentInContext, removeDocumentFromContext, updateSettings, setSettings, backupData, deductFromPackage, updateJournalCategories, addToolUsage, updateToolCategories,
      activatePackage, addTask, updateTask, deleteTask
    },
  }), [
    isLoading, isCommandOpen, coachees, sessions, invoices, journalEntries, generalDocuments, documents, tools, activePackages, settings, serviceRates, tasks, sessionNotes, recurringInvoices, packageTemplates,
    setCoachees, setSessions, setInvoices, setJournalEntries, setGeneralDocuments, setDocuments, setTools, setActivePackages, setServiceRates, setTasks, setSessionNotes, setRecurringInvoices, setPackageTemplates,
    addCoachee, updateCoachee, getCoacheeById, getCoacheeByToken, ensurePermanentTokenForDemo,
    getToolById, updateCoacheeConsent, getAllCoacheeDocuments, getCoacheeDocuments, addDocument, addDocumentToContext, updateDocumentInContext, removeDocumentFromContext, updateSettings, backupData, deductFromPackage, updateJournalCategories, addToolUsage, updateToolCategories,
    activatePackage, addTask, updateTask, deleteTask
  ]);

  return contextValue;
};

export const AppStateProvider = ({ children }) => {
  const appState = useAppState();
  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within an AppStateProvider');
  }
  return context;
};