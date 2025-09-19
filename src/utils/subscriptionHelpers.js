// Helper-Funktionen für Abo-Status
export const subscriptionHelpers = {
  // Prüft ob Coachee aktives Abo hat
  hasActiveSubscription: (coacheeId, recurringInvoices) => {
    return (recurringInvoices || []).some(invoice => 
      invoice.coacheeId === coacheeId && invoice.status === 'active'
    );
  },

  // Prüft ob Coachee pausiertes Abo hat
  hasPausedSubscription: (coacheeId, recurringInvoices) => {
    return (recurringInvoices || []).some(invoice => 
      invoice.coacheeId === coacheeId && invoice.status === 'paused'
    );
  },

  // Holt alle Abos eines Coachees
  getCoacheeSubscriptions: (coacheeId, recurringInvoices) => {
    return (recurringInvoices || []).filter(invoice => 
      invoice.coacheeId === coacheeId
    );
  },

  // Berechnet Abo-Statistiken
  getSubscriptionStats: (recurringInvoices, serviceRates) => {
    const invoices = recurringInvoices || [];
    const active = invoices.filter(inv => inv.status === 'active');
    const paused = invoices.filter(inv => inv.status === 'paused');
    
    // Monatliche Einnahmen aus aktiven Abos
    const monthlyRevenue = active.reduce((sum, invoice) => {
      const rate = (serviceRates || []).find(r => r.id === invoice.rateId);
      const amount = (rate?.price || 0) * invoice.quantity;
      
      // Umrechnung auf monatlich
      const multiplier = invoice.interval === 'yearly' ? 1/12 : 
                        invoice.interval === 'quarterly' ? 1/3 : 1;
      
      return sum + (amount * multiplier);
    }, 0);

    return {
      total: invoices.length,
      active: active.length,
      paused: paused.length,
      monthlyRevenue,
      uniqueCoachees: [...new Set(invoices.map(inv => inv.coacheeId))].length
    };
  },

  // Formatiert Coachee-Name mit Abo-Status für Dropdowns
  formatCoacheeWithStatus: (coachee, recurringInvoices) => {
    const hasActive = subscriptionHelpers.hasActiveSubscription(coachee.id, recurringInvoices);
    const hasPaused = subscriptionHelpers.hasPausedSubscription(coachee.id, recurringInvoices);
    
    let suffix = '';
    if (hasActive) suffix = ' [ABO]';
    else if (hasPaused) suffix = ' [PAUSIERT]';
    
    return `${coachee.firstName} ${coachee.lastName}${suffix}`;
  }
};