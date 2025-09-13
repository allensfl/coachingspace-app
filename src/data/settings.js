import { DefaultDocumentCategories, DefaultJournalCategories } from '@/types';

export const appSettings = {
  company: {
    name: 'Dein Coaching Business',
    owner: 'Max Mustermann',
    street: 'Musterstraße 1',
    zip: '12345',
    city: 'Musterstadt',
    country: 'Deutschland',
    phone: '+49 123 456789',
    email: 'info@dein-coaching.de',
    website: 'https://dein-coaching.de',
    taxId: 'DE123456789',
    logoUrl: '',
    bankName: 'Musterbank',
    iban: 'DE89 3704 0044 0532 0130 00',
    showBankDetailsOnInvoice: true,
    paymentDeadlineDays: 14,
    defaultTaxRate: 19.0,
  },
  theme: {
    primaryColor: {
      hex: '#3b82f6',
      hsl: '221.2 83.2% 53.3%',
    },
  },
  darkMode: true,
  remoteTools: [
    { name: 'Zoom', url: 'https://zoom.us/start/meeting' },
    { name: 'Google Meet', url: 'https://meet.google.com/new' },
  ],
  ai: {
    defaultModel: 'gpt-4o-mini',
    prompts: [],
  },
  documentCategories: DefaultDocumentCategories,
  journalCategories: DefaultJournalCategories,
  coacheeFields: [
    { id: 'custom_1', label: 'Branche', type: 'text' },
    { id: 'custom_2', label: 'Nächstes Review-Datum', type: 'date' },
  ],
};