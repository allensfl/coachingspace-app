import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Calendar, Filter, X, Check, Clock, BarChart3, FileText, Settings, Plus, Brain, TrendingUp, AlertTriangle, Eye, Target, Save, Copy, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAppStateContext } from '@/context/AppStateContext';
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
} from '@/components/ui/alert-dialog';

const ReflexionstagebuchApp = () => {
  // Context für echte Coachees + Feature Flags + Action-Handler
  const { coachees, hasFeature, showPremiumFeature, removeJournalEntry, updateJournalEntry } = useAppStateContext();
  
  // Navigation und Location für URL-Parameter
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Filter States
  const [coacheeFilter, setCoacheeFilter] = useState(null);
  const [coacheeName, setCoacheeName] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Basis States
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReflection, setEditingReflection] = useState(null);
  const [showKiModal, setShowKiModal] = useState(false);
  const [kiType, setKiType] = useState('');
  const [kiLoading, setKiLoading] = useState(false);
  const [kiResult, setKiResult] = useState(null);
  
  // Delete State
  const [deletingId, setDeletingId] = useState(null);
  
  // Neue Reflexion
  const [newReflection, setNewReflection] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    coacheeId: null,
    coacheeName: ''
  });

  // URL-Parameter-Auswertung für Coachee-Filter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const coacheeId = urlParams.get('coachee');
    const name = urlParams.get('name');
    
    if (coacheeId && name) {
      setCoacheeFilter(coacheeId);
      setCoacheeName(decodeURIComponent(name.replace(/\+/g, ' ')));
      
      toast({
        title: "Filter aktiv",
        description: `Zeige nur Journal-Einträge von ${decodeURIComponent(name.replace(/\+/g, ' '))}`,
        className: "bg-green-600 text-white"
      });
    }
  }, [location.search, toast]);

  // Coachee-Filter zurücksetzen
  const clearCoacheeFilter = () => {
    setCoacheeFilter(null);
    setCoacheeName('');
    navigate(location.pathname, { replace: true });
    
    toast({
      title: "Filter entfernt",
      description: "Zeige alle Journal-Einträge",
      className: "bg-blue-600 text-white"
    });
  };

  // Demo Daten - erweitert mit coacheeId
  const [reflections, setReflections] = useState([
    {
      id: 1,
      title: 'Schwierige Session mit Führungskraft',
      content: 'Heute hatte ich eine Session mit einem sehr dominanten CEO. Ich habe gemerkt, dass ich mich eingeschüchtert gefühlt habe und nicht meine üblichen systemischen Fragen gestellt habe.',
      date: '2025-01-21',
      mood: 'challenging',
      tags: ['Führung', 'Machtdynamik', 'Grenzen'],
      coacheeId: '16',
      coacheeName: 'Anna Schmidt',
      category: 'business'
    },
    {
      id: 2,
      title: 'Durchbruch bei systemischen Fragen',
      content: 'Eine fantastische Session heute! Durch die Frage "Was würde Ihr Team sagen..." ist bei meiner Coachee ein echter Aha-Moment entstanden.',
      date: '2025-01-20',
      mood: 'positive',
      tags: ['Systemik', 'Erfolg', 'Kommunikation'],
      coacheeId: '16',
      coacheeName: 'Anna Schmidt',
      category: 'business'
    },
    {
      id: 3,
      title: 'Reflexion zur Work-Life-Balance',
      content: 'Session mit Marco über Work-Life-Balance. Interessante Erkenntnisse über seine Prioritäten.',
      date: '2025-01-19',
      mood: 'neutral',
      tags: ['Work-Life-Balance', 'Prioritäten'],
      coacheeId: '17',
      coacheeName: 'Marco Müller',
      category: 'life'
    }
  ]);

  // ← NEUE Action-Handler für Edit/Delete
  const handleEditReflection = (reflection) => {
    setEditingReflection(reflection);
    setShowEditModal(true);
  };

  const handleDeleteReflection = async (reflectionId) => {
    setDeletingId(reflectionId);
    try {
      // Verwende removeJournalEntry aus AppStateContext
      await removeJournalEntry(reflectionId);
      
      // Entferne aus lokalem State
      setReflections(prev => prev.filter(r => r.id !== reflectionId));
      
      // removeJournalEntry macht bereits die Toast-Benachrichtigung
    } catch (error) {
      console.error('Fehler beim Löschen des Journal-Eintrags:', error);
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen",
        description: "Der Journal-Eintrag konnte nicht gelöscht werden."
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateReflection = async () => {
    if (!editingReflection.title || !editingReflection.content) return;
    
    try {
      // Verwende updateJournalEntry aus AppStateContext
      await updateJournalEntry(editingReflection.id, {
        title: editingReflection.title,
        content: editingReflection.content,
        mood: editingReflection.mood
      });
      
      // Update lokaler State
      setReflections(prev => 
        prev.map(r => 
          r.id === editingReflection.id 
            ? { ...r, ...editingReflection }
            : r
        )
      );
      
      setShowEditModal(false);
      setEditingReflection(null);
      
      // updateJournalEntry macht bereits die Toast-Benachrichtigung
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Journal-Eintrags:', error);
      toast({
        variant: "destructive",
        title: "Fehler beim Aktualisieren",
        description: "Der Journal-Eintrag konnte nicht gespeichert werden."
      });
    }
  };

  // Filter Funktionen (unchanged)
  const handleCoacheeFilter = (coacheeId, coacheeName) => {
    if (coacheeFilter === coacheeId) {
      clearCoacheeFilter();
    } else {
      setCoacheeFilter(coacheeId);
      setCoacheeName(coacheeName);
      
      toast({
        title: "Filter gesetzt",
        description: `Zeige nur Einträge von ${coacheeName}`,
        className: "bg-blue-600 text-white"
      });
    }
  };

  const handleDateFilter = (filter) => {
    setDateFilter(filter === dateFilter ? 'all' : filter);
  };

  const handleStatusFilter = (filter) => {
    setStatusFilter(filter === statusFilter ? 'all' : filter);
  };

  const handleCategoryFilter = (filter) => {
    setCategoryFilter(filter === categoryFilter ? 'all' : filter);
  };

  // Gefilterte Reflexionen (unchanged)
  const filteredReflections = reflections.filter(reflection => {
    // Coachee-Filter
    if (coacheeFilter && reflection.coacheeId !== coacheeFilter) {
      return false;
    }
    
    // Datum-Filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const reflectionDate = new Date(reflection.date);
      
      if (dateFilter === 'today') {
        if (today.toDateString() !== reflectionDate.toDateString()) return false;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (reflectionDate < weekAgo) return false;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (reflectionDate < monthAgo) return false;
      }
    }
    
    // Kategorie-Filter
    if (categoryFilter !== 'all' && reflection.category !== categoryFilter) {
      return false;
    }
    
    // Such-Filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        reflection.title.toLowerCase().includes(searchLower) ||
        reflection.content.toLowerCase().includes(searchLower) ||
        reflection.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        (reflection.coacheeName && reflection.coacheeName.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Handler für Coachee-Auswahl in neuer Reflexion
  const handleCoacheeSelection = (selectedCoacheeId) => {
    if (selectedCoacheeId === '') {
      setNewReflection(prev => ({ 
        ...prev, 
        coacheeId: null,
        coacheeName: ''
      }));
    } else {
      const selectedCoachee = coachees.find(c => c.id.toString() === selectedCoacheeId);
      if (selectedCoachee) {
        setNewReflection(prev => ({ 
          ...prev, 
          coacheeId: selectedCoacheeId,
          coacheeName: `${selectedCoachee.firstName} ${selectedCoachee.lastName}`
        }));
      }
    }
  };

  // KI Analyse mit Feature-Flag (unchanged)
  const startKiAnalysis = async (type) => {
    if (!hasFeature('aiModule')) {
      showPremiumFeature('KI-Journal-Analyse');
      return;
    }

    setKiType(type);
    setKiLoading(true);
    setShowKiModal(true);
    
    // Simulation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = {
      patterns: {
        blindSpots: ['Einschüchterung bei dominanten Persönlichkeiten', 'Rollenvermischung unter Stress'],
        strengths: ['Systemische Kompetenz', 'Hohe Selbstreflexion'],
        recommendations: ['Supervision zu Machtdynamiken', 'Training für schwierige Situationen'],
        score: 75
      },
      trends: {
        topThemes: ['Führung (2x)', 'Systemik (1x)'],
        moodTrend: 'Ausgewogener Mix',
        patterns: ['Herausforderung bei dominanten Coachees'],
        recommendation: 'Fokus auf Selbstbehauptung'
      }
    };
    
    setKiResult(result[type] || result.patterns);
    setKiLoading(false);
  };

  // Neue Reflexion speichern
  const saveNewReflection = () => {
    if (newReflection.title && newReflection.content) {
      const reflection = {
        id: Date.now(),
        title: newReflection.title,
        content: newReflection.content,
        date: new Date().toISOString().split('T')[0],
        mood: newReflection.mood,
        tags: [],
        coacheeId: newReflection.coacheeId,
        coacheeName: newReflection.coacheeName,
        category: 'business'
      };
      
      setReflections([reflection, ...reflections]);
      setNewReflection({ title: '', content: '', mood: 'neutral', coacheeId: null, coacheeName: '' });
      setShowNewModal(false);
    }
  };

  // Button-Filter Komponente (unchanged)
  const FilterButton = ({ active, onClick, children, icon: Icon, count }) => (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2 rounded-lg text-sm font-medium transition-all
        flex items-center gap-2
        ${active 
          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
          : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
        }
      `}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
      {count !== undefined && (
        <span className={`
          px-1.5 py-0.5 rounded text-xs
          ${active ? 'bg-white/20' : 'bg-slate-600/50'}
        `}>
          {count}
        </span>
      )}
      {active && (
        <X className="h-3 w-3 ml-1 opacity-70 hover:opacity-100" />
      )}
    </button>
  );

  // KI-Analyse Button Komponente (unchanged)
  const KIAnalysisButton = ({ type, icon: Icon, title, description, onClick }) => {
    const isDisabled = !hasFeature('aiModule');
    
    return (
      <button 
        onClick={onClick}
        disabled={isDisabled}
        className={`
          flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-200 group
          ${isDisabled 
            ? 'bg-slate-700/20 border border-slate-600/20 cursor-not-allowed opacity-60' 
            : 'bg-slate-700/40 hover:bg-slate-600/50 border border-slate-600/40 hover:border-slate-500/50'
          }
        `}
      >
        <div className="relative">
          <Icon className={`h-8 w-8 ${isDisabled ? 'text-slate-500' : 'text-blue-400 group-hover:text-blue-300'}`} />
          {isDisabled && (
            <div className="absolute -top-1 -right-1 bg-orange-500/30 text-orange-300 text-xs px-1.5 py-0.5 rounded font-medium">
              In Entwicklung
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className={`font-medium mb-1 ${isDisabled ? 'text-slate-500' : 'text-white'}`}>{title}</h3>
          <p className={`text-xs ${isDisabled ? 'text-slate-600' : 'text-slate-400'}`}>{description}</p>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header (unchanged) */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
              Reflexionstagebuch
            </h1>
            <p className="text-slate-400 text-sm">Professionelle Selbstreflexion für Coaches</p>
          </div>
          
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            Neue Reflexion
          </button>
        </div>

        {/* Search & Filters (unchanged but shortened for space) */}
        {/* ... alle bestehenden Filter-Komponenten ... */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Reflexionen, Coachees, Notizen oder Tags durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/40 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Ergebnisse */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {coacheeFilter ? `${coacheeName}s Journal-Einträge` : 'Alle Journal-Einträge'}
            </h2>
            <p className="text-slate-400 text-sm">
              {filteredReflections.length} von {reflections.length} Einträgen
              {coacheeFilter && ` • Gefiltert nach ${coacheeName}`}
            </p>
          </div>
        </div>

        {/* ← ERWEITERTE Reflexions-Liste mit Edit/Delete-Buttons */}
        <div className="space-y-3">
          {filteredReflections.length > 0 ? (
            filteredReflections.map((reflection) => (
              <div key={reflection.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-medium text-white">{reflection.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        reflection.mood === 'positive' ? 'bg-green-600/20 text-green-400' :
                        reflection.mood === 'challenging' ? 'bg-red-600/20 text-red-400' :
                        'bg-slate-600/20 text-slate-400'
                      }`}>
                        {reflection.mood === 'positive' ? 'Positiv' : 
                         reflection.mood === 'challenging' ? 'Herausfordernd' : 'Neutral'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(reflection.date).toLocaleDateString('de-DE')}
                      </span>
                      {reflection.coacheeName && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {reflection.coacheeName}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* ← NEUE Action-Buttons */}
                  <div className="flex gap-1">
                    <button 
                      onClick={() => startKiAnalysis('patterns')}
                      disabled={!hasFeature('aiModule')}
                      className={`
                        p-1.5 rounded transition-colors 
                        ${hasFeature('aiModule') 
                          ? 'text-purple-400 hover:text-purple-300 hover:bg-slate-700/50' 
                          : 'text-slate-500 cursor-not-allowed opacity-50'
                        }
                      `}
                      title={hasFeature('aiModule') ? 'KI-Analyse' : 'KI-Analyse (In Entwicklung)'}
                    >
                      <Brain className="h-4 w-4" />
                    </button>
                    
                    {/* Edit-Button */}
                    <button 
                      onClick={() => handleEditReflection(reflection)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 rounded transition-colors"
                      title="Reflexion bearbeiten"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    {/* Delete-Button mit Bestätigungs-Dialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button 
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded transition-colors"
                          title="Reflexion löschen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                            Journal-Eintrag löschen?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            Möchtest du den Journal-Eintrag <strong className="text-white">"{reflection.title}"</strong> wirklich dauerhaft löschen?
                            <br /><br />
                            <span className="text-red-400">Diese Aktion kann nicht rückgängig gemacht werden.</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600">
                            Abbrechen
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteReflection(reflection.id)}
                            disabled={deletingId === reflection.id}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                          >
                            {deletingId === reflection.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                                Lösche...
                              </>
                            ) : (
                              'Dauerhaft löschen'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-3">{reflection.content.substring(0, 150)}...</p>
                
                {reflection.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {reflection.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Brain className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Keine Journal-Einträge gefunden
              </h3>
              <p className="text-slate-400 mb-4">
                Für die aktuellen Filter gibt es keine Einträge.
              </p>
              <button
                onClick={() => {
                  clearCoacheeFilter();
                  setDateFilter('all');
                  setCategoryFilter('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Alle Filter zurücksetzen
              </button>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && editingReflection && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border border-slate-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Reflexion bearbeiten</h2>
                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Titel der Reflexion</label>
                  <input
                    type="text"
                    value={editingReflection.title}
                    onChange={(e) => setEditingReflection(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Reflexionsinhalt</label>
                  <textarea
                    value={editingReflection.content}
                    onChange={(e) => setEditingReflection(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Stimmung/Erfahrung</label>
                  <div className="flex flex-wrap gap-2">
                    {['positive', 'neutral', 'challenging'].map(mood => (
                      <button
                        key={mood}
                        onClick={() => setEditingReflection(prev => ({ ...prev, mood }))}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${editingReflection.mood === mood
                            ? mood === 'positive' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' :
                              mood === 'challenging' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' :
                              'bg-gradient-to-r from-slate-600 to-slate-700 text-white'
                            : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                          }
                        `}
                      >
                        {mood === 'positive' ? 'Positive Erfahrung' : 
                         mood === 'challenging' ? 'Herausfordernde Erfahrung' : 'Neutrale Erfahrung'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateReflection}
                  disabled={!editingReflection.title || !editingReflection.content}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  Änderungen speichern
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ... andere Modals (New Modal, KI Modal) - unverändert aber hier weggelassen wegen Platz ... */}
      </div>
    </div>
  );
};

export default ReflexionstagebuchApp;