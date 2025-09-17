import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { 
    LayoutDashboard, Users, Calendar, Book, Target, FileText, Folder, Settings, BrainCircuit, Plus, Search
} from 'lucide-react';

export function GlobalCommand({ open, setOpen, coachees, sessions, invoices, documents }) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  const mainActions = [
    { name: 'Neuer Coachee', icon: Plus, command: () => navigate('/coachees') },
    { name: 'Neue Session', icon: Plus, command: () => navigate('/sessions') },
    { name: 'Neue Rechnung', icon: Plus, command: () => navigate('/invoices') },
  ];

  const navigationLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, command: () => navigate('/') },
    { name: 'Coachees', icon: Users, command: () => navigate('/coachees') },
    { name: 'Sessions', icon: Calendar, command: () => navigate('/sessions') },
    { name: 'Journal', icon: Book, command: () => navigate('/journal') },
    { name: 'Toolbox', icon: Target, command: () => navigate('/toolbox') },
    { name: 'Rechnungen', icon: FileText, command: () => navigate('/invoices') },
    { name: 'Dokumente', icon: Folder, command: () => navigate('/documents') },
    { name: 'KI-Coaching', icon: BrainCircuit, command: () => navigate('/ai-coaching') },
    { name: 'Einstellungen', icon: Settings, command: () => navigate('/settings') },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Befehl eingeben oder suchen..." />
      <CommandList>
        <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
        
        <CommandGroup heading="Aktionen">
          {mainActions.map(action => (
            <CommandItem key={action.name} onSelect={() => runCommand(action.command)}>
              <action.icon className="mr-2 h-4 w-4" />
              <span>{action.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Navigation">
          {navigationLinks.map(link => (
            <CommandItem key={link.name} onSelect={() => runCommand(link.command)}>
              <link.icon className="mr-2 h-4 w-4" />
              <span>{link.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />

        {coachees && coachees.length > 0 && (
          <CommandGroup heading="Coachees">
            {coachees.map(coachee => (
              <CommandItem key={`coachee-${coachee.id}`} onSelect={() => runCommand(() => navigate(`/coachees/${coachee.id}`))}>
                <Users className="mr-2 h-4 w-4" />
                <span>{coachee.firstName} {coachee.lastName}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
      </CommandList>
    </CommandDialog>
  );
}