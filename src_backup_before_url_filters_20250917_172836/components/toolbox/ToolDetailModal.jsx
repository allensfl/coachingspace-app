
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Archive, Presentation, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const ToolDetailModal = ({ tool, open, onOpenChange, onEdit, onDelete, onArchive }) => {
  const navigate = useNavigate();
  if (!tool) return null;

  const handlePresent = () => {
    if (tool.type === 'file') {
      window.open(tool.fileUrl, '_blank');
      return;
    }
    onOpenChange(false);
    navigate(`/tool-presenter/${tool.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">{tool.name}</DialogTitle>
          <DialogDescription>{tool.category}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          <p className="text-slate-300">{tool.description}</p>
          {tool.type === 'text' && tool.content && (
            <div className="prose prose-invert prose-sm max-w-none bg-slate-800/50 p-4 rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: tool.content }} />
            </div>
          )}
          {tool.type === 'file' && (
             <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-300">Dies ist ein dateibasiertes Tool. Klicken Sie auf "Öffnen", um die Datei anzuzeigen.</p>
             </div>
          )}
          <div>
            <h4 className="font-semibold text-slate-200 mb-2">Verwendungshistorie</h4>
            {tool.usageHistory && tool.usageHistory.length > 0 ? (
              <ul className="list-disc list-inside text-slate-400 text-sm">
                {tool.usageHistory.map((item, index) => <li key={index}>Session mit {item.coacheeName} am {format(new Date(item.date), 'dd.MM.yyyy', { locale: de })}</li>)}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm italic">Noch nicht verwendet.</p>
            )}
          </div>
        </div>
        <DialogFooter className="flex-wrap justify-between sm:justify-between">
           <div className="flex gap-2">
             {tool.isCustom && (
                <>
                <Button variant="outline" size="sm" onClick={() => onEdit(tool)}><Edit className="h-4 w-4 mr-2"/>Bearbeiten</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2"/>Löschen</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Tool wirklich löschen?</AlertDialogTitle><AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden. Das Tool "{tool.name}" wird dauerhaft gelöscht.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(tool.id)} className="bg-red-600 hover:bg-red-700">Löschen</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </>
            )}
           </div>
           <div className="flex gap-2">
                <Button variant="outline" onClick={() => onArchive(tool.id)}><Archive className="h-4 w-4 mr-2" />{tool.status === 'active' ? 'Archivieren' : 'Aktivieren'}</Button>
                <Button onClick={handlePresent} className="bg-blue-600 hover:bg-blue-700">
                    {tool.type === 'file' ? <FileText className="h-4 w-4 mr-2" /> : <Presentation className="h-4 w-4 mr-2" />}
                    {tool.type === 'file' ? 'Datei öffnen' : 'Präsentieren'}
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToolDetailModal;
