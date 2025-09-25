import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Calendar, Filter, X, Check, Clock, BarChart3, FileText, Settings, Plus, Brain, TrendingUp, AlertTriangle, Eye, Target, Save, Copy } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAppStateContext } from '@/context/AppStateContext';

const ReflexionstagebuchApp = () => {
  // Context für echte Coachees + Feature Flags
  const { coachees, hasFeature, showPremiumFeature } = useAppStateContext();
  
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
  const [showKiModal, setShowKiModal] = useState(false);
  const [kiType, setKiType] = useState('');
  const [kiLoading, setKiLoading] = useState(false);
  const [kiResult, setKiResult] = useState(null);
  
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
      
      // Toast für aktiven Filter
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
    // URL ohne Parameter
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

  // Filter Funktionen
  const handleCoacheeFilter = (coacheeId, coacheeName) => {
    if (coacheeFilter === coacheeId) {
      // Filter entfernen wenn bereits aktiv
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

  // Gefilterte Reflexionen
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

  // KI Analyse mit Feature-Flag
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

  // Button-Filter Komponente
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

  // KI-Analyse Button Komponente
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
        {/* Header */}
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

        {/* Search */}
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

        {/* Button-Filter */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 mb-6">
          {/* Coachee Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Nach Coachee filtern
            </h3>
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={!coacheeFilter}
                onClick={() => clearCoacheeFilter()}
                count={reflections.length}
              >
                Alle Coachees
              </FilterButton>
              {coachees.map(coachee => {
                const coacheeReflections = reflections.filter(r => r.coacheeId === coachee.id.toString());
                const isActive = coacheeFilter === coachee.id.toString();
                return (
                  <FilterButton
                    key={coachee.id}
                    active={isActive}
                    onClick={() => handleCoacheeFilter(coachee.id.toString(), `${coachee.firstName} ${coachee.lastName}`)}
                    count={coacheeReflections.length}
                  >
                    {coachee.firstName} {coachee.lastName}
                  </FilterButton>
                );
              })}
            </div>
          </div>

          {/* Datum & Kategorie Filter */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Datum Filter */}
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Nach Datum filtern
              </h3>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={dateFilter === 'today'}
                  onClick={() => handleDateFilter('today')}
                >
                  Heute
                </FilterButton>
                <FilterButton
                  active={dateFilter === 'week'}
                  onClick={() => handleDateFilter('week')}
                >
                  Diese Woche
                </FilterButton>
                <FilterButton
                  active={dateFilter === 'month'}
                  onClick={() => handleDateFilter('month')}
                >
                  Dieser Monat
                </FilterButton>
              </div>
            </div>

            {/* Kategorie Filter */}
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Nach Kategorie filtern
              </h3>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={categoryFilter === 'business'}
                  onClick={() => handleCategoryFilter('business')}
                  count={reflections.filter(r => r.category === 'business').length}
                >
                  Business Coaching
                </FilterButton>
                <FilterButton
                  active={categoryFilter === 'life'}
                  onClick={() => handleCategoryFilter('life')}
                  count={reflections.filter(r => r.category === 'life').length}
                >
                  Life Coaching
                </FilterButton>
              </div>
            </div>
          </div>
        </div>

        {/* KI-Analyse mit Feature-Flags */}
        <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              KI-gestützte Coach-Analyse
              {!hasFeature('aiModule') && (
                <span className="ml-2 px-2 py-1 bg-orange-500/30 text-orange-300 text-xs rounded font-medium">
                  In Entwicklung
                </span>
              )}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KIAnalysisButton
              type="trends"
              icon={TrendingUp}
              title="Entwicklungstrends"
              description="Langfristige Muster und Coaching-Evolution"
              onClick={() => startKiAnalysis('trends')}
            />

            <KIAnalysisButton
              type="blindspots"
              icon={Eye}
              title="Blinde Flecken"
              description="Unbewusste Coaching-Muster erkennen"
              onClick={() => startKiAnalysis('blindspots')}
            />

            <KIAnalysisButton
              type="patterns"
              icon={BarChart3}
              title="Coaching-Muster"
              description="Spezifische Reflexion analysieren"
              onClick={() => startKiAnalysis('patterns')}
            />

            <KIAnalysisButton
              type="development"
              icon={Target}
              title="Entwicklungsplan"
              description="Persönlicher Coaching-Entwicklungsplan"
              onClick={() => startKiAnalysis('development')}
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

        {/* Reflexions-Liste */}
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
                    <button className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded transition-colors">
                      <FileText className="h-4 w-4" />
                    </button>
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

        {/* Neue Reflexion Modal */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border border-slate-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Neue Reflexion</h2>
                <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Titel der Reflexion</label>
                  <input
                    type="text"
                    placeholder="z.B. Schwierige Session mit Führungskraft..."
                    value={newReflection.title}
                    onChange={(e) => setNewReflection(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Reflexionsinhalt</label>
                  <textarea
                    placeholder="Beschreibe deine Coaching-Erfahrung, Herausforderungen, Erkenntnisse..."
                    value={newReflection.content}
                    onChange={(e) => setNewReflection(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Coachee zuweisen</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCoacheeSelection('')}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${!newReflection.coacheeId 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                          : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                        }
                      `}
                    >
                      Allgemeine Reflexion
                    </button>
                    {coachees.map(coachee => (
                      <button
                        key={coachee.id}
                        onClick={() => handleCoacheeSelection(coachee.id.toString())}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${newReflection.coacheeId === coachee.id.toString()
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                            : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                          }
                        `}
                      >
                        {coachee.firstName} {coachee.lastName}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Optional: Ordne die Reflexion einem spezifischen Coachee zu</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Stimmung/Erfahrung</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setNewReflection(prev => ({ ...prev, mood: 'positive' }))}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${newReflection.mood === 'positive'
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                          : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                        }
                      `}
                    >
                      Positive Erfahrung
                    </button>
                    <button
                      onClick={() => setNewReflection(prev => ({ ...prev, mood: 'neutral' }))}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${newReflection.mood === 'neutral'
                          ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white' 
                          : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                        }
                      `}
                    >
                      Neutrale Erfahrung
                    </button>
                    <button
                      onClick={() => setNewReflection(prev => ({ ...prev, mood: 'challenging' }))}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${newReflection.mood === 'challenging'
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' 
                          : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                        }
                      `}
                    >
                      Herausfordernde Erfahrung
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveNewReflection}
                  disabled={!newReflection.title || !newReflection.content}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  Reflexion speichern
                </button>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KI Modal */}
        {showKiModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-3xl w-full border border-slate-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-400" />
                  KI-Analyse: {kiType === 'trends' ? 'Entwicklungstrends' : 'Coaching-Muster'}
                </h2>
                <button onClick={() => setShowKiModal(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {kiLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-12 w-12 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-300 text-lg">KI analysiert deine Coaching-Reflexionen...</p>
                </div>
              ) : kiResult && (
                <div className="space-y-6">
                  {kiResult.blindSpots && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-slate-900/50 border border-red-500/30 rounded-lg p-5">
                        <h3 className="font-semibold text-red-400 mb-4">Blinde Flecken</h3>
                        <ul className="space-y-2 text-sm text-slate-300">
                          {kiResult.blindSpots.map((spot, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                              {spot}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-slate-900/50 border border-green-500/30 rounded-lg p-5">
                        <h3 className="font-semibold text-green-400 mb-4">Stärken</h3>
                        <ul className="space-y-2 text-sm text-slate-300">
                          {kiResult.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {kiResult.topThemes && (
                    <div className="bg-slate-900/50 border border-blue-500/30 rounded-lg p-5">
                      <h3 className="font-semibold text-blue-400 mb-4">Entwicklungstrends</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                        <div>
                          <strong>Häufige Themen:</strong> {kiResult.topThemes.join(', ')}
                        </div>
                        <div>
                          <strong>Stimmung:</strong> {kiResult.moodTrend}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Als Reflexion speichern
                    </button>
                    <button className="px-5 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Kopieren
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflexionstagebuchApp;