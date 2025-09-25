import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, User, Mail, ShieldCheck, ShieldOff, ClipboardCopy, Send, Calendar, Users, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { CoacheeStatus } from '@/types';
import { useAppStateContext } from '@/context/AppStateContext';

const CustomFieldInput = ({ field, value, onChange }) => {
  const commonProps = {
    id: field.id,
    value: value || '',
    onChange: onChange,
    className: "mt-1"
  };

  switch (field.type) {
    case 'textarea':
      return <Textarea {...commonProps} />;
    case 'date':
      return <Input type="date" {...commonProps} />;
    case 'number':
      return <Input type="number" {...commonProps} />;
    case 'text':
    default:
      return <Input type="text" {...commonProps} />;
  }
};

const NewCoacheeDialog = ({ open, onOpenChange, addCoachee, customFields }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pronouns: '',
    birthDate: '',
    status: CoacheeStatus.POTENTIAL,
    mainTopic: '',
    tags: '',
    customData: {},
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCustomFieldChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      customData: {
        ...prev.customData,
        [id]: value,
      },
    }));
  };
  
  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        variant: "destructive",
        title: "Fehler: Fehlende Informationen",
        description: "Bitte fülle Vorname, Nachname und E-Mail aus.",
      });
      return;
    }
    
    const newCoacheeData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      coachingStartDate: new Date().toISOString(),
      lastContactDate: new Date().toISOString(),
      shortNote: '',
      confidentialNotes: '',
      quickNotes: [],
      consents: {
        gdpr: false,
        audioRecording: false
      }
    };

    addCoachee(newCoacheeData);
    
    toast({
      title: "Coachee erstellt",
      description: `${formData.firstName} ${formData.lastName} wurde erfolgreich angelegt.`,
      className: "bg-green-600 text-white"
    });
    
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', pronouns: '', 
      birthDate: '',
      status: CoacheeStatus.POTENTIAL, mainTopic: '', tags: '', customData: {}
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Neuen Coachee anlegen</DialogTitle>
          <DialogDescription className="text-slate-400">
            Fülle die Informationen aus, um einen neuen Klienten zu deinem System hinzuzufügen.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName" className="text-slate-300">Vorname</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  placeholder="Max" 
                  required 
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName" className="text-slate-300">Nachname</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder="Mustermann" 
                  required 
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-300">E-Mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="max@example.com" 
                  required 
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-slate-300">Telefon</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+49 123 456789" 
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pronouns" className="text-slate-300">Anrede/Pronomen</Label>
                <Input 
                  id="pronouns" 
                  value={formData.pronouns} 
                  onChange={handleChange} 
                  placeholder="Er/Ihm" 
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthDate" className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4" />
                  Geburtstag
                </Label>
                <Input 
                  id="birthDate" 
                  type="date"
                  value={formData.birthDate} 
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status" className="text-slate-300">Status</Label>
                <Select value={formData.status} onValueChange={handleSelectChange}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Status auswählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value={CoacheeStatus.POTENTIAL}>Potenziell</SelectItem>
                    <SelectItem value={CoacheeStatus.ACTIVE}>Aktiv</SelectItem>
                    <SelectItem value={CoacheeStatus.PAUSED}>Pausiert</SelectItem>
                    <SelectItem value={CoacheeStatus.COMPLETED}>Abgeschlossen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div></div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mainTopic" className="text-slate-300">Hauptthema/Anliegen</Label>
              <Textarea 
                id="mainTopic" 
                value={formData.mainTopic} 
                onChange={handleChange} 
                placeholder="Beschreibe das Hauptanliegen des Coachees..." 
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags" className="text-slate-300">Tags (kommagetrennt)</Label>
              <Input 
                id="tags" 
                value={formData.tags} 
                onChange={handleChange} 
                placeholder="Führungskraft, Karriere, Startup" 
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            
            {customFields && customFields.length > 0 && (
              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">Zusätzliche Informationen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customFields.map(field => (
                    <div key={field.id} className="grid gap-2">
                      <Label htmlFor={field.id} className="text-slate-300">{field.label}</Label>
                      <CustomFieldInput 
                        field={field} 
                        value={formData.customData[field.id]} 
                        onChange={handleCustomFieldChange} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                Abbrechen
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
              Coachee speichern
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function Coachees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewCoacheeDialogOpen, setIsNewCoacheeDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { state, actions } = useAppStateContext();
  const { coachees, settings } = state;
  const { addCoachee } = actions;

  const handleCopyConsentLink = (coacheeId) => {
    const consentLink = `${window.location.origin}/consent/${coacheeId}`;
    navigator.clipboard.writeText(consentLink);
    toast({
      title: "Link kopiert",
      description: "Der Einladungslink wurde in die Zwischenablage kopiert.",
      className: "bg-blue-600 text-white"
    });
  };

  const filteredCoachees = (coachees || []).filter(coachee => {
    const name = `${coachee.firstName} ${coachee.lastName}`;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coachee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || coachee.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case CoacheeStatus.ACTIVE: return 'bg-green-500/20 text-green-400 border-green-500/30';
      case CoacheeStatus.COMPLETED: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case CoacheeStatus.PAUSED: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case CoacheeStatus.POTENTIAL: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case CoacheeStatus.ACTIVE: return 'Aktiv';
      case CoacheeStatus.COMPLETED: return 'Abgeschlossen';
      case CoacheeStatus.PAUSED: return 'Pausiert';
      case CoacheeStatus.POTENTIAL: return 'Potenziell';
      default: return 'Unbekannt';
    }
  };

  const statusFilters = [
    { value: 'all', label: 'Alle', count: coachees?.length || 0 },
    { value: CoacheeStatus.ACTIVE, label: 'Aktiv', count: coachees?.filter(c => c.status === CoacheeStatus.ACTIVE).length || 0 },
    { value: CoacheeStatus.POTENTIAL, label: 'Potenziell', count: coachees?.filter(c => c.status === CoacheeStatus.POTENTIAL).length || 0 },
    { value: CoacheeStatus.PAUSED, label: 'Pausiert', count: coachees?.filter(c => c.status === CoacheeStatus.PAUSED).length || 0 },
    { value: CoacheeStatus.COMPLETED, label: 'Abgeschlossen', count: coachees?.filter(c => c.status === CoacheeStatus.COMPLETED).length || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <Helmet>
        <title>Coachees - Coachingspace</title>
        <meta name="description" content="Verwalte deine Coaching-Klienten, behalte den Überblick über Sessions und Fortschritte." />
      </Helmet>
      
      <NewCoacheeDialog 
        open={isNewCoacheeDialogOpen} 
        onOpenChange={setIsNewCoacheeDialogOpen} 
        addCoachee={addCoachee}
        customFields={settings.coacheeFields}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              Coachees
            </h1>
            <p className="text-slate-400 text-lg mt-2">Verwalte deine Coaching-Klienten</p>
          </div>
          <Button 
            onClick={() => setIsNewCoacheeDialogOpen(true)} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Neuer Coachee
          </Button>
        </div>

        {/* Filter und Suche */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-2xl">
          <div className="flex flex-col gap-6">
            {/* Suchfeld */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Coachees durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 h-12 text-lg"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Status:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {statusFilters.map(filter => (
                  <Button
                    key={filter.value}
                    variant={filterStatus === filter.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(filter.value)}
                    className={`${
                      filterStatus === filter.value 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                        : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                    } px-4 py-2`}
                  >
                    {filter.label}
                    <Badge variant="secondary" className="ml-2 bg-slate-600/50 text-slate-200">
                      {filter.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coachees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoachees.map((coachee, index) => (
            <motion.div
              key={coachee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full"
            >
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl hover:bg-slate-800/70 transition-all duration-300 group h-full flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50">
                  <Link to={`/coachees/${coachee.id}`} className="block">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {coachee.firstName[0]}{coachee.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {coachee.firstName} {coachee.lastName}
                          </h3>
                          <Badge className={`text-xs ${getStatusColor(coachee.status)} mt-1`}>
                            {getStatusText(coachee.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {coachee.consents?.gdpr ? (
                          <div className="p-1 bg-green-500/20 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-green-400" title="DSGVO-Zustimmung erteilt" />
                          </div>
                        ) : (
                          <div className="p-1 bg-red-500/20 rounded-lg">
                            <ShieldOff className="h-5 w-5 text-red-400" title="DSGVO-Zustimmung fehlt" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Content */}
                <Link to={`/coachees/${coachee.id}`} className="flex-grow flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="space-y-4">
                      <div className="flex items-center text-slate-400">
                        <Mail className="mr-3 h-4 w-4" />
                        <span className="text-sm">{coachee.email}</span>
                      </div>
                      
                      {coachee.mainTopic && (
                        <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
                          {coachee.mainTopic}
                        </p>
                      )}
                      
                      {coachee.tags && coachee.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {coachee.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge 
                              key={tagIndex} 
                              variant="outline" 
                              className="text-xs bg-slate-700/50 border-slate-600 text-slate-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {coachee.tags.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-slate-700/50 border-slate-600 text-slate-400"
                            >
                              +{coachee.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 pt-0">
                    {!coachee.consents?.gdpr ? (
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          handleCopyConsentLink(coachee.id); 
                        }}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        DSGVO-Einladung senden
                      </Button>
                    ) : (
                      <div className="flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-700/50">
                        <span>{coachee.sessions?.length || 0} Sessions</span>
                        <span>Seit {new Date(coachee.coachingStartDate).toLocaleDateString('de-DE')}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCoachees.length === 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl">
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Keine Coachees gefunden</h3>
              <p className="text-slate-400 mb-6 text-lg">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Versuche andere Suchbegriffe oder Filter.'
                  : 'Füge deinen ersten Coachee hinzu, um zu beginnen.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button 
                  onClick={() => setIsNewCoacheeDialogOpen(true)} 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 text-lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Ersten Coachee hinzufügen
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}