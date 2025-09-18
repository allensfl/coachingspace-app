import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, X, Plus, Filter, Download, Eye, Upload, File } from 'lucide-react';
import { useAppStateContext } from '@/context/AppStateContext';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getFileIcon = (format) => {
  const iconConfig = {
    PDF: { icon: FileText, color: 'text-red-400' },
    DOCX: { icon: FileText, color: 'text-blue-400' },
    XLSX: { icon: FileText, color: 'text-green-400' },
    PPTX: { icon: FileText, color: 'text-orange-400' },
    default: { icon: File, color: 'text-gray-400' }
  };
  
  const config = iconConfig[format] || iconConfig.default;
  const IconComponent = config.icon;
  
  return <IconComponent className={`h-5 w-5 ${config.color}`} />;
};

const getTypeBadge = (type) => {
  const typeConfig = {
    assessment: { label: 'Assessment', color: 'bg-purple-600' },
    plan: { label: 'Aktionsplan', color: 'bg-blue-600' },
    feedback: { label: 'Feedback', color: 'bg-green-600' },
    presentation: { label: 'Präsentation', color: 'bg-orange-600' },
    agreement: { label: 'Vereinbarung', color: 'bg-indigo-600' },
    contract: { label: 'Vertrag', color: 'bg-green-600' },
    report: { label: 'Bericht', color: 'bg-pink-600' }
  };
  
  const config = typeConfig[type] || { label: type, color: 'bg-gray-600' };
  return (
    <Badge className={`${config.color} text-white`}>
      {config.label}
    </Badge>
  );
};

export default function Documents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // AppStateContext verwenden für echte Daten
  const { coachees, getCoacheeById } = useAppStateContext();
  
  // URL-Parameter auslesen
  const coacheeFilter = searchParams.get('coachee');
  const nameFilter = searchParams.get('name');
  
  console.log('Documents - Coachee Filter:', coacheeFilter);
  console.log('Documents - Name Filter:', nameFilter);
  
  // Echte Dokumente aus AppStateContext laden
  const allDocuments = useMemo(() => {
    if (!coachees) return [];
    
    const documents = [];
    
    // Alle Coachee-Dokumente sammeln
    coachees.forEach(coachee => {
      if (coachee.documents && coachee.documents.length > 0) {
        coachee.documents.forEach(doc => {
          documents.push({
            ...doc,
            coacheeId: coachee.id,
            coacheeName: `${coachee.firstName} ${coachee.lastName}`,
            // Sicherstellen dass alle nötigen Felder vorhanden sind
            format: doc.format || 'PDF',
            size: doc.size || 'Unbekannt',
            uploadDate: doc.uploadDate || new Date().toISOString(),
            description: doc.description || doc.name || 'Kein Beschreibung',
            isShared: doc.isShared !== false // Default true
          });
        });
      }
    });
    
    console.log('Documents - Alle geladenen Dokumente:', documents);
    return documents;
  }, [coachees]);
  
  // Gefilterte Dokumente basierend auf URL-Parametern und Suchbegriff
  const filteredDocuments = useMemo(() => {
    let filtered = allDocuments;
    
    // Nach Coachee-ID filtern (URL-Parameter)
    if (coacheeFilter) {
      const coacheeId = parseInt(coacheeFilter);
      filtered = filtered.filter(doc => doc.coacheeId === coacheeId);
      console.log(`Documents - Gefiltert nach Coachee ID ${coacheeId}:`, filtered);
    }
    
    // Nach Suchbegriff filtern
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.coacheeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.format.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  }, [allDocuments, coacheeFilter, searchTerm]);
  
  // Statistiken berechnen
  const stats = useMemo(() => {
    const total = filteredDocuments.length;
    const shared = filteredDocuments.filter(doc => doc.isShared).length;
    const types = [...new Set(filteredDocuments.map(doc => doc.type))].length;
    const totalSize = filteredDocuments.reduce((sum, doc) => {
      if (!doc.size || doc.size === 'Unbekannt') return sum;
      const sizeNum = parseFloat(doc.size.replace(/[^\d.]/g, ''));
      const unit = doc.size.includes('MB') ? 'MB' : 'KB';
      return sum + (unit === 'MB' ? sizeNum : sizeNum / 1024);
    }, 0);
    
    return { total, shared, types, totalSize: `${totalSize.toFixed(1)} MB` };
  }, [filteredDocuments]);
  
  // Filter entfernen
  const clearCoacheeFilter = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('coachee');
    newParams.delete('name');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);
  
  return (
    <div className="space-y-6">
      {/* Header mit Filter-Anzeige */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dokumente</h1>
          {coacheeFilter && nameFilter && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Gefiltert nach: {decodeURIComponent(nameFilter)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  onClick={clearCoacheeFilter}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          )}
        </div>
        
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Dokument hochladen
        </Button>
      </div>
      
      {/* Statistiken */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">
              {stats.total}
            </div>
            <p className="text-sm text-muted-foreground">
              {coacheeFilter ? 'Gefilterte Dokumente' : 'Gesamt Dokumente'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">
              {stats.shared}
            </div>
            <p className="text-sm text-muted-foreground">Geteilt</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">
              {stats.types}
            </div>
            <p className="text-sm text-muted-foreground">Dokumenttypen</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-400">
              {stats.totalSize}
            </div>
            <p className="text-sm text-muted-foreground">Gesamtgröße</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Suchleiste */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Dokumente durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {/* Dokumenten-Liste */}
      <div className="grid gap-4">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((document) => (
            <Card key={document.id} className="glass-card hover:bg-slate-800/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getFileIcon(document.format)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-white truncate">
                        {document.name}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                        <span>{document.coacheeName}</span>
                        <span>•</span>
                        <span>{document.format}</span>
                        <span>•</span>
                        <span>{document.size}</span>
                        <span>•</span>
                        <span>{formatDate(document.uploadDate)}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">
                        {document.description}
                      </p>
                      {/* DSGVO-Kennzeichnung */}
                      {document.isConsentDocument && (
                        <Badge className="mt-2 bg-green-600 text-white">
                          DSGVO-Einwilligung
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getTypeBadge(document.type)}
                    {document.isShared && (
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Geteilt
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Anzeigen
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Herunterladen
                  </Button>
                  <Button variant="outline" size="sm">
                    Bearbeiten
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {coacheeFilter ? 
                  `Keine Dokumente für ${decodeURIComponent(nameFilter || 'diesen Coachee')} gefunden` :
                  'Keine Dokumente gefunden'
                }
              </h3>
              <p className="text-muted-foreground">
                {coacheeFilter ? 
                  'Für diesen Coachee sind noch keine Dokumente hochgeladen.' :
                  'Laden Sie Ihr erstes Dokument hoch.'
                }
              </p>
              {coacheeFilter && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearCoacheeFilter}
                >
                  Alle Dokumente anzeigen
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}