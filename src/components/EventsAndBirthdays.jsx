import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Gift, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventsAndBirthdays = () => {
  // Mock-Daten für heutige Termine und anstehende Geburtstage
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

  const upcomingBirthdays = [
    {
      id: 1,
      name: 'Michael König',
      birthday: '2025-09-17',
      daysUntil: 2,
      avatarUrl: null
    },
    {
      id: 2,
      name: 'Lisa Weber',
      birthday: '2025-09-22',
      daysUntil: 7,
      avatarUrl: null
    }
  ];

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

        {/* Anstehende Geburtstage */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
            <Gift className="h-3 w-3 mr-1" />
            Anstehende Geburtstage
          </h4>
          {upcomingBirthdays.length > 0 ? (
            <div className="space-y-2">
              {upcomingBirthdays.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-2 bg-background/50 rounded-md border border-border/50">
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