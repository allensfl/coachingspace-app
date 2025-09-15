import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Receipt, FileText, Users, Calendar, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const quickActions = [
    {
      label: 'Neue Session',
      icon: Calendar,
      route: '/sessions',
      variant: 'default',
      description: 'Session buchen'
    },
    {
      label: 'Schnelle Notiz',
      icon: FileText,
      route: '/session-notes/new',
      variant: 'outline',
      description: 'Notiz erfassen'
    },
    {
      label: 'Rechnung erstellen',
      icon: Receipt,
      route: '/invoices/new',
      variant: 'outline',
      description: 'Neue Rechnung'
    },
    {
      label: 'Neuer Coachee',
      icon: Users,
      route: '/coachees',
      variant: 'outline',
      description: 'Coachee hinzufügen'
    }
  ];

  return (
    <Card className="glass-card-enhanced">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium text-foreground">
          <Plus className="mr-2 h-4 w-4 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Link key={index} to={action.route} className="block">
              <Button 
                className="w-full justify-start h-auto p-3 text-left" 
                variant={action.variant}
                onClick={(e) => {
                  // Für Quick Notiz verwende eine andere Route
                  if (action.route === '/session-notes/new') {
                    e.preventDefault();
                    window.location.href = '/session-notes';
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
        
        {/* Zusätzliche Quick-Funktionen */}
        <div className="pt-2 border-t border-border/50 mt-3">
          <p className="text-xs text-muted-foreground mb-2">Weitere Aktionen</p>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/tasks">
              <Button size="sm" variant="ghost" className="w-full text-xs">
                Aufgaben
              </Button>
            </Link>
            <Link to="/documents">
              <Button size="sm" variant="ghost" className="w-full text-xs">
                Dokumente
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;