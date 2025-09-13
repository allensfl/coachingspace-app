import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const InvoiceDetails = ({ invoice, setInvoice, coachees }) => {
  const handleInputChange = (field, value) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field, value) => {
    const finalValue = field === 'coacheeId' && value !== 'placeholder' ? parseInt(value, 10) : value;
    handleInputChange(field, finalValue);
  };
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Rechnungsdetails</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="coachee">Coachee</Label>
          <Select value={invoice.coacheeId.toString()} onValueChange={val => handleSelectChange('coacheeId', val)}>
            <SelectTrigger id="coachee">
              <SelectValue placeholder="Coachee auswählen..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder" disabled>Bitte wählen...</SelectItem>
              {coachees.map((coachee) => (
                <SelectItem key={coachee.id} value={coachee.id.toString()}>
                  {coachee.firstName} {coachee.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoice-number">Rechnungsnummer</Label>
          <Input id="invoice-number" value={invoice.invoiceNumber} onChange={(e) => handleInputChange('invoiceNumber', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoice-date">Rechnungsdatum</Label>
          <Input id="invoice-date" type="date" value={invoice.date} onChange={(e) => handleInputChange('date', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due-date">Zahlungsfrist</Label>
          <Input id="due-date" type="date" value={invoice.dueDate} onChange={(e) => handleInputChange('dueDate', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax-rate">Steuersatz (%)</Label>
          <Input id="tax-rate" type="number" value={invoice.taxRate} onChange={(e) => handleInputChange('taxRate', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Währung</Label>
          <Select value={invoice.currency} onValueChange={val => handleSelectChange('currency', val)}>
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="CHF">CHF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceDetails;