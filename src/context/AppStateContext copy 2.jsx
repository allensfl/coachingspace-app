import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial State
const initialState = {
  isLoading: true,
  coachees: [],
  sessions: [],
  serviceRates: [],
  invoices: [],
  recurringInvoices: [],
  documents: [], // NEU: Documents Array
  settings: {
    company: {
      name: '',
      address: '',
      email: '',
      phone: '',
      defaultTaxRate: 19.0,
      defaultCurrency: 'EUR',
      paymentDeadlineDays: 14
    }
  },
  tasks: []
};

// Action Types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_COACHEES: 'SET_COACHEES',
  ADD_COACHEE: 'ADD_COACHEE',
  UPDATE_COACHEE: 'UPDATE_COACHEE',
  REMOVE_COACHEE: 'REMOVE_COACHEE',
  SET_SESSIONS: 'SET_SESSIONS',
  ADD_SESSION: 'ADD_SESSION',
  UPDATE_SESSION: 'UPDATE_SESSION',
  SET_SERVICE_RATES: 'SET_SERVICE_RATES',
  ADD_SERVICE_RATE: 'ADD_SERVICE_RATE',
  UPDATE_SERVICE_RATE: 'UPDATE_SERVICE_RATE',
  SET_INVOICES: 'SET_INVOICES',
  ADD_INVOICE: 'ADD_INVOICE',
  UPDATE_INVOICE: 'UPDATE_INVOICE',
  SET_RECURRING_INVOICES: 'SET_RECURRING_INVOICES',
  ADD_RECURRING_INVOICE: 'ADD_RECURRING_INVOICE',
  UPDATE_RECURRING_INVOICE: 'UPDATE_RECURRING_INVOICE',
  SET_DOCUMENTS: 'SET_DOCUMENTS', // NEU: Documents Actions
  ADD_DOCUMENT: 'ADD_DOCUMENT',
  UPDATE_DOCUMENT: 'UPDATE_DOCUMENT',
  REMOVE_DOCUMENT: 'REMOVE_DOCUMENT',
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  REMOVE_TASK: 'REMOVE_TASK'
};

// Reducer
const appStateReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ActionTypes.SET_COACHEES:
      return { ...state, coachees: action.payload };
    case ActionTypes.ADD_COACHEE:
      return { ...state, coachees: [...state.coachees, action.payload] };
    case ActionTypes.UPDATE_COACHEE:
      return {
        ...state,
        coachees: state.coachees.map(coachee =>
          coachee.id === action.payload.id ? action.payload : coachee
        )
      };
    case ActionTypes.REMOVE_COACHEE:
      return {
        ...state,
        coachees: state.coachees.filter(coachee => coachee.id !== action.payload)
      };

    case ActionTypes.SET_SESSIONS:
      return { ...state, sessions: action.payload };
    case ActionTypes.ADD_SESSION:
      return { ...state, sessions: [...state.sessions, action.payload] };
    case ActionTypes.UPDATE_SESSION:
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id ? action.payload : session
        )
      };

    case ActionTypes.SET_SERVICE_RATES:
      return { ...state, serviceRates: action.payload };
    case ActionTypes.ADD_SERVICE_RATE:
      return { ...state, serviceRates: [...state.serviceRates, action.payload] };
    case ActionTypes.UPDATE_SERVICE_RATE:
      return {
        ...state,
        serviceRates: state.serviceRates.map(rate =>
          rate.id === action.payload.id ? action.payload : rate
        )
      };

    case ActionTypes.SET_INVOICES:
      return { ...state, invoices: action.payload };
    case ActionTypes.ADD_INVOICE:
      return { ...state, invoices: [...state.invoices, action.payload] };
    case ActionTypes.UPDATE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.id === action.payload.id ? action.payload : invoice
        )
      };

    case ActionTypes.SET_RECURRING_INVOICES:
      return { ...state, recurringInvoices: action.payload };
    case ActionTypes.ADD_RECURRING_INVOICE:
      return { ...state, recurringInvoices: [...state.recurringInvoices, action.payload] };
    case ActionTypes.UPDATE_RECURRING_INVOICE:
      return {
        ...state,
        recurringInvoices: state.recurringInvoices.map(invoice =>
          invoice.id === action.payload.id ? action.payload : invoice
        )
      };

    // NEU: Documents Reducer Cases
    case ActionTypes.SET_DOCUMENTS:
      return { ...state, documents: action.payload };
    case ActionTypes.ADD_DOCUMENT:
      return { ...state, documents: [...state.documents, action.payload] };
    case ActionTypes.UPDATE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.map(document =>
          document.id === action.payload.id ? action.payload : document
        )
      };
    case ActionTypes.REMOVE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter(document => document.id !== action.payload)
      };

    case ActionTypes.SET_SETTINGS:
      return { ...state, settings: action.payload };
    case ActionTypes.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case ActionTypes.SET_TASKS:
      return { ...state, tasks: action.payload };
    case ActionTypes.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case ActionTypes.REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    default:
      return state;
  }
};

