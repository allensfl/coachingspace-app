
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Calendar, Book, Wrench, FileText, Banknote, Palette, BrainCircuit, CheckCircle, Zap, Gem, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStateContext } from '@/context/AppStateContext';

const features = [
  {
    category: 'Kernfunktionen',
    items: [
      { name: 'Dashboard', description: 'Deine Kommandozentrale mit allen wichtigen Kennzahlen auf einen Blick.', icon: LayoutDashboard, status: 'active', path: '/' },
      { name: 'Coachee-Verwaltung', description: 'Alle Klientendaten, Notizen und Ziele an einem zentralen, sicheren Ort.', icon: Users, status: 'active', path: '/coachees' },
      { name: 'Session-Planung', description: 'Plane, verwalte und dokumentiere alle deine Coaching-Termine.', icon: Calendar, status: 'active', path: '/sessions' },
      { name: 'Journal', description: 'Dein persönlicher Bereich für Reflexionen und wichtige Erkenntnisse.', icon: Book, status: 'active', path: '/journal' },
      { name: 'Toolbox', description: 'Baue deine eigene Bibliothek an Coaching-Methoden und -Werkzeugen auf.', icon: Wrench, status: 'active', path: '/toolbox' },
    ]
  },
  {
    category: 'Finanzen & Dokumente',
    packageId: 'finance',
    icon: Zap,
    items: [
      { name: 'Rechnungsstellung', description: 'Erstelle und verwalte professionelle Rechnungen mit wenigen Klicks.', icon: FileText, status: 'finance', path: '/invoices' },
      { name: 'Honorarsätze', description: 'Definiere deine Dienstleistungen und Preise für eine schnelle Abrechnung.', icon: Banknote, status: 'finance', path: '/invoices' },
      { name: 'Dokumenten-Management', description: 'Lade Verträge, Protokolle und andere wichtige Unterlagen hoch und verwalte sie.', icon: FileText, status: 'finance', path: '/documents' },
    ]
  },
  {
    category: 'Branding & Anpassung',
    packageId: 'branding',
    icon: Gem,
    items: [
      { name: 'Individuelles Branding', description: 'Passe Farben und Logo an deine eigene Marke an.', icon: Palette, status: 'branding', path: '/settings' },
      { name: 'Eigene Remote-Tools', description: 'Integriere deine bevorzugten Videokonferenz-Tools für einen Schnellstart.', icon: Palette, status: 'branding', path: '/settings' },
    ]
  },
  {
    category: 'Profi-Tools',
    packageId: 'ai',
    icon: BrainCircuit,
    items: [
      { name: 'KI-Coaching Modul', description: 'Nutze ein triadisches Coaching-Modell mit KI-Unterstützung für tiefere Einblicke.', icon: BrainCircuit, status: 'ai', path: '/ai-coaching' },
    ]
  }
];

const FeatureCard = ({ feature, isActivated }) => (
  <Card className="glass-card hover:bg-slate-800/50 transition-all duration-300 group h-full flex flex-col">
    <CardHeader>
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <feature.icon className="h-6 w-6 text-white" />
        </div>
        {isActivated ? (
          <Badge className="bg-green-500/80 text-white border-green-600"><CheckCircle className="h-4 w-4 mr-1" /> Aktiv</Badge>
        ) : (
          <Badge variant="secondary">Gesperrt</Badge>
        )}
      </div>
      <CardTitle className="text-white">{feature.name}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col justify-between">
      <p className="text-slate-400 text-sm mb-4">{feature.description}</p> {/* Changed to slate-400 */}
      {isActivated ? (
        <Button asChild variant="outline" size="sm">
          <Link to={feature.path}>
            Zur Funktion <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      ) : (
        <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
          <Link to="/store">
            Im Store aktivieren <Zap className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </CardContent>
  </Card>
);

export default function FeatureOverview() {
  const { state } = useAppStateContext();
  const { activePackages } = state;
  
  return (
    <>
      <Helmet>
        <title>Funktionsübersicht - Coachingspace</title>
        <meta name="description" content="Entdecke alle verfügbaren und aktivierbaren Funktionen deines Coachingspace." />
      </Helmet>
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Funktionsübersicht</h1>
          <p className="text-slate-400">Entdecke das volle Potenzial deines Coachingspace.</p> {/* Changed to slate-400 */}
        </div>

        {features.map((category, catIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              {category.icon && <category.icon className="h-6 w-6 mr-3 text-primary" />}
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((feature) => {
                const isActivated = feature.status === 'active' || (activePackages && activePackages.includes(feature.status));
                return <FeatureCard key={feature.name} feature={feature} isActivated={isActivated} />;
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
