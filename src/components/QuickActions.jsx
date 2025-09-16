import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar, 
  FileText, 
  Receipt, 
  Users, 
  Download,
  BookOpen
} from 'lucide-react';

const QuickActions = () => {
  const quickActions = [
    {
      icon: Calendar,
      label: 'Neue Session',
      description: 'Termin buchen',
      action: () => {
        window.location.href = '/sessions';
      },
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Users,
      label: 'Coachee hinzufügen',
      description: 'Neuen Kunden anlegen',
      action: () => {
        window.location.href = '/coachees';
      },
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Plus,
      label: 'Task erstellen',
      description: 'Neue Aufgabe',
      action: () => {
        window.location.href = '/tasks';
      },
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Receipt,
      label: 'Rechnung erstellen',
      description: 'Neue Rechnung',
      action: () => {
        window.location.href = '/invoices';
      },
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      icon: BookOpen,
      label: 'Journal-Eintrag',
      description: 'Notiz schreiben',
      action: () => {
        window.location.href = '/journal';
      },
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      icon: Download,
      label: 'Backup erstellen',
      description: 'Daten sichern',
      action: () => {
        if (window.confirm('Backup aller Daten erstellen?')) {
          alert('Backup wird erstellt...');
        }
      },
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10'
    },
    {
      icon: FileText,
      label: 'Dokument hochladen',
      description: 'Datei hinzufügen',
      action: () => {
        window.location.href = '/documents';
      },
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
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
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-background/50"
              onClick={action.action}
            >
              <div className={`p-2 rounded-lg mr-3 ${action.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${action.color}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          );
        })}
        
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Schnelle Aktionen für deinen Coaching-Alltag
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;