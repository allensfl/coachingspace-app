import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, Plus, Star, Upload, BarChart3, Users, Scale, Compass, Settings } from 'lucide-react';

export default function Toolbox() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [customTools, setCustomTools] = useState([]);
  const [customCategories, setCustomCategories] = useState(['Eigene Tools']);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Simple toast function
  const showToast = (message) => {
    alert(message);
  };

  // Built-in Coaching Tools
  const builtInTools = [
    {
      id: 'scaling',
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
      id: 'lifewheel',
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
      id: 'grow',
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
      id: 'values',
      name: 'Wertequadrat',
      description: '4-Quadranten-Modell nach Schulz von Thun zur Werte-Analyse und Balance-Reflexion.',
      category: 'Reflexion',
      type: 'interactive',
      icon: Scale,
      status: 'active',
      duration: '25-45 Min',
      difficulty: 'Fortgeschritten'
    },
    {
      id: 'team',
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

  // GROW-Modell Tool Component
  const GrowTool = () => {
    const [currentPhase, setCurrentPhase] = useState(0);
    const [growData, setGrowData] = useState({
      goal: '',
      reality: '',
      obstacles: '',
      resources: '',
      options: [],
      wayForward: '',
      actionSteps: '',
      timeline: '',
      commitment: 5
    });

    const [newOption, setNewOption] = useState('');
    const [optionRatings, setOptionRatings] = useState({});

    const phases = ['Goal', 'Reality', 'Options', 'Way Forward'];

    const addOption = () => {
      if (newOption.trim()) {
        const option = { id: Date.now(), text: newOption.trim() };
        setGrowData(prev => ({ ...prev, options: [...prev.options, option] }));
        setOptionRatings(prev => ({ ...prev, [option.id]: { feasibility: 5, impact: 5 } }));
        setNewOption('');
      }
    };

    const exportSession = () => {
      const content = `GROW-Modell Session - ${new Date().toLocaleDateString()}\n\n` +
        `GOAL (Ziel):\n${growData.goal}\n\n` +
        `REALITY (Realität):\n${growData.reality}\n\n` +
        `OBSTACLES (Hindernisse):\n${growData.obstacles}\n\n` +
        `RESOURCES (Ressourcen):\n${growData.resources}\n\n` +
        `OPTIONS (Optionen):\n${growData.options.map((opt, i) => 
          `${i+1}. ${opt.text} (Machbarkeit: ${optionRatings[opt.id]?.feasibility || 5}/10, Impact: ${optionRatings[opt.id]?.impact || 5}/10)`
        ).join('\n')}\n\n` +
        `WAY FORWARD (Weg nach vorn):\n${growData.wayForward}\n\n` +
        `AKTIONSSCHRITTE:\n${growData.actionSteps}\n\n` +
        `ZEITRAHMEN:\n${growData.timeline}\n\n` +
        `COMMITMENT LEVEL: ${growData.commitment}/10`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `grow-modell-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast("GROW-Modell Session exportiert!");
    };

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>
            GROW-Modell
          </h3>
          <p style={{ color: 'rgb(156, 163, 175)', margin: 0 }}>
            {phases[currentPhase]} - Phase {currentPhase + 1} von {phases.length}
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {phases.map((phase, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhase(index)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: index === currentPhase ? 'rgb(99, 102, 241)' : 'rgb(55, 65, 81)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {phase}
            </button>
          ))}
        </div>

        <div style={{
          background: 'rgba(55, 65, 81, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          marginBottom: '2rem'
        }}>
          {currentPhase === 0 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                GOAL: Was ist Ihr spezifisches Ziel?
              </label>
              <textarea
                value={growData.goal}
                onChange={(e) => setGrowData(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="Beschreiben Sie Ihr SMART-Ziel..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {currentPhase === 1 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  REALITY: Wie ist die aktuelle Situation?
                </label>
                <textarea
                  value={growData.reality}
                  onChange={(e) => setGrowData(prev => ({ ...prev, reality: e.target.value }))}
                  placeholder="Beschreiben Sie die aktuelle Realität..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  Was sind die größten Hindernisse?
                </label>
                <textarea
                  value={growData.obstacles}
                  onChange={(e) => setGrowData(prev => ({ ...prev, obstacles: e.target.value }))}
                  placeholder="Hindernisse, Herausforderungen..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  Welche Ressourcen haben Sie bereits?
                </label>
                <textarea
                  value={growData.resources}
                  onChange={(e) => setGrowData(prev => ({ ...prev, resources: e.target.value }))}
                  placeholder="Fähigkeiten, Unterstützung, Hilfsmittel..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          )}

          {currentPhase === 2 && (
            <div>
              <label style={{ display: 'block', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>
                OPTIONS: Welche Optionen haben Sie?
              </label>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addOption()}
                    placeholder="Neue Option hinzufügen..."
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
                    onClick={addOption}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'rgb(99, 102, 241)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Hinzufügen
                  </button>
                </div>

                {growData.options.map(option => (
                  <div key={option.id} style={{ 
                    background: 'rgb(31, 41, 55)', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    border: '1px solid rgb(75, 85, 99)'
                  }}>
                    <div style={{ marginBottom: '0.5rem', color: 'white' }}>
                      {option.text}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgb(156, 163, 175)', marginBottom: '0.25rem' }}>
                          Machbarkeit: {optionRatings[option.id]?.feasibility || 5}/10
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={optionRatings[option.id]?.feasibility || 5}
                          onChange={(e) => setOptionRatings(prev => ({
                            ...prev,
                            [option.id]: { ...prev[option.id], feasibility: parseInt(e.target.value) }
                          }))}
                          style={{
                            width: '100%',
                            accentColor: 'rgb(99, 102, 241)',
                            background: 'rgb(75, 85, 99)',
                            borderRadius: '8px',
                            height: '6px'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgb(156, 163, 175)', marginBottom: '0.25rem' }}>
                          Impact: {optionRatings[option.id]?.impact || 5}/10
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={optionRatings[option.id]?.impact || 5}
                          onChange={(e) => setOptionRatings(prev => ({
                            ...prev,
                            [option.id]: { ...prev[option.id], impact: parseInt(e.target.value) }
                          }))}
                          style={{
                            width: '100%',
                            accentColor: 'rgb(34, 197, 94)',
                            background: 'rgb(75, 85, 99)',
                            borderRadius: '8px',
                            height: '6px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentPhase === 3 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  WAY FORWARD: Welche Option(en) wählen Sie?
                </label>
                <textarea
                  value={growData.wayForward}
                  onChange={(e) => setGrowData(prev => ({ ...prev, wayForward: e.target.value }))}
                  placeholder="Ihre gewählte(n) Option(en) und Begründung..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  Konkrete Aktionsschritte:
                </label>
                <textarea
                  value={growData.actionSteps}
                  onChange={(e) => setGrowData(prev => ({ ...prev, actionSteps: e.target.value }))}
                  placeholder="1. Schritt...\n2. Schritt...\n3. Schritt..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  Zeitrahmen:
                </label>
                <input
                  type="text"
                  value={growData.timeline}
                  onChange={(e) => setGrowData(prev => ({ ...prev, timeline: e.target.value }))}
                  placeholder="z.B. nächste 4 Wochen, bis Ende Monat..."
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

              <div>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>
                  Commitment Level: {growData.commitment}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={growData.commitment}
                  onChange={(e) => setGrowData(prev => ({ ...prev, commitment: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    accentColor: 'rgb(99, 102, 241)',
                    background: 'rgb(75, 85, 99)',
                    borderRadius: '8px',
                    height: '8px'
                  }}
                />
                <div style={{ textAlign: 'center', marginTop: '0.5rem', color: 'rgb(156, 163, 175)', fontSize: '0.875rem' }}>
                  Wie verpflichtet fühlen Sie sich zur Umsetzung?
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentPhase > 0 && (
              <button
                onClick={() => setCurrentPhase(prev => prev - 1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(55, 65, 81)',
                  color: 'white',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Zurück
              </button>
            )}
            {currentPhase < phases.length - 1 && (
              <button
                onClick={() => setCurrentPhase(prev => prev + 1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(99, 102, 241)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Weiter
              </button>
            )}
          </div>
          
          <button
            onClick={exportSession}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgb(34, 197, 94)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📁 Session exportieren
          </button>
        </div>
      </div>
    );
  };

  // Wertequadrat Tool Component
  const ValuesSquareTool = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [values, setValues] = useState({
      coreValue: '',
      oppositeValue: '',
      positiveOpposite: '',
      negativeExcess: '',
      situation: '',
      currentBalance: 5,
      targetBalance: 7,
      actionPlan: ''
    });

    const steps = ['Kernwert', 'Gegenpol', 'Quadrat vervollständigen', 'Situation bewerten', 'Aktionsplan'];

    const exportSession = () => {
      const content = `Wertequadrat Session - ${new Date().toLocaleDateString()}\n\n` +
        `WERTEQUADRAT:\n` +
        `Kernwert: ${values.coreValue}\n` +
        `Übertreibung/Schwäche: ${values.negativeExcess}\n` +
        `Positiver Gegenpol: ${values.positiveOpposite}\n` +
        `Negativer Gegenpol: ${values.oppositeValue}\n\n` +
        `SITUATION:\n${values.situation}\n\n` +
        `BALANCE:\n` +
        `Aktuell: ${values.currentBalance}/10\n` +
        `Ziel: ${values.targetBalance}/10\n\n` +
        `AKTIONSPLAN:\n${values.actionPlan}`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wertequadrat-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast("Wertequadrat Session exportiert!");
    };

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>
            Wertequadrat
          </h3>
          <p style={{ color: 'rgb(156, 163, 175)', margin: 0 }}>
            Schritt {currentStep + 1} von {steps.length}: {steps[currentStep]}
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto' }}>
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              style={{
                minWidth: '120px',
                padding: '0.5rem 1rem',
                background: index <= currentStep ? 'rgb(99, 102, 241)' : 'rgb(55, 65, 81)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {step}
            </button>
          ))}
        </div>

        <div style={{
          background: 'rgba(55, 65, 81, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          marginBottom: '2rem'
        }}>
          {currentStep === 0 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                Was ist Ihr Kernwert in dieser Situation?
              </label>
              <input
                type="text"
                value={values.coreValue}
                onChange={(e) => setValues(prev => ({ ...prev, coreValue: e.target.value }))}
                placeholder="z.B. Ordnung, Hilfsbereitschaft, Ehrlichkeit..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  marginBottom: '1rem'
                }}
              />
              <div style={{ color: 'rgb(156, 163, 175)', fontSize: '0.875rem' }}>
                Beispiele: Ordnung, Hilfsbereitschaft, Ehrlichkeit, Gerechtigkeit, Sparsamkeit, Mut, Vorsicht
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                Was ist das Gegenteil Ihres Kernwerts?
              </label>
              <input
                type="text"
                value={values.oppositeValue}
                onChange={(e) => setValues(prev => ({ ...prev, oppositeValue: e.target.value }))}
                placeholder={`Gegenteil von "${values.coreValue}"...`}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  marginBottom: '1rem'
                }}
              />
              <div style={{ color: 'rgb(156, 163, 175)', fontSize: '0.875rem' }}>
                {values.coreValue === 'Ordnung' && 'z.B. Chaos, Unordnung'}
                {values.coreValue === 'Hilfsbereitschaft' && 'z.B. Egoismus, Gleichgültigkeit'}
                {values.coreValue === 'Ehrlichkeit' && 'z.B. Unehrlichkeit, Lüge'}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h4 style={{ margin: '0 0 1rem 0', color: 'white' }}>Vervollständigen Sie das Wertequadrat:</h4>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  Übertreibung/Schwäche von "{values.coreValue}":
                </label>
                <input
                  type="text"
                  value={values.negativeExcess}
                  onChange={(e) => setValues(prev => ({ ...prev, negativeExcess: e.target.value }))}
                  placeholder="Was passiert, wenn Sie Ihren Kernwert übertreiben?"
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
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  Positive Ausprägung von "{values.oppositeValue}":
                </label>
                <input
                  type="text"
                  value={values.positiveOpposite}
                  onChange={(e) => setValues(prev => ({ ...prev, positiveOpposite: e.target.value }))}
                  placeholder="Welche positiven Aspekte hat der Gegenpol?"
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

              {/* Wertequadrat Visualisierung */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>💎</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Kernwert</div>
                  <div>{values.coreValue || 'Ihr Hauptwert'}</div>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚖️</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Positiver Gegenpol</div>
                  <div>{values.positiveOpposite || 'Ergänzender Wert'}</div>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚠️</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Übertreibung</div>
                  <div>{values.negativeExcess || 'Schwäche des Kernwerts'}</div>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>❌</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Negativer Gegenpol</div>
                  <div>{values.oppositeValue || 'Gegenteil'}</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  Beschreiben Sie die aktuelle Situation:
                </label>
                <textarea
                  value={values.situation}
                  onChange={(e) => setValues(prev => ({ ...prev, situation: e.target.value }))}
                  placeholder="In welcher Situation möchten Sie das Wertequadrat anwenden?"
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>
                  Aktuelle Balance zwischen "{values.coreValue}" und "{values.positiveOpposite}": {values.currentBalance}/10
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={values.currentBalance}
                  onChange={(e) => setValues(prev => ({ ...prev, currentBalance: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    marginBottom: '0.5rem',
                    accentColor: 'rgb(99, 102, 241)',
                    background: 'rgb(75, 85, 99)',
                    borderRadius: '8px',
                    height: '8px'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'rgb(156, 163, 175)' }}>
                  <span>Nur {values.coreValue}</span>
                  <span>Ausgewogen</span>
                  <span>Nur {values.positiveOpposite}</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>
                  Angestrebte Balance: {values.targetBalance}/10
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={values.targetBalance}
                  onChange={(e) => setValues(prev => ({ ...prev, targetBalance: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    marginBottom: '0.5rem',
                    accentColor: 'rgb(34, 197, 94)',
                    background: 'rgb(75, 85, 99)',
                    borderRadius: '8px',
                    height: '8px'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'rgb(156, 163, 175)' }}>
                  <span>Nur {values.coreValue}</span>
                  <span>Ausgewogen</span>
                  <span>Nur {values.positiveOpposite}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                Wie können Sie die gewünschte Balance erreichen?
              </label>
              <textarea
                value={values.actionPlan}
                onChange={(e) => setValues(prev => ({ ...prev, actionPlan: e.target.value }))}
                placeholder="Konkrete Schritte und Strategien..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
              <div style={{ color: 'rgb(156, 163, 175)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Was können Sie mehr/weniger tun? Welche neuen Verhaltensweisen möchten Sie entwickeln?
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(55, 65, 81)',
                  color: 'white',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Zurück
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(99, 102, 241)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Weiter
              </button>
            )}
          </div>
          
          <button
            onClick={exportSession}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgb(34, 197, 94)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📁 Session exportieren
          </button>
        </div>
      </div>
    );
  };

  // Inneres Team Tool Component
  const InnerTeamTool = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [teamData, setTeamData] = useState({
      situation: '',
      teamMembers: [],
      dialogHistory: [],
      teamLeader: null,
      decision: '',
      actionPlan: ''
    });

    const [newMember, setNewMember] = useState({ name: '', description: '', strength: 5 });
    const [dialogInput, setDialogInput] = useState('');
    const [selectedSpeaker, setSelectedSpeaker] = useState(null);

    const steps = ['Situation', 'Team aufstellen', 'Dialog führen', 'Entscheidung'];

    const commonVoices = [
      { name: 'Der Perfektionist', description: 'Will alles korrekt und vollständig machen', strength: 7 },
      { name: 'Der Kritiker', description: 'Sieht Probleme und Risiken', strength: 6 },
      { name: 'Der Optimist', description: 'Sieht Chancen und Möglichkeiten', strength: 8 },
      { name: 'Der Praktiker', description: 'Will pragmatische Lösungen', strength: 7 },
      { name: 'Der Ängstliche', description: 'Sorgt sich um Sicherheit', strength: 5 },
      { name: 'Der Träumer', description: 'Hat große Visionen und Ideen', strength: 6 }
    ];

    const addTeamMember = (member) => {
      const memberWithId = { ...member, id: Date.now() };
      setTeamData(prev => ({ 
        ...prev, 
        teamMembers: [...prev.teamMembers, memberWithId] 
      }));
      setNewMember({ name: '', description: '', strength: 5 });
    };

    const addDialog = () => {
      if (dialogInput.trim() && selectedSpeaker) {
        const dialog = {
          id: Date.now(),
          speaker: selectedSpeaker,
          message: dialogInput.trim(),
          timestamp: new Date().toLocaleTimeString()
        };
        setTeamData(prev => ({ 
          ...prev, 
          dialogHistory: [...prev.dialogHistory, dialog] 
        }));
        setDialogInput('');
      }
    };

    const exportSession = () => {
      const content = `Inneres Team Session - ${new Date().toLocaleDateString()}\n\n` +
        `SITUATION:\n${teamData.situation}\n\n` +
        `TEAM-MITGLIEDER:\n${teamData.teamMembers.map(member => 
          `${member.name} (Stärke: ${member.strength}/10): ${member.description}`
        ).join('\n')}\n\n` +
        `DIALOG:\n${teamData.dialogHistory.map(dialog => 
          `[${dialog.timestamp}] ${dialog.speaker.name}: ${dialog.message}`
        ).join('\n')}\n\n` +
        `TEAM-LEITUNG: ${teamData.teamLeader?.name || 'Nicht gewählt'}\n\n` +
        `ENTSCHEIDUNG:\n${teamData.decision}\n\n` +
        `AKTIONSPLAN:\n${teamData.actionPlan}`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inneres-team-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast("Inneres Team Session exportiert!");
    };

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>
            Inneres Team
          </h3>
          <p style={{ color: 'rgb(156, 163, 175)', margin: 0 }}>
            Schritt {currentStep + 1} von {steps.length}: {steps[currentStep]}
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: index <= currentStep ? 'rgb(99, 102, 241)' : 'rgb(55, 65, 81)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {step}
            </button>
          ))}
        </div>

        <div style={{
          background: 'rgba(55, 65, 81, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          marginBottom: '2rem'
        }}>
          {currentStep === 0 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                In welcher Situation benötigen Sie Klarheit?
              </label>
              <textarea
                value={teamData.situation}
                onChange={(e) => setTeamData(prev => ({ ...prev, situation: e.target.value }))}
                placeholder="Beschreiben Sie die Entscheidung oder Situation, bei der Sie verschiedene innere Stimmen wahrnehmen..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h4 style={{ margin: '0 0 1rem 0', color: 'white' }}>Häufige innere Stimmen hinzufügen:</h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                {commonVoices.map((voice, index) => (
                  <button
                    key={index}
                    onClick={() => addTeamMember(voice)}
                    style={{
                      padding: '0.75rem',
                      background: 'rgb(31, 41, 55)',
                      border: '1px solid rgb(75, 85, 99)',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{voice.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgb(156, 163, 175)' }}>
                      {voice.description}
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ 
                background: 'rgb(31, 41, 55)', 
                padding: '1.5rem', 
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'white' }}>Eigene Stimme hinzufügen:</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Name der Stimme..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgb(55, 65, 81)',
                      border: '1px solid rgb(75, 85, 99)',
                      borderRadius: '8px',
                      color: 'white',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <textarea
                    value={newMember.description}
                    onChange={(e) => setNewMember(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Was sagt diese Stimme? Was ist ihr wichtig?"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgb(55, 65, 81)',
                      border: '1px solid rgb(75, 85, 99)',
                      borderRadius: '8px',
                      color: 'white',
                      resize: 'vertical',
                      minHeight: '60px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>
                    Stärke/Einfluss: {newMember.strength}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newMember.strength}
                    onChange={(e) => setNewMember(prev => ({ ...prev, strength: parseInt(e.target.value) }))}
                    style={{
                      width: '100%',
                      accentColor: 'rgb(99, 102, 241)',
                      background: 'rgb(75, 85, 99)',
                      borderRadius: '8px',
                      height: '6px'
                    }}
                  />
                </div>
                <button
                  onClick={() => addTeamMember(newMember)}
                  disabled={!newMember.name || !newMember.description}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: newMember.name && newMember.description ? 'rgb(99, 102, 241)' : 'rgb(55, 65, 81)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: newMember.name && newMember.description ? 'pointer' : 'not-allowed'
                  }}
                >
                  Stimme hinzufügen
                </button>
              </div>

              <h4 style={{ margin: '0 0 1rem 0', color: 'white' }}>Ihr inneres Team ({teamData.teamMembers.length} Mitglieder):</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {teamData.teamMembers.map(member => (
                  <div key={member.id} style={{ 
                    background: 'rgb(31, 41, 55)', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    border: '1px solid rgb(75, 85, 99)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'white' }}>
                          {member.name}
                          {teamData.teamLeader?.id === member.id && (
                            <span style={{ marginLeft: '0.5rem', color: '#fbbf24' }}>👑</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'rgb(156, 163, 175)' }}>
                          {member.description}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'rgb(99, 102, 241)', fontWeight: 'bold' }}>
                          {member.strength}/10
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <select
                  value={selectedSpeaker?.id || ''}
                  onChange={(e) => {
                    const speaker = teamData.teamMembers.find(m => m.id === parseInt(e.target.value));
                    setSelectedSpeaker(speaker);
                  }}
                  style={{
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white',
                    minWidth: '200px'
                  }}
                >
                  <option value="">Sprecher wählen...</option>
                  {teamData.teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={dialogInput}
                  onChange={(e) => setDialogInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addDialog()}
                  placeholder="Was sagt diese Stimme zu der Situation?"
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
                  onClick={addDialog}
                  disabled={!dialogInput.trim() || !selectedSpeaker}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: dialogInput.trim() && selectedSpeaker ? 'rgb(99, 102, 241)' : 'rgb(55, 65, 81)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: dialogInput.trim() && selectedSpeaker ? 'pointer' : 'not-allowed'
                  }}
                >
                  Hinzufügen
                </button>
              </div>

              <div style={{ 
                background: 'rgb(31, 41, 55)', 
                padding: '1rem', 
                borderRadius: '8px',
                minHeight: '200px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'white' }}>Team-Dialog:</h4>
                {teamData.dialogHistory.length === 0 ? (
                  <div style={{ color: 'rgb(156, 163, 175)', fontStyle: 'italic' }}>
                    Noch keine Beiträge. Lassen Sie Ihr inneres Team zu Wort kommen...
                  </div>
                ) : (
                  teamData.dialogHistory.map(dialog => (
                    <div key={dialog.id} style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}>
                        <strong style={{ color: 'rgb(99, 102, 241)' }}>
                          {dialog.speaker.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'rgb(156, 163, 175)' }}>
                          {dialog.timestamp}
                        </span>
                      </div>
                      <div style={{ color: 'white', lineHeight: '1.4' }}>
                        {dialog.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  Welche Stimme soll die Führung übernehmen?
                </label>
                <select
                  value={teamData.teamLeader?.id || ''}
                  onChange={(e) => {
                    const leader = teamData.teamMembers.find(m => m.id === parseInt(e.target.value));
                    setTeamData(prev => ({ ...prev, teamLeader: leader }));
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                >
                  <option value="">Team-Leitung wählen...</option>
                  {teamData.teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} (Stärke: {member.strength}/10)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  Welche Entscheidung trifft das Team?
                </label>
                <textarea
                  value={teamData.decision}
                  onChange={(e) => setTeamData(prev => ({ ...prev, decision: e.target.value }))}
                  placeholder="Die gemeinsame Entscheidung des Teams..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '8px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                  Wie setzt das Team die Entscheidung um?
                </label>
                <textarea
                  value={teamData.actionPlan}
                  onChange={(e) => setTeamData(prev => ({ ...prev, actionPlan: e.target.value }))}
                  placeholder="Konkrete Schritte und Aktionen..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    background: 'rgb(31, 41, 55)',
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

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(55, 65, 81)',
                  color: 'white',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Zurück
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(99, 102, 241)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Weiter
              </button>
            )}
          </div>
          
          <button
            onClick={exportSession}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgb(34, 197, 94)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📁 Session exportieren
          </button>
        </div>
      </div>
    );
  };

  // Skalenarbeit Tool Component
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
          <Upload size={64} style={{ color: 'rgb(99, 102, 241)', margin: '0 auto 1rem auto' }} />
          <h4 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{tool.fileName}</h4>
          <p style={{ color: 'rgb(156, 163, 175)', margin: '0 0 1.5rem 0' }}>
            Dateityp: {tool.fileType || 'Unbekannt'}
          </p>
          
          {tool.fileType && tool.fileType.startsWith('image/') && (
            <img 
              src={tool.fileContent} 
              alt={tool.fileName}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '400px', 
                objectFit: 'contain',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            />
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
            Datei herunterladen
          </button>
        </div>
      </div>
    );
  };
  const ScalingTool = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [scalingData, setScalingData] = useState({
      goal: '',
      currentState: 5,
      targetState: 8,
      obstacles: '',
      resources: '',
      nextSteps: '',
      timeframe: ''
    });

    const steps = [
      'Ziel definieren',
      'Aktueller Stand',
      'Zielstand festlegen', 
      'Hindernisse identifizieren',
      'Ressourcen sammeln',
      'Nächste Schritte',
      'Zeitrahmen'
    ];

    const exportSession = () => {
      const content = `Skalenarbeit Session - ${new Date().toLocaleDateString()}\n\n` +
        `Ziel: ${scalingData.goal}\n` +
        `Aktueller Stand: ${scalingData.currentState}/10\n` +
        `Zielstand: ${scalingData.targetState}/10\n` +
        `Hindernisse: ${scalingData.obstacles}\n` +
        `Ressourcen: ${scalingData.resources}\n` +
        `Nächste Schritte: ${scalingData.nextSteps}\n` +
        `Zeitrahmen: ${scalingData.timeframe}`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skalenarbeit-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast("Session exportiert - Skalenarbeit-Session wurde als Datei gespeichert.");
    };

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>
            Skalenarbeit
          </h3>
          <p style={{ color: 'rgb(156, 163, 175)', margin: 0 }}>
            Schritt {currentStep + 1} von {steps.length}: {steps[currentStep]}
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              style={{
                minWidth: 'fit-content',
                padding: '0.5rem 1rem',
                background: index <= currentStep ? 'rgb(99, 102, 241)' : 'rgb(55, 65, 81)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {step}
            </button>
          ))}
        </div>

        <div style={{
          background: 'rgba(55, 65, 81, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          marginBottom: '2rem'
        }}>
          {currentStep === 0 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                Welches Ziel möchten Sie erreichen?
              </label>
              <textarea
                value={scalingData.goal}
                onChange={(e) => setScalingData(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="Beschreiben Sie Ihr Ziel..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <label style={{ display: 'block', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>
                Wo stehen Sie aktuell? (1 = sehr schlecht, 10 = perfekt)
              </label>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scalingData.currentState}
                  onChange={(e) => setScalingData(prev => ({ ...prev, currentState: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    marginBottom: '1rem',
                    accentColor: 'rgb(99, 102, 241)',
                    background: 'rgb(75, 85, 99)',
                    borderRadius: '8px',
                    height: '8px'
                  }}
                />
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'rgb(99, 102, 241)' }}>
                    {scalingData.currentState}/10
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <label style={{ display: 'block', marginBottom: '1rem', color: 'white', fontSize: '1rem' }}>
                Wo möchten Sie hin? (Zielstand)
              </label>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scalingData.targetState}
                  onChange={(e) => setScalingData(prev => ({ ...prev, targetState: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    marginBottom: '1rem',
                    accentColor: 'rgb(34, 197, 94)',
                    background: 'rgb(75, 85, 99)',
                    borderRadius: '8px',
                    height: '8px'
                  }}
                />
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'rgb(34, 197, 94)' }}>
                    {scalingData.targetState}/10
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                Was hindert Sie daran, weiterzukommen?
              </label>
              <textarea
                value={scalingData.obstacles}
                onChange={(e) => setScalingData(prev => ({ ...prev, obstacles: e.target.value }))}
                placeholder="Hindernisse, Herausforderungen..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                Welche Ressourcen stehen Ihnen zur Verfügung?
              </label>
              <textarea
                value={scalingData.resources}
                onChange={(e) => setScalingData(prev => ({ ...prev, resources: e.target.value }))}
                placeholder="Fähigkeiten, Unterstützung, Hilfsmittel..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                Was sind Ihre nächsten konkreten Schritte?
              </label>
              <textarea
                value={scalingData.nextSteps}
                onChange={(e) => setScalingData(prev => ({ ...prev, nextSteps: e.target.value }))}
                placeholder="Konkrete Aktionen und Maßnahmen..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  background: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '1rem' }}>
                In welchem Zeitrahmen möchten Sie Ihr Ziel erreichen?
              </label>
              <input
                type="text"
                value={scalingData.timeframe}
                onChange={(e) => setScalingData(prev => ({ ...prev, timeframe: e.target.value }))}
                placeholder="z.B. 3 Monate, 1 Jahr..."
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
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(55, 65, 81)',
                  color: 'white',
                  border: '1px solid rgb(75, 85, 99)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Zurück
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgb(99, 102, 241)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Weiter
              </button>
            )}
          </div>
          
          <button
            onClick={exportSession}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgb(34, 197, 94)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📁 Session exportieren
          </button>
        </div>
      </div>
    );
  };

  // Lebensrad Tool Component
  const LifeWheelTool = () => {
    const [values, setValues] = useState({
      career: 5,
      finances: 5,
      health: 5,
      relationships: 5,
      personal: 5,
      fun: 5,
      environment: 5,
      contribution: 5
    });

    const areas = [
      { key: 'career', label: 'Beruf/Karriere', color: '#ef4444' },
      { key: 'finances', label: 'Finanzen', color: '#f97316' },
      { key: 'health', label: 'Gesundheit', color: '#eab308' },
      { key: 'relationships', label: 'Beziehungen', color: '#22c55e' },
      { key: 'personal', label: 'Persönl. Entwicklung', color: '#06b6d4' },
      { key: 'fun', label: 'Spaß/Freizeit', color: '#3b82f6' },
      { key: 'environment', label: 'Umfeld', color: '#8b5cf6' },
      { key: 'contribution', label: 'Beitrag/Sinn', color: '#ec4899' }
    ];

    const getCoordinates = (index, value, total = 8) => {
      const angle = (index * 360) / total - 90;
      const radian = (angle * Math.PI) / 180;
      const radius = (value / 10) * 80;
      return {
        x: 100 + radius * Math.cos(radian),
        y: 100 + radius * Math.sin(radian)
      };
    };

    const getBalance = () => {
      const vals = Object.values(values);
      const avg = vals.reduce((sum, val) => sum + val, 0) / areas.length;
      const variance = vals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / areas.length;
      return Math.max(0, 10 - Math.sqrt(variance));
    };

    const exportSession = () => {
      const content = `Lebensrad Session - ${new Date().toLocaleDateString()}\n\n` +
        areas.map(area => `${area.label}: ${values[area.key]}/10`).join('\n') +
        `\n\nBalance-Score: ${getBalance().toFixed(1)}/10\n\n` +
        `Interpretation:\n` +
        `- Bereiche über 7: Stark entwickelt\n` +
        `- Bereiche 4-7: Entwicklungspotential\n` +
        `- Bereiche unter 4: Prioritäre Aufmerksamkeit nötig`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lebensrad-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast("Session exportiert - Das Lebensrad wurde als Datei gespeichert.");
    };

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>
            Lebensrad
          </h3>
          <p style={{ color: 'rgb(156, 163, 175)', margin: 0 }}>
            Bewerten Sie Ihre Zufriedenheit in verschiedenen Lebensbereichen
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Visualization */}
          <div style={{
            background: 'rgba(55, 65, 81, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <svg width="240" height="240" viewBox="0 0 200 200" style={{ border: '1px solid rgb(75, 85, 99)', borderRadius: '8px', background: 'rgba(31, 41, 55, 0.5)' }}>
                {/* Grid circles */}
                {[2, 4, 6, 8, 10].map(ring => (
                  <circle
                    key={ring}
                    cx="100"
                    cy="100"
                    r={ring * 8}
                    fill="none"
                    stroke="rgb(71, 85, 105)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Grid lines */}
                {areas.map((_, index) => {
                  const coords = getCoordinates(index, 10);
                  return (
                    <line
                      key={index}
                      x1="100"
                      y1="100"
                      x2={coords.x}
                      y2={coords.y}
                      stroke="rgb(71, 85, 105)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Value polygon */}
                <polygon
                  points={areas.map((area, index) => {
                    const coords = getCoordinates(index, values[area.key]);
                    return `${coords.x},${coords.y}`;
                  }).join(' ')}
                  fill="rgba(59, 130, 246, 0.3)"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="2"
                />

                {/* Value points */}
                {areas.map((area, index) => {
                  const coords = getCoordinates(index, values[area.key]);
                  return (
                    <circle
                      key={area.key}
                      cx={coords.x}
                      cy={coords.y}
                      r="4"
                      fill={area.color}
                    />
                  );
                })}

                {/* Labels */}
                {areas.map((area, index) => {
                  const coords = getCoordinates(index, 12);
                  return (
                    <text
                      key={area.key}
                      x={coords.x}
                      y={coords.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="8"
                      style={{ userSelect: 'none' }}
                    >
                      {area.label}
                    </text>
                  );
                })}
              </svg>

              <div style={{
                width: '100%',
                background: 'rgba(31, 41, 55, 0.5)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', color: 'rgb(156, 163, 175)', marginBottom: '0.5rem' }}>
                  Balance-Score
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'rgb(34, 197, 94)' }}>
                  {getBalance().toFixed(1)}/10
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{
            background: 'rgba(55, 65, 81, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <h4 style={{ color: 'white', margin: '0 0 1.5rem 0' }}>Lebensbereiche bewerten</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {areas.map(area => (
                <div key={area.key}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <label style={{ color: 'rgb(203, 213, 225)' }}>
                      {area.label}
                    </label>
                    <span 
                      style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: 'bold',
                        color: area.color
                      }}
                    >
                      {values[area.key]}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={values[area.key]}
                    onChange={(e) => setValues(prev => ({ 
                      ...prev, 
                      [area.key]: parseInt(e.target.value) 
                    }))}
                    style={{
                      width: '100%',
                      accentColor: area.color,
                      background: 'rgb(75, 85, 99)',
                      borderRadius: '8px',
                      height: '6px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button
            onClick={exportSession}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgb(34, 197, 94)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📁 Session exportieren
          </button>
        </div>
      </div>
    );
  };

  const renderToolContent = () => {
    if (!selectedTool) return null;

    switch (selectedTool.id) {
      case 'scaling':
        return <ScalingTool />;
      case 'lifewheel':
        return <LifeWheelTool />;
      case 'grow':
        return <GrowTool />;
      case 'values':
        return <ValuesSquareTool />;
      case 'team':
        return <InnerTeamTool />;
      default:
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
              Dieses Tool ist noch in Entwicklung.
            </p>
            <span style={{
              padding: '4px 12px',
              background: 'rgba(251, 191, 36, 0.2)',
              color: 'rgb(251, 191, 36)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '12px',
              fontSize: '0.875rem'
            }}>
              Bald verfügbar
            </span>
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
          <button style={{
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
          }}>
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
                cursor: 'pointer'
              }}
            >
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
                  background: 'rgba(147, 51, 234, 0.2)',
                  color: 'rgb(147, 51, 234)',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
                  Interaktiv
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'rgb(156, 163, 175)'
              }}>
                <span>Sofort verwendbar</span>
                <span>Mit Export</span>
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
            maxWidth: '90vw', 
            width: '100%', 
            maxHeight: '90vh',
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