import React, { useState } from 'react';
import { Plus, Edit, Trash2, Play, Pause, MoreVertical, Calendar, Repeat, User, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
            setCoacheeId('placeholder');
            setRateId('placeholder');
            setQuantity(1);
            setInterval('monthly');
            setStartDate(new Date().toISOString().split('T')[0]);
            setCurrency('EUR');
        }
    }, [recurringInvoice, open]);

    const handleSave = () => {
        const coachee = (coachees || []).find(c => c.id === parseInt(coacheeId));
        const rate = (serviceRates || []).find(r => r.id === parseInt(rateId));
        if (!coachee || !rate || coacheeId === 'placeholder' || rateId === 'placeholder') return;

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
                            <option value="placeholder" disabled>Bitte wählen...</option>
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
                            <option value="placeholder" disabled>Bitte wählen...</option>
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

const RecurringInvoiceCard = ({ item, serviceRates, onUpdate, onDelete, defaultCurrency }) => {
    const rate = (serviceRates || []).find(r => r.id === item.rateId);
    
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
    
    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return classes.statusGreen;
            case 'paused': return classes.statusYellow;
            default: return classes.statusGray;
        }
    };

    return (
        <div className={classes.card + " hover:bg-slate-700/50 transition-colors"}>
            <div className="flex items-center gap-4 flex-1">
                 <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Repeat className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                    <p className={classes.h3 + " text-base"}>{rate?.name || 'Unbekannter Satz'} ({item.quantity}x)</p>
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
                        {item.status === 'active' ? 'Aktiv' : 'Pausiert'}
                    </span>
                    <p className="text-lg font-bold text-blue-400 whitespace-nowrap">
                        {formatCurrency((rate?.price || 0) * item.quantity, item.currency || rate?.currency || defaultCurrency)}
                    </p>
                </div>
                <div className="flex gap-1">
                    <button 
                        onClick={() => onUpdate(item, 'status', item.status === 'active' ? 'paused' : 'active')}
                        className={classes.btnIcon + " text-yellow-400 hover:text-yellow-300"}
                        title={item.status === 'active' ? 'Pausieren' : 'Aktivieren'}
                    >
                        {item.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button 
                        onClick={() => onUpdate(item, 'edit')}
                        className={classes.btnIcon}
                        title="Bearbeiten"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(item.id)}
                        className={classes.btnIconRed}
                        title="Löschen"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export function RecurringInvoices({ recurringInvoices, setRecurringInvoices, coachees, serviceRates }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
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

  const handleSave = (data) => {
    const existingIndex = (recurringInvoices || []).findIndex(inv => inv.id === data.id);
    if(existingIndex > -1) {
        setRecurringInvoices(prev => prev.map(inv => inv.id === data.id ? data : inv));
        toast.success('Abonnement aktualisiert!');
    } else {
        setRecurringInvoices(prev => [...(prev || []), data]);
        toast.success('Abonnement erstellt!');
    }
    setIsDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleUpdate = (item, field, value) => {
      if (field === 'edit') {
          setSelectedInvoice(item);
          setIsDialogOpen(true);
      } else {
          const updatedItem = { ...item, [field]: value };
          handleSave(updatedItem);
          const statusText = value === 'active' ? 'aktiviert' : 'pausiert';
          toast.success(`Abonnement ${statusText}!`);
      }
  };
  
  const handleDelete = (id) => {
      setRecurringInvoices(prev => (prev || []).filter(item => item.id !== id));
      toast.success('Abonnement gelöscht!');
  };
  
  const handleAddNew = () => {
    setSelectedInvoice(null);
    setIsDialogOpen(true);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="">
          <ToastContainer toasts={toasts} removeToast={removeToast} />
          
          <RecurringInvoiceDialog 
            open={isDialogOpen} 
            onOpenChange={setIsDialogOpen} 
            onSave={handleSave} 
            coachees={coachees} 
            serviceRates={serviceRates} 
            recurringInvoice={selectedInvoice} 
          />
          
          <div className={classes.card}>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                      <h1 className={classes.h1}>Abonnements & Wiederkehrende Rechnungen</h1>
                      <p className={classes.body}>
                          Verwalte deine wiederkehrenden Einnahmen und Abo-Modelle.
                      </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                      <select
                          value={defaultCurrency}
                          onChange={(e) => setDefaultCurrency(e.target.value)}
                          className={classes.select + " min-w-[120px]"}
                      >
                          <option value="EUR">€ Euro</option>
                          <option value="CHF">CHF Franken</option>
                          <option value="USD">$ Dollar</option>
                      </select>
                      <button onClick={handleAddNew} className={classes.btnPrimary + " whitespace-nowrap"}>
                          <Plus className="mr-2 h-4 w-4" /> 
                          Neues Abo
                      </button>
                  </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                  {(recurringInvoices || []).map(item => (
                      <RecurringInvoiceCard 
                          key={item.id} 
                          item={item} 
                          serviceRates={serviceRates} 
                          onUpdate={handleUpdate} 
                          onDelete={handleDelete} 
                          defaultCurrency={defaultCurrency}
                      />
                  ))}
                  {(recurringInvoices || []).length === 0 && (
                      <div className={classes.emptyState}>
                          <Repeat className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                          <h3 className={classes.h3 + " mb-2"}>Keine Abonnements gefunden</h3>
                          <p className={classes.emptyStateText + " mb-4"}>Erstelle dein erstes Abonnement, um loszulegen.</p>
                          <button onClick={handleAddNew} className={classes.btnPrimary}>
                              <Plus className="mr-2 h-4 w-4" /> 
                              Erstes Abo erstellen
                          </button>
                      </div>
                  )}
              </div>
          </div>
        </div>
      </div>
  );
}