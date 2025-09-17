
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, BrainCircuit, Users2, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockImages } from '@/components/ai-coaching/StepContent';

const SharedTextView = ({ data }) => (
  <>
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><User /> Eingabe vom Coach</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 whitespace-pre-wrap min-h-[50px]">
          {data.input || "Wartet auf Eingabe vom Coach..."}
        </p>
      </CardContent>
    </Card>
    <Card className="glass-card border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary"><Sparkles /> Antwort der KI</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 whitespace-pre-wrap min-h-[50px]">
          {data.output || "Wartet auf KI-Antwort..."}
        </p>
      </CardContent>
    </Card>
  </>
);

const SharedImageView = ({ data }) => (
  <Card className="glass-card">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-white"><ImageIcon /> Immersive Bildarbeit</CardTitle>
    </CardHeader>
    <CardContent>
       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mockImages.map(img => (
          <motion.div key={img.id} className={`rounded-lg overflow-hidden border-4 ${data.selectedImage?.id === img.id ? 'border-primary' : 'border-transparent'}`}>
             <img alt={img.alt} src="https://images.unsplash.com/photo-1595872018818-97555653a011?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          </motion.div>
        ))}
       </div>
    </CardContent>
  </Card>
);

const SharedAvatarView = ({ data }) => (
  <Card className="glass-card">
    <CardHeader>
       <CardTitle className="flex items-center gap-2 text-amber-400"><Users2 /> Virtuelle Aufstellung</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-around items-center h-48">
      {data.avatars?.map(avatar => (
        <div key={avatar.name} className="flex flex-col items-center gap-2">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: avatar.color }}>
            <User className="text-white h-10 w-10" />
          </motion.div>
          <p className="font-semibold text-slate-200">{avatar.name}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);


const AiCoachingShared = () => {
  const [sharedData, setSharedData] = useState({ step: 1, input: '', output: '', selectedImage: null, avatars: [] });
  const channelRef = useRef(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel('ai_coaching_channel');

    const handleMessage = (event) => {
      if (event.data && event.data.type === 'update') {
        setSharedData(event.data.payload);
      }
    };

    channelRef.current.addEventListener('message', handleMessage);
    channelRef.current.postMessage({ type: 'ready' });

    return () => {
      if(channelRef.current) {
        channelRef.current.removeEventListener('message', handleMessage);
        channelRef.current.close();
      }
    };
  }, []);
  
  const renderContent = () => {
    switch (sharedData.step) {
      case 3:
        return <SharedImageView data={sharedData} />;
      case 6:
      case 9:
        return <SharedAvatarView data={sharedData} />;
      default:
        return <SharedTextView data={sharedData} />;
    }
  };


  return (
    <>
      <Helmet>
        <title>KI-Coaching Freigabe - Coachingspace</title>
        <meta name="description" content="Geteilte Ansicht für die KI-Interaktion im Coaching." />
      </Helmet>
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3"><BrainCircuit /> Geteilter KI-Dialog</h1>
            <p className="text-slate-400">Ansicht für den Coachee</p>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={sharedData.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </div>
    </>
  );
};

export default AiCoachingShared;
