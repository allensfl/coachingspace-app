
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';

const ManageCategoriesDialog = ({ open, onOpenChange, categories, updateCategories }) => {
    const [localCategories, setLocalCategories] = useState(categories);

    useEffect(() => {
        if (open) {
            setLocalCategories(categories);
        }
    }, [open, categories]);

    const handleNameChange = (index, newName) => {
        setLocalCategories(cats => cats.map((cat, i) => i === index ? newName : cat));
    };

    const handleAddCategory = () => {
        setLocalCategories(cats => [...cats, "Neue Kategorie"]);
    };

    const handleDeleteCategory = (index) => {
        setLocalCategories(cats => cats.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        updateCategories(localCategories.filter(c => c.trim() !== ''));
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] glass-card">
                <DialogHeader>
                    <DialogTitle>Toolbox-Kategorien verwalten</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                    {localCategories.map((cat, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input value={cat} onChange={(e) => handleNameChange(index, e.target.value)} className="flex-grow" />
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={handleAddCategory} className="w-full mt-4"><Plus className="mr-2 h-4 w-4" /> Neue Kategorie</Button>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Abbrechen</Button></DialogClose>
                    <Button onClick={handleSave}>Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ManageCategoriesDialog;
