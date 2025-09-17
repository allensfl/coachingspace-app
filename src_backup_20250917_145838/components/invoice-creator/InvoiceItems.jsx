import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const InvoiceItems = ({ items, setItems, serviceRates, currency }) => {
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRateSelect = (index, rateId) => {
    const rate = serviceRates.find(r => r.id.toString() === rateId);
    if (rate) {
      const newItems = [...items];
      newItems[index].description = rate.name;
      newItems[index].price = rate.price;
      newItems[index].rateId = rate.id;
      newItems[index].isCustom = false;
      setItems(newItems);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0.0, isCustom: true }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Rechnungspositionen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-2 rounded-md bg-slate-800/50">
              <div className="col-span-12 md:col-span-5">
                <Select onValueChange={(value) => handleRateSelect(index, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Honorarsatz wählen oder manuell eingeben..." />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="placeholder" disabled>Honorarsatz wählen...</SelectItem>
                    {(serviceRates || []).map(rate => (
                      <SelectItem key={rate.id} value={String(rate.id)}>{rate.name} (€{rate.price.toFixed(2)})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Beschreibung"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="mt-1"
                  disabled={!item.isCustom}
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  type="number"
                  placeholder="Menge"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  type="number"
                  placeholder="Preis"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                  disabled={!item.isCustom}
                />
              </div>
              <div className="col-span-3 md:col-span-2 text-right font-semibold">
                {((item.quantity || 0) * (item.price || 0)).toFixed(2)} {currency}
              </div>
              <div className="col-span-1 text-right">
                <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={addItem} variant="outline" className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Position hinzufügen
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvoiceItems;