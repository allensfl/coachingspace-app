import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Video, Phone, Users, Play, Archive, ArchiveRestore, CalendarPlus, Package, FileText as InvoiceIcon, Calendar, User, Clock, ClipboardList, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  onDirectStart, // NEU: Direktstart-Handler hinzugefügt
  onToggleArchive, 
  onStatusChange, 
  onCreateInvoice, 
  activePackages, 
  onAddToCalendar 
}) => {
  const navigate = useNavigate();
  const ModeIcon = getModeIcon(session.mode);
  const relatedPackage = session.packageId ? (activePackages || []).find(p => p.id === session.packageId) : null;

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
            
            {/* Zwei separate Buttons für geplante Sessions */}
            {session.status === SessionStatus.PLANNED && (
              <>
                {/* Vorbereitung-Button */}
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
                
                {/* REPARIERT: Direktstart-Button mit session.id statt session.coacheeId */}
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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SessionCard;