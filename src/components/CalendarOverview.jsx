import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CalendarOverview = ({ sessions = [], coachees = [] }) => {
  // Mock-Daten für verschiedene Termine (in echter App aus verschiedenen Quellen)
  const allEvents = useMemo(() => {
    const events = [];
    
    // Sessions hinzufügen
    sessions.forEach(session => {
      const coachee = coachees.find(c => c.id === session.coacheeId);
      const sessionDate = new Date(session.date);
      const now = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      
      if (sessionDate >= now && sessionDate <= threeDaysLater) {
        events.push({
          id: `session-${session.id}`,
          type: 'session',
          title: session.topic,
          client: coachee ? `${coachee.firstName} ${coachee.lastName}` : 'Unbekannt',
          date: sessionDate,
          time: sessionDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
          avatarUrl: coachee?.avatarUrl,
          sessionType: session.type,
          coacheeId: coachee?.id
        });
      }
    });
    
    // Weitere Termine (Mock-Daten - in echter App aus Kalendern/Tasks)
    const mockEvents = [
      {
        id: 'meeting-1',
        type: 'meeting',
        title: 'Team Meeting',
        client: null,
        date: new Date(new Date().setHours(16, 30)),
        time: '16:30',
        avatarUrl: null
      },
      {
        id: 'birthday-1',
        type: 'birthday',
        title: 'Geburtstag',
        client: 'Michael König',
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        time: null,
        avatarUrl: null
      }
    ];
    
    return [...events, ...mockEvents].sort((a, b) => a.date - b.date);
  }, [sessions, coachees]);

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Heute';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Morgen';
    } else if (date.toDateString() === dayAfterTomorrow.toDateString()) {
      return 'Übermorgen';
    } else {
      return date.toLocaleDateString('de-DE', { 
        weekday: 'short', 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'session':
        return <Users className="h-4 w-4" />;
      case 'meeting':
        return <Clock className="h-4 w-4" />;
      case 'birthday':
        return <Gift className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'session':
        return 'text-blue-500';
      case 'meeting':
        return 'text-purple-500';
      case 'birthday':
        return 'text-pink-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="glass-card-enhanced">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-foreground">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          Kalender - Nächste 3 Tage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {allEvents.length > 0 ? (
          allEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-all duration-300 group cursor-pointer"
            >
              {/* Icon oder Avatar */}
              <div className={`p-2 rounded-full bg-background ${getEventColor(event.type)}`}>
                {event.avatarUrl ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={event.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {event.client ? event.client.split(' ').map(n => n[0]).join('') : '?'}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  getEventIcon(event.type)
                )}
              </div>
              
              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                  {event.title}
                </p>
                {event.client && (
                  <p className="text-xs text-muted-foreground truncate">
                    {event.type === 'session' ? 'mit ' : ''}{event.client}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                  {event.time && (
                    <Badge variant="outline" className="text-xs">{event.time}</Badge>
                  )}
                  {event.sessionType && (
                    <Badge variant={event.sessionType === 'remote' ? 'default' : 'secondary'} className="text-xs">
                      {event.sessionType === 'remote' ? 'Remote' : 'Präsenz'}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              {event.type === 'session' && event.coacheeId && (
                <Link to={`/coaching-room/${event.coacheeId}`}>
                  <Button size="sm" className="text-xs h-7">Start</Button>
                </Link>
              )}
              
              {event.type === 'birthday' && (
                <Button size="sm" variant="outline" className="text-xs h-7">Gratulieren</Button>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4 text-sm">Keine Termine in den nächsten 3 Tagen.</p>
        )}
        
        {/* Sessions-Kalender öffnen Button */}
        <div className="pt-3 border-t border-border/50">
          <Link to="/sessions">
            <Button variant="outline" size="sm" className="w-full text-xs h-8">
              Sessions-Kalender öffnen
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarOverview;