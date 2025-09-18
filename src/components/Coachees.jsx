import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, User, Mail, ShieldCheck, ShieldOff, ClipboardCopy, Send, Calendar } from 'lucide-react';
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
    birthDate: '', // ✅ GEBURTSTAG-FELD HINZUGEFÜGT
    status: CoacheeStatus.POTENTIAL,
    mainTopic: '',
    tags: '',
    customData: {},
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(`Form-Feld geändert: ${id} = ${value}`); // Debug-Log
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

    console.log('Neuer Coachee wird erstellt:', newCoacheeData); // Debug-Log
    addCoachee(newCoacheeData);
    
    toast({
      title: "✅ Coachee erstellt!",
      description: `${formData.firstName} ${formData.lastName} wurde erfolgreich angelegt.`,
    });
    
    // ✅ FORM-RESET MIT GEBURTSTAG-FELD
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', pronouns: '', 
      birthDate: '', // ✅ GEBURTSTAG WIRD AUCH ZURÜCKGESETZT
      status: CoacheeStatus.POTENTIAL, mainTopic: '', tags: '', customData: {}
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl">Neuen Coachee anlegen</DialogTitle>
          <DialogDescription>
            Fülle die Informationen aus, um einen neuen Klienten zu deinem System hinzuzufügen.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  placeholder="Max" 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder="Mustermann" 
                  required 
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="max@example.com" 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+49 123 456789" 
                />
              </div>
            </div>

            {/* Pronouns & Birthday */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pronouns">Anrede/Pronomen</Label>
                <Input 
                  id="pronouns" 
                  value={formData.pronouns} 
                  onChange={handleChange} 
                  placeholder="Er/Ihm" 
                />
              </div>
              {/* ✅ GEBURTSTAG-FELD HINZUGEFÜGT */}
              <div className="grid gap-2">
                <Label htmlFor="birthDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Geburtstag
                </Label>
                <Input 
                  id="birthDate" 
                  type="date"
                  value={formData.birthDate} 
                  onChange={handleChange}
                  className="text-white"
                />
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CoacheeStatus.POTENTIAL}>Potenziell</SelectItem>
                    <SelectItem value={CoacheeStatus.ACTIVE}>Aktiv</SelectItem>
                    <SelectItem value={CoacheeStatus.PAUSED}>Pausiert</SelectItem>
                    <SelectItem value={CoacheeStatus.COMPLETED}>Abgeschlossen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Platzhalter für symmetrisches Layout */}
              <div></div>
            </div>

            {/* Main Topic */}
            <div className="grid gap-2">
              <Label htmlFor="mainTopic">Hauptthema/Anliegen</Label>
              <Textarea 
                id="mainTopic" 
                value={formData.mainTopic} 
                onChange={handleChange} 
                placeholder="Beschreibe das Hauptanliegen des Coachees..." 
              />
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (kommagetrennt)</Label>
              <Input 
                id="tags" 
                value={formData.tags} 
                onChange={handleChange} 
                placeholder="Führungskraft, Karriere, Startup" 
              />
            </div>
            
            {/* Custom Fields */}
            {customFields && customFields.length > 0 && (
              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">Zusätzliche Informationen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customFields.map(field => (
                    <div key={field.id} className="grid gap-2">
                      <Label htmlFor={field.id}>{field.label}</Label>
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
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Abbrechen</Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
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
      title: "✅ Link kopiert!",
      description: "Der Einladungslink wurde in die Zwischenablage kopiert. Sende ihn jetzt an deinen Coachee!",
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
      case CoacheeStatus.ACTIVE: return 'status-active';
      case CoacheeStatus.COMPLETED: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case CoacheeStatus.PAUSED: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case CoacheeStatus.POTENTIAL: return 'status-pending';
      default: return 'status-inactive';
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
    { value: 'all', label: 'Alle' },
    { value: CoacheeStatus.ACTIVE, label: 'Aktiv' },
    { value: CoacheeStatus.POTENTIAL, label: 'Potenziell' },
    { value: CoacheeStatus.PAUSED, label: 'Pausiert' },
    { value: CoacheeStatus.COMPLETED, label: 'Abgeschlossen' },
  ];

  return (
    <>
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

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Coachees</h1>
            <p className="text-slate-400">Verwalte deine Coaching-Klienten</p>
          </div>
          <Button onClick={() => setIsNewCoacheeDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Neuer Coachee
          </Button>
        </div>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Coachees suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {statusFilters.map(filter => (
                   <Button
                    key={filter.value}
                    variant={filterStatus === filter.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(filter.value)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoachees.map((coachee, index) => (
            <motion.div
              key={coachee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="glass-card hover:bg-slate-800/50 transition-all duration-300 group h-full flex flex-col">
                <CardHeader className="pb-3">
                   <Link to={`/coachees/${coachee.id}`} className="block">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{coachee.firstName[0]}{coachee.lastName[0]}</span>
                          </div>
                          <div>
                            <CardTitle className="text-white group-hover:text-blue-400 transition-colors text-lg">
                              {coachee.firstName} {coachee.lastName}
                            </CardTitle>
                            <Badge className={`text-xs ${getStatusColor(coachee.status)}`}>
                              {getStatusText(coachee.status)}
                            </Badge>
                          </div>
                        </div>
                        {coachee.consents?.gdpr ? (
                          <ShieldCheck className="h-5 w-5 text-green-400 flex-shrink-0" title="DSGVO-Zustimmung erteilt" />
                        ) : (
                          <ShieldOff className="h-5 w-5 text-red-400 flex-shrink-0" title="DSGVO-Zustimmung fehlt" />
                        )}
                      </div>
                   </Link>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <Link to={`/coachees/${coachee.id}`} className="block flex-grow">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-slate-400">
                          <Mail className="mr-2 h-4 w-4" />
                          {coachee.email}
                        </div>
                        <p className="text-sm text-slate-300 line-clamp-2">{coachee.mainTopic}</p>
                        <div className="flex flex-wrap gap-1">
                          {coachee.tags?.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                  </Link>
                  <div className="pt-3 mt-auto">
                    {!coachee.consents?.gdpr ? (
                      <Button 
                        size="sm" 
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                        onClick={(e) => { e.stopPropagation(); handleCopyConsentLink(coachee.id); }}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Einladung zur DSGVO senden
                      </Button>
                    ) : (
                      <div className="flex justify-between text-xs text-slate-500 pt-3 border-t border-slate-700">
                        <span>{coachee.sessions?.length || 0} Sessions</span>
                        <span>Seit {new Date(coachee.coachingStartDate).toLocaleDateString('de-DE')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCoachees.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <User className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Keine Coachees gefunden</h3>
              <p className="text-slate-400 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Versuche andere Suchbegriffe oder Filter.'
                  : 'Füge deinen ersten Coachee hinzu, um zu beginnen.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={() => setIsNewCoacheeDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Ersten Coachee hinzufügen
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}