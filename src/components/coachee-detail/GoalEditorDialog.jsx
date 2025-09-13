import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

const GoalEditorDialog = ({ goal, isOpen, onOpenChange, onSave }) => {
  const [editedGoal, setEditedGoal] = useState(goal);

  useEffect(() => {
    setEditedGoal(goal);
  }, [goal]);

  if (!editedGoal) return null;

  const handleFieldChange = (field, value) => {
    setEditedGoal(prev => ({ ...prev, [field]: value }));
  };

  const handleSubGoalChange = (index, value) => {
    const newSubGoals = [...editedGoal.subGoals];
    newSubGoals[index] = { ...newSubGoals[index], title: value };
    setEditedGoal(prev => ({ ...prev, subGoals: newSubGoals }));
  };
  
  const addSubGoal = () => {
    setEditedGoal(prev => ({
      ...prev,
      subGoals: [...prev.subGoals, { id: `sg_${Date.now()}`, title: '', completed: false }],
    }));
  };

  const removeSubGoal = (index) => {
    const newSubGoals = editedGoal.subGoals.filter((_, i) => i !== index);
    setEditedGoal(prev => ({ ...prev, subGoals: newSubGoals }));
  };

  const handleSave = () => {
    onSave(editedGoal);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] glass-card">
        <DialogHeader>
          <DialogTitle>{editedGoal.id.startsWith('new_') ? 'Neues Ziel hinzufügen' : 'Ziel bearbeiten'}</DialogTitle>
          <DialogDescription>Definiere das Hauptziel und die dazugehörigen Sub-Ziele.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Titel des Ziels</Label>
            <Input 
              id="goal-title"
              placeholder="Titel des Ziels" 
              value={editedGoal.title} 
              onChange={(e) => handleFieldChange('title', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-description">Beschreibung</Label>
            <Textarea 
              id="goal-description"
              placeholder="Beschreibung" 
              value={editedGoal.description} 
              onChange={(e) => handleFieldChange('description', e.target.value)}
            />
          </div>
          <h4 className="font-semibold text-sm pt-2">Sub-Ziele</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {editedGoal.subGoals.map((sg, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input 
                  placeholder={`Sub-Ziel ${index + 1}`}
                  value={sg.title} 
                  onChange={(e) => handleSubGoalChange(index, e.target.value)}
                  className="flex-grow"
                />
                <Button variant="ghost" size="icon" onClick={() => removeSubGoal(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={addSubGoal}><Plus className="mr-2 h-4 w-4" /> Sub-Ziel hinzufügen</Button>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="secondary">Abbrechen</Button></DialogClose>
          <Button onClick={handleSave}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoalEditorDialog;