import React, { useState } from 'react';
import { Plus, Edit, Trash2, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PackageTemplateEditorDialog from './PackageTemplateEditorDialog';

const PackageTemplates = ({ packageTemplates, setPackageTemplates }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };
  
  const handleDelete = (templateId) => {
    setPackageTemplates(prev => (prev || []).filter(t => t.id !== templateId));
    toast({
        title: "Paket-Vorlage gelöscht!",
        className: 'bg-green-600 text-white'
    });
  }

  const handleSave = (newTemplateData) => {
    const currentTemplates = packageTemplates || [];
    const existingIndex = currentTemplates.findIndex(t => t.id === newTemplateData.id);
    if (existingIndex > -1) {
        setPackageTemplates(prev => {
            const updated = [...(prev || [])];
            updated[existingIndex] = newTemplateData;
            return updated;
        });
    } else {
        setPackageTemplates(prev => [...(prev || []), newTemplateData]);
    }
    setIsEditorOpen(false);
    toast({
        title: "Paket-Vorlage gespeichert!",
        className: 'bg-green-600 text-white'
    });
  };

  return (
    <>
      <PackageTemplateEditorDialog
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        onSave={handleSave}
        template={selectedTemplate}
      />
      <div className="space-y-4">
        {(packageTemplates || []).map(template => (
          <div key={template.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Box className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-white">{template.name}</p>
                <p className="text-sm text-slate-400">{template.totalUnits} Einheiten</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-primary">€{template.price.toFixed(2)}</p>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(template.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          </div>
        ))}
        <Button onClick={handleAdd} className="mt-4 w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Neue Paket-Vorlage hinzufügen
        </Button>
      </div>
    </>
  );
};

export default PackageTemplates;