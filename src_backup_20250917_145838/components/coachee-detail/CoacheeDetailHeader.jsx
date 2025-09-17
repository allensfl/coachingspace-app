import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, Edit, Video, Trash2, Link, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function CoacheeDetailHeader({ coachee, isEditing, onEditToggle, onSave, onCancelEdit, onStartCoachingRoom, onDelete, onGeneratePortalLink }) {
  const { toast } = useToast();

  const handleCopyPortalLink = () => {
    if (!coachee.portalAccess?.initialToken && !coachee.portalAccess?.permanentToken) {
        toast({
            title: "Kein aktiver Link",
            description: "Bitte generieren Sie zuerst einen neuen Portal-Link.",
            variant: "destructive"
        });
        return;
    }
    
    const portalUrl = `${window.location.origin}/portal/${coachee.portalAccess.initialToken || coachee.portalAccess.permanentToken}`;
    navigator.clipboard.writeText(portalUrl);
    toast({
      title: "Link kopiert!",
      description: "Der Link zum Coachee-Portal wurde in die Zwischenablage kopiert.",
      className: 'bg-green-600 text-white'
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-3xl">
            {coachee.firstName?.[0]}{coachee.lastName?.[0]}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{coachee.firstName} {coachee.lastName}</h1>
          <p className="text-slate-400">{coachee.mainTopic}</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {isEditing ? (
          <>
            <Button onClick={onSave}><Save className="mr-2 h-4 w-4" /> Speichern</Button>
            <Button variant="outline" onClick={onCancelEdit}><X className="mr-2 h-4 w-4" /> Abbrechen</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onEditToggle}><Edit className="mr-2 h-4 w-4" /> Bearbeiten</Button>
            <div className="flex rounded-md border border-input">
                <Button variant="outline" onClick={handleCopyPortalLink} className="rounded-r-none border-r-0"><Link className="mr-2 h-4 w-4" /> Portal-Link</Button>
                <Button variant="outline" size="icon" onClick={onGeneratePortalLink} className="rounded-l-none"><RefreshCw className="h-4 w-4" /></Button>
            </div>
            <Button onClick={onStartCoachingRoom}><Video className="mr-2 h-4 w-4" /> Coaching Room</Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Löschen</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bist du absolut sicher?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird der Coachee dauerhaft gelöscht und alle seine Daten entfernt.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">Ja, Coachee löschen</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}