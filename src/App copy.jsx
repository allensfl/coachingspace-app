import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AppStateProvider, useAppStateContext } from '@/context/AppStateContext';
import { ThemeProvider } from '@/hooks/use-theme';
import { Loader2, MessageSquare } from 'lucide-react';
import { AppRoutes } from '@/routes';
import { GlobalCommand } from '@/components/GlobalCommand';
import LandingPage from './pages/LandingPage';
import BetaFeedbackForm from './components/BetaFeedbackForm';

// App-Logik ohne AuthProvider
const AppContent = () => {
  const { state, actions } = useAppStateContext();
  const { isLoading, isCommandOpen, coachees, sessions, invoices, generalDocuments, sessionNotes, recurringInvoices, activePackages, journalEntries, settings } = state;
  const { setCommandOpen, getAllCoacheeDocuments } = actions;
  const location = useLocation();
  
  // Floating Button nur anzeigen wenn nicht auf Landing Page oder Beta-Feedback Seite
  const showFloatingButton = !location.pathname.includes('/landing') && !location.pathname.includes('/beta-feedback');

  if (isLoading) {
    const logoUrl = settings?.company?.logoUrl;
    const companyName = settings?.company?.name || 'Coachingspace';
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        {logoUrl ? (
          <img src={logoUrl} alt={`${companyName} Logo`} className="h-16 w-auto mb-4" />
        ) : (
          <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-3xl mb-4">C</div>
        )}
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <p className="text-lg text-gray-300">Coachingspace wird geladen...</p>
        <p className="text-sm text-gray-400 mt-2">Bitte warte kurz, während deine Daten bereitgestellt werden.</p>
      </div>
    );
  }

  const allDocs = [
    ...(getAllCoacheeDocuments() || []),
    ...(generalDocuments || []),
    ...(sessionNotes || [])
  ];

  const allInvoices = [
    ...(invoices || []),
    ...(recurringInvoices || []),
    ...(activePackages || [])
  ];

  return (
    <>
      <GlobalCommand
        open={isCommandOpen}
        setOpen={setCommandOpen}
        coachees={coachees || []}
        sessions={sessions || []}
        invoices={allInvoices}
        documents={allDocs}
        journalEntries={journalEntries || []}
      />
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Direkt zur App - KEIN AuthProvider mehr */}
          <Route path="/*" element={<AppRoutes />} />
          
          {/* Landing Page über spezielle Route */}
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Beta Feedback Route */}
          <Route path="/beta-feedback" element={<BetaFeedbackForm />} />
        </Routes>
        <Toaster />
      </div>
      
      {/* Beta-Feedback Button */}
      {showFloatingButton && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => window.open('/beta-feedback', '_blank')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            title="Beta-Feedback geben"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm font-medium whitespace-nowrap">
              Beta-Feedback
            </span>
          </button>
        </div>
      )}
    </>
  );
};

// Haupt-App OHNE AuthProvider
const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="coaching-theme">
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  </ThemeProvider>
);

export default App;