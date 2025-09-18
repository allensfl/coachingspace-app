import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Upload, FileText, Search, Download, Eye, Trash2, Tag, Folder, Users, Settings, Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadDocumentDialog from './document-upload/UploadDocumentDialog';
import { useAppStateContext } from '@/context/AppStateContext';

const DocumentList = ({ documents, onAction, onUpload }) => {
  const { state } = useAppStateContext();
  const { coachees, settings } = state;
  const { documentCategories } = settings;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getCategoryById = (id) => documentCategories.find(c => c.id === id) || { name: 'Unkategorisiert', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };

  const getCoacheeName = (coacheeId) => {
    if (!coacheeId) return "Allgemein";
    const coachee = coachees.find(c => c.id === coacheeId);
    return coachee ? `${coachee.firstName} ${coachee.lastName}` : 'Unbekannt';
  };

  const filteredDocuments = documents.filter(doc => {
    if (!doc || !doc.name) return false;
    const coacheeName = doc.coacheeId ? getCoacheeName(doc.coacheeId) : 'Allgemein';
    const keywordsString = Array.isArray(doc.keywords) ? doc.keywords.join(' ') : '';
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          coacheeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          keywordsString.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Dokumente, Coachees oder Keywords suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant={filterType === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilterType('all')}>Alle</Button>
              {documentCategories.map((cat) => (
                <Button key={cat.id} variant={filterType === cat.id ? 'default' : 'outline'} size="sm" onClick={() => setFilterType(cat.id)}>
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {filteredDocuments.map((doc, index) => (
          <motion.div
            key={`${doc.id}-${doc.name}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="glass-card hover:bg-slate-800/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white text-lg">{doc.name}</h3>
                        <Badge className={getCategoryById(doc.type).color}>
                          {getCategoryById(doc.type).name}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-1">
                        Zugeordnet: {getCoacheeName(doc.coacheeId)}
                      </p>
                      <p className="text-sm text-slate-400">
                        {doc.format} • {doc.size} • Hochgeladen: {new Date(doc.uploadDate).toLocaleDateString('de-DE')}
                      </p>
                      {doc.keywords && doc.keywords.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Tag className="h-4 w-4 text-slate-500" />
                          {doc.keywords.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onAction('view', doc)}><Eye className="mr-2 h-4 w-4" />Ansehen</Button>
                    <Button variant="outline" size="sm" onClick={() => onAction('download', doc)}><Download className="mr-2 h-4 w-4" />Download</Button>
                    <Button variant="outline" size="sm" onClick={() => onAction('delete', doc)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="glass-card"><CardContent className="p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Keine Dokumente gefunden</h3>
          <p className="text-slate-400 mb-4">{searchTerm || filterType !== 'all' ? 'Versuche andere Suchbegriffe oder Filter.' : 'Lade dein erstes Dokument hoch, um zu beginnen.'}</p>
          <Button onClick={onUpload}><Upload className="mr-2 h-4 w-4" />Dokument hochladen</Button>
        </CardContent></Card>
      )}
    </div>
  );
};

const CategoryManager = () => {
    const { state, actions } = useAppStateContext();
    const { settings } = state;
    const { updateDocumentCategories } = actions;
    const { toast } = useToast();
    const handleAction = () => {
        toast({
            title: "🚧 Funktion nicht implementiert",
            description: "Kann im nächsten Prompt angefordert werden! 🚀"
        });
    };
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Kategorien verwalten</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {settings.documentCategories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                           <div className="flex items-center gap-3">
                                <div className={`h-4 w-4 rounded-full ${cat.color.split(' ')[0]}`}></div>
                                <span className="font-medium text-white">{cat.name}</span>
                           </div>
                           <div className="flex items-center gap-2">
                               <Button variant="ghost" size="icon" onClick={handleAction}><Edit className="h-4 w-4" /></Button>
                               <Button variant="ghost" size="icon" onClick={handleAction}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                           </div>
                        </div>
                    ))}
                </div>
                <Button onClick={handleAction} className="mt-6 w-full"><Plus className="mr-2 h-4 w-4" />Neue Kategorie</Button>
            </CardContent>
        </Card>
    );
};

export default function Documents() {
  const { state, actions } = useAppStateContext();
  const { coachees, generalDocuments, settings } = state;
  const { getAllCoacheeDocuments, addDocument } = actions;
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { toast } = useToast();

  const allCoacheeDocuments = getAllCoacheeDocuments();

  const handleUploadSuccess = (coacheeId, documentData) => {
    addDocument(coacheeId, documentData);
    toast({
      title: "Dokument hochgeladen",
      description: `${documentData.name} wurde erfolgreich hinzugefügt.`,
      className: 'bg-green-600 text-white'
    });
    setIsUploadOpen(false);
  };

  const handleAction = (actionType, doc) => {
    if (actionType === 'download' && doc.fileContent) {
      const byteCharacters = atob(doc.fileContent.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: doc.format });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Download gestartet",
        description: `${doc.name} wird heruntergeladen.`
      });
    } else {
      toast({
        title: "🚧 Funktion nicht implementiert",
        description: `Aktion "${actionType}" für ${doc.name} kann im nächsten Prompt angefordert werden! 🚀`
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Dokumente - Coachingspace</title>
        <meta name="description" content="Zentrale Dokumentenverwaltung für alle Coaching-Unterlagen, Verträge und Assessments." />
      </Helmet>

      <UploadDocumentDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadSuccess}
        coachees={coachees}
        categories={settings.documentCategories}
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dokumente</h1>
            <p className="text-slate-400">Zentrale Dokumentenverwaltung</p>
          </div>
          <Button onClick={() => setIsUploadOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Upload className="mr-2 h-4 w-4" />
            Dokument hochladen
          </Button>
        </div>

        <Tabs defaultValue="coachee-docs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="coachee-docs"><Users className="mr-2 h-4 w-4" />Coachee-Dokumente</TabsTrigger>
                <TabsTrigger value="general-docs"><Folder className="mr-2 h-4 w-4"/>Allgemeine Dokumente</TabsTrigger>
                <TabsTrigger value="categories"><Settings className="mr-2 h-4 w-4"/>Kategorien verwalten</TabsTrigger>
            </TabsList>
            <TabsContent value="coachee-docs" className="mt-6">
                <DocumentList documents={allCoacheeDocuments} onAction={handleAction} onUpload={() => setIsUploadOpen(true)} />
            </TabsContent>
            <TabsContent value="general-docs" className="mt-6">
                 <DocumentList documents={generalDocuments} onAction={handleAction} onUpload={() => setIsUploadOpen(true)} />
            </TabsContent>
            <TabsContent value="categories" className="mt-6">
                <CategoryManager />
            </TabsContent>
        </Tabs>
      </div>
    </>
  );
}