// Context
const AppStateContext = createContext();

// Provider Component
export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  // localStorage Keys
  const STORAGE_KEYS = {
    COACHEES: 'coaching_coachees',
    SESSIONS: 'coaching_sessions',
    SERVICE_RATES: 'coaching_service_rates',
    INVOICES: 'coaching_invoices',
    RECURRING_INVOICES: 'coaching_recurring_invoices',
    DOCUMENTS: 'coaching_documents', // NEU: Documents Storage Key
    SETTINGS: 'coaching_settings',
    TASKS: 'coaching_tasks'
  };

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load all data from localStorage
        const coachees = JSON.parse(localStorage.getItem(STORAGE_KEYS.COACHEES) || '[]');
        const sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
        const serviceRates = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICE_RATES) || '[]');
        const invoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICES) || '[]');
        const recurringInvoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECURRING_INVOICES) || '[]');
        const documents = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS) || '[]'); // NEU: Documents laden
        const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(initialState.settings));
        const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');

        // Dispatch all loaded data
        dispatch({ type: ActionTypes.SET_COACHEES, payload: coachees });
        dispatch({ type: ActionTypes.SET_SESSIONS, payload: sessions });
        dispatch({ type: ActionTypes.SET_SERVICE_RATES, payload: serviceRates });
        dispatch({ type: ActionTypes.SET_INVOICES, payload: invoices });
        dispatch({ type: ActionTypes.SET_RECURRING_INVOICES, payload: recurringInvoices });
        dispatch({ type: ActionTypes.SET_DOCUMENTS, payload: documents }); // NEU: Documents setzen
        dispatch({ type: ActionTypes.SET_SETTINGS, payload: settings });
        dispatch({ type: ActionTypes.SET_TASKS, payload: tasks });

        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };

    loadData();
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.COACHEES, JSON.stringify(state.coachees));
    }
  }, [state.coachees, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(state.sessions));
    }
  }, [state.sessions, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.SERVICE_RATES, JSON.stringify(state.serviceRates));
    }
  }, [state.serviceRates, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(state.invoices));
    }
  }, [state.invoices, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.RECURRING_INVOICES, JSON.stringify(state.recurringInvoices));
    }
  }, [state.recurringInvoices, state.isLoading]);

  // NEU: Documents localStorage Sync
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(state.documents));
    }
  }, [state.documents, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
    }
  }, [state.settings, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(state.tasks));
    }
  }, [state.tasks, state.isLoading]);

  // Action Creators
  const actions = {
    // Coachees
    setCoachees: (coachees) => dispatch({ type: ActionTypes.SET_COACHEES, payload: coachees }),
    addCoachee: (coachee) => dispatch({ type: ActionTypes.ADD_COACHEE, payload: coachee }),
    updateCoachee: (coachee) => dispatch({ type: ActionTypes.UPDATE_COACHEE, payload: coachee }),
    removeCoachee: (coacheeId) => dispatch({ type: ActionTypes.REMOVE_COACHEE, payload: coacheeId }),

    // Sessions
    setSessions: (sessions) => dispatch({ type: ActionTypes.SET_SESSIONS, payload: sessions }),
    addSession: (session) => dispatch({ type: ActionTypes.ADD_SESSION, payload: session }),
    updateSession: (session) => dispatch({ type: ActionTypes.UPDATE_SESSION, payload: session }),

    // Service Rates
    setServiceRates: (rates) => dispatch({ type: ActionTypes.SET_SERVICE_RATES, payload: rates }),
    addServiceRate: (rate) => dispatch({ type: ActionTypes.ADD_SERVICE_RATE, payload: rate }),
    updateServiceRate: (rate) => dispatch({ type: ActionTypes.UPDATE_SERVICE_RATE, payload: rate }),

    // Invoices
    setInvoices: (invoices) => dispatch({ type: ActionTypes.SET_INVOICES, payload: invoices }),
    addInvoice: (invoice) => dispatch({ type: ActionTypes.ADD_INVOICE, payload: invoice }),
    updateInvoice: (invoice) => dispatch({ type: ActionTypes.UPDATE_INVOICE, payload: invoice }),

    // Recurring Invoices
    setRecurringInvoices: (invoices) => dispatch({ type: ActionTypes.SET_RECURRING_INVOICES, payload: invoices }),
    addRecurringInvoice: (invoice) => dispatch({ type: ActionTypes.ADD_RECURRING_INVOICE, payload: invoice }),
    updateRecurringInvoice: (invoice) => dispatch({ type: ActionTypes.UPDATE_RECURRING_INVOICE, payload: invoice }),

    // NEU: Documents Actions
    setDocuments: (documents) => dispatch({ type: ActionTypes.SET_DOCUMENTS, payload: documents }),
    addDocument: (document) => dispatch({ type: ActionTypes.ADD_DOCUMENT, payload: document }),
    updateDocument: (document) => dispatch({ type: ActionTypes.UPDATE_DOCUMENT, payload: document }),
    removeDocument: (documentId) => dispatch({ type: ActionTypes.REMOVE_DOCUMENT, payload: documentId }),

    // Settings
    setSettings: (settings) => dispatch({ type: ActionTypes.SET_SETTINGS, payload: settings }),
    updateSettings: (settingsUpdate) => dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settingsUpdate }),

    // Tasks
    setTasks: (tasks) => dispatch({ type: ActionTypes.SET_TASKS, payload: tasks }),
    addTask: (task) => dispatch({ type: ActionTypes.ADD_TASK, payload: task }),
    updateTask: (task) => dispatch({ type: ActionTypes.UPDATE_TASK, payload: task }),
    removeTask: (taskId) => dispatch({ type: ActionTypes.REMOVE_TASK, payload: taskId }),

    // Utility function to update coachee consent
    updateCoacheeConsent: (coacheeId, consentType, value, document = null) => {
      const coachee = state.coachees.find(c => c.id === coacheeId);
      if (coachee) {
        const updatedCoachee = {
          ...coachee,
          consents: {
            ...coachee.consents,
            [consentType]: value
          }
        };

        // If document is provided, add it to the coachee's documents
        if (document) {
          const newDocument = {
            id: Date.now(),
            name: `${consentType}_consent_${coacheeId}.pdf`,
            type: 'pdf',
            size: 0.1,
            category: 'legal',
            coacheeId: coacheeId,
            coacheeName: `${coachee.firstName} ${coachee.lastName}`,
            date: new Date().toISOString().split('T')[0],
            description: `DSGVO Einwilligungserklärung von ${coachee.firstName} ${coachee.lastName}`,
            shared: false,
            blob: document
          };

          // Add document to documents array
          dispatch({ type: ActionTypes.ADD_DOCUMENT, payload: newDocument });

          // Also add to coachee's documents if that structure exists
          if (!updatedCoachee.documents) {
            updatedCoachee.documents = [];
          }
          updatedCoachee.documents.push(newDocument);
        }

        dispatch({ type: ActionTypes.UPDATE_COACHEE, payload: updatedCoachee });
      }
    }
  };

  const value = {
    state,
    actions,
    isLoading: state.isLoading
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

// Hook to use the context
export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppStateContext must be used within AppStateProvider');
  }
  return context;
};