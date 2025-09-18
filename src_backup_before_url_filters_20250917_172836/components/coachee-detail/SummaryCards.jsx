import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date)) return 'N/A';
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const SummaryCard = ({ icon: Icon, title, items, children, delay, onButtonClick, coacheeName }) => {
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
              {items.slice(0, 3).map((item, index) => (
                <div key={item.id || `${title}-${index}`}>
                  {children(item)}
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-muted-foreground text-sm">+ {items.length - 3} weitere</p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Keine Einträge erfasst.</p>
          )}
        </CardContent>
        <div className="p-6 pt-0">
          <Button 
            variant="default" 
            size="lg"
            className="w-full mt-2 h-12 font-semibold" 
            onClick={onButtonClick}
          >
            {coacheeName}s {title}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default function SummaryCards({ coachee }) {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(`${route}?coachee=${coachee.id}&name=${encodeURIComponent(coachee.firstName + ' ' + coachee.lastName)}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <SummaryCard 
        icon={Calendar} 
        title="Sessions" 
        items={coachee.sessions} 
        delay={0.3}
        onButtonClick={() => handleNavigate('/sessions')}
        coacheeName={coachee.firstName}
      >
        {(session) => (
          <>
            <p className="font-medium">{session.topic}</p>
            <p className="text-sm text-muted-foreground">{formatDate(session.date)}</p>
          </>
        )}
      </SummaryCard>

      <SummaryCard 
        icon={BookOpen} 
        title="Journal" 
        items={coachee.journalEntries} 
        delay={0.4}
        onButtonClick={() => handleNavigate('/journal')}
        coacheeName={coachee.firstName}
      >
        {(entry) => (
          <>
            <p className="font-medium">{entry.title}</p>
            <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
          </>
        )}
      </SummaryCard>

      <SummaryCard 
        icon={DollarSign} 
        title="Rechnungen" 
        items={coachee.invoices} 
        delay={0.5}
        onButtonClick={() => handleNavigate('/invoices')}
        coacheeName={coachee.firstName}
      >
        {(invoice) => (
          <>
            <p className="font-medium">Rechnung #{invoice.id}</p>
            <p className="text-sm text-muted-foreground">{formatDate(invoice.date)} - {invoice.amount} {invoice.currency}</p>
          </>
        )}
      </SummaryCard>

      <SummaryCard 
        icon={FileText} 
        title="Dokumente" 
        items={coachee.documents} 
        delay={0.6}
        onButtonClick={() => handleNavigate('/documents')}
        coacheeName={coachee.firstName}
      >
        {(doc) => (
          <>
            <p className="font-medium">{doc.name}</p>
            <p className="text-sm text-muted-foreground">{formatDate(doc.uploadDate)} - {doc.format}</p>
          </>
        )}
      </SummaryCard>
    </div>
  );
}