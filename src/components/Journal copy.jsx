import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, User, Calendar, Filter, X, Check, Clock, BarChart3, FileText, Settings, Plus, Brain, TrendingUp, AlertTriangle, Eye, Target, Save, Copy } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAppStateContext } from '@/context/AppStateContext';

const ReflexionstagebuchApp = () => {
  // Context für echte Coachees
  const { coachees } = useAppStateContext();
  
  // Navigation und Location für URL-Parameter
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Filter States
  const [coacheeFilter, setCoacheeFilter] = useState(null);
  const [coacheeName, setCoacheeName] = useState('');
  
  // Basis States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoachee, setSelectedCoachee] = useState('Alle Coachees');
  const [selectedDate, setSelectedDate] = useState('Nach Datum');
  const [selectedStatus, setSelectedStatus] = useState('Alle Status');
  const [selectedCategory, setSelectedCategory] = useState('Alle Kategorien');
  
  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState('');
  
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

  // Demo Daten - erweitert mit coacheeId (in echten App aus localStorage laden)
  const [reflections, setReflections] = useState([
    {
      id: 1,
      title: 'Schwierige Session mit Führungskraft',
      content: 'Heute hatte ich eine Session mit einem sehr dominanten CEO. Ich habe gemerkt, dass ich mich eingeschüchtert gefühlt habe und nicht meine üblichen systemischen Fragen gestellt habe.',
      date: '2025-01-21',
      mood: 'challenging',
      tags: ['Führung', 'Machtdynamik', 'Grenzen'],
      coacheeId: '16',
      coacheeName: 'Anna Schmidt'
    },
    {
      id: 2,
      title: 'Durchbruch bei systemischen Fragen',
      content: 'Eine fantastische Session heute! Durch die Frage "Was würde Ihr Team sagen..." ist bei meiner Coachee ein echter Aha-Moment entstanden.',
      date: '2025-01-20',
      mood: 'positive',
      tags: ['Systemik', 'Erfolg', 'Kommunikation'],
      coacheeId: '16',
      coacheeName: 'Anna Schmidt'
    },
    {
      id: 3,
      title: 'Reflexion zur Work-Life-Balance',
      content: 'Session mit Marco über Work-Life-Balance. Interessante Erkenntnisse über seine Prioritäten.',
      date: '2025-01-19',
      mood: 'neutral',
      tags: ['Work-Life-Balance', 'Prioritäten'],
      coacheeId: '17',
      coacheeName: 'Marco Müller'
    }
  ]);

  // Gefilterte Reflexionen basierend auf Coachee-Filter und anderen Filtern
  const filteredReflections = reflections.filter(reflection => {
    // Coachee-Filter
    if (coacheeFilter && reflection.coacheeId !== coacheeFilter) {
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

  // Dynamische Coachee-Optionen aus echten Daten
  const coacheeOptions = [
    { value: '', label: 'Allgemeine Reflexion (kein Coachee)' },
    ...coachees.map(coachee => ({
      value: coachee.id.toString(),
      label: `${coachee.firstName} ${coachee.lastName}`
    }))
  ];

  // Dropdown Optionen
  const coacheeNames = ['Alle Coachees', ...coachees.map(c => `${c.firstName} ${c.lastName}`)];
  const dateOptions = ['Nach Datum', 'Heute', 'Diese Woche', 'Dieser Monat'];
  const statusOptions = ['Alle Status', 'Geplant', 'Abgeschlossen', 'Storniert'];
  const categoryOptions = ['Alle Kategorien', 'Business Coaching', 'Life Coaching', 'Führungskräfte'];

  // Dropdown Handler
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? '' : dropdown);
  };

  const selectOption = (type, value) => {
    switch(type) {
      case 'coachee': setSelectedCoachee(value); break;
      case 'date': setSelectedDate(value); break;
      case 'status': setSelectedStatus(value); break;
      case 'category': setSelectedCategory(value); break;
    }
    setOpenDropdown('');
  };

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

  // KI Analyse
  const startKiAnalysis = async (type) => {
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
        coacheeName: newReflection.coacheeName
      };
      
      setReflections([reflection, ...reflections]);
      setNewReflection({ title: '', content: '', mood: 'neutral', coacheeId: null, coacheeName: '' });
      setShowNewModal(false);

      // In echter App: Reflexion in localStorage speichern
      // const existingReflections = JSON.parse(localStorage.getItem('journalReflections') || '[]');
      // localStorage.setItem('journalReflections', JSON.stringify([reflection, ...existingReflections]));
    }
  };

  // Dropdown Komponente - Mit korrekter Positionierung unter dem Button
  const Dropdown = ({ label, value, options, type, icon: Icon }) => {
    const [buttonRef, setButtonRef] = useState(null);
    
    return (
      <div className="relative">
        <button
          ref={setButtonRef}
          onClick={() => toggleDropdown(type)}
          className="
            min-w-[140px] px-3 py-2.5 
            bg-slate-700/60 border border-slate-600/60
            rounded-lg text-slate-200 text-sm font-medium
            hover:bg-slate-600/60 transition-colors
            flex items-center justify-between gap-2
          "
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-slate-400" />}
            <span className="truncate">{value}</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${
            openDropdown === type ? 'rotate-180' : ''
          }`} />
        </button>
        
        {/* Dropdown direkt unter dem Button */}
        {openDropdown === type && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[998]" 
              onClick={() => setOpenDropdown('')}
            />
            {/* Dropdown Content */}
            <div className="absolute top-full left-0 mt-1 z-[999] bg-slate-800 border border-slate-600/50 rounded-lg shadow-2xl max-h-40 overflow-y-auto w-48">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectOption(type, option)}
                  className="w-full px-3 py-1.5 text-left text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors text-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
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

        {/* Filter-Badges */}
        {coacheeFilter && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg text-sm">
                <User className="h-4 w-4" />
                <span>Coachee: {coacheeName}</span>
                <button 
                  onClick={clearCoacheeFilter}
                  className="ml-1 hover:bg-green-500/20 rounded p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 mb-6">
          <div className="mb-4">
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

          <div className="flex flex-wrap gap-3 items-center">
            <Dropdown
              label="Alle Coachees"
              value={selectedCoachee}
              options={coacheeNames}
              type="coachee"
              icon={User}
            />
            
            <Dropdown
              label="Nach Datum"
              value={selectedDate}
              options={dateOptions}
              type="date"
              icon={Calendar}
            />
            
            <Dropdown
              label="Alle Status"
              value={selectedStatus}
              options={statusOptions}
              type="status"
              icon={BarChart3}
            />
            
            <Dropdown
              label="Alle Kategorien"
              value={selectedCategory}
              options={categoryOptions}
              type="category"
              icon={FileText}
            />

            <button className="px-4 py-2.5 text-sm font-medium bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 rounded-lg text-white transition-colors flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Erweitert
            </button>
          </div>
        </div>

        {/* KI-Analyse */}
        <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            KI-gestützte Coach-Analyse
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => startKiAnalysis('trends')}
              className="flex flex-col items-center gap-3 p-6 bg-slate-700/40 hover:bg-slate-600/50 border border-slate-600/40 hover:border-slate-500/50 rounded-xl transition-all duration-200 group"
            >
              <TrendingUp className="h-8 w-8 text-blue-400 group-hover:text-blue-300" />
              <div className="text-center">
                <h3 className="text-white font-medium mb-1">Entwicklungstrends</h3>
                <p className="text-xs text-slate-400">Langfristige Muster und Coaching-Evolution</p>
              </div>
            </button>

            <button 
              onClick={() => startKiAnalysis('blindspots')}
              className="flex flex-col items-center gap-3 p-6 bg-slate-700/40 hover:bg-slate-600/50 border border-slate-600/40 hover:border-slate-500/50 rounded-xl transition-all duration-200 group"
            >
              <Eye className="h-8 w-8 text-orange-400 group-hover:text-orange-300" />
              <div className="text-center">
                <h3 className="text-white font-medium mb-1">Blinde Flecken</h3>
                <p className="text-xs text-slate-400">Unbewusste Coaching-Muster erkennen</p>
              </div>
            </button>

            <button 
              onClick={() => startKiAnalysis('patterns')}
              className="flex flex-col items-center gap-3 p-6 bg-slate-700/40 hover:bg-slate-600/50 border border-slate-600/40 hover:border-slate-500/50 rounded-xl transition-all duration-200 group"
            >
              <BarChart3 className="h-8 w-8 text-green-400 group-hover:text-green-300" />
              <div className="text-center">
                <h3 className="text-white font-medium mb-1">Coaching-Muster</h3>
                <p className="text-xs text-slate-400">Spezifische Reflexion analysieren</p>
              </div>
            </button>

            <button 
              onClick={() => startKiAnalysis('development')}
              className="flex flex-col items-center gap-3 p-6 bg-slate-700/40 hover:bg-slate-600/50 border border-slate-600/40 hover:border-slate-500/50 rounded-xl transition-all duration-200 group"
            >
              <Target className="h-8 w-8 text-purple-400 group-hover:text-purple-300" />
              <div className="text-center">
                <h3 className="text-white font-medium mb-1">Entwicklungsplan</h3>
                <p className="text-xs text-slate-400">Persönlicher Coaching-Entwicklungsplan</p>
              </div>
            </button>
          </div>
        </div>

        {/* Ergebnisse */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {coacheeFilter ? `${coacheeName}s Journal-Einträge` : 'Alle Journal-Einträge'}
            </h2>
            <p className="text-slate-400 text-sm">
              {coacheeFilter 
                ? `Gefilterte Einträge • ${filteredReflections.length} von ${reflections.length} gefunden`
                : `Alle Reflexionen • ${filteredReflections.length} gefunden`
              }
            </p>
          </div>
          
          <div className="relative">
            <select className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none appearance-none pr-10 cursor-pointer">
              <option>Neueste zuerst</option>
              <option>Älteste zuerst</option>
              <option>Nach Stimmung</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
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
                      className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-slate-700/50 rounded transition-colors" 
                      title="KI-Analyse"
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
                {coacheeFilter 
                  ? `Keine Journal-Einträge für ${coacheeName} gefunden`
                  : 'Keine Journal-Einträge gefunden'
                }
              </h3>
              <p className="text-slate-400 mb-4">
                {coacheeFilter 
                  ? `Noch keine Reflexionen zu ${coacheeName} vorhanden.`
                  : 'Beginne mit deiner ersten Coaching-Reflexion.'
                }
              </p>
              {coacheeFilter && (
                <button
                  onClick={clearCoacheeFilter}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Alle Einträge anzeigen
                </button>
              )}
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
                  <div className="relative">
                    <select
                      value={newReflection.coacheeId || ''}
                      onChange={(e) => handleCoacheeSelection(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer pr-10"
                    >
                      {coacheeOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <User className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Optional: Ordne die Reflexion einem spezifischen Coachee zu</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Stimmung/Erfahrung</label>
                  <div className="relative">
                    <select
                      value={newReflection.mood}
                      onChange={(e) => setNewReflection(prev => ({ ...prev, mood: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer pr-10"
                    >
                      <option value="positive">Positive Erfahrung</option>
                      <option value="neutral">Neutrale Erfahrung</option>
                      <option value="challenging">Herausfordernde Erfahrung</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
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