import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Video, Phone, Users, Play, Archive, ArchiveRestore, CalendarPlus, Package, FileText as InvoiceIcon, Calendar, User, Clock, ClipboardList, Zap, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SessionMode, SessionStatus } from '@/types';

const getModeIcon = (mode) => {
  switch (mode) {
    case SessionMode.IN_PERSON: return MapPin;
    case SessionMode.REMOTE: return Video;
    case SessionMode.PHONE: return Phone;
    case SessionMode.HYBRID: return Users;
    default: return Users;
  }
};

const getModeText = (mode) => {
  switch (mode) {
    case SessionMode.IN_PERSON: return 'Vor Ort';
    case SessionMode.REMOTE: return 'Remote';
    case SessionMode.PHONE: return 'Telefon';
    case SessionMode.HYBRID: return 'Hybrid';
    default: return 'Hybrid';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case SessionStatus.PLANNED: return 'status-pending';
    case SessionStatus.COMPLETED: return 'status-active';
    case SessionStatus.CANCELED: return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'status-inactive';
  }
};

const SessionCard = ({ 
  session, 
  index, 
  onCardClick, 
  onDirectStart,
  onToggleArchive, 
  onDeleteSession,  // ← NEU: Delete-Handler hinzugefügt
  onStatusChange, 
  onCreateInvoice, 
  activePackages, 
  onAddToCalendar 
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const ModeIcon = getModeIcon(session.mode);
  const relatedPackage = session.packageId ? (activePackages || []).find(p => p.id === session.packageId) : null;

  const handleDelete = async () => {
    if (!onDeleteSession) return;
    
    setIsDeleting(true);
    try {
      await onDeleteSession(session.id);
    } catch (error) {
      console.error('Fehler beim Löschen der Session:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      key={session.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-slate-700 rounded-lg p-4 hover:bg-slate-800/50 transition-colors group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start space-x-4 flex-1 cursor-pointer" onClick={() => onCardClick(session)}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(session.status)} bg-opacity-20`}>
            <Calendar className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate group-hover:text-blue-400">{session.topic}</h3>
            <div className="text-sm text-slate-400 mb-2 flex items-center flex-wrap gap-x-2">
              <span className="flex items-center"><User className="inline h-3 w-3 mr-1" />{session.coacheeName}</span>
              <span className="flex items-center"><Clock className="inline h-3 w-3 mr-1" />{new Date(session.date).toLocaleDateString('de-DE')}</span>
            </div>
            <p className="text-sm text-slate-300 line-clamp-1">{session.coachNotes}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <div className="flex flex-col items-end gap-2">
             {relatedPackage && (
               <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">
                <Package className="mr-1 h-3 w-3" /> {relatedPackage.packageName} ({relatedPackage.usedUnits}/{relatedPackage.totalUnits})
               </Badge>
             )}
             <Select value={session.status} onValueChange={(newStatus) => onStatusChange(session.id, newStatus)}>
                <SelectTrigger className={`w-[140px] text-xs h-7 ${getStatusColor(session.status)}`}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={SessionStatus.PLANNED}>Geplant</SelectItem>
                    <SelectItem value={SessionStatus.COMPLETED}>Abgeschlossen</SelectItem>
                    <SelectItem value={SessionStatus.CANCELED}>Abgesagt</SelectItem>
                </SelectContent>
            </Select>
            <Badge variant="outline" className="text-xs"><ModeIcon className="mr-1 h-3 w-3" />{getModeText(session.mode)}</Badge>
          </div>
          <div className="flex gap-2">
            {session.status === SessionStatus.PLANNED && (
              <Button size="icon" variant="ghost" onClick={() => onAddToCalendar(session)} title="Zum Kalender hinzufügen">
                <CalendarPlus className="h-4 w-4" />
              </Button>
            )}
            
            {session.status === SessionStatus.PLANNED && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate(`/sessions/${session.id}/prepare`)}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                  title="Session mit Vorbereitung starten"
                >
                  <ClipboardList className="h-4 w-4 mr-2" /> 
                  Vorbereitung
                </Button>
                
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700" 
                  onClick={() => onDirectStart ? onDirectStart(session) : navigate(`/coaching-room/${session.id}`)}
                  title="Session direkt ohne Vorbereitung starten"
                >
                  <Zap className="h-4 w-4 mr-2" /> 
                  Direktstart
                </Button>
              </>
            )}
            
            {session.status === SessionStatus.COMPLETED && !session.billed && !session.packageId && (
              <Button size="sm" variant="outline" onClick={() => onCreateInvoice(session)}>
                <InvoiceIcon className="h-4 w-4 mr-2" /> Rechnung
              </Button>
            )}
            
            <Button size="icon" variant="ghost" onClick={() => onToggleArchive(session.id)} title={session.archived ? 'Wiederherstellen' : 'Archivieren'}>
              {session.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            </Button>

            {/* ← NEU: Delete-Button mit Bestätigungs-Dialog */}
            {onDeleteSession && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    title="Session dauerhaft löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      Session löschen?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                      Möchtest du die Session <strong className="text-white">"{session.topic}"</strong> mit {session.coacheeName} wirklich dauerhaft löschen?
                      <br /><br />
                      <span className="text-red-400">Diese Aktion kann nicht rückgängig gemacht werden.</span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600">
                      Abbrechen
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                          Lösche...
                        </>
                      ) : (
                        'Dauerhaft löschen'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SessionCard;