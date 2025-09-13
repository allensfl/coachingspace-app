import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import RateEditorDialog from './RateEditorDialog';

const ServiceRates = ({ rates, setRates }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const { toast } = useToast();

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
    toast({
        title: "Honorarsatz gelöscht!",
        className: 'bg-green-600 text-white'
    });
  }

  const handleSave = (newRateData) => {
    const currentRates = rates || [];
    const existingIndex = currentRates.findIndex(r => r.id === newRateData.id);
    if (existingIndex > -1) {
        setRates(prevRates => {
            const updatedRates = [...(prevRates || [])];
            updatedRates[existingIndex] = newRateData;
            return updatedRates;
        });
    } else {
        setRates(prevRates => [...(prevRates || []), newRateData]);
    }
    setIsEditorOpen(false);
    toast({
        title: "Honorarsatz gespeichert!",
        className: 'bg-green-600 text-white'
    });
  };

  return (
    <>
      <RateEditorDialog
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        onSave={handleSave}
        rate={selectedRate}
      />
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Honorarsätze</CardTitle>
          <CardDescription>Verwalte deine Standard-Dienstleistungen und deren Preise für eine schnellere Rechnungsstellung.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(rates || []).map(rate => (
              <div key={rate.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-semibold text-white">{rate.name}</p>
                  <p className="text-sm text-slate-400">{rate.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-primary">€{rate.price.toFixed(2)}</p>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(rate)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(rate.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            ))}
            <Button onClick={handleAdd} className="mt-4 w-full">
              <Plus className="mr-2 h-4 w-4" /> Neuen Honorarsatz hinzufügen
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ServiceRates;