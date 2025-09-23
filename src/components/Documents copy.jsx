import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Settings, Filter, X, Edit, Trash2, CheckCircle, AlertCircle, FileText } from 'lucide-react';

// Toast-Komponente im App-Design
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {toasts.map(toast => (
      <div
        key={toast.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 bg-gray-800 text-white max-w-sm transform transition-all duration-300 ${
          toast.type === 'success' 
            ? 'border-l-green-400' 
            : 'border-l-red-400'
        }`}
      >
        {toast.type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-400" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-400" />
        )}
        <span className="text-sm font-medium">{toast.message}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeToast(toast.id)}
          className="ml-auto p-1 h-6 w-6 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
);

export default function Documents() {
  // Toast-System
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error')
  };

  // Kategorien-System
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

  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', color: 'text-gray-400' });

  // Upload-System
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadMetadata, setUploadMetadata] = useState({
    category: '',
    description: '',
    assignedTo: ''
  });

  // Verfügbare Farben
  const availableColors = [
    { name: 'Blau', class: 'text-blue-400' },
    { name: 'Grün', class: 'text-green-400' },
    { name: 'Orange', class: 'text-orange-400' },
    { name: 'Lila', class: 'text-purple-400' },
    { name: 'Grau', class: 'text-gray-400' }
  ];

  // Mock Coachees
  const coachees = [
    { id: '1', name: 'Anna Schmidt' },
    { id: '2', name: 'Max Weber' },
    { id: '3', name: 'Lisa Müller' },
    { id: '4', name: 'Tom Johnson' }
  ];

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

  const getFileIcon = (file) => {
    const type = file.type || file.name.split('.').pop();
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📽️';
    return '📎';
  };

  const handleUpload = () => {
    if (uploadFiles.length === 0) {
      toast.error('Bitte wählen Sie mindestens eine Datei aus');
      return;
    }

    if (!uploadMetadata.category) {
      toast.error('Bitte wählen Sie eine Kategorie aus');
      return;
    }

    toast.success(`${uploadFiles.length} Dokument(e) erfolgreich hochgeladen`);
    
    setUploadFiles([]);
    setUploadMetadata({
      category: '',
      description: '',
      assignedTo: ''
    });
    setShowUploadDialog(false);
  };

  // Kategorie-Management
  const handleAddCategory = () => {
    if (!newCategoryData.name.trim()) {
      toast.error('Kategoriename ist erforderlich');
      return;
    }
    
    const categoryExists = categories.some(cat => 
      cat.name.toLowerCase() === newCategoryData.name.toLowerCase()
    );
    
    if (categoryExists) {
      toast.error('Diese Kategorie existiert bereits');
      return;
    }

    const newCat = {
      id: Date.now().toString(),
      name: newCategoryData.name.trim(),
      color: newCategoryData.color
    };
    
    setCategories([...categories, newCat]);
    setNewCategoryData({ name: '', color: 'text-gray-400' });
    toast.success('Kategorie wurde hinzugefügt');
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setNewCategoryData({
      name: category.name,
      color: category.color
    });
  };

  const handleUpdateCategory = () => {
    if (!newCategoryData.name.trim()) {
      toast.error('Kategoriename ist erforderlich');
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === editingCategoryId 
        ? { ...cat, name: newCategoryData.name.trim(), color: newCategoryData.color }
        : cat
    ));
    
    setEditingCategoryId(null);
    setNewCategoryData({ name: '', color: 'text-gray-400' });
    toast.success('Kategorie wurde aktualisiert');
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success('Kategorie wurde gelöscht');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Dokumente</h1>
            <p className="text-gray-400 mt-2">Organisieren, teilen und verwalten Sie Ihre Coaching-Materialien</p>
          </div>
          <Button 
            onClick={() => setShowUploadDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="mr-2 h-5 w-5" />
            Dokumente hochladen
          </Button>
        </div>

        {/* Statistik-Cards im App-Design */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-900/50 rounded-full">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Gesamt</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-900/50 rounded-full">
                <span className="text-lg">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Templates</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-900/50 rounded-full">
                <span className="text-lg">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Geteilt</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-900/50 rounded-full">
                <span className="text-lg">🕒</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Neu (7 Tage)</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suchleiste und Aktionen */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Dokumente durchsuchen..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="date">Nach Datum</option>
                <option value="name">Nach Name</option>
                <option value="size">Nach Größe</option>
                <option value="type">Nach Typ</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCategoryManager(true)}
                className="border-blue-500/50 text-blue-400 hover:bg-blue-900/50"
              >
                <Settings className="mr-2 h-4 w-4" />
                Kategorien verwalten
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success('Filter werden implementiert...')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter anzeigen
              </Button>
            </div>
          </div>
        </div>

        {/* Kategorien-Vorschau im App-Design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.slice(0, 8).map(category => (
            <div key={category.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
              <div className="text-center">
                <div className={`${category.color} font-medium mb-2`}>
                  {category.name}
                </div>
                <p className="text-xs text-gray-500">0 Dokumente</p>
              </div>
            </div>
          ))}
        </div>

        {/* Leerer Zustand */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Keine Dokumente gefunden</h3>
          <p className="text-gray-400 mb-6">Laden Sie Ihre ersten Coaching-Materialien hoch, um loszulegen.</p>
          <Button 
            onClick={() => setShowUploadDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Erste Dokumente hochladen
          </Button>
        </div>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        {/* Upload Dialog */}
        {showUploadDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Dokumente hochladen</h2>
                  <Button variant="ghost" onClick={() => setShowUploadDialog(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {/* Drag & Drop Zone */}
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer mb-6 bg-gray-700/30"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Dateien hochladen</h3>
                  <p className="text-gray-400 mb-4">
                    Ziehen Sie Dateien hierher oder klicken Sie zum Auswählen
                  </p>
                  <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-900/50">
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
                  <div className="mb-6">
                    <h4 className="font-semibold text-white mb-3">Ausgewählte Dateien ({uploadFiles.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {uploadFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getFileIcon(file)}</span>
                            <div>
                              <p className="font-medium text-white">{file.name}</p>
                              <p className="text-sm text-gray-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
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

                {/* Metadaten-Formular */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Kategorie*</label>
                    <select
                      value={uploadMetadata.category}
                      onChange={(e) => setUploadMetadata({...uploadMetadata, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em'
                      }}
                      required
                    >
                      <option value="">Kategorie wählen</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Zuweisen an</label>
                    <select
                      value={uploadMetadata.assignedTo}
                      onChange={(e) => setUploadMetadata({...uploadMetadata, assignedTo: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em'
                      }}
                    >
                      <option value="">Nicht zugewiesen</option>
                      {coachees.map(coachee => (
                        <option key={coachee.id} value={coachee.id}>{coachee.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Beschreibung</label>
                    <textarea
                      value={uploadMetadata.description}
                      onChange={(e) => setUploadMetadata({...uploadMetadata, description: e.target.value})}
                      placeholder="Optional: Beschreibung des Dokuments..."
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={handleUpload}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={uploadFiles.length === 0}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadFiles.length} Dokument(e) hochladen
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadDialog(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kategorie-Manager Dialog */}
        {showCategoryManager && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Kategorien verwalten</h2>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowCategoryManager(false);
                      setEditingCategoryId(null);
                      setNewCategoryData({ name: '', color: 'text-gray-400' });
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {/* Neue Kategorie hinzufügen / Bearbeiten */}
                <div className="mb-8 p-6 bg-gray-700 rounded-xl border-2 border-dashed border-gray-600">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    {editingCategoryId ? 'Kategorie bearbeiten' : 'Neue Kategorie hinzufügen'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={newCategoryData.name}
                        onChange={(e) => setNewCategoryData({...newCategoryData, name: e.target.value})}
                        placeholder="z.B. Leadership"
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Farbe Auswahl als Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Farbe</label>
                      <select
                        value={newCategoryData.color}
                        onChange={(e) => setNewCategoryData({...newCategoryData, color: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em'
                        }}
                      >
                        {availableColors.map(color => (
                          <option key={color.class} value={color.class}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Vorschau */}
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
                    <p className="text-sm font-medium text-gray-300 mb-3">Vorschau:</p>
                    <div className={`inline-flex items-center px-4 py-2 rounded-lg border border-gray-600 ${newCategoryData.color}`}>
                      <span className="font-medium">{newCategoryData.name || 'Kategoriename'}</span>
                    </div>
                  </div>

                  {/* Aktions-Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={editingCategoryId ? handleUpdateCategory : handleAddCategory}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {editingCategoryId ? 'Aktualisieren' : 'Hinzufügen'}
                    </Button>
                    {editingCategoryId && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingCategoryId(null);
                          setNewCategoryData({ name: '', color: 'text-gray-400' });
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Abbrechen
                      </Button>
                    )}
                  </div>
                </div>

                {/* Bestehende Kategorien */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Bestehende Kategorien ({categories.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(category => (
                      <div key={category.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`${category.color} font-medium`}>
                            {category.name}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-400 mb-3">
                          0 Dokument(e)
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}