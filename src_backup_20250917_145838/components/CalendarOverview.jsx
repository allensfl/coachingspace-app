import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Gift } from 'lucide-react';

const CalendarOverview = ({ sessions, coachees }) => {
  
  const sendGratulation = (coachee) => {
    if (!coachee.email && !coachee.emailAddress) {
      alert(`Keine E-Mail-Adresse für ${coachee.firstName} ${coachee.lastName} gefunden.`);
      return;
    }

    const email = coachee.email || coachee.emailAddress;
    const subject = `🎉 Herzlichen Glückwunsch zum Geburtstag!`;
    const body = `Liebe/r ${coachee.firstName},\n\nherzlichen Glückwunsch zu deinem besonderen Tag! 🎂\n\nIch wünsche dir alles Gute, viel Freude und ein wundervolles neues Lebensjahr!\n\nLiebe Grüße\nDein Coach`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  // Heute als festes Datum für Demo
  const today = new Date('2025-09-16');
  
  // Echte Coachee-Geburtstage für die nächsten 3 Tage
  const upcomingEvents = [];
  
  for (let i = 0; i < 3; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    
    const dayName = i === 0 ? 'Heute' : currentDate.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' });
    
    // Sessions für diesen Tag
    const daySessions = sessions?.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === currentDate.toDateString();
    }) || [];
    
    // Geburtstage für diesen Tag - echte Coachee-Daten
    const dayBirthdays = coachees?.filter(coachee => {
      if (!coachee.birthDate) return false;
      const birth = new Date(coachee.birthDate);
      return birth.getMonth() === currentDate.getMonth() && birth.getDate() === currentDate.getDate();
    }).map(coachee => ({
      type: 'birthday',
      title: 'Geburtstag',
      name: `${coachee.firstName} ${coachee.lastName}`,
      coachee: coachee,
      isToday: i === 0
    })) || [];
    
    // Mock Sessions für Demo
    const mockSessions = i === 0 ? [
      { type: 'session', title: 'Coaching Session', name: 'Sarah Müller', time: '14:00' },
      { type: 'session', title: 'Team Meeting', name: null, time: '16:30' }
    ] : [];
    
    const allEvents = [...daySessions, ...dayBirthdays, ...mockSessions];
    
    if (allEvents.length > 0 || i === 0) {
      upcomingEvents.push({
        day: dayName,
        isToday: i === 0,
        events: allEvents
      });
    }
  }

  const openSessionsCalendar = () => {
    window.location.href = '#/sessions';
  };

  return (
    <Card className="glass-card-enhanced">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-foreground">
          <Calendar className="mr-2 h-4 w-4 text-primary" />
          Kalender - Nächste 3 Tage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingEvents.map((day, index) => (
          <div key={index}>
            <div className="flex items-center text-xs font-medium text-muted-foreground mb-2">
              <Clock className="mr-1 h-3 w-3" />
              {day.day}
              {day.isToday && <Badge variant="secondary" className="ml-2 text-xs">Heute</Badge>}
            </div>
            
            {day.events.length > 0 ? (
              <div className="space-y-2">
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="flex items-center justify-between py-2 px-3 bg-background/30 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      {event.type === 'birthday' ? (
                        <Gift className="h-4 w-4 text-pink-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{event.title}</p>
                        {event.name && (
                          <p className="text-xs text-muted-foreground">{event.name}</p>
                        )}
                      </div>
                      {event.type === 'birthday' && event.isToday && (
                        <Badge variant="destructive" className="text-xs ml-2">🎉 Heute!</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {event.time && (
                        <span className="text-xs font-medium text-primary">{event.time}</span>
                      )}
                      {event.type === 'birthday' && event.isToday && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => sendGratulation(event.coachee)}
                        >
                          Gratulieren
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : day.isToday ? (
              <div className="py-2 px-3 bg-background/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Keine Termine heute</p>
              </div>
            ) : null}
          </div>
        ))}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-4"
          onClick={openSessionsCalendar}
        >
          Sessions-Kalender öffnen
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarOverview;