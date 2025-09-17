import { InvoiceStatus } from '@/types';

export const dummyInvoices = [
  {
    id: 1,
    coacheeId: 1,
    coacheeName: 'Anna Schmidt',
    invoiceNumber: 'CS-2024-001',
    date: '2024-03-01',
    dueDate: '2024-03-31',
    total: 571.20,
    subtotal: 480.00,
    taxAmount: 91.20,
    status: InvoiceStatus.PAID,
    items: [
        { id: 1, description: '4 Coaching-Sessions', quantity: 4, price: 120.00 }
    ],
    currency: 'EUR',
    taxRate: 19,
    description: '4 Coaching-Sessions à 120€',
    title: "Coaching & Beratung"
  },
  {
    id: 2,
    coacheeId: 1,
    coacheeName: 'Anna Schmidt',
    invoiceNumber: 'CS-2024-002',
    date: '2024-03-15',
    dueDate: '2024-04-15',
    total: 285.60,
    subtotal: 240.00,
    taxAmount: 45.60,
    status: InvoiceStatus.SENT,
    items: [
        { id: 1, description: '2 Coaching-Sessions', quantity: 2, price: 120.00 }
    ],
    currency: 'EUR',
    taxRate: 19,
    description: '2 Coaching-Sessions à 120€',
    title: "Coaching & Beratung"
  },
  {
    id: 3,
    coacheeId: 2,
    coacheeName: 'Michael Weber',
    invoiceNumber: 'CS-2024-003',
    date: '2024-03-20',
    dueDate: '2024-04-20',
    total: 387.72,
    subtotal: 360.00,
    taxAmount: 27.72,
    status: InvoiceStatus.DRAFT,
    items: [
        { id: 1, description: '2 Extended Sessions', quantity: 2, price: 180.00 }
    ],
    currency: 'CHF',
    taxRate: 7.7,
    description: '2 Extended Sessions à 180 CHF',
    title: "Coaching & Beratung"
  },
  {
    id: 4,
    coacheeId: 3,
    coacheeName: 'Julia Richter',
    invoiceNumber: 'CS-2024-004',
    date: '2024-02-10',
    dueDate: '2024-03-10',
    total: 646.2,
    subtotal: 600.00,
    taxAmount: 46.2,
    status: InvoiceStatus.OVERDUE,
    items: [
        { id: 1, description: 'Workshop "Leadership Basics"', quantity: 1, price: 600.00 }
    ],
    currency: 'CHF',
    taxRate: 7.7,
    description: 'Workshop "Leadership Basics"',
    title: "Workshop"
  }
];

export const dummyRecurringInvoices = [
  {
    id: 1,
    coacheeId: 4,
    coacheeName: 'Frank Lehmann',
    status: 'active',
    startDate: '2024-01-01',
    interval: 'monthly',
    rateId: 1, // 'Standard Coaching-Session'
    quantity: 4,
    nextDueDate: '2025-09-01',
  }
];

export const dummyActivePackages = [
    {
        id: 1,
        coacheeId: 1,
        packageName: "5er-Paket Standard",
        totalUnits: 5,
        usedUnits: 2,
        purchaseDate: '2025-08-01'
    }
];

export const dummyPackageTemplates = [
    {
        id: 1,
        name: '5er-Paket Karriere-Boost',
        description: 'Fünf intensive 60-Minuten-Sessions zur Beschleunigung deiner Karriere.',
        totalUnits: 5,
        price: 550.00
    },
    {
        id: 2,
        name: '10er-Paket Leadership-Entwicklung',
        description: 'Zehn 90-Minuten-Sessions zur Entwicklung deiner Führungskompetenzen.',
        totalUnits: 10,
        price: 1600.00
    }
];