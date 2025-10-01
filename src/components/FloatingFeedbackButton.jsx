import React from 'react';
import { MessageSquare } from 'lucide-react';

export const FloatingFeedbackButton = () => {
  return (
    
      href="https://app-coachingspace.netlify.app/beta-feedback"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-6 bottom-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 group"
      title="Feedback geben"
    >
      <MessageSquare className="w-6 h-6" />
      <span className="absolute right-full mr-3 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 text-slate-100 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Feedback geben
      </span>
    </a>
  );
};