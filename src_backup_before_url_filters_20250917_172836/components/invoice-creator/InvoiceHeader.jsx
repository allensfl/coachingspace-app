import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InvoiceHeader = ({ onClose, isNew }) => {
  return (
    <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-700">
      <div>
        <Button variant="ghost" onClick={onClose} className="mb-2 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zu den Rechnungen
        </Button>
        <h1 className="text-3xl font-bold text-white">{isNew ? 'Neue Rechnung' : 'Rechnung bearbeiten'}</h1>
        <p className="text-slate-400">Erstelle und verwalte eine neue Rechnung für deine Coachees.</p>
      </div>
    </div>
  );
};

export default InvoiceHeader;