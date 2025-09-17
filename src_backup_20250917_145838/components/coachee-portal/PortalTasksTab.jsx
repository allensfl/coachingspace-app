import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Circle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TaskItem = ({ task, onToggle }) => {
  const priorityStyles = {
    'Niedrig': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Mittel': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Hoch': 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${task.completed ? 'bg-slate-800/30' : 'hover:bg-slate-800/50'}`}
    >
      <Button variant="ghost" size="icon" onClick={() => onToggle(task.id)} className="flex-shrink-0">
        {task.completed ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <Circle className="h-6 w-6 text-slate-500 group-hover:text-primary" />
        )}
      </Button>
      <div className="flex-grow">
        <p className={`text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
          {task.text}
        </p>
        {task.dueDate && (
          <p className="text-xs text-slate-400">
            Fällig am: {new Date(task.dueDate).toLocaleDateString('de-DE')}
          </p>
        )}
      </div>
      {task.priority && (
        <Badge className={`hidden sm:inline-flex ${priorityStyles[task.priority]}`}>
          {task.priority}
        </Badge>
      )}
    </motion.div>
  );
};

const PortalTasksTab = ({ coachee, tasks, onUpdateTasks, isDashboardVersion = false }) => {
  const coacheeTasks = (tasks || []).filter(task => task.coacheeId === coachee.id);
  const openTasks = coacheeTasks.filter(task => !task.completed);
  const completedTasks = coacheeTasks.filter(task => task.completed);

  const handleToggleTask = (taskId) => {
    const updatedTasks = (tasks || []).map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    onUpdateTasks(updatedTasks);
  };

  const cardContent = (
    <CardContent className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-3">Offene Aufgaben</h3>
        <div className="space-y-2">
          <AnimatePresence>
            {openTasks.length > 0 ? (
              openTasks.map(task => (
                <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">Super! Keine offenen Aufgaben.</p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!isDashboardVersion && completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-300 mb-3">Erledigte Aufgaben</h3>
          <div className="space-y-2">
            <AnimatePresence>
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </CardContent>
  );

  if (isDashboardVersion) {
    return (
      <Card className="bg-slate-900/50 border border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <CheckSquare className="text-primary" />
            Deine Aufgaben
          </CardTitle>
        </CardHeader>
        {cardContent}
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <CheckSquare className="text-primary" />
            Deine Aufgaben
          </CardTitle>
        </CardHeader>
        {cardContent}
      </Card>
    </motion.div>
  );
};

export default PortalTasksTab;