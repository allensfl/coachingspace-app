import React from 'react';
import { Badge } from '@/components/ui/badge';
import { subscriptionHelpers } from '../../utils/subscriptionHelpers';

export const CoacheeSubscriptionBadge = ({ 
  coacheeId, 
  recurringInvoices, 
  size = 'sm',
  showPaused = true 
}) => {
  const hasActive = subscriptionHelpers.hasActiveSubscription(coacheeId, recurringInvoices);
  const hasPaused = subscriptionHelpers.hasPausedSubscription(coacheeId, recurringInvoices);

  if (hasActive) {
    return (
      <Badge className={`bg-green-500 text-white ${size === 'xs' ? 'text-xs px-1 py-0' : ''}`}>
        ABO
      </Badge>
    );
  }

  if (hasPaused && showPaused) {
    return (
      <Badge className={`bg-yellow-500 text-black ${size === 'xs' ? 'text-xs px-1 py-0' : ''}`}>
        PAUSIERT
      </Badge>
    );
  }

  return null;
};