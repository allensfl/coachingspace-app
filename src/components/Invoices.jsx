import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceRates from '@/components/invoices/ServiceRates';
import InvoicesList from '@/components/invoices/InvoicesList';
import { RecurringInvoices } from '@/components/invoices/RecurringInvoices';
import { useAppStateContext } from '@/context/AppStateContext';

export default function Invoices() {
  const { state, actions } = useAppStateContext();
  const { invoices, serviceRates, recurringInvoices, coachees, settings } = state;
  const { setInvoices, setServiceRates, setRecurringInvoices } = actions;
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Rechnungen - Coachingspace</title>
        <meta name="description" content="Verwalte deine Coaching-Rechnungen, behalte den Überblick über Zahlungen und erstelle neue Abrechnungen." />
      </Helmet>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Rechnungen</TabsTrigger>
          <TabsTrigger value="recurring">Abonnements</TabsTrigger>
          <TabsTrigger value="rates">Honorarsätze</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <InvoicesList 
            invoices={invoices} 
            setInvoices={setInvoices} 
            onNewInvoice={() => navigate('/invoices/new')} 
            onEditInvoice={(id) => navigate(`/invoices/edit/${id}`)}
            settings={settings} 
            coachees={coachees} 
          />
        </TabsContent>
        <TabsContent value="recurring">
            <RecurringInvoices 
              recurringInvoices={recurringInvoices || []} 
              setRecurringInvoices={setRecurringInvoices} 
              coachees={coachees || []} 
              serviceRates={serviceRates || []} 
            />
        </TabsContent>
        <TabsContent value="rates">
          <ServiceRates rates={serviceRates} setRates={setServiceRates} />
        </TabsContent>
      </Tabs>
    </>
  );
}