import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '../../supabaseConfig.js';
import {
  Plus, Trash2, Calendar, Clock, Upload, Download, CheckSquare,
  AlertTriangle, Target, FileText
} from 'lucide-react';

const toast = {
  success: (message) => alert(`✅ ${message}`),
  error: (message) => alert(`❌ ${message}`)
};

// Dark Mode Styles
const inputStyle = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  borderColor: 'rgb(71, 85, 105)',
  color: 'rgb(226, 232, 240)'
};

const selectStyle = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  borderColor: 'rgb(71, 85, 105)',
  color: 'rgb(226, 232, 240)',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.5rem',
  width: '100%',
  border: '1px solid rgb(71, 85, 105)'
};

const textareaStyle = {
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  borderColor: 'rgb(71, 85, 105)',
  color: 'rgb(226, 232, 240)'
};

const TasksTab = ({ coachee, supabaseTasks }) => {
  const [localTasks, setLocalTasks] = useState([]);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [activeDialogTab, setActiveDialogTab] = useState('details');
  const [availableTools, setAvailableTools] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: [],
    status: 'open',
    estimatedTime: '',
    notes: '',
    subtasks: [],
    attachments: [],
    attachedTools: [],
    recurring: {
      enabled: false,
      frequency: 'weekly',
      interval: 1
    },
    reminder: {
      enabled: false,
      daysBefore: 1
    },
    linkedGoalId: null
  });
  const [newSubtask, setNewSubtask] = useState('');
  const [availableTags] = useState([
    'Beruflich', 'Persönlich', 'Gesundheit', 'Lernen', 
    'Finanzen', 'Familie', 'Hobbies', 'Dringend'
  ]);

  const isSupabaseCoachee = typeof coachee.id === 'string' && coachee.id.includes('-');

  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const myTasks = allTasks.filter(t => t.assignedTo === coachee.id);
    setLocalTasks(myTasks);
  }, [coachee.id]);

  useEffect(() => {
    const loadTools = async () => {
      try {
        const { data: tools, error } = await supabase
          .from('tools')
          .select('*')
          .in('type', ['file', 'text'])
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          return;
        }

        setAvailableTools(tools || []);
      } catch (error) {
        console.error('Error loading tools:', error);
      }
    };

    loadTools();
  }, []);

  const handleTaskFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`Datei ${file.name} ist zu groß (max. 10MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          content: e.target.result,
          uploadedAt: new Date().toISOString()
        };
        
        setTaskForm(prev => ({
          ...prev,
          attachments: [...prev.attachments, newAttachment]
        }));
      };
      
      reader.readAsDataURL(file);
    });
    
    event.target.value = '';
  };

  const removeTaskAttachment = (attachmentId) => {
    setTaskForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachmentId)
    }));
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const subtask = {
      id: Date.now(),
      text: newSubtask,
      completed: false
    };
    
    setTaskForm(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, subtask]
    }));
    setNewSubtask('');
  };

  const toggleSubtask = (subtaskId) => {
    setTaskForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    }));
  };

  const removeSubtask = (subtaskId) => {
    setTaskForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
    }));
  };

  const toggleTag = (tag) => {
    setTaskForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const toggleTool = (toolId) => {
    setTaskForm(prev => ({
      ...prev,
      attachedTools: prev.attachedTools.includes(toolId)
        ? prev.attachedTools.filter(id => id !== toolId)
        : [...prev.attachedTools, toolId]
    }));
  };

  const resetTaskDialog = () => {
    setShowTaskDialog(false);
    setActiveDialogTab('details');
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      tags: [],
      status: 'open',
      estimatedTime: '',
      notes: '',
      subtasks: [],
      attachments: [],
      attachedTools: [],
      recurring: {
        enabled: false,
        frequency: 'weekly',
        interval: 1
      },
      reminder: {
        enabled: false,
        daysBefore: 1
      },
      linkedGoalId: null
    });
    setNewSubtask('');
  };

  const handleTaskSave = async () => {
    if (!taskForm.title || !taskForm.dueDate) {
      toast.error('Bitte Titel und Fälligkeitsdatum angeben');
      return;
    }

    try {
      if (isSupabaseCoachee) {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            title: taskForm.title,
            description: taskForm.description,
            due_date: taskForm.dueDate,
            coachee_id: coachee.id,
            completed: false,
            priority: taskForm.priority,
            status: taskForm.status,
            tags: taskForm.tags,
            estimated_time: taskForm.estimatedTime,
            notes: taskForm.notes,
            subtasks: taskForm.subtasks,
            attachments: taskForm.attachments,
            attached_tools: taskForm.attachedTools,
            recurring: taskForm.recurring,
            reminder: taskForm.reminder,
            linked_goal_id: taskForm.linkedGoalId
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          toast.error('Task konnte nicht gespeichert werden');
          return;
        }

        toast.success('Task erfolgreich erstellt');
        resetTaskDialog();
        window.location.reload();
      } else {
        const newTask = {
          id: Date.now(),
          title: taskForm.title,
          description: taskForm.description,
          dueDate: taskForm.dueDate,
          assignedTo: coachee.id,
          completed: false,
          priority: taskForm.priority,
          status: taskForm.status,
          tags: taskForm.tags,
          estimatedTime: taskForm.estimatedTime,
          notes: taskForm.notes,
          subtasks: taskForm.subtasks,
          attachments: taskForm.attachments,
          attachedTools: taskForm.attachedTools,
          recurring: taskForm.recurring,
          reminder: taskForm.reminder,
          linkedGoalId: taskForm.linkedGoalId,
          createdAt: new Date().toISOString()
        };

        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        allTasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(allTasks));

        setLocalTasks(prev => [...prev, newTask]);
        toast.success('Task erfolgreich erstellt');
        resetTaskDialog();
      }
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Task konnte nicht gespeichert werden');
    }
  };

  const handleDeleteTask = async (taskId, isSupabaseTask) => {
    if (!confirm('Aufgabe wirklich löschen?')) return;

    try {
      if (isSupabaseTask) {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId);

        if (error) {
          toast.error('Fehler beim Löschen');
          return;
        }
        
        toast.success('Task gelöscht');
        window.location.reload();
      } else {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const filtered = allTasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(filtered));
        setLocalTasks(filtered.filter(t => t.assignedTo === coachee.id));
        toast.success('Task gelöscht');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Fehler beim Löschen');
    }
  };

  const coacheeGoals = coachee.goals || [];
  
  const allTasks = [
    ...localTasks.map(t => ({ 
      ...t, 
      isSupabaseTask: false,
      due_date: t.dueDate
    })),
    ...supabaseTasks.map(t => ({ ...t, isSupabaseTask: true }))
  ];
  
  const openTasks = allTasks.filter(t => !t.completed);
  const completedTasks = allTasks.filter(t => t.completed);

  const renderTaskDialog = () => {
    if (!showTaskDialog) return null;

    const tabs = [
      { id: 'details', label: 'Details', icon: '📝' },
      { id: 'extended', label: 'Erweitert', icon: '⚙️' },
      { id: 'files', label: 'Dateien', icon: '📎' },
      { id: 'subtasks', label: 'Subtasks', icon: '✓' },
      { id: 'tools', label: 'Tools', icon: '🛠️' }
    ];

    return (
      <Dialog open={showTaskDialog} onOpenChange={resetTaskDialog}>
        <DialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-200">
              Neue Aufgabe für {coachee.firstName} {coachee.lastName}
              {!isSupabaseCoachee && (
                <span className="text-xs text-slate-400 ml-2">(localStorage)</span>
              )}
            </DialogTitle>
            
            <div className="flex space-x-2 mt-4 border-b border-slate-600">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDialogTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeDialogTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {activeDialogTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Titel *</label>
                  <Input
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="Aufgabentitel..."
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Beschreibung</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    placeholder="Details zur Aufgabe..."
                    className="w-full p-3 rounded-lg resize-none"
                    style={textareaStyle}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Priorität</label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      style={selectStyle}
                    >
                      <option value="low">Niedrig</option>
                      <option value="medium">Mittel</option>
                      <option value="high">Hoch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Fälligkeitsdatum *</label>
                    <Input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
                    <select
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                      style={selectStyle}
                    >
                      <option value="open">Offen</option>
                      <option value="in_progress">In Arbeit</option>
                      <option value="blocked">Blockiert</option>
                      <option value="done">Erledigt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Geschätzter Aufwand</label>
                    <select
                      value={taskForm.estimatedTime}
                      onChange={(e) => setTaskForm({ ...taskForm, estimatedTime: e.target.value })}
                      style={selectStyle}
                    >
                      <option value="">Keine Angabe</option>
                      <option value="15min">15 Minuten</option>
                      <option value="30min">30 Minuten</option>
                      <option value="1h">1 Stunde</option>
                      <option value="2h">2 Stunden</option>
                      <option value="4h">4 Stunden</option>
                      <option value="1d">1 Tag</option>
                      <option value="2d">2-3 Tage</option>
                      <option value="1w">1 Woche</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeDialogTab === 'extended' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Tags / Kategorien</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`cursor-pointer transition-colors ${
                          taskForm.tags.includes(tag)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'text-slate-400 border-slate-600 hover:border-blue-400'
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Notizen</label>
                  <textarea
                    value={taskForm.notes}
                    onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                    placeholder="Private Notizen..."
                    className="w-full p-3 rounded-lg resize-none"
                    style={textareaStyle}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Mit Ziel verknüpfen</label>
                  <select
                    value={taskForm.linkedGoalId || ''}
                    onChange={(e) => setTaskForm({ ...taskForm, linkedGoalId: e.target.value || null })}
                    style={selectStyle}
                  >
                    <option value="">Kein Ziel</option>
                    {coacheeGoals.map(goal => (
                      <option key={goal.id} value={goal.id}>
                        {goal.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <label className="flex items-center space-x-2 text-slate-200 mb-3">
                    <input
                      type="checkbox"
                      checked={taskForm.recurring.enabled}
                      onChange={(e) => setTaskForm({
                        ...taskForm,
                        recurring: { ...taskForm.recurring, enabled: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium">Wiederkehrende Aufgabe</span>
                  </label>
                  
                  {taskForm.recurring.enabled && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Frequenz</label>
                        <select
                          value={taskForm.recurring.frequency}
                          onChange={(e) => setTaskForm({
                            ...taskForm,
                            recurring: { ...taskForm.recurring, frequency: e.target.value }
                          })}
                          style={selectStyle}
                        >
                          <option value="daily">Täglich</option>
                          <option value="weekly">Wöchentlich</option>
                          <option value="monthly">Monatlich</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Intervall</label>
                        <Input
                          type="number"
                          min="1"
                          value={taskForm.recurring.interval}
                          onChange={(e) => setTaskForm({
                            ...taskForm,
                            recurring: { ...taskForm.recurring, interval: parseInt(e.target.value) || 1 }
                          })}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-600 pt-4">
                  <label className="flex items-center space-x-2 text-slate-200 mb-3">
                    <input
                      type="checkbox"
                      checked={taskForm.reminder.enabled}
                      onChange={(e) => setTaskForm({
                        ...taskForm,
                        reminder: { ...taskForm.reminder, enabled: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium">Erinnerung aktivieren</span>
                  </label>
                  
                  {taskForm.reminder.enabled && (
                    <div className="ml-6">
                      <label className="block text-xs text-slate-400 mb-1">Tage vor Fälligkeit</label>
                      <Input
                        type="number"
                        min="0"
                        value={taskForm.reminder.daysBefore}
                        onChange={(e) => setTaskForm({
                          ...taskForm,
                          reminder: { ...taskForm.reminder, daysBefore: parseInt(e.target.value) || 0 }
                        })}
                        style={{...inputStyle, width: '8rem'}}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeDialogTab === 'files' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">Dateien hinzufügen</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleTaskFileUpload}
                    className="hidden"
                    id="task-file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg,.xlsx,.xls"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('task-file-upload').click()}
                  >
                    Dateien auswählen
                  </Button>
                  <p className="text-slate-500 text-xs mt-2">Max. 10MB pro Datei</p>
                </div>

                {taskForm.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-200">
                      Angehängte Dateien ({taskForm.attachments.length})
                    </h4>
                    {taskForm.attachments.map(attachment => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Upload className="h-4 w-4 text-blue-400" />
                          <div>
                            <p className="text-slate-200 text-sm">{attachment.name}</p>
                            <p className="text-slate-400 text-xs">
                              {(attachment.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTaskAttachment(attachment.id)}
                          className="text-red-400 border-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeDialogTab === 'subtasks' && (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Neue Teilaufgabe..."
                    style={inputStyle}
                    onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                  />
                  <Button 
                    onClick={addSubtask}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!newSubtask.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {taskForm.subtasks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-200">
                      Teilaufgaben ({taskForm.subtasks.filter(st => st.completed).length}/{taskForm.subtasks.length})
                    </h4>
                    {taskForm.subtasks.map(subtask => (
                      <div
                        key={subtask.id}
                        className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleSubtask(subtask.id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className={`flex-1 text-sm ${
                          subtask.completed ? 'text-slate-400 line-through' : 'text-slate-200'
                        }`}>
                          {subtask.text}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeSubtask(subtask.id)}
                          className="text-red-400 border-red-400 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeDialogTab === 'tools' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Tools aus Ihrer Toolbox anhängen
                  </label>
                  <p className="text-xs text-slate-400 mb-4">
                    Wählen Sie PDFs oder Text-Tools aus, die der Coachee bei dieser Aufgabe nutzen soll.
                  </p>
                </div>

                {availableTools.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="text-slate-400 text-sm">
                      Keine Tools verfügbar. Erstellen Sie zuerst Tools in der Toolbox.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {availableTools.map(tool => (
                      <div
                        key={tool.id}
                        onClick={() => toggleTool(tool.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          taskForm.attachedTools.includes(tool.id)
                            ? 'bg-blue-600/20 border-blue-600'
                            : 'bg-slate-800/30 border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`p-2 rounded ${
                              taskForm.attachedTools.includes(tool.id)
                                ? 'bg-blue-600'
                                : 'bg-slate-700'
                            }`}>
                              {tool.type === 'file' ? (
                                <Upload className="h-4 w-4 text-white" />
                              ) : (
                                <FileText className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium mb-1 ${
                                taskForm.attachedTools.includes(tool.id)
                                  ? 'text-blue-200'
                                  : 'text-slate-200'
                              }`}>
                                {tool.title}
                              </h4>
                              {tool.description && (
                                <p className="text-xs text-slate-400 mb-2">
                                  {tool.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant="outline" className="text-xs">
                                  {tool.category}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${
                                  tool.type === 'file'
                                    ? 'text-orange-400 border-orange-400'
                                    : 'text-green-400 border-green-400'
                                }`}>
                                  {tool.type === 'file' ? 'PDF/Datei' : 'Text-Tool'}
                                </Badge>
                                {tool.file_name && (
                                  <span className="text-slate-500">{tool.file_name}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={`ml-2 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                            taskForm.attachedTools.includes(tool.id)
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-slate-600'
                          }`}>
                            {taskForm.attachedTools.includes(tool.id) && (
                              <CheckSquare className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-slate-600 pt-6 mt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-400">
                {taskForm.attachments.length > 0 && (
                  <span className="mr-4">📎 {taskForm.attachments.length} Dateien</span>
                )}
                {taskForm.subtasks.length > 0 && (
                  <span className="mr-4">✓ {taskForm.subtasks.length} Subtasks</span>
                )}
                {taskForm.tags.length > 0 && (
                  <span className="mr-4">🏷️ {taskForm.tags.length} Tags</span>
                )}
                {taskForm.attachedTools.length > 0 && (
                  <span>🛠️ {taskForm.attachedTools.length} Tools</span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button onClick={resetTaskDialog} variant="outline">
                  Abbrechen
                </Button>
                <Button
                  onClick={handleTaskSave}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!taskForm.title.trim() || !taskForm.dueDate}
                >
                  Erstellen
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {renderTaskDialog()}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Aufgaben für {coachee.firstName}
        </h2>
        <Button
          onClick={() => setShowTaskDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Neue Aufgabe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-slate-400 text-sm">Gesamt</p>
                <p className="text-2xl font-bold text-slate-200">{allTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-orange-400" />
              <div>
                <p className="text-slate-400 text-sm">Offen</p>
                <p className="text-2xl font-bold text-slate-200">{openTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckSquare className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-slate-400 text-sm">Erledigt</p>
                <p className="text-2xl font-bold text-slate-200">{completedTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {allTasks.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <Target className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">Noch keine Aufgaben</h3>
            <p className="text-slate-400 mb-6">
              Erstelle die erste Aufgabe für {coachee.firstName}
            </p>
            <Button
              onClick={() => setShowTaskDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Erste Aufgabe erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {openTasks.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Offene Aufgaben</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {openTasks.map(task => (
                  <Card key={task.id} className="bg-slate-700/30 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-200 mb-2">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                            {task.due_date && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(task.due_date).toLocaleDateString('de-DE')}</span>
                              </div>
                            )}
                            {task.priority && (
                              <Badge variant="outline" className={
                                task.priority === 'high' ? 'text-red-400 border-red-400' :
                                task.priority === 'medium' ? 'text-yellow-400 border-yellow-400' :
                                'text-green-400 border-green-400'
                              }>
                                {task.priority === 'high' ? 'Hoch' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                              </Badge>
                            )}
                            {!task.isSupabaseTask && (
                              <Badge variant="outline" className="text-blue-400 border-blue-400">
                                localStorage
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTask(task.id, task.isSupabaseTask)}
                          className="text-red-400 border-red-400 ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {completedTasks.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Erledigte Aufgaben</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedTasks.map(task => (
                  <Card key={task.id} className="bg-green-900/10 border-green-700/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-400 line-through mb-2">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-slate-500 mb-2">{task.description}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTask(task.id, task.isSupabaseTask)}
                          className="text-red-400 border-red-400 ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksTab;