import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Calendar, Filter, X, Plus, Upload, Settings, Edit, Trash2, CheckCircle, AlertCircle, FileText, Download, Eye, Share2, FolderOpen } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAppStateContext } from '@/context/AppStateContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const DocumentsApp = () => {
  // Context für echte Daten
  const { state, actions } = useAppStateContext();
  const { coachees, documents: contextDocuments } = state;
  const { addDocumentToContext, getAllCoacheeDocuments, getCoacheeDocuments } = actions;
  
  // Navigation und Location für URL-Parameter
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Filter States
  const [coacheeFilter, setCoacheeFilter] = useState(null);
  const [coacheeName, setCoacheeName] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Basis States
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  
  // Upload States
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadMetadata, setUploadMetadata] = useState({
    category: '',
    description: '',
    assignedTo: ''
  });

  // Kategorie States
  const [categories, setCategories] = useState([
    { id: 'personality', name: 'Persönlichkeit', color: 'text-blue-400' },
    { id: 'leadership', name: 'Führung', color: 'text-purple-400' },
    { id: 'team', name: 'Team', color: 'text-green-400' },
    { id: 'communication', name: 'Kommunikation', color: 'text-orange-400' },
    { id: 'goals', name: 'Zielsetzung', color: 'text-red-400' },
    { id: 'conflict', name: 'Konfliktmanagement', color: 'text-yellow-400' },
    { id: 'development', name: 'Entwicklung', color: 'text-indigo-400' },
    { id: 'wellbeing', name: 'Work-Life-Balance', color: 'text-pink-400' }
  ]);

  const [newCategoryData, setNewCategoryData] = useState({ name: '', color: 'text-blue-400' });

  // Echte Dokumente aus Context laden
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Lade alle Dokumente aus dem Context
    const allDocuments = getAllCoacheeDocuments();
    setDocuments(allDocuments);
  }, [contextDocuments, getAllCoacheeDocuments]);

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
        description: `Zeige nur Dokumente von ${decodeURIComponent(name.replace(/\+/g, ' '))}`,
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
      description: "Zeige alle Dokumente",
      className: "bg-blue-600 text-white"
    });
  };

  // Filter Funktionen
  const handleCoacheeFilter = (coacheeId, coacheeName) => {
    if (coacheeFilter === coacheeId) {
      clearCoacheeFilter();
    } else {
      setCoacheeFilter(coacheeId);
      setCoacheeName(coacheeName);
      
      toast({
        title: "Filter gesetzt",
        description: `Zeige nur Dokumente von ${coacheeName}`,
        className: "bg-blue-600 text-white"
      });
    }
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category === categoryFilter ? 'all' : category);
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type === typeFilter ? 'all' : type);
  };

  const handleDateFilter = (filter) => {
    setDateFilter(filter === dateFilter ? 'all' : filter);
  };

  // Gefilterte Dokumente
  const filteredDocuments = documents.filter(doc => {
    if (coacheeFilter && doc.coacheeId !== parseInt(coacheeFilter)) {
      return false;
    }
    
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) {
      return false;
    }
    
    if (typeFilter !== 'all' && doc.type !== typeFilter) {
      return false;
    }
    
    if (dateFilter !== 'all') {
      const today = new Date();
      const docDate = new Date(doc.date || doc.uploadDate);
      
      if (dateFilter === 'today') {
        if (today.toDateString() !== docDate.toDateString()) return false;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (docDate < weekAgo) return false;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (docDate < monthAgo) return false;
      }
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        doc.name.toLowerCase().includes(searchLower) ||
        doc.description?.toLowerCase().includes(searchLower) ||
        (doc.coacheeName && doc.coacheeName.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Datei-Icon Funktion
  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return '📄';
      case 'word': return '📝';
      case 'excel': return '📊';
      case 'powerpoint': return '📽️';
      case 'image': return '🖼️';
      case 'text': return '📋';
      default: return '📎';
    }
  };

  // Datei-Typ erkennen
  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['xls', 'xlsx'].includes(extension)) return 'excel';
    if (['ppt', 'pptx'].includes(extension)) return 'powerpoint';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) return 'image';
    if (['txt', 'md'].includes(extension)) return 'text';
    
    return 'other';
  };

  // Upload-Funktionen
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadFiles([...uploadFiles, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setUploadFiles([...uploadFiles, ...files]);
  };

  const handleRemoveUploadFile = (index) => {
    setUploadFiles(uploadFiles.filter((_, i) => i !== index));
  };

  // REPARIERT: Upload-Funktion speichert jetzt persistent
  const handleUpload = () => {
    if (uploadFiles.length === 0) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie mindestens eine Datei aus",
        variant: "destructive"
      });
      return;
    }

    if (!uploadMetadata.category) {
      toast({
        title: "Fehler", 
        description: "Bitte wählen Sie eine Kategorie aus",
        variant: "destructive"
      });
      return;
    }

    // Verarbeite jede Datei und speichere im Context
    uploadFiles.forEach(file => {
      const selectedCoachee = uploadMetadata.assignedTo ? 
        coachees.find(c => c.id.toString() === uploadMetadata.assignedTo) : null;

      const newDocument = {
        name: file.name,
        type: getFileType(file.name),
        size: (file.size / (1024 * 1024)).toFixed(1), // Convert to MB
        category: uploadMetadata.category,
        coacheeId: selectedCoachee ? selectedCoachee.id : null,
        coacheeName: selectedCoachee ? `${selectedCoachee.firstName} ${selectedCoachee.lastName}` : null,
        date: new Date().toISOString().split('T')[0],
        description: uploadMetadata.description || '',
        shared: false
      };

      // Speichere das Dokument im Context
      addDocumentToContext(newDocument);
    });

    toast({
      title: "Erfolgreich",
      description: `${uploadFiles.length} Dokument(e) erfolgreich hochgeladen und gespeichert`,
      className: "bg-green-600 text-white"
    });
    
    // Reset Upload State
    setUploadFiles([]);
    setUploadMetadata({ category: '', description: '', assignedTo: '' });
    setShowUploadDialog(false);
    
    // Aktualisiere die lokale Dokumentenliste
    const updatedDocuments = getAllCoacheeDocuments();
    setDocuments(updatedDocuments);
  };

  // Handler für Coachee-Auswahl
  const handleCoacheeSelection = (selectedCoacheeId) => {
    setUploadMetadata(prev => ({ 
      ...prev, 
      assignedTo: selectedCoacheeId
    }));
  };

  // Kategorie-Management
  const handleAddCategory = () => {
    if (!newCategoryData.name.trim()) {
      toast({
        title: "Fehler",
        description: "Kategoriename ist erforderlich",
        variant: "destructive"
      });
      return;
    }
    
    const categoryExists = categories.some(cat => 
      cat.name.toLowerCase() === newCategoryData.name.toLowerCase()
    );
    
    if (categoryExists) {
      toast({
        title: "Fehler",
        description: "Diese Kategorie existiert bereits",
        variant: "destructive"
      });
      return;
    }

    const newCat = {
      id: Date.now().toString(),
      name: newCategoryData.name.trim(),
      color: newCategoryData.color
    };
    
    setCategories([...categories, newCat]);
    setNewCategoryData({ name: '', color: 'text-blue-400' });
    
    toast({
      title: "Erfolgreich",
      description: "Kategorie wurde hinzugefügt",
      className: "bg-green-600 text-white"
    });
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast({
      title: "Erfolgreich",
      description: "Kategorie wurde gelöscht",
      className: "bg-green-600 text-white"
    });
  };

  // Button-Filter Komponente
  const FilterButton = ({ active, onClick, children, icon: Icon, count }) => (
    <button
      onClick={onClick}
      className={`
        relative px-3 py-2 rounded-lg text-sm font-medium transition-all
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

  // Statistiken berechnen
  const stats = {
    total: filteredDocuments.length,
    shared: filteredDocuments.filter(doc => doc.shared).length,
    recent: filteredDocuments.filter(doc => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(doc.date || doc.uploadDate) > weekAgo;
    }).length,
    categories: categories.length
  };

  const availableColors = [
    { name: 'Blau', class: 'text-blue-400' },
    { name: 'Grün', class: 'text-green-400' },
    { name: 'Orange', class: 'text-orange-400' },
    { name: 'Lila', class: 'text-purple-400' },
    { name: 'Rot', class: 'text-red-400' },
    { name: 'Gelb', class: 'text-yellow-400' },
    { name: 'Indigo', class: 'text-indigo-400' },
    { name: 'Pink', class: 'text-pink-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
              Dokumente
            </h1>
            <p className="text-slate-400 text-sm">Organisieren, teilen und verwalten Sie Ihre Coaching-Materialien</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowUploadDialog(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all text-sm"
            >
              <Upload className="h-4 w-4" />
              Hochladen
            </button>
            
            <button
              onClick={() => setShowCategoryManager(true)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50 rounded-lg transition-all text-sm"
            >
              <Settings className="h-4 w-4" />
              Kategorien
            </button>
          </div>
        </div>

        {/* Statistiken */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Gesamt</p>
                <p className="text-xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Share2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Geteilt</p>
                <p className="text-xl font-bold text-white">{stats.shared}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600/20 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Neu (7 Tage)</p>
                <p className="text-xl font-bold text-white">{stats.recent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <FolderOpen className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Kategorien</p>
                <p className="text-xl font-bold text-white">{stats.categories}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coachee Filter Badge */}
        {coacheeFilter && (
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-600/20 border border-green-600/30 rounded-lg">
              <User className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Coachee: {coacheeName}</span>
              <button
                onClick={clearCoacheeFilter}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Dokumente, Coachees oder Beschreibungen durchsuchen..."
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
                count={documents.length}
              >
                Alle Coachees
              </FilterButton>
              {(coachees || []).map(coachee => {
                const coacheeDocuments = documents.filter(doc => doc.coacheeId === coachee.id);
                const isActive = coacheeFilter === coachee.id.toString();
                return (
                  <FilterButton
                    key={coachee.id}
                    active={isActive}
                    onClick={() => handleCoacheeFilter(coachee.id.toString(), `${coachee.firstName} ${coachee.lastName}`)}
                    count={coacheeDocuments.length}
                  >
                    {coachee.firstName} {coachee.lastName}
                  </FilterButton>
                );
              })}
            </div>
          </div>

          {/* Weitere Filter */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Kategorie Filter */}
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Nach Kategorie filtern
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 4).map(category => (
                  <FilterButton
                    key={category.id}
                    active={categoryFilter === category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    count={documents.filter(doc => doc.category === category.id).length}
                  >
                    {category.name}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Typ Filter */}
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Nach Typ filtern
              </h3>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={typeFilter === 'pdf'}
                  onClick={() => handleTypeFilter('pdf')}
                  count={documents.filter(doc => doc.type === 'pdf').length}
                >
                  PDF
                </FilterButton>
                <FilterButton
                  active={typeFilter === 'word'}
                  onClick={() => handleTypeFilter('word')}
                  count={documents.filter(doc => doc.type === 'word').length}
                >
                  Word
                </FilterButton>
                <FilterButton
                  active={typeFilter === 'text'}
                  onClick={() => handleTypeFilter('text')}
                  count={documents.filter(doc => doc.type === 'text').length}
                >
                  Text
                </FilterButton>
              </div>
            </div>

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
          </div>
        </div>

        {/* Ergebnisse */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {coacheeFilter ? `${coacheeName}s Dokumente` : 'Alle Dokumente'}
            </h2>
            <p className="text-slate-400 text-sm">
              {filteredDocuments.length} von {documents.length} Dokumenten
              {coacheeFilter && ` • Gefiltert nach ${coacheeName}`}
            </p>
          </div>
        </div>

        {/* Dokumente-Liste */}
        <div className="space-y-3">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => {
              const category = categories.find(cat => cat.id === doc.category);
              return (
                <div key={doc.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">{getFileIcon(doc.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-medium text-white">{doc.name}</h3>
                          {category && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${category.color} bg-slate-700/50`}>
                              {category.name}
                            </span>
                          )}
                          {doc.shared && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-600/20 text-green-400">
                              Geteilt
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(doc.date || doc.uploadDate).toLocaleDateString('de-DE')}
                          </span>
                          {doc.coacheeName && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {doc.coacheeName}
                            </span>
                          )}
                          <span>{doc.size} MB</span>
                        </div>
                        
                        {doc.description && (
                          <p className="text-slate-300 text-sm">{doc.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 rounded transition-colors" title="Ansehen">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-green-400 hover:text-green-300 hover:bg-slate-700/50 rounded transition-colors" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-slate-700/50 rounded transition-colors" title="Teilen">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded transition-colors" title="Bearbeiten">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded transition-colors" title="Löschen">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Keine Dokumente gefunden
              </h3>
              <p className="text-slate-400 mb-4">
                Für die aktuellen Filter gibt es keine Dokumente.
              </p>
              <button
                onClick={() => {
                  clearCoacheeFilter();
                  setCategoryFilter('all');
                  setTypeFilter('all');
                  setDateFilter('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Alle Filter zurücksetzen
              </button>
            </div>
          )}
        </div>

        {/* Upload Dialog */}
        {showUploadDialog && (
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Dokumente hochladen</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Laden Sie neue Dokumente hoch und ordnen Sie diese zu.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Drag & Drop Zone */}
                <div 
                  className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-700/30"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Dateien hochladen</h3>
                  <p className="text-slate-400 mb-4">
                    Ziehen Sie Dateien hierher oder klicken Sie zum Auswählen
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Dateien auswählen
                  </Button>
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                </div>

                {/* Dateiliste */}
                {uploadFiles.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-3">Ausgewählte Dateien ({uploadFiles.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {uploadFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getFileIcon(getFileType(file.name))}</span>
                            <div>
                              <p className="font-medium text-white">{file.name}</p>
                              <p className="text-sm text-slate-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUploadFile(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadaten */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-slate-300 mb-2 block">Kategorie*</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setUploadMetadata(prev => ({ ...prev, category: category.id }))}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all
                            ${uploadMetadata.category === category.id
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                              : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                            }
                          `}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Zuweisen an</Label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCoacheeSelection('')}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${!uploadMetadata.assignedTo 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                            : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                          }
                        `}
                      >
                        Nicht zugewiesen
                      </button>
                      {(coachees || []).map(coachee => (
                        <button
                          key={coachee.id}
                          onClick={() => handleCoacheeSelection(coachee.id.toString())}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all
                            ${uploadMetadata.assignedTo === coachee.id.toString()
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                              : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                            }
                          `}
                        >
                          {coachee.firstName} {coachee.lastName}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300 mb-2 block">Beschreibung</Label>
                  <textarea
                    value={uploadMetadata.description}
                    onChange={(e) => setUploadMetadata(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional: Beschreibung des Dokuments..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    rows="3"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Abbrechen
                  </Button>
                </DialogClose>
                <Button 
                  onClick={handleUpload}
                  disabled={uploadFiles.length === 0 || !uploadMetadata.category}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadFiles.length} Dokument(e) hochladen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Kategorie-Manager Dialog */}
        {showCategoryManager && (
          <Dialog open={showCategoryManager} onOpenChange={setShowCategoryManager}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Kategorien verwalten</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Erstellen und verwalten Sie Kategorien für Ihre Dokumente.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Neue Kategorie hinzufügen */}
                <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600/50">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Neue Kategorie hinzufügen
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300 mb-2 block">Name</Label>
                      <Input
                        value={newCategoryData.name}
                        onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="z.B. Leadership"
                        className="bg-slate-700/50 border-slate-600/50 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-2 block">Farbe</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableColors.slice(0, 4).map(color => (
                          <button
                            key={color.class}
                            onClick={() => setNewCategoryData(prev => ({ ...prev, color: color.class }))}
                            className={`
                              px-3 py-2 rounded-lg text-sm font-medium transition-all
                              ${newCategoryData.color === color.class
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                                : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                              }
                            `}
                          >
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddCategory}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    disabled={!newCategoryData.name.trim()}
                  >
                    Kategorie hinzufügen
                  </Button>
                </div>

                {/* Bestehende Kategorien */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Bestehende Kategorien ({categories.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(category => (
                      <div key={category.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`${category.color} font-medium`}>
                            {category.name}
                          </div>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-xs text-slate-400">
                          {documents.filter(doc => doc.category === category.id).length} Dokument(e)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Fertig
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default DocumentsApp;