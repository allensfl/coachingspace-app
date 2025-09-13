export const CoacheeStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  POTENTIAL: 'potential'
};

export const SessionMode = {
  IN_PERSON: 'in_person',
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  PHONE: 'phone'
};

export const SessionStatus = {
  PLANNED: 'planned',
  COMPLETED: 'completed',
  CANCELED: 'canceled'
};

export const InvoiceStatus = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELED: 'canceled'
};

export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
};

export const TaskPriority = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};

export const DefaultDocumentCategories = [
    { id: 'contract', name: 'Vertrag', color: '#3b82f6' },
    { id: 'assessment', name: 'Assessment', color: '#8b5cf6' },
    { id: 'notes', name: 'Notizen', color: '#22c55e' },
    { id: 'report', name: 'Bericht', color: '#f97316' },
];

export const DefaultJournalCategories = [
    { id: 'reflexion', name: 'Reflexion', color: '#3b82f6' },
    { id: 'methodik', name: 'Methodik', color: '#8b5cf6' },
    { id: 'fortbildung', name: 'Fortbildung', color: '#22c55e' },
    { id: 'erkenntnis', name: 'Erkenntnis', color: '#f97316' },
    { id: 'sonstiges', name: 'Sonstiges', color: '#64748b' },
];