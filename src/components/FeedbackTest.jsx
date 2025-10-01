import React from 'react';

const FeedbackTest = () => {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          FEEDBACK FORMULAR - TEST
        </h1>
        <p className="text-slate-300 text-xl">
          Wenn du das hier siehst, funktioniert die Route!
        </p>
        <div className="mt-8 bg-green-500/20 border border-green-500 rounded-lg p-4">
          <p className="text-green-400">✅ Route /app/beta-feedback ist aktiv</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackTest;