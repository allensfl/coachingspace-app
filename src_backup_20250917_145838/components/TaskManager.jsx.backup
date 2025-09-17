import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isFuture, startOfToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { useAppStateContext } from '@/context/AppStateContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Trash2, Edit, Calendar as CalendarIcon, Flag } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TaskPriority } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // Import cn utility

const TaskManager = ({ isCompact = false, coacheeId = null }) => {
  const { state, actions } = useAppStateContext();
  const { tasks, coachees } = state;
  const { setTasks } = actions;
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [newPriority, setNewPriority] = useState(TaskPriority.MEDIUM);
  const [assignedCoacheeId, setAssignedCoacheeId] = useState(coacheeId ? coacheeId.toString() : 'unassigned');
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const task = { 
      id: Date.now(), 
      text: newTask, 
      completed: false, 
      dueDate: dueDate ? dueDate.toISOString() : null,
      coacheeId: assignedCoacheeId === 'unassigned' ? null : parseInt(assignedCoacheeId),
      priority: newPriority
    };
    setTasks(prevTasks => [task, ...(prevTasks || [])]);
    setNewTask('');
    setDueDate(null);
    setNewPriority(TaskPriority.MEDIUM);
    if (!coacheeId) { // Only reset coachee selection if not in coachee-specific view
      setAssignedCoacheeId('unassigned');
    }
  };

  const handleUpdateTask = () => {
    if (!editingTask || editingTask.text.trim() === '') return;
    setTasks(prevTasks => (prevTasks || []).map(task =>
      task.id === editingTask.id ? { 
        ...editingTask, 
        coacheeId: editingTask.coacheeId === 'unassigned' ? null : parseInt(editingTask.coacheeId),
        priority: editingTask.priority
      } : task
    ));
    setEditingTask(null);
  };

  const toggleTask = (taskId) => {
    setTasks(prevTasks => (prevTasks || []).map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => (prevTasks || []).filter(task => task.id !== taskId));
  };
  
  const startEditing = (task) => {
    setEditingTask({ 
      ...task, 
      dueDate: task.dueDate ? new Date(task.dueDate) : null, 
      coacheeId: task.coacheeId ? task.coacheeId.toString() : 'unassigned',
      priority: task.priority || TaskPriority.MEDIUM // Ensure priority is set
    });
  };

  const filteredTasks = useMemo(() => {
    let currentTasks = tasks || [];
    if (coacheeId) {
      currentTasks = currentTasks.filter(task => task.coacheeId === coacheeId);
    } else if (assignedCoacheeId !== 'unassigned') {
      currentTasks = currentTasks.filter(task => task.coacheeId === parseInt(assignedCoacheeId));
    }

    let sortedTasks = [...currentTasks].sort((a, b) => {
        // Sort by completion status (incomplete first)
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        
        // Then by priority (High -> Medium -> Low)
        const priorityOrder = { [TaskPriority.HIGH]: 1, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 3 };
        const pA = priorityOrder[a.priority] || 4; // Default to lowest if undefined
        const pB = priorityOrder[b.priority] || 4;
        if (pA !== pB) return pA - pB;

        // Then by due date (earliest first)
        const dateA = a.dueDate ? new Date(a.dueDate) : null;
        const dateB = b.dueDate ? new Date(b.dueDate) : null;
        if (dateA && dateB) return dateA - dateB;
        if (dateA) return -1; // tasks with date before tasks without
        if (dateB) return 1; // tasks with date before tasks without

        return b.id - a.id; // Fallback to ID for stable sort
    });

    switch (filter) {
      case 'today':
        return sortedTasks.filter(t => t.dueDate && isToday(new Date(t.dueDate)));
      case 'future':
        return sortedTasks.filter(t => t.dueDate && isFuture(new Date(t.dueDate)) && !t.completed);
      case 'no_date':
        return sortedTasks.filter(t => !t.dueDate);
      case 'completed':
        return sortedTasks.filter(t => t.completed);
      case TaskPriority.LOW:
      case TaskPriority.MEDIUM:
      case TaskPriority.HIGH:
        return sortedTasks.filter(t => t.priority === filter);
      case 'all':
      default:
        return sortedTasks;
    }
  }, [tasks, filter, coacheeId, assignedCoacheeId]);

  const getCoacheeName = (id) => {
    const coachee = coachees.find(c => c.id === id);
    return coachee ? `${coachee.firstName} ${coachee.lastName}` : 'Unzugewiesen';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case TaskPriority.HIGH: return 'bg-red-500/20 text-red-400 border-red-500/30';
      case TaskPriority.MEDIUM: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case TaskPriority.LOW: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-700/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div>
      <form onSubmit={handleAddTask} className="flex flex-wrap gap-2 mb-4 items-end">
        <div className="flex-grow">
          <Label htmlFor="newTask" className="sr-only">Neue Aufgabe</Label>
          <Input
            id="newTask"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Neue Aufgabe, Idee, Notiz..."
            className="bg-slate-800/50 border-slate-700 text-white"
          />
        </div>
        
        {!coacheeId && (
          <div className="w-full sm:w-auto flex-shrink-0">
            <Label htmlFor="assignCoachee" className="sr-only">Coachee zuweisen</Label>
            <Select onValueChange={setAssignedCoacheeId} value={assignedCoacheeId}>
              <SelectTrigger id="assignCoachee" className="w-full sm:w-[180px] bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder="Coachee zuweisen" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="unassigned">Keinem Coachee zuweisen</SelectItem>
                {coachees.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.firstName} {c.lastName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full sm:w-[150px] justify-start text-left font-normal ${!dueDate && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'dd.MM.yyyy') : <span>Datum</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                locale={de}
              />
            </PopoverContent>
          </Popover>

          <Select onValueChange={setNewPriority} value={newPriority}>
            <SelectTrigger className="w-full sm:w-[150px] bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Priorität" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value={TaskPriority.HIGH}>Dringend</SelectItem>
              <SelectItem value={TaskPriority.MEDIUM}>Mittel</SelectItem>
              <SelectItem value={TaskPriority.LOW}>Niedrig</SelectItem>
            </SelectContent>
          </Select>

        <Button type="submit" size="icon" className="w-full sm:w-auto"><Plus /></Button>
      </form>

      <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2 flex-wrap">
        <Button variant={filter === 'all' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('all')}>Alle</Button>
        <Button variant={filter === 'today' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('today')}>Heute</Button>
        <Button variant={filter === 'future' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('future')}>Zukünftig</Button>
        <Button variant={filter === 'no_date' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('no_date')}>Ohne Datum</Button>
        <Button variant={filter === 'completed' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('completed')}>Erledigt</Button>
        <Button variant={filter === TaskPriority.HIGH ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter(TaskPriority.HIGH)}>Dringend</Button>
        <Button variant={filter === TaskPriority.MEDIUM ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter(TaskPriority.MEDIUM)}>Mittel</Button>
        <Button variant={filter === TaskPriority.LOW ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter(TaskPriority.LOW)}>Niedrig</Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        <AnimatePresence>
          {filteredTasks && filteredTasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800/50"
            >
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              {editingTask?.id === task.id ? (
                <div className="flex-1 flex flex-wrap gap-2 items-end">
                  <div className="flex-grow">
                    <Input 
                      value={editingTask.text} 
                      onChange={(e) => setEditingTask({...editingTask, text: e.target.value})}
                      className="bg-slate-800/50 border-slate-700 text-white"
                      autoFocus
                    />
                  </div>
                  {!coacheeId && (
                    <div className="w-full sm:w-auto flex-shrink-0">
                      <Select onValueChange={(value) => setEditingTask({...editingTask, coacheeId: value})} value={editingTask.coacheeId}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-slate-800/50 border-slate-700 text-white">
                          <SelectValue placeholder="Coachee zuweisen" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          <SelectItem value="unassigned">Keinem Coachee zuweisen</SelectItem>
                          {coachees.map(c => (
                            <SelectItem key={c.id} value={String(c.id)}>{c.firstName} {c.lastName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full sm:w-[150px]">
                              {editingTask.dueDate ? format(editingTask.dueDate, 'dd.MM.yyyy') : 'Datum'}
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                          <Calendar
                              mode="single"
                              selected={editingTask.dueDate}
                              onSelect={(date) => setEditingTask({...editingTask, dueDate: date})}
                              locale={de}
                          />
                      </PopoverContent>
                  </Popover>
                  <Select onValueChange={(value) => setEditingTask({...editingTask, priority: value})} value={editingTask.priority}>
                    <SelectTrigger className="w-full sm:w-[150px] bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Priorität" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value={TaskPriority.HIGH}>Dringend</SelectItem>
                      <SelectItem value={TaskPriority.MEDIUM}>Mittel</SelectItem>
                      <SelectItem value={TaskPriority.LOW}>Niedrig</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleUpdateTask} className="w-full sm:w-auto">Speichern</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingTask(null)} className="w-full sm:w-auto">Abbrechen</Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-sm cursor-pointer ${task.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}
                    >
                      {task.text}
                    </label>
                    {task.dueDate && (
                      <p className={`text-xs ${isToday(new Date(task.dueDate)) ? 'text-primary' : 'text-slate-500'}`}>
                          Fällig: {format(new Date(task.dueDate), 'dd. MMM yyyy', { locale: de })}
                      </p>
                    )}
                    {task.coacheeId && !coacheeId && ( // Show coachee name only if not in coachee-specific view
                      <p className="text-xs text-slate-600">
                        Coachee: {getCoacheeName(task.coacheeId)}
                      </p>
                    )}
                    {task.priority && (
                        <Badge variant="secondary" className={cn("mt-1", getPriorityColor(task.priority))}>
                            <Flag className="h-3 w-3 mr-1" /> {task.priority === TaskPriority.HIGH ? 'Dringend' : task.priority === TaskPriority.MEDIUM ? 'Mittel' : 'Niedrig'}
                        </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => startEditing(task)} className="text-slate-500 hover:text-primary">
                      <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
         {filteredTasks.length === 0 && (
           <p className="text-center text-slate-500 py-4">Keine Aufgaben in dieser Ansicht.</p>
         )}
      </div>
    </div>
  );
};

export default TaskManager;