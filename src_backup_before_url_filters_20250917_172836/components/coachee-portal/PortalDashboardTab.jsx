import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import PortalTasksTab from './PortalTasksTab';

const PortalDashboardTab = ({ coachee, tasks, onUpdateTasks }) => {
  const weeklyImpulse = coachee.weeklyImpulse || "Was war dein größter Erfolg in dieser Woche und was hast du daraus gelernt?";

  return (
    <div className="space-y-8">
      <Card className="bg-slate-900/50 border border-slate-800">
        <CardHeader><CardTitle className="flex items-center gap-2 text-primary"><MessageSquare /> Wochenimpuls vom Coach</CardTitle></CardHeader>
        <CardContent><p className="text-lg text-slate-300 italic">"{weeklyImpulse}"</p></CardContent>
      </Card>
      
      <PortalTasksTab coachee={coachee} tasks={tasks} onUpdateTasks={onUpdateTasks} isDashboardVersion={true} />
    </div>
  );
};

export default PortalDashboardTab;