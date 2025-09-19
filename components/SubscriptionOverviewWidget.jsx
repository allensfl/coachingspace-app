import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Play, Pause, DollarSign, Calendar } from 'lucide-react';
import { subscriptionHelpers } from '../utils/subscriptionHelpers';

export const SubscriptionOverviewWidget = ({ 
  recurringInvoices, 
  serviceRates, 
  coachees,
  onNavigateToSubscriptions 
}) => {
  const stats = subscriptionHelpers.getSubscriptionStats(recurringInvoices, serviceRates);
  
  // Währungsformatierung
  const formatCurrency = (amount, currency = 'EUR') => {
    if (currency === 'CHF') {
      return `CHF${amount.toFixed(0)}`;
    }
    return `${amount.toFixed(0)}€`;
  };

  // Nächste fällige Abos
  const upcomingInvoices = (recurringInvoices || [])
    .filter(inv => inv.status === 'active')
    .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Statistik-Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Aktive Abos</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <Play className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pausierte Abos</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.paused}</p>
              </div>
              <Pause className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Abo-Coachees</p>
                <p className="text-2xl font-bold text-blue-400">{stats.uniqueCoachees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Mtl. Einnahmen</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nächste fällige Abos */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Nächste Abrechnungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingInvoices.length > 0 ? (
            upcomingInvoices.map(invoice => {
              const rate = (serviceRates || []).find(r => r.id === invoice.rateId);
              const coachee = (coachees || []).find(c => c.id === invoice.coacheeId);
              
              return (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">
                      {coachee?.firstName} {coachee?.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{rate?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-400">
                      {formatCurrency((rate?.price || 0) * invoice.quantity)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(invoice.nextDueDate).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-400">Keine aktiven Abonnements</p>
            </div>
          )}
          
          {stats.active > 0 && (
            <Button
              onClick={onNavigateToSubscriptions}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Alle Abonnements verwalten
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};