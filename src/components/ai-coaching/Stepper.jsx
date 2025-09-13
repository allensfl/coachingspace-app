
import React from 'react';

export const phases = [
  { id: 'Phase I', name: 'Problem- & Zielbeschreibung' },
  { id: 'Phase II', name: 'Problemanalyse' },
  { id: 'Phase III', name: 'Lösungsstrategie' },
  { id: 'Phase IV', name: 'Abschluss & Transfer' },
];

export const Stepper = ({ currentPhase, steps }) => (
  <nav aria-label="Progress">
    <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
      {steps.map((step, index) => (
        <li key={step.name} className="md:flex-1">
          {index <= currentPhase ? (
            <div className="group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0" style={{borderColor: index === currentPhase ? 'var(--primary)' : '#4f46e5'}}>
              <span className="text-sm font-medium" style={{color: index === currentPhase ? 'var(--primary)' : '#a5b4fc'}}>{step.id}</span>
              <span className="text-sm font-medium text-white">{step.name}</span>
            </div>
          ) : (
            <div className="group flex flex-col border-l-4 border-gray-600 py-2 pl-4 hover:border-gray-500 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-400"> {/* Changed to gray-500/400 */} {step.id}</span>
              <span className="text-sm font-medium text-gray-400"> {/* Changed to gray-400 */} {step.name}</span>
            </div>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
