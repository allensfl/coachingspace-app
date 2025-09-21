import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AppStateProvider, useAppStateContext } from '@/context/AppStateContext';
import { ThemeProvider } from '@/hooks/use-theme';
import { AuthProvider } from './components/auth/AuthProvider';
import { Loader2 } from 'lucide-react';
import { AppRoutes } from '@/routes';
import { GlobalCommand } from '@/components/GlobalCommand';
import LandingPage from './pages/LandingPage';

// Deine bestehende App-Logik
const AppContent = () => {
  const { state, actions } = useAppStateContext();
  const { isLoading, isCommandOpen, coachees, sessions, invoices, generalDocuments, sessionNotes, recurringInvoices, activePackages, journalEntries, settings } = state;
  const { setCommandOpen, getAllCoacheeDocuments } = actions;

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
          {/* Landing Page Route */}
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Alle anderen Routes */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <ThemeProvider defaultTheme="light" storageKey="coaching-theme">
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default App;