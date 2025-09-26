import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { parseISO, format } from 'date-fns';
import { de } from 'date-fns/locale';

const JournalEntryDetailDialog = ({ open, onOpenChange, entry, getCategory, getCoacheeName }) => {
  if (!entry) return null;

  const category = getCategory(entry.categoryId);
  const coacheeName = getCoacheeName(entry.coacheeId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] glass-card">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">{entry.title}</DialogTitle>
          <div className="flex flex-wrap gap-2 mt-2 items-center">
            <div className="flex items-center text-sm text-slate-400">
              <Calendar className="mr-2 h-4 w-4" />
              {format(parseISO(entry.date), 'dd. MMMM yyyy', { locale: de })}
            </div>
            {category && (
              <Badge style={{ backgroundColor: `${category.color}20`, color: category.color, borderColor: `${category.color}30` }}>
                {category.name}
              </Badge>
            )}
            {coacheeName && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {coacheeName}
              </Badge>
            )}
          </div>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto pr-4">
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">{entry.content}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Schliessen</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JournalEntryDetailDialog;