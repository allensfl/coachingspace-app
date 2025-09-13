import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Target,
  BookOpen,
  Users,
  Loader2,
  ClipboardCheck,
  Trash2,
  History,
  FileText,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAppStateContext } from '@/context/AppStateContext';
import CoacheeDetailHeader from './coachee-detail/CoacheeDetailHeader';
import ProfileCard from './coachee-detail/ProfileCard';
import ConsentsCard from './coachee-detail/ConsentsCard';
import GoalsCard from './coachee-detail/GoalsCard';
import SharedFromPortalCard from './coachee-detail/SharedFromPortalCard';
import SummaryCards from './coachee-detail/SummaryCards';
import TaskManager from '@/components/TaskManager';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AuditLogCard from './coachee-detail/AuditLogCard';
import GoalEditorDialog from './coachee-detail/GoalEditorDialog';

const CoacheeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, actions } = useAppStateContext();
  const { getCoacheeById, updateCoachee, ensurePermanentTokenForDemo, setCoachees } = actions;
  const { sessionNotes } = state;

  const [coachee, setCoachee] = useState(null);
  const [editedCoachee, setEditedCoachee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoalEditorOpen, setIsGoalEditorOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);

  useEffect(() => {
    if (state.isLoading) return;
    const foundCoachee = getCoacheeById(id);
    if (foundCoachee) {
      setCoachee(foundCoachee);
      setIsLoading(false);
    } else {
      toast({
        title: 'Fehler',
        description: 'Coachee nicht gefunden.',
        variant: 'destructive',
      });
      navigate('/coachees');
    }
  }, [id, getCoacheeById, navigate, toast, state.isLoading, state.coachees]);

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setEditedCoachee({ ...coachee, customData: coachee.customData || {} });
    } else {
      setEditedCoachee(null);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, coachee]);
  
  const handleCancelEdit = () => {
      setEditedCoachee(null);
      setIsEditing(false);
  };

  const handleSave = useCallback(() => {
    if (!editedCoachee) return;
    const updatedWithLog = {
      ...editedCoachee,
      auditLog: [...(editedCoachee.auditLog || []), { timestamp: new Date().toISOString(), user: 'Coach', action: 'Coachee-Daten aktualisiert' }]
    };
    updateCoachee(updatedWithLog);
    setCoachee(updatedWithLog);
    setIsEditing(false);
    setEditedCoachee(null);
    toast({
      title: 'Erfolgreich',
      description: 'Coachee-Daten aktualisiert.',
    });
  }, [editedCoachee, updateCoachee, toast]);

  const handleFieldChange = useCallback((e) => {
      const { id, value } = e.target;
      setEditedCoachee(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleCustomFieldChange = useCallback((e) => {
    const { id, value } = e.target;
    setEditedCoachee(prev => ({
      ...prev,
      customData: {
        ...prev.customData,
        [id]: value,
      },
    }));
  }, []);

  const handleConsentChange = useCallback((consentKey, value) => {
    setEditedCoachee(prev => ({
      ...prev,
      consents: { ...prev.consents, [consentKey]: value },
    }));
  }, []);

  const handleToggleSubGoal = useCallback((goalId, subGoalId) => {
    setEditedCoachee(prev => {
      const newGoals = prev.goals.map(goal => {
        if (goal.id === goalId) {
          const newSubGoals = goal.subGoals.map(sg => sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg);
          return { ...goal, subGoals: newSubGoals };
        }
        return goal;
      });
      return { ...prev, goals: newGoals };
    });
  }, []);

  const handleEditGoal = (goal) => {
    setCurrentGoal(goal);
    setIsGoalEditorOpen(true);
  };

  const handleDeleteGoal = useCallback((goalId) => {
    setEditedCoachee(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId),
    }));
  }, []);

  const handleSaveGoal = (goalToSave) => {
    const existingGoals = editedCoachee.goals || [];
    let updatedGoals;
    let logAction = '';

    if (goalToSave.id.startsWith('new_')) {
      const newGoal = { ...goalToSave, id: `g_${Date.now()}`};
      updatedGoals = [...existingGoals, newGoal];
      logAction = `Neues Ziel hinzugefügt: "${newGoal.title}"`;
    } else {
      updatedGoals = existingGoals.map(g => (g.id === goalToSave.id ? goalToSave : g));
      logAction = `Ziel bearbeitet: "${goalToSave.title}"`;
    }
    
    setEditedCoachee(prev => ({
      ...prev,
      goals: updatedGoals,
      auditLog: [...(prev.auditLog || []), { timestamp: new Date().toISOString(), user: 'Coach', action: logAction }]
    }));
  };
  
  const handleDeleteCoachee = () => {
     setCoachees(prev => prev.filter(c => c.id !== parseInt(id)));
     toast({
        title: "Coachee gelöscht",
        description: `${coachee.firstName} ${coachee.lastName} wurde entfernt.`,
        variant: "destructive"
     });
     navigate('/coachees');
  };

  const handleGeneratePortalLink = useCallback(() => {
    if (!coachee) return;
    const permanentToken = ensurePermanentTokenForDemo(coachee);
    const portalLink = `${window.location.origin}/portal/${permanentToken}`;
    navigator.clipboard.writeText(portalLink);
    toast({
      title: 'Portal-Link kopiert',
      description: 'Der permanente Portal-Link wurde in die Zwischenablage kopiert.',
    });
  }, [coachee, ensurePermanentTokenForDemo, toast]);

  const handleGenerateConsentLink = useCallback(() => {
    if (!coachee) return;
    const consentLink = `${window.location.origin}/consent/${coachee.id}`;
    navigator.clipboard.writeText(consentLink);
    toast({
      title: 'DSGVO Consent-Link kopiert',
      description: 'Der Link wurde in die Zwischenablage kopiert. Senden Sie ihn an Ihren Coachee.',
    });
  }, [coachee, toast]);
  
  const handleStartCoachingRoom = () => {
     navigate(`/coaching-room/${id}`);
  };


  if (isLoading || !coachee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-slate-400">Coachee-Daten werden geladen...</p>
      </div>
    );
  }

  const dataToDisplay = isEditing ? editedCoachee : coachee;

  return (
    <>
      <Helmet>
        <title>{coachee.firstName} {coachee.lastName} - Coachingspace</title>
        <meta name="description" content={`Details und Verwaltung für Coachee ${coachee.firstName} ${coachee.lastName}.`} />
      </Helmet>

      {currentGoal && (
        <GoalEditorDialog 
          goal={currentGoal}
          isOpen={isGoalEditorOpen}
          onOpenChange={setIsGoalEditorOpen}
          onSave={handleSaveGoal}
        />
      )}

      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between space-y-2"
        >
          <Button variant="ghost" onClick={() => navigate('/coachees')} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zu Coachees
          </Button>
        </motion.div>

        <CoacheeDetailHeader 
            coachee={dataToDisplay} 
            isEditing={isEditing}
            onEditToggle={handleEditToggle}
            onSave={handleSave}
            onCancelEdit={handleCancelEdit}
            onStartCoachingRoom={handleStartCoachingRoom}
            onDelete={handleDeleteCoachee}
            onGeneratePortalLink={handleGeneratePortalLink}
        />

        <SummaryCards coachee={coachee} />

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="profile"><Users className="mr-2 h-4 w-4" /> Profil</TabsTrigger>
            <TabsTrigger value="goals"><Target className="mr-2 h-4 w-4" /> Ziele</TabsTrigger>
            <TabsTrigger value="tasks"><ClipboardCheck className="mr-2 h-4 w-4" /> Aufgaben</TabsTrigger>
            <TabsTrigger value="sessions"><Calendar className="mr-2 h-4 w-4" /> Sessions</TabsTrigger>
            <TabsTrigger value="journal"><BookOpen className="mr-2 h-4 w-4" /> Journal</TabsTrigger>
            <TabsTrigger value="history"><History className="mr-2 h-4 w-4" /> Verlauf</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ProfileCard coachee={dataToDisplay} isEditing={isEditing} onFieldChange={handleFieldChange} onCustomFieldChange={handleCustomFieldChange} />
                <ConsentsCard coachee={dataToDisplay} isEditing={isEditing} onConsentChange={handleConsentChange} onGenerateConsentLink={handleGenerateConsentLink} />
                <SharedFromPortalCard coachee={coachee} />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
             <GoalsCard 
                coachee={dataToDisplay} 
                isEditing={isEditing} 
                onToggleGoal={handleToggleSubGoal} 
                onDeleteGoal={handleDeleteGoal} 
                onEditGoal={handleEditGoal}
            />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-6">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="glass-card">
                  <CardHeader><CardTitle>Aufgaben für {coachee.firstName}</CardTitle></CardHeader>
                  <CardContent><TaskManager coacheeId={coachee.id} /></CardContent>
                </Card>
             </motion.div>
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="glass-card">
                <CardHeader><CardTitle>Alle Sessions</CardTitle></CardHeader>
                <CardContent>
                  {coachee.sessions && coachee.sessions.length > 0 ? (
                    <ul className="space-y-4">
                      {coachee.sessions.map(session => {
                        const note = (sessionNotes || []).find(n => n.sessionId === session.id);
                        return (
                          <li key={session.id} className="flex justify-between items-center text-slate-300 p-3 bg-slate-800/50 rounded-lg">
                            <div>
                              <p className="font-medium text-white">{session.topic}</p>
                              <p className="text-sm text-slate-400">{new Date(session.date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            {note ? (
                              <Button asChild variant="outline" size="sm">
                                <Link to={`/session-notes/${note.id}`}>
                                  <FileText className="mr-2 h-4 w-4" /> Notiz ansehen
                                </Link>
                              </Button>
                            ) : (
                              <Button asChild variant="secondary" size="sm">
                                <Link to={`/session-notes/new?sessionId=${session.id}&coacheeId=${coachee.id}`}>
                                  <PlusCircle className="mr-2 h-4 w-4" /> Notiz erstellen
                                </Link>
                              </Button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-slate-400 text-center py-4">Noch keine Sessions mit diesem Coachee.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="journal" className="mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="glass-card">
                <CardHeader><CardTitle>Journal-Einträge</CardTitle></CardHeader>
                <CardContent>
                  {coachee.journalEntries && coachee.journalEntries.length > 0 ? (
                    <ul className="space-y-3">
                      {coachee.journalEntries.map(entry => (
                        <li key={entry.id} className="flex justify-between items-center text-slate-300">
                          <span>{entry.title}</span>
                          <span className="text-sm text-slate-400">{new Date(entry.date).toLocaleDateString('de-DE')}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 text-center py-4">Noch keine Journal-Einträge für diesen Coachee.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="history" className="mt-6">
            <AuditLogCard auditLog={dataToDisplay.auditLog} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CoacheeDetail;