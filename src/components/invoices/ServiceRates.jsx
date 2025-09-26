import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';
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

const ServiceRates = ({ rates, setRates }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedRate, setSelectedRate] = useState(null);
    const [defaultCurrency, setDefaultCurrency] = useState('EUR');
    
    // Währungs-Management
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

    const handleAdd = () => {
        setSelectedRate(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (rate) => {
        setSelectedRate(rate);
        setIsEditorOpen(true);
    };

    const handleDelete = (rateId) => {
        setRates(prevRates => (prevRates || []).filter(r => r.id !== rateId));
        toast.success("Honorarsatz gelöscht!");
    };

    const handleSave = (newRateData) => {
        const currentRates = rates || [];
        const existingIndex = currentRates.findIndex(r => r.id === newRateData.id);
        
        if (existingIndex > -1) {
            setRates(prevRates => {
                const updatedRates = [...(prevRates || [])];
                updatedRates[existingIndex] = newRateData;
                return updatedRates;
            });
            toast.success("Honorarsatz aktualisiert!");
        } else {
            setRates(prevRates => [...(prevRates || []), newRateData]);
            toast.success("Honorarsatz erstellt!");
        }
        setIsEditorOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="">
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                
                <RateEditorDialog
                    open={isEditorOpen}
                    onOpenChange={setIsEditorOpen}
                    onSave={handleSave}
                    rate={selectedRate}
                />
                
                <div className={classes.card}>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className={classes.h1}>Honorarsätze</h1>
                            <p className={classes.body}>
                                Verwalte deine Standard-Dienstleistungen und deren Preise für eine schnellere Rechnungsstellung.
                            </p>
                        </div>
                        <select
                            value={defaultCurrency}
                            onChange={(e) => setDefaultCurrency(e.target.value)}
                            className={classes.select + " min-w-[120px]"}
                        >
                            <option value="EUR">€ Euro</option>
                            <option value="CHF">CHF Franken</option>
                            <option value="USD">$ Dollar</option>
                        </select>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        {(rates || []).map(rate => (
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
                                            {formatCurrency(rate.price || 0, rate.currency || defaultCurrency)}
                                        </p>
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => handleEdit(rate)}
                                                className={classes.btnIcon}
                                                title="Bearbeiten"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(rate.id)}
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
                        
                        {(rates || []).length === 0 && (
                            <div className={classes.emptyState}>
                                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Plus className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className={classes.h3 + " mb-2"}>Keine Honorarsätze gefunden</h3>
                                <p className={classes.emptyStateText + " mb-4"}>Erstelle deinen ersten Honorarsatz, um zu beginnen.</p>
                                <button onClick={handleAdd} className={classes.btnPrimary}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Ersten Honorarsatz erstellen
                                </button>
                            </div>
                        )}
                        
                        {(rates || []).length > 0 && (
                            <button onClick={handleAdd} className={classes.btnPrimary + " mt-4 w-full"}>
                                <Plus className="mr-2 h-4 w-4" /> 
                                Neuen Honorarsatz hinzufügen
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRates;