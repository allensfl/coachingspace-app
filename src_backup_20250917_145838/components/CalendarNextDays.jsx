import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Gift } from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';

const CalendarNextDays = () => {
  const { coachees, sessions } = useAppStateContext();

  const sendGratulation = (birthday) => {
    const coachee = coachees.find(c => c.id === birthday.coacheeId);
    
    if (!coachee || !coachee.email) {
      alert(`Keine E-Mail-Adresse für ${birthday.name} gefunden.`);
      return;
    }

    const subject = `🎉 Herzlichen Glückwunsch zum Geburtstag!`;
    const body = `Liebe/r ${coachee.firstName},\n\nherzlichen Glückwunsch zu deinem besonderen Tag! 🎂\n\nIch wünsche dir alles Gute, viel Freude und ein wundervolles neues Lebensjahr!\n\nLiebe Grüße\nDein Coach`;

    const mailtoUrl = `mailto:${coachee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  // Heute als festes Datum
  const today = new Date('2025-09-16');
  const nextThreeDays = [];

  // Füge die nächsten 3 Tage hinzu
  for (let i = 0; i < 3; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    nextThreeDays.push(currentDate);
  }

  // Events für die nächsten 3 Tage sammeln
  const upcomingEvents = [];

  nextThreeDays.forEach((date) => {
    const dateString = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' });

    // Echte Sessions für diesen Tag (Mock-Daten, da sessions eventuell leer)
    const todaySessions = [
      { id: 1, title: 'Coaching Session', coacheeName: 'Sarah Müller', time: '14:00', date: '2025-09-16' },
      { id: 2, title: 'Team Meeting', coacheeName: null, time: '16:30', date: '2025-09-16' }
    ].filter(session => session.date === dateString);

    // Geburtstage für diesen Tag
    const birthdaysToday = coachees
      .filter(c => c.birthDate)
      .filter(coachee => {
        const birth = new Date(coachee.birthDate);
        return birth.getMonth() === date.getMonth() && birth.getDate() === date.getDate();
      })
      .map(coachee => ({
        id: `birthday-${coachee.id}`,
        type: 'birthday',
        title: 'Geburtstag',
        coacheeName: `${coachee.firstName} ${coachee.lastName}`,
        coacheeId: coachee.id,
        time: null,
        date: dateString,
        isToday: i === 0
      }));

    // Alle Events für diesen Tag
    const dayEvents = [
      ...todaySessions.map(s => ({ ...s, type: 'session' })),
      ...birthdaysToday
    ];

    if (dayEvents.length > 0 || i === 0) { // Heute immer anzeigen, auch wenn leer
      upcomingEvents.push({
        date: dateString,
        dayName,
        isToday: i === 0,
        events: dayEvents
      });
    }
  });

  const openSessionsCalendar = () => {
    window.location.href = '#/sessions';
  };

  return (
    <Card className="glass-card-enhanced">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium text-foreground">
          <Calendar className="mr-2 h-4 w-4 text-primary" />
          Kalender - Nächste 3 Tage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {upcomingEvents.map((day) => (
          <div key={day.date}>
            <div className="flex items-center text-xs font-medium text-muted-foreground mb-2">
              <Clock className="mr-1 h-3 w-3" />
              {day.isToday ? 'Heute' : day.dayName}
              {day.isToday && <Badge variant="secondary" className="ml-2 text-xs">Heute</Badge>}
            </div>
            
            {day.events.length > 0 ? (
              day.events.map((event) => (
                <div key={event.id} className="flex items-center justify-between py-2 px-3 bg-background/30 rounded-lg mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {event.type === 'birthday' ? (
                        <Gift className="h-4 w-4 text-pink-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-blue-500" />
                      )}
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      {event.type === 'birthday' && event.isToday && (
                        <Badge className="bg-red-500 text-white text-xs">🎉 Heute!</Badge>
                      )}
                    </div>
                    {event.coacheeName && (
                      <p className="text-xs text-muted-foreground ml-6">{event.coacheeName}</p>
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
                        onClick={() => sendGratulation(event)}
                      >
                        Gratulieren
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : day.isToday ? (
              <div className="py-2 px-3 bg-background/30 rounded-lg mb-2">
                <p className="text-xs text-muted-foreground">Keine Termine heute</p>
              </div>
            ) : null}
          </div>
        ))}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3"
          onClick={openSessionsCalendar}
        >
          Sessions-Kalender öffnen
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarNextDays;