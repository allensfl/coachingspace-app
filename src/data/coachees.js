import { CoacheeStatus } from '@/types';

export const dummyCoachees = [
  {
    id: 1,
    portalAccess: {
      initialToken: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      permanentToken: null,
      passwordHash: null,
    },
    firstName: 'Anna',
    lastName: 'Schmidt',
    pronouns: 'Sie/Ihre',
    email: 'anna.schmidt@email.com',
    phone: '+49 151 12345678',
    address: 'Hauptstraße 1, 10115 Berlin',
    birthDate: '1985-05-20',
    emergencyContact: { name: 'Peter Schmidt', phone: '+49 151 87654321' },
    status: CoacheeStatus.ACTIVE,
    tags: ['Führungskraft', 'Karriere'],
    coachingStartDate: '2024-01-10',
    lastContactDate: '2025-08-22',
    mainTopic: 'Führungskompetenzen verbessern und Work-Life-Balance finden',
    shortNote: 'Fokus auf Führungskompetenzen und Work-Life-Balance.',
    confidentialNotes: 'Spricht offen über Schwierigkeiten mit einem bestimmten Teammitglied. Braucht hierfür Strategien.',
    quickNotes: ['Delegation', 'Konfliktlösung', 'Zeitmanagement'],
    sessions: [1, 2, 5, 7],
    documents: [1, 2],
    invoices: [1, 2],
    goals: [
      {
        id: 1,
        title: 'Verbesserung der Teamführung',
        subGoals: [
          { id: 11, title: 'Effektiver delegieren lernen', completed: true },
          { id: 12, title: 'Konstruktives Feedback geben', completed: false },
        ],
        milestones: [
          { id: 101, title: 'Erstes delegiertes Projekt abgeschlossen', date: '2025-08-15' },
          { id: 102, title: 'Feedback-Gespräch mit Team durchgeführt', date: '2025-09-30' },
        ],
        todos: [
          { id: 1001, text: 'Buch über "Radical Candor" lesen', completed: false }
        ],
      },
    ],
    consents: {
      gdpr: true,
      audioRecording: false,
    },
    auditLog: [
      { timestamp: '2025-08-22T11:00:00Z', user: 'Coach', action: 'Session #2 Notiz hinzugefügt' },
      { timestamp: '2024-01-15T09:00:00Z', user: 'Coach', action: 'Coachee erstellt' }
    ],
    customData: {
      'custom_1': 'Tech-Industrie',
      'custom_2': '2025-12-15'
    },
    deleteStatus: null
  },
  {
    id: 2,
    portalAccess: {
      initialToken: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
      permanentToken: null,
      passwordHash: null,
    },
    firstName: 'Michael',
    lastName: 'Weber',
    pronouns: 'Er/Ihm',
    email: 'michael.weber@email.com',
    phone: '+49 151 87654321',
    address: 'Am Park 42, 80809 München',
    birthDate: null,
    emergencyContact: null,
    status: CoacheeStatus.PAUSED,
    tags: ['Startup', 'Strategie'],
    coachingStartDate: '2024-02-01',
    lastContactDate: '2025-08-18',
    mainTopic: 'Strategische Beratung für Tech-Startup',
    shortNote: 'Gründer eines Tech-Startups, benötigt strategische Beratung. Pausiert wegen Finanzierungsrunde.',
    confidentialNotes: 'Ist sich unsicher über die Skalierbarkeit seines Geschäftsmodells.',
    quickNotes: ['Pitch Deck', 'Business Model Canvas', 'Investoren'],
    sessions: [3, 8],
    documents: [3, 4],
    invoices: [3],
    goals: [
       {
        id: 2,
        title: 'Investoren-Pitch vorbereiten',
        subGoals: [
          { id: 21, title: 'Pitch Deck finalisieren', completed: true },
          { id: 22, title: 'Investorenliste erstellen', completed: false },
        ],
        milestones: [
          { id: 201, title: 'Pitch-Training absolviert', date: '2025-08-20' },
        ],
        todos: [],
      },
    ],
    consents: {
      gdpr: false,
      audioRecording: false,
    },
    auditLog: [
       { timestamp: '2025-08-18T15:00:00Z', user: 'Coach', action: 'Status auf "Pausiert" gesetzt' },
       { timestamp: '2024-02-01T14:00:00Z', user: 'Coach', action: 'Coachee erstellt' }
    ],
    customData: {},
    deleteStatus: null
  },
  {
    id: 3,
    portalAccess: {
      initialToken: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
      permanentToken: null,
      passwordHash: null,
    },
    firstName: 'Sarah',
    lastName: 'Müller',
    pronouns: 'Sie/Ihre',
    email: 'sarah.mueller@email.com',
    phone: '+49 151 11223344',
    address: null,
    birthDate: '1990-11-12',
    emergencyContact: null,
    status: CoacheeStatus.POTENTIAL,
    tags: ['Berufswechsel', 'Orientierung'],
    coachingStartDate: '2025-08-10',
    lastContactDate: '2025-08-20',
    mainTopic: 'Berufliche Neuorientierung nach Elternzeit',
    shortNote: 'Potenzielle Kundin. Berufliche Neuorientierung nach Elternzeit.',
    confidentialNotes: '',
    quickNotes: ['Stärkenanalyse', 'Bewerbungsstrategie'],
    sessions: [],
    documents: [5],
    invoices: [],
    goals: [],
    consents: {
      gdpr: true,
      audioRecording: false,
    },
    auditLog: [
      { timestamp: '2025-08-10T10:00:00Z', user: 'Coach', action: 'Coachee erstellt als "Potenziell"' }
    ],
    customData: {},
    deleteStatus: null
  },
   {
    id: 4,
    portalAccess: {
      initialToken: 'd4e5f6a7-b8c9-0123-4567-890abcdef123',
      permanentToken: null,
      passwordHash: null,
    },
    firstName: 'David',
    lastName: 'Fischer',
    pronouns: 'Er/Ihm',
    email: 'david.fischer@email.com',
    phone: '+49 151 55667788',
    address: null,
    birthDate: '1978-08-15',
    emergencyContact: null,
    status: CoacheeStatus.COMPLETED,
    tags: ['Ruhestand', 'Lebensplanung'],
    coachingStartDate: '2024-09-01',
    lastContactDate: '2025-02-28',
    mainTopic: 'Planung des Übergangs in den Ruhestand',
    shortNote: 'Coaching zur Vorbereitung auf den Ruhestand erfolgreich abgeschlossen.',
    confidentialNotes: 'Hatte anfangs Schwierigkeiten, seine neue Rolle zu finden. Hat nun klare Pläne und Projekte.',
    quickNotes: ['Sinnfindung', 'Zeitstruktur', 'Soziale Kontakte'],
    sessions: [],
    documents: [],
    invoices: [],
    goals: [],
    consents: {
      gdpr: true,
      audioRecording: false,
    },
    auditLog: [
      { timestamp: '2025-02-28T18:00:00Z', user: 'Coach', action: 'Status auf "Abgeschlossen" gesetzt' },
      { timestamp: '2024-09-01T11:30:00Z', user: 'Coach', action: 'Coachee erstellt' }
    ],
    customData: {},
    deleteStatus: null
  }
];