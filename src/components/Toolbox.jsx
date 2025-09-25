import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, Plus, Star, Upload, BarChart3, Users, Scale, Compass, Settings, Trash2, Eye, Edit, Share, Download, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';

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
      id: 'scaling-builtin',
      name: 'Skalenarbeit',
      description: 'Interaktive Skalenarbeit mit Split-Interface für Coach und Coachee. Strukturierter 7-Schritt-Prozess.',
      category: 'Zielklärung',
      type: 'interactive',
      icon: BarChart3,
      status: 'active',
      duration: '15-30 Min',
      difficulty: 'Einfach'
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
      difficulty: 'Mittel'
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

  // GROW-Modell Implementation
  const GrowTool = () => {
    const [currentPhase, setCurrentPhase] = useState(0);
    const [formData, setFormData] = useState({
      goal: '',
      reality: '',
      options: [],
      way: '',
      notes: ''
    });
    const [newOption, setNewOption] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);

    const phases = [
      { name: 'Goal', title: 'Ziel definieren', color: 'rgb(34, 197, 94)' },
      { name: 'Reality', title: 'Realität analysieren', color: 'rgb(59, 130, 246)' },
      { name: 'Options', title: 'Optionen entwickeln', color: 'rgb(251, 191, 36)' },
      { name: 'Way', title: 'Weg festlegen', color: 'rgb(147, 51, 234)' }
    ];

    const addOption = () => {
      if (newOption.trim()) {
        setFormData(prev => ({
          ...prev,
          options: [...prev.options, { text: newOption.trim(), rating: 0 }]
        }));
        setNewOption('');
      }
    };

    const rateOption = (index, rating) => {
      setFormData(prev => ({
        ...prev,
        options: prev.options.map((opt, i) => 
          i === index ? { ...opt, rating } : opt
        )
      }));
    };

    const exportSession = () => {
      const session = `GROW-Modell Session Export
===========================

GOAL (Ziel):
${formData.goal || 'Nicht definiert'}

REALITY (Realität):
${formData.reality || 'Nicht analysiert'}

OPTIONS (Optionen):
${formData.options.map((opt, i) => `${i+1}. ${opt.text} (Bewertung: ${opt.rating}/5)`).join('\n') || 'Keine Optionen'}

WAY FORWARD (Weg):
${formData.way || 'Nicht festgelegt'}

Zusätzliche Notizen:
${formData.notes || 'Keine Notizen'}

Export-Zeit: ${new Date().toLocaleString()}`;

      const blob = new Blob([session], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'grow-session.txt';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Session exportiert!');
    };

    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>GROW-Modell</h2>
          <p style={{ color: 'rgb(156, 163, 175)' }}>
            Strukturierter 4-Phasen-Prozess für effektives Coaching
          </p>
        </div>

        {/* Phase Navigation */}
        <div style={{ display: 'flex', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          {phases.map((phase, index) => (
            <button
              key={phase.name}
              onClick={() => setCurrentPhase(index)}
              style={{
                padding: '0.75rem 1.5rem',
                background: currentPhase === index ? phase.color : 'rgba(75, 85, 99, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                flex: '1',
                minWidth: '120px'
              }}
            >
              {index + 1}. {phase.title}
            </button>
          ))}
        </div>

        {/* Phase Content */}
        <div style={{
          background: 'rgba(31, 41, 55, 0.8)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          border: `2px solid ${phases[currentPhase].color}`
        }}>
          {/* Goal Phase */}
          {currentPhase === 0 && (
            <div>
              <h3 style={{ color: phases[0].color, marginBottom: '1rem', fontSize: '1.5rem' }}>
                🎯 Goal - Was möchten Sie erreichen?
              </h3>
              <textarea
                value={formData.goal}
                onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="Beschreiben Sie Ihr Ziel so konkret wie möglich..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  background: 'rgb(17, 24, 39)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {/* Reality Phase */}
          {currentPhase === 1 && (
            <div>
              <h3 style={{ color: phases[1].color, marginBottom: '1rem', fontSize: '1.5rem' }}>
                🔍 Reality - Wie ist die aktuelle Situation?
              </h3>
              <textarea
                value={formData.reality}
                onChange={(e) => setFormData(prev => ({ ...prev, reality: e.target.value }))}
                placeholder="Beschreiben Sie die aktuelle Realität, Hindernisse, Ressourcen..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  background: 'rgb(17, 24, 39)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {/* Options Phase */}
          {currentPhase === 2 && (
            <div>
              <h3 style={{ color: phases[2].color, marginBottom: '1rem', fontSize: '1.5rem' }}>
                💡 Options - Welche Möglichkeiten gibt es?
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Neue Option hinzufügen..."
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgb(17, 24, 39)',
                      border: '1px solid rgb(75, 85, 99)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <button
                    onClick={addOption}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: phases[2].color,
                      color: 'black',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formData.options.map((option, index) => (
                  <div key={index} style={{
                    padding: '1rem',
                    background: 'rgba(17, 24, 39, 0.8)',
                    borderRadius: '8px',
                    border: '1px solid rgb(75, 85, 99)'
                  }}>
                    <div style={{ marginBottom: '0.5rem', color: 'white', fontWeight: '600' }}>
                      {option.text}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'rgb(156, 163, 175)', fontSize: '0.875rem' }}>
                        Bewertung:
                      </span>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => rateOption(index, rating)}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            border: 'none',
                            background: option.rating >= rating ? phases[2].color : 'rgb(75, 85, 99)',
                            color: option.rating >= rating ? 'black' : 'white',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Way Phase */}
          {currentPhase === 3 && (
            <div>
              <h3 style={{ color: phases[3].color, marginBottom: '1rem', fontSize: '1.5rem' }}>
                🚀 Way Forward - Welche konkreten Schritte werden Sie unternehmen?
              </h3>
              <textarea
                value={formData.way}
                onChange={(e) => setFormData(prev => ({ ...prev, way: e.target.value }))}
                placeholder="Definieren Sie konkrete Schritte, Deadlines und Erfolgsmessungen..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  background: 'rgb(17, 24, 39)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
              
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Zusätzliche Notizen:
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Weitere Gedanken, Bedenken oder Ideen..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '1rem',
                    background: 'rgb(17, 24, 39)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation and Export */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
            disabled={currentPhase === 0}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentPhase === 0 ? 'rgb(55, 65, 81)' : 'rgb(99, 102, 241)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPhase === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ChevronLeft size={16} />
            Zurück
          </button>

          <button
            onClick={exportSession}
            style={{
              padding: '0.75rem 2rem',
              background: 'rgb(34, 197, 94)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={16} />
            Session exportieren
          </button>

          <button
            onClick={() => setCurrentPhase(Math.min(3, currentPhase + 1))}
            disabled={currentPhase === 3}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentPhase === 3 ? 'rgb(55, 65, 81)' : 'rgb(99, 102, 241)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPhase === 3 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Weiter
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  // Skalenarbeit Implementation
  const ScalingTool = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [scaleData, setScaleData] = useState({
      topic: '',
      currentValue: 5,
      targetValue: 8,
      reasons: '',
      steps: '',
      obstacles: '',
      resources: '',
      success: ''
    });

    const steps = [
      { title: 'Thema', key: 'topic' },
      { title: 'Aktueller Stand', key: 'currentValue' },
      { title: 'Zielwert', key: 'targetValue' },
      { title: 'Gründe', key: 'reasons' },
      { title: 'Nächste Schritte', key: 'steps' },
      { title: 'Hindernisse', key: 'obstacles' },
      { title: 'Ressourcen', key: 'resources' }
    ];

    const exportSession = () => {
      const session = `Skalenarbeit Session Export
==========================

Thema: ${scaleData.topic}
Aktueller Stand: ${scaleData.currentValue}/10
Zielwert: ${scaleData.targetValue}/10

Gründe für aktuellen Stand:
${scaleData.reasons}

Nächste Schritte:
${scaleData.steps}

Mögliche Hindernisse:
${scaleData.obstacles}

Verfügbare Ressourcen:
${scaleData.resources}

Export-Zeit: ${new Date().toLocaleString()}`;

      const blob = new Blob([session], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'skalenarbeit-session.txt';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Session exportiert!');
    };

    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>Skalenarbeit</h2>
          <p style={{ color: 'rgb(156, 163, 175)' }}>
            7-Schritt-Prozess zur systematischen Standortbestimmung
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {steps.map((_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: '4px',
                  background: index <= currentStep ? 'rgb(59, 130, 246)' : 'rgb(55, 65, 81)',
                  borderRadius: '2px'
                }}
              />
            ))}
          </div>
          <p style={{ color: 'rgb(156, 163, 175)', textAlign: 'center' }}>
            Schritt {currentStep + 1} von {steps.length}: {steps[currentStep]?.title}
          </p>
        </div>

        <div style={{
          background: 'rgba(31, 41, 55, 0.8)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Step 0: Topic */}
          {currentStep === 0 && (
            <div>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Welches Thema möchten Sie betrachten?</h3>
              <input
                type="text"
                value={scaleData.topic}
                onChange={(e) => setScaleData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="z.B. Zufriedenheit im Job, Work-Life-Balance..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgb(17, 24, 39)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}

          {/* Step 1: Current Value */}
          {currentStep === 1 && (
            <div>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>
                Wo stehen Sie aktuell? (1 = sehr schlecht, 10 = perfekt)
              </h3>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', color: 'rgb(59, 130, 246)', marginBottom: '1rem' }}>
                  {scaleData.currentValue}
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scaleData.currentValue}
                  onChange={(e) => setScaleData(prev => ({ ...prev, currentValue: parseInt(e.target.value) }))}
                  style={{ width: '100%', maxWidth: '400px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px', margin: '0.5rem auto', color: 'rgb(156, 163, 175)', fontSize: '0.875rem' }}>
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target Value */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>
                Wo möchten Sie hin?
              </h3>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', color: 'rgb(34, 197, 94)', marginBottom: '1rem' }}>
                  {scaleData.targetValue}
                </div>
                <input
                  type="range"
                  min={scaleData.currentValue}
                  max="10"
                  value={scaleData.targetValue}
                  onChange={(e) => setScaleData(prev => ({ ...prev, targetValue: parseInt(e.target.value) }))}
                  style={{ width: '100%', maxWidth: '400px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px', margin: '0.5rem auto', color: 'rgb(156, 163, 175)', fontSize: '0.875rem' }}>
                  <span>{scaleData.currentValue}</span><span>...</span><span>10</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Reasons */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>
                Warum sind Sie bei {scaleData.currentValue} und nicht bei 1?
              </h3>
              <textarea
                value={scaleData.reasons}
                onChange={(e) => setScaleData(prev => ({ ...prev, reasons: e.target.value }))}
                placeholder="Was läuft bereits gut? Welche Ressourcen haben Sie?"
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  background: 'rgb(17, 24, 39)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {/* Step 4: Next Steps */}
          {currentStep === 4 && (
            <div>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>
                Was wäre ein kleiner nächster Schritt von {scaleData.currentValue} zu {scaleData.currentValue + 1}?
              </h3>
              <textarea
                value={scaleData.steps}
                onChange={(e) => setScaleData(prev => ({ ...prev, steps: e.target.value }))}
                placeholder="Konkrete, kleine Schritte..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  background: 'rgb(17, 24, 39)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {/* Step 5: Obstacles */}
          {currentStep === 5 && (
            <div>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>
                Was könnte Sie daran hindern?
              </h3>
              <textarea
                value={scaleData.obstacles}
                onChange={(e) => setScaleData(prev => ({ ...prev, obstacles: e.target.value }))}
                placeholder="Hindernisse, Befürchtungen, Blockaden..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  background: 'rgb(17, 24, 39)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {/* Step 6: Resources */}
          {currentStep === 6 && (
            <div>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>
                Welche Unterstützung brauchen Sie?
              </h3>
              <textarea
                value={scaleData.resources}
                onChange={(e) => setScaleData(prev => ({ ...prev, resources: e.target.value }))}
                placeholder="Personen, Tools, Fähigkeiten, Zeit..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  background: 'rgb(17, 24, 39)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentStep === 0 ? 'rgb(55, 65, 81)' : 'rgb(99, 102, 241)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ChevronLeft size={16} />
            Zurück
          </button>

          {currentStep === steps.length - 1 && (
            <button
              onClick={exportSession}
              style={{
                padding: '0.75rem 2rem',
                background: 'rgb(34, 197, 94)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Download size={16} />
              Session exportieren
            </button>
          )}

          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentStep === steps.length - 1 ? 'rgb(55, 65, 81)' : 'rgb(99, 102, 241)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Weiter
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  // Lebensrad Implementation
  const LifeWheelTool = () => {
    const [areas, setAreas] = useState([
      { name: 'Karriere', value: 5, color: '#ef4444' },
      { name: 'Finanzen', value: 6, color: '#f97316' },
      { name: 'Gesundheit', value: 7, color: '#eab308' },
      { name: 'Familie', value: 8, color: '#22c55e' },
      { name: 'Beziehungen', value: 6, color: '#06b6d4' },
      { name: 'Freizeit', value: 4, color: '#3b82f6' },
      { name: 'Persönlichkeit', value: 7, color: '#8b5cf6' },
      { name: 'Umgebung', value: 5, color: '#ec4899' }
    ]);

    const [reflection, setReflection] = useState('');
    const [priorities, setPriorities] = useState('');

    const updateAreaValue = (index, value) => {
      setAreas(prev => prev.map((area, i) => 
        i === index ? { ...area, value: parseInt(value) } : area
      ));
    };

    const updateAreaName = (index, name) => {
      setAreas(prev => prev.map((area, i) => 
        i === index ? { ...area, name } : area
      ));
    };

    const calculateBalance = () => {
      const total = areas.reduce((sum, area) => sum + area.value, 0);
      return (total / areas.length).toFixed(1);
    };

    const generateSVG = () => {
      const centerX = 200;
      const centerY = 200;
      const maxRadius = 180;
      const angleStep = (2 * Math.PI) / areas.length;

      let path = '';
      areas.forEach((area, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const radius = (area.value / 10) * maxRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (index === 0) {
          path += `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      });
      path += ' Z';

      return (
        <svg width="400" height="400" style={{ background: 'rgb(17, 24, 39)', borderRadius: '12px' }}>
          {/* Grid circles */}
          {[2, 4, 6, 8, 10].map(value => (
            <circle
              key={value}
              cx={centerX}
              cy={centerY}
              r={(value / 10) * maxRadius}
              fill="none"
              stroke="rgb(55, 65, 81)"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* Grid lines */}
          {areas.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x2 = centerX + Math.cos(angle) * maxRadius;
            const y2 = centerY + Math.sin(angle) * maxRadius;
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={x2}
                y2={y2}
                stroke="rgb(55, 65, 81)"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}
          
          {/* Life wheel polygon */}
          <path
            d={path}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
          />
          
          {/* Area points and labels */}
          {areas.map((area, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const radius = (area.value / 10) * maxRadius;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const labelRadius = maxRadius + 20;
            const labelX = centerX + Math.cos(angle) * labelRadius;
            const labelY = centerY + Math.sin(angle) * labelRadius;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={area.color}
                />
                <text
                  x={labelX}
                  y={labelY}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {area.name}
                </text>
                <text
                  x={labelX}
                  y={labelY + 15}
                  fill="rgb(156, 163, 175)"
                  fontSize="10"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {area.value}/10
                </text>
              </g>
            );
          })}
          
          {/* Center point */}
          <circle
            cx={centerX}
            cy={centerY}
            r="3"
            fill="white"
          />
        </svg>
      );
    };

    const exportSession = () => {
      const session = `Lebensrad Session Export
========================

Lebensbereiche-Bewertung:
${areas.map(area => `${area.name}: ${area.value}/10`).join('\n')}

Balance-Score: ${calculateBalance()}/10

Reflexion:
${reflection}

Prioritäten:
${priorities}

Export-Zeit: ${new Date().toLocaleString()}`;

      const blob = new Blob([session], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lebensrad-session.txt';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Session exportiert!');
    };

    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>Lebensrad</h2>
          <p style={{ color: 'rgb(156, 163, 175)' }}>
            Visualisierung Ihrer Lebensbereiche für mehr Balance
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Controls */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                Bewerten Sie Ihre Lebensbereiche
              </h3>
              
              {areas.map((area, index) => (
                <div key={index} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: area.color,
                        marginRight: '0.5rem'
                      }}
                    />
                    <input
                      type="text"
                      value={area.name}
                      onChange={(e) => updateAreaName(index, e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '600',
                        flex: 1
                      }}
                    />
                    <span style={{ 
                      color: 'rgb(59, 130, 246)', 
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                      minWidth: '30px',
                      textAlign: 'right'
                    }}>
                      {area.value}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={area.value}
                    onChange={(e) => updateAreaValue(index, e.target.value)}
                    style={{ width: '100%' }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    color: 'rgb(156, 163, 175)',
                    fontSize: '0.75rem',
                    marginTop: '0.25rem'
                  }}>
                    <span>1</span><span>5</span><span>10</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Balance Score */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Balance-Score</h4>
              <div style={{ fontSize: '3rem', color: 'rgb(34, 197, 94)', fontWeight: 'bold' }}>
                {calculateBalance()}/10
              </div>
              <p style={{ color: 'rgb(156, 163, 175)', margin: 0 }}>
                Durchschnitt aller Lebensbereiche
              </p>
            </div>
          </div>

          {/* Visualization */}
          <div style={{ flex: 1, minWidth: '400px', textAlign: 'center' }}>
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              display: 'inline-block'
            }}>
              {generateSVG()}
            </div>
          </div>
        </div>

        {/* Reflection */}
        <div style={{
          background: 'rgba(31, 41, 55, 0.8)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Reflexion</h3>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Was fällt Ihnen auf? Wo sehen Sie Handlungsbedarf?"
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '1rem',
              background: 'rgb(17, 24, 39)',
              border: '1px solid rgb(75, 85, 99)',
              borderRadius: '8px',
              color: 'white',
              resize: 'vertical',
              marginBottom: '1rem'
            }}
          />
          
          <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Prioritäten für die nächsten Wochen</h4>
          <textarea
            value={priorities}
            onChange={(e) => setPriorities(e.target.value)}
            placeholder="Welche Bereiche möchten Sie als erstes angehen?"
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '1rem',
              background: 'rgb(17, 24, 39)',
              border: '1px solid rgb(75, 85, 99)',
              borderRadius: '8px',
              color: 'white',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Export */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={exportSession}
            style={{
              padding: '1rem 2rem',
              background: 'rgb(34, 197, 94)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={20} />
            Session exportieren
          </button>
        </div>
      </div>
    );
  };

  // Inneres Team Implementation
  const InnerTeamTool = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [dialogue, setDialogue] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [situation, setSituation] = useState('');
    const [resolution, setResolution] = useState('');

    const predefinedMembers = [
      { name: 'Der Kritiker', role: 'Hinterfragt und warnt', color: '#ef4444' },
      { name: 'Der Antreiber', role: 'Will Leistung und Erfolg', color: '#f97316' },
      { name: 'Der Harmonisierer', role: 'Möchte Frieden und Ausgleich', color: '#22c55e' },
      { name: 'Das Innere Kind', role: 'Spielt, träumt und hat Bedürfnisse', color: '#3b82f6' },
      { name: 'Der Rebell', role: 'Lehnt sich auf und will Freiheit', color: '#8b5cf6' },
      { name: 'Der Beschützer', role: 'Sorgt für Sicherheit', color: '#06b6d4' }
    ];

    const addTeamMember = (predefined = null) => {
      const member = predefined || {
        name: newMemberName,
        role: newMemberRole,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      
      if (member.name && member.role) {
        setTeamMembers(prev => [...prev, { ...member, id: Date.now() }]);
        setNewMemberName('');
        setNewMemberRole('');
      }
    };

    const addToDialogue = () => {
      if (currentMessage && selectedMember) {
        setDialogue(prev => [...prev, {
          member: selectedMember,
          message: currentMessage,
          timestamp: Date.now()
        }]);
        setCurrentMessage('');
      }
    };

    const exportSession = () => {
      const session = `Inneres Team Session Export
===========================

Situation:
${situation}

Team-Mitglieder:
${teamMembers.map(member => `- ${member.name}: ${member.role}`).join('\n')}

Dialog:
${dialogue.map(entry => `${entry.member.name}: ${entry.message}`).join('\n\n')}

Lösung/Vereinbarung:
${resolution}

Export-Zeit: ${new Date().toLocaleString()}`;

      const blob = new Blob([session], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inneres-team-session.txt';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Session exportiert!');
    };

    return (
      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>Inneres Team</h2>
          <p style={{ color: 'rgb(156, 163, 175)' }}>
            Dialog-Tool für innere Persönlichkeitsanteile nach Schulz von Thun
          </p>
        </div>

        {/* Situation */}
        <div style={{
          background: 'rgba(31, 41, 55, 0.8)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Situation beschreiben</h3>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Beschreiben Sie die Situation, in der verschiedene innere Stimmen sprechen..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '1rem',
              background: 'rgb(17, 24, 39)',
              border: '1px solid rgb(75, 85, 99)',
              borderRadius: '8px',
              color: 'white',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Team Management */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Team zusammenstellen</h3>
              
              {/* Predefined Members */}
              <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
                Vorgefertigte Stimmen
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '2rem' }}>
                {predefinedMembers.map((member, index) => (
                  <button
                    key={index}
                    onClick={() => addTeamMember(member)}
                    style={{
                      padding: '0.75rem',
                      background: 'rgba(17, 24, 39, 0.8)',
                      border: `2px solid ${member.color}`,
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: '600' }}>{member.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgb(156, 163, 175)' }}>
                      {member.role}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Member */}
              <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
                Eigene Stimme hinzufügen
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Name der Stimme"
                  style={{
                    padding: '0.75rem',
                    background: 'rgb(17, 24, 39)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Rolle/Aufgabe"
                  style={{
                    padding: '0.75rem',
                    background: 'rgb(17, 24, 39)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <button
                  onClick={() => addTeamMember()}
                  style={{
                    padding: '0.75rem',
                    background: 'rgb(99, 102, 241)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Stimme hinzufügen
                </button>
              </div>
            </div>

            {/* Current Team */}
            {teamMembers.length > 0 && (
              <div style={{
                background: 'rgba(31, 41, 55, 0.8)',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Ihr Team</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {teamMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      style={{
                        padding: '1rem',
                        background: selectedMember?.id === member.id 
                          ? `${member.color}20` 
                          : 'rgba(17, 24, 39, 0.8)',
                        border: `2px solid ${member.color}`,
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: '600' }}>{member.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'rgb(156, 163, 175)' }}>
                        {member.role}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dialogue */}
          <div style={{ flex: 2, minWidth: '400px' }}>
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Dialog moderieren</h3>
              
              {/* Dialogue History */}
              <div style={{
                background: 'rgb(17, 24, 39)',
                borderRadius: '8px',
                padding: '1rem',
                minHeight: '300px',
                maxHeight: '400px',
                overflowY: 'auto',
                marginBottom: '1rem'
              }}>
                {dialogue.length === 0 ? (
                  <p style={{ color: 'rgb(156, 163, 175)', textAlign: 'center' }}>
                    Wählen Sie eine Stimme aus und beginnen Sie den Dialog...
                  </p>
                ) : (
                  dialogue.map((entry, index) => (
                    <div key={index} style={{ marginBottom: '1rem' }}>
                      <div style={{
                        background: `${entry.member.color}20`,
                        border: `1px solid ${entry.member.color}`,
                        borderRadius: '8px',
                        padding: '1rem'
                      }}>
                        <div style={{
                          color: entry.member.color,
                          fontWeight: '600',
                          marginBottom: '0.5rem'
                        }}>
                          {entry.member.name}:
                        </div>
                        <div style={{ color: 'white' }}>{entry.message}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              {selectedMember && (
                <div>
                  <div style={{
                    background: `${selectedMember.color}20`,
                    border: `1px solid ${selectedMember.color}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      color: selectedMember.color,
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      {selectedMember.name} sagt:
                    </div>
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Was möchte diese Stimme sagen?"
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '0.75rem',
                        background: 'rgb(17, 24, 39)',
                        border: '1px solid rgb(75, 85, 99)',
                        borderRadius: '8px',
                        color: 'white',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <button
                    onClick={addToDialogue}
                    disabled={!currentMessage}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: currentMessage ? selectedMember.color : 'rgb(55, 65, 81)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: currentMessage ? 'pointer' : 'not-allowed',
                      fontWeight: '600'
                    }}
                  >
                    Zum Dialog hinzufügen
                  </button>
                </div>
              )}
            </div>

            {/* Resolution */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Lösung & Vereinbarung</h3>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Welche Lösung oder Vereinbarung haben die inneren Stimmen gefunden?"
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  background: 'rgb(17, 24, 39)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Export */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={exportSession}
                style={{
                  padding: '1rem 2rem',
                  background: 'rgb(34, 197, 94)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Download size={20} />
                Session exportieren
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Text Tool Viewer Component
  const TextToolViewer = ({ tool }) => {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>
            {tool.name}
          </h3>
          <p style={{ color: 'rgb(156, 163, 175)', margin: 0 }}>
            {tool.description}
          </p>
        </div>

        <div style={{
          background: 'rgba(55, 65, 81, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgb(31, 41, 55)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgb(75, 85, 99)',
            whiteSpace: 'pre-wrap',
            color: 'white',
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
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgb(34, 197, 94)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📄 Text kopieren
          </button>
        </div>
      </div>
    );
  };

  // File Viewer Component - ERWEITERT für PDF/Word
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

    // Get file extension
    const fileExtension = tool.fileName ? tool.fileName.split('.').pop().toLowerCase() : '';
    const isPDF = fileExtension === 'pdf';
    const isWord = ['doc', 'docx'].includes(fileExtension);
    const isImage = tool.fileType && tool.fileType.startsWith('image/');

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>
            {tool.name}
          </h3>
          <p style={{ color: 'rgb(156, 163, 175)', margin: 0 }}>
            Hochgeladene Datei: {tool.fileName}
          </p>
        </div>

        <div style={{
          background: 'rgba(55, 65, 81, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          
          {/* PDF Viewer */}
          {isPDF ? (
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
              <h4 style={{ color: 'white', margin: '0 0 1rem 0' }}>{tool.fileName}</h4>
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
          ) : 
          
          /* Word Document */
          isWord ? (
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <h4 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{tool.fileName}</h4>
              <p style={{ color: 'rgb(156, 163, 175)', margin: '0 0 1.5rem 0' }}>
                Word-Dokument kann nicht direkt angezeigt werden.<br/>
                Klicken Sie auf Download, um die Datei zu öffnen.
              </p>
            </div>
          ) : 
          
          /* Images */
          isImage ? (
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
              <h4 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{tool.fileName}</h4>
            </div>
          ) : 
          
          /* Other file types */
          (
            <div>
              <Upload size={64} style={{ color: 'rgb(99, 102, 241)', margin: '0 auto 1rem auto' }} />
              <h4 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{tool.fileName}</h4>
              <p style={{ color: 'rgb(156, 163, 175)', margin: '0 0 1.5rem 0' }}>
                Dateityp: {tool.fileType || 'Unbekannt'}
              </p>
            </div>
          )}

          <button
            onClick={downloadFile}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgb(99, 102, 241)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
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

    switch (selectedTool.id) {
      case 'scaling-builtin':
        return <ScalingTool />;
      case 'lifewheel-builtin':
        return <LifeWheelTool />;
      case 'grow-builtin':
        return <GrowTool />;
      case 'team-builtin':
        return <InnerTeamTool />;
      default:
        if (selectedTool.type === 'text') {
          return <TextToolViewer tool={selectedTool} />;
        }
        if (selectedTool.type === 'file') {
          return <FileViewer tool={selectedTool} />;
        }
        return (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Target size={64} style={{ color: 'rgb(156, 163, 175)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 0.5rem 0' }}>
              {selectedTool.name}
            </h3>
            <p style={{ color: 'rgb(156, 163, 175)', margin: '0 0 1rem 0' }}>
              Interaktives Tool wird geladen...
            </p>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'rgb(17, 24, 39)',
      color: 'white',
      padding: '2rem'
    }}>
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
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: 'white' }}>
            Coaching-Toolbox
          </h1>
          <p style={{ margin: 0, color: 'rgb(156, 163, 175)' }}>
            Professionelle Tools für Ihre Coaching-Sessions. Entdecken Sie interaktive Methoden und erstellen Sie eigene Inhalte.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowCategoryModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: 'white',
              border: '1px solid rgb(75, 85, 99)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Settings size={16} /> Kategorien
          </button>
          <button 
            onClick={() => setShowTextToolModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgb(99, 102, 241)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus size={16} /> Text-Tool
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: 'white',
              border: '1px solid rgb(75, 85, 99)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Upload size={16} /> Datei-Tool
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{
        background: 'rgba(55, 65, 81, 0.3)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '2rem',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        marginBottom: '2rem'
      }}>
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
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                background: 'rgb(31, 41, 55)',
                border: '1px solid rgb(75, 85, 99)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              style={{
                padding: '0.5rem 1rem',
                background: filterCategory === category 
                  ? 'rgb(99, 102, 241)' 
                  : 'rgb(55, 65, 81)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
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
              style={{
                background: 'rgb(31, 41, 55)',
                border: '1px solid rgb(75, 85, 99)',
                borderRadius: '12px',
                padding: '1.5rem',
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
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgb(239, 68, 68)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem'
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
                  <span style={{
                    padding: '2px 8px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: 'rgb(34, 197, 94)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    fontSize: '0.75rem'
                  }}>
                    Aktiv
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(tool.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: favorites.has(tool.id) ? 'rgb(251, 191, 36)' : 'rgb(156, 163, 175)'
                    }}
                  >
                    <Star size={16} fill={favorites.has(tool.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '1.25rem',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {tool.name}
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: 'rgb(156, 163, 175)',
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
                <span style={{
                  padding: '2px 8px',
                  background: 'transparent',
                  color: 'rgb(203, 213, 225)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
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
                <span style={{
                  padding: '4px 12px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: 'rgb(99, 102, 241)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
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
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'rgb(156, 163, 175)'
              }}>
                <span>Sofort verwendbar</span>
                <span>{tool.type === 'interactive' ? 'Mit Export' : 'Custom Tool'}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div style={{
          background: 'rgba(55, 65, 81, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '3rem',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          textAlign: 'center'
        }}>
          <Target size={48} style={{ color: 'rgb(156, 163, 175)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.125rem', color: 'white', margin: '0 0 0.5rem 0' }}>
            Keine Tools gefunden
          </h3>
          <p style={{ color: 'rgb(156, 163, 175)', margin: 0 }}>
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
          <div style={{ 
            maxWidth: '95vw', 
            width: '100%', 
            maxHeight: '95vh',
            position: 'relative',
            background: 'rgb(17, 24, 39)',
            borderRadius: '12px',
            overflowY: 'auto',
            border: '1px solid rgb(75, 85, 99)'
          }}>
            <button
              onClick={() => setSelectedTool(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgb(239, 68, 68)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
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
          <div style={{
            background: 'rgb(17, 24, 39)',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid rgb(75, 85, 99)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.5rem' }}>
              Text-Tool erstellen
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>
                Tool-Name:
              </label>
              <input
                type="text"
                value={textToolData.name}
                onChange={(e) => setTextToolData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="z.B. Meine Coaching-Fragen"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>
                Beschreibung:
              </label>
              <input
                type="text"
                value={textToolData.description}
                onChange={(e) => setTextToolData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Kurze Beschreibung des Tools"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>



            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>
                Tool-Inhalt:
              </label>
              <textarea
                value={textToolData.content}
                onChange={(e) => setTextToolData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Hier können Sie Coaching-Fragen, Übungen, Checklisten oder andere Texte eingeben..."
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowTextToolModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(55, 65, 81)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleCreateTextTool}
                disabled={!textToolData.name || !textToolData.content}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: textToolData.name && textToolData.content ? 'rgb(99, 102, 241)' : 'rgb(55, 65, 81)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: textToolData.name && textToolData.content ? 'pointer' : 'not-allowed'
                }}
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
          <div style={{
            background: 'rgb(17, 24, 39)',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgb(75, 85, 99)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.5rem' }}>
              Tool hochladen
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'rgb(156, 163, 175)' }}>
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
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <p style={{ 
                margin: '0.5rem 0 0 0', 
                fontSize: '0.875rem', 
                color: 'rgb(156, 163, 175)' 
              }}>
                Unterstützte Formate: PDF, Word, PowerPoint, Excel, Bilder, Text
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(55, 65, 81)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
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
          <div style={{
            background: 'rgb(17, 24, 39)',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '70vh',
            overflowY: 'auto',
            border: '1px solid rgb(75, 85, 99)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.5rem' }}>
              Kategorien verwalten
            </h3>
            
            {/* Add new category */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>
                Neue Kategorie hinzufügen:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Kategorie-Name..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: newCategoryName.trim() ? 'rgb(99, 102, 241)' : 'rgb(55, 65, 81)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: newCategoryName.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Hinzufügen
                </button>
              </div>
            </div>

            {/* List existing categories */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'white' }}>Bestehende Kategorien:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Built-in categories (not deletable) */}
                {['Entscheidungshilfen', 'Reflexion', 'Ressourcen', 'Zielklärung'].map(category => (
                  <div key={category} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'rgba(55, 65, 81, 0.3)',
                    borderRadius: '8px',
                    border: '1px solid rgba(75, 85, 99, 0.3)'
                  }}>
                    <span style={{ color: 'white' }}>{category}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: 'rgb(156, 163, 175)',
                      fontStyle: 'italic'
                    }}>
                      Standard-Kategorie
                    </span>
                  </div>
                ))}

                {/* Custom categories (deletable) */}
                {customCategories.map(category => (
                  <div key={category} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'rgba(31, 41, 55, 0.5)',
                    borderRadius: '8px',
                    border: '1px solid rgb(75, 85, 99)'
                  }}>
                    <span style={{ color: 'white' }}>{category}</span>
                    {category !== 'Eigene Tools' && (
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: 'rgb(239, 68, 68)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
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
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(99, 102, 241)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}