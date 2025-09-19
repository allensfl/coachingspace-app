import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Download, Eye, X, CheckCircle, AlertCircle, Search, Filter, FileText, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { subscriptionHelpers } from "../../utils/subscriptionHelpers";
import { CoacheeSubscriptionBadge } from "../ui/CoacheeSubscriptionBadge";

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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeToast(toast.id)}
          className="ml-auto p-1 h-6 w-6 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
);

// Status-Definitionen
const InvoiceStatus = {
  DRAFT: 'draft',
  SENT: 'sent', 
  PAID: 'paid',
  OVERDUE: 'overdue'
};

const statusLabels = {
  [InvoiceStatus.DRAFT]: 'Entwurf',
  [InvoiceStatus.SENT]: 'Gesendet',
  [InvoiceStatus.PAID]: 'Bezahlt',
  [InvoiceStatus.OVERDUE]: 'Überfällig'
};

const statusColors = {
  [InvoiceStatus.DRAFT]: 'bg-gray-500 text-white',
  [InvoiceStatus.SENT]: 'bg-blue-500 text-white',
  [InvoiceStatus.PAID]: 'bg-green-500 text-white',
  [InvoiceStatus.OVERDUE]: 'bg-red-500 text-white'
};

// PDF-Generierung (Placeholder)
const generateInvoicePDF = (invoice, coachee, company) => {
  console.log('PDF wird generiert für:', invoice);
  return new Promise(resolve => setTimeout(resolve, 1000));
};

