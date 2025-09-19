import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {rate ? 'Honorarsatz bearbeiten' : 'Neuen Honorarsatz erstellen'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Definiere deine Standard-Dienstleistungen und Preise.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-white">Name</Label>
                        <Input 
                            id="name"
                            placeholder="z.B. Einzelcoaching (60 Min)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-white">Beschreibung</Label>
                        <Input 
                            id="description"
                            placeholder="Optionale Beschreibung..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price" className="text-white">Preis</Label>
                            <Input 
                                id="price"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
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
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            Abbrechen
                        </Button>
                    </DialogClose>
                    <Button 
                        onClick={handleSave}
                        disabled={!name.trim() || !price}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        Speichern
                    </Button>
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
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            
            <RateEditorDialog
                open={isEditorOpen}
                onOpenChange={setIsEditorOpen}
                onSave={handleSave}
                rate={selectedRate}
            />
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-white">Honorarsätze</CardTitle>
                            <CardDescription className="text-gray-400">
                                Verwalte deine Standard-Dienstleistungen und deren Preise für eine schnellere Rechnungsstellung.
                            </CardDescription>
                        </div>
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
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {(rates || []).map(rate => (
                            <div key={rate.id} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors">
                                <div className="flex-1">
                                    <p className="font-semibold text-white text-lg">{rate.name}</p>
                                    {rate.description && (
                                        <p className="text-sm text-gray-400 mt-1">{rate.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-xl font-bold text-blue-400 min-w-[100px] text-right">
                                        {formatCurrency(rate.price || 0, rate.currency || defaultCurrency)}
                                    </p>
                                    <div className="flex gap-1">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleEdit(rate)}
                                            className="text-gray-400 hover:text-white hover:bg-gray-600"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleDelete(rate.id)}
                                            className="text-gray-400 hover:text-red-400 hover:bg-gray-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {(rates || []).length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Plus className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-white mb-2">Keine Honorarsätze gefunden</h3>
                                <p className="text-gray-400 mb-4">Erstelle deinen ersten Honorarsatz, um zu beginnen.</p>
                                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Ersten Honorarsatz erstellen
                                </Button>
                            </div>
                        )}
                        
                        {(rates || []).length > 0 && (
                            <Button onClick={handleAdd} className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" /> 
                                Neuen Honorarsatz hinzufügen
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default ServiceRates;