import React from 'react';
import { MessageSquare } from 'lucide-react';

const FloatingFeedbackButton = () => {
  return (
    <a
      href="https://feedback-beta-coachingspace.netlify.app"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-50 flex items-center gap-2"
    >
      <MessageSquare size={24} />
      <span className="font-medium">Hier Feedback geben</span>
    </a>
  );
};

export default FloatingFeedbackButton;