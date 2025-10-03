import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, User, Calendar, Filter, X, Plus, Download, Eye, Edit, Trash2, DollarSign, FileText, Clock, CheckCircle, AlertCircle, Euro, Send, MoreVertical, Repeat, Play, Pause } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAppStateContext } from '@/context/AppStateContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const InvoicesApp = () => {
  // Context für echte Daten
  const { state, actions } = useAppStateContext();
  const { invoices, serviceRates, recurringInvoices, coachees, settings } = state;
  const { setInvoices, setServiceRates, setRecurringInvoices, removeInvoice, updateInvoice } = actions;
  
  // Navigation und Location für URL-Parameter
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Filter States
  const [coacheeFilter, setCoacheeFilter] = useState(null);
  const [coacheeName, setCoacheeName] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Basis States
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showNewModal, setShowNewModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [selectedRecurring, setSelectedRecurring] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);

  // === NEU: Action-Handler States ===
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState({
    invoiceNumber: '',
    description: '',
    total: '',
    status: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Neue Rechnung
  const [newInvoice, setNewInvoice] = useState({
    coacheeId: null,
    coacheeName: '',
    amount: '',
    description: '',
    dueDate: '',
    status: 'draft',
    currency: 'EUR'
  });

  // Neue wiederkehrende Rechnung
  const [newRecurring, setNewRecurring] = useState({
    coacheeId: null,
    coacheeName: '',
    rateId: null,
    quantity: 1,
    interval: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    currency: 'EUR',
    status: 'active'
  });

  // Neuer Honorarsatz
  const [newRate, setNewRate] = useState({
    name: '',
    price: '',
    currency: 'EUR',
    description: ''
  });

  // === NEU: Action-Handler ===
  const handleViewInvoice = (invoice) => {
    navigate(`/invoices/edit/${invoice.id}`);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setEditingInvoice({
      invoiceNumber: invoice.invoiceNumber,
      description: invoice.description || '',
      total: invoice.total?.toString() || '',
      status: invoice.status || 'draft'
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedInvoice && editingInvoice.description && editingInvoice.total) {
      const updatedInvoice = {
        ...selectedInvoice,
        invoiceNumber: editingInvoice.invoiceNumber,
        description: editingInvoice.description,
        total: parseFloat(editingInvoice.total),
        status: editingInvoice.status
      };
      
      updateInvoice(updatedInvoice);
      setShowEditModal(false);
      setSelectedInvoice(null);
      
      toast({
        title: "Rechnung aktualisiert",
        description: `${updatedInvoice.invoiceNumber} wurde erfolgreich bearbeitet`,
        className: "bg-green-600 text-white"
      });
    }
  };

  const handleDownloadInvoice = (invoice) => {
    toast({
      title: "Download nicht verfügbar",
      description: "PDF-Download ist in der Demo-Version nicht verfügbar. In der Vollversion können Sie hier Rechnungen als PDF herunterladen.",
      className: "bg-red-600 text-white",
      duration: 4000
    });
  };

  const handleDeleteInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (selectedInvoice) {
      setIsDeleting(true);
      
      // Simuliere kurze Verzögerung
      setTimeout(() => {
        removeInvoice(selectedInvoice.id);
        setShowDeleteAlert(false);
        setSelectedInvoice(null);
        setIsDeleting(false);
        
        toast({
          title: "Rechnung gelöscht",
          description: `${selectedInvoice.invoiceNumber} wurde dauerhaft gelöscht`,
          className: "bg-green-600 text-white"
        });
      }, 500);
    }
  };

  // URL-Parameter-Auswertung für Coachee-Filter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const coacheeId = urlParams.get('coachee');
    const name = urlParams.get('name');
    
    if (coacheeId && name) {
      setCoacheeFilter(coacheeId);
      setCoacheeName(decodeURIComponent(name.replace(/\+/g, ' ')));
      
      toast({
        title: "Filter aktiv",
        description: `Zeige nur Rechnungen von ${decodeURIComponent(name.replace(/\+/g, ' '))}`,
        className: "bg-green-600 text-white"
      });
    }
  }, [location.search, toast]);

  // Coachee-Filter zurücksetzen
  const clearCoacheeFilter = () => {
    setCoacheeFilter(null);
    setCoacheeName('');
    navigate(location.pathname, { replace: true });
    
    toast({
      title: "Filter entfernt",
      description: "Zeige alle Rechnungen",
      className: "bg-blue-600 text-white"
    });
  };

  // Filter Funktionen
  const handleCoacheeFilter = (coacheeId, coacheeName) => {
    if (coacheeFilter === coacheeId) {
      clearCoacheeFilter();
    } else {
      setCoacheeFilter(coacheeId);
      setCoacheeName(coacheeName);
      
      toast({
        title: "Filter gesetzt",
        description: `Zeige nur Rechnungen von ${coacheeName}`,
        className: "bg-blue-600 text-white"
      });
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status === statusFilter ? 'all' : status);
  };

  const handleDateFilter = (filter) => {
    setDateFilter(filter === dateFilter ? 'all' : filter);
  };

  // Gefilterte Rechnungen
  const filteredInvoices = (invoices || []).filter(invoice => {
    if (coacheeFilter && invoice.coacheeId !== parseInt(coacheeFilter)) {
      return false;
    }
    
    if (statusFilter !== 'all' && invoice.status !== statusFilter) {
      return false;
    }
    
    if (dateFilter !== 'all') {
      const today = new Date();
      const invoiceDate = new Date(invoice.date);
      
      if (dateFilter === 'today') {
        if (today.toDateString() !== invoiceDate.toDateString()) return false;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (invoiceDate < weekAgo) return false;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (invoiceDate < monthAgo) return false;
      }
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        invoice.invoiceNumber?.toLowerCase().includes(searchLower) ||
        invoice.description?.toLowerCase().includes(searchLower) ||
        (invoice.coacheeName && invoice.coacheeName.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Währungsformatierung
  const formatCurrency = (amount, currency = 'EUR') => {
    const currencies = {
      EUR: { symbol: '€', position: 'after' },
      USD: { symbol: '$', position: 'before' },
      CHF: { symbol: 'CHF', position: 'after' }
    };
    
    const config = currencies[currency] || currencies.EUR;
    const formatted = amount.toFixed(2);
    
    return config.position === 'before' 
      ? `${config.symbol}${formatted}`
      : `${formatted}${config.symbol}`;
  };

  // Handler für Coachee-Auswahl
  const handleCoacheeSelection = (selectedCoacheeId, setState) => {
    if (selectedCoacheeId === '') {
      setState(prev => ({ 
        ...prev, 
        coacheeId: null,
        coacheeName: ''
      }));
    } else {
      const selectedCoachee = (coachees || []).find(c => c.id.toString() === selectedCoacheeId);
      if (selectedCoachee) {
        setState(prev => ({ 
          ...prev, 
          coacheeId: selectedCoacheeId,
          coacheeName: `${selectedCoachee.firstName} ${selectedCoachee.lastName}`
        }));
      }
    }
  };

  // Neue Rechnung speichern
  const saveNewInvoice = () => {
    if (newInvoice.amount && newInvoice.description && newInvoice.dueDate) {
      const invoice = {
        id: Date.now(),
        invoiceNumber: `RE-2025-${String((invoices?.length || 0) + 1).padStart(3, '0')}`,
        coacheeId: newInvoice.coacheeId ? parseInt(newInvoice.coacheeId) : null,
        coacheeName: newInvoice.coacheeName,
        total: parseFloat(newInvoice.amount),
        description: newInvoice.description,
        date: new Date().toISOString().split('T')[0],
        dueDate: newInvoice.dueDate,
        status: newInvoice.status,
        currency: newInvoice.currency,
        paidDate: null
      };
      
      setInvoices([...(invoices || []), invoice]);
      setNewInvoice({ coacheeId: null, coacheeName: '', amount: '', description: '', dueDate: '', status: 'draft', currency: 'EUR' });
      setShowNewModal(false);
      
      toast({
        title: "Rechnung erstellt",
        description: `${invoice.invoiceNumber} erfolgreich angelegt`,
        className: "bg-green-600 text-white"
      });
    }
  };

  // Neue wiederkehrende Rechnung speichern
  const saveNewRecurring = () => {
    if (newRecurring.coacheeId && newRecurring.rateId) {
      const rate = (serviceRates || []).find(r => r.id === parseInt(newRecurring.rateId));
      const recurring = {
        id: Date.now(),
        coacheeId: parseInt(newRecurring.coacheeId),
        coacheeName: newRecurring.coacheeName,
        rateId: parseInt(newRecurring.rateId),
        quantity: newRecurring.quantity,
        interval: newRecurring.interval,
        startDate: newRecurring.startDate,
        currency: newRecurring.currency,
        status: newRecurring.status,
        nextDueDate: newRecurring.startDate
      };
      
      setRecurringInvoices([...(recurringInvoices || []), recurring]);
      setNewRecurring({
        coacheeId: null,
        coacheeName: '',
        rateId: null,
        quantity: 1,
        interval: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        currency: 'EUR',
        status: 'active'
      });
      setShowRecurringModal(false);
      
      toast({
        title: "Abonnement erstellt",
        description: "Wiederkehrende Rechnung erfolgreich angelegt",
        className: "bg-green-600 text-white"
      });
    }
  };

  // Neuen Honorarsatz speichern
  const saveNewRate = () => {
    if (newRate.name && newRate.price) {
      const rate = {
        id: Date.now(),
        name: newRate.name,
        price: parseFloat(newRate.price),
        currency: newRate.currency,
        description: newRate.description
      };
      
      setServiceRates([...(serviceRates || []), rate]);
      setNewRate({ name: '', price: '', currency: 'EUR', description: '' });
      setShowRatesModal(false);
      
      toast({
        title: "Honorarsatz erstellt",
        description: `${rate.name} erfolgreich angelegt`,
        className: "bg-green-600 text-white"
      });
    }
  };

  // Status-Badge Komponente
  const StatusBadge = ({ status }) => {
    const configs = {
      draft: { color: 'bg-slate-600/20 text-slate-400', icon: FileText, label: 'Entwurf' },
      sent: { color: 'bg-blue-600/20 text-blue-400', icon: Send, label: 'Versendet' },
      paid: { color: 'bg-green-600/20 text-green-400', icon: CheckCircle, label: 'Bezahlt' },
      overdue: { color: 'bg-red-600/20 text-red-400', icon: AlertCircle, label: 'Überfällig' }
    };
    
    const config = configs[status] || configs.draft;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  // Button-Filter Komponente
  const FilterButton = ({ active, onClick, children, icon: Icon, count }) => (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2 rounded-lg text-sm font-medium transition-all
        flex items-center gap-2
        ${active 
          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
          : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
        }
      `}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
      {count !== undefined && (
        <span className={`
          px-1.5 py-0.5 rounded text-xs
          ${active ? 'bg-white/20' : 'bg-slate-600/50'}
        `}>
          {count}
        </span>
      )}
      {active && (
        <X className="h-3 w-3 ml-1 opacity-70 hover:opacity-100" />
      )}
    </button>
  );

  // Statistiken berechnen
  const stats = {
    total: filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
    paid: filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0),
    pending: filteredInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + (inv.total || 0), 0),
    overdue: filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total || 0), 0)
  };

  return (
    <>
      <Helmet>
        <title>Rechnungen - Coachingspace</title>
        <meta name="description" content="Verwalte deine Coaching-Rechnungen, behalte den Überblick über Zahlungen und erstelle neue Abrechnungen." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                Rechnungen
              </h1>
              <p className="text-slate-400 text-sm">Rechnungsmanagement für Coaching-Sessions</p>
            </div>
          </div>

          <Tabs defaultValue="invoices" className="space-y-4">
            <TabsList className="bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger value="invoices" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600">
                Rechnungen
              </TabsTrigger>
              <TabsTrigger value="recurring" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600">
                Abonnements
              </TabsTrigger>
              <TabsTrigger value="rates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600">
                Honorarsätze
              </TabsTrigger>
            </TabsList>

            {/* Rechnungen Tab */}
            <TabsContent value="invoices" className="space-y-6">
              {/* Statistiken */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Euro className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Gesamt</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(stats.total)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Bezahlt</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(stats.paid)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600/20 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Ausstehend</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(stats.pending)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600/20 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Überfällig</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(stats.overdue)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Neue Rechnung Button */}
              <div className="flex gap-4">
                <div className="flex-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechnungen, Coachees oder Beschreibungen durchsuchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-700/40 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => setShowNewModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Neue Rechnung
                </button>
                
                <button
                  onClick={() => navigate('/invoices/new')}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50 rounded-lg transition-all text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Detailliert erstellen
                </button>
              </div>

              {/* Button-Filter */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                {/* Coachee Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nach Coachee filtern
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <FilterButton
                      active={!coacheeFilter}
                      onClick={() => clearCoacheeFilter()}
                      count={invoices?.length || 0}
                    >
                      Alle Coachees
                    </FilterButton>
                    {(coachees || []).map(coachee => {
                      const coacheeInvoices = (invoices || []).filter(inv => inv.coacheeId === coachee.id);
                      const isActive = coacheeFilter === coachee.id.toString();
                      return (
                        <FilterButton
                          key={coachee.id}
                          active={isActive}
                          onClick={() => handleCoacheeFilter(coachee.id.toString(), `${coachee.firstName} ${coachee.lastName}`)}
                          count={coacheeInvoices.length}
                        >
                          {coachee.firstName} {coachee.lastName}
                        </FilterButton>
                      );
                    })}
                  </div>
                </div>

                {/* Status & Datum Filter */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Status Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Nach Status filtern
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <FilterButton
                        active={statusFilter === 'draft'}
                        onClick={() => handleStatusFilter('draft')}
                        count={(invoices || []).filter(inv => inv.status === 'draft').length}
                      >
                        Entwürfe
                      </FilterButton>
                      <FilterButton
                        active={statusFilter === 'sent'}
                        onClick={() => handleStatusFilter('sent')}
                        count={(invoices || []).filter(inv => inv.status === 'sent').length}
                      >
                        Versendet
                      </FilterButton>
                      <FilterButton
                        active={statusFilter === 'paid'}
                        onClick={() => handleStatusFilter('paid')}
                        count={(invoices || []).filter(inv => inv.status === 'paid').length}
                      >
                        Bezahlt
                      </FilterButton>
                      <FilterButton
                        active={statusFilter === 'overdue'}
                        onClick={() => handleStatusFilter('overdue')}
                        count={(invoices || []).filter(inv => inv.status === 'overdue').length}
                      >
                        Überfällig
                      </FilterButton>
                    </div>
                  </div>

                  {/* Datum Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Nach Datum filtern
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <FilterButton
                        active={dateFilter === 'today'}
                        onClick={() => handleDateFilter('today')}
                      >
                        Heute
                      </FilterButton>
                      <FilterButton
                        active={dateFilter === 'week'}
                        onClick={() => handleDateFilter('week')}
                      >
                        Diese Woche
                      </FilterButton>
                      <FilterButton
                        active={dateFilter === 'month'}
                        onClick={() => handleDateFilter('month')}
                      >
                        Dieser Monat
                      </FilterButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ergebnisse */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {coacheeFilter ? `${coacheeName}s Rechnungen` : 'Alle Rechnungen'}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {filteredInvoices.length} von {invoices?.length || 0} Rechnungen
                    {coacheeFilter && ` • Gefiltert nach ${coacheeName}`}
                  </p>
                </div>
              </div>

              {/* Rechnungs-Liste */}
              <div className="space-y-3">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-medium text-white">{invoice.invoiceNumber}</h3>
                            <StatusBadge status={invoice.status} />
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(invoice.date).toLocaleDateString('de-DE')}
                            </span>
                            {invoice.coacheeName && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {invoice.coacheeName}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(invoice.total || 0, invoice.currency)}
                            </span>
                          </div>
                          
                          <p className="text-slate-300 text-sm">{invoice.description}</p>
                        </div>
                        
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleViewInvoice(invoice)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 rounded transition-colors" 
                            title="Ansehen"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditInvoice(invoice)}
                            className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded transition-colors" 
                            title="Bearbeiten"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="p-1.5 text-green-400 hover:text-green-300 hover:bg-slate-700/50 rounded transition-colors" 
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteInvoice(invoice)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded transition-colors" 
                            title="Löschen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {invoice.status === 'overdue' && (
                        <div className="mt-3 p-2 bg-red-600/10 border border-red-600/20 rounded-lg">
                          <p className="text-red-400 text-xs">
                            Fällig seit: {new Date(invoice.dueDate).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Keine Rechnungen gefunden
                    </h3>
                    <p className="text-slate-400 mb-4">
                      Für die aktuellen Filter gibt es keine Rechnungen.
                    </p>
                    <button
                      onClick={() => {
                        clearCoacheeFilter();
                        setStatusFilter('all');
                        setDateFilter('all');
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                    >
                      Alle Filter zurücksetzen
                    </button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Abonnements Tab */}
            <TabsContent value="recurring" className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white">Abonnements & Wiederkehrende Rechnungen</h2>
                  <p className="text-slate-400 text-sm">Verwalte deine wiederkehrenden Einnahmen und Abo-Modelle</p>
                </div>
                
                <button
                  onClick={() => setShowRecurringModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Neues Abo
                </button>
              </div>

              {/* Wiederkehrende Rechnungen Liste */}
              <div className="space-y-3">
                {(recurringInvoices || []).length > 0 ? (
                  (recurringInvoices || []).map((recurring) => {
                    const rate = (serviceRates || []).find(r => r.id === recurring.rateId);
                    return (
                      <div key={recurring.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Repeat className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-white">{rate?.name || 'Unbekannter Satz'} ({recurring.quantity}x)</p>
                              <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                                <User className="h-4 w-4" />
                                {recurring.coacheeName}
                              </p>
                              <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4" />
                                Nächste Rechnung am: {new Date(recurring.nextDueDate).toLocaleDateString('de-DE')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={recurring.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}>
                              {recurring.status === 'active' ? 'Aktiv' : 'Pausiert'}
                            </Badge>
                            <p className="text-lg font-bold text-blue-400">
                              {formatCurrency((rate?.price || 0) * recurring.quantity, recurring.currency)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Repeat className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Keine Abonnements gefunden</h3>
                    <p className="text-slate-400 mb-4">Erstelle dein erstes Abonnement, um loszulegen.</p>
                    <button
                      onClick={() => setShowRecurringModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Erstes Abo erstellen
                    </button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Honorarsätze Tab */}
            <TabsContent value="rates" className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white">Honorarsätze</h2>
                  <p className="text-slate-400 text-sm">Definiere deine Standard-Preise für verschiedene Services</p>
                </div>
                
                <button
                  onClick={() => setShowRatesModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Neuer Satz
                </button>
              </div>

              {/* Honorarsätze Liste */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(serviceRates || []).length > 0 ? (
                  (serviceRates || []).map((rate) => (
                    <div key={rate.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-medium text-white">{rate.name}</h3>
                          <p className="text-2xl font-bold text-blue-400 mt-1">
                            {formatCurrency(rate.price, rate.currency)}
                          </p>
                          {rate.description && (
                            <p className="text-sm text-slate-400 mt-2">{rate.description}</p>
                          )}
                        </div>
                        <button className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <DollarSign className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Keine Honorarsätze gefunden</h3>
                    <p className="text-slate-400 mb-4">Erstelle deinen ersten Honorarsatz, um loszulegen.</p>
                    <button
                      onClick={() => setShowRatesModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ersten Satz erstellen
                    </button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Neue Rechnung Modal */}
          {showNewModal && (
            <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Neue Rechnung</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Erstelle eine einfache Rechnung für deine Coachees.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300 mb-2 block">Betrag</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="150.00"
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600/50 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-slate-300 mb-2 block">Währung</Label>
                      <div className="flex flex-wrap gap-2">
                        {['EUR', 'USD', 'CHF'].map(currency => (
                          <button
                            key={currency}
                            onClick={() => setNewInvoice(prev => ({ ...prev, currency }))}
                            className={`
                              px-3 py-2 rounded-lg text-sm font-medium transition-all
                              ${newInvoice.currency === currency
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                                : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                              }
                            `}
                          >
                            {currency}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-slate-300 mb-2 block">Fälligkeitsdatum</Label>
                    <Input
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600/50 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-300 mb-2 block">Beschreibung</Label>
                    <textarea
                      placeholder="z.B. Coaching Session Paket (3 Sessions)..."
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-300 mb-2 block">Coachee zuweisen</Label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCoacheeSelection('', setNewInvoice)}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${!newInvoice.coacheeId 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                            : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                          }
                        `}
                      >
                        Allgemeine Rechnung
                      </button>
                      {(coachees || []).map(coachee => (
                        <button
                          key={coachee.id}
                          onClick={() => handleCoacheeSelection(coachee.id.toString(), setNewInvoice)}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all
                            ${newInvoice.coacheeId === coachee.id.toString()
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                              : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                            }
                          `}
                        >
                          {coachee.firstName} {coachee.lastName}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-slate-300 mb-2 block">Status</Label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setNewInvoice(prev => ({ ...prev, status: 'draft' }))}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${newInvoice.status === 'draft'
                            ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white' 
                            : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                          }
                        `}
                      >
                        Entwurf
                      </button>
                      <button
                        onClick={() => setNewInvoice(prev => ({ ...prev, status: 'sent' }))}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${newInvoice.status === 'sent'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                            : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                          }
                        `}
                      >
                        Direkt versenden
                      </button>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      Abbrechen
                    </Button>
                  </DialogClose>
                  <Button 
                    onClick={saveNewInvoice}
                    disabled={!newInvoice.amount || !newInvoice.description || !newInvoice.dueDate}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-600"
                  >
                    Rechnung erstellen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* === NEU: Edit Modal === */}
          {showEditModal && (
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Rechnung bearbeiten</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Bearbeite die Details der ausgewählten Rechnung.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300 mb-2 block">Rechnungsnummer</Label>
                    <Input
                      value={editingInvoice.invoiceNumber}
                      onChange={(e) => setEditingInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600/50 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Beschreibung</Label>
                    <textarea
                      value={editingInvoice.description}
                      onChange={(e) => setEditingInvoice(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Betrag</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingInvoice.total}
                      onChange={(e) => setEditingInvoice(prev => ({ ...prev, total: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600/50 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {['draft', 'sent', 'paid', 'overdue'].map(status => (
                        <button
                          key={status}
                          onClick={() => setEditingInvoice(prev => ({ ...prev, status }))}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize
                            ${editingInvoice.status === status
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                              : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                            }
                          `}
                        >
                          {status === 'draft' && 'Entwurf'}
                          {status === 'sent' && 'Versendet'}
                          {status === 'paid' && 'Bezahlt'}
                          {status === 'overdue' && 'Überfällig'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      Abbrechen
                    </Button>
                  </DialogClose>
                  <Button 
                    onClick={handleSaveEdit}
                    disabled={!editingInvoice.description || !editingInvoice.total}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Speichern
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* === NEU: Delete Alert === */}
          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Rechnung löschen</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Möchtest du die Rechnung "{selectedInvoice?.invoiceNumber}" wirklich dauerhaft löschen? 
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Abbrechen
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? 'Wird gelöscht...' : 'Dauerhaft löschen'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Neue wiederkehrende Rechnung Modal */}
          {showRecurringModal && (
            <Dialog open={showRecurringModal} onOpenChange={setShowRecurringModal}>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Neues Abonnement erstellen</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Richte wiederkehrende Rechnungen für deine Coachees ein.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300 mb-2 block">Coachee</Label>
                    <div className="flex flex-wrap gap-2">
                      {(coachees || []).map(coachee => (
                        <button
                          key={coachee.id}
                          onClick={() => handleCoacheeSelection(coachee.id.toString(), setNewRecurring)}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all
                            ${newRecurring.coacheeId === coachee.id.toString()
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                              : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                            }
                          `}
                        >
                          {coachee.firstName} {coachee.lastName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Honorarsatz</Label>
                    <div className="flex flex-wrap gap-2">
                      {(serviceRates || []).map(rate => (
                        <button
                          key={rate.id}
                          onClick={() => setNewRecurring(prev => ({ ...prev, rateId: rate.id }))}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all
                            ${newRecurring.rateId === rate.id
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                              : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                            }
                          `}
                        >
                          {rate.name} ({formatCurrency(rate.price, rate.currency)})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-300 mb-2 block">Anzahl</Label>
                      <Input
                        type="number"
                        min="1"
                        value={newRecurring.quantity}
                        onChange={(e) => setNewRecurring(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        className="bg-slate-700/50 border-slate-600/50 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-2 block">Intervall</Label>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { value: 'monthly', label: 'Monatlich' },
                          { value: 'quarterly', label: 'Quartal' },
                          { value: 'yearly', label: 'Jährlich' }
                        ].map(interval => (
                          <button
                            key={interval.value}
                            onClick={() => setNewRecurring(prev => ({ ...prev, interval: interval.value }))}
                            className={`
                              px-2 py-1 rounded text-xs font-medium transition-all
                              ${newRecurring.interval === interval.value
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                                : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 border border-slate-600/50'
                              }
                            `}
                          >
                            {interval.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-2 block">Startdatum</Label>
                      <Input
                        type="date"
                        value={newRecurring.startDate}
                        onChange={(e) => setNewRecurring(prev => ({ ...prev, startDate: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600/50 text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      Abbrechen
                    </Button>
                  </DialogClose>
                  <Button 
                    onClick={saveNewRecurring}
                    disabled={!newRecurring.coacheeId || !newRecurring.rateId}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Abonnement erstellen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Neuer Honorarsatz Modal */}
          {showRatesModal && (
            <Dialog open={showRatesModal} onOpenChange={setShowRatesModal}>
              <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Neuer Honorarsatz</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Definiere einen neuen Standard-Preis für deine Services.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300 mb-2 block">Name</Label>
                    <Input
                      placeholder="z.B. Standard Coaching Session"
                      value={newRate.name}
                      onChange={(e) => setNewRate(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600/50 text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300 mb-2 block">Preis</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="150.00"
                        value={newRate.price}
                        onChange={(e) => setNewRate(prev => ({ ...prev, price: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600/50 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-2 block">Währung</Label>
                      <div className="flex gap-2">
                        {['EUR', 'USD', 'CHF'].map(currency => (
                          <button
                            key={currency}
                            onClick={() => setNewRate(prev => ({ ...prev, currency }))}
                            className={`
                              px-3 py-2 rounded-lg text-sm font-medium transition-all
                              ${newRate.currency === currency
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                                : 'bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/50'
                              }
                            `}
                          >
                            {currency}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300 mb-2 block">Beschreibung (optional)</Label>
                    <textarea
                      placeholder="Beschreibung des Services..."
                      value={newRate.description}
                      onChange={(e) => setNewRate(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      Abbrechen
                    </Button>
                  </DialogClose>
                  <Button 
                    onClick={saveNewRate}
                    disabled={!newRate.name || !newRate.price}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Honorarsatz erstellen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoicesApp;