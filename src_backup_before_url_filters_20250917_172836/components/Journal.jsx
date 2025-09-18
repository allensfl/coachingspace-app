import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Search, Settings, Filter, Users, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { isToday, isThisWeek, isThisMonth, isThisYear, parseISO } from 'date-fns';
import { useAppStateContext } from '@/context/AppStateContext';
import JournalEntryDialog from './journal/JournalEntryDialog';
import ManageCategoriesDialog from './journal/ManageCategoriesDialog';
import JournalEntryDetailDialog from './journal/JournalEntryDetailDialog';
import JournalEntryCard from './journal/JournalEntryCard';

export default function Journal() {
  const { state, actions } = useAppStateContext();
  const { journalEntries, coachees, settings } = state;
  const { setJournalEntries, updateJournalCategories } = actions;
  const { journalCategories } = settings;

  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isEntryDetailOpen, setIsEntryDetailOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const { toast } = useToast();

  const handleOpenNewEntryDialog = () => {
    setEditingEntry(null);
    setIsEntryDialogOpen(true);
  };

  const handleOpenEditEntryDialog = (entry) => {
    if (entry.isShared) {
        toast({
            variant: "destructive",
            title: "Bearbeiten nicht möglich",
            description: "Von Coachees geteilte Einträge können nicht bearbeitet werden."
        });
        return;
    }
    setEditingEntry(entry);
    setIsEntryDialogOpen(true);
  };

  const handleOpenEntryDetailDialog = (entry) => {
    setSelectedEntry(entry);
    setIsEntryDetailOpen(true);
  };

  const handleSaveEntry = useCallback((entryData) => {
    setJournalEntries(prev => {
      const existingEntryIndex = (prev || []).findIndex(e => e.id === entryData.id);
      if (existingEntryIndex > -1) {
        toast({
          title: "Eintrag aktualisiert",
          description: "Dein Journal-Eintrag wurde erfolgreich aktualisiert.",
          className: 'bg-green-600 text-white'
        });
        return prev.map(e => e.id === entryData.id ? entryData : e).sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        toast({
          title: "Eintrag gespeichert",
          description: "Dein neuer Journal-Eintrag wurde hinzugefügt.",
          className: 'bg-green-600 text-white'
        });
        return [entryData, ...(prev || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    });
  }, [setJournalEntries, toast]);
  
  const handleDeleteEntry = useCallback((entryId, isShared) => {
    if (isShared) {
        toast({
            variant: "destructive",
            title: "Löschen nicht möglich",
            description: "Geteilte Einträge können nur vom Coachee gelöscht werden."
        });
        return;
    }
    setJournalEntries(prev => prev.filter(e => e.id !== entryId));
    toast({
      title: "Eintrag gelöscht",
      description: "Der Journal-Eintrag wurde erfolgreich entfernt.",
      className: 'bg-red-600 text-white'
    });
  }, [setJournalEntries, toast]);

  const handleUpdateCategories = useCallback((newCategories) => {
    updateJournalCategories(newCategories);
    toast({
      title: "Kategorien aktualisiert",
      description: "Deine Journal-Kategorien wurden gespeichert.",
      className: 'bg-green-600 text-white'
    });
  }, [updateJournalCategories, toast]);

  const getCategory = useCallback((categoryId) => (journalCategories || []).find(c => c.id === categoryId), [journalCategories]);

  const getCoacheeName = useCallback((coacheeId) => {
    const coachee = (coachees || []).find(c => c.id === coacheeId);
    return coachee ? `${coachee.firstName} ${coachee.lastName}` : null;
  }, [coachees]);

  const filteredEntries = useMemo(() => {
    return (journalEntries || []).filter(entry => {
      const entryDate = parseISO(entry.date);

      const dateMatch =
        dateFilter === 'all' ||
        (dateFilter === 'today' && isToday(entryDate)) ||
        (dateFilter === 'week' && isThisWeek(entryDate, { weekStartsOn: 1 })) ||
        (dateFilter === 'month' && isThisMonth(entryDate)) ||
        (dateFilter === 'year' && isThisYear(entryDate));
      
      if (!dateMatch) return false;

      const searchLower = searchTerm.toLowerCase();
      if (!searchLower) return true;

      const titleMatch = entry.title && entry.title.toLowerCase().includes(searchLower);
      const contentMatch = entry.content.toLowerCase().includes(searchLower);
      const category = entry.categoryId ? getCategory(entry.categoryId) : null;
      const categoryMatch = category ? category.name.toLowerCase().includes(searchLower) : false;
      const coachee = entry.coacheeId ? coachees.find(c => c.id === entry.coacheeId) : null;
      const coacheeMatch = coachee ? `${coachee.firstName} ${coachee.lastName}`.toLowerCase().includes(searchLower) : false;
      return titleMatch || contentMatch || categoryMatch || coacheeMatch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [journalEntries, searchTerm, dateFilter, coachees, journalCategories, getCategory]);

  return (
    <>
      <Helmet>
        <title>Journal - Coachingspace</title>
        <meta name="description" content="Reflektiere deine Coaching-Praxis mit persönlichen Journal-Einträgen und Erkenntnissen." />
      </Helmet>

      <JournalEntryDialog
        open={isEntryDialogOpen}
        onOpenChange={setIsEntryDialogOpen}
        onSave={handleSaveEntry}
        coachees={coachees}
        categories={journalCategories || []}
        initialEntry={editingEntry}
      />
      <ManageCategoriesDialog open={isManageCategoriesOpen} onOpenChange={setIsManageCategoriesOpen} categories={journalCategories || []} updateCategories={handleUpdateCategories} />
      <JournalEntryDetailDialog
        open={isEntryDetailOpen}
        onOpenChange={setIsEntryDetailOpen}
        entry={selectedEntry}
        getCategory={getCategory}
        getCoacheeName={getCoacheeName}
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Journal</h1>
            <p className="text-slate-400">Reflektiere deine Coaching-Praxis und sieh geteilte Einträge.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsManageCategoriesOpen(true)} variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Kategorien
            </Button>
            <Button onClick={handleOpenNewEntryDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Neuer Eintrag
            </Button>
          </div>
        </div>

        <Card className="glass-card">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Einträge durchsuchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Zeitfilter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Alle Einträge</SelectItem>
                            <SelectItem value="today">Heute</SelectItem>
                            <SelectItem value="week">Diese Woche</SelectItem>
                            <SelectItem value="month">Dieser Monat</SelectItem>
                            <SelectItem value="year">Dieses Jahr</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Users className="h-4 w-4 text-primary" />
          <span>Einträge, die von Coachees mit dir geteilt wurden, sind mit diesem Icon markiert und können nicht bearbeitet oder gelöscht werden.</span>
        </div>

        <div className="space-y-6">
          {filteredEntries.map((entry, index) => (
             <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <JournalEntryCard
                    entry={entry}
                    getCategory={getCategory}
                    getCoacheeName={getCoacheeName}
                    onDelete={handleDeleteEntry}
                    onEdit={handleOpenEditEntryDialog}
                    onOpenDetail={handleOpenEntryDetailDialog}
                />
            </motion.div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Keine Journal-Einträge gefunden</h3>
              <p className="text-slate-400 mb-4">{searchTerm || dateFilter !== 'all' ? 'Deine Suche/Filterung ergab keine Treffer.' : 'Beginne mit deinem ersten Eintrag.'}</p>
              {!searchTerm && dateFilter === 'all' && <Button onClick={handleOpenNewEntryDialog} className="bg-blue-600 hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" />Ersten Eintrag erstellen</Button>}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}