import React, { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, X, Database, Video, Gift, MessageSquare } from 'lucide-react';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { id: 'welcome', title: 'Willkommen zur Beta-Testphase!', component: WelcomeStep },
    { id: 'storage', title: 'Deine Daten bleiben lokal', component: StorageStep },
    { id: 'tutorials', title: 'Video-Tutorials für dich', component: TutorialsStep },
    { id: 'feedback', title: 'Dein Feedback ist Gold wert', component: FeedbackStep },
    { id: 'button', title: 'So gibst du Feedback', component: ButtonStep }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
      localStorage.setItem('onboarding_completed', 'true');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsComplete(true);
    localStorage.setItem('onboarding_completed', 'true');
  };

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
            <Check className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Alles klar!</h2>
          <p className="text-slate-400 mb-8">Du bist startklar. Viel Spaß beim Testen von CoachingSpace Beta!</p>
          <button onClick={() => window.location.reload()} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition shadow-lg">
            Los geht's!
          </button>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl max-w-2xl w-full my-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-t-xl relative">
          <button onClick={handleSkip} className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition" title="Überspringen">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-between mb-6 pr-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                  index <= currentStep ? 'bg-white text-blue-600' : 'bg-blue-700 text-white/50'
                }`}>
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 transition ${index < currentStep ? 'bg-white' : 'bg-blue-700/50'}`} />
                )}
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-white">{steps[currentStep].title}</h2>
        </div>

        <div className="p-8">
          <CurrentStepComponent />
        </div>

        <div className="px-8 pb-8 flex justify-between items-center border-t border-slate-700/50 pt-6">
          <button onClick={handlePrev} disabled={currentStep === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            currentStep === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700/50'
          }`}>
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>

          <div className="text-sm text-slate-500">{currentStep + 1} von {steps.length}</div>

          <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-lg">
            {currentStep === steps.length - 1 ? 'Fertig' : 'Weiter'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

function WelcomeStep() {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
        <span className="text-4xl">🎉</span>
      </div>
      <h3 className="text-2xl font-bold text-slate-100 mb-4">Schön, dass du dabei bist!</h3>
      <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
        Du bist einer der ersten Beta-Tester von CoachingSpace. Deine Meinung und dein Feedback helfen uns, die beste Coaching-App zu entwickeln.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium border border-blue-500/30">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        Beta-Version
      </div>
    </div>
  );
}

function StorageStep() {
  return (
    <div className="py-6">
      <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
        <Database className="w-8 h-8 text-green-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-4 text-center">100% Datenschutz garantiert</h3>
      <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-6 mb-4">
        <p className="text-slate-300 leading-relaxed mb-4">
          Alle Daten, die du in der Beta-Version eingibst, werden <strong className="text-slate-100">ausschließlich in deinem Browser (LocalStorage)</strong> gespeichert.
        </p>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Keine Server-Übertragung</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Keine Cloud-Speicherung</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Deine Daten bleiben auf deinem Gerät</span>
          </li>
        </ul>
      </div>
      <p className="text-sm text-slate-500 text-center">Hinweis: Wenn du den Browser-Cache löschst, gehen die Daten verloren.</p>
    </div>
  );
}

function TutorialsStep() {
  const tutorials = [
    { title: 'Erste Schritte', duration: '3 Min', emoji: '🎬' },
    { title: 'Coaching-Session erstellen', duration: '5 Min', emoji: '📝' },
    { title: 'Notizen & Dokumentation', duration: '4 Min', emoji: '📋' }
  ];

  return (
    <div className="py-6">
      <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
        <Video className="w-8 h-8 text-purple-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-4 text-center">Video-Tutorials für dich</h3>
      <p className="text-slate-400 text-center mb-6">Damit du den Einstieg schnell findest, haben wir kurze Video-Tutorials für dich vorbereitet.</p>
      <div className="space-y-3">
        {tutorials.map((tutorial, index) => (
          <div key={index} className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg p-4 transition cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{tutorial.emoji}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-100 group-hover:text-blue-400 transition">{tutorial.title}</h4>
                <p className="text-sm text-slate-500">{tutorial.duration}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition" />
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 text-center mt-6">Du findest die Tutorials jederzeit in der App unter "Hilfe & Doku"</p>
    </div>
  );
}

function FeedbackStep() {
  return (
    <div className="py-6">
      <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
        <Gift className="w-8 h-8 text-amber-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-4 text-center">Dein Feedback ist Gold wert</h3>
      <p className="text-slate-400 text-center mb-6 leading-relaxed">
        Als Dankeschön für deine Unterstützung erhältst du nach der Entwicklung der definitiven Version:
      </p>
      <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border-2 border-amber-500/30 rounded-lg p-6">
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">Gratis-App</p>
              <p className="text-sm text-slate-400">Die vollständige CoachingSpace App kostenlos</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">Alle zukünftigen Updates</p>
              <p className="text-sm text-slate-400">Lebenslanger Zugriff auf alle neuen Features</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-100">Premium-Support</p>
              <p className="text-sm text-slate-400">Direkter Draht zum Entwickler-Team</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ButtonStep() {
  return (
    <div className="py-6">
      <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
        <MessageSquare className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-4 text-center">So gibst du Feedback</h3>
      <p className="text-slate-400 text-center mb-6">Wir haben es dir so einfach wie möglich gemacht:</p>
      
      <div className="space-y-4">
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-100 mb-2">Feedback-Button (empfohlen)</h4>
              <p className="text-sm text-slate-400 mb-3">In der App findest du einen schwebenden Button am rechten Bildschirmrand. Einfach klicken und Feedback geben!</p>
              <div className="inline-flex items-center gap-2 text-xs text-blue-400 bg-blue-600/20 px-3 py-1.5 rounded-full border border-blue-500/30">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                Immer sichtbar
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-5">
          <h4 className="font-semibold text-slate-100 mb-2">Über die Dokumentation</h4>
          <p className="text-sm text-slate-400">In der Dokumentation (Hilfe & Doku) findest du ebenfalls einen Feedback-Button.</p>
        </div>
      </div>

      <p className="text-sm text-slate-500 text-center mt-6 italic">Jedes Feedback hilft uns, CoachingSpace besser zu machen!</p>
    </div>
  );
}

export default OnboardingFlow;