// Invoice-Dialog Komponente
const InvoiceDialog = ({ open, onOpenChange, onSave, coachees, serviceRates, recurringInvoices, invoice }) => {
    const [coacheeId, setCoacheeId] = useState('');
    const [items, setItems] = useState([{ description: '', quantity: 1, rate: 0, total: 0 }]);
    const [status, setStatus] = useState(InvoiceStatus.DRAFT);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [currency, setCurrency] = useState('EUR');

    React.useEffect(() => {
        if (invoice) {
            setCoacheeId(invoice.coacheeId?.toString() || '');
            setItems(invoice.items || [{ description: '', quantity: 1, rate: 0, total: 0 }]);
            setStatus(invoice.status || InvoiceStatus.DRAFT);
            setDate(invoice.date || new Date().toISOString().split('T')[0]);
            setDueDate(invoice.dueDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
            setNotes(invoice.notes || '');
            setCurrency(invoice.currency || 'EUR');
        } else {
            setCoacheeId('');
            setItems([{ description: '', quantity: 1, rate: 0, total: 0 }]);
            setStatus(InvoiceStatus.DRAFT);
            setDate(new Date().toISOString().split('T')[0]);
            setDueDate(new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
            setNotes('');
            setCurrency('EUR');
        }
    }, [invoice, open]);

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, rate: 0, total: 0 }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        
        if (field === 'quantity' || field === 'rate') {
            newItems[index].total = newItems[index].quantity * newItems[index].rate;
        }
        
        setItems(newItems);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const total = items.reduce((sum, item) => sum + (item.total || 0), 0);

    const handleSave = () => {
        if (!coacheeId || coacheeId === '' || items.length === 0) return;

        const coachee = (coachees || []).find(c => c.id === parseInt(coacheeId));
        if (!coachee) return;

        const invoiceData = {
            id: invoice ? invoice.id : Date.now(),
            number: invoice ? invoice.number : `INV-${Date.now()}`,
            coacheeId: parseInt(coacheeId),
            coacheeName: `${coachee.firstName} ${coachee.lastName}`,
            items: items.filter(item => item.description.trim()),
            total,
            status,
            date,
            dueDate,
            notes: notes.trim(),
            currency
        };

        onSave(invoiceData);
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {invoice ? 'Rechnung bearbeiten' : 'Neue Rechnung erstellen'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Erstelle oder bearbeite eine Rechnung für deine Coaching-Leistungen.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    {/* Grunddaten */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="coachee" className="text-white">Coachee</Label>
                            <select
                                value={coacheeId}
                                onChange={(e) => setCoacheeId(e.target.value)}
                                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat bg-right pr-10"
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                  backgroundPosition: 'right 0.5rem center',
                                  backgroundSize: '1.5em 1.5em'
                                }}
                            >
                                <option value="" disabled>Coachee wählen...</option>
                                {(coachees || []).map(coachee => (
                                    <option key={coachee.id} value={coachee.id.toString()}>
                                        {subscriptionHelpers.formatCoacheeWithStatus(coachee, recurringInvoices)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="status" className="text-white">Status</Label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat bg-right pr-10"
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                  backgroundPosition: 'right 0.5rem center',
                                  backgroundSize: '1.5em 1.5em'
                                }}
                            >
                                {Object.entries(statusLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date" className="text-white">Rechnungsdatum</Label>
                            <Input 
                                id="date"
                                type="date" 
                                value={date} 
                                onChange={e => setDate(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="due-date" className="text-white">Fälligkeitsdatum</Label>
                            <Input 
                                id="due-date"
                                type="date" 
                                value={dueDate} 
                                onChange={e => setDueDate(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="currency" className="text-white">Währung</Label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat bg-right pr-10"
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                  backgroundPosition: 'right 0.5rem center',
                                  backgroundSize: '1.5em 1.5em'
                                }}
                            >
                                <option value="EUR">€ Euro</option>
                                <option value="CHF">CHF Franken</option>
                                <option value="USD">$ Dollar</option>
                            </select>
                        </div>
                    </div>

                    {/* Rechnungsposten */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-white text-lg">Rechnungsposten</Label>
                            <Button onClick={addItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Position hinzufügen
                            </Button>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-700 rounded-lg">
                                <div className="md:col-span-2">
                                    <Label className="text-white text-sm">Beschreibung</Label>
                                    <Input
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                        placeholder="Leistungsbeschreibung"
                                        className="bg-gray-600 border-gray-500 text-white mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-white text-sm">Menge</Label>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                        className="bg-gray-600 border-gray-500 text-white mt-1"
                                        min="0"
                                        step="0.5"
                                    />
                                </div>
                                <div>
                                    <Label className="text-white text-sm">Einzelpreis</Label>
                                    <Input
                                        type="number"
                                        value={item.rate}
                                        onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                        className="bg-gray-600 border-gray-500 text-white mt-1"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <Label className="text-white text-sm">Gesamt</Label>
                                        <div className="mt-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white">
                                            {(item.total || 0).toFixed(2)}
                                        </div>
                                    </div>
                                    {items.length > 1 && (
                                        <Button
                                            onClick={() => removeItem(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-300 hover:bg-gray-600 p-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Gesamtsumme */}
                        <div className="flex justify-end">
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <div className="text-right">
                                    <p className="text-gray-400">Gesamtsumme:</p>
                                    <p className="text-2xl font-bold text-blue-400">
                                        {currency === 'CHF' ? `CHF${total.toFixed(2)}` : `${total.toFixed(2)}${currency === 'EUR' ? '€' : '$'}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notizen */}
                    <div className="grid gap-2">
                        <Label htmlFor="notes" className="text-white">Notizen</Label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Zusätzliche Informationen zur Rechnung..."
                            rows={3}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>
                
                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            Abbrechen
                        </Button>
                    </DialogClose>
                    <Button 
                        onClick={handleSave}
                        disabled={!coacheeId || coacheeId === '' || items.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        Rechnung speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Hauptkomponente
const InvoicesList = ({ 
  invoices, 
  setInvoices, 
  coachees, 
  serviceRates, 
  recurringInvoices, // NEU: Für Badge-System
  company, 
  settings 
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [defaultCurrency, setDefaultCurrency] = useState('EUR');
    
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

    // Währungsformatierung
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

    // Gefilterte Rechnungen
    const filteredInvoices = useMemo(() => {
        const safeInvoices = invoices || [];
        return safeInvoices
            .filter(invoice => {
                const matchesSearch = !searchTerm || 
                    invoice.coacheeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    invoice.number?.toLowerCase().includes(searchTerm.toLowerCase());
                
                const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
                
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [invoices, searchTerm, statusFilter]);

    // Rechnungsstatistiken
    const invoiceStats = useMemo(() => {
        const safeInvoices = invoices || [];
        const total = safeInvoices.length;
        const paid = safeInvoices.filter(inv => inv.status === InvoiceStatus.PAID).length;
        const overdue = safeInvoices.filter(inv => inv.status === InvoiceStatus.OVERDUE).length;
        const totalRevenue = safeInvoices
            .filter(inv => inv.status === InvoiceStatus.PAID)
            .reduce((sum, inv) => sum + (inv.total || 0), 0);

        return { total, paid, overdue, totalRevenue };
    }, [invoices]);

    const handleSave = (invoiceData) => {
        const existingIndex = (invoices || []).findIndex(inv => inv.id === invoiceData.id);
        
        if (existingIndex > -1) {
            setInvoices(prev => prev.map(inv => inv.id === invoiceData.id ? invoiceData : inv));
            toast.success('Rechnung aktualisiert!');
        } else {
            setInvoices(prev => [...(prev || []), invoiceData]);
            toast.success('Rechnung erstellt!');
        }
        
        setIsDialogOpen(false);
        setSelectedInvoice(null);
    };

    const handleEdit = (invoice) => {
        setSelectedInvoice(invoice);
        setIsDialogOpen(true);
    };

    const handleDelete = (invoiceId) => {
        setInvoices(prev => (prev || []).filter(inv => inv.id !== invoiceId));
        toast.success('Rechnung gelöscht!');
    };

    const handleDownload = async (invoice) => {
        try {
            const coachee = (coachees || []).find(c => c.id === invoice.coacheeId);
            await generateInvoicePDF(invoice, coachee, company);
            toast.success('PDF wurde heruntergeladen!');
        } catch (error) {
            toast.error('Fehler beim Erstellen der PDF!');
        }
    };

    const handleAddNew = () => {
        setSelectedInvoice(null);
        setIsDialogOpen(true);
    };

    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            
            <InvoiceDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSave}
                coachees={coachees}
                serviceRates={serviceRates}
                recurringInvoices={recurringInvoices}
                invoice={selectedInvoice}
            />

            <div className="space-y-6">
                {/* Header mit Währungsschalter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Rechnungen</h1>
                        <p className="text-gray-400">Verwalte deine Coaching-Rechnungen und behalte den Überblick über deine Einnahmen.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={defaultCurrency}
                            onChange={(e) => setDefaultCurrency(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat bg-right pr-10 min-w-[120px]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundSize: '1.5em 1.5em'
                            }}
                        >
                            <option value="EUR">€ Euro</option>
                            <option value="CHF">CHF Franken</option>
                            <option value="USD">$ Dollar</option>
                        </select>
                        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                            <Plus className="mr-2 h-4 w-4" />
                            Neue Rechnung
                        </Button>
                    </div>
                </div>

                {/* Statistik-Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Rechnungen gesamt</p>
                                    <p className="text-2xl font-bold text-white">{invoiceStats.total}</p>
                                </div>
                                <FileText className="h-8 w-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Bezahlt</p>
                                    <p className="text-2xl font-bold text-green-400">{invoiceStats.paid}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Überfällig</p>
                                    <p className="text-2xl font-bold text-red-400">{invoiceStats.overdue}</p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Gesamtumsatz</p>
                                    <p className="text-2xl font-bold text-emerald-400">
                                        {formatCurrency(invoiceStats.totalRevenue, defaultCurrency)}
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-emerald-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter und Suche */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Rechnung oder Coachee suchen..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat bg-right pr-10 min-w-[140px]"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundSize: '1.5em 1.5em'
                                }}
                            >
                                <option value="all">Alle Status</option>
                                {Object.entries(statusLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Rechnungsliste */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map(invoice => (
                                    <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-white" />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-white">Rechnung #{invoice.number}</p>
                                                    <Badge className={statusColors[invoice.status] || 'bg-gray-500 text-white'}>
                                                        {statusLabels[invoice.status] || invoice.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <p className="text-sm text-gray-400">{invoice.coacheeName}</p>
                                                    <CoacheeSubscriptionBadge 
                                                        coacheeId={invoice.coacheeId} 
                                                        recurringInvoices={recurringInvoices}
                                                        size="xs"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(invoice.date).toLocaleDateString('de-DE')} • 
                                                    Fällig: {new Date(invoice.dueDate).toLocaleDateString('de-DE')}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between sm:justify-end gap-4">
                                            <p className="text-xl font-bold text-blue-400 whitespace-nowrap">
                                                {formatCurrency(invoice.total || 0, invoice.currency || defaultCurrency)}
                                            </p>
                                            
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDownload(invoice)}
                                                    className="text-gray-400 hover:text-white hover:bg-gray-600"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(invoice)}
                                                    className="text-gray-400 hover:text-white hover:bg-gray-600"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(invoice.id)}
                                                    className="text-gray-400 hover:text-red-400 hover:bg-gray-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">
                                        {searchTerm || statusFilter !== 'all' ? 'Keine passenden Rechnungen gefunden' : 'Noch keine Rechnungen erstellt'}
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        {searchTerm || statusFilter !== 'all' 
                                            ? 'Versuche andere Suchbegriffe oder Filter.' 
                                            : 'Erstelle deine erste Rechnung, um zu beginnen.'
                                        }
                                    </p>
                                    {!searchTerm && statusFilter === 'all' && (
                                        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Erste Rechnung erstellen
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default InvoicesList;