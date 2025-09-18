import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Edit, Trash2, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function GoalsCard({ coachee, isEditing, onToggleGoal, onDeleteGoal, onAddGoal, onEditGoal }) {
  
  const handleAddNewGoal = () => {
    const newGoal = {
      id: `new_${Date.now()}`,
      title: 'Neues Ziel',
      description: '',
      subGoals: [],
      status: 'In Progress',
    };
    onEditGoal(newGoal);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-primary flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Ziele
            </CardTitle>
            <CardDescription>Verfolge die Haupt- und Teilziele deines Coachees.</CardDescription>
          </div>
          {isEditing && (
            <Button variant="outline" onClick={handleAddNewGoal}>
              <Plus className="mr-2 h-4 w-4" />
              Ziel hinzufügen
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {coachee.goals && coachee.goals.length > 0 ? (
            coachee.goals.map((goal) => (
              <div key={goal.id} className="p-4 rounded-lg bg-slate-800/50 group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-white">{goal.title}</h4>
                    <p className="text-sm text-slate-400">{goal.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {goal.subGoals.every(sg => sg.completed) && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 hidden sm:flex items-center">
                        <Trophy className="mr-2 h-4 w-4"/>Erreicht!
                      </Badge>
                    )}
                    {isEditing && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => onEditGoal(goal)}><Edit className="h-4 w-4"/></Button>
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
                              <AlertDialogAction onClick={() => onDeleteGoal(goal.id)} className="bg-red-600 hover:bg-red-700">Löschen</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {goal.subGoals.map(sg => (
                    <div key={sg.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50">
                      <Checkbox 
                        id={`subgoal-${sg.id}`} 
                        checked={sg.completed} 
                        onCheckedChange={() => isEditing && onToggleGoal(goal.id, sg.id)}
                        disabled={!isEditing}
                      />
                      <label htmlFor={`subgoal-${sg.id}`} className={`flex-1 text-sm ${sg.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>{sg.title}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">Keine Ziele definiert.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}