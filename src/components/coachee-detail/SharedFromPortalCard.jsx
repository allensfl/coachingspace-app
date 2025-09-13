import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, FileText, Share2 } from 'lucide-react';

const SharedFromPortalCard = ({ coachee }) => {
    const [portalData, setPortalData] = useState({ journalEntries: [], documents: [] });

    useEffect(() => {
        if (coachee) {
            try {
                const savedData = localStorage.getItem(`coacheePortalData_${coachee.id}`);
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    const sharedJournalEntries = parsedData.journalEntries?.filter(e => e.shared) || [];
                    const sharedDocuments = parsedData.documents?.filter(d => d.shared) || [];
                    setPortalData({ journalEntries: sharedJournalEntries, documents: sharedDocuments });
                }
            } catch (error) {
                console.error("Failed to parse portal data from localStorage", error);
            }
        }
    }, [coachee]);
  
    const hasSharedJournal = portalData && portalData.journalEntries.length > 0;
    const hasSharedDocuments = portalData && portalData.documents.length > 0;

  if (!hasSharedJournal && !hasSharedDocuments) {
    return (
       <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><Share2 /> Vom Coachee geteilt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-4">Der Coachee hat noch keine Inhalte aus dem Portal geteilt.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2"><Share2 /> Vom Coachee geteilt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
          {hasSharedJournal && (
            <div>
              <h4 className="text-lg font-semibold text-slate-300 mb-2">Journal-Einträge</h4>
              <ul className="space-y-2">
                {portalData.journalEntries.map(entry => (
                  <li key={entry.id} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-slate-200 flex items-center gap-2 text-sm">
                        <Book className="h-4 w-4 text-primary" />
                        Eintrag vom {new Date(entry.date).toLocaleDateString('de-DE')}
                      </p>
                      <Badge variant="outline">{new Date(entry.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</Badge>
                    </div>
                    <p className="text-sm text-slate-400 pl-6 whitespace-pre-wrap">{entry.content}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasSharedDocuments && (
            <div>
              <h4 className="text-lg font-semibold text-slate-300 mb-2 pt-4">Dokumente</h4>
              <ul className="space-y-2">
                {portalData.documents.map(doc => (
                  <li key={doc.id} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-200 flex items-center gap-2 text-sm">
                         <FileText className="h-4 w-4 text-primary" />
                        {doc.name}
                      </p>
                      <Badge variant="secondary">{doc.size}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SharedFromPortalCard;