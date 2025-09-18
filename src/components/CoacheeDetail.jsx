import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import ProfileCard from "./coachee-detail/ProfileCard";
import { useAppStateContext } from '@/context/AppStateContext';

export default function CoacheeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCoacheeById, updateCoachee } = useAppStateContext();
  
  const [coachee, setCoachee] = useState(null);

  // Nur AppStateContext verwenden - kein localStorage mehr
  useEffect(() => {
    console.log('Loading coachee with ID:', id);
    
    if (getCoacheeById) {
      const realCoachee = getCoacheeById(id);
      if (realCoachee) {
        console.log('Coachee from AppStateContext:', realCoachee);
        console.log('DSGVO consents:', realCoachee.consents);
        console.log('Documents count:', realCoachee.documents?.length || 0);
        setCoachee(realCoachee);
      } else {
        console.log('Coachee nicht gefunden mit ID:', id);
        setCoachee(null);
      }
    }
  }, [id, getCoacheeById]);

  // Loading State
  if (!coachee) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-200 text-lg">Lade Coachee-Daten...</div>
      </div>
    );
  }

  // Profil-Update-Handler - direkt an AppStateContext weiterleiten
  const handleProfileUpdate = (updatedCoachee) => {
    console.log('CoacheeDetail - Profil-Update erhalten:', updatedCoachee);
    
    // Direkt den AppStateContext aktualisieren
    updateCoachee(updatedCoachee);
    
    // Lokalen State auch aktualisieren für sofortige UI-Updates
    setCoachee(updatedCoachee);
    
    // Success-Toast anzeigen
    toast({
      title: "Änderungen gespeichert",
      description: "Die Coachee-Daten wurden erfolgreich im System aktualisiert."
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Praktischer Zurück-Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/coachees')}
            className="flex items-center gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zu Coachees
          </Button>
        </div>

        {/* Dunkler Container wie im Dashboard-Design */}
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          {/* Tab-Navigation - dunkles Theme */}
          <Tabs defaultValue="profil" className="w-full">
            <TabsList className="w-full bg-slate-900 rounded-t-lg border-b border-slate-700 p-0">
              <TabsTrigger 
                value="profil" 
                className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Profil
              </TabsTrigger>
              <TabsTrigger 
                value="ziele" 
                className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Ziele
              </TabsTrigger>
              <TabsTrigger 
                value="aufgaben" 
                className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Aufgaben
              </TabsTrigger>
              <TabsTrigger 
                value="verlauf" 
                className="flex-1 py-4 text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Verlauf
              </TabsTrigger>
            </TabsList>

            {/* Profil-Tab - Layout mit ProfileCard + Sidebar */}
            <TabsContent value="profil" className="p-6 bg-slate-800">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* ProfileCard - 3/4 der Breite */}
                <div className="lg:col-span-3">
                  <ProfileCard 
                    coachee={coachee}
                    onUpdate={handleProfileUpdate}
                  />
                </div>

                {/* Quick Navigation Sidebar - 1/4 der Breite */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-6">
                    <h3 className="font-semibold text-slate-200 text-lg mb-6">
                      Quick Navigation
                    </h3>
                    
                    {/* Dynamische Buttons basierend auf Coachee-Namen */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/sessions?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        {coachee.firstName}s Sessions
                      </Button>

                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/journal?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        {coachee.firstName}s Journal
                      </Button>

                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/invoices?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        {coachee.firstName}s Rechnungen
                      </Button>

                      <Button
                        onClick={() => {
                          const coacheeName = `${coachee.firstName}+${coachee.lastName}`;
                          navigate(`/documents?coachee=${coachee.id}&name=${coacheeName}`);
                        }}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        {coachee.firstName}s Dokumente
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Andere Tabs - Dunkles Theme */}
            <TabsContent value="ziele" className="p-6 bg-slate-800">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 text-slate-200">Coaching-Ziele</h2>
                <p className="text-slate-400">
                  Hier werden die Coaching-Ziele für {coachee.firstName} {coachee.lastName} angezeigt.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="aufgaben" className="p-6 bg-slate-800">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 text-slate-200">Aufgaben</h2>
                <p className="text-slate-400">
                  Hier werden die Aufgaben für {coachee.firstName} {coachee.lastName} angezeigt.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="verlauf" className="p-6 bg-slate-800">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 text-slate-200">Coaching-Verlauf</h2>
                <p className="text-slate-400">
                  Hier wird der Coaching-Verlauf für {coachee.firstName} {coachee.lastName} angezeigt.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}