
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PortalHeader from './coachee-portal/PortalHeader';
import PortalTabs from './coachee-portal/PortalTabs';
import PortalFooter from './coachee-portal/PortalFooter';
import { useAppStateContext } from '@/context/AppStateContext';

const CoacheePortal = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useAppStateContext();
  const { getCoacheeByToken, updateCoachee, setTasks, setJournalEntries } = actions;
  
  const [coachee, setCoachee] = useState(null);
  const [portalData, setPortalData] = useState({ journalEntries: [], documents: [] });
  const [isInitialAccess, setIsInitialAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const processToken = () => {
      if (!token) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }
  
      const foundCoachee = getCoacheeByToken(token);
  
      if (foundCoachee) {
        setIsValid(true);
        if (foundCoachee.portalAccess?.initialToken === token) {
          const newPermanentToken = window.crypto.randomUUID();
          const updatedCoachee = {
            ...foundCoachee,
            portalAccess: {
              ...foundCoachee.portalAccess,
              initialToken: null,
              permanentToken: newPermanentToken,
            },
            auditLog: [...(foundCoachee.auditLog || []), { timestamp: new Date().toISOString(), user: 'System', action: 'Portal-Zugang aktiviert' }]
          };
          updateCoachee(updatedCoachee);
          setCoachee(updatedCoachee);
          setIsInitialAccess(true);
          window.history.replaceState(null, '', `/portal/${newPermanentToken}`);
          setIsLoading(false);
        } else if (foundCoachee.portalAccess?.permanentToken === token) {
          setCoachee(foundCoachee);
          setIsLoading(false);
        } else {
          setIsValid(false);
          setIsLoading(false);
        }
      } else {
        setIsValid(false);
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    // Use a small timeout to allow state hydration to complete
    const timer = setTimeout(processToken, 100);
    return () => clearTimeout(timer);
  }, [token, getCoacheeByToken, updateCoachee, state.isLoading]);

  useEffect(() => {
      if (!isLoading && !isValid) {
          navigate('/invalid-link', {replace: true});
      }
  }, [isLoading, isValid, navigate]);

  useEffect(() => {
    if (coachee) {
      try {
        const savedData = localStorage.getItem(`coacheePortalData_${coachee.id}`);
        if (savedData) {
          setPortalData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Failed to parse portal data from localStorage", error);
      }
    }
  }, [coachee]);

  useEffect(() => {
    if (coachee && !isLoading) {
      localStorage.setItem(`coacheePortalData_${coachee.id}`, JSON.stringify(portalData));
    }
  }, [portalData, coachee, isLoading]);

  const updatePortalData = useCallback((newPartialData) => {
    setPortalData(prev => ({ ...prev, ...newPartialData }));
  }, []);

  const updateCoacheeData = useCallback((newCoacheeData) => {
    const updated = { ...coachee, ...newCoacheeData };
    updateCoachee(updated);
    setCoachee(updated);
  }, [coachee, updateCoachee]);

  if (isLoading || !coachee) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-slate-400">Öffne sicheren Coaching Raum...</p>
        </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dein persönlicher Coaching Raum</title>
        <meta name="description" content={`Willkommen in deinem geschützten Bereich, ${coachee.firstName}.`} />
      </Helmet>
      
      <AlertDialog open={isInitialAccess} onOpenChange={setIsInitialAccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-yellow-400" /> Wichtiger Sicherheitshinweis!</AlertDialogTitle>
            <AlertDialogDescription>
              Dies ist Ihr neuer, permanenter und geheimer Link zu Ihrem Portal. 
              <strong className="text-yellow-300">Bitte speichern Sie diese Seite jetzt als Lesezeichen in Ihrem Browser.</strong>
              <br/><br/>
              Aus Sicherheitsgründen kann dieser Link von niemandem wiederhergestellt werden – auch nicht von Ihrem Coach.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsInitialAccess(false)}>Ich habe es verstanden und die Seite gespeichert</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <PortalHeader coachee={coachee} updateCoacheeData={updateCoacheeData} portalData={portalData} />
          <PortalTabs 
            coachee={coachee} 
            portalData={portalData} 
            updatePortalData={updatePortalData}
            updateCoacheeData={updateCoacheeData}
            tasks={state.tasks}
            onUpdateTasks={setTasks}
            onShareJournalEntry={setJournalEntries}
          />
          <PortalFooter />
        </div>
      </div>
    </>
  );
};

export default CoacheePortal;
