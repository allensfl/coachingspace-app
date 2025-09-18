import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Zap, BrainCircuit, Gem } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStateContext } from '@/context/AppStateContext';

const packages = [
  {
    id: 'finance',
    name: 'Finanz & Doku Paket',
    price: '9,99 €',
    features: ['Rechnungen erstellen & verwalten', 'Honorarsätze definieren', 'Dokumenten-Management', 'Sichere Dokumentenablage'],
    icon: Zap,
    color: 'text-green-400',
  },
  {
    id: 'branding',
    name: 'Branding Paket',
    price: '7,99 €',
    features: ['Eigenes Logo & Firmenfarben', 'Angepasste Rechnungen', 'Personalisierter App-Name', 'Eigene Remote-Tool Links'],
    icon: Gem,
    color: 'text-purple-400',
  },
   {
    id: 'ai',
    name: 'KI-Coaching Paket',
    price: '14,99 €',
    features: ['Triadisches Coaching-Modul', 'KI-gestützte Problemanalyse', 'Phasenbasierter Prozess', 'Methoden für Remote & Präsenz'],
    icon: BrainCircuit,
    color: 'text-blue-400',
  }
];

export default function StorePage() {
  const { state, actions } = useAppStateContext();
  const { activePackages } = state;
  const { activatePackage } = actions;

  return (
    <>
      <Helmet>
        <title>Store - Pakete erweitern - Coachingspace</title>
        <meta name="description" content="Erweitere die Funktionalität deines Coachingspace mit Premium-Paketen für Finanzen, Branding und mehr." />
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Store</h1>
          <p className="text-slate-400">Erweitere deinen Coachingspace mit leistungsstarken Paketen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const isActivated = activePackages && activePackages.includes(pkg.id);
            return (
              <Card key={pkg.id} className={`glass-card flex flex-col ${isActivated ? 'border-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <pkg.icon className={`h-8 w-8 mb-4 ${pkg.color}`} />
                    {isActivated && <Badge className="bg-green-500/80">Aktiviert</Badge>}
                  </div>
                  <CardTitle className="text-white">{pkg.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">{pkg.price} <span className="text-sm font-normal text-slate-400">/ Monat</span></CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-auto"
                    disabled={isActivated}
                    onClick={() => activatePackage(pkg.id)}
                  >
                    {isActivated ? 'Bereits aktiviert' : 'Paket aktivieren'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}