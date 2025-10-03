import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Edit, Trash2, Users } from 'lucide-react';
import { parseISO, format } from 'date-fns';
import { de } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const JournalEntryCard = ({ entry, getCategory, getCoacheeName, onDelete, onEdit, onOpenDetail }) => {
  const category = getCategory(entry.categoryId);
  const coacheeName = getCoacheeName(entry.coacheeId);

  return (
    <Card className="glass-card hover:bg-slate-800/50 transition-colors">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            {entry.isShared && (
              <div className="flex-shrink-0" title="Vom Coachee geteilt">
                <Users className="h-5 w-5 text-primary" />
              </div>
            )}
            <CardTitle className="text-white text-xl">{entry.title || 'Journaleintrag'}</CardTitle>
          </div>
          <div className="flex items-center text-sm text-slate-400 flex-shrink-0">
            <Calendar className="mr-2 h-4 w-4" />
            {format(parseISO(entry.date), 'dd. MMMM yyyy', { locale: de })}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 items-center">
          {category && (
            <Badge style={{ backgroundColor: `${category.color}20`, color: category.color, borderColor: `${category.color}30` }}>
              {category.name}
            </Badge>
          )}
          {coacheeName && !entry.isShared && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {coacheeName}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent onClick={() => onOpenDetail(entry)} className="cursor-pointer">
        <p className="text-slate-300 leading-relaxed whitespace-pre-line line-clamp-3">{entry.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(entry)} disabled={entry.isShared}>
          <Edit className="h-4 w-4 mr-2" /> Bearbeiten
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" disabled={entry.isShared}>
              <Trash2 className="h-4 w-4 mr-2" /> Löschen
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-card">
            <AlertDialogHeader>
              <AlertDialogTitle>Eintrag wirklich löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird der Journal-Eintrag "{entry.title}" dauerhaft entfernt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(entry.id, entry.isShared)} className="bg-red-500 hover:bg-red-600">Löschen</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default JournalEntryCard;