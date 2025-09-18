import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStateContext } from '@/context/AppStateContext';

const OpenInvoices = () => {
  const { coachees = [] } = useAppStateContext();

  // Mock-Daten für offene Rechnungen - erweitert mit Coachee-Referenzen
  const openInvoices = [
    {
      id: 1,
      clientName: 'Sarah Müller',
      coacheeId: 3, // Referenz zu Sarah Müller aus Coachees
      amount: 450,
      dueDate: '2025-09-10',
      daysOverdue: 5,
      status: 'overdue'
    },
    {
      id: 2,
      clientName: 'Michael Weber',
      coacheeId: 2, // Referenz zu Michael Weber aus Coachees  
      amount: 300,
      dueDate: '2025-09-18',
      daysOverdue: 0,
      status: 'due_soon'
    }
  ];

  const sendMahnung = (invoice) => {
    // Finde den entsprechenden Coachee
    const coachee = coachees.find(c => c.id === invoice.coacheeId);
    
    if (!coachee) {
      alert('Coachee-Daten nicht gefunden.');
      return;
    }

    const email = coachee.email || coachee.emailAddress;
    
    if (!email) {
      alert(`Keine E-Mail-Adresse für ${invoice.clientName} gefunden.`);
      return;
    }

    const template = {
      subject: `Zahlungserinnerung - Rechnung ${invoice.id}`,
      body: `Hallo ${coachee.firstName},

ich hoffe, es geht dir gut!

Mir ist aufgefallen, dass die Rechnung über ${formatCurrency(invoice.amount)} vom ${invoice.dueDate} noch offen ist.

${invoice.status === 'overdue' 
  ? `Die Rechnung ist bereits ${invoice.daysOverdue} Tage überfällig.` 
  : 'Die Rechnung wird bald fällig.'}

Könntest du bitte einen Blick darauf werfen? Falls es Fragen gibt oder sich etwas geändert hat, melde dich gerne bei mir.

Vielen Dank für dein Verständnis!

Beste Grüße,
[Dein Name]

---
Rechnungsdetails:
Betrag: ${formatCurrency(invoice.amount)}
Fälligkeitsdatum: ${invoice.dueDate}
Rechnungsnummer: ${invoice.id}`
    };
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
    window.open(mailtoUrl);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusBadge = (status, daysOverdue) => {
    if (status === 'overdue') {
      return <Badge variant="destructive" className="text-xs">Überfällig ({daysOverdue} Tage)</Badge>;
    }
    if (status === 'due_soon') {
      return <Badge variant="secondary" className="text-xs">Fällig bald</Badge>;
    }
    return <Badge variant="default" className="text-xs">Offen</Badge>;
  };

  return (
    <Card className="glass-card-enhanced">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium text-foreground">
          <Receipt className="mr-2 h-4 w-4 text-primary" />
          Offene Rechnungen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {openInvoices.length > 0 ? (
          <>
            {openInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{invoice.clientName}</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(invoice.amount)}</p>
                  <div className="flex items-center mt-1">
                    {invoice.status === 'overdue' ? (
                      <AlertCircle className="h-3 w-3 text-destructive mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                    )}
                    <span className="text-xs text-muted-foreground">Fällig: {invoice.dueDate}</span>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  {getStatusBadge(invoice.status, invoice.daysOverdue)}
                  {(invoice.status === 'overdue' || invoice.status === 'due_soon') && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-7 w-full hover:bg-orange-50 hover:border-orange-300"
                      onClick={() => sendMahnung(invoice)}
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      {invoice.status === 'overdue' ? 'Mahnen' : 'Erinnern'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Link to="/invoices">
              <Button variant="outline" size="sm" className="w-full mt-3">
                Alle Rechnungen anzeigen
              </Button>
            </Link>
          </>
        ) : (
          <div className="text-center py-4">
            <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Keine offenen Rechnungen</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpenInvoices;