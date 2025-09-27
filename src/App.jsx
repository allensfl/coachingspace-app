import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/use-theme';
import { AppStateProvider } from '@/context/AppStateContext';
import Layout from '@/components/Layout';

const Dashboard = lazy(() => import('@/components/Dashboard'));
// const Coachees = lazy(() => import('@/components/Coachees'));
const Sessions = lazy(() => import('@/components/Sessions'));

// Minimale Coachees-Ersatz
const MinimalCoachees = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white">Coachees</h1>
      <p className="text-slate-400 mt-4">Coachee-Liste wird geladen...</p>
      <div className="bg-slate-800 p-6 rounded-lg mt-6">
        <p className="text-white">Die vollständige Coachees-Komponente wird in Kürze verfügbar sein.</p>
      </div>
    </div>
  );
};

// Schritt 7: Echte Komponenten hinzufügen
const TestDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-green-400">✓ Fallback funktioniert!</h1>
      <p>Diese Seite existiert noch nicht.</p>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/test" element={
          <div className="min-h-screen bg-slate-900 text-white p-8">
            <h2 className="text-2xl text-green-400">✓ Debug-Route funktioniert!</h2>
          </div>
        } />
        <Route path="" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="coachees" element={<MinimalCoachees />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="*" element={<TestDashboard />} />
        </Route>
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="coaching-theme">
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </ThemeProvider>
  );
};

export default App;