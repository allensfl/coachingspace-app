import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/use-theme';
import { AppStateProvider } from '@/context/AppStateContext';
import Layout from '@/components/Layout';

const Dashboard = lazy(() => import('@/components/Dashboard'));
const Coachees = lazy(() => import('@/components/Coachees'));
const CoacheeDetail = lazy(() => import('@/components/CoacheeDetail'));
const Sessions = lazy(() => import('@/components/Sessions'));
const SessionPreparation = lazy(() => import('@/components/sessions/SessionPreparation'));
const Invoices = lazy(() => import('@/components/Invoices'));
const InvoiceCreator = lazy(() => import('@/components/invoice-creator/InvoiceCreator'));
const Settings = lazy(() => import('@/components/Settings'));
const Journal = lazy(() => import('@/components/Journal'));
const SessionNotes = lazy(() => import('@/components/SessionNotes'));
const SessionNoteEditor = lazy(() => import('@/components/SessionNoteEditor'));
const Toolbox = lazy(() => import('@/components/Toolbox'));
const TaskManager = lazy(() => import('@/components/TaskManager'));
const Documents = lazy(() => import('@/components/Documents'));
const Profile = lazy(() => import('@/components/Profile'));
const DocumentationPage = lazy(() => import('@/components/DocumentationPage'));

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
          <Route path="coachees" element={<Coachees />} />
          <Route path="coachees/:id" element={<CoacheeDetail />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="sessions/:sessionId/prepare" element={<SessionPreparation />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/new" element={<InvoiceCreator />} />
          <Route path="invoices/edit/:id" element={<InvoiceCreator />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="journal" element={<Journal />} />
          <Route path="session-notes" element={<SessionNotes />} />
          <Route path="session-notes/new" element={<SessionNoteEditor isNew />} />
          <Route path="session-notes/:id" element={<SessionNoteEditor />} />
          <Route path="toolbox" element={<Toolbox />} />
          <Route path="tasks" element={<TaskManager />} />
          <Route path="documentation" element={<DocumentationPage />} />
          <Route path="*" element={<DocumentationPage />} />
        </Route>
      </Routes>
    </div>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="coaching-theme">
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  </ThemeProvider>
);

export default App;