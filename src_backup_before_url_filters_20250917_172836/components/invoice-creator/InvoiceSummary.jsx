import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, Download, Send } from 'lucide-react';

const InvoiceSummary = ({
  items,
  taxRate,
  currency,
  onSaveDraft,
  onSaveAndDownload,
  onSaveAndSend,
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);
  const taxAmount = subtotal * (parseFloat(taxRate) / 100);
  const total = subtotal + taxAmount;

  const getCurrencySymbol = (curr) => {
    const symbols = { EUR: '€', USD: '$', CHF: 'CHF' };
    return symbols[curr] || curr;
  };

  return (
    <Card className="glass-card sticky top-8">
      <CardHeader>
        <CardTitle>Zusammenfassung & Aktionen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-400">Zwischensumme</span>
            <span className="font-semibold">{subtotal.toFixed(2)} {getCurrencySymbol(currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Steuer ({taxRate}%)</span>
            <span className="font-semibold">{taxAmount.toFixed(2)} {getCurrencySymbol(currency)}</span>
          </div>
          <Separator className="bg-slate-700" />
          <div className="flex justify-between text-lg font-bold text-primary">
            <span>Gesamtbetrag</span>
            <span>{total.toFixed(2)} {getCurrencySymbol(currency)}</span>
          </div>
        </div>
        <Separator className="my-6 bg-slate-700" />
        <div className="space-y-3">
          <Button onClick={onSaveDraft} className="w-full" variant="secondary">
            <Save className="mr-2 h-4 w-4" /> Als Entwurf speichern
          </Button>
          <Button onClick={onSaveAndDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Speichern & Herunterladen
          </Button>
          <Button onClick={onSaveAndSend} className="w-full" variant="outline">
            <Send className="mr-2 h-4 w-4" /> Speichern & Senden
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceSummary;