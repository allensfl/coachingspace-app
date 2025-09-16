import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Gift, Clock, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStateContext } from '@/context/AppStateContext';

const EventsAndBirthdays = () => {
  const { coachees = [] } = useAppStateContext();

  // Mock-Daten für heutige Termine
  const todaysEvents = [
    {
      id: 1,
      type: 'session',
      title: 'Coaching Session',
      client: 'Sarah Müller',
      time: '14:00',
      status: 'upcoming'
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Team Meeting',
      time: '16:30',
      status: 'upcoming'
    }
  ];

  // Erweiterte Geburtstage-Daten mit Coachee-Referenzen
  const upcomingBirthdays = [
    {
      id: 1,
      name: 'Michael Weber',
      coacheeId: 2, // Referenz zu Michael Weber aus Coachees
      birthday: '2025-09-17',
      daysUntil: 2,
      avatarUrl: null
    },
    {
      id: 2,
      name: 'Sarah Müller', 
      coacheeId: 3, // Referenz zu Sarah Müller aus Coachees
      birthday: '2025-09-22',
      daysUntil: 7,
      avatarUrl: null
    }
  ];

  const sendGratulation = (birthday) => {
    // Debug: Überprüfe verfügbare Daten
    console.log('Birthday object:', birthday);
    console.log('Available coachees:', coachees);
    
    // Einfachere Coachee-Suche - probiere verschiedene Matching-Strategien
    let coachee = coachees.find(c => c.id === birthday.coacheeId);
    
    if (!coachee) {
      // Fallback: Suche nach Namen
      coachee = coachees.find(c => 
        `${c.firstName} ${c.lastName}` === birthday.name ||
        `${c.vorname} ${c.nachname}` === birthday.name
      );
    }
    
    if (!coachee) {
      console.error('Coachee not found for:', birthday);
      alert(`Coachee-Daten für ${birthday.name} nicht gefunden. Prüfe die Console für Details.`);
      return;
    }

    const email = coachee.email || coachee.emailAddress;
    
    if (!email) {
      alert(`Keine E-Mail-Adresse für ${birthday.name} gefunden.`);
      return;
    }

    const isToday = birthday.daysUntil === 0;
    const firstName = coachee.firstName || coachee.vorname || birthday.name.split(' ')[0];
    
    const template = {
      subject: `Herzlichen Glückwunsch zum Geburtstag!`,
      body: `Hallo ${firstName},

${isToday 
  ? 'herzlichen Glückwunsch zu deinem Geburtstag heute! 🎉🎂' 
  : `ich wollte dir schon mal im Voraus alles Gute zu deinem Geburtstag ${birthday.daysUntil === 1 ? 'morgen' : `in ${birthday.daysUntil} Tagen`} wünschen! 🎉`}

Ich wünsche dir einen wundervollen Tag voller Freude, schöner Momente und dass alle deine Wünsche in Erfüllung gehen.

${isToday 
  ? 'Genieße deinen besonderen Tag in vollen Zügen!'
  : 'Ich freue mich darauf, bald mit dir zu feiern!'}

Herzliche Grüße und alles Liebe,
[Dein Name]

PS: Wir können gerne in unserer nächsten Session anstoßen! 🥂`
    };
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
    console.log('Opening email with URL:', mailtoUrl);
    window.open(mailtoUrl);
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getBirthdayText = (daysUntil) => {
    if (daysUntil === 0) return 'Heute!';
    if (daysUntil === 1) return 'Morgen';
    return `in ${daysUntil} Tagen`;
  };

  return (
    <Card className="glass-card-enhanced">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium text-foreground">
          <Calendar className="mr-2 h-4 w-4 text-primary" />
          Termine & Geburtstage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heutige Termine */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Heute
          </h4>
          {todaysEvents.length > 0 ? (
            <div className="space-y-2">
              {todaysEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-background/50 rounded-md border border-border/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    {event.client && (
                      <p className="text-xs text-muted-foreground">{event.client}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">{formatTime(event.time)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Keine Termine heute</p>
          )}
        </div>

        {/* Anstehende Geburtstage mit Gratulations-Button */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
            <Gift className="h-3 w-3 mr-1" />
            Anstehende Geburtstage
          </h4>
          {upcomingBirthdays.length > 0 ? (
            <div className="space-y-2">
              {upcomingBirthdays.map((person) => (
                <div key={person.id} className="p-2 bg-background/50 rounded-md border border-border/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={person.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{person.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={person.daysUntil <= 1 ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {getBirthdayText(person.daysUntil)}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Gratulations-Button für heute oder morgen */}
                  {person.daysUntil <= 1 && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs h-7 hover:bg-green-50 hover:border-green-300"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Button clicked for:', person);
                        sendGratulation(person);
                      }}
                    >
                      <PartyPopper className="h-3 w-3 mr-1" />
                      {person.daysUntil === 0 ? 'Gratulieren' : 'Vorab gratulieren'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Keine anstehenden Geburtstage</p>
          )}
        </div>

        {/* Quick Link zu Kalender */}
        <Link to="/sessions">
          <Button variant="outline" size="sm" className="w-full text-xs h-8">
            Kalender öffnen
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EventsAndBirthdays;