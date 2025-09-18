import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, X, Plus, Filter, Euro, Clock } from 'lucide-react';

// Mock-Daten - ersetze durch echte Daten aus deinem System
const mockInvoices = [
  { 
    id: 101, 
    coacheeId: 1, 
    coacheeName: "Anna Schmidt", 
    amount: 250.00, 
    currency: "EUR", 
    date: "2024-01-15", 
    dueDate: "2024-02-15",
    status: "paid",
    description: "Coaching Session Januar"
  },
  { 
    id: 102, 
    coacheeId: 2, 
    coacheeName: "Max Weber", 
    amount: 180.50, 
    currency: "EUR", 
    date: "2024-01-20", 
    dueDate: "2024-02-20",
    status: "pending",
    description: "Einzelcoaching Work-Life-Balance"
  },
  { 
    id: 103, 
    coacheeId: 1, 
    coacheeName: "Anna Schmidt", 
    amount: 320.00, 
    currency: "EUR", 
    date: "2024-01-25", 
    dueDate: "2024-02-25",
    status: "overdue",
    description: "Führungskräfte-Training"
  },
  { 
    id: 104, 
    coacheeId: 3, 
    coacheeName: "Lisa Müller", 
    amount: 200.00, 
    currency: "EUR", 
    date: "2024-02-01", 
    dueDate: "2024-03-01",
    status: "draft",
    description: "Konfliktmanagement Coaching"
  }
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};

const formatAmount = (amount, currency) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const getStatusBadge = (status) => {
  const statusConfig = {
    paid: { label: 'Bezahlt', variant: 'default', color: 'bg-green-600' },
    pending: { label: 'Ausstehend', variant: 'secondary', color: 'bg-yellow-600' },
    overdue: { label: 'Überfällig', variant: 'destructive', color: 'bg-red-600' },
    draft: { label: 'Entwurf', variant: 'outline', color: 'bg-gray-600' }
  };
  
  const config = statusConfig[status] || statusConfig.draft;
  return (
    <Badge variant={config.variant} className={config.color}>
      {config.label}
    </Badge>
  );
};

export default function Invoices() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // URL-Parameter auslesen
  const coacheeFilter = searchParams.get('coachee');
  const nameFilter = searchParams.get('name');
  
  // Gefilterte Rechnungen basierend auf URL-Parametern und Suchbegriff
  const filteredInvoices = useMemo(() => {
    let filtered = mockInvoices;
    
    // Nach Coachee-ID filtern (URL-Parameter)
    if (coacheeFilter) {
      filtered = filtered.filter(invoice => invoice.coacheeId === parseInt(coacheeFilter));
    }
    
    // Nach Suchbegriff filtern
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.coacheeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toString().includes(searchTerm)
      );
    }
    
    return filtered;
  }, [coacheeFilter, searchTerm]);
  
  // Statistiken berechnen
  const stats = useMemo(() => {
    const total = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paid = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    const pending = filteredInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);
    
    return { total, paid, pending, overdue };
  }, [filteredInvoices]);
  
  // Filter entfernen
  const clearCoacheeFilter = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('coachee');
    newParams.delete('name');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);
  
  return (
    <div className="space-y-6">
      {/* Header mit Filter-Anzeige */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Rechnungen</h1>
          {coacheeFilter && nameFilter && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Gefiltert nach: {decodeURIComponent(nameFilter)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  onClick={clearCoacheeFilter}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          )}
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neue Rechnung
        </Button>
      </div>
      
      {/* Statistiken */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">
              {formatAmount(stats.total, 'EUR')}
            </div>
            <p className="text-sm text-muted-foreground">Gesamt</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">
              {formatAmount(stats.paid, 'EUR')}
            </div>
            <p className="text-sm text-muted-foreground">Bezahlt</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {formatAmount(stats.pending, 'EUR')}
            </div>
            <p className="text-sm text-muted-foreground">Ausstehend</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">
              {formatAmount(stats.overdue, 'EUR')}
            </div>
            <p className="text-sm text-muted-foreground">Überfällig</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Suchleiste */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechnungen durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {/* Rechnungen-Liste */}
      <div className="grid gap-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="glass-card hover:bg-slate-800/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">
                      Rechnung #{invoice.id}
                    </CardTitle>
                    <p className="text-sm text-slate-400 mt-1">
                      {invoice.coacheeName}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {invoice.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white mb-2">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      {formatDate(invoice.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Fällig: {formatDate(invoice.dueDate)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Bearbeiten
                    </Button>
                    <Button variant="outline" size="sm">
                      PDF
                    </Button>
                    {invoice.status === 'pending' && (
                      <Button variant="default" size="sm">
                        Als bezahlt markieren
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <Euro className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {coacheeFilter ? 
                  `Keine Rechnungen für ${decodeURIComponent(nameFilter || 'diesen Coachee')} gefunden` :
                  'Keine Rechnungen gefunden'
                }
              </h3>
              <p className="text-muted-foreground">
                {coacheeFilter ? 
                  'Für diesen Coachee sind noch keine Rechnungen erstellt.' :
                  'Erstellen Sie Ihre erste Rechnung.'
                }
              </p>
              {coacheeFilter && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearCoacheeFilter}
                >
                  Alle Rechnungen anzeigen
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}