import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jlvmkfpjnqvtnqepmpsf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsdm1rZnBqbnF2dG5xZXBtcHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MzE3MjMsImV4cCI6MjA3MzUwNzcyM30.xdltEUoQC5zK6Im6NIJBBmHy2XzR36A9NoarPTwatbQ'; // Dein echter Key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BetaLandingPage = () => {
  const [currentStep, setCurrentStep] = useState('landing'); // landing, success, login, password, app
  const [availableSpots, setAvailableSpots] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    experience: '',
    coacheeCount: ''
  });
  
  // Login states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  // User data from successful signup/login
  const [userData, setUserData] = useState(null);

  // Load available spots
  const loadAvailableSpots = async () => {
    try {
      const { count, error } = await supabase
        .from('beta_users')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      setAvailableSpots(Math.max(0, 10 - (count || 0)));
    } catch (err) {
      console.error('Error loading spots:', err);
      setAvailableSpots(8); // Fallback
    }
  };

  useEffect(() => {
    loadAvailableSpots();
  }, []);

  // Handle beta signup
  const handleBetaSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('beta_users')
        .select('email')
        .eq('email', formData.email);

      if (checkError) throw checkError;

      if (existingUsers && existingUsers.length > 0) {
        setError('Diese E-Mail-Adresse ist bereits registriert.');
        setLoading(false);
        return;
      }

      // Get current count for spot number
      const { count } = await supabase
        .from('beta_users')
        .select('*', { count: 'exact', head: true });

      const spotNumber = (count || 0) + 1;

      // Insert new beta user
      const { data, error: insertError } = await supabase
        .from('beta_users')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          company: formData.company,
          experience: formData.experience,
          coachee_count: formData.coacheeCount,
          beta_spot_number: spotNumber,
          temp_password: 'beta2024temp!',
          password_changed: false,
          created_at: new Date().toISOString()
        }])
        .select();

      if (insertError) throw insertError;

      setUserData(data[0]);
      setCurrentStep('success');
      loadAvailableSpots();

    } catch (err) {
      console.error('Signup error:', err);
      setError('Anmeldung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check against beta_users table
      const { data: user, error } = await supabase
        .from('beta_users')
        .select('*')
        .eq('email', loginData.email)
        .single();

      if (error || !user) {
        setError('E-Mail nicht gefunden. Hast du dich für die Beta registriert?');
        setLoading(false);
        return;
      }

      // Check password
      const passwordToCheck = user.password_changed ? user.new_password : user.temp_password;
      
      if (loginData.password !== passwordToCheck) {
        // Update login attempts
        await supabase
          .from('beta_users')
          .update({ login_attempts: (user.login_attempts || 0) + 1 })
          .eq('email', loginData.email);
        
        setError('Falsches Passwort. Verwende das temporäre Passwort aus der E-Mail.');
        setLoading(false);
        return;
      }

      setUserData(user);
      
      // If password not changed yet, go to password change
      if (!user.password_changed) {
        setCurrentStep('password');
      } else {
        setCurrentStep('app');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Anmeldung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwörter stimmen nicht überein.');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen haben.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('beta_users')
        .update({ 
          new_password: passwordData.newPassword,
          password_changed: true
        })
        .eq('email', userData.email);

      if (error) throw error;

      setSuccess('Passwort erfolgreich geändert!');
      setTimeout(() => setCurrentStep('app'), 2000);

    } catch (err) {
      console.error('Password change error:', err);
      setError('Passwort-Änderung fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  // Render different steps
  const renderLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            CoachingSpace <span className="text-blue-400">Beta</span>
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Die All-in-One Plattform für professionelles Coaching
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            Noch {availableSpots} Beta-Plätze verfügbar
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">
            Entdecke die CoachingSpace Platform
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <img 
                src="./screenshots/dashboard.png" 
                alt="Dashboard Übersicht" 
                className="w-full h-40 object-contain bg-slate-800 rounded-lg border border-slate-600 mb-3"
              />
              <h4 className="text-white font-medium">Dashboard Übersicht</h4>
              <p className="text-slate-400 text-sm">Coachee-Management & Task-Tracking</p>
            </div>
            
            <div className="text-center">
              <img 
                src="./screenshots/coaching-room.png" 
                alt="Coaching Room" 
                className="w-full h-40 object-contain bg-slate-800 rounded-lg border border-slate-600 mb-3"
              />
              <h4 className="text-white font-medium">🟢 Coaching Room</h4>
              <p className="text-slate-400 text-sm">Komplettes Remote-Cockpit</p>
            </div>
            
            <div className="text-center">
              <img 
                src="./screenshots/session-prep.png" 
                alt="Session Vorbereitung" 
                className="w-full h-40 object-contain bg-slate-800 rounded-lg border border-slate-600 mb-3"
              />
              <h4 className="text-white font-medium">Session-Planung</h4>
              <p className="text-slate-400 text-sm">Strukturierte Coaching-Ansätze</p>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">🎯 Hauptfeatures</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• Coachee-Verwaltung & Profile</li>
                <li>• Session-Dokumentation & Journal</li>
                <li>• Task-Management & Deadlines</li>
                <li>• 🟢 Coaching Room (Remote-Cockpit)</li>
                <li>• 🟣 Coachee-Portal (separater Zugang)</li>
                <li>• 🟡 KI-Assistent (geplant)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">💎 Beta-Vorteile</h4>
              <ul className="text-slate-300 space-y-2">
                <li>• <strong>Lebenslange Vollversion-Lizenz</strong></li>
                <li>• Wert: 99€/Monat (regulärer Preis)</li>
                <li>• Direkter Einfluss auf Entwicklung</li>
                <li>• Exklusiver Beta-Tester Status</li>
                <li>• Persönlicher Support</li>
                <li>• Alle zukünftigen Updates inklusive</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Beta Signup Form */}
        <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Jetzt Beta-Tester werden
          </h2>

          <form onSubmit={handleBetaSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Vorname *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Max"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nachname *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mustermann"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                E-Mail-Adresse *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="max@beispiel.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Unternehmen
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Coaching Praxis GmbH"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Coaching-Erfahrung
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="" disabled>Erfahrung wählen</option>
                  <option value="Neueinsteiger">Neueinsteiger</option>
                  <option value="1-2 Jahre">1-2 Jahre</option>
                  <option value="3-5 Jahre">3-5 Jahre</option>
                  <option value="5+ Jahre">5+ Jahre</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Anzahl Coachees (optional)
                </label>
                <select
                  value={formData.coacheeCount}
                  onChange={(e) => setFormData({...formData, coacheeCount: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="" disabled>Anzahl wählen</option>
                  <option value="1-5">1-5</option>
                  <option value="6-15">6-15</option>
                  <option value="16-30">16-30</option>
                  <option value="30+">30+</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || availableSpots === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Wird gesendet...' : `Beta-Platz reservieren (${availableSpots}/10)`}
            </button>
          </form>

          {/* Beta Bedingungen */}
          <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
            <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
              ⚠️ Wichtig: Bedingungen für kostenlose Vollversion
            </h4>
            <div className="text-slate-300 space-y-2">
              <p><strong>1. Intensive Testphase:</strong> Alle 7 Hauptbereiche gründlich testen (mindestens 2 Stunden)</p>
              <p><strong>2. Detailliertes Feedback:</strong> Strukturiertes Formular per E-Mail ausfüllen</p>
              <p><strong>3. Spezifische Anforderungen:</strong> Mindestens 3 Probleme + 3 Verbesserungsvorschläge</p>
            </div>
            <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">
                <strong>Warnung:</strong> Oberflächliches Feedback wie "App ist cool" berechtigt NICHT zur kostenlosen Vollversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="max-w-lg mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Willkommen, Beta-Tester #{userData?.beta_spot_number}!
        </h2>
        
        <p className="text-slate-300 mb-8">
          Du hast erfolgreich einen Beta-Platz reserviert. Hier sind deine Login-Daten:
        </p>
        
        <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">🔑 Deine Zugangsdaten</h3>
          <div className="space-y-3 text-left">
            <div>
              <span className="text-slate-400">E-Mail:</span>
              <div className="bg-slate-800 px-3 py-2 rounded mt-1 text-white font-mono">
                {userData?.email}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Temporäres Passwort:</span>
              <div className="bg-slate-800 px-3 py-2 rounded mt-1 text-white font-mono">
                beta2024temp!
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
          <p className="text-blue-400 text-sm">
            <strong>Nächster Schritt:</strong> Gehe zur Login-Seite und melde dich mit diesen Daten an. 
            Du wirst aufgefordert, ein neues Passwort zu setzen.
          </p>
        </div>
        
        <button
          onClick={() => setCurrentStep('login')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Zur Login-Seite
        </button>
      </div>
    </div>
  );

  const renderLoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Beta-Tester Login
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              required
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Deine Beta-E-Mail"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Passwort
            </label>
            <input
              type="password"
              required
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="beta2024temp! oder dein neues Passwort"
            />
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Anmeldung...' : 'Anmelden'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentStep('landing')}
            className="text-slate-400 hover:text-white text-sm"
          >
            ← Zurück zur Landing Page
          </button>
        </div>
      </div>
    </div>
  );

  const renderPasswordChangePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Neues Passwort setzen
        </h2>
        
        <p className="text-slate-300 text-center mb-8">
          Hallo {userData?.first_name}! Bitte setze ein neues, sicheres Passwort für dein Beta-Konto.
        </p>
        
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Neues Passwort
            </label>
            <input
              type="password"
              required
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mindestens 6 Zeichen"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Passwort bestätigen
            </label>
            <input
              type="password"
              required
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Passwort wiederholen"
            />
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Wird gesetzt...' : 'Passwort setzen'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderAppRedirect = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Setup erfolgreich!
        </h2>
        
        <p className="text-slate-300 mb-8">
          Willkommen in der CoachingSpace Beta! Du wirst nun zur App weitergeleitet.
        </p>
        
        <button
          onClick={() => {
            // Hier zur echten App weiterleiten
            window.location.href = '/app';
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          CoachingSpace Beta starten
        </button>
        
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 text-sm">
            <strong>Deine nächsten Schritte:</strong><br/>
            1. App erkunden (alle 7 Module)<br/>
            2. Mindestens 2 Stunden testen<br/>
            3. Strukturiertes Feedback per E-Mail
          </p>
        </div>
      </div>
    </div>
  );

  // Main render
  switch (currentStep) {
    case 'landing':
      return renderLandingPage();
    case 'success':
      return renderSuccessScreen();
    case 'login':
      return renderLoginPage();
    case 'password':
      return renderPasswordChangePage();
    case 'app':
      return renderAppRedirect();
    default:
      return renderLandingPage();
  }
};

export default BetaLandingPage;