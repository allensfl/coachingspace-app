import React, { useState, useMemo, useRef } from 'react';
import { BookText, ChevronDown, PlusCircle, Search, Edit, Trash2, Upload, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveAs } from 'file-saver';

const PromptEditorDialog = ({ onSave, trigger, existingPrompt }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [promptText, setPromptText] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const isEditMode = !!existingPrompt;

    React.useEffect(() => {
        if (isOpen && isEditMode) {
            setTitle(existingPrompt.title);
            setCategory(existingPrompt.category);
            setPromptText(existingPrompt.prompt);
        } else if (!isEditMode) {
            setTitle('');
            setCategory('');
            setPromptText('');
        }
    }, [isOpen, existingPrompt, isEditMode]);

    const handleSave = () => {
        if (title && category && promptText) {
            const promptData = {
                ...existingPrompt,
                id: existingPrompt?.id || Date.now(),
                title,
                category,
                prompt: promptText,
            };
            onSave(promptData);
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Prompt bearbeiten' : 'Neuen Prompt erstellen'}</DialogTitle>
                    <DialogDescription>{isEditMode ? 'Passe den bestehenden Prompt an.' : 'Füge einen neuen, wiederverwendbaren Prompt zu deiner Bibliothek hinzu.'}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="prompt-title">Titel</Label>
                        <Input id="prompt-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="z.B. Ressourcenorientiertes Feedback" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prompt-category">Kategorie</Label>
                        <Input id="prompt-category" value={category} onChange={e => setCategory(e.target.value)} placeholder="z.B. Analyse" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prompt-text">Prompt-Text</Label>
                        <Textarea id="prompt-text" value={promptText} onChange={e => setPromptText(e.target.value)} placeholder="Der eigentliche Prompt-Text..." className="h-32" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Abbrechen</Button></DialogClose>
                    <Button onClick={handleSave}>{isEditMode ? 'Änderungen speichern' : 'Speichern'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const PromptLibraryPanel = ({ aiSettings, onUpdateAiSetting, onSetUserInput, toast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('title-asc');
    const [filterCategory, setFilterCategory] = useState('all');
    const importFileRef = useRef(null);

    const handleSavePrompt = (promptData) => {
        const prompts = aiSettings.prompts || [];
        const existingIndex = prompts.findIndex(p => p.id === promptData.id);
        let newPrompts;

        if (existingIndex > -1) {
            newPrompts = [...prompts];
            newPrompts[existingIndex] = promptData;
            toast({ title: 'Prompt aktualisiert!', description: 'Die Änderungen wurden gespeichert.' });
        } else {
            newPrompts = [...prompts, promptData];
            toast({ title: 'Prompt hinzugefügt!', description: 'Dein neuer Prompt ist in der Bibliothek verfügbar.' });
        }
        onUpdateAiSetting('prompts', newPrompts);
    };

    const handleDeletePrompt = (promptId) => {
        const newPrompts = (aiSettings.prompts || []).filter(p => p.id !== promptId);
        onUpdateAiSetting('prompts', newPrompts);
        toast({ title: 'Prompt gelöscht!', variant: 'destructive' });
    };

    const handleExport = () => {
        const promptsToExport = aiSettings.prompts || [];
        if (promptsToExport.length === 0) {
            toast({ title: 'Export nicht möglich', description: 'Deine Bibliothek ist leer.', variant: 'destructive' });
            return;
        }
        const blob = new Blob([JSON.stringify(promptsToExport, null, 2)], { type: 'application/json' });
        saveAs(blob, 'coachingspace_prompts.json');
        toast({ title: 'Prompts exportiert!', description: 'Deine Bibliothek wurde als JSON-Datei gespeichert.' });
    };

    const handleImportClick = () => {
        importFileRef.current.click();
    };

    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedPrompts = JSON.parse(e.target.result);
                if (!Array.isArray(importedPrompts)) {
                    throw new Error('JSON ist kein Array.');
                }

                const currentPrompts = aiSettings.prompts || [];
                const currentIds = new Set(currentPrompts.map(p => p.id));
                const newPrompts = importedPrompts.filter(p => !currentIds.has(p.id));
                
                const finalPrompts = [...currentPrompts, ...newPrompts];
                onUpdateAiSetting('prompts', finalPrompts);

                toast({
                    title: 'Import erfolgreich!',
                    description: `${newPrompts.length} neue(r) Prompt(s) hinzugefügt. ${importedPrompts.length - newPrompts.length} Duplikat(e) übersprungen.`,
                });

            } catch (error) {
                toast({ title: 'Import fehlgeschlagen', description: `Die Datei konnte nicht verarbeitet werden: ${error.message}`, variant: 'destructive' });
            }
        };
        reader.readAsText(file);
        event.target.value = null; // Reset file input
    };

    const filteredAndSortedPrompts = useMemo(() => {
        let prompts = aiSettings.prompts || [];

        if (searchTerm) {
            prompts = prompts.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.prompt.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== 'all') {
            prompts = prompts.filter(p => p.category === filterCategory);
        }

        prompts.sort((a, b) => {
            const [key, order] = sortOrder.split('-');
            if (!a[key] || !b[key]) return 0;
            const valA = a[key].toLowerCase();
            const valB = b[key].toLowerCase();
            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        });

        return prompts;
    }, [aiSettings.prompts, searchTerm, filterCategory, sortOrder]);

    const promptCategories = useMemo(() => {
        const categories = new Set((aiSettings.prompts || []).map(p => p.category).filter(Boolean));
        return ['all', ...Array.from(categories)];
    }, [aiSettings.prompts]);

    return (
        <Card className="glass-card">
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <div className="p-4 cursor-pointer flex justify-between items-center">
                  <CardTitle className="text-white flex items-center gap-2"><BookText /> Prompt-Bibliothek</CardTitle>
                  <Button variant="ghost" size="sm"><ChevronDown className="h-4 w-4" /></Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Suchen..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full sm:w-[120px]"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            {promptCategories.map(cat => <SelectItem key={cat} value={cat}>{cat === 'all' ? 'Alle' : cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-full sm:w-[120px]"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="title-asc">Titel (A-Z)</SelectItem>
                            <SelectItem value="title-desc">Titel (Z-A)</SelectItem>
                            <SelectItem value="category-asc">Kategorie (A-Z)</SelectItem>
                            <SelectItem value="category-desc">Kategorie (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                  {filteredAndSortedPrompts.map((prompt) => (
                    <div key={prompt.id} className="p-3 bg-slate-800/50 rounded-lg group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 cursor-pointer" onClick={() => onSetUserInput(prompt.prompt)}>
                            <h4 className="font-semibold text-slate-200">{prompt.title}</h4>
                            <p className="text-xs text-slate-400 mb-1">{prompt.category}</p>
                            <p className="text-sm text-slate-400 line-clamp-2">{prompt.prompt}</p>
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <PromptEditorDialog 
                                onSave={handleSavePrompt}
                                existingPrompt={prompt}
                                trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>}
                            />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Prompt wirklich löschen?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Diese Aktion kann nicht rückgängig gemacht werden. Der Prompt "{prompt.title}" wird dauerhaft gelöscht.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeletePrompt(prompt.id)} className="bg-red-600 hover:bg-red-700">Löschen</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                    <PromptEditorDialog 
                        onSave={handleSavePrompt}
                        trigger={<Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Prompt hinzufügen</Button>}
                    />
                    <Button variant="outline" size="sm" onClick={handleImportClick}><Upload className="mr-2 h-4 w-4" /> Importieren</Button>
                    <input type="file" ref={importFileRef} onChange={handleFileImport} accept=".json" style={{ display: 'none' }} />
                    <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Exportieren</Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};