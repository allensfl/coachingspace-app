import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const UnbilledSessions = ({ sessions, onAddSession }) => {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Unabgerechnete Sessions</CardTitle>
        <CardDescription>Füge abgeschlossene, aber noch nicht abgerechnete Sessions zur Rechnung hinzu.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li key={session.id} className="flex justify-between items-center p-2 bg-slate-800/50 rounded-md">
              <div>
                <p className="font-medium">{session.topic}</p>
                <p className="text-sm text-slate-400">{new Date(session.date).toLocaleDateString('de-DE')}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onAddSession(session.id)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Hinzufügen
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UnbilledSessions;