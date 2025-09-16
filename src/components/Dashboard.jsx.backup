import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUpRight,
  Users,
  Calendar,
  FileText,
  PackagePlus,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Plus,
  StickyNote,
  Receipt,
  Bell,
  MessageCircle
} from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';
import OpenInvoices from './OpenInvoices';
import EventsAndBirthdays from './EventsAndBirthdays';
import QuickActions from './QuickActions';
import CalendarOverview from './CalendarOverview';

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
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Heute';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Morgen';
  } else {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  }
};

export default function Dashboard() {
  const { 
    sessions = [], 
    coachees = [], 
    tasks = [], 
    updateTask,
    packages = []
  } = useAppStateContext();

  // Sessions für die nächsten 3 Tage
  const upcomingSessions = useMemo(() => {
    if (!sessions) return [];
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    
    return sessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= today && sessionDate <= threeDaysLater;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [sessions]);

  // Persönliche Tasks für heute (neue Struktur)
  const todaysTasks = useMemo(() => {
    if (!tasks) return [];
    const today = new Date().toDateString();
    return tasks.filter(task => {
      if (!task.faelligkeitsdatum) return false;
      const taskDate = new Date(task.faelligkeitsdatum).toDateString();
      return taskDate === today && !task.abgeschlossen && !task.zugewiesenAn;
    });
  }, [tasks]);

  // Coachee-Deadlines für heute (neue Struktur)
  const coacheeDeadlines = useMemo(() => {
    if (!tasks) return [];
    const today = new Date().toDateString();
    return tasks.filter(task => {
      if (!task.faelligkeitsdatum) return false;
      const taskDate = new Date(task.faelligkeitsdatum).toDateString();
      return taskDate === today && task.zugewiesenAn && !task.abgeschlossen;
    });
  }, [tasks]);

  // Statistiken berechnen
  const activeCoachees = coachees?.filter(c => c.status === 'active').length || 0;
  const sessionsThisWeek = sessions?.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  }).length || 0;
  const activePackages = packages?.filter(p => p.status === 'active').length || 0;

  const toggleTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { abgeschlossen: !task.abgeschlossen });
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Coaching Plattform</title>
        <meta name="description" content="Übersicht über Ihre Coaching-Aktivitäten" />
      </Helmet>

      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Willkommen zurück! Hier ist Ihre Übersicht für heute.
          </p>
        </div>

        {/* Statistik-Karten */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Aktive Coachees"
            value={activeCoachees}
            icon={<Users />}
            to="/coachees"
            colorClass="text-blue-500"
          />
          <StatCard
            title="Sessions diese Woche"
            value={sessionsThisWeek}
            icon={<Calendar />}
            to="/sessions"
            colorClass="text-green-500"
          />
          <StatCard
            title="Offene Dokumente"
            value="12"
            icon={<FileText />}
            to="/documents"
            colorClass="text-orange-500"
          />
          <StatCard
            title="Aktive Pakete"
            value={activePackages}
            icon={<PackagePlus />}
            to="/settings"
            colorClass="text-purple-500"
          />
        </div>

        {/* To-Do Bereich - separate Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Persönliche Tasks */}
          <Card className="glass-card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground text-lg">
                <CheckCircle2 className="mr-3 h-6 w-6 text-green-500" />
                Meine Aufgaben heute ({todaysTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysTasks.length > 0 ? (
                <div className="space-y-3">
                  {todaysTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border/50 hover:bg-background/80 transition-colors group">
                      <CheckCircle2 
                        className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-green-500 transition-colors" 
                        onClick={() => toggleTask(task.id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {task.titel || 'Unbenannte Aufgabe'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {task.thema && <span className="font-medium">{task.thema}</span>}
                          {task.thema && task.konkretesToDo && ' • '}
                          {task.konkretesToDo}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {task.prioritaet || 'Normal'}
                        </Badge>
                        {task.schaetzung && (
                          <span className="text-xs text-muted-foreground">{task.schaetzung}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">Keine Aufgaben für heute.</p>
              )}
            </CardContent>
          </Card>

          {/* Coachee Deadlines */}
          <Card className="glass-card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground text-lg">
                <AlertTriangle className="mr-3 h-6 w-6 text-orange-500" />
                Coachee-Deadlines heute ({coacheeDeadlines.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coacheeDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {coacheeDeadlines.slice(0, 5).map((task) => {
                    const coachee = coachees?.find(c => c.id === task.zugewiesenAn);
                    const isOverdue = new Date(task.faelligkeitsdatum) < new Date();
                    return (
                      <div key={task.id} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg border border-border/50 hover:bg-background/80 transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={coachee?.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {coachee ? `${coachee.firstName[0]}${coachee.lastName[0]}` : '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{task.titel}</p>
                          <p className="text-xs text-muted-foreground">
                            {coachee ? `${coachee.firstName} ${coachee.lastName}` : 'Unbekannt'}
                            {task.thema && ` • ${task.thema}`}
                          </p>
                          {task.konkretesToDo && (
                            <p className="text-xs text-muted-foreground mt-1">{task.konkretesToDo}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant={isOverdue ? "destructive" : "default"} className="text-xs mb-2">
                            {isOverdue ? 'Überfällig' : 'Fällig heute'}
                          </Badge>
                          <Button size="sm" variant="outline" className="text-xs h-7 w-full">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Nachfassen
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">Keine Deadlines heute.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Link zu vollständigem Aufgaben-Manager */}
        <div className="text-center">
          <Link to="/tasks">
            <Button variant="outline" size="lg" className="bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border-primary/20">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Alle Aufgaben verwalten
            </Button>
          </Link>
        </div>

        {/* Sekundärer Bereich */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Kalender - kombiniert Sessions + Termine */}
          <CalendarOverview sessions={upcomingSessions} coachees={coachees} />
          
          {/* Weitere Bereiche in der oberen Zeile */}
          <div className="grid gap-6 lg:grid-cols-2 lg:col-span-2">
            <OpenInvoices />
            <EventsAndBirthdays />
          </div>
        </div>

        {/* Quick Actions - volle Breite aber kleiner */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </>
  );
}