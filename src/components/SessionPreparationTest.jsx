import React from 'react';
import { useParams } from 'react-router-dom';

export default function SessionPreparationTest() {
  const { sessionId } = useParams();
  
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-white text-2xl">Session Vorbereitung Test</h1>
      <p className="text-slate-300">Session ID: {sessionId}</p>
      <p className="text-slate-300">Komponente lädt erfolgreich!</p>
    </div>
  );
}