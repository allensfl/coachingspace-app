import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Calendar, User, Download, AlertCircle, CheckCircle, Clock, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { InvoiceStatus } from '@/types';
import { generateInvoicePDF } from '@/lib/pdf';

const InvoicesList = ({ invoices, onNewInvoice, onEditInvoice, setInvoices, settings, coachees }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  const handleStatusChange = (invoiceId, newStatus) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv)
    );
    toast({
      title: "Status aktualisiert!",
      description: `Rechnung wurde als "${getStatusText(newStatus)}" markiert.`,
    });
  };

  const filteredInvoices = useMemo(() => {
    if (filterStatus === 'all') return invoices.sort((a, b) => b.invoiceNumber.localeCompare(a.invoiceNumber));
    if (filterStatus === 'open') return invoices.filter(i => i.status === InvoiceStatus.SENT || i.status === InvoiceStatus.OVERDUE);
    return invoices.filter(invoice => invoice.status === filterStatus);
  }, [invoices, filterStatus]);

  const getStatusInfo = (status) => {
    switch (status) {
      case InvoiceStatus.PAID: return { text: 'Bezahlt', className: 'bg-green-500/20 text-green-400 border-green-500/30' };
      case InvoiceStatus.SENT: return { text: 'Gesendet', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case InvoiceStatus.DRAFT: return { text: 'Entwurf', className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
      case InvoiceStatus.OVERDUE: return { text: 'Überfällig', className: 'bg-red-500/20 text-red-400 border-red-500/30' };
      default: return { text: 'Unbekannt', className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
    }
  };

  const getStatusText = (status) => getStatusInfo(status).text;
  
  const handleDownloadInvoice = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    const coachee = coachees.find(c => c.id === invoice.coacheeId);
    generateInvoicePDF(invoice, coachee, settings.company);
  }

  const getCurrencySymbol = (currency) => {
    const symbols = { EUR: '€', USD: '$', CHF: 'CHF' };
    return symbols[currency] || currency;
  }

  const invoiceStats = useMemo(() => {
    const openInvoices = invoices.filter(i => i.status === InvoiceStatus.SENT || i.status === InvoiceStatus.OVERDUE);
    const overdueInvoices = invoices.filter(i => i.status === InvoiceStatus.OVERDUE);
    const paidLast30Days = invoices.filter(i => {
        if (i.status !== InvoiceStatus.PAID) return false;
        const paidDate = i.paidDate ? new Date(i.paidDate) : new Date(); // Assume today if not set for calculation
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return paidDate >= thirtyDaysAgo;
    });
    
    const totalOpen = openInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = paidLast30Days.reduce((sum, inv) => sum + inv.total, 0);

    return {
      openSum: totalOpen,
      overdueCount: overdueInvoices.length,
      paidSum: totalPaid,
    };
  }, [invoices]);

  const statCards = [
    { title: "Offene Rechnungen", value: `${invoiceStats.openSum.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}`, icon: Clock, color: "text-blue-400" },
    { title: "Überfällige Rechnungen", value: invoiceStats.overdueCount, icon: AlertCircle, color: "text-red-400" },
    { title: "Bezahlt (letzte 30 Tage)", value: `${invoiceStats.paidSum.toLocaleString('de-DE', {style: 'currency', currency: 'EUR'})}`, icon: CheckCircle, color: "text-green-400" },
  ];

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rechnungen</h1>
            <p className="text-muted-foreground">Verwalte deine Abrechnungen und Honorare</p>
          </div>
          <Button onClick={onNewInvoice}>
            <Plus className="mr-2 h-4 w-4" />
            Neue Rechnung
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((stat, index) => (
                <Card key={index} className="glass-card">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                            <div className="p-3 bg-primary/20 rounded-lg">
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap">
            <Button variant={filterStatus === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('all')}>Alle</Button>
            <Button variant={filterStatus === 'open' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('open')}>Offen</Button>
            <Button variant={filterStatus === 'paid' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('paid')}>Bezahlt</Button>
            <Button variant={filterStatus === 'draft' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('draft')}>Entwürfe</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {filteredInvoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="glass-card hover:bg-slate-800/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center flex-shrink-0"><FileText className="h-6 w-6" /></div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground text-lg">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusInfo(invoice.status).className}>{getStatusInfo(invoice.status).text}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2"><User className="mr-2 h-4 w-4" />{invoice.coacheeName}</div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2"><Calendar className="mr-2 h-4 w-4" />Erstellt: {new Date(invoice.date).toLocaleDateString('de-DE')} • Fällig: {new Date(invoice.dueDate).toLocaleDateString('de-DE')}</div>
                      <p className="text-sm text-slate-300">{invoice.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:flex-col lg:items-end gap-4 mt-4 lg:mt-0">
                    <p className="text-2xl font-bold text-foreground">{getCurrencySymbol(invoice.currency)}{invoice.total.toFixed(2)}</p>
                    <div className="flex gap-2">
                       <Select value={invoice.status} onValueChange={(newStatus) => handleStatusChange(invoice.id, newStatus)}>
                          <SelectTrigger className="w-[140px] h-9">
                              <SelectValue placeholder="Status ändern" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value={InvoiceStatus.DRAFT}>Entwurf</SelectItem>
                              <SelectItem value={InvoiceStatus.SENT}>Gesendet</SelectItem>
                              <SelectItem value={InvoiceStatus.PAID}>Bezahlt</SelectItem>
                              <SelectItem value={InvoiceStatus.OVERDUE}>Überfällig</SelectItem>
                          </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => onEditInvoice(invoice.id)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <Card className="glass-card"><CardContent className="p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Keine Rechnungen gefunden</h3>
          <p className="text-muted-foreground mb-4">{filterStatus !== 'all' ? 'Keine Rechnungen mit diesem Status vorhanden.' : 'Erstelle deine erste Rechnung, um zu beginnen.'}</p>
          {filterStatus === 'all' && (<Button onClick={onNewInvoice}><Plus className="mr-2 h-4 w-4" />Erste Rechnung erstellen</Button>)}
        </CardContent></Card>
      )}
    </div>
  );
};

export default InvoicesList;