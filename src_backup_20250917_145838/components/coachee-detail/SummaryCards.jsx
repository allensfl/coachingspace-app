import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date)) return 'N/A';
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const SummaryCard = ({ icon: Icon, title, items, children, delay }) => {
  const { toast } = useToast();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Card className="glass-card h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-primary flex items-center">
            <Icon className="mr-2 h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 flex-1">
          {items && items.length > 0 ? (
            <>
              {items.slice(0, 3).map(children)}
              {items.length > 3 && (
                <p className="text-muted-foreground text-sm">+ {items.length - 3} weitere</p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Keine Einträge erfasst.</p>
          )}
        </CardContent>
        <div className="p-6 pt-0">
          <Button variant="outline" className="w-full mt-2" onClick={() => toast({
            title: "🚧 Diese Funktion ist noch nicht implementiert",
            description: "Du kannst sie in deinem nächsten Prompt anfordern! 🚀"
          })}>
            Alle {title}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default function SummaryCards({ coachee }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <SummaryCard icon={Calendar} title="Sitzungen" items={coachee.sessions} delay={0.3}>
        {(session) => (
          <div key={session.id}>
            <p className="font-medium">{session.topic}</p>
            <p className="text-sm text-muted-foreground">{formatDate(session.date)}</p>
          </div>
        )}
      </SummaryCard>
      
      <SummaryCard icon={BookOpen} title="Journal" items={coachee.journalEntries} delay={0.4}>
        {(entry) => (
          <div key={entry.id}>
            <p className="font-medium">{entry.title}</p>
            <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
          </div>
        )}
      </SummaryCard>
      
      <SummaryCard icon={DollarSign} title="Rechnungen" items={coachee.invoices} delay={0.5}>
        {(invoice) => (
          <div key={invoice.id}>
            <p className="font-medium">Rechnung #{invoice.id}</p>
            <p className="text-sm text-muted-foreground">{formatDate(invoice.date)} - {invoice.amount} {invoice.currency}</p>
          </div>
        )}
      </SummaryCard>
      
      <SummaryCard icon={FileText} title="Dokumente" items={coachee.documents} delay={0.6}>
        {(doc) => (
          <div key={doc.id}>
            <p className="font-medium">{doc.name}</p>
            <p className="text-sm text-muted-foreground">{formatDate(doc.uploadDate)} - {doc.format}</p>
          </div>
        )}
      </SummaryCard>
    </div>
  );
}