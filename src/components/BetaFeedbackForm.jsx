import React, { useState } from 'react';
import { Star, Send, User, Clock, Target, Bug, Lightbulb, ThumbsUp, ThumbsDown, MessageSquare, Mail, Phone, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vmkfpnqvnccpmpsf.supabase.co';
const supabaseAnonKey = 'DEIN_ANON_KEY_HIER'; // Dein echter Key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BetaFeedbackForm = () => {
  const [formData, setFormData] = useState({
    // Tester-Profil
    name: '',
    email: '',
    coachingExperience: '',
    currentTools: '',
    coacheeCount: '',
    
    // Onboarding Erfahrung
    onboardingRating: 0,
    onboardingFeedback: '',
    setupTime: '',
    
    // Feature-spezifisches Feedback
    coacheeManagement: { rating: 0, feedback: '', mostUseful: '', missing: '' },
    sessionManagement: { rating: 0, feedback: '', mostUseful: '', missing: '' },
    noteSystem: { rating: 0, feedback: '', mostUseful: '', missing: '' },
    invoicing: { rating: 0, feedback: '', mostUseful: '', missing: '' },
    journal: { rating: 0, feedback: '', mostUseful: '', missing: '' },
    
    // Usability
    easeOfUse: 0,
    navigation: 0,
    performance: 0,
    mobileExperience: 0,
    
    // Bugs & Issues
    bugsEncountered: '',
    technicalIssues: '',
    browserUsed: '',
    
    // Business Value
    timesSaved: '',
    workflowImprovement: '',
    willingnessToRecommend: 0,
    pricingFeedback: '',
    
    // Zukünftige Features
    mostWantedFeature: '',
    kiInterest: 0,
    additionalNeeds: '',
    
    // Offenes Feedback
    bestAspect: '',
    worstAspect: '',
    overallSuggestion: '',
    additionalComments: ''
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const sections = [
    { id: 'profile', title: 'Dein Profil', icon: User },
    { id: 'onboarding', title: 'Onboarding', icon: Target },
    { id: 'features', title: 'Feature-Bewertung', icon: ThumbsUp },
    { id: 'usability', title: 'Benutzerfreundlichkeit', icon: MessageSquare },
    { id: 'technical', title: 'Technische Aspekte', icon: Bug },
    { id: 'business', title: 'Business Value', icon: Briefcase },
    { id: 'future', title: 'Zukunft & KI', icon: Lightbulb },
    { id: 'open', title: 'Offenes Feedback', icon: MessageSquare }
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.email) {
        throw new Error('Name und E-Mail sind Pflichtfelder');
      }

      // Find corresponding beta user
      const { data: betaUser } = await supabase
        .from('beta_users')
        .select('id')
        .eq('email', formData.email)
        .single();

      // Submit feedback
      const { data, error } = await supabase
        .from('beta_feedback')
        .insert([{
          user_email: formData.email,
          user_name: formData.name,
          feedback_data: formData,
          beta_user_id: betaUser?.id || null,
          submitted_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      setSubmitStatus('success');
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        window.location.href = '/app';
      }, 3000);

    } catch (err) {
      console.error('Feedback submission error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }) => (
    <div className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 ${star <= value ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-300 transition-colors`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  const TextArea = ({ value, onChange, label, placeholder, rows = 3 }) => (
    <div className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-500 transition-colors resize-none"
      />
    </div>
  );

  const Input = ({ value, onChange, label, placeholder, type = "text", required = false }) => (
    <div className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-500 transition-colors"
      />
    </div>
  );

  const Select = ({ value, onChange, label, options }) => (
    <div className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-500 transition-colors appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '16px'
        }}
      >
        <option value="" className="bg-slate-800 text-slate-400">Bitte auswählen...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-800 text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const FeatureRating = ({ feature, data, onChange, title }) => (
    <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700">
      <h4 className="text-white font-semibold mb-3">{title}</h4>
      <StarRating
        value={data.rating}
        onChange={(rating) => onChange({ ...data, rating })}
        label="Gesamtbewertung"
      />
      <TextArea
        value={data.feedback}
        onChange={(feedback) => onChange({ ...data, feedback })}
        label="Was funktioniert gut/schlecht?"
        placeholder="Beschreibe deine Erfahrung..."
      />
      <Input
        value={data.mostUseful}
        onChange={(mostUseful) => onChange({ ...data, mostUseful })}
        label="Nützlichste Funktion"
        placeholder="Was verwendest du am häufigsten?"
      />
      <Input
        value={data.missing}
        onChange={(missing) => onChange({ ...data, missing })}
        label="Was fehlt dir?"
        placeholder="Welche Funktionen würdest du dir wünschen?"
      />
    </div>
  );

  // Success Screen
  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="max-w-lg mx-auto bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Vielen Dank für dein Feedback!
          </h2>
          <p className="text-slate-300 mb-6">
            Dein detailliertes Feedback wurde erfolgreich übermittelt und hilft uns dabei, 
            CoachingSpace zu verbessern.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-blue-400 text-sm">
              Du wirst in wenigen Sekunden zur App weitergeleitet...
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/app'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Zurück zur App
          </button>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (sections[currentSection].id) {
      case 'profile':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Erzähl uns von dir</h3>
            <Input
              value={formData.name}
              onChange={(name) => setFormData({...formData, name})}
              label="Name"
              placeholder="Dein Name"
              required
            />
            <Input
              value={formData.email}
              onChange={(email) => setFormData({...formData, email})}
              label="Email"
              placeholder="deine@email.de"
              type="email"
              required
            />
            <Select
              value={formData.coachingExperience}
              onChange={(coachingExperience) => setFormData({...formData, coachingExperience})}
              label="Coaching-Erfahrung"
              options={[
                { value: 'beginner', label: 'Anfänger (0-1 Jahre)' },
                { value: 'intermediate', label: 'Fortgeschritten (2-5 Jahre)' },
                { value: 'experienced', label: 'Erfahren (5-10 Jahre)' },
                { value: 'expert', label: 'Experte (10+ Jahre)' }
              ]}
            />
            <Input
              value={formData.currentTools}
              onChange={(currentTools) => setFormData({...formData, currentTools})}
              label="Welche Tools nutzt du aktuell?"
              placeholder="z.B. Excel, Notion, Calendly..."
            />
            <Select
              value={formData.coacheeCount}
              onChange={(coacheeCount) => setFormData({...formData, coacheeCount})}
              label="Anzahl aktiver Coachees"
              options={[
                { value: '1-5', label: '1-5 Coachees' },
                { value: '6-15', label: '6-15 Coachees' },
                { value: '16-30', label: '16-30 Coachees' },
                { value: '30+', label: 'Mehr als 30 Coachees' }
              ]}
            />
          </div>
        );

      case 'onboarding':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Onboarding-Erfahrung</h3>
            <StarRating
              value={formData.onboardingRating}
              onChange={(onboardingRating) => setFormData({...formData, onboardingRating})}
              label="Wie war der Einstieg in CoachingSpace?"
            />
            <Select
              value={formData.setupTime}
              onChange={(setupTime) => setFormData({...formData, setupTime})}
              label="Wie lange hat das Setup gedauert?"
              options={[
                { value: '5min', label: 'Unter 5 Minuten' },
                { value: '10min', label: '5-10 Minuten' },
                { value: '20min', label: '10-20 Minuten' },
                { value: '30min', label: '20-30 Minuten' },
                { value: '30min+', label: 'Über 30 Minuten' }
              ]}
            />
            <TextArea
              value={formData.onboardingFeedback}
              onChange={(onboardingFeedback) => setFormData({...formData, onboardingFeedback})}
              label="Onboarding-Feedback"
              placeholder="Was war verwirrend? Was war hilfreich? Verbesserungsvorschläge..."
              rows={4}
            />
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Feature-Bewertung</h3>
            <FeatureRating
              feature="coacheeManagement"
              data={formData.coacheeManagement}
              onChange={(data) => setFormData({...formData, coacheeManagement: data})}
              title="👥 Coachee-Verwaltung"
            />
            <FeatureRating
              feature="sessionManagement"
              data={formData.sessionManagement}
              onChange={(data) => setFormData({...formData, sessionManagement: data})}
              title="⏰ Session-Management"
            />
            <FeatureRating
              feature="noteSystem"
              data={formData.noteSystem}
              onChange={(data) => setFormData({...formData, noteSystem: data})}
              title="📝 Notizen-System"
            />
            <FeatureRating
              feature="invoicing"
              data={formData.invoicing}
              onChange={(data) => setFormData({...formData, invoicing: data})}
              title="💰 Rechnungswesen"
            />
            <FeatureRating
              feature="journal"
              data={formData.journal}
              onChange={(data) => setFormData({...formData, journal: data})}
              title="📔 Reflexionstagebuch"
            />
          </div>
        );

      case 'usability':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Benutzerfreundlichkeit</h3>
            <StarRating
              value={formData.easeOfUse}
              onChange={(easeOfUse) => setFormData({...formData, easeOfUse})}
              label="Wie einfach ist CoachingSpace zu bedienen?"
            />
            <StarRating
              value={formData.navigation}
              onChange={(navigation) => setFormData({...formData, navigation})}
              label="Wie intuitiv ist die Navigation?"
            />
            <StarRating
              value={formData.performance}
              onChange={(performance) => setFormData({...formData, performance})}
              label="Wie bewertest du die Geschwindigkeit/Performance?"
            />
            <StarRating
              value={formData.mobileExperience}
              onChange={(mobileExperience) => setFormData({...formData, mobileExperience})}
              label="Mobile Erfahrung (falls getestet)"
            />
          </div>
        );

      case 'technical':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Technische Aspekte</h3>
            <Select
              value={formData.browserUsed}
              onChange={(browserUsed) => setFormData({...formData, browserUsed})}
              label="Welchen Browser hast du hauptsächlich verwendet?"
              options={[
                { value: 'chrome', label: 'Google Chrome' },
                { value: 'firefox', label: 'Mozilla Firefox' },
                { value: 'safari', label: 'Safari' },
                { value: 'edge', label: 'Microsoft Edge' },
                { value: 'other', label: 'Anderer Browser' }
              ]}
            />
            <TextArea
              value={formData.bugsEncountered}
              onChange={(bugsEncountered) => setFormData({...formData, bugsEncountered})}
              label="Welche Bugs oder Fehler sind dir aufgefallen?"
              placeholder="Beschreibe konkrete Probleme: Was ist passiert? In welcher Situation? Was hast du erwartet?"
              rows={4}
            />
            <TextArea
              value={formData.technicalIssues}
              onChange={(technicalIssues) => setFormData({...formData, technicalIssues})}
              label="Sonstige technische Probleme"
              placeholder="Langsame Ladezeiten, Layout-Probleme, etc."
              rows={3}
            />
          </div>
        );

      case 'business':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Business Value</h3>
            <TextArea
              value={formData.timesSaved}
              onChange={(timesSaved) => setFormData({...formData, timesSaved})}
              label="Wie viel Zeit spart dir CoachingSpace?"
              placeholder="Pro Tag/Woche gesparte Zeit und wobei konkret..."
              rows={3}
            />
            <TextArea
              value={formData.workflowImprovement}
              onChange={(workflowImprovement) => setFormData({...formData, workflowImprovement})}
              label="Wie hat sich dein Coaching-Workflow verbessert?"
              placeholder="Was ist jetzt einfacher/besser als vorher?"
              rows={3}
            />
            <StarRating
              value={formData.willingnessToRecommend}
              onChange={(willingnessToRecommend) => setFormData({...formData, willingnessToRecommend})}
              label="Wie wahrscheinlich würdest du CoachingSpace weiterempfehlen?"
            />
            <TextArea
              value={formData.pricingFeedback}
              onChange={(pricingFeedback) => setFormData({...formData, pricingFeedback})}
              label="Preisgestaltung & Wert"
              placeholder="Was wäre dir diese Lösung wert? Preisvorstellungen für Core & KI-Add-On?"
              rows={3}
            />
          </div>
        );

      case 'future':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Zukunft & KI-Features</h3>
            <Input
              value={formData.mostWantedFeature}
              onChange={(mostWantedFeature) => setFormData({...formData, mostWantedFeature})}
              label="Welches Feature wünschst du dir am meisten?"
              placeholder="Was würde dir am meisten helfen?"
            />
            <StarRating
              value={formData.kiInterest}
              onChange={(kiInterest) => setFormData({...formData, kiInterest})}
              label="Wie interessant sind KI-Features für dich?"
            />
            <TextArea
              value={formData.additionalNeeds}
              onChange={(additionalNeeds) => setFormData({...formData, additionalNeeds})}
              label="Was fehlt dir noch für dein perfektes Coaching-Tool?"
              placeholder="Integrationen, spezielle Features, Workflows..."
              rows={4}
            />
          </div>
        );

      case 'open':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Offenes Feedback</h3>
            <TextArea
              value={formData.bestAspect}
              onChange={(bestAspect) => setFormData({...formData, bestAspect})}
              label="Was gefällt dir am besten an CoachingSpace?"
              placeholder="Was sind die Highlights für dich?"
              rows={3}
            />
            <TextArea
              value={formData.worstAspect}
              onChange={(worstAspect) => setFormData({...formData, worstAspect})}
              label="Was gefällt dir am wenigsten?"
              placeholder="Was stört dich oder könnte besser sein?"
              rows={3}
            />
            <TextArea
              value={formData.overallSuggestion}
              onChange={(overallSuggestion) => setFormData({...formData, overallSuggestion})}
              label="Dein wichtigster Verbesserungsvorschlag"
              placeholder="Wenn du eine Sache ändern könntest, was wäre das?"
              rows={3}
            />
            <TextArea
              value={formData.additionalComments}
              onChange={(additionalComments) => setFormData({...formData, additionalComments})}
              label="Sonstige Kommentare"
              placeholder="Alles weitere, was du uns mitteilen möchtest..."
              rows={4}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            CoachingSpace Beta-Test Feedback
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Vielen Dank, dass du uns beim Verbessern von CoachingSpace hilfst! 
            Dein detailliertes Feedback ist wertvoll für die Weiterentwicklung.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">
              Abschnitt {currentSection + 1} von {sections.length}
            </span>
            <span className="text-sm text-slate-400">
              {Math.round(((currentSection + 1) / sections.length) * 100)}% fertig
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentSection === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <section.icon className="h-4 w-4" />
              {section.title}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          {renderSection()}
        </div>

        {/* Error Display */}
        {submitStatus === 'error' && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-8 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Feedback konnte nicht gesendet werden. Bitte versuche es erneut.
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Zurück
          </button>

          {currentSection === sections.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.email}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Feedback senden
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Weiter
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-400">
          <p>Geschätzte Zeit: 15-20 Minuten | Deine Daten werden DSGVO-konform behandelt</p>
        </div>
      </div>
    </div>
  );
};

export default BetaFeedbackForm;