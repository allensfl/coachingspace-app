import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Calendar, Filter, X, Plus, Upload, Settings, Edit, Trash2, CheckCircle, AlertCircle, FileText, Download, Eye, Share2, FolderOpen, AlertTriangle, Euro, Clock, Send, CreditCard, Repeat, DollarSign } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAppStateContext } from '@/context/AppStateContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { classes } from '../styles/standardClasses';

// Toast-System
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {toasts.map(toast => (
      <div
        key={toast.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 bg-gray-800 max-w-sm transform transition-all duration-300 ${
          toast.type === 'success' 
            ? 'border-l-green-500' 
            : 'border-l-red-500'
        }`}
      >
        {toast.type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-400" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-400" />
        )}
        <span className="text-sm font-medium text-white">{toast.message}</span>
        <button
          onClick={() => removeToast(toast.id)}
          className={classes.btnIcon + " ml-auto p-1 h-6 w-6"}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ))}
  </div>
);

// Honorarsätze Dialog
const RateEditorDialog = ({ open, onOpenChange, onSave, rate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('EUR');

    React.useEffect(() => {
        if (rate) {
            setName(rate.name || '');
            setDescription(rate.description || '');
            setPrice(rate.price?.toString() || '');
            setCurrency(rate.currency || 'EUR');
        } else {
            setName('');
            setDescription('');
            setPrice('');
            setCurrency('EUR');
        }
    }, [rate, open]);

    const handleSave = () => {
        if (!name.trim() || !price) return;

        const data = {
            id: rate ? rate.id : Date.now(),
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price) || 0,
            currency: currency,
        };
        onSave(data);
        onOpenChange(false);
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {rate ? 'Honorarsatz bearbeiten' : 'Neuen Honorarsatz erstellen'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Definiere deine Standard-Dienstleistungen und Preise.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-slate-300">Name</Label>
                        <Input 
                            id="name"
                            placeholder="z.B. Einzelcoaching (60 Min)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={classes.input}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-slate-300">Beschreibung</Label>
                        <Input 
                            id="description"
                            placeholder="Optionale Beschreibung..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className={classes.input}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price" className="text-slate-300">Preis</Label>
                            <Input 
                                id="price"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className={classes.input}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency" className="text-slate-300">Währung</Label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className={classes.select}
                            >
                                <option value="EUR">€ Euro</option>
                                <option value="CHF">CHF Franken</option>
                                <option value="USD">$ Dollar</option>
                            </select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <button className={classes.btnSecondary}>
                            Abbrechen
                        </button>
                    </DialogClose>
                    <button 
                        onClick={handleSave}
                        disabled={!name.trim() || !price}
                        className={classes.btnPrimary}
                        style={{ opacity: (!name.trim() || !price) ? 0.5 : 1 }}
                    >
                        Speichern
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Abonnement Dialog
const RecurringInvoiceDialog = ({ open, onOpenChange, onSave, coachees, serviceRates, recurringInvoice }) => {
    const [coacheeId, setCoacheeId] = useState('');
    const [rateId, setRateId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [interval, setInterval] = useState('monthly');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [currency, setCurrency] = useState('EUR');

    // Währungs-Formatierung
    const currencies = {
        EUR: { symbol: '€', name: 'Euro' },
        CHF: { symbol: 'CHF', name: 'Schweizer Franken' },
        USD: { symbol: '$', name: 'US Dollar' }
    };

    const formatCurrency = (amount, currency) => {
        const symbol = currencies[currency]?.symbol || currency;
        if (currency === 'CHF') {
            return `${symbol}${amount.toFixed(2)}`;
        }
        return `${amount.toFixed(2)}${symbol}`;
    };

    React.useEffect(() => {
        if (recurringInvoice) {
            setCoacheeId(recurringInvoice.coacheeId.toString());
            setRateId(recurringInvoice.rateId.toString());
            setQuantity(recurringInvoice.quantity);
            setInterval(recurringInvoice.interval);
            setStartDate(recurringInvoice.startDate);
            setCurrency(recurringInvoice.currency || 'EUR');
        } else {
            setCoacheeId('');
            setRateId('');
            setQuantity(1);
            setInterval('monthly');
            setStartDate(new Date().toISOString().split('T')[0]);
            setCurrency('EUR');
        }
    }, [recurringInvoice, open]);

    const handleSave = () => {
        const coachee = (coachees || []).find(c => c.id === parseInt(coacheeId));
        const rate = (serviceRates || []).find(r => r.id === parseInt(rateId));
        if (!coachee || !rate) return;

        const data = {
            id: recurringInvoice ? recurringInvoice.id : Date.now(),
            coacheeId: parseInt(coacheeId),
            coacheeName: `${coachee.firstName} ${coachee.lastName}`,
            rateId: parseInt(rateId),
            quantity,
            interval,
            startDate,
            currency: currency,
            status: recurringInvoice ? recurringInvoice.status : 'active',
            nextDueDate: startDate,
        };
        onSave(data);
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {recurringInvoice ? 'Abonnement bearbeiten' : 'Neues Abonnement erstellen'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Richte wiederkehrende Rechnungen für deine Coachees ein.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="coachee" className="text-slate-300">Coachee</Label>
                        <select
                            value={coacheeId}
                            onChange={(e) => setCoacheeId(e.target.value)}
                            className={classes.select}
                        >
                            <option value="">Coachee auswählen</option>
                            {(coachees || []).map(c => (
                                <option key={c.id} value={c.id.toString()}>
                                    {c.firstName} {c.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="rate" className="text-slate-300">Honorarsatz</Label>
                        <select
                            value={rateId}
                            onChange={(e) => setRateId(e.target.value)}
                            className={classes.select}
                        >
                            <option value="">Honorarsatz auswählen</option>
                            {(serviceRates || []).map(r => (
                                <option key={r.id} value={r.id.toString()}>
                                    {r.name} ({formatCurrency(r.price || 0, r.currency || 'EUR')})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="quantity" className="text-slate-300">Anzahl</Label>
                            <Input 
                                id="quantity" 
                                type="number" 
                                value={quantity} 
                                onChange={e => setQuantity(parseInt(e.target.value) || 1)} 
                                min="1"
                                className={classes.input}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency" className="text-slate-300">Währung</Label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className={classes.select}
                            >
                                <option value="EUR">€ Euro</option>
                                <option value="CHF">CHF Franken</option>
                                <option value="USD">$ Dollar</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="interval" className="text-slate-300">Intervall</Label>
                        <select
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            className={classes.select}
                        >
                            <option value="monthly">Monatlich</option>
                            <option value="quarterly">Quartalsweise</option>
                            <option value="yearly">Jährlich</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="start-date" className="text-slate-300">Startdatum</Label>
                        <Input 
                            id="start-date" 
                            type="date" 
                            value={startDate} 
                            onChange={e => setStartDate(e.target.value)}
                            className={classes.input}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <button className={classes.btnSecondary}>
                            Abbrechen
                        </button>
                    </DialogClose>
                    <button onClick={handleSave} className={classes.btnPrimary}>
                        Speichern
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const InvoicesApp = () => {
  // Context für echte Daten + Action-Handler
  const { state, actions } = useAppStateContext();
  const { coachees, invoices: contextInvoices, serviceRates: contextServiceRates, recurringInvoices: contextRecurringInvoices } = state;
  const { addInvoiceToContext, updateInvoiceInContext, removeInvoiceFromContext } = actions;
  
  // Navigation und Location
  const navigate = useNavigate();
  const location = useLocation();
  const { toast: useToastFn } = useToast();
  
  // Tab States
  const [activeTab, setActiveTab] = useState('rechnungen');
  
  // Service Rates States (local für Honorarsätze Tab)
  const [serviceRates, setServiceRates] = useState([]);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  
  // Recurring Invoices States (local für Abos Tab)
  const [recurringInvoices, setRecurringInvoices] = useState([]);
  const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false);
  const [selectedRecurring, setSelectedRecurring] = useState(null);
  
  // Toast-System
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error')
  };
  
  // Filter States für Rechnungen
  const [coacheeFilter, setCoacheeFilter] = useState(null);
  const [coacheeName, setCoacheeName] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States für Rechnungen
  const [showNewInvoiceDialog, setShowNewInvoiceDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Neue Rechnung States
  const [newInvoice, setNewInvoice] = useState({
    coacheeId: '',
    items: [{ description: '', quantity: 1, price: 0, rateId: '' }],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });

  // Rechnungen aus Context laden
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const validInvoices = Array.isArray(contextInvoices) ? contextInvoices : [];
    setInvoices(validInvoices);
  }, [contextInvoices]);

  useEffect(() => {
    const validRates = Array.isArray(contextServiceRates) ? contextServiceRates : [];
    setServiceRates(validRates);
  }, [contextServiceRates]);

  useEffect(() => {
    const validRecurring = Array.isArray(contextRecurringInvoices) ? contextRecurringInvoices : [];
    setRecurringInvoices(validRecurring);
  }, [contextRecurringInvoices]);

  // Währungs-Formatierung
  const currencies = {
      EUR: { symbol: '€', name: 'Euro' },
      CHF: { symbol: 'CHF', name: 'Schweizer Franken' },
      USD: { symbol: '$', name: 'US Dollar' }
  };

  const formatCurrency = (amount, currency) => {
      const symbol = currencies[currency]?.symbol || currency;
      if (currency === 'CHF') {
          return `${symbol}${amount.toFixed(2)}`;
      }
      return `${amount.toFixed(2)}${symbol}`;
  };

  // Utility functions
  const calculateTotal = (items, taxRate = 19) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return 0;
    }
    
    try {
      const subtotal = items.reduce((sum, item) => {
        const quantity = parseFloat(item?.quantity || 0);
        const price = parseFloat(item?.price || 0);
        return sum + (quantity * price);
      }, 0);
      const tax = subtotal * (taxRate / 100);
      return subtotal + tax;
    } catch (error) {
      console.warn('Error calculating total:', error);
      return 0;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return classes.statusGray;
      case 'sent': return classes.statusBlue;
      case 'paid': return classes.statusGreen;
      case 'overdue': return classes.statusRed;
      case 'active': return classes.statusGreen;
      case 'paused': return classes.statusYellow;
      default: return classes.statusGray;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'draft': return 'Entwurf';
      case 'sent': return 'Versendet';
      case 'paid': return 'Bezahlt';
      case 'overdue': return 'Überfällig';
      case 'active': return 'Aktiv';
      case 'paused': return 'Pausiert';
      default: return 'Unbekannt';
    }
  };

  // Service Rates Handlers
  const handleAddRate = () => {
    setSelectedRate(null);
    setIsRateDialogOpen(true);
  };

  const handleEditRate = (rate) => {
    setSelectedRate(rate);
    setIsRateDialogOpen(true);
  };

  const handleDeleteRate = (rateId) => {
    setServiceRates(prevRates => (prevRates || []).filter(r => r.id !== rateId));
    toast.success("Honorarsatz gelöscht!");
  };

  const handleSaveRate = (newRateData) => {
    const currentRates = serviceRates || [];
    const existingIndex = currentRates.findIndex(r => r.id === newRateData.id);
    
    if (existingIndex > -1) {
      setServiceRates(prevRates => {
        const updatedRates = [...(prevRates || [])];
        updatedRates[existingIndex] = newRateData;
        return updatedRates;
      });
      toast.success("Honorarsatz aktualisiert!");
    } else {
      setServiceRates(prevRates => [...(prevRates || []), newRateData]);
      toast.success("Honorarsatz erstellt!");
    }
    setIsRateDialogOpen(false);
  };

  // Recurring Invoice Handlers
  const handleAddRecurring = () => {
    setSelectedRecurring(null);
    setIsRecurringDialogOpen(true);
  };

  const handleEditRecurring = (recurring) => {
    setSelectedRecurring(recurring);
    setIsRecurringDialogOpen(true);
  };

  const handleDeleteRecurring = (id) => {
    setRecurringInvoices(prev => (prev || []).filter(item => item.id !== id));
    toast.success('Abonnement gelöscht!');
  };

  const handleSaveRecurring = (data) => {
    const existingIndex = (recurringInvoices || []).findIndex(inv => inv.id === data.id);
    if(existingIndex > -1) {
      setRecurringInvoices(prev => prev.map(inv => inv.id === data.id ? data : inv));
      toast.success('Abonnement aktualisiert!');
    } else {
      setRecurringInvoices(prev => [...(prev || []), data]);
      toast.success('Abonnement erstellt!');
    }
    setIsRecurringDialogOpen(false);
    setSelectedRecurring(null);
  };

  const handleUpdateRecurring = (item, field, value) => {
    if (field === 'edit') {
      setSelectedRecurring(item);
      setIsRecurringDialogOpen(true);
    } else {
      const updatedItem = { ...item, [field]: value };
      handleSaveRecurring(updatedItem);
      const statusText = value === 'active' ? 'aktiviert' : 'pausiert';
      toast.success(`Abonnement ${statusText}!`);
    }
  };

  // Invoice Action Handlers
  const handleViewInvoice = (invoice) => {
    toast.success(`Rechnung ${invoice.invoiceNumber} wird angezeigt.`);
  };

  const handleDownloadInvoice = (invoice) => {
    toast.success(`Rechnung ${invoice.invoiceNumber} wird als PDF heruntergeladen.`);
  };

  const handleSendInvoice = (invoice) => {
    if (invoice.status === 'sent') {
      toast.error(`Rechnung ${invoice.invoiceNumber} wurde bereits versendet.`);
      return;
    }

    const updatedInvoice = { ...invoice, status: 'sent', sentDate: new Date().toISOString().split('T')[0] };
    
    if (typeof updateInvoiceInContext === 'function') {
      updateInvoiceInContext(invoice.id, updatedInvoice);
    } else {
      setInvoices(prev => prev.map(inv => inv.id === invoice.id ? updatedInvoice : inv));
    }
    
    toast.success(`Rechnung ${invoice.invoiceNumber} wurde erfolgreich versendet.`);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice({...invoice});
    setShowEditDialog(true);
  };

  const handleUpdateInvoice = async () => {
    if (!editingInvoice.items || !editingInvoice.items.length || editingInvoice.items.some(item => !item.description || !item.price)) {
      toast.error("Alle Rechnungspositionen müssen ausgefüllt sein");
      return;
    }

    try {
      if (typeof updateInvoiceInContext === 'function') {
        updateInvoiceInContext(editingInvoice.id, editingInvoice);
      } else {
        setInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? editingInvoice : inv));
      }
      
      setShowEditDialog(false);
      setEditingInvoice(null);
      
      toast.success("Die Änderungen wurden gespeichert.");
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Rechnung:', error);
      toast.error("Die Rechnung konnte nicht gespeichert werden.");
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    setDeletingId(invoiceId);
    
    try {
      if (typeof removeInvoiceFromContext === 'function') {
        removeInvoiceFromContext(invoiceId);
      } else {
        setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      }
      
      toast.success("Die Rechnung wurde erfolgreich entfernt.");
    } catch (error) {
      console.error('Fehler beim Löschen der Rechnung:', error);
      toast.error("Die Rechnung konnte nicht gelöscht werden.");
    } finally {
      setDeletingId(null);
    }
  };
  const handleCreateInvoice = () => {
    if (!newInvoice.coacheeId || newInvoice.items.some(item => !item.description || !item.price)) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus");
      return;
    }

    const selectedCoachee = coachees.find(c => c.id.toString() === newInvoice.coacheeId);
    const invoiceNumber = `CS-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`;

    const invoice = {
      id: Date.now(),
      invoiceNumber,
      coacheeId: parseInt(newInvoice.coacheeId),
      coacheeName: `${selectedCoachee.firstName} ${selectedCoachee.lastName}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate,
      status: 'draft',
      items: newInvoice.items.map(item => ({
        ...item,
        id: Date.now() + Math.random()
      })),
      taxRate: 19,
      currency: 'EUR',
      notes: newInvoice.notes
    };

    // Fallback falls Context-Funktion nicht existiert
    if (typeof addInvoiceToContext === 'function') {
      addInvoiceToContext(invoice);
    } else {
      // Direct state update als Fallback
      setInvoices(prev => [...prev, invoice]);
    }

    toast.success(`Rechnung ${invoiceNumber} wurde erfolgreich erstellt.`);
    
    setNewInvoice({
      coacheeId: '',
      items: [{ description: '', quantity: 1, price: 0, rateId: '' }],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setShowNewInvoiceDialog(false);
  };

  // Rechnungsposition-Handler
  const handleAddItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0, rateId: '' }]
    }));
  };

  const handleRemoveItem = (index) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const handleRateSelection = (index, rateId) => {
    const selectedRate = serviceRates?.find(r => r.id.toString() === rateId);
    if (selectedRate) {
      handleItemChange(index, 'price', selectedRate.price);
      handleItemChange(index, 'rateId', rateId);
    }
  };

  // Statistics für Rechnungen
  const filteredInvoices = invoices.filter(invoice => {
    if (!invoice) return false;
    
    if (coacheeFilter && invoice.coacheeId !== parseInt(coacheeFilter)) {
      return false;
    }
    
    if (statusFilter !== 'all' && invoice.status !== statusFilter) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        invoice.invoiceNumber?.toLowerCase().includes(searchLower) ||
        (invoice.coacheeName && invoice.coacheeName.toLowerCase().includes(searchLower)) ||
        (invoice.items && Array.isArray(invoice.items) && invoice.items.some(item => item.description?.toLowerCase().includes(searchLower)))
      );
    }
    
    return true;
  });

  const stats = {
    total: filteredInvoices.length,
    draft: filteredInvoices.filter(inv => inv?.status === 'draft').length,
    sent: filteredInvoices.filter(inv => inv?.status === 'sent').length,
    paid: filteredInvoices.filter(inv => inv?.status === 'paid').length,
    overdue: filteredInvoices.filter(inv => inv?.status === 'overdue').length,
    totalAmount: filteredInvoices.reduce((sum, inv) => {
      if (!inv || !inv.items) return sum;
      return sum + calculateTotal(inv.items, inv.taxRate);
    }, 0)
  };

  // Tab Content Renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'rechnungen':
        return (
          <div className="space-y-6">
            {/* Quick stats display */}
            <div className={"flex gap-4 mb-6 " + classes.caption}>
              <span>{stats.total} Rechnungen</span>
              <span>{stats.draft} Entwürfe</span>
              <span>{stats.sent} Versendet</span>
              <span>{stats.paid} Bezahlt</span>
              {stats.overdue > 0 && <span>{stats.overdue} Überfällig</span>}
              <span>{stats.totalAmount.toFixed(2)} €</span>
            </div>

            {/* Search */}
            <div className={classes.card}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechnungsnummer, Coachee oder Beschreibung durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={classes.searchInput + " pl-10"}
                />
              </div>
            </div>

            {/* Filter */}
            <div className={classes.card}>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? classes.btnFilterActive : classes.btnFilterInactive}
                >
                  Alle ({stats.total})
                </button>
                <button
                  onClick={() => setStatusFilter('draft')}
                  className={statusFilter === 'draft' ? classes.btnFilterActive : classes.btnFilterInactive}
                >
                  Entwürfe ({stats.draft})
                </button>
                <button
                  onClick={() => setStatusFilter('sent')}
                  className={statusFilter === 'sent' ? classes.btnFilterActive : classes.btnFilterInactive}
                >
                  Versendet ({stats.sent})
                </button>
                <button
                  onClick={() => setStatusFilter('paid')}
                  className={statusFilter === 'paid' ? classes.btnFilterActive : classes.btnFilterInactive}
                >
                  Bezahlt ({stats.paid})
                </button>
              </div>
            </div>

            {/* Rechnungen Liste */}
            <div className="space-y-3">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className={classes.card + " hover:bg-slate-700/50 transition-colors"}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={classes.h3 + " text-base"}>{invoice.invoiceNumber}</h3>
                          <span className={getStatusColor(invoice.status)}>
                            {getStatusText(invoice.status)}
                          </span>
                        </div>
                        
                        <div className={"flex items-center gap-4 mb-2 " + classes.caption}>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {invoice.coacheeName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(invoice.date).toLocaleDateString('de-DE')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Euro className="h-3 w-3" />
                            {calculateTotal(invoice.items, invoice.taxRate).toFixed(2)} €
                          </span>
                        </div>
                        
                        <div className={classes.body + " text-sm"}>
                          {invoice.items && Array.isArray(invoice.items) ? (
                            <>
                              {invoice.items.length} Position(en): {invoice.items.map(item => item?.description || 'Unbekannt').join(', ')}
                            </>
                          ) : (
                            'Keine Positionen'
                          )}
                        </div>
                      </div>
                      
                      {/* Action-Buttons */}
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleViewInvoice(invoice)}
                          className={classes.btnIconBlue} 
                          title="Ansehen"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadInvoice(invoice)}
                          className={classes.btnIconGreen} 
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleSendInvoice(invoice)}
                          className={classes.btnIcon + " text-purple-400 hover:text-purple-300"} 
                          title="Versenden"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditInvoice(invoice)}
                          className={classes.btnIcon} 
                          title="Bearbeiten"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className={classes.btnIconRed} title="Löschen">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                                Rechnung löschen?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-400">
                                Möchten Sie die Rechnung <strong className="text-white">"{invoice.invoiceNumber}"</strong> wirklich dauerhaft löschen?
                                <br /><br />
                                <span className="text-red-400">Diese Aktion kann nicht rückgängig gemacht werden.</span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className={classes.btnSecondary}>
                                Abbrechen
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                disabled={deletingId === invoice.id}
                                className={classes.btnPrimary + " bg-red-600 hover:bg-red-700"}
                              >
                                {deletingId === invoice.id ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                                    Lösche...
                                  </>
                                ) : (
                                  'Dauerhaft löschen'
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={classes.emptyState}>
                  <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className={classes.h3 + " mb-2"}>Keine Rechnungen gefunden</h3>
                  <p className={classes.emptyStateText + " mb-4"}>Für die aktuellen Filter gibt es keine Rechnungen.</p>
                  <button
                    onClick={() => setShowNewInvoiceDialog(true)}
                    className={classes.btnPrimary}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Erste Rechnung erstellen
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'honorarsaetze':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {(serviceRates || []).map(rate => (
                <div key={rate.id} className={classes.card + " hover:bg-slate-700/50 transition-colors"}>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className={classes.h3 + " text-lg"}>{rate.name}</p>
                      {rate.description && (
                        <p className={classes.caption + " mt-1"}>{rate.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold text-blue-400 min-w-[100px] text-right">
                        {formatCurrency(rate.price || 0, rate.currency || 'EUR')}
                      </p>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleEditRate(rate)}
                          className={classes.btnIcon}
                          title="Bearbeiten"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRate(rate.id)}
                          className={classes.btnIconRed}
                          title="Löschen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {(serviceRates || []).length === 0 && (
                <div className={classes.emptyState}>
                  <DollarSign className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className={classes.h3 + " mb-2"}>Keine Honorarsätze gefunden</h3>
                  <p className={classes.emptyStateText + " mb-4"}>Erstelle deinen ersten Honorarsatz, um zu beginnen.</p>
                  <button onClick={handleAddRate} className={classes.btnPrimary}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ersten Honorarsatz erstellen
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'abonnements':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {(recurringInvoices || []).map(item => (
                <div key={item.id} className={classes.card + " hover:bg-slate-700/50 transition-colors"}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Repeat className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={classes.h3 + " text-base"}>
                        {serviceRates.find(r => r.id === item.rateId)?.name || 'Unbekannter Satz'} ({item.quantity}x)
                      </p>
                      <p className={classes.caption + " flex items-center gap-2 mt-1"}>
                        <User className="h-4 w-4" />
                        {item.coacheeName}
                      </p>
                      <p className={classes.caption + " flex items-center gap-2 mt-1"}>
                        <Calendar className="h-4 w-4" />
                        Nächste Rechnung am: {new Date(item.nextDueDate).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center gap-3">
                      <span className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </span>
                      <p className="text-lg font-bold text-blue-400 whitespace-nowrap">
                        {formatCurrency((serviceRates.find(r => r.id === item.rateId)?.price || 0) * item.quantity, item.currency)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleUpdateRecurring(item, 'status', item.status === 'active' ? 'paused' : 'active')}
                        className={classes.btnIcon + " text-yellow-400 hover:text-yellow-300"}
                        title={item.status === 'active' ? 'Pausieren' : 'Aktivieren'}
                      >
                        {item.status === 'active' ? <Settings className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                      </button>
                      <button 
                        onClick={() => handleEditRecurring(item)}
                        className={classes.btnIcon}
                        title="Bearbeiten"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRecurring(item.id)}
                        className={classes.btnIconRed}
                        title="Löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {(recurringInvoices || []).length === 0 && (
                <div className={classes.emptyState}>
                  <Repeat className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className={classes.h3 + " mb-2"}>Keine Abonnements gefunden</h3>
                  <p className={classes.emptyStateText + " mb-4"}>Erstelle dein erstes Abonnement, um loszulegen.</p>
                  <button onClick={handleAddRecurring} className={classes.btnPrimary}>
                    <Plus className="mr-2 h-4 w-4" />
                    Erstes Abo erstellen
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="">
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className={classes.h1}>Rechnungswesen</h1>
            <p className={classes.body}>Verwalte Rechnungen, Honorarsätze und Abonnements zentral</p>
          </div>
          
          <div className="flex gap-2">
            {activeTab === 'rechnungen' && (
              <button
                onClick={() => setShowNewInvoiceDialog(true)}
                className={classes.btnPrimary}
              >
                <Plus className="h-4 w-4" />
                Neue Rechnung
              </button>
            )}
            {activeTab === 'honorarsaetze' && (
              <button
                onClick={handleAddRate}
                className={classes.btnPrimary}
              >
                <Plus className="h-4 w-4" />
                Neuer Honorarsatz
              </button>
            )}
            {activeTab === 'abonnements' && (
              <button
                onClick={handleAddRecurring}
                className={classes.btnPrimary}
              >
                <Plus className="h-4 w-4" />
                Neues Abo
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className={classes.card + " mb-6"}>
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('rechnungen')}
              className={activeTab === 'rechnungen' ? classes.btnFilterActive : classes.btnFilterInactive}
            >
              <FileText className="h-4 w-4 mr-2" />
              Rechnungen
            </button>
            <button
              onClick={() => setActiveTab('honorarsaetze')}
              className={activeTab === 'honorarsaetze' ? classes.btnFilterActive : classes.btnFilterInactive}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Honorarsätze
            </button>
            <button
              onClick={() => setActiveTab('abonnements')}
              className={activeTab === 'abonnements' ? classes.btnFilterActive : classes.btnFilterInactive}
            >
              <Repeat className="h-4 w-4 mr-2" />
              Abonnements
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Dialogs */}
        <RateEditorDialog
          open={isRateDialogOpen}
          onOpenChange={setIsRateDialogOpen}
          onSave={handleSaveRate}
          rate={selectedRate}
        />
        
        <RecurringInvoiceDialog
          open={isRecurringDialogOpen}
          onOpenChange={setIsRecurringDialogOpen}
          onSave={handleSaveRecurring}
          coachees={coachees}
          serviceRates={serviceRates}
          recurringInvoice={selectedRecurring}
        />

        {/* Edit Invoice Modal */}
        {showEditDialog && editingInvoice && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Rechnung bearbeiten</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300 mb-2 block">Rechnungsnummer</Label>
                  <Input
                    value={editingInvoice.invoiceNumber}
                    onChange={(e) => setEditingInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className={classes.input}
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300 mb-2 block">Status</Label>
                  <select
                    value={editingInvoice.status}
                    onChange={(e) => setEditingInvoice(prev => ({ ...prev, status: e.target.value }))}
                    className={classes.select}
                  >
                    <option value="draft">Entwurf</option>
                    <option value="sent">Versendet</option>
                    <option value="paid">Bezahlt</option>
                    <option value="overdue">Überfällig</option>
                  </select>
                </div>

                <div>
                  <Label className="text-slate-300 mb-2 block">Notizen</Label>
                  <textarea
                    value={editingInvoice.notes || ''}
                    onChange={(e) => setEditingInvoice(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className={classes.textarea}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <button className={classes.btnSecondary}>
                    Abbrechen
                  </button>
                </DialogClose>
                <button 
                  onClick={handleUpdateInvoice}
                  className={classes.btnPrimary}
                >
                  Änderungen speichern
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {showNewInvoiceDialog && (
          <Dialog open={showNewInvoiceDialog} onOpenChange={setShowNewInvoiceDialog}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-white">Neue Rechnung erstellen</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Erstellen Sie eine neue Rechnung für einen Coachee.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Coachee Selection */}
                <div>
                  <Label className="text-slate-300 mb-2 block">Coachee *</Label>
                  <select
                    value={newInvoice.coacheeId}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, coacheeId: e.target.value }))}
                    className={classes.select}
                  >
                    <option value="">Coachee auswählen</option>
                    {(coachees || []).map(coachee => (
                      <option key={coachee.id} value={coachee.id}>
                        {coachee.firstName} {coachee.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Items */}
                <div>
                  <Label className="text-slate-300 mb-2 block">Rechnungspositionen *</Label>
                  <div className="space-y-3">
                    {newInvoice.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <Label className="text-slate-300 text-xs">Beschreibung</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="z.B. Coaching Session"
                            className={classes.input + " text-sm"}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-slate-300 text-xs">Menge</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                            className={classes.input + " text-sm"}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-slate-300 text-xs">Preis (€)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                            className={classes.input + " text-sm"}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-slate-300 text-xs">Honorarsatz</Label>
                          <select
                            value={item.rateId}
                            onChange={(e) => handleRateSelection(index, e.target.value)}
                            className={classes.select + " text-sm"}
                          >
                            <option value="">Individuell</option>
                            {(serviceRates || []).map(rate => (
                              <option key={rate.id} value={rate.id}>
                                {rate.name} ({rate.price}€)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-1">
                          {newInvoice.items.length > 1 && (
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className={classes.btnIconRed + " text-xs p-1"}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleAddItem}
                      className={classes.btnSecondary + " text-sm"}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Position hinzufügen
                    </button>
                  </div>
                </div>

                {/* Preview */}
                {newInvoice.items.length > 0 && newInvoice.items[0].price > 0 && (
                  <div className="border border-slate-600/50 rounded-lg p-4 bg-slate-700/30">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Vorschau</h4>
                    <div className="space-y-1 text-sm text-slate-400">
                      <div className="flex justify-between font-medium text-white pt-1 border-t border-slate-600">
                        <span>Gesamt:</span>
                        <span>{calculateTotal(newInvoice.items).toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <button className={classes.btnSecondary}>
                    Abbrechen
                  </button>
                </DialogClose>
                <button 
                  onClick={handleCreateInvoice}
                  disabled={!newInvoice.coacheeId || newInvoice.items.some(item => !item.description || !item.price)}
                  className={classes.btnPrimary}
                  style={{ opacity: (!newInvoice.coacheeId || newInvoice.items.some(item => !item.description || !item.price)) ? 0.5 : 1 }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Rechnung erstellen
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default InvoicesApp;