import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Target, Search, Plus, Star, Upload, BarChart3, Users, Scale, Compass, Settings, Trash2, Eye, Edit, Share, Download, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { classes } from '../styles/standardClasses';
import Skalenarbeit from './toolbox/tools/Skalenarbeit';
import Lebensrad from './toolbox/tools/Lebensrad';

export default function Toolbox() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTextToolModal, setShowTextToolModal] = useState(false);
  const [customTools, setCustomTools] = useState([]);
  const [customCategories, setCustomCategories] = useState(['Eigene Tools']);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Text Tool States
  const [textToolData, setTextToolData] = useState({
    name: '',
    description: '',
    category: 'Eigene Tools',
    content: ''
  });

  // Simple toast function
  const showToast = (message) => {
    alert(message);
  };

  // Built-in Coaching Tools
  const builtInTools = [
    {
      id: 'skalenarbeit',
      name: 'Skalenarbeit',
      description: '7-Schritt-Prozess zur Standortbestimmung und Zielsetzung mit interaktiven Slidern',
      category: 'Zielklärung',
      type: 'interactive',
      icon: Activity,
      status: 'active',
      duration: '15-30 Min',
      difficulty: 'Einfach',
      component: Skalenarbeit
    },
    {
      id: 'lifewheel-builtin',
      name: 'Lebensrad',
      description: 'Interaktives Lebensrad mit SVG-Visualisierung und automatischer Balance-Berechnung.',
      category: 'Ressourcen',
      type: 'interactive',
      icon: Target,
      status: 'active',
      duration: '20-40 Min',
      difficulty: 'Mittel',
      component: Lebensrad  
    },
    {
      id: 'grow-builtin',
      name: 'GROW-Modell',
      description: 'Strukturiertes 4-Phasen Coaching-Tool mit Navigation durch Goal, Reality, Options, Way Forward.',
      category: 'Entscheidungshilfen',
      type: 'interactive',
      icon: Compass,
      status: 'active',
      duration: '30-60 Min',
      difficulty: 'Mittel'
    },
    {
      id: 'wertequadrat',
      name: 'Wertequadrat',
      description: '5-Schritt-Prozess nach Paul Helwig zur Werte-Identifikation und Spannungsfeld-Analyse',
      category: 'Reflexion',
      type: 'interactive',
      icon: Scale,
      status: 'active',
      duration: '25-45 Min',
      difficulty: 'Fortgeschritten'
    },
    {
      id: 'team-builtin',
      name: 'Inneres Team',
      description: 'Dialog-basiertes Tool nach Schulz von Thun für die Arbeit mit inneren Persönlichkeitsanteilen.',
      category: 'Reflexion',
      type: 'interactive',
      icon: Users,
      status: 'active',
      duration: '30-50 Min',
      difficulty: 'Fortgeschritten'
    }
  ];

  const categories = ['all', 'Entscheidungshilfen', 'Reflexion', 'Ressourcen', 'Zielklärung', ...customCategories];

  const allTools = [...builtInTools, ...customTools];

  // Text Tool Handler
  const handleCreateTextTool = () => {
    if (textToolData.name && textToolData.content) {
      const newTool = {
        id: `text-${Date.now()}`,
        name: textToolData.name,
        description: textToolData.description || 'Eigenes Text-Tool',
        category: textToolData.category,
        type: 'text',
        icon: Plus,
        status: 'active',
        duration: 'Variabel',
        difficulty: 'Individuell',
        textContent: textToolData.content
      };
      setCustomTools(prev => [...prev, newTool]);
      setShowTextToolModal(false);
      setTextToolData({ name: '', description: '', category: 'Eigene Tools', content: '' });
      showToast(`Text-Tool "${newTool.name}" wurde erstellt!`);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newTool = {
          id: `custom-${Date.now()}`,
          name: file.name.split('.')[0],
          description: `Hochgeladenes Tool: ${file.name}`,
          category: 'Eigene Tools',
          type: 'file',
          icon: Upload,
          status: 'active',
          duration: 'Variabel',
          difficulty: 'Individuell',
          fileContent: e.target.result,
          fileName: file.name,
          fileType: file.type
        };
        setCustomTools(prev => [...prev, newTool]);
        setShowUploadModal(false);
        showToast(`Tool "${newTool.name}" wurde erfolgreich hochgeladen!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete Tool Handler
  const handleDeleteTool = (toolId) => {
    if (window.confirm('Möchten Sie dieses Tool wirklich löschen?')) {
      setCustomTools(prev => prev.filter(tool => tool.id !== toolId));
      showToast('Tool wurde gelöscht!');
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !customCategories.includes(newCategoryName.trim())) {
      setCustomCategories(prev => [...prev, newCategoryName.trim()]);
      setNewCategoryName('');
      showToast(`Kategorie "${newCategoryName.trim()}" wurde hinzugefügt!`);
    }
  };

  const handleDeleteCategory = (categoryName) => {
    if (categoryName !== 'Eigene Tools') {
      setCustomCategories(prev => prev.filter(cat => cat !== categoryName));
      // Update tools in deleted category to 'Eigene Tools'
      setCustomTools(prev => prev.map(tool => 
        tool.category === categoryName ? { ...tool, category: 'Eigene Tools' } : tool
      ));
      showToast(`Kategorie "${categoryName}" wurde gelöscht!`);
    }
  };

  const handleToggleFavorite = useCallback((toolId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(toolId)) {
        newFavorites.delete(toolId);
        showToast('Favorit entfernt');
      } else {
        newFavorites.add(toolId);
        showToast('Favorit hinzugefügt');
      }
      return newFavorites;
    });
  }, []);

  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || tool.category === filterCategory;
      return matchesSearch && matchesCategory && tool.status === 'active';
    });
  }, [searchTerm, filterCategory, allTools]);

  // Simple Tool Placeholder for interactive tools
  const renderInteractiveTool = (tool) => {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{
          padding: '2rem',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.2)',
          display: 'inline-block',
          marginBottom: '2rem'
        }}>
          <tool.icon size={64} style={{ color: 'rgb(99, 102, 241)' }} />
        </div>
        <h3 className={classes.h3} style={{ margin: '0 0 1rem 0' }}>
          {tool.name}
        </h3>
        <p className={classes.body} style={{ margin: '0 0 2rem 0', maxWidth: '600px', lineHeight: '1.6' }}>
          {tool.description}
        </p>
        <div className={classes.card} style={{
          maxWidth: '400px',
          margin: '0 auto 2rem auto',
          textAlign: 'left'
        }}>
          <h4 className={classes.h4} style={{ margin: '0 0 1rem 0' }}>Tool-Details:</h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={classes.body}>Dauer:</span>
              <span className={classes.caption}>{tool.duration}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={classes.body}>Schwierigkeit:</span>
              <span className={classes.caption}>{tool.difficulty}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={classes.body}>Kategorie:</span>
              <span className={classes.caption}>{tool.category}</span>
            </div>
          </div>
        </div>
        <p className={classes.caption} style={{ fontStyle: 'italic' }}>
          Vollständige interaktive Version wird in einem zukünftigen Update verfügbar sein.
        </p>
      </div>
    );
  };

  // Text Tool Viewer Component
  const TextToolViewer = ({ tool }) => {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 className={classes.h3} style={{ margin: '0 0 0.5rem 0' }}>
            {tool.name}
          </h3>
          <p className={classes.body} style={{ margin: 0 }}>
            {tool.description}
          </p>
        </div>

        <div className={classes.card} style={{ marginBottom: '2rem' }}>
          <div className={classes.cardCompact} style={{
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontSize: '1rem'
          }}>
            {tool.textContent}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              navigator.clipboard.writeText(tool.textContent);
              showToast('Text in Zwischenablage kopiert!');
            }}
            className={classes.btnPrimary}
            style={{ background: 'rgb(34, 197, 94)' }}
          >
            Text kopieren
          </button>
        </div>
      </div>
    );
  };

  // File Viewer Component
  const FileViewer = ({ tool }) => {
    const downloadFile = () => {
      const link = document.createElement('a');
      link.href = tool.fileContent;
      link.download = tool.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Datei "${tool.fileName}" wurde heruntergeladen!`);
    };

    const fileExtension = tool.fileName ? tool.fileName.split('.').pop().toLowerCase() : '';
    const isPDF = fileExtension === 'pdf';
    const isWord = ['doc', 'docx'].includes(fileExtension);
    const isImage = tool.fileType && tool.fileType.startsWith('image/');

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 className={classes.h3} style={{ margin: '0 0 0.5rem 0' }}>
            {tool.name}
          </h3>
          <p className={classes.body} style={{ margin: 0 }}>
            Hochgeladene Datei: {tool.fileName}
          </p>
        </div>

        <div className={classes.card} style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          {isPDF ? (
            <div>
              <h4 className={classes.h4} style={{ margin: '0 0 1rem 0' }}>{tool.fileName}</h4>
              <div style={{ 
                width: '100%', 
                height: '600px', 
                background: 'white',
                borderRadius: '8px',
                marginBottom: '1rem',
                overflow: 'hidden'
              }}>
                <iframe 
                  src={tool.fileContent}
                  width="100%" 
                  height="100%" 
                  style={{ border: 'none', borderRadius: '8px' }}
                  title={`PDF Viewer - ${tool.fileName}`}
                />
              </div>
            </div>
          ) : isWord ? (
            <div>
              <h4 className={classes.h4} style={{ margin: '0 0 0.5rem 0' }}>{tool.fileName}</h4>
              <p className={classes.body} style={{ margin: '0 0 1.5rem 0' }}>
                Word-Dokument kann nicht direkt angezeigt werden.<br/>
                Klicken Sie auf Download, um die Datei zu öffnen.
              </p>
            </div>
          ) : isImage ? (
            <div>
              <img 
                src={tool.fileContent} 
                alt={tool.fileName}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '500px', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <h4 className={classes.h4} style={{ margin: '0 0 0.5rem 0' }}>{tool.fileName}</h4>
            </div>
          ) : (
            <div>
              <Upload size={64} style={{ color: 'rgb(99, 102, 241)', margin: '0 auto 1rem auto' }} />
              <h4 className={classes.h4} style={{ margin: '0 0 0.5rem 0' }}>{tool.fileName}</h4>
              <p className={classes.body} style={{ margin: '0 0 1.5rem 0' }}>
                Dateityp: {tool.fileType || 'Unbekannt'}
              </p>
            </div>
          )}

          <button
            onClick={downloadFile}
            className={classes.btnPrimary}
            style={{ margin: '0 auto' }}
          >
            <Upload size={16} />
            {isPDF ? 'PDF herunterladen' : isWord ? 'Word-Dokument öffnen' : 'Datei herunterladen'}
          </button>
        </div>
      </div>
    );
  };

  // Tool Content Renderer
  const renderToolContent = () => {
    if (!selectedTool) return null;

    if (selectedTool.type === 'text') {
      return <TextToolViewer tool={selectedTool} />;
    }
    if (selectedTool.type === 'file') {
      return <FileViewer tool={selectedTool} />;
    }
    if (selectedTool.type === 'interactive') {
      // Wenn eine echte Component vorhanden ist, diese rendern
      if (selectedTool.component) {
        const ToolComponent = selectedTool.component;
        return <ToolComponent onClose={() => setSelectedTool(null)} />;
      }
      // Sonst Platzhalter anzeigen
      return renderInteractiveTool(selectedTool);
    }
    
    return renderInteractiveTool(selectedTool);
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.contentWrapper}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 className={classes.h1} style={{ margin: '0 0 0.5rem 0' }}>
              Coaching-Toolbox
            </h1>
            <p className={classes.body} style={{ margin: 0 }}>
              Professionelle Tools für Ihre Coaching-Sessions. Entdecken Sie interaktive Methoden und erstellen Sie eigene Inhalte.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowCategoryModal(true)}
              className={classes.btnSecondary}
            >
              <Settings size={16} /> Kategorien
            </button>
            <button 
              onClick={() => setShowTextToolModal(true)}
              className={classes.btnPrimary}
            >
              <Plus size={16} /> Text-Tool
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className={classes.btnSecondary}
            >
              <Upload size={16} /> Datei-Tool
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={classes.card} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: 'rgb(156, 163, 175)'
              }} />
              <input
                type="text"
                placeholder="Tools durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={classes.searchInput}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={
                  filterCategory === category 
                    ? classes.btnFilterActive 
                    : classes.btnFilterInactive
                }
              >
                {category === 'all' ? 'Alle' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {filteredTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedTool(tool)}
                className={classes.card}
                style={{
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {/* Delete button for custom tools */}
                {(tool.type === 'file' || tool.type === 'text') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTool(tool.id);
                    }}
                    className={classes.btnIconRed}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%'
                    }}
                    title="Tool löschen"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'start',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}>
                    <IconComponent size={32} style={{ color: 'rgb(99, 102, 241)' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={classes.statusGreen} style={{ fontSize: '0.75rem' }}>
                      Aktiv
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(tool.id);
                      }}
                      className={classes.btnIcon}
                      style={{
                        color: favorites.has(tool.id) ? 'rgb(251, 191, 36)' : 'rgb(156, 163, 175)'
                      }}
                    >
                      <Star size={16} fill={favorites.has(tool.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <h3 className={classes.h3} style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '1.25rem'
                  }}>
                    {tool.name}
                  </h3>
                  <p className={classes.body} style={{ 
                    margin: 0, 
                    fontSize: '0.875rem',
                    lineHeight: '1.4'
                  }}>
                    {tool.description}
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginBottom: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <span className={classes.badge} style={{ fontSize: '0.75rem' }}>
                    {tool.duration}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    background: tool.difficulty === 'Einfach' ? 'rgba(34, 197, 94, 0.2)' : 
                               tool.difficulty === 'Mittel' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: tool.difficulty === 'Einfach' ? 'rgb(34, 197, 94)' : 
                           tool.difficulty === 'Mittel' ? 'rgb(251, 191, 36)' : 'rgb(239, 68, 68)',
                    border: `1px solid ${tool.difficulty === 'Einfach' ? 'rgba(34, 197, 94, 0.3)' : 
                                        tool.difficulty === 'Mittel' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    borderRadius: '12px',
                    fontSize: '0.75rem'
                  }}>
                    {tool.difficulty}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <span className={classes.badge} style={{ fontSize: '0.75rem' }}>
                    {tool.category}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    background: tool.type === 'interactive' ? 'rgba(147, 51, 234, 0.2)' : 
                               tool.type === 'text' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                    color: tool.type === 'interactive' ? 'rgb(147, 51, 234)' : 
                           tool.type === 'text' ? 'rgb(34, 197, 94)' : 'rgb(249, 115, 22)',
                    border: `1px solid ${tool.type === 'interactive' ? 'rgba(147, 51, 234, 0.3)' : 
                                        tool.type === 'text' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`,
                    borderRadius: '12px',
                    fontSize: '0.75rem'
                  }}>
                    {tool.type === 'interactive' ? 'Interaktiv' : 
                     tool.type === 'text' ? 'Text-Tool' : 'Datei-Tool'}
                  </span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between'
                }} className={classes.caption}>
                  <span>Sofort verwendbar</span>
                  <span>{tool.type === 'interactive' ? 'Coaching-Tool' : 'Custom Tool'}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className={classes.emptyState}>
            <Target size={48} style={{ color: 'rgb(156, 163, 175)', margin: '0 auto 1rem auto' }} />
            <h3 className={classes.h3} style={{ margin: '0 0 0.5rem 0' }}>
              Keine Tools gefunden
            </h3>
            <p className={classes.emptyStateText} style={{ margin: 0 }}>
              Versuche andere Suchbegriffe oder wähle eine andere Kategorie.
            </p>
          </div>
        )}

        {/* Tool Detail Modal */}
        {selectedTool && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}>
            <div className={classes.card} style={{ 
              maxWidth: '95vw', 
              width: '100%', 
              maxHeight: '95vh',
              position: 'relative',
              overflowY: 'auto'
            }}>
              <button
                onClick={() => setSelectedTool(null)}
                className={classes.btnIconRed}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  fontSize: '1.5rem',
                  zIndex: 1001
                }}
              >
                ×
              </button>
              {renderToolContent()}
            </div>
          </div>
        )}

        {/* Text Tool Modal */}
        {showTextToolModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className={classes.card} style={{
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h3 className={classes.h3} style={{ margin: '0 0 1rem 0' }}>
                Text-Tool erstellen
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label className={classes.body} style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Tool-Name:
                </label>
                <input
                  type="text"
                  value={textToolData.name}
                  onChange={(e) => setTextToolData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="z.B. Meine Coaching-Fragen"
                  className={classes.input}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className={classes.body} style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Beschreibung:
                </label>
                <input
                  type="text"
                  value={textToolData.description}
                  onChange={(e) => setTextToolData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Kurze Beschreibung des Tools"
                  className={classes.input}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className={classes.body} style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Tool-Inhalt:
                </label>
                <textarea
                  value={textToolData.content}
                  onChange={(e) => setTextToolData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Hier können Sie Coaching-Fragen, Übungen, Checklisten oder andere Texte eingeben..."
                  className={classes.textarea}
                  style={{
                    minHeight: '200px',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowTextToolModal(false)}
                  className={classes.btnSecondary}
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleCreateTextTool}
                  disabled={!textToolData.name || !textToolData.content}
                  className={textToolData.name && textToolData.content ? classes.btnPrimary : classes.btnSecondary}
                  style={{ opacity: textToolData.name && textToolData.content ? 1 : 0.5 }}
                >
                  Text-Tool erstellen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className={classes.card} style={{
              maxWidth: '500px',
              width: '90%'
            }}>
              <h3 className={classes.h3} style={{ margin: '0 0 1rem 0' }}>
                Tool hochladen
              </h3>
              <p className={classes.body} style={{ margin: '0 0 1.5rem 0' }}>
                Laden Sie PDFs, Word-Dokumente, Bilder oder andere Dateien hoch
              </p>
              
              <div style={{
                border: '2px dashed rgb(75, 85, 99)',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                background: 'rgba(31, 41, 55, 0.5)'
              }}>
                <Upload size={48} style={{ color: 'rgb(156, 163, 175)', margin: '0 auto 1rem auto' }} />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.ppt,.pptx,.xls,.xlsx"
                  className={classes.input}
                />
                <p className={classes.caption} style={{ margin: '0.5rem 0 0 0' }}>
                  Unterstützte Formate: PDF, Word, PowerPoint, Excel, Bilder, Text
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className={classes.btnSecondary}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Management Modal */}
        {showCategoryModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className={classes.card} style={{
              maxWidth: '600px',
              width: '90%',
              maxHeight: '70vh',
              overflowY: 'auto'
            }}>
              <h3 className={classes.h3} style={{ margin: '0 0 1rem 0' }}>
                Kategorien verwalten
              </h3>
              
              {/* Add new category */}
              <div style={{ marginBottom: '2rem' }}>
                <label className={classes.body} style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Neue Kategorie hinzufügen:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Kategorie-Name..."
                    className={classes.input}
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                    className={newCategoryName.trim() ? classes.btnPrimary : classes.btnSecondary}
                    style={{ opacity: newCategoryName.trim() ? 1 : 0.5 }}
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>

              {/* List existing categories */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 className={classes.h4} style={{ margin: '0 0 1rem 0' }}>Bestehende Kategorien:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Built-in categories (not deletable) */}
                  {['Entscheidungshilfen', 'Reflexion', 'Ressourcen', 'Zielklärung'].map(category => (
                    <div key={category} className={classes.cardCompact} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span className={classes.body}>{category}</span>
                      <span className={classes.caption} style={{ fontStyle: 'italic' }}>
                        Standard-Kategorie
                      </span>
                    </div>
                  ))}

                  {/* Custom categories (deletable) */}
                  {customCategories.map(category => (
                    <div key={category} className={classes.cardCompact} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span className={classes.body}>{category}</span>
                      {category !== 'Eigene Tools' && (
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className={classes.btnIconRed}
                          style={{ fontSize: '0.75rem' }}
                        >
                          Löschen
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className={classes.btnPrimary}
                >
                  Fertig
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}