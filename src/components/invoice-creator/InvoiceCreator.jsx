import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import InvoiceDetails from '@/components/invoice-creator/InvoiceDetails';
import InvoiceItems from '@/components/invoice-creator/InvoiceItems';
import UnbilledSessions from '@/components/invoice-creator/UnbilledSessions';
import InvoiceSummary from '@/components/invoice-creator/InvoiceSummary';
import { InvoiceStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { generateInvoicePDF } from '@/lib/pdf';
import InvoiceHeader from '@/components/invoice-creator/InvoiceHeader';
import { useAppStateContext } from '@/context/AppStateContext';
import { Loader2 } from 'lucide-react';

const InvoiceCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, actions } = useAppStateContext();
  const { isLoading, settings, coachees, sessions, serviceRates, invoices } = state;
  const { setInvoices, setSessions } = actions;
  
  const isNew = !id;

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      if (isNew) {
        const generateNewInvoiceNumber = () => {
          if (!invoices || invoices.length === 0) {
            return `CS-${new Date().getFullYear()}-001`;
          }
          const lastInvoice = invoices.sort((a,b) => b.invoiceNumber.localeCompare(a.invoiceNumber))[0];
          const lastInvoiceNumber = lastInvoice.invoiceNumber;
          
          if (!lastInvoiceNumber || typeof lastInvoiceNumber !== 'string' || !lastInvoiceNumber.includes('-')) {
              return `CS-${new Date().getFullYear()}-001`;
          }
          const parts = lastInvoiceNumber.split('-');
          const yearPart = parts[1];
          const numPart = parts[parts.length - 1];
          const currentYear = new Date().getFullYear().toString();
      
          if (yearPart !== currentYear) {
            return `CS-${currentYear}-001`;
          }
      
          const newNum = parseInt(numPart, 10) + 1;
          return `CS-${currentYear}-${String(newNum).padStart(numPart.length, '0')}`;
        };

        const defaultPaymentDeadlineDays = settings?.company?.paymentDeadlineDays || 14;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + parseInt(defaultPaymentDeadlineDays, 10));

        setInvoice({
          id: `new_${Date.now()}`,
          coacheeId: '',
          items: [],
          taxRate: settings?.company?.defaultTaxRate || 19.0,
          currency: settings?.company?.defaultCurrency || 'EUR',
          invoiceNumber: generateNewInvoiceNumber(),
          date: new Date().toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          status: InvoiceStatus.DRAFT,
          title: "Coaching & Beratung"
        });
      } else {
        const existingInvoice = invoices.find(inv => inv.id.toString() === id);
        if (existingInvoice) {
          setInvoice(existingInvoice);
        } else {
          toast({ title: 'Fehler', description: 'Rechnung nicht gefunden.', variant: 'destructive' });
          navigate('/invoices');
        }
      }
    }
  }, [id, isNew, isLoading, invoices, settings, toast, navigate]);

  const [unbilledSessions, setUnbilledSessions] = useState([]);
  const selectedCoachee = coachees.find(c => c.id === parseInt(invoice?.coacheeId, 10));

  useEffect(() => {
    if (invoice?.coacheeId) {
      const coacheeSessions = sessions.filter(
        s => s.coacheeId === parseInt(invoice.coacheeId, 10) && s.status === 'completed' && !s.billed && !s.packageId
      );
      setUnbilledSessions(coacheeSessions);
    } else {
      setUnbilledSessions([]);
    }
  }, [invoice?.coacheeId, sessions]);
  
  const handleAddSession = (sessionId) => {
    const session = unbilledSessions.find(s => s.id === sessionId);
    if (!session) return;
    
    const standardRate = serviceRates.find(r => r.name.toLowerCase().includes("standard")) || { id: null, price: 120.00 };

    const newItem = {
      id: `session-${session.id}`,
      description: `Coaching Session: "${session.topic}" am ${new Date(session.date).toLocaleDateString('de-DE')}`,
      quantity: 1,
      price: standardRate.price,
      rateId: standardRate.id,
      isCustom: !standardRate.id,
      sessionId: session.id,
    };
    
    setInvoice(prev => ({...prev, items: [...prev.items, newItem]}));
    setUnbilledSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const calculateTotals = (items, taxRate) => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxAmount = subtotal * (parseFloat(taxRate) / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const updateInvoiceState = (status) => {
    if (!invoice.coacheeId || invoice.items.length === 0) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte wähle einen Coachee aus und füge mindestens eine Position hinzu.",
        variant: "destructive",
      });
      return null;
    }
    
    const { subtotal, taxAmount, total } = calculateTotals(invoice.items, invoice.taxRate);

    const finalInvoice = {
      ...invoice,
      status,
      subtotal,
      taxAmount,
      total,
      coacheeName: `${selectedCoachee.firstName} ${selectedCoachee.lastName}`,
      description: `${invoice.items.length} Position(en)`,
      items: invoice.items.map(({isCustom, sessionId, ...item}) => item)
    };
    
    setInvoices(prev => {
      const isExisting = prev.some(i => i.id === finalInvoice.id);
      if (isExisting) {
        return prev.map(i => i.id === finalInvoice.id ? finalInvoice : i);
      } else {
        const newFinalInvoice = { ...finalInvoice, id: Date.now() };
        return [...prev, newFinalInvoice].sort((a,b) => b.invoiceNumber.localeCompare(a.invoiceNumber));
      }
    });

    if (status !== InvoiceStatus.DRAFT) {
        const billedSessionIds = invoice.items.filter(item => item.sessionId).map(item => item.sessionId);
        setSessions(prev => prev.map(s => billedSessionIds.includes(s.id) ? { ...s, billed: true } : s));
    }
    
    return finalInvoice;
  };

  const handleSaveDraft = () => {
    const savedInvoice = updateInvoiceState(InvoiceStatus.DRAFT);
    if(savedInvoice) {
      toast({ title: "Entwurf gespeichert!", description: "Die Rechnung wurde erfolgreich gespeichert." });
      navigate('/invoices');
    }
  };
  
  const handleSaveAndSend = () => {
    const savedInvoice = updateInvoiceState(InvoiceStatus.SENT);
    if (savedInvoice) {
      toast({
          title: "🚧 Senden nicht implementiert",
          description: "Die Rechnung wurde als 'Gesendet' gespeichert. Die Senden-Funktion kann im nächsten Prompt angefordert werden. 🚀"
      });
      navigate('/invoices');
    }
  }

  const handleSaveAndDownload = () => {
    const savedInvoice = updateInvoiceState(InvoiceStatus.SENT);
    if (savedInvoice) {
        generateInvoicePDF(savedInvoice, selectedCoachee, settings.company);
        toast({ title: "PDF wird generiert", description: "Deine Rechnung wird heruntergeladen." });
        navigate('/invoices');
    }
  };

  if (isLoading || !invoice) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isNew ? 'Neue Rechnung' : `Rechnung ${invoice.invoiceNumber}`}</title>
        <meta name="description" content="Erstelle und verwalte Rechnungen für deine Coachees." />
      </Helmet>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-background text-foreground"
      >
        <div className=" p-4 sm:p-6 lg:p-8">
          <InvoiceHeader 
              onClose={() => navigate('/invoices')}
              isNew={isNew}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <InvoiceDetails
                invoice={invoice}
                setInvoice={setInvoice}
                coachees={coachees}
              />
              <InvoiceItems
                items={invoice.items}
                setItems={(newItems) => setInvoice(prev => ({ ...prev, items: newItems }))}
                serviceRates={serviceRates}
                currency={invoice.currency}
              />
              {invoice.coacheeId && (
                <UnbilledSessions 
                  sessions={unbilledSessions} 
                  onAddSession={handleAddSession} 
                />
              )}
            </div>
            <InvoiceSummary 
              items={invoice.items}
              taxRate={invoice.taxRate}
              currency={invoice.currency}
              onSaveDraft={handleSaveDraft}
              onSaveAndDownload={handleSaveAndDownload}
              onSaveAndSend={handleSaveAndSend}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default InvoiceCreator;