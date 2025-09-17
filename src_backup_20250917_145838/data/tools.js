export const dummyTools = [
  {
    id: 1,
    name: 'Lebensrad',
    category: 'Zielklärung',
    description: 'Visualisiert die Zufriedenheit in verschiedenen Lebensbereichen zur Standortbestimmung.',
    icon: 'Zap',
    usage: 'Ideal für Erstgespräche und zur Zielfindung.',
    status: 'active',
    isFavorite: true,
    isCustom: false,
    usageHistory: [
      { coacheeId: 1, coacheeName: 'Anna Schmidt', date: '2025-08-15' }
    ],
    content: `
      <h2>Lebensrad Anleitung</h2>
      <p>Das Lebensrad ist ein einfaches, aber wirkungsvolles Werkzeug zur Standortbestimmung.</p>
      <ol>
        <li><strong>Bereiche definieren:</strong> Identifiziere 8-12 wichtige Lebensbereiche (z.B. Karriere, Finanzen, Gesundheit, Freunde & Familie, Liebe, Freizeit, Persönliches Wachstum, Umfeld).</li>
        <li><strong>Skalieren:</strong> Bewerte deine aktuelle Zufriedenheit in jedem Bereich auf einer Skala von 1 (gar nicht zufrieden) bis 10 (vollkommen zufrieden).</li>
        <li><strong>Visualisieren:</strong> Trage die Werte in das Rad ein und verbinde die Punkte.</li>
        <li><strong>Reflektieren:</strong> Wo gibt es Unwuchten? Welcher Bereich hat die größte Hebelwirkung? Wo möchtest du in 3 Monaten stehen?</li>
      </ol>
    `
  },
  {
    id: 2,
    name: 'Skalenfrage',
    category: 'Reflexion',
    description: 'Ein einfacher Schieberegler von 1-10, um Gefühle, Fortschritte oder Zuversicht zu quantifizieren.',
    icon: 'SlidersHorizontal',
    usage: 'Zur schnellen Messung von subjektiven Zuständen.',
    status: 'active',
    isFavorite: false,
    isCustom: false,
    usageHistory: [
       { coacheeId: 2, coacheeName: 'Michael Weber', date: '2025-08-18' }
    ],
    content: `
      <h2>Anwendung der Skalenfrage</h2>
      <p>Die Skalenfrage hilft, subjektive Empfindungen greifbar zu machen.</p>
      <ul>
        <li><strong>Frage stellen:</strong> "Auf einer Skala von 1 bis 10, wobei 1 'überhaupt nicht' und 10 'absolut' bedeutet, wie zuversichtlich bist du, dein Ziel zu erreichen?"</li>
        <li><strong>Nachfragen:</strong> "Was macht es zu einer [Antwort] und nicht zu einer [Antwort-1]?"</li>
        <li><strong>Zukunftsorientierung:</strong> "Was müsste passieren, damit du auf eine [Antwort+1] kommst?"</li>
      </ul>
    `
  },
  {
    id: 3,
    name: 'Ressourcen-Liste',
    category: 'Ressourcen',
    description: 'Eine interaktive Liste zum Sammeln von persönlichen, sozialen und materiellen Ressourcen.',
    icon: 'List',
    usage: 'Stärkt das Bewusstsein für vorhandene Stärken und Hilfsmittel.',
    status: 'active',
    isFavorite: false,
    isCustom: false,
    usageHistory: [],
    content: `
      <h2>Ressourcen sammeln</h2>
      <p>Brainstorme gemeinsam mit dem Coachee alle verfügbaren Ressourcen.</p>
      <h3>Persönliche Ressourcen</h3>
      <ul>
        <li>Stärken & Talente</li>
        <li>Wissen & Erfahrungen</li>
        <li>Positive Eigenschaften (z.B. Geduld, Mut)</li>
      </ul>
      <h3>Soziale Ressourcen</h3>
      <ul>
        <li>Familie & Freunde</li>
        <li>Kollegen & Mentoren</li>
        <li>Netzwerke & Vereine</li>
      </ul>
      <h3>Materielle Ressourcen</h3>
      <ul>
        <li>Finanzielle Mittel</li>
        <li>Wohnraum & Arbeitsplatz</li>
        <li>Werkzeuge & Technologien</li>
      </ul>
    `
  },
  {
    id: 4,
    name: 'Zielbaum',
    category: 'Zielklärung',
    description: 'Eine einfache hierarchische Darstellung, um Hauptziele in konkrete Teilziele zu zerlegen.',
    icon: 'GitBranch',
    usage: 'Schafft Klarheit und Struktur bei komplexen Vorhaben.',
    status: 'active',
    isFavorite: true,
    isCustom: false,
    usageHistory: [
      { coacheeId: 1, coacheeName: 'Anna Schmidt', date: '2025-08-22' }
    ],
    content: `
      <h2>Zielbaum erstellen</h2>
      <ol>
        <li><strong>Hauptziel (Stamm):</strong> Definiere das übergeordnete, große Ziel.</li>
        <li><strong>Teilziele (Äste):</strong> Breche das Hauptziel in 2-4 größere Teilziele herunter.</li>
        <li><strong>Konkrete Schritte (Zweige):</strong> Definiere für jeden Ast konkrete, messbare und terminierte Handlungsschritte.</li>
      </ol>
    `
  },
  {
    id: 5,
    name: 'Werte-Kompass',
    category: 'Entscheidungshilfen',
    description: 'Tool zur Identifikation persönlicher Werte und Prioritäten.',
    icon: 'Compass',
    usage: 'Bei Entscheidungsfindung und Orientierung.',
    status: 'active',
    isFavorite: false,
    isCustom: false,
    usageHistory: [],
    content: `
      <h2>Werte-Kompass</h2>
      <p>Hilft bei Entscheidungen, die im Einklang mit den eigenen Werten stehen.</p>
      <ol>
        <li><strong>Werte identifizieren:</strong> Brainstorme oder wähle aus einer Liste 5-10 persönliche Kernwerte (z.B. Freiheit, Sicherheit, Kreativität).</li>
        <li><strong>Priorisieren:</strong> Bringe die Werte in eine Reihenfolge. Was ist am wichtigsten?</li>
        <li><strong>Entscheidung prüfen:</strong> "Inwieweit zahlt Option A auf meine Top-3-Werte ein? Und Option B?"</li>
      </ol>
    `
  },
  {
    id: 6,
    name: 'GROW-Modell',
    category: 'Sonstige',
    description: 'Strukturiertes Coaching-Gespräch: Goal, Reality, Options, Will.',
    icon: 'Target',
    usage: 'Für zielorientierte Coaching-Sessions.',
    status: 'archived',
    isFavorite: false,
    isCustom: false,
    usageHistory: [],
    content: `
      <h2>Das GROW-Modell</h2>
      <ul>
        <li><strong>G (Goal):</strong> Was ist dein Ziel für diese Session? Was möchtest du erreichen?</li>
        <li><strong>R (Reality):</strong> Wie ist die aktuelle Situation? Was hast du bereits versucht?</li>
        <li><strong>O (Options):</strong> Welche Möglichkeiten hast du? Was könntest du noch tun?</li>
        <li><strong>W (Will/Way Forward):</strong> Was wirst du konkret tun? Wann? Wie misst du den Erfolg?</li>
      </ul>
    `
  },
  {
    id: 7,
    name: 'Checkliste: Session-Vorbereitung',
    category: 'Checklisten',
    description: 'Eine praktische Checkliste, um sicherzustellen, dass du für jede Session optimal vorbereitet bist.',
    icon: 'CheckSquare',
    usage: 'Zur Qualitätssicherung vor jeder Coaching-Session.',
    status: 'active',
    isFavorite: false,
    isCustom: false,
    usageHistory: [],
    content: `
      <h2>Checkliste Session-Vorbereitung</h2>
      <ul>
        <li>[ ] Letzte Session-Notizen gelesen?</li>
        <li>[ ] Ziel der nächsten Session klar?</li>
        <li>[ ] Meine eigene Haltung/Intention für die Session reflektiert?</li>
        <li>[ ] Mögliche Methoden/Tools vorbereitet?</li>
        <li>[ ] Technischer Check bei Remote-Sessions (Kamera, Mikro, Internet)?</li>
        <li>[ ] Ungestörte Umgebung sichergestellt?</li>
        <li>[ ] Wasser/Tee bereitgestellt?</li>
      </ul>
    `
  }
];