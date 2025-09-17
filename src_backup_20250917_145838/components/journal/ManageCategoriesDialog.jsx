import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, Palette } from 'lucide-react';

const ManageCategoriesDialog = ({ open, onOpenChange, categories, updateCategories }) => {
    const [localCategories, setLocalCategories] = useState([]);

    useEffect(() => {
        if(open) {
            setLocalCategories(categories || []);
        }
    }, [categories, open]);

    const handleNameChange = (id, newName) => {
        setLocalCategories(cats => cats.map(cat => cat.id === id ? { ...cat, name: newName } : cat));
    };

    const handleColorChange = (id, newColor) => {
        setLocalCategories(cats => cats.map(cat => cat.id === id ? { ...cat, color: newColor } : cat));
    };

    const handleAddCategory = () => {
        const newCategory = { id: `new_${Date.now()}`, name: "Neue Kategorie", color: "#64748b" };
        setLocalCategories(cats => [...cats, newCategory]);
    };

    const handleDeleteCategory = (id) => {
        setLocalCategories(cats => cats.filter(cat => cat.id !== id));
    };

    const handleSave = () => {
        updateCategories(localCategories);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] glass-card">
                <DialogHeader>
                    <DialogTitle>Journal-Kategorien verwalten</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                    {localCategories.map(cat => (
                        <div key={cat.id} className="flex items-center gap-2">
                            <div className="relative">
                                <Input type="color" value={cat.color} onChange={(e) => handleColorChange(cat.id, e.target.value)} className="w-10 h-10 p-1 border-0 cursor-pointer" style={{'WebkitAppearance': 'none', 'MozAppearance': 'none', 'appearance': 'none'}}/>
                                <Palette className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
                            </div>
                            <Input value={cat.name} onChange={(e) => handleNameChange(cat.id, e.target.value)} className="flex-grow" />
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={handleAddCategory} className="w-full mt-4"><Plus className="mr-2 h-4 w-4" /> Neue Kategorie</Button>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Abbrechen</Button></DialogClose>
                    <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ManageCategoriesDialog;