import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  Copy,
  Star,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import { sessionNoteTemplates } from '@/data/sessionNoteTemplates';

const TEMPLATE_CATEGORIES = [
  'Erstgespräch',
  'Zielarbeit', 
  'Zwischenbilanz',
  'Abschlussgespräch',
  'Reflexion',
  'Sonstige'
];

const TemplateManager = ({ 
  isOpen, 
  onClose, 
  userTemplates, 
  setUserTemplates,
  onTemplateSelect,
  currentNoteContent = ''
}) => {
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const { toast } = useToast();

  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    category: 'Sonstige',
    isUserTemplate: true
  });

  // Alle Templates kombinieren (Standard + User)
  const allTemplates = [
    ...sessionNoteTemplates.map(t => ({...t, isUserTemplate: false})),
    ...userTemplates
  ];

  const filteredTemplates = allTemplates.filter(template => 
    selectedCategory === 'Alle' || template.category === selectedCategory
  );

  const handleCreateFromCurrent = () => {
    if (!currentNoteContent.trim()) {
      toast({
        title: "Keine Inhalte",
        description: "Die aktuelle Notiz ist leer. Bitte füge Inhalte hinzu.",
        variant: "destructive"
      });
      return;
    }
    
    setNewTemplate({
      title: 'Neue Vorlage',
      content: currentNoteContent,
      category: 'Sonstige',
      isUserTemplate: true
    });
    setShowCreateForm(true);
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.title.trim() || !newTemplate.content.trim()) {
      toast({
        title: "Unvollständige Angaben",
        description: "Bitte Titel und Inhalt ausfüllen.",
        variant: "destructive"
      });
      return;
    }

    const template = {
      id: `user_${Date.now()}`,
      title: newTemplate.title.trim(),
      content: newTemplate.content.trim(),
      category: newTemplate.category,
      isUserTemplate: true,
      createdAt: new Date().toISOString()
    };

    setUserTemplates(prev => [...prev, template]);
    
    toast({
      title: "Vorlage erstellt",
      description: `"${template.title}" wurde erfolgreich gespeichert.`
    });

    setNewTemplate({ title: '', content: '', category: 'Sonstige', isUserTemplate: true });
    setShowCreateForm(false);
  };

  const handleEditTemplate = (template) => {
    if (!template.isUserTemplate) {
      toast({
        title: "Nicht bearbeitbar",
        description: "Standard-Vorlagen können nicht bearbeitet werden.",
        variant: "destructive"
      });
      return;
    }
    setEditingTemplate({...template});
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate.title.trim() || !editingTemplate.content.trim()) {
      toast({
        title: "Unvollständige Angaben", 
        description: "Bitte Titel und Inhalt ausfüllen.",
        variant: "destructive"
      });
      return;
    }

    setUserTemplates(prev => 
      prev.map(t => t.id === editingTemplate.id ? editingTemplate : t)
    );

    toast({
      title: "Vorlage aktualisiert",
      description: `"${editingTemplate.title}" wurde erfolgreich gespeichert.`
    });

    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId) => {
    setUserTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Vorlage gelöscht",
      description: "Die Vorlage wurde erfolgreich entfernt.",
      variant: "destructive"
    });
  };

  const handleUseTemplate = (template) => {
    onTemplateSelect(template);
    toast({
      title: "Vorlage angewendet",
      description: `"${template.title}" wurde zum Inhalt hinzugefügt.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-6 h-6" />
            Vorlagen verwalten
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Kategorie:</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alle">Alle</SelectItem>
                  {TEMPLATE_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCreateFromCurrent}
                disabled={!currentNoteContent.trim()}
              >
                <Copy className="w-4 h-4 mr-1" />
                Aus aktueller Notiz
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Neue Vorlage
              </Button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  <Card className="glass-card hover:bg-slate-800/50 transition-all h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2 text-white">
                            {template.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant="secondary" 
                              className={template.isUserTemplate ? "bg-blue-600" : "bg-slate-600"}
                            >
                              {template.category}
                            </Badge>
                            {!template.isUserTemplate && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Standard
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <p className="text-slate-400 text-sm line-clamp-3">
                          {template.content.substring(0, 150)}...
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-primary hover:bg-primary/80"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Verwenden
                        </Button>
                        
                        {template.isUserTemplate && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditTemplate(template)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-400">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Vorlage löschen?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Diese Aktion kann nicht rückgängig gemacht werden. Die Vorlage "{template.title}" wird dauerhaft gelöscht.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Löschen
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Keine Vorlagen gefunden</h3>
                  <p className="text-slate-400">
                    Erstelle deine erste eigene Vorlage, um zu beginnen.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

        </div>

        {/* Create/Edit Template Modal */}
        <AnimatePresence>
          {(showCreateForm || editingTemplate) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden"
              >
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      {editingTemplate ? 'Vorlage bearbeiten' : 'Neue Vorlage erstellen'}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingTemplate(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-title">Titel</Label>
                      <Input
                        id="template-title"
                        value={editingTemplate ? editingTemplate.title : newTemplate.title}
                        onChange={(e) => {
                          if (editingTemplate) {
                            setEditingTemplate(prev => ({...prev, title: e.target.value}));
                          } else {
                            setNewTemplate(prev => ({...prev, title: e.target.value}));
                          }
                        }}
                        placeholder="z.B. Meine Standard-Nachbesprechung"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="template-category">Kategorie</Label>
                      <Select 
                        value={editingTemplate ? editingTemplate.category : newTemplate.category}
                        onValueChange={(value) => {
                          if (editingTemplate) {
                            setEditingTemplate(prev => ({...prev, category: value}));
                          } else {
                            setNewTemplate(prev => ({...prev, category: value}));
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TEMPLATE_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-content">Inhalt (Markdown unterstützt)</Label>
                    <Textarea
                      id="template-content"
                      value={editingTemplate ? editingTemplate.content : newTemplate.content}
                      onChange={(e) => {
                        if (editingTemplate) {
                          setEditingTemplate(prev => ({...prev, content: e.target.value}));
                        } else {
                          setNewTemplate(prev => ({...prev, content: e.target.value}));
                        }
                      }}
                      placeholder="# Vorlage Inhalt

## Gesprächsnotizen
- 

## Nächste Schritte
- 

## Erkenntnisse
- "
                      className="min-h-[200px] font-mono"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-slate-700 flex justify-end gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingTemplate(null);
                    }}
                  >
                    Abbrechen
                  </Button>
                  <Button onClick={editingTemplate ? handleUpdateTemplate : handleSaveTemplate}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingTemplate ? 'Aktualisieren' : 'Erstellen'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </DialogContent>
    </Dialog>
  );
};

export default TemplateManager;