import React, { useState, useEffect, useRef } from 'react';
import { Clock, User, Bot, Save, RotateCcw, Share2, Settings, BookOpen, AlertTriangle, CheckCircle, Circle, Play, Pause, MessageSquare, FileText, ChevronRight, ChevronLeft, ChevronDown, Search, Edit3, Trash2, Plus, Upload, Download } from 'lucide-react';

const OptimizedKIModule = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [coachInput, setCoachInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedCoachee, setSelectedCoachee] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKiModel, setSelectedKiModel] = useState('personal');
  const [apiKey, setApiKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [sortOrder, setSortOrder] = useState('Titel (A-Z)');
  const [showResetWarning, setShowResetWarning] = useState(false);
  const [showCoacheeDropdown, setShowCoacheeDropdown] = useState(false);
  const [showKiDropdown, setShowKiDropdown] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(true);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const timerRef = useRef(null);

  const phases = [
    { id: 1, name: 'Problem- & Zielbeschreibung', steps: [1, 2, 3, 4], color: 'bg-blue-600' },
    { id: 2, name: 'Problemanalyse', steps: [5, 6, 7], color: 'bg-green-600' },
    { id: 3, name: 'Lösungsstrategie entwickeln', steps: [8, 9, 10], color: 'bg-yellow-600' },
    { id: 4, name: 'Umsetzungsunterstützung', steps: [11, 12], color: 'bg-purple-600' }
  ];

  const steps = [
    { 
      id: 1, 
      title: 'Einleitung und erste Problem-/Zielbeschreibung', 
      description: 'Rapport aufbauen und initiale Problemschilderung',
      instruction: 'Begrüßen Sie den Coachee, erklären Sie das triadische KI-Coaching und lassen Sie ihn sein Problem kompakt formulieren ("Ich habe folgendes Problem: ..."). Geben Sie dies als ersten Prompt an die KI weiter.',
      phase: 1
    },
    { 
      id: 2, 
      title: 'Erweiterte Problem- und Zielbeschreibung', 
      description: 'Vertiefung von Ist- und Soll-Zustand',
      instruction: 'Erfragen Sie zusätzliche Details zur Situation. Lassen Sie die KI einen strukturierten Bericht in Ich-Form erstellen, der Ist-Situation vs. angestrebte Situation gegenüberstellt (Rahmenbedingungen, innere Prozesse, Verhalten, Konsequenzen).',
      phase: 1
    },
    { 
      id: 3, 
      title: 'Immersive Bildarbeit zur Zielklärung', 
      description: 'Bildgestützte Metaphernarbeit für emotionale Vertiefung',
      instruction: 'Lassen Sie den Coachee aus vorbereiteten Bildern eines auswählen, das intuitiv sein Ziel symbolisiert. Er beschreibt das Bild detailliert. Die KI analysiert dann die Beziehung zwischen Bildbeschreibung und Coaching-Ziel.',
      hasImages: true,
      phase: 1
    },
    { 
      id: 4, 
      title: 'Überprüfung auf fehlende Informationen', 
      description: 'Ausbalancierungsproblem identifizieren',
      instruction: 'Die KI identifiziert anhand aller Informationen das wahrscheinlichste Ausbalancierungsproblem (innerer Konflikt zwischen zwei Polen) und schlägt Fragen vor, um diese Annahme zu bestätigen.',
      phase: 1
    },
    { 
      id: 5, 
      title: 'Schlüsselsituation und Schlüsselaffekt identifizieren', 
      description: 'Typische Problemsituation und emotionale Reaktion bestimmen',
      instruction: 'Identifizieren Sie gemeinsam die Schlüsselsituation (wo das Problem am stärksten auftritt) und den Schlüsselaffekt (spontane innere Gefühlsreaktion). Nutzen Sie Beispielformulierungen als Auswahlhilfe.',
      phase: 2
    },
    { 
      id: 6, 
      title: 'Tiefenpsychologisches Interview mit Avataren', 
      description: 'Inneres Team aufstellen und befragen',
      instruction: 'Stellen Sie Avatare für die inneren Anteile auf (Teamchefin, Unterstützerin, Bremse). Führen Sie ein Interview mit jedem Anteil, um ihre Motive und Ängste zu verstehen. Die "Bremse" äußert ihre Bedenken gegen das Ziel.',
      hasAvatars: true,
      phase: 2
    },
    { 
      id: 7, 
      title: 'KI-Analyse der Persönlichkeitsanteile und Ursachen', 
      description: 'Systematische Auswertung der inneren Widerstände',
      instruction: 'Die KI analysiert das Avatar-Interview in drei Teilen: (a) weitere Gegenargumente der Bremse, (b) Ranking der relevanten Ausbalancierungsdimensionen, (c) Ursachenmodell der Problemdynamik.',
      phase: 2
    },
    { 
      id: 8, 
      title: 'Übergeordnetes Lern- und Entwicklungsziel formulieren', 
      description: 'Das "Thema hinter dem Thema" definieren',
      instruction: 'Formulieren Sie gemeinsam ein übergeordnetes Entwicklungsziel, das über das konkrete Problem hinausgeht. Die KI kann Vorschläge machen, die dann gemeinsam zu einem motivierenden Zielsatz verfeinert werden.',
      phase: 3
    },
    { 
      id: 9, 
      title: 'Antizipieren von Umsetzungswiderständen', 
      description: 'Innere Widerstände gegen Veränderung aufstellen',
      instruction: 'Stellen Sie Avatare für die alten Gewohnheiten auf (Perfektionismus, Anerkennungsstreben, Zurückhaltung). Jeder Anteil äußert seine Bedenken gegen das "Kleinerwerden" zugunsten neuer Verhaltensweisen.',
      hasAvatars: true,
      phase: 3
    },
    { 
      id: 10, 
      title: 'KI-Analyse der Umsetzungswiderstände', 
      description: 'Glaubenssätze und Regeln der Widerstandsanteile',
      instruction: 'Die KI rekonstruiert aus den Äußerungen der Widerstandsanteile deren zugrundeliegende Glaubenssätze und Realitätswahrnehmung. Diese "Regel-Liste" zeigt, welche inneren Überzeugungen transformiert werden müssen.',
      phase: 3
    },
    { 
      id: 11, 
      title: 'Erfolgsimagination entwickeln', 
      description: 'Neues Erleben des Erfolgs mental vorwegnehmen',
      instruction: 'Die KI erstellt eine detaillierte Erfolgsimagination in Ich-Form: wie der Coachee die ehemalige Problemsituation mit seinen neuen Fähigkeiten erfolgreich meistert. Lassen Sie den Text vorlesen für maximale emotionale Wirkung.',
      phase: 4
    },
    { 
      id: 12, 
      title: 'Umsetzungsunterstützung (Transfer in den Alltag)', 
      description: 'Konkreter Projektplan für nachhaltige Veränderung',
      instruction: 'Die KI erstellt einen Projektplan mit praktischen Maßnahmen, Routinen und Meilensteinen. Vereinbaren Sie konkrete Sofortmaßnahmen und regelmäßiges Üben der Erfolgsimagination.',
      phase: 4
    }
  ];

  const promptLibrary = [
    {
      id: 1,
      title: 'Coaching Solution Finder',
      category: 'Problem-/Zielbeschreibung',
      step: 1,
      preview: 'Ich habe folgendes Problem: [Problemschilderung]...',
      fullPrompt: 'Ich habe folgendes Problem: [Hier die kompakte Problemformulierung des Coachees einfügen]. Bitte gib mir ein ressourcenorientiertes Feedback - paraphrasiere das Problem, normalisiere es und hebe bereits erste Stärken oder positive Ansätze hervor.'
    },
    {
      id: 2,
      title: 'Strukturierter Bericht Ist/Soll',
      category: 'Problem-/Zielbeschreibung',
      step: 2,
      preview: 'Aufgrund deiner Anregungen hier noch ein paar weitere Informationen...',
      fullPrompt: 'Aufgrund deiner Anregungen hier noch ein paar weitere Informationen: [Zusätzliche Details einfügen]. Erstelle einen in Ich-Form geschriebenen Bericht, in dem alle bisher vorliegenden Informationen zusammengefasst sind. Unterteile in Ist- und Soll-Situation und gehe auf Rahmenbedingungen, innere Prozesse, Verhalten und Konsequenzen ein.'
    },
    {
      id: 3,
      title: 'Bild-Ziel-Analyse',
      category: 'Visualisierung',
      step: 3,
      preview: 'In welcher Beziehung steht die Beschreibung dieses Bildes...',
      fullPrompt: 'Hier ist die Beschreibung des gewählten Bildes: [Bildbeschreibung des Coachees einfügen]. In welcher Beziehung steht die Beschreibung dieses Bildes zu der Beschreibung meines Coaching-Ziels? Analysiere die Parallelen und Metaphern.'
    },
    {
      id: 4,
      title: 'Ausbalancierungsproblem identifizieren',
      category: 'Analyse',
      step: 4,
      preview: 'Identifiziere mithilfe des Textbausteins Ausbalancierungsprobleme...',
      fullPrompt: 'Identifiziere mithilfe des Textbausteins "Ausbalancierungsprobleme" das Ausbalancierungsproblem, das auf Grundlage der vorliegenden Informationen am deutlichsten erkennbar ist. Welche Fragen müsste ich beantworten, um sicherer zu klären, ob es sich tatsächlich um dieses Ausbalancierungsproblem handelt?'
    },
    {
      id: 5,
      title: 'Schlüsselsituation definieren',
      category: 'Problemanalyse',
      step: 5,
      preview: 'Wann tritt dein Problem besonders stark auf...',
      fullPrompt: 'Basierend auf unseren bisherigen Erkenntnissen: In welchen konkreten Momenten tritt dein Problem besonders stark auf? Beschreibe die typische Schlüsselsituation und den spontanen inneren Gefühlszustand (Schlüsselaffekt), der dabei entsteht.'
    },
    {
      id: 6,
      title: 'Innere Bremse analysieren',
      category: 'Inneres Team',
      step: 7,
      preview: 'Versetze dich bitte in die Rolle der Bremse...',
      fullPrompt: 'Versetze dich bitte in die Rolle der "Bremse", die im obigen Avatar-Interview spricht. Nenne weitere Argumente, die gegen mein Coaching-Ziel sprechen könnten. Lass dich dabei von den Textbausteinen über Ausbalancierungsprobleme inspirieren.'
    },
    {
      id: 7,
      title: 'Ausbalancierungsdimensionen Ranking',
      category: 'Analyse',
      step: 7,
      preview: 'Analysiere das obige Transkript mit Hilfe des Textbausteins...',
      fullPrompt: 'Analysiere das obige Transkript sowie alle vorliegenden Informationen zu meiner Coaching-Problematik mit Hilfe des Textbausteins "Ausbalancierungsprobleme". Erstelle ein Ranking: Welche dieser 18 inneren Konfliktdimensionen sind bei meinem Schlüsselaffekt am relevantesten? (Platz 1 = größter Einfluss, Platz 18 = geringster)'
    },
    {
      id: 8,
      title: 'Ursachenmodell entwickeln',
      category: 'Analyse',
      step: 7,
      preview: 'Gehe von dieser Rangliste aus und erkläre...',
      fullPrompt: 'Gehe von dieser Rangliste bzw. den identifizierten Top-Dimensionen aus und erkläre, wie die Probleme, die hinter diesen Ausbalancierungsdimensionen stecken, ursächlich zusammenhängen. Beschreibe das Gesamtgefüge der Ursachen meiner Problematik.'
    },
    {
      id: 9,
      title: 'Entwicklungsziel formulieren',
      category: 'Zielfindung',
      step: 8,
      preview: 'Formuliere auf Basis der bisherigen Erkenntnisse...',
      fullPrompt: 'Formuliere auf Basis der bisherigen Erkenntnisse ein übergeordnetes Lern- und Entwicklungsziel für mich. Es soll das "Thema hinter dem Thema" ansprechen und eine nachhaltige Veränderung beschreiben, die über das konkrete Problem hinausgeht.'
    },
    {
      id: 10,
      title: 'Glaubenssätze analysieren',
      category: 'Analyse',
      step: 10,
      preview: 'Analysiere die Äußerungen im obigen Transkript...',
      fullPrompt: 'Analysiere die Äußerungen im obigen Transkript der Widerstandsanteile. Rekonstruiere daraus die zugrundeliegenden Regeln, nach denen diese Anteile die Realität wahrnehmen, Entscheidungen treffen und handeln. Welche Glaubenssätze oder inneren Prinzipien werden deutlich?'
    },
    {
      id: 11,
      title: 'Erfolgsimagination erstellen',
      category: 'Imagination',
      step: 11,
      preview: 'Beschreibe in Ich-Form eine persönliche Erlebniserzählung...',
      fullPrompt: 'Beschreibe in Ich-Form eine persönliche Erlebniserzählung, die als Erfolgsimagination dient. Sie soll beginnen mit meiner unveränderten Schlüsselsituation, dann aber darstellen, wie ich - nachdem ich mich positiv verändert habe - diese Situation ganz anders erlebe und meistere. Beziehe dich auf die komplementären Eigenschaften meiner bisherigen Probleme und die Bildmetapher meines Ziels. Mach es sehr anschaulich, als würde es in einem Film geschehen.'
    },
    {
      id: 12,
      title: 'Projektplan erstellen',
      category: 'Umsetzung',
      step: 12,
      preview: 'Erstelle einen Projektplan mit praktischen Maßnahmen...',
      fullPrompt: 'Erstelle einen Projektplan mit praktischen Maßnahmen, damit ich mein übergeordnetes Entwicklungsziel erreiche und die Erfolgsimagination Realität wird. Schlage konkrete Aktivitäten, Gewohnheiten und Meilensteine vor, die zur Umsetzung führen.'
    }
  ];

  // Filter prompts instantly as user types
  const filteredPrompts = promptLibrary.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortOrder === 'Titel (A-Z)') return a.title.localeCompare(b.title);
    if (sortOrder === 'Titel (Z-A)') return b.title.localeCompare(a.title);
    if (sortOrder === 'Kategorie') return a.category.localeCompare(b.category);
    return 0;
  });

  const categories = ['Alle', ...new Set(promptLibrary.map(p => p.category))];

  const kiModels = [
    { id: 'personal', name: 'Persönlicher Assistent (Test)', requiresKey: true },
    { id: 'gpt4', name: 'OpenAI: GPT-4', requiresKey: true },
    { id: 'claude', name: 'Claude: Sonnet', requiresKey: true }
  ];

  const coachees = [
    { id: 1, name: 'Anna M.', status: 'aktiv' },
    { id: 2, name: 'Thomas K.', status: 'aktiv' },
    { id: 3, name: 'Sarah L.', status: 'wartend' }
  ];

  useEffect(() => {
    if (isSessionActive) {
      timerRef.current = setInterval(() => {
        setSessionDuration(Date.now() - sessionStartTime);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isSessionActive, sessionStartTime]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && (coachInput || aiResponse || sessionNotes)) {
      const saveData = {
        currentStep,
        currentPhase,
        coachInput,
        aiResponse,
        sessionNotes,
        selectedCoachee,
        timestamp: Date.now()
      };
      localStorage.setItem('ki-session-autosave', JSON.stringify(saveData));
    }
  }, [coachInput, aiResponse, sessionNotes, currentStep, autoSave]);

  const getCurrentPhase = () => {
    return phases.find(phase => phase.steps.includes(currentStep));
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleSession = () => {
    if (!isSessionActive) {
      setSessionStartTime(Date.now());
    }
    setIsSessionActive(!isSessionActive);
  };

  const handleAiRequest = async () => {
    if (!coachInput.trim()) return;
    
    setIsLoading(true);
    
    // Broadcast coach input to coachee display first
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('ki-coaching');
      channel.postMessage({
        type: 'coach_input',
        data: {
          step: currentStep,
          phase: getCurrentPhase()?.name,
          input: coachInput,
          timestamp: Date.now()
        }
      });
    }
    
    try {
      let response;
      const currentStepData = steps.find(s => s.id === currentStep);
      
      if (selectedKiModel === 'personal') {
        // Your personal assistant API
        const apiResponse = await fetch('/api/personal-assistant', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            prompt: selectedPrompt || coachInput,
            context: {
              step: currentStep,
              stepTitle: currentStepData?.title,
              stepInstruction: currentStepData?.instruction,
              phase: getCurrentPhase()?.name,
              coachee: selectedCoachee,
              sessionNotes: sessionNotes
            }
          })
        });
        
        if (!apiResponse.ok) throw new Error('API Error');
        const data = await apiResponse.json();
        response = data.response;
        
      } else if (selectedKiModel === 'gpt4') {
        // OpenAI API
        const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              { role: 'system', content: `Du bist ein KI-Coaching-Assistent. Aktueller Schritt: ${currentStepData?.title}. ${currentStepData?.instruction}` },
              { role: 'user', content: selectedPrompt || coachInput }
            ],
            max_tokens: 500
          })
        });
        
        if (!apiResponse.ok) throw new Error('OpenAI API Error');
        const data = await apiResponse.json();
        response = data.choices[0].message.content;
        
      } else if (selectedKiModel === 'claude') {
        // Claude API
        const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 500,
            messages: [
              { 
                role: 'user', 
                content: `Als KI-Coaching-Assistent für Schritt ${currentStep}: ${currentStepData?.title}\n\nAnweisung: ${currentStepData?.instruction}\n\nCoach-Eingabe: ${selectedPrompt || coachInput}`
              }
            ]
          })
        });
        
        if (!apiResponse.ok) throw new Error('Claude API Error');
        const data = await apiResponse.json();
        response = data.content[0].text;
      }
      
      setAiResponse(response);
      setIsLoading(false);
      
      // Broadcast AI response to coachee display
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('ki-coaching');
        channel.postMessage({
          type: 'ai_response',
          data: {
            step: currentStep,
            phase: getCurrentPhase()?.name,
            response: response,
            timestamp: Date.now()
          }
        });
      }
      
    } catch (error) {
      console.error('API Error:', error);
      setAiResponse(`Fehler bei der KI-Anfrage: ${error.message}\n\nBitte überprüfen Sie:\n- API-Schlüssel korrekt eingegeben\n- Internetverbindung\n- API-Guthaben verfügbar`);
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    if (showResetWarning) {
      setCurrentStep(1);
      setCurrentPhase(1);
      setCoachInput('');
      setAiResponse('');
      setSessionNotes('');
      setSessionDuration(0);
      setIsSessionActive(false);
      setShowResetWarning(false);
      localStorage.removeItem('ki-session-autosave');
    } else {
      setShowResetWarning(true);
      setTimeout(() => setShowResetWarning(false), 5000);
    }
  };

  const shareToCoachee = () => {
    // Broadcast session start
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('ki-coaching');
      channel.postMessage({
        type: 'session_start',
        data: {
          coachee: selectedCoachee,
          step: currentStep,
          phase: getCurrentPhase()?.name,
          prompt: coachInput,
          timestamp: Date.now()
        }
      });
    }
    
    // Create simple HTML without complex React/JSX
    const coacheeHTML = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coachee Display - Geteilter KI-Dialog</title>
    <style>
        body { 
            margin: 0; 
            background: #111827; 
            color: white; 
            font-family: system-ui, -apple-system, sans-serif; 
            overflow-x: hidden;
        }
        .header { 
            background: #1f2937; 
            border-bottom: 1px solid #374151; 
            padding: 1.5rem; 
        }
        .title { 
            font-size: 1.25rem; 
            font-weight: 600; 
            display: flex; 
            align-items: center; 
            gap: 0.5rem; 
        }
        .pulse { 
            width: 12px; 
            height: 12px; 
            background: #4ade80; 
            border-radius: 50%; 
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; 
        }
        @keyframes pulse { 
            0%, 100% { opacity: 1; } 
            50% { opacity: .5; } 
        }
        .subtitle { 
            font-size: 0.875rem; 
            color: #9ca3af; 
            margin-top: 0.25rem; 
        }
        .progress-section { 
            margin-top: 1rem; 
        }
        .progress-info { 
            display: flex; 
            justify-content: space-between; 
            font-size: 0.875rem; 
            margin-bottom: 0.5rem; 
        }
        .progress-bar { 
            width: 100%; 
            background: #374151; 
            border-radius: 9999px; 
            height: 8px; 
        }
        .progress-fill { 
            height: 8px; 
            border-radius: 9999px; 
            background: #3b82f6; 
            transition: width 0.3s ease; 
        }
        .content { 
            padding: 1.5rem; 
        }
        .status-box { 
            background: rgba(30, 58, 138, 0.2); 
            border: 1px solid #1d4ed8; 
            border-radius: 0.5rem; 
            padding: 1rem; 
            display: flex; 
            align-items: center; 
            gap: 0.75rem; 
            margin-bottom: 1.5rem; 
        }
        .status-pulse { 
            width: 8px; 
            height: 8px; 
            background: #60a5fa; 
            border-radius: 50%; 
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; 
        }
        .status-title { 
            font-weight: 500; 
            color: #93c5fd; 
        }
        .status-desc { 
            font-size: 0.875rem; 
            color: #60a5fa; 
            margin-top: 0.25rem; 
        }
        .prompt-box { 
            background: #1f2937; 
            border: 1px solid #4b5563; 
            border-radius: 0.5rem; 
            padding: 1rem; 
            margin-bottom: 1.5rem; 
        }
        .prompt-header { 
            display: flex; 
            align-items: center; 
            gap: 0.5rem; 
            margin-bottom: 0.75rem; 
        }
        .prompt-title { 
            font-weight: 600; 
            color: #93c5fd; 
        }
        .prompt-content { 
            background: #374151; 
            border-radius: 0.5rem; 
            padding: 0.75rem; 
            font-size: 0.875rem; 
            color: #d1d5db; 
            white-space: pre-wrap; 
            border-left: 4px solid #60a5fa; 
        }
        .prompt-hint { 
            font-size: 0.75rem; 
            color: #9ca3af; 
            margin-top: 0.5rem; 
        }
        .message-box { 
            background: #1f2937; 
            border-radius: 0.5rem; 
            padding: 1rem; 
            margin-bottom: 1rem; 
        }
        .message-header { 
            display: flex; 
            align-items: center; 
            gap: 0.75rem; 
            margin-bottom: 0.5rem; 
        }
        .message-avatar { 
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 14px; 
        }
        .coach-avatar { 
            background: #2563eb; 
        }
        .ai-avatar { 
            background: #059669; 
        }
        .message-content { 
            font-size: 0.875rem; 
            color: #d1d5db; 
            white-space: pre-wrap; 
        }
        .footer { 
            position: fixed; 
            bottom: 0; 
            left: 0; 
            right: 0; 
            background: #1f2937; 
            border-top: 1px solid #374151; 
            padding: 0.75rem 1.5rem; 
            display: flex; 
            justify-content: space-between; 
            font-size: 0.875rem; 
            color: #9ca3af; 
        }
        .connection-status { 
            display: flex; 
            align-items: center; 
            gap: 0.5rem; 
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="title">
            <div class="pulse"></div>
            Geteilter KI-Dialog
        </div>
        <div class="subtitle">Ansicht für den Coachee</div>
        
        <div class="progress-section">
            <div class="progress-info">
                <span id="step-info">Schritt 1: Einleitung und erste Problem-/Zielbeschreibung</span>
                <span id="step-count">1/12</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" id="progress" style="width: 8.33%;"></div>
            </div>
            <div style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem;">
                Phase: <span id="phase-name">Problem- & Zielbeschreibung</span>
            </div>
        </div>
    </div>

    <!-- Content -->
    <div class="content" style="padding-bottom: 60px;">
        <!-- Status -->
        <div class="status-box" id="status-box">
            <div class="status-pulse"></div>
            <div>
                <div class="status-title" id="status-title">Wartet auf Eingabe vom Coach...</div>
                <div class="status-desc" id="status-desc">Der Coach bereitet den nächsten Schritt vor</div>
            </div>
        </div>

        <!-- Current Prompt -->
        <div class="prompt-box" id="prompt-box" style="display: none;">
            <div class="prompt-header">
                <span>👤</span>
                <div class="prompt-title">Aktueller Prompt (gemeinsam bearbeiten)</div>
            </div>
            <div class="prompt-content" id="prompt-content"></div>
            <div class="prompt-hint">💡 Besprechen Sie mit Ihrem Coach, wie die Platzhalter [...] ausgefüllt werden sollen</div>
        </div>

        <!-- Messages -->
        <div id="messages"></div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div>Triadisches KI-Coaching • Coach + Coachee + KI</div>
        <div class="connection-status">
            <span>✅</span>
            <span>Verbunden</span>
        </div>
    </div>

    <script>
        // State
        let currentStep = ${currentStep};
        let currentPhase = '${getCurrentPhase()?.name}';
        let currentPrompt = '${coachInput?.replace(/'/g, "\\'")}';
        let messages = [];
        
        const steps = [
            { id: 1, title: 'Einleitung und erste Problem-/Zielbeschreibung' },
            { id: 2, title: 'Erweiterte Problem- und Zielbeschreibung' },
            { id: 3, title: 'Immersive Bildarbeit zur Zielklärung' },
            { id: 4, title: 'Überprüfung auf fehlende Informationen' },
            { id: 5, title: 'Schlüsselsituation und Schlüsselaffekt identifizieren' },
            { id: 6, title: 'Tiefenpsychologisches Interview mit Avataren' },
            { id: 7, title: 'KI-Analyse der Persönlichkeitsanteile und Ursachen' },
            { id: 8, title: 'Übergeordnetes Lern- und Entwicklungsziel formulieren' },
            { id: 9, title: 'Antizipieren von Umsetzungswiderständen' },
            { id: 10, title: 'KI-Analyse der Umsetzungswiderstände' },
            { id: 11, title: 'Erfolgsimagination entwickeln' },
            { id: 12, title: 'Umsetzungsunterstützung (Transfer in den Alltag)' }
        ];

        // DOM Elements
        const statusBox = document.getElementById('status-box');
        const statusTitle = document.getElementById('status-title');
        const statusDesc = document.getElementById('status-desc');
        const promptBox = document.getElementById('prompt-box');
        const promptContent = document.getElementById('prompt-content');
        const messagesContainer = document.getElementById('messages');
        const stepInfo = document.getElementById('step-info');
        const stepCount = document.getElementById('step-count');
        const progress = document.getElementById('progress');
        const phaseName = document.getElementById('phase-name');

        // Update UI functions
        function updateStep(step, phase) {
            currentStep = step;
            currentPhase = phase;
            const stepData = steps.find(s => s.id === step);
            
            stepInfo.textContent = 'Schritt ' + step + ': ' + (stepData ? stepData.title : '');
            stepCount.textContent = step + '/12';
            progress.style.width = ((step / 12) * 100) + '%';
            phaseName.textContent = phase;
            
            console.log('Updated step to:', step, phase);
        }

        function showPrompt(prompt) {
            currentPrompt = prompt;
            promptContent.textContent = prompt;
            promptBox.style.display = 'block';
            
            statusTitle.textContent = 'Prompt wird gemeinsam bearbeitet';
            statusDesc.textContent = 'Besprechen Sie die Inhalte mit Ihrem Coach';
            
            console.log('Showing prompt:', prompt.substring(0, 50) + '...');
        }

        function addMessage(type, content, timestamp, step) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message-box';
            
            const avatar = type === 'coach' ? 
                '<div class="message-avatar coach-avatar">👤</div>' :
                '<div class="message-avatar ai-avatar">🤖</div>';
            
            const time = new Date(timestamp).toLocaleTimeString();
            
            messageDiv.innerHTML = 
                '<div class="message-header">' + avatar +
                '<div>' +
                '<div style="font-weight: 500;">' + (type === 'coach' ? 'Coach' : 'KI-Assistent') + '</div>' +
                '<div style="font-size: 0.75rem; color: #9ca3af;">' + time + 
                (step ? ' • Schritt ' + step : '') + '</div>' +
                '</div></div>' +
                '<div class="message-content">' + content + '</div>';
            
            messagesContainer.appendChild(messageDiv);
            messageDiv.scrollIntoView({ behavior: 'smooth' });
            
            console.log('Added message:', type, content.substring(0, 50) + '...');
        }

        // BroadcastChannel listener
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('ki-coaching');
            
            channel.onmessage = function(event) {
                const { type, data } = event.data;
                console.log('Received broadcast:', type, data);
                
                switch (type) {
                    case 'session_start':
                        updateStep(data.step, data.phase);
                        if (data.prompt) {
                            showPrompt(data.prompt);
                        }
                        break;
                        
                    case 'prompt_loaded':
                        showPrompt(data.prompt);
                        updateStep(data.step, data.phase || currentPhase);
                        break;
                        
                    case 'coach_input':
                        addMessage('coach', data.input, data.timestamp, data.step);
                        statusTitle.textContent = 'KI analysiert...';
                        statusDesc.textContent = 'Die KI verarbeitet die Eingaben';
                        break;
                        
                    case 'ai_response':
                        addMessage('ai', data.response, data.timestamp, data.step);
                        statusTitle.textContent = 'Wartet auf nächste Eingabe...';
                        statusDesc.textContent = 'Der Coach bereitet den nächsten Schritt vor';
                        break;
                        
                    case 'step_change':
                        updateStep(data.step, data.phase);
                        break;
                }
            };
            
            console.log('BroadcastChannel initialized');
        }

        // Initialize with current prompt if available
        if (currentPrompt) {
            showPrompt(currentPrompt);
        }
        
        console.log('Coachee Display loaded');
    </script>
</body>
</html>`;
    
    // Open new window
    const coacheeWindow = window.open('', 'coachee-display', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    if (coacheeWindow) {
      coacheeWindow.document.write(coacheeHTML);
      coacheeWindow.document.close();
      coacheeWindow.focus();
      
      // Send initial prompt after window loads
      setTimeout(() => {
        if (typeof BroadcastChannel !== 'undefined') {
          const channel = new BroadcastChannel('ki-coaching');
          channel.postMessage({
            type: 'prompt_loaded',
            data: {
              prompt: coachInput,
              step: currentStep,
              phase: getCurrentPhase()?.name,
              timestamp: Date.now()
            }
          });
        }
      }, 500);
      
    } else {
      alert('Popup wurde blockiert. Bitte erlauben Sie Popups für diese Seite.');
    }
  };

  // Auto-load appropriate prompt for current step and broadcast immediately
  useEffect(() => {
    const stepPrompt = promptLibrary.find(p => p.step === currentStep);
    if (stepPrompt && !coachInput) {
      setCoachInput(stepPrompt.fullPrompt);
      setSelectedPrompt(stepPrompt.fullPrompt);
    }
  }, [currentStep]);

  // Send prompt immediately when coachee joins
  useEffect(() => {
    if (coachInput && typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('ki-coaching');
      // Add a small delay to ensure coachee display is ready
      setTimeout(() => {
        channel.postMessage({
          type: 'prompt_loaded',
          data: {
            prompt: coachInput,
            step: currentStep,
            stepTitle: steps.find(s => s.id === currentStep)?.title,
            timestamp: Date.now()
          }
        });
      }, 500);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < 12) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      const newPhase = phases.find(phase => phase.steps.includes(newStep));
      if (newPhase) setCurrentPhase(newPhase.id);
      
      // Broadcast step change to coachee
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('ki-coaching');
        channel.postMessage({
          type: 'step_change',
          data: {
            step: newStep,
            phase: newPhase?.name,
            timestamp: Date.now()
          }
        });
      }
      
      // Auto-load prompt for new step
      const stepPrompt = promptLibrary.find(p => p.step === newStep);
      if (stepPrompt) {
        setCoachInput(stepPrompt.fullPrompt);
        setSelectedPrompt(stepPrompt.fullPrompt);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      const newPhase = phases.find(phase => phase.steps.includes(newStep));
      if (newPhase) setCurrentPhase(newPhase.id);
      
      // Broadcast step change to coachee
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('ki-coaching');
        channel.postMessage({
          type: 'step_change',
          data: {
            step: newStep,
            phase: newPhase?.name,
            timestamp: Date.now()
          }
        });
      }
      
      // Auto-load prompt for new step
      const stepPrompt = promptLibrary.find(p => p.step === newStep);
      if (stepPrompt) {
        setCoachInput(stepPrompt.fullPrompt);
        setSelectedPrompt(stepPrompt.fullPrompt);
      }
    }
  };

  const currentPhaseData = getCurrentPhase();
  const currentStepData = steps.find(s => s.id === currentStep);
  const progress = (currentStep / 12) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header mit Session-Info */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold">Triadisches KI-Coaching</h1>
            
            {/* Session Timer */}
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(sessionDuration)}</span>
              <button
                onClick={toggleSession}
                className={`p-1 rounded ${isSessionActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
              >
                {isSessionActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            {/* Auto-Save Indicator */}
            {autoSave && (
              <div className="flex items-center gap-1 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Auto-Save</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Coachee Selection - Custom Dropdown */}
            <div className="relative">
              <div 
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm cursor-pointer flex items-center justify-between min-w-[200px]"
                onClick={() => setShowCoacheeDropdown(!showCoacheeDropdown)}
              >
                <span>{selectedCoachee || 'Alle Coachees'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCoacheeDropdown ? 'rotate-180' : ''}`} />
              </div>
              {showCoacheeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
                  <div 
                    className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm"
                    onClick={() => {setSelectedCoachee(''); setShowCoacheeDropdown(false);}}
                  >
                    Alle Coachees
                  </div>
                  {coachees.map(coachee => (
                    <div
                      key={coachee.id}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm border-t border-gray-600"
                      onClick={() => {setSelectedCoachee(coachee.name); setShowCoacheeDropdown(false);}}
                    >
                      <div>{coachee.name}</div>
                      <div className="text-xs text-gray-400">Status: {coachee.status}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={shareToCoachee}
              disabled={!selectedCoachee}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Freigeben
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Fortschritt</span>
            <span>{currentStep}/12 Schritte</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${currentPhaseData?.color || 'bg-blue-600'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Phase Navigation */}
        <div className="flex gap-2 mt-4">
          {phases.map(phase => (
            <div
              key={phase.id}
              className={`flex-1 p-3 rounded-lg text-center text-sm transition-all ${
                phase.id === currentPhase
                  ? `${phase.color} text-white`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-medium">Phase {phase.id}</div>
              <div className="text-xs mt-1">{phase.name}</div>
              <div className="text-xs mt-1 opacity-75">
                Schritte {phase.steps[0]}-{phase.steps[phase.steps.length - 1]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Current Step with Special Content */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{currentStepData?.title}</h2>
                <p className="text-gray-400 mt-1">{currentStepData?.description}</p>
                {currentStepData?.instruction && (
                  <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">Coaching-Anweisung:</h4>
                    <p className="text-sm text-gray-300">{currentStepData.instruction}</p>
                    {promptLibrary.find(p => p.step === currentStep) && (
                      <div className="mt-3 p-2 bg-gray-600 rounded text-xs text-yellow-300">
                        💡 Der passende Prompt wurde automatisch ins Eingabefeld geladen. Ergänzen Sie gemeinsam mit dem Coachee die spezifischen Details.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === 12}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Special Content for Step 3: Image Selection */}
            {currentStep === 3 && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-green-400">Eingabe (Coach & Coachee)</h4>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                    Externes Bildarchiv öffnen
                  </button>
                </div>
                <p className="text-sm text-gray-300 mb-4">Coachee wählt ein Bild zur Zielverstärkung</p>
                
                {/* Image Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[1,2,3,4,5,6].map(i => (
                    <div 
                      key={i}
                      className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 rounded-lg cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
                    >
                      <span className="text-white text-xs font-medium">Bild {i}</span>
                    </div>
                  ))}
                </div>
                
                <textarea
                  placeholder="Coach protokolliert hier die Beschreibung des Coachees zum Bild..."
                  className="w-full h-24 bg-gray-600 border border-gray-500 rounded-lg p-3 text-white placeholder-gray-400 resize-none text-sm"
                />
              </div>
            )}

            {/* Special Content for Step 6 & 9: Avatar Interview */}
            {(currentStep === 6 || currentStep === 9) && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-lg font-medium text-purple-400 mb-4">
                  {currentStep === 6 ? 'Inneres Team aufstellen' : 'Umsetzungswiderstände aufstellen'}
                </h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {currentStep === 6 ? (
                    <>
                      <div className="bg-gray-600 rounded-lg p-3 text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-bold">T</span>
                        </div>
                        <div className="text-sm font-medium">Teamchefin</div>
                        <div className="text-xs text-gray-400 mt-1">"Ich möchte das Ziel erreichen!"</div>
                      </div>
                      <div className="bg-gray-600 rounded-lg p-3 text-center">
                        <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-bold">U</span>
                        </div>
                        <div className="text-sm font-medium">Unterstützerin</div>
                        <div className="text-xs text-gray-400 mt-1">"Das schaffen wir!"</div>
                      </div>
                      <div className="bg-gray-600 rounded-lg p-3 text-center">
                        <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-bold">B</span>
                        </div>
                        <div className="text-sm font-medium">Bremse</div>
                        <div className="text-xs text-gray-400 mt-1">"Das ist zu riskant!"</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-600 rounded-lg p-3 text-center">
                        <div className="w-12 h-12 bg-yellow-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-bold">P</span>
                        </div>
                        <div className="text-sm font-medium">Perfektionismus</div>
                        <div className="text-xs text-gray-400 mt-1">"Nicht ohne 100% Qualität!"</div>
                      </div>
                      <div className="bg-gray-600 rounded-lg p-3 text-center">
                        <div className="w-12 h-12 bg-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-bold">A</span>
                        </div>
                        <div className="text-sm font-medium">Anerkennung</div>
                        <div className="text-xs text-gray-400 mt-1">"Wir müssen gemocht werden!"</div>
                      </div>
                      <div className="bg-gray-600 rounded-lg p-3 text-center">
                        <div className="w-12 h-12 bg-gray-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-bold">Z</span>
                        </div>
                        <div className="text-sm font-medium">Zurückhaltung</div>
                        <div className="text-xs text-gray-400 mt-1">"Sicherheit geht vor!"</div>
                      </div>
                    </>
                  )}
                </div>
                <textarea
                  placeholder="Interview-Protokoll mit den Avataren..."
                  className="w-full h-32 bg-gray-600 border border-gray-500 rounded-lg p-3 text-white placeholder-gray-400 resize-none text-sm"
                />
              </div>
            )}
          </div>

          {/* Coach Input */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">Coach-Eingabe</h3>
              </div>
              <textarea
                value={coachInput}
                onChange={(e) => setCoachInput(e.target.value)}
                placeholder="Geben Sie hier Ihre Beobachtungen, Fragen oder Interventionen ein..."
                className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400">{coachInput.length}/500 Zeichen</span>
                <button
                  onClick={handleAiRequest}
                  disabled={!coachInput.trim() || isLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  {isLoading ? 'KI arbeitet...' : 'An KI senden'}
                </button>
              </div>
            </div>

            {/* AI Response */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold">KI-Antwort</h3>
              </div>
              <div className="h-32 bg-gray-700 border border-gray-600 rounded-lg p-3 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                    KI analysiert Ihre Eingabe...
                  </div>
                ) : aiResponse ? (
                  <div className="text-white whitespace-pre-wrap">{aiResponse}</div>
                ) : (
                  <div className="text-gray-400">Warten auf KI-Antwort...</div>
                )}
              </div>
            </div>
          </div>

          {/* Session Notes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold">Session-Notizen</h3>
            </div>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Wichtige Erkenntnisse, Beobachtungen und nächste Schritte notieren..."
              className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-6">
          {/* KI-Assistent Settings */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold">KI-Assistent</h3>
            </div>
            
            {/* Model Selection */}
            <div className="relative mb-3">
              <div 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
                onClick={() => setShowKiDropdown(!showKiDropdown)}
              >
                <span>{kiModels.find(m => m.id === selectedKiModel)?.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showKiDropdown ? 'rotate-180' : ''}`} />
              </div>
              {showKiDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
                  {kiModels.map(model => (
                    <div 
                      key={model.id}
                      className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-sm border-t border-gray-600 first:border-t-0"
                      onClick={() => {setSelectedKiModel(model.id); setShowKiDropdown(false);}}
                    >
                      {model.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* API Key Input */}
            {kiModels.find(m => m.id === selectedKiModel)?.requiresKey && (
              <div className="mb-3">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`API-Schlüssel für ${kiModels.find(m => m.id === selectedKiModel)?.name}`}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                />
                <div className="text-xs text-gray-400 mt-1">
                  {selectedKiModel === 'personal' && 'Ihr persönlicher Assistent-Schlüssel'}
                  {selectedKiModel === 'gpt4' && 'OpenAI API Key (sk-...)'}
                  {selectedKiModel === 'claude' && 'Anthropic API Key'}
                </div>
              </div>
            )}

            {/* API Status */}
            <div className={`text-xs px-2 py-1 rounded ${apiKey ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
              {apiKey ? '🟢 API-Schlüssel gesetzt' : '⚠️ API-Schlüssel fehlt'}
            </div>
          </div>

          {/* Prompt Library */}
          <div className="mb-6">
            <div 
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onClick={() => setShowPromptLibrary(!showPromptLibrary)}
            >
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold">Prompt-Bibliothek</h3>
              <ChevronDown className={`w-4 h-4 transition-transform ${showPromptLibrary ? 'rotate-180' : ''}`} />
            </div>
            
            {showPromptLibrary && (
              <div>
                {/* Search and Filters */}
                <div className="grid grid-cols-1 gap-2 mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Suche"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-3 py-2 text-sm"
                    />
                    <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <div 
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      >
                        <span>{selectedCategory}</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                      {showCategoryDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
                          {categories.map(cat => (
                            <div
                              key={cat}
                              className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-sm border-t border-gray-600 first:border-t-0"
                              onClick={() => {setSelectedCategory(cat); setShowCategoryDropdown(false);}}
                            >
                              {cat}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <div 
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                      >
                        <span>{sortOrder}</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                      {showSortDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
                          {['Titel (A-Z)', 'Titel (Z-A)', 'Kategorie'].map(sort => (
                            <div
                              key={sort}
                              className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-sm border-t border-gray-600 first:border-t-0"
                              onClick={() => {setSortOrder(sort); setShowSortDropdown(false);}}
                            >
                              {sort}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prompt Cards */}
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {filteredPrompts.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      {searchTerm ? `Keine Prompts gefunden für "${searchTerm}"` : 'Keine Prompts in dieser Kategorie'}
                    </div>
                  ) : (
                    filteredPrompts.map(prompt => (
                      <div
                        key={prompt.id}
                        onClick={() => {
                          setSelectedPrompt(prompt.fullPrompt); 
                          setCoachInput(prompt.fullPrompt);
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                          selectedPrompt === prompt.fullPrompt 
                            ? 'bg-blue-700 hover:bg-blue-600' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        } ${prompt.step === currentStep ? 'ring-2 ring-green-400' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-sm">{prompt.title}</div>
                              {prompt.step === currentStep && (
                                <span className="text-xs bg-green-600 text-green-100 px-2 py-0.5 rounded">
                                  Aktueller Schritt
                                </span>
                              )}
                              {prompt.step && prompt.step !== currentStep && (
                                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded">
                                  Schritt {prompt.step}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-blue-400 mt-1">{prompt.category}</div>
                            <div className="text-xs text-gray-300 mt-1 line-clamp-2">{prompt.preview}</div>
                            {prompt.step === currentStep && (
                              <div className="text-xs text-green-400 mt-2">
                                ➤ Klicken um im Eingabefeld zu laden
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => {e.stopPropagation();}}
                              className="p-1 hover:bg-gray-600 rounded"
                            >
                              <Edit3 className="w-3 h-3 text-gray-400" />
                            </button>
                            <button 
                              onClick={(e) => {e.stopPropagation();}}
                              className="p-1 hover:bg-gray-600 rounded"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-2">
                  <button className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm transition-colors">
                    <Plus className="w-4 h-4" />
                    Prompt hinzufügen
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm transition-colors">
                      <Upload className="w-4 h-4" />
                      Importieren
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm transition-colors">
                      <Download className="w-4 h-4" />
                      Exportieren
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
              <Save className="w-4 h-4" />
              Session speichern
            </button>
            
            <button
              onClick={resetSession}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showResetWarning 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {showResetWarning ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  Wirklich zurücksetzen?
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Session zurücksetzen
                </>
              )}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="font-medium mb-3">Session-Übersicht</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Dauer:</span>
                <span>{formatTime(sessionDuration)}</span>
              </div>
              <div className="flex justify-between">
                <span>Schritt:</span>
                <span>{currentStep}/12</span>
              </div>
              <div className="flex justify-between">
                <span>Phase:</span>
                <span>{currentPhase}/4</span>
              </div>
              <div className="flex justify-between">
                <span>KI-Anfragen:</span>
                <span>{aiResponse ? 1 : 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedKIModule;