import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAppStateContext } from '@/context/AppStateContext';

const CoacheePortalLinks = () => {
  const { state, actions } = useAppStateContext();
  const { coachees } = state;
  const { ensurePermanentTokenForDemo } = actions;
  const { toast } = useToast();

  const handleGeneratePortalLink = (coachee) => {
    if (!coachee) return;
    const permanentToken = ensurePermanentTokenForDemo(coachee);
    const portalLink = `${window.location.origin}/portal/${permanentToken}`;
    navigator.clipboard.writeText(portalLink);
    toast({
      title: 'Portal-Link kopiert!',
      description: `Der permanente Link für ${coachee.firstName} wurde in die Zwischenablage kopiert.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Coachee Portal Links - Coachingspace</title>
        <meta name="description" content="Generiere sichere und permanente Zugangslinks für deine Coachees zum Portal." />
      </Helmet>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Coachee Portal Links</h1>
            <p className="text-slate-400">Generiere hier sichere Zugangslinks für deine Coachees.</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Portal-Zugänge verwalten</CardTitle>
              <CardDescription>
                Klicke auf einen Coachee, um einen neuen, permanenten Zugangslink zu generieren und zu kopieren. Sende diesen Link an deinen Coachee.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(!coachees || coachees.length === 0) ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-4 text-lg font-medium text-white">Keine Coachees gefunden</h3>
                  <p className="mt-2 text-sm text-slate-500">Füge zuerst einen Coachee hinzu, um einen Portal-Link zu erstellen.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {coachees.map((coachee) => (
                    <div key={coachee.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                          {coachee.firstName.charAt(0)}{coachee.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{coachee.firstName} {coachee.lastName}</p>
                          <p className="text-sm text-slate-400">{coachee.email}</p>
                        </div>
                      </div>
                      <Button onClick={() => handleGeneratePortalLink(coachee)} variant="outline">
                        <Link className="mr-2 h-4 w-4" />
                        Portal-Link kopieren
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default CoacheePortalLinks;