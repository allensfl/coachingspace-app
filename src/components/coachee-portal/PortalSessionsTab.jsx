import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PortalSessionsTab = ({ coachee }) => {
  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/50 border border-slate-800">
        <CardHeader><CardTitle>Vergangene & Zukünftige Sessions</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(coachee.sessions || []).map(session => (
              <li key={session.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-200">{session.topic}</p>
                  <p className="text-sm text-slate-400">{new Date(session.date).toLocaleString('de-DE', { dateStyle: 'full', timeStyle: 'short' })}</p>
                </div>
                <Badge variant={session.status === 'Abgeschlossen' ? 'success' : 'outline'}>{session.status}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalSessionsTab;