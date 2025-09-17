
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BrainCircuit, User, Sparkles, Wand2, ChevronRight, ChevronLeft, Send, RotateCcw, Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Stepper, phases } from '@/components/ai-coaching/Stepper';
import { AiAssistantPanel } from '@/components/ai-coaching/AiAssistantPanel';
import { PromptLibraryPanel } from '@/components/ai-coaching/PromptLibraryPanel';
import { renderStepContent, getAvatarsForStep } from '@/components/ai-coaching/StepContent';
import { getStepDetails, mockAiResponses } from '@/components/ai-coaching/stepDetails';
import { useAppStateContext } from '@/context/AppStateContext';

const AiCoaching = () => {
  const { state, actions } = useAppStateContext();
  const { coachees, settings } = state;
  const { setSettings } = actions;
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCoachee, setSelectedCoachee] = useState('');
  const [userInput, setUserInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [aiSettings, setAiSettings] = useState(settings.ai || {});
  const channelRef = useRef(null);

  const postSharedData = useCallback(() => {
    if (channelRef.current) {
      const sharedData = {
        type: 'update',
        payload: {
          step: currentStep,
          input: userInput,
          output: aiOutput,
          selectedImage: selectedImage,
          avatars: getAvatarsForStep(currentStep)
        }
      };
      channelRef.current.postMessage(sharedData);
    }
  }, [currentStep, userInput, aiOutput, selectedImage]);

  useEffect(() => {
    channelRef.current = new BroadcastChannel('ai_coaching_channel');
    
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'ready') {
        postSharedData();
      }
    };
    
    channelRef.current.addEventListener('message', handleMessage);

    return () => {
      if (channelRef.current) {
        channelRef.current.removeEventListener('message', handleMessage);
        channelRef.current.close();
      }
    };
  }, [postSharedData]);

  useEffect(() => {
    postSharedData();
  }, [currentStep, userInput, aiOutput, selectedImage, postSharedData]);

  const handleUpdateAiSetting = (key, value) => {
    const newAiSettings = { ...aiSettings, [key]: value };
    setAiSettings(newAiSettings);
    setSettings(prev => ({ ...prev, ai: newAiSettings }));
  };

  const handleGenerate = () => {
    if (!selectedCoachee) {
      toast({ title: 'Fehler', description: 'Bitte wähle zuerst einen Coachee aus.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    setAiOutput('');
    
    setTimeout(() => {
      const response = mockAiResponses[`step${currentStep}`] || 'Für diesen Schritt ist keine KI-Antwort konfiguriert.';
      setAiOutput(response);
      setIsGenerating(false);
    }, 1500);
  };
  
  const handleShare = () => {
    window.open('/ai-coaching/shared', '_blank', 'width=800,height=600,resizable=yes,scrollbars=yes');
    toast({ title: 'Freigabe-Fenster geöffnet', description: 'Das Fenster für den Coachee ist bereit.' });
  };

  const currentPhase = Math.floor((currentStep - 1) / 4);

  const clearStepState = () => {
      setAiOutput('');
      setUserInput('');
      setSelectedImage(null);
  }

  const nextStep = () => {
    if (currentStep < 12) {
      setCurrentStep(prev => prev + 1);
      clearStepState();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      clearStepState();
    }
  };
  
  const resetStep = () => {
      clearStepState();
      toast({title: 'Eingaben zurückgesetzt'});
  }
  
  const { title, description } = getStepDetails(currentStep);

  return (
    <>
      <Helmet>
        <title>KI-Coaching - Coachingspace</title>
        <meta name="description" content="Triadisches Coaching mit KI-Unterstützung zur intensiven Problemanalyse und Lösungsfindung." />
      </Helmet>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3"><BrainCircuit /> KI-Coaching Modul</h1>
            <p className="text-slate-400">Geführter Prozess für das triadische Coaching (Coach, Coachee, KI).</p>
          </div>

          <Stepper currentPhase={currentPhase} steps={phases} />

          <Card className="glass-card">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">{title}</CardTitle>
                <CardDescription className="text-gray-300">{description}</CardDescription> {/* Changed to gray-300 */}
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedCoachee} onValueChange={setSelectedCoachee}>
                  <SelectTrigger><SelectValue placeholder="Coachee auswählen..." /></SelectTrigger>
                  <SelectContent>{coachees.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-white flex items-center"><User className="mr-2" />Eingabe (Coach & Coachee)</h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent(currentStep, userInput, setUserInput, selectedImage, setSelectedImage)}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="space-y-4">
                 <h3 className="font-semibold text-white flex items-center"><Sparkles className="mr-2 text-primary" />KI-Feedback</h3>
                <div className="min-h-[150px] bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-full">
                      <Wand2 className="h-8 w-8 text-primary animate-pulse" />
                      <p className="ml-4 text-slate-400">KI generiert Feedback...</p>
                    </div>
                  ) : (
                    <p className="text-slate-300 whitespace-pre-wrap">{aiOutput || 'Hier erscheint die Antwort der KI...'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}><ChevronLeft className="mr-2 h-4 w-4"/> Vorheriger Schritt</Button>
              
              <div className="flex gap-2">
                  <Button variant="ghost" onClick={resetStep}><RotateCcw className="mr-2 h-4 w-4"/> Reset</Button>
                  <Button onClick={handleGenerate} disabled={isGenerating || (!userInput && !selectedImage)} className="bg-primary hover:bg-primary/90">
                      <Send className="mr-2 h-4 w-4"/> {isGenerating ? 'Generiere...' : 'An KI senden'}
                  </Button>
                  <Button variant="secondary" onClick={handleShare} title="Für Coachee freigeben">
                      <Share2 className="mr-2 h-4 w-4"/> Freigeben
                  </Button>
              </div>

              <Button variant="outline" onClick={nextStep} disabled={currentStep === 12}>Nächster Schritt <ChevronRight className="ml-2 h-4 w-4"/></Button>
          </div>
        </div>

        <aside className="w-full lg:w-96 space-y-6">
          <AiAssistantPanel 
            aiSettings={aiSettings} 
            onUpdateAiSetting={handleUpdateAiSetting}
            toast={toast}
          />
          <PromptLibraryPanel 
            aiSettings={aiSettings}
            onUpdateAiSetting={handleUpdateAiSetting}
            onSetUserInput={setUserInput}
            toast={toast}
          />
        </aside>
      </div>
    </>
  );
};

export default AiCoaching;
