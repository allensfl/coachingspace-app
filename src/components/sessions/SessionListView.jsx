import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import SessionCard from './SessionCard';

const SessionListView = ({
  sessions,
  onCardClick,
  onDirectStart,
  onToggleArchive,
  onDeleteSession,        // ← NEU: Delete-Handler hinzugefügt
  onStatusChange,
  onCreateInvoice,
  activePackages,
  onAddToCalendar
}) => {
  return (
    <Card className="glass-card mt-6">
      <CardHeader>
        <CardTitle className="text-white">Session-Liste</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <SessionCard
              key={session.id}
              session={session}
              index={index}
              onCardClick={onCardClick}
              onDirectStart={onDirectStart}
              onToggleArchive={onToggleArchive}
              onDeleteSession={onDeleteSession}  // ← NEU: An SessionCard weiterleiten
              onStatusChange={onStatusChange}
              onCreateInvoice={onCreateInvoice}
              activePackages={activePackages}
              onAddToCalendar={onAddToCalendar}
            />
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Keine Sessions gefunden</h3>
              <p className="text-slate-400">Für diesen Filter gibt es keine Einträge.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionListView;