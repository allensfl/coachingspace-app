import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Users, Calendar, FileText, PackagePlus, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import TaskManager from '@/components/TaskManager';
import { useAppStateContext } from '@/context/AppStateContext';
import { isToday, startOfToday } from 'date-fns';

// StatCard mit Akzentfarben für Icons und Rand
const StatCard = ({ title, value, icon, to, colorClass }) => {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.03 }} 
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden h-full flex flex-col justify-between glass-card-enhanced hover:shadow-2xl transition-all duration-500 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">{title}</CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
            {React.cloneElement(icon, { className: 'h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300' })}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{value}</div>
          {to && (
            <Link to={to} className="text-xs text-primary hover:text-primary/80 mt-2 flex items-center group-hover:translate-x-1 transition-all duration-300">
              Details anzeigen <ArrowUpRight className="h-4 w-4 ml-1 group-hover:scale-110 transition-transform duration-300" />
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Formatdatum-Helfer
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    return new Intl.DateTimeFormat('de-DE', { dateStyle: 'long', timeStyle: 'short' }).format(date);
};

const TodaysTasks = () => {
  const { state, actions } = useAppStateContext();
  const { tasks } = state;
  const { setTasks } = actions;

  const todaysTasks = useMemo(() => {
    const today = startOfToday();
    return (tasks || []).filter(task => task.dueDate && isToday(new Date(task.dueDate)) && !task.completed);
  }, [tasks]);

  const toggleTask = (taskId) => {
    setTasks(prevTasks => (prevTasks || []).map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  if (todaysTasks.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">Heute fällig</h3>
      <Card className="glass-card">
        <CardContent className="p-4 space-y-3">
          {todaysTasks.map(task => (
             <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
              >
                <Button variant="ghost" size="icon" onClick={() => toggleTask(task.id)} className="text-muted-foreground hover:text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <span className="text-sm text-foreground">{task.text}</span>
                </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const { state } = useAppStateContext();
  const { coachees, sessions, invoices, activePackages } = state;

  const upcomingSessions = (sessions || [])
    .filter(s => new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const recentCoachees = [...(coachees || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const getCoacheeById = (id) => (coachees || []).find(c => c.id === id);

  return (
    <>
      <Helmet>
        <title>Dashboard - Coachingspace</title>
        <meta name="description" content="Dein zentrales Dashboard für die Verwaltung deiner Coachings." />
      </Helmet>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-background min-h-screen">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Aktive Coachees" value={(coachees || []).length} icon={<Users className="h-5 w-5 text-sky-400" />} to="/coachees" colorClass="border-sky-500/10" />
          <StatCard title="Geplante Sessions" value={(sessions || []).filter(s => new Date(s.date) >= new Date()).length} icon={<Calendar className="h-5 w-5 text-violet-400" />} to="/sessions" colorClass="border-violet-500/10" />
          <StatCard title="Offene Rechnungen" value={(invoices || []).filter(i => i.status === 'open').length} icon={<FileText className="h-5 w-5 text-emerald-400" />} to="/invoices" colorClass="border-emerald-500/10" />
          <StatCard title="Aktive Pakete" value={(activePackages || []).filter(p => p.usedUnits < p.totalUnits).length} icon={<PackagePlus className="h-5 w-5 text-amber-400" />} to="/invoices" colorClass="border-amber-500/10" />
        </div>
        
        <TodaysTasks />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-12 lg:col-span-4 glass-card-enhanced">
            <CardHeader>
              <CardTitle className="text-foreground">Nächste Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map(session => {
                  const coachee = getCoacheeById(session.coacheeId);
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.02, backgroundColor: 'hsl(var(--muted-hsl) / 0.5)' }} 
                      key={session.id} 
                      className="flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 glass-nav-item group"
                    >
                       <Avatar className="h-10 w-10 border-2 border-primary group-hover:border-primary/80 transition-colors duration-300">
                        <AvatarImage src={coachee?.avatarUrl} />
                        <AvatarFallback>{coachee ? `${coachee.firstName[0]}${coachee.lastName[0]}` : '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">{session.topic}</p>
                        <p className="text-sm text-muted-foreground">mit {coachee ? `${coachee.firstName} ${coachee.lastName}` : 'Unbekannt'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{formatDate(session.date)}</p>
                        <Badge variant={session.type === 'remote' ? 'default' : 'secondary'}>{session.type === 'remote' ? 'Remote' : 'Präsenz'}</Badge>
                      </div>
                       <Link to={`/coaching-room/${coachee?.id}`}>
                        <Button size="sm" className="group-hover:scale-105 transition-transform duration-300">Starten</Button>
                      </Link>
                    </motion.div>
                  )
                })
              ) : (
                <p className="text-muted-foreground text-center py-4">Keine bevorstehenden Sessions geplant.</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-12 lg:col-span-3 glass-card-enhanced">
            <CardHeader>
              <CardTitle className="text-foreground">Neue Coachees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCoachees.map(coachee => (
                <div key={coachee.id} className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={coachee.avatarUrl} />
                    <AvatarFallback>{`${coachee.firstName[0]}${coachee.lastName[0]}`}</AvatarFallback>
                  </Avatar>
                  <div>
                     <p className="text-sm font-medium text-foreground">{coachee.firstName} {coachee.lastName}</p>
                     <p className="text-sm text-muted-foreground">{coachee.email}</p>
                  </div>
                  <Link to={`/coachees/${coachee.id}`} className="ml-auto">
                    <Button variant="ghost" size="sm">Anzeigen</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="pt-4">
          <Card className="glass-card-enhanced">
            <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                    <ClipboardCheck className="mr-2 h-6 w-6 text-primary" />
                    Aufgaben-Manager
                </CardTitle>
            </CardHeader>
            <CardContent>
                <TaskManager isCompact />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
