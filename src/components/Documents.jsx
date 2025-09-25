import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Calendar, Filter, X, Plus, Upload, Settings, Edit, Trash2, CheckCircle, AlertCircle, FileText, Download, Eye, Share2, FolderOpen, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAppStateContext } from '@/context/AppStateContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

const DocumentsApp = () => {
  // Context für echte Daten + Action-Handler
  const { state, actions } = useAppStateContext();
  const { coachees, documents: contextDocuments } = state;
  const { addDocumentToContext, getAllCoacheeDocuments, getCoacheeDocuments, updateDocumentInContext, removeDocumentFromContext } = actions;
  
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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  
  // Delete State
  const [deletingId, setDeletingId] = useState(null);
  
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

  // Action-Handler für Documents
  const handleViewDocument = (doc) => {
    toast({
      title: "Dokument nicht verfügbar",
      description: `${doc.name} kann im Demo-Modus nicht angezeigt werden. In der Vollversion würde das Dokument hier geöffnet.`,
      variant: "destructive",
      duration: 4000
    });
  };

  const handleDownloadDocument = (doc) => {
    toast({
      title: "Download nicht verfügbar",
      description: `${doc.name} kann im Demo-Modus nicht heruntergeladen werden. In der Vollversion würde der Download hier starten.`,
      variant: "destructive", 
      duration: 4000
    });
  };

  const handleShareDocument = (doc) => {
    if (doc.shared) {
      toast({
        title: "Bereits geteilt",
        description: `${doc.name} wurde bereits mit ${doc.coacheeName || 'dem Team'} geteilt.`,
        className: "bg-yellow-600 text-white"
      });
      return;
    }

    // Update document as shared
    const updatedDoc = { ...doc, shared: true };
    updateDocumentInContext(doc.id, updatedDoc);
    
    // Update local state
    setDocuments(prev => prev.map(d => d.id === doc.id ? updatedDoc : d));
    
    // Realistische Benachrichtigung mit Details
    toast({
      title: "Dokument erfolgreich geteilt",
      description: doc.coacheeName 
        ? `${doc.name} wurde mit ${doc.coacheeName} geteilt. Eine Benachrichtigung wurde versendet.`
        : `${doc.name} wurde geteilt und ist jetzt für alle Coachees verfügbar.`,
      className: "bg-green-600 text-white",
      duration: 5000
    });
  };

  const handleEditDocument = (doc) => {
    setEditingDocument({...doc});
    setShowEditDialog(true);
  };

  const handleUpdateDocument = async () => {
    if (!editingDocument.name.trim()) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Dokumentname ist erforderlich"
      });
      return;
    }

    try {
      // Update in Context
      updateDocumentInContext(editingDocument.id, editingDocument);
      
      // Update local state
      setDocuments(prev => prev.map(d => d.id === editingDocument.id ? editingDocument : d));
      
      setShowEditDialog(false);
      setEditingDocument(null);
      
      toast({
        title: "Dokument aktualisiert",
        description: "Die Änderungen wurden gespeichert.",
        className: "bg-blue-600 text-white"
      });
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Dokuments:', error);
      toast({
        variant: "destructive",
        title: "Fehler beim Aktualisieren",
        description: "Das Dokument konnte nicht gespeichert werden."
      });
    }
  };

  const handleDeleteDocument = async (docId) => {
    setDeletingId(docId);
    
    try {
      // Remove from Context
      removeDocumentFromContext(docId);
      
      // Update local state
      setDocuments(prev => prev.filter(d => d.id !== docId));
      
      toast({
        title: "Dokument gelöscht",
        description: "Das Dokument wurde erfolgreich entfernt.",
        className: "bg-green-600 text-white"
      });
    } catch (error) {
      console.error('Fehler beim Löschen des Dokuments:', error);
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen",
        description: "Das Dokument konnte nicht gelöscht werden."
      });
    } finally {
      setDeletingId(null);
    }
  };

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

  // Utility functions
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

  // Upload functions
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

    uploadFiles.forEach(file => {
      const selectedCoachee = uploadMetadata.assignedTo ? 
        coachees.find(c => c.id.toString() === uploadMetadata.assignedTo) : null;

      const newDocument = {
        name: file.name,
        type: getFileType(file.name),
        size: (file.size / (1024 * 1024)).toFixed(1),
        category: uploadMetadata.category,
        coacheeId: selectedCoachee ? selectedCoachee.id : null,
        coacheeName: selectedCoachee ? `${selectedCoachee.firstName} ${selectedCoachee.lastName}` : null,
        date: new Date().toISOString().split('T')[0],
        description: uploadMetadata.description || '',
        shared: false
      };

      addDocumentToContext(newDocument);
    });

    toast({
      title: "Erfolgreich",
      description: `${uploadFiles.length} Dokument(e) erfolgreich hochgeladen und gespeichert`,
      className: "bg-green-600 text-white"
    });
    
    setUploadFiles([]);
    setUploadMetadata({ category: '', description: '', assignedTo: '' });
    setShowUploadDialog(false);
    
    const updatedDocuments = getAllCoacheeDocuments();
    setDocuments(updatedDocuments);
  };

  const handleCoacheeSelection = (selectedCoacheeId) => {
    setUploadMetadata(prev => ({ 
      ...prev, 
      assignedTo: selectedCoacheeId
    }));
  };

  // Category management
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

  // FilterButton component
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

  // Statistics
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

        {/* Quick stats display */}
        <div className="flex gap-4 mb-6 text-sm text-slate-400">
          <span>📁 {stats.total} Dokumente</span>
          <span>🔗 {stats.shared} geteilt</span>
          <span>🆕 {stats.recent} neu</span>
        </div>

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

        {/* Results header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {coacheeFilter ? `${coacheeName}s Dokumente` : 'Alle Dokumente'}
            </h2>
            <p className="text-slate-400 text-sm">
              {filteredDocuments.length} von {documents.length} Dokumenten
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
                    
                    {/* Action-Buttons */}
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleViewDocument(doc)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 rounded transition-colors" 
                        title="Ansehen"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => handleDownloadDocument(doc)}
                        className="p-1.5 text-green-400 hover:text-green-300 hover:bg-slate-700/50 rounded transition-colors" 
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => handleShareDocument(doc)}
                        className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-slate-700/50 rounded transition-colors" 
                        title="Teilen"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => handleEditDocument(doc)}
                        className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded transition-colors" 
                        title="Bearbeiten"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {/* Delete-Button mit Bestätigungs-Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button 
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded transition-colors" 
                            title="Löschen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-400" />
                              Dokument löschen?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                              Möchtest du das Dokument <strong className="text-white">"{doc.name}"</strong> wirklich dauerhaft löschen?
                              <br /><br />
                              <span className="text-red-400">Diese Aktion kann nicht rückgängig gemacht werden.</span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600">
                              Abbrechen
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteDocument(doc.id)}
                              disabled={deletingId === doc.id}
                              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                            >
                              {deletingId === doc.id ? (
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
            </div>
          )}
        </div>

        {/* Edit Document Modal */}
        {showEditDialog && editingDocument && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Dokument bearbeiten</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300 mb-2 block">Name</Label>
                  <Input
                    value={editingDocument.name}
                    onChange={(e) => setEditingDocument(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600/50 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300 mb-2 block">Beschreibung</Label>
                  <textarea
                    value={editingDocument.description || ''}
                    onChange={(e) => setEditingDocument(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300 mb-2 block">Kategorie</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setEditingDocument(prev => ({ ...prev, category: category.id }))}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${editingDocument.category === category.id
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
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Abbrechen
                  </Button>
                </DialogClose>
                <Button 
                  onClick={handleUpdateDocument}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Änderungen speichern
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Upload Dialog */}
        {showUploadDialog && (
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-white">Dokumente hochladen</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Laden Sie neue Dokumente für Ihre Coachees hoch.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* File Drop Zone */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors"
                >
                  <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-slate-300 mb-2">Dateien hierher ziehen oder klicken zum Auswählen</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer text-blue-400 hover:text-blue-300">
                    Dateien auswählen
                  </label>
                </div>

                {/* Selected Files */}
                {uploadFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">Ausgewählte Dateien:</h4>
                    {uploadFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                        <span className="text-sm text-white">{file.name}</span>
                        <button
                          onClick={() => handleRemoveUploadFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 mb-2 block">Kategorie *</Label>
                    <div className="flex flex-wrap gap-1">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setUploadMetadata(prev => ({ ...prev, category: category.id }))}
                          className={`
                            px-2 py-1 rounded text-xs font-medium transition-all
                            ${uploadMetadata.category === category.id
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                              : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 border border-slate-600/50'
                            }
                          `}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Coachee zuweisen</Label>
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => handleCoacheeSelection('')}
                        className={`
                          px-2 py-1 rounded text-xs font-medium transition-all
                          ${!uploadMetadata.assignedTo 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                            : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 border border-slate-600/50'
                          }
                        `}
                      >
                        Allgemein
                      </button>
                      {(coachees || []).map(coachee => (
                        <button
                          key={coachee.id}
                          onClick={() => handleCoacheeSelection(coachee.id.toString())}
                          className={`
                            px-2 py-1 rounded text-xs font-medium transition-all
                            ${uploadMetadata.assignedTo === coachee.id.toString()
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                              : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 border border-slate-600/50'
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
                  <Label className="text-slate-300 mb-2 block">Beschreibung (optional)</Label>
                  <textarea
                    placeholder="Kurze Beschreibung der Dokumente..."
                    value={uploadMetadata.description}
                    onChange={(e) => setUploadMetadata(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                  Hochladen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Category Manager Dialog */}
        {showCategoryManager && (
          <Dialog open={showCategoryManager} onOpenChange={setShowCategoryManager}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Kategorien verwalten</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Erstellen Sie neue Kategorien oder bearbeiten Sie bestehende.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Add New Category */}
                <div className="border border-slate-600/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Neue Kategorie hinzufügen</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-slate-300 mb-2 block">Name</Label>
                      <Input
                        placeholder="z.B. Führungskompetenz"
                        value={newCategoryData.name}
                        onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600/50 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 mb-2 block">Farbe</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableColors.map(color => (
                          <button
                            key={color.class}
                            onClick={() => setNewCategoryData(prev => ({ ...prev, color: color.class }))}
                            className={`
                              px-3 py-2 rounded-lg text-sm font-medium transition-all
                              ${newCategoryData.color === color.class
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                                : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 border border-slate-600/50'
                              }
                            `}
                          >
                            <span className={color.class}>●</span> {color.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={handleAddCategory}
                      disabled={!newCategoryData.name.trim()}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Kategorie hinzufügen
                    </Button>
                  </div>
                </div>

                {/* Existing Categories */}
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Bestehende Kategorien</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`text-lg ${category.color}`}>●</span>
                          <span className="text-white">{category.name}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Schließen
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