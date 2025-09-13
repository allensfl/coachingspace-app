import React from 'react';
import { Helmet } from 'react-helmet-async';
import PrivacyPolicyContent from '@/components/PrivacyPolicyContent';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Datenschutzerklärung - Coachingspace</title>
        <meta name="description" content="Allgemeine Datenschutzerklärung für die Nutzung von Coachingspace." />
      </Helmet>
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/70 p-8 rounded-lg border border-slate-700">
            <PrivacyPolicyContent coachName="Ihr Coach" />
          </div>
        </div>
      </div>
    </>
  );
}