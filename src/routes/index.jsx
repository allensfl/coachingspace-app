import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import InvalidLinkPage from '@/components/InvalidLinkPage';
import CoachingRoom from '@/components/CoachingRoom';
import ToolPresenter from '@/components/ToolPresenter';
import Documents from '@/components/Documents';

const Dashboard = lazy(() => import('@/components/Dashboard'));
const Coachees = lazy(() => import('@/components/Coachees'));
const CoacheeDetail = lazy(() => import('@/components/CoacheeDetail'));
const Sessions = lazy(() => import('@/components/Sessions'));
const SessionPreparation = lazy(() => import('@/components/sessions/SessionPreparation'));
const Invoices = lazy(() => import('@/components/Invoices'));
const InvoiceCreator = lazy(() => import('@/components/invoice-creator/InvoiceCreator'));
const Settings = lazy(() => import('@/components/Settings'));
const AiCoaching = lazy(() => import('@/components/AiCoaching'));
const AiCoachingShared = lazy(() => import('@/components/AiCoachingShared'));
const Journal = lazy(() => import('@/components/Journal'));
const SessionNotes = lazy(() => import('@/components/SessionNotes'));
const SessionNoteEditor = lazy(() => import('@/components/SessionNoteEditor'));
const Toolbox = lazy(() => import('@/components/Toolbox'));
const TaskManager = lazy(() => import('@/components/TaskManager'));
const CoacheePortalLinks = lazy(() => import('@/components/CoacheePortalLinks'));
const CoacheePortal = lazy(() => import('@/components/CoacheePortal'));
const ConsentPage = lazy(() => import('@/components/ConsentPage'));
const StorePage = lazy(() => import('@/components/StorePage'));
const PrivacyPolicyPage = lazy(() => import('@/components/PrivacyPolicyPage'));
const DocumentationPage = lazy(() => import('@/components/DocumentationPage'));
const Profile = lazy(() => import('@/components/Profile'));
import BetaFeedbackForm from '@/components/BetaFeedbackForm';

export const AppRoutes = () => (
  <Routes>
    {/* Externe Routes ohne Layout */}
    <Route path="/portal/:token" element={<CoacheePortal />} />
    <Route path="/consent/:coacheeId" element={<ConsentPage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="/invalid-link" element={<InvalidLinkPage />} />
    <Route path="/ai-coaching/shared" element={<AiCoachingShared />} />
    <Route path="/tool-presenter/:toolId" element={<ToolPresenter />} />
    
    {/* App-Routes unter /app/* MIT Layout */}
    <Route path="/app" element={<Layout />}>
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
      <Route path="ai-coaching" element={<AiCoaching />} />
      <Route path="journal" element={<Journal />} />
      <Route path="session-notes" element={<SessionNotes />} />
      <Route path="session-notes/new" element={<SessionNoteEditor isNew />} />
      <Route path="session-notes/:id" element={<SessionNoteEditor />} />
      <Route path="toolbox" element={<Toolbox />} />
      <Route path="tasks" element={<TaskManager />} />
      <Route path="coaching-room/:id" element={<CoachingRoom />} />
      <Route path="coachee-portal" element={<CoacheePortalLinks />} />
      <Route path="store" element={<StorePage />} />
      <Route path="documentation" element={<DocumentationPage />} />
      <Route path="beta-feedback" element={<BetaFeedbackForm />} />
      <Route path="*" element={<Dashboard />} />
    </Route>
  </Routes>
);