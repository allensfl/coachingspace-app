import React, { useState } from 'react';
import { Star, ArrowLeft, ArrowRight, CheckCircle, User, BarChart3, Users, Calendar, FileText, CreditCard, Zap, MessageSquare } from 'lucide-react';
import { supabase } from '@/supabaseConfig';

const StarRating = ({ rating, setRating, label }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-300">{label}</label>
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`w-6 h-6 ${
            star <= rating ? 'text-yellow-400' : 'text-slate-600'
          } hover:text-yellow-300 transition-colors`}
        >
          <Star className="w-full h-full fill-current" />
        </button>
      ))}
      <span className="ml-2 text-sm text-slate-400">({rating}/10)</span>
    </div>
  </div>
);

const TextArea = ({ value, onChange, label, placeholder, rows = 3 }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-300">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
    />
  </div>
);

const MultipleChoice = ({ value, onChange, options, label }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-300">{label}</label>
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500"
          />
          <span className="text-slate-300">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const BetaFeedbackForm = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Basisdaten
    name: '',
    email: '',
    coachingExperience: '',
    currentTools: '',
    
    // Dashboard
    dashboardRating: 0,
    dashboardFeedback: '',
    
    // Coachees
    coacheesRating: 0,
    coacheesFeedback: '',
    
    // Sessions
    sessionsRating: 0,
    sessionsFeedback: '',
    
    // Notizen
    notesRating: 0,
    notesFeedback: '',
    
    // Rechnungen
    invoicesRating: 0,
    invoicesFeedback: '',
    
    // KI-Coaching
    kiRating: 0,
    kiFeedback: '',
    
    // Gesamteindruck
    overallRating: 0,
    bestFeature: '',
    worstFeature: '',
    missingFeatures: '',
    priceWillingness: '',
    recommendation: '',
    finalFeedback: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sections = [
    {
      title: 'Deine Daten',
      icon: User,
      color: 'text-blue-400'
    },
    {
      title: 'Dashboard',
      icon: BarChart3,
      color: 'text-green-400'
    },
    {
      title: 'Coachees',
      icon: Users,
      color: 'text-purple-400'
    },
    {
      title: 'Sessions',
      icon: Calendar,
      color: 'text-orange-400'
    },
    {
      title: 'Notizen',
      icon: FileText,
      color: 'text-red-400'
    },
    {
      title: 'Rechnungen',
      icon: CreditCard,
      color: 'text-yellow-400'
    },
    {
      title: 'KI-Coaching',
      icon: Zap,
      color: 'text-cyan-400'
    },
    {
      title: 'Gesamteindruck',
      icon: MessageSquare,
      color: 'text-pink-400'
    }
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('beta_feedback')
        .insert([
          {
            user_email: formData.email,
            user_name: formData.name,
            feedback_data: formData
          }
        ]);

      if (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Senden des Feedbacks. Bitte versuche es erneut.');
        setIsSubmitting(false);
        return;
      }

      console.log('Feedback erfolgreich gespeichert:', data);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Fehler:', err);
      alert('Fehler beim Senden des Feedbacks. Bitte versuche es erneut.');
      setIsSubmitting(false);
    }
  };

  const isCurrentSectionValid = () => {
    switch (currentSection) {
      case 0:
        return formData.name && formData.email && formData.coachingExperience;
      case 1:
        return formData.dashboardRating > 0;
      case 2:
        return formData.coacheesRating > 0;
      case 3:
        return formData.sessionsRating > 0;
      case 4:
        return formData.notesRating > 0;
      case 5:
        return formData.invoicesRating > 0;
      case 6:
        return formData.kiRating > 0;
      case 7:
        return formData.overallRating > 0 && formData.recommendation;
      default:
        return true;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-200 mb-4">Vielen Dank!</h2>
          <p className="text-slate-400 mb-6">
            Dein Feedback wurde erfolgreich übermittelt. Du erhältst in den nächsten 48 Stunden 
            deine kostenlose Vollversion per E-Mail.
          </p>
          <button
            onClick={() => window.close()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Fenster schließen
          </button>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Basisdaten
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Dein vollständiger Name"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">E-Mail *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="deine.email@beispiel.de"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <MultipleChoice
              value={formData.coachingExperience}
              onChange={(value) => updateFormData('coachingExperience', value)}
              options={['Anfänger (unter 1 Jahr)', 'Fortgeschritten (1-3 Jahre)', 'Erfahren (3-5 Jahre)', 'Experte (über 5 Jahre)']}
              label="Deine Coaching-Erfahrung *"
            />
            
            <TextArea
              value={formData.currentTools}
              onChange={(value) => updateFormData('currentTools', value)}
              label="Welche Tools nutzt du derzeit für dein Coaching?"
              placeholder="z.B. Excel, Google Calendar, andere Apps..."
            />
          </div>
        );

      case 1: // Dashboard
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                Dashboard-Bewertung
              </h3>
              <StarRating
                rating={formData.dashboardRating}
                setRating={(value) => updateFormData('dashboardRating', value)}
                label="Wie übersichtlich und nützlich ist das Dashboard?"
              />
              <div className="mt-4">
                <TextArea
                  value={formData.dashboardFeedback}
                  onChange={(value) => updateFormData('dashboardFeedback', value)}
                  label="Detailliertes Feedback zum Dashboard"
                  placeholder="Was funktioniert gut? Was könnte verbessert werden?"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Coachees
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Coachees-Verwaltung
              </h3>
              <StarRating
                rating={formData.coacheesRating}
                setRating={(value) => updateFormData('coacheesRating', value)}
                label="Bewertung der Coachee-Verwaltung"
              />
              <div className="mt-4">
                <TextArea
                  value={formData.coacheesFeedback}
                  onChange={(value) => updateFormData('coacheesFeedback', value)}
                  label="Feedback zur Coachee-Verwaltung"
                  placeholder="Profile, Ziele, Kontaktdaten - was fehlt?"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Sessions
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-400" />
                Session-Management
              </h3>
              <StarRating
                rating={formData.sessionsRating}
                setRating={(value) => updateFormData('sessionsRating', value)}
                label="Bewertung des Session-Managements"
              />
              <div className="mt-4">
                <TextArea
                  value={formData.sessionsFeedback}
                  onChange={(value) => updateFormData('sessionsFeedback', value)}
                  label="Feedback zum Session-Management"
                  placeholder="Terminplanung, Vorbereitung, Nachbereitung..."
                />
              </div>
            </div>
          </div>
        );

      case 4: // Notizen
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-400" />
                Session-Notizen
              </h3>
              <StarRating
                rating={formData.notesRating}
                setRating={(value) => updateFormData('notesRating', value)}
                label="Bewertung der Notizen-Funktion"
              />
              <div className="mt-4">
                <TextArea
                  value={formData.notesFeedback}
                  onChange={(value) => updateFormData('notesFeedback', value)}
                  label="Feedback zu den Session-Notizen"
                  placeholder="Übersichtlichkeit, Export-Funktionen..."
                />
              </div>
            </div>
          </div>
        );

      case 5: // Rechnungen
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-yellow-400" />
                Rechnungswesen
              </h3>
              <StarRating
                rating={formData.invoicesRating}
                setRating={(value) => updateFormData('invoicesRating', value)}
                label="Bewertung der Rechnungs-Funktionen"
              />
              <div className="mt-4">
                <TextArea
                  value={formData.invoicesFeedback}
                  onChange={(value) => updateFormData('invoicesFeedback', value)}
                  label="Feedback zum Rechnungswesen"
                  placeholder="Rechnungserstellung, Vorlagen, Export..."
                />
              </div>
            </div>
          </div>
        );

      case 6: // KI-Coaching
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-400" />
                KI-Coaching (Triadisches Coaching)
              </h3>
              <StarRating
                rating={formData.kiRating}
                setRating={(value) => updateFormData('kiRating', value)}
                label="Bewertung des KI-Assistenten"
              />
              <div className="mt-4">
                <TextArea
                  value={formData.kiFeedback}
                  onChange={(value) => updateFormData('kiFeedback', value)}
                  label="Feedback zum KI-Coaching"
                  placeholder="Qualität der KI-Antworten, Nützlichkeit im Coaching..."
                />
              </div>
            </div>
          </div>
        );

      case 7: // Gesamteindruck
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pink-400" />
                Gesamteindruck
              </h3>
              <StarRating
                rating={formData.overallRating}
                setRating={(value) => updateFormData('overallRating', value)}
                label="Gesamtbewertung der CoachingSpace App"
              />
            </div>

            <TextArea
              value={formData.bestFeature}
              onChange={(value) => updateFormData('bestFeature', value)}
              label="Was ist das beste Feature der App?"
              placeholder="Welche Funktion hat dir am meisten geholfen?"
            />

            <TextArea
              value={formData.worstFeature}
              onChange={(value) => updateFormData('worstFeature', value)}
              label="Was stört dich am meisten?"
              placeholder="Welche Funktion ist verbesserungswürdig?"
            />

            <TextArea
              value={formData.missingFeatures}
              onChange={(value) => updateFormData('missingFeatures', value)}
              label="Welche Features fehlen komplett?"
              placeholder="Was würde die App für dich perfekt machen?"
            />

            <MultipleChoice
              value={formData.priceWillingness}
              onChange={(value) => updateFormData('priceWillingness', value)}
              options={['189€ (Basic)', '389€ (Professional)', '689€ (Premium)', 'Zu teuer, würde nicht kaufen']}
              label="Welchen Preis würdest du für die Vollversion zahlen?"
            />

            <MultipleChoice
              value={formData.recommendation}
              onChange={(value) => updateFormData('recommendation', value)}
              options={['Definitiv empfehlen', 'Wahrscheinlich empfehlen', 'Unsicher', 'Eher nicht empfehlen', 'Nicht empfehlen']}
              label="Würdest du CoachingSpace anderen Coaches empfehlen? *"
            />

            <TextArea
              value={formData.finalFeedback}
              onChange={(value) => updateFormData('finalFeedback', value)}
              label="Abschließende Gedanken"
              placeholder="Alles was dir noch wichtig ist..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">CoachingSpace Beta Feedback</h1>
          <p className="text-slate-400">
            Dein strukturiertes Feedback hilft uns die App zu verbessern
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      index === currentSection
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : index < currentSection
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-slate-800 border-slate-600 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs text-center ${section.color} hidden md:block`}>
                    {section.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
          <div className="text-center mt-2 text-slate-400 text-sm">
            Schritt {currentSection + 1} von {sections.length}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              {React.createElement(sections[currentSection].icon, {
                className: `h-6 w-6 ${sections[currentSection].color}`
              })}
              {sections[currentSection].title}
            </h2>
          </div>
          
          {renderSection()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>

          {currentSection === sections.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!isCurrentSectionValid() || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
            >
              {isSubmitting ? 'Wird gesendet...' : 'Feedback senden'}
              <CheckCircle className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              disabled={!isCurrentSectionValid()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
            >
              Weiter
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetaFeedbackForm;