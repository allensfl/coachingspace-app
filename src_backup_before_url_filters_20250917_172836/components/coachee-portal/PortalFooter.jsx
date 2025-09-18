import React from 'react';
import { Lock } from 'lucide-react';

const PortalFooter = () => {
  return (
    <footer className="text-center text-slate-600 text-sm mt-12 space-y-2">
      <p className="flex items-center justify-center gap-2 pt-4"><Lock className="h-4 w-4" /> Dieser Bereich ist Ende-zu-Ende-privat. Dein Coach sieht nur, was du explizit teilst.</p>
      <p>Coaching Portal powered by Coachingspace.</p>
    </footer>
  );
};

export default PortalFooter;