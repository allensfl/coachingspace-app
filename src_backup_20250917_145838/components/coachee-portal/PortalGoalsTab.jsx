import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Target, Trophy, Plus, Edit, Trash2 } from 'lucide-react';

const GoalEditorDialog = ({ goal, isOpen, onOpenChange, onSave, coacheeId }) => {
  const [editedGoal, setEditedGoal] = useState(goal);

  React.useEffect(() => {
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
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>{editedGoal.id.startsWith('new_') ? 'Neues Ziel hinzufügen' : 'Ziel bearbeiten'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input 
            placeholder="Titel des Ziels" 
            value={editedGoal.title} 
            onChange={(e) => handleFieldChange('title', e.target.value)} 
            className="text-white"
          />
          <Textarea 
            placeholder="Beschreibung" 
            value={editedGoal.description} 
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="text-white"
          />
          <h4 className="font-semibold text-sm pt-2">Sub-Ziele</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {editedGoal.subGoals.map((sg, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input 
                  placeholder={`Sub-Ziel ${index + 1}`}
                  value={sg.title} 
                  onChange={(e) => handleSubGoalChange(index, e.target.value)}
                  className="flex-grow text-white"
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

const PortalGoalsTab = ({ coachee, updateCoacheeData }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);

  const toggleSubGoal = (goalId, subGoalId) => {
    const updatedGoals = coachee.goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          subGoals: goal.subGoals.map(sg => sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg)
        };
      }
      return goal;
    });
    updateCoacheeData({ goals: updatedGoals });
  };

  const handleAddNewGoal = () => {
    setCurrentGoal({
      id: `new_${Date.now()}`,
      title: '',
      description: '',
      subGoals: [],
      status: 'In Progress',
    });
    setIsEditorOpen(true);
  };
  
  const handleEditGoal = (goal) => {
    setCurrentGoal(goal);
    setIsEditorOpen(true);
  };

  const handleDeleteGoal = (goalId) => {
    const updatedGoals = coachee.goals.filter(goal => goal.id !== goalId);
    updateCoacheeData({ goals: updatedGoals });
  };

  const handleSaveGoal = (goalToSave) => {
    const existingGoals = coachee.goals || [];
    let updatedGoals;

    if (goalToSave.id.startsWith('new_')) {
      const newGoal = { ...goalToSave, id: `g_${Date.now()}`};
      updatedGoals = [...existingGoals, newGoal];
    } else {
      updatedGoals = existingGoals.map(g => (g.id === goalToSave.id ? goalToSave : g));
    }
    updateCoacheeData({ goals: updatedGoals });
  };

  return (
    <div className="space-y-6">
      <div className="text-right">
        <Button onClick={handleAddNewGoal}><Plus className="mr-2 h-4 w-4"/>Neues Ziel hinzufügen</Button>
      </div>

      {(coachee.goals || []).map(goal => (
        <Card key={goal.id} className="bg-slate-900/50 border border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Target/> {goal.title}</span>
              <div className="flex items-center gap-2">
                {goal.subGoals.every(sg => sg.completed) && <Badge className="bg-green-500/20 text-green-300 border-green-500/30 hidden sm:flex items-center"><Trophy className="mr-2 h-4 w-4"/>Erreicht!</Badge>}
                <Button variant="ghost" size="icon" onClick={() => handleEditGoal(goal)}><Edit className="h-4 w-4"/></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500"/></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bist du sicher?</AlertDialogTitle>
                      <AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden. Das Ziel wird dauerhaft gelöscht.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteGoal(goal.id)} className="bg-red-600 hover:bg-red-700">Löschen</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
            <CardDescription>{goal.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {goal.subGoals.map(sg => (
                <div key={sg.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800/50">
                  <Checkbox id={`subgoal-${sg.id}`} checked={sg.completed} onCheckedChange={() => toggleSubGoal(goal.id, sg.id)} />
                  <label htmlFor={`subgoal-${sg.id}`} className={`flex-1 text-sm ${sg.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>{sg.title}</label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {currentGoal && (
        <GoalEditorDialog 
          goal={currentGoal}
          isOpen={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          onSave={handleSaveGoal}
          coacheeId={coachee.id}
        />
      )}
    </div>
  );
};

export default PortalGoalsTab;