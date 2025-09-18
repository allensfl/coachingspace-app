
import React, { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, Plus, Star, Settings, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAppStateContext } from '@/context/AppStateContext';
import ToolCard from './toolbox/ToolCard';
import ToolDetailModal from './toolbox/ToolDetailModal';
import CreateToolDialog from './toolbox/CreateToolDialog';
import UploadToolDialog from './toolbox/UploadToolDialog';
import ManageCategoriesDialog from './toolbox/ManageCategoriesDialog';

export default function Toolbox() {
  const { state, actions } = useAppStateContext();
  const { tools, settings } = state;
  const { setTools, updateToolCategories } = actions;
  const { toolCategories } = settings;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [editingTool, setEditingTool] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const { toast } = useToast();

  const categories = useMemo(() => ['all', ...toolCategories], [toolCategories]);

  const handleSaveTool = useCallback((toolData) => {
    setTools(prev => {
      const existing = prev.find(t => t.id === toolData.id);
      if (existing) {
        toast({ title: "Tool aktualisiert", description: `${toolData.name} wurde erfolgreich bearbeitet.`, className: "bg-green-600 text-white" });
        return prev.map(t => t.id === toolData.id ? toolData : t);
      } else {
        toast({ title: "Tool gespeichert", description: `${toolData.name} wurde zur Toolbox hinzugefügt.`, className: "bg-green-600 text-white" });
        return [...prev, toolData];
      }
    });
    setEditingTool(null);
  }, [setTools, toast]);
  
  const handleEditTool = (tool) => {
    setSelectedTool(null);
    setEditingTool(tool);
    if(tool.type === 'text') setIsCreateOpen(true);
    if(tool.type === 'file') setIsUploadOpen(true);
  }
  
  const handleDeleteTool = useCallback((toolId) => {
    setTools(prev => prev.filter(t => t.id !== toolId));
    toast({ title: "Tool gelöscht", description: "Das Tool wurde erfolgreich entfernt.", variant: "destructive" });
    setSelectedTool(null);
  }, [setTools, toast]);
  
  const handleArchiveTool = useCallback((toolId) => {
    let toolName = '';
    let newStatus = '';
    setTools(prev => prev.map(t => {
      if (t.id === toolId) {
        toolName = t.name;
        newStatus = t.status === 'active' ? 'archiviert' : 'aktiviert';
        return { ...t, status: t.status === 'active' ? 'archived' : 'active' };
      }
      return t;
    }));
    toast({ title: `Tool ${newStatus}`, description: `Das Tool "${toolName}" wurde ${newStatus}.` });
    setSelectedTool(null);
  }, [setTools, toast]);

  const handleToggleFavorite = useCallback((toolId) => {
     let isFav;
     setTools(prev => prev.map(t => {
       if(t.id === toolId) {
         isFav = !t.isFavorite;
         return {...t, isFavorite: !t.isFavorite};
       }
       return t;
     }));
     toast({ title: isFav ? 'Favorit hinzugefügt' : 'Favorit entfernt', className: 'bg-blue-600 text-white' });
  }, [setTools, toast]);
  
  const handleUpdateCategories = useCallback((newCategories) => {
    updateToolCategories(newCategories);
    toast({ title: "Kategorien aktualisiert", description: "Deine Tool-Kategorien wurden gespeichert." });
  }, [updateToolCategories, toast]);

  const filteredTools = useMemo(() => (tools || []).filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tool.category === filterCategory;
    const matchesFavorite = !showFavorites || tool.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorite && tool.status === 'active';
  }), [tools, searchTerm, filterCategory, showFavorites]);

  return (
    <>
      <Helmet>
        <title>Toolbox - Coachingspace</title>
        <meta name="description" content="Entdecke professionelle Coaching-Tools und Methoden für effektive Sessions." />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Toolbox</h1>
            <p className="text-slate-400">Deine digitale Methodenbibliothek</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setIsManageCategoriesOpen(true)} variant="outline"><Settings className="mr-2 h-4 w-4" /> Kategorien</Button>
            <Button onClick={() => { setEditingTool(null); setIsCreateOpen(true); }} className="bg-blue-600 hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" /> Text-Tool</Button>
            <Button onClick={() => { setEditingTool(null); setIsUploadOpen(true); }} variant="outline"><Upload className="mr-2 h-4 w-4" /> Datei-Tool</Button>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Tools suchen..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Button onClick={() => setShowFavorites(!showFavorites)} variant={showFavorites ? "default" : "outline"} className="flex-shrink-0">
                  <Star className={`mr-2 h-4 w-4 ${showFavorites ? 'text-yellow-300' : ''}`} /> Favoriten
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button key={category} variant={filterCategory === category ? 'secondary' : 'outline'} size="sm" onClick={() => setFilterCategory(category)}>
                  {category === 'all' ? 'Alle' : category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} onCardClick={setSelectedTool} onToggleFavorite={handleToggleFavorite} />)}
          </AnimatePresence>
        </div>

        {filteredTools.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <Target className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Keine Tools gefunden</h3>
              <p className="text-slate-400">Versuche andere Suchbegriffe oder wähle eine andere Kategorie.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <ToolDetailModal tool={selectedTool} open={!!selectedTool} onOpenChange={(isOpen) => !isOpen && setSelectedTool(null)} onEdit={handleEditTool} onDelete={handleDeleteTool} onArchive={handleArchiveTool} />
      <CreateToolDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSave={handleSaveTool} categories={toolCategories} initialData={editingTool} />
      <UploadToolDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} onSave={handleSaveTool} categories={toolCategories} initialData={editingTool} />
      <ManageCategoriesDialog open={isManageCategoriesOpen} onOpenChange={setIsManageCategoriesOpen} categories={toolCategories} updateCategories={handleUpdateCategories} />
    </>
  );
}
