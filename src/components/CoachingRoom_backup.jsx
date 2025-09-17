import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { 
  Video, 
  Mic, 
  PhoneMissed,
  Users,
  Wrench,
  BookOpen,
  FileText,
  ExternalLink,
  LogOut,
  Info,
  Package,
  Presentation,
  History,
  Calendar,
  Target,
  Trophy,
  CheckCircle,
  Loader2,
  BrainCircuit,
  ZoomIn,
  ClipboardCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { SessionStatus } from '@/types';
import TaskManager from '@/components/TaskManager';
import { useAppStateContext } from '@/context/AppStateContext';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date)) return 'N/A';
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(date);
};

const RemoteToolIcon = ({ toolName }) => {
  const name = toolName.toLowerCase();
  if (name.includes('zoom')) {
    return <ZoomIn className="mr-2 h-4 w-4" />;
  }
  if (name.includes('google meet')) {
    return <LucideIcons.MessageSquare className="mr-2 h-4 w-4" />;
  }
  if (name.includes('teams')) {
    return <LucideIcons.Users className="mr-2 h-4 w-4" />;
  }
  return <ExternalLink className="mr-2 h-4 w-4" />;
};

export default function CoachingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, actions } = useAppStateContext();
  const { getCoacheeById } = actions;
  const { settings, tools } = state;
  const { remoteTools } = settings;
  const toolbox = tools;
  
  const [coachee, setCoachee] = useState(null);

  useEffect(() => {
    if (state.isLoading) return;
    const foundCoachee = getCoacheeById(id);
    if (foundCoachee) {
      setCoachee(foundCoachee);
    } else {
      toast({
        title: 'Fehler',
        description: 'Coachee für diese Session konnte nicht gefunden werden.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [id, getCoacheeById, navigate, toast, state.isLoading]);

  const handleShareAiDialog = () => {
    window.open('/ai-coaching/shared', '_blank', 'width=800,height=600,resizable=yes,scrollbars=yes');
    toast({ title: 'Freigabe-Fenster geöffnet', description: 'Das Fenster für den Coachee ist bereit.' });
  };

  if (state.isLoading || !coachee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-slate-400">Coaching Raum wird vorbereitet...</p>
      </div>
    );
  }

  const handleToolClick = (tool) => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
    toast({
        title: `Öffne ${tool.name}`,
        description: `Das Tool wird in einem neuen Tab geöffnet.`
    });
  };

  const handlePresentTool = (tool) => {
    navigate(`/tool-presenter/${tool.id}`);
    toast({
      title: `Präsentiere: ${tool.name}`,
      description: 'Tool wird im Präsentationsmodus geöffnet.'
    });
  };

  const previousSessions = (coachee.sessions || []).filter(s => s.status === SessionStatus.COMPLETED);
  const openGoals = (coachee.goals || []).filter(g => g.subGoals.some(sg => !sg.completed));
  const usedTools = toolbox.filter(t => t.usageHistory.some(h => h.coachee === `${coachee.firstName} ${coachee.lastName}`));

  return (
    <>
      <Helmet>
        <title>Coaching Room mit {coachee.firstName} {coachee.lastName} - Coachingspace</title>
        <meta name="description" content={`Live Remote-Coaching-Session mit ${coachee.firstName} ${coachee.lastName}.`} />
      </Helmet>
      
      <div className="flex flex-col lg:flex-row h-screen bg-slate-950 text-white font-sans">
        <main className="flex-1 flex flex-col p-4 lg:p-6">
          <header className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-2xl font-bold text-white">Coaching Room</h1>
                <p className="text-slate-400">Session mit <span className="text-primary font-semibold">{coachee.firstName} {coachee.lastName}</span></p>
            </div>
            <Link to={`/coachees/${coachee.id}`}>
              <Button variant="outline" className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                <LogOut className="mr-2 h-4 w-4" />
                Session beenden
              </Button>
            </Link>
          </header>

          <div className="flex-1 bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden glass-card-deep">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <Video className="w-24 h-24 text-slate-600 mb-4" />
                <h2 className="text-xl font-semibold text-slate-400">Video-Call Placeholder</h2>
                <p className="text-slate-500">Hier würde der Video-Stream angezeigt.</p>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 bg-slate-800/50 backdrop-blur-sm rounded-full">
                    <Button variant="outline" size="icon" className="bg-primary/20 text-primary rounded-full w-12 h-12"><Mic className="h-5 w-5" /></Button>
                    <Button variant="outline" size="icon" className="bg-primary/20 text-primary rounded-full w-12 h-12"><Video className="h-5 w-5" /></Button>
                    <Button variant="destructive" size="icon" className="bg-red-600 hover:bg-red-700 rounded-full w-12 h-12"><PhoneMissed className="h-5 w-5" /></Button>
                </div>
            </div>
            <div className="absolute top-4 right-4 w-48 h-32 bg-slate-800 rounded-lg flex items-center justify-center glass-card">
                 <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{coachee.firstName[0]}{coachee.lastName[0]}</span>
                </div>
            </div>
          </div>
        </main>

        <aside className="w-full lg:w-[400px] bg-slate-900 lg:border-l border-slate-700 p-4 lg:p-6 flex flex-col">
          <Tabs defaultValue="info" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="info"><Info className="mr-1 h-4 w-4" /> Info</TabsTrigger>
              <TabsTrigger value="notes"><FileText className="mr-1 h-4 w-4" /> Notizen</TabsTrigger>
              <TabsTrigger value="tasks"><ClipboardCheck className="mr-1 h-4 w-4" /> Aufgaben</TabsTrigger>
              <TabsTrigger value="toolbox"><Package className="mr-1 h-4 w-4" /> Toolbox</TabsTrigger>
              <TabsTrigger value="history"><History className="mr-1 h-4 w-4" /> Verlauf</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
              <Card className="glass-card"><CardHeader><CardTitle className="text-white flex items-center"><Users className="mr-2 h-5 w-5" /> Teilnehmer</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center"><span className="font-bold">C</span></div><p className="font-medium">Coach (Du)</p><Badge variant="outline" className="ml-auto text-green-400 border-green-400/50">Host</Badge></div><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center"><span className="font-bold">{coachee.firstName[0]}{coachee.lastName[0]}</span></div><p className="font-medium">{coachee.firstName} {coachee.lastName}</p></div></CardContent></Card>
              <Card className="glass-card"><CardHeader><CardTitle className="text-white flex items-center"><Wrench className="mr-2 h-5 w-5" /> Externe Tools</CardTitle></CardHeader><CardContent className="space-y-2">{remoteTools.map((tool, index) => (<Button key={index} variant="outline" className="w-full justify-start" onClick={() => handleToolClick(tool)}><RemoteToolIcon toolName={tool.name} />{tool.name}</Button>))
              }
              {remoteTools.length === 0 && (<p className="text-sm text-slate-400 text-center py-2">Keine Tools konfiguriert.</p>)}</CardContent></Card>
              <Card className="glass-card">
                <CardHeader><CardTitle className="text-white flex items-center"><BrainCircuit className="mr-2 h-5 w-5" /> KI-Tools</CardTitle></CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={handleShareAiDialog}>
                    <ExternalLink className="mr-2 h-4 w-4" /> KI-Dialog teilen
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
              <Card className="glass-card"><CardHeader><CardTitle className="text-white flex items-center"><FileText className="mr-2 h-5 w-5" /> Coachee-Notizen</CardTitle></CardHeader><CardContent className="space-y-4"><div><h4 className="font-semibold text-slate-300 mb-1">Vertrauliche Notizen</h4><p className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded-md">{coachee.confidentialNotes || "Keine vertraulichen Notizen vorhanden."}</p></div><div><h4 className="font-semibold text-slate-300 mb-1">Schnellnotizen</h4><div className="flex flex-wrap gap-2">{coachee.quickNotes && coachee.quickNotes.length > 0 ? coachee.quickNotes.map((note, index) => (<Badge key={index} variant="secondary">{note}</Badge>)) : <p className="text-sm text-slate-500">Keine Schnellnotizen.</p>}</div></div></CardContent></Card>
              <Card className="glass-card flex-1"><CardHeader><CardTitle className="text-white flex items-center"><BookOpen className="mr-2 h-5 w-5" /> Session-Notizen</CardTitle></CardHeader><CardContent className="h-full flex flex-col"><textarea className="w-full flex-1 bg-transparent border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:ring-primary focus:border-primary min-h-[150px]" placeholder="Private Notizen für diese Session..."></textarea></CardContent></Card>
            </TabsContent>

            <TabsContent value="tasks" className="flex-1 overflow-y-auto mt-4 pr-2">
                <TaskManager isCompact={true} />
            </TabsContent>

            <TabsContent value="toolbox" className="flex-1 overflow-y-auto mt-4 pr-2">
              <div className="space-y-3">{toolbox.filter(t => t.status === 'active').map(tool => { const Icon = LucideIcons[tool.icon] || Package; return (<Card key={tool.id} className="glass-card hover:bg-slate-800/50 transition-colors"><CardContent className="p-3 flex items-center justify-between"><div className="flex items-center gap-3">{Icon && <Icon className="h-5 w-5 text-primary" />}<div><p className="font-semibold text-white">{tool.name}</p><p className="text-xs text-slate-400">{tool.category}</p></div></div><Button size="sm" variant="ghost" onClick={() => handlePresentTool(tool)}><Presentation className="h-4 w-4 mr-2" />Präsentieren</Button></CardContent></Card>)})}</div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
               <Card className="glass-card"><CardHeader><CardTitle className="text-white flex items-center"><Calendar className="mr-2 h-5 w-5" /> Bisherige Sessions</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{previousSessions.length > 0 ? previousSessions.map(s => (<div key={s.id} className="flex justify-between items-center"><p className="text-slate-300">{s.topic}</p><p className="text-slate-500">{formatDate(s.date)}</p></div>)) : <p className="text-slate-500">Keine abgeschlossenen Sessions.</p>}</CardContent></Card>
               <Card className="glass-card"><CardHeader><CardTitle className="text-white flex items-center"><Target className="mr-2 h-5 w-5" /> Offene Ziele</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{openGoals.length > 0 ? openGoals.map(g => (<div key={g.id}><p className="text-slate-300 font-semibold">{g.title}</p><ul className="list-disc list-inside pl-2 text-slate-400">{g.subGoals.filter(sg => !sg.completed).map(sg => <li key={sg.id}>{sg.title}</li>)}</ul></div>)) : <p className="text-slate-500">Keine offenen Ziele.</p>}</CardContent></Card>
               <Card className="glass-card"><CardHeader><CardTitle className="text-white flex items-center"><CheckCircle className="mr-2 h-5 w-5" /> Erfolge</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{coachee.completedGoals?.length > 0 ? coachee.completedGoals.map(g => (<div key={g.id} className="flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-400" /><p className="text-slate-300">{g.title}</p></div>)) : <p className="text-slate-500">Keine abgeschlossenen Ziele.</p>}</CardContent></Card>
               <Card className="glass-card"><CardHeader><CardTitle className="text-white flex items-center"><Package className="mr-2 h-5 w-5" /> Eingesetzte Tools</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{usedTools.length > 0 ? usedTools.map(t => (<Badge key={t.id} variant="outline">{t.name}</Badge>)) : <p className="text-slate-500 text-sm">Keine Tools eingesetzt.</p>}</CardContent></Card>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </>
  );
}