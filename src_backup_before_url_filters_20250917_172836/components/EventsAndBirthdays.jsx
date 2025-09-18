import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Clock } from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';

const EventsAndBirthdays = () => {
  const { coachees } = useAppStateContext();

  const sendGratulation = (birthday) => {
    console.log('Gratulation Button clicked for:', birthday);
    
    const coachee = coachees.find(c => c.id === birthday.coacheeId);
    
    if (!coachee || !coachee.email) {
      alert(`Keine E-Mail-Adresse für ${birthday.name} gefunden.`);
      return;
    }

    const isToday = birthday.daysUntil === 0;
    const isTomorrow = birthday.daysUntil === 1;
    
    let subject, body;
    
    if (isToday) {
      subject = `🎉 Herzlichen Glückwunsch zum Geburtstag!`;
      body = `Liebe/r ${coachee.firstName},\n\nherzlichen Glückwunsch zu deinem besonderen Tag! 🎂\n\nIch wünsche dir alles Gute, viel Freude und ein wundervolles neues Lebensjahr!\n\nLiebe Grüße\nDein Coach`;
    } else if (isTomorrow) {
      subject = `🎈 Vorab-Glückwunsch zu deinem Geburtstag!`;
      body = `Liebe/r ${coachee.firstName},\n\nda ich morgen vielleicht nicht dazu komme, möchte ich dir heute schon gratulieren! 🎉\n\nHerzlichen Glückwunsch zu deinem Geburtstag morgen!\n\nLiebe Grüße\nDein Coach`;
    }

    const mailtoUrl = `mailto:${coachee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  // Heute als festes Datum für Debug
  const today = new Date('2025-09-16'); // Heute
  
  const upcomingBirthdays = coachees
    .filter(c => c.birthDate) 
    .map(coachee => {
      const birth = new Date(coachee.birthDate);
      console.log(`Processing ${coachee.firstName} ${coachee.lastName}, birthDate: ${coachee.birthDate}`);
      
      // Geburtstag für dieses Jahr berechnen
      let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
      
      // Tage bis zum Geburtstag berechnen
      const diffTime = nextBirthday.getTime() - today.getTime();
      let daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Falls Geburtstag schon vorbei, nächstes Jahr
      if (daysUntil < 0) {
        nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
        const newDiffTime = nextBirthday.getTime() - today.getTime();
        daysUntil = Math.ceil(newDiffTime / (1000 * 60 * 60 * 24));
      }
      
      // Spezialfall: Heute ist Geburtstag (16.09.)
      if (birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate()) {
        daysUntil = 0;
      }
      
      console.log(`${coachee.firstName}: daysUntil = ${daysUntil}`);
      
      return {
        id: coachee.id,
        name: `${coachee.firstName} ${coachee.lastName}`,
        coacheeId: coachee.id,
        birthday: coachee.birthDate,
        daysUntil,
        avatarUrl: coachee.avatarUrl || null
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 3);

  const formatTimeUntil = (daysUntil) => {
    if (daysUntil === 0) return 'Heute';
    if (daysUntil === 1) return 'Morgen';
    if (daysUntil <= 7) return `in ${daysUntil} Tagen`;
    if (daysUntil <= 30) return `in ${Math.ceil(daysUntil / 7)} Wochen`;
    return `in ${Math.ceil(daysUntil / 30)} Monaten`;
  };

  const getBirthdayBadge = (daysUntil) => {
    if (daysUntil === 0) return <Badge variant="destructive" className="text-xs">🎉 Heute!</Badge>;
    if (daysUntil === 1) return <Badge className="bg-blue-500 text-white text-xs">🎂 Morgen</Badge>;
    if (daysUntil <= 7) return <Badge variant="secondary" className="text-xs">🎈 Diese Woche</Badge>;
    return null;
  };

  const shouldShowGratulationButton = (daysUntil) => {
    return daysUntil <= 1; // Heute oder morgen
  };

  // Mock-Termine für heute
  const todaysEvents = [
    { id: 1, title: 'Coaching Session', client: 'Sarah Müller', time: '14:00' },
    { id: 2, title: 'Team Meeting', client: null, time: '16:30' }
  ];

  return (
    <Card className="glass-card-enhanced">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium text-foreground">
          <Calendar className="mr-2 h-4 w-4 text-primary" />
          Termine & Geburtstage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Termine heute */}
        <div>
          <div className="flex items-center text-xs font-medium text-muted-foreground mb-2">
            <Clock className="mr-1 h-3 w-3" />
            Heute
          </div>
          {todaysEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between py-2 px-3 bg-background/30 rounded-lg mb-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                {event.client && <p className="text-xs text-muted-foreground">{event.client}</p>}
              </div>
              <span className="text-xs font-medium text-primary">{event.time}</span>
            </div>
          ))}
        </div>

        {/* Geburtstage */}
        <div>
          <div className="flex items-center text-xs font-medium text-muted-foreground mb-2">
            <Gift className="mr-1 h-3 w-3 text-destructive" />
            Anstehende Geburtstage
          </div>
          
          {upcomingBirthdays.length > 0 ? (
            upcomingBirthdays.map((birthday) => (
              <div key={birthday.id} className="flex items-center justify-between py-2 px-3 bg-background/30 rounded-lg mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-primary/20 px-2 py-1 rounded">
                      {birthday.name.split(' ').map(n => n[0]).join('')}
                    </span>
                    <span className="text-sm font-medium text-foreground">{birthday.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {getBirthdayBadge(birthday.daysUntil)}
                    <span className="text-xs text-muted-foreground">
                      {formatTimeUntil(birthday.daysUntil)}
                    </span>
                  </div>
                </div>
                
                {shouldShowGratulationButton(birthday.daysUntil) && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => sendGratulation(birthday)}
                  >
                    Gratulieren
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground py-2">Keine anstehenden Geburtstage</p>
          )}
        </div>

        <Button variant="outline" size="sm" className="w-full mt-3">
          Kalender öffnen
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventsAndBirthdays;