import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Play, Pause, MoreVertical, Calendar, Repeat, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const RecurringInvoiceDialog = ({ open, onOpenChange, onSave, coachees, serviceRates, recurringInvoice }) => {
    const [coacheeId, setCoacheeId] = useState('');
    const [rateId, setRateId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [interval, setInterval] = useState('monthly');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    React.useEffect(() => {
        if (recurringInvoice) {
            setCoacheeId(recurringInvoice.coacheeId.toString());
            setRateId(recurringInvoice.rateId.toString());
            setQuantity(recurringInvoice.quantity);
            setInterval(recurringInvoice.interval);
            setStartDate(recurringInvoice.startDate);
        } else {
            setCoacheeId('placeholder');
            setRateId('placeholder');
            setQuantity(1);
            setInterval('monthly');
            setStartDate(new Date().toISOString().split('T')[0]);
        }
    }, [recurringInvoice, open]);

    const handleSave = () => {
        const coachee = coachees.find(c => c.id === parseInt(coacheeId));
        const rate = serviceRates.find(r => r.id === parseInt(rateId));
        if (!coachee || !rate || coacheeId === 'placeholder' || rateId === 'placeholder') return;

        const data = {
            id: recurringInvoice ? recurringInvoice.id : Date.now(),
            coacheeId: parseInt(coacheeId),
            coacheeName: `${coachee.firstName} ${coachee.lastName}`,
            rateId: parseInt(rateId),
            quantity,
            interval,
            startDate,
            status: recurringInvoice ? recurringInvoice.status : 'active',
            nextDueDate: startDate,
        };
        onSave(data);
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card">
                <DialogHeader>
                    <DialogTitle>{recurringInvoice ? 'Abonnement bearbeiten' : 'Neues Abonnement erstellen'}</DialogTitle>
                    <DialogDescription>Richte wiederkehrende Rechnungen für deine Coachees ein.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid gap-2"><Label htmlFor="coachee">Coachee</Label><Select value={coacheeId} onValueChange={setCoacheeId}><SelectTrigger><SelectValue placeholder="Coachee wählen..." /></SelectTrigger><SelectContent><SelectItem value="placeholder" disabled>Bitte wählen...</SelectItem>{coachees.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent></Select></div>
                    <div className="grid gap-2"><Label htmlFor="rate">Honorarsatz</Label><Select value={rateId} onValueChange={setRateId}><SelectTrigger><SelectValue placeholder="Satz wählen..." /></SelectTrigger><SelectContent><SelectItem value="placeholder" disabled>Bitte wählen...</SelectItem>{serviceRates.map(r => <SelectItem key={r.id} value={r.id.toString()}>{r.name} (€{r.price.toFixed(2)})</SelectItem>)}</SelectContent></Select></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2"><Label htmlFor="quantity">Anzahl</Label><Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} min="1" /></div>
                        <div className="grid gap-2"><Label htmlFor="interval">Intervall</Label><Select value={interval} onValueChange={setInterval}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="monthly">Monatlich</SelectItem><SelectItem value="quarterly">Quartalsweise</SelectItem><SelectItem value="yearly">Jährlich</SelectItem></SelectContent></Select></div>
                    </div>
                    <div className="grid gap-2"><Label htmlFor="start-date">Startdatum</Label><Input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Abbrechen</Button></DialogClose>
                    <Button onClick={handleSave}>Speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const RecurringInvoiceCard = ({ item, serviceRates, onUpdate, onDelete }) => {
    const rate = serviceRates.find(r => r.id === item.rateId);
    
    const getStatusVariant = (status) => {
        switch(status) {
            case 'active': return 'bg-green-500/80';
            case 'paused': return 'bg-yellow-500/80';
            default: return 'secondary';
        }
    };

    return (
        <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Repeat className="h-6 w-6 text-white" />
                </div>
                <div>
                    <p className="font-semibold text-white">{rate?.name} ({item.quantity}x)</p>
                    <p className="text-sm text-slate-400 flex items-center gap-2"><User className="h-4 w-4" />{item.coacheeName}</p>
                    <p className="text-sm text-slate-400 flex items-center gap-2"><Calendar className="h-4 w-4" />Nächste Rechnung am: {new Date(item.nextDueDate).toLocaleDateString('de-DE')}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge variant="default" className={getStatusVariant(item.status)}>{item.status === 'active' ? 'Aktiv' : 'Pausiert'}</Badge>
                <p className="text-lg font-bold text-primary">€{((rate?.price || 0) * item.quantity).toFixed(2)}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => onUpdate(item, 'status', item.status === 'active' ? 'paused' : 'active')}>
                            {item.status === 'active' ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            <span>{item.status === 'active' ? 'Pausieren' : 'Aktivieren'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onUpdate(item, 'edit')}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Bearbeiten</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onDelete(item.id)} className="text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Löschen</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export function RecurringInvoices({ recurringInvoices, setRecurringInvoices, coachees, serviceRates }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { toast } = useToast();

  const handleSave = (data) => {
    const existingIndex = (recurringInvoices || []).findIndex(inv => inv.id === data.id);
    if(existingIndex > -1) {
        setRecurringInvoices(prev => prev.map(inv => inv.id === data.id ? data : inv));
        toast({ title: 'Abonnement aktualisiert!', className: 'bg-green-600 text-white' });
    } else {
        setRecurringInvoices(prev => [...(prev || []), data]);
        toast({ title: 'Abonnement erstellt!', className: 'bg-green-600 text-white' });
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
      }
  };
  
  const handleDelete = (id) => {
      setRecurringInvoices(prev => (prev || []).filter(item => item.id !== id));
      toast({ title: 'Abonnement gelöscht!', variant: 'destructive' });
  };
  
  const handleAddNew = () => {
    setSelectedInvoice(null);
    setIsDialogOpen(true);
  };

  return (
      <>
        <RecurringInvoiceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSave} coachees={coachees} serviceRates={serviceRates} recurringInvoice={selectedInvoice} />
        <Card className="glass-card">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Abonnements & Wiederkehrende Rechnungen</CardTitle>
                        <CardDescription>Verwalte deine wiederkehrenden Einnahmen und Abo-Modelle.</CardDescription>
                    </div>
                    <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Neues Abo</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {(recurringInvoices || []).map(item => (
                        <RecurringInvoiceCard key={item.id} item={item} serviceRates={serviceRates} onUpdate={handleUpdate} onDelete={handleDelete} />
                    ))}
                    {(recurringInvoices || []).length === 0 && (
                        <div className="text-center py-12">
                            <Repeat className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">Keine Abonnements gefunden</h3>
                            <p className="text-slate-400 mb-4">Erstelle dein erstes Abonnement, um loszulegen.</p>
                            <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Erstes Abo erstellen</Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </>
  );
}