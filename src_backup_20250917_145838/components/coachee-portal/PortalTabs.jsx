import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Target, BookOpen, Calendar, CheckSquare } from 'lucide-react';
import PortalDashboardTab from './PortalDashboardTab';
import PortalGoalsTab from './PortalGoalsTab';
import PortalJournalTab from './PortalJournalTab';
import PortalSessionsTab from './PortalSessionsTab';
import PortalTasksTab from './PortalTasksTab';

const PortalTabs = ({ coachee, portalData, updatePortalData, updateCoacheeData, tasks, onUpdateTasks, onShareJournalEntry }) => {
  return (
    <Tabs defaultValue="dashboard" className="w-full mt-8">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        <TabsTrigger value="dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</TabsTrigger>
        <TabsTrigger value="tasks"><CheckSquare className="mr-2 h-4 w-4" />Aufgaben</TabsTrigger>
        <TabsTrigger value="goals"><Target className="mr-2 h-4 w-4" />Ziele</TabsTrigger>
        <TabsTrigger value="journal"><BookOpen className="mr-2 h-4 w-4" />Journal & Docs</TabsTrigger>
        <TabsTrigger value="sessions"><Calendar className="mr-2 h-4 w-4" />Sessions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard" className="mt-6">
        <PortalDashboardTab coachee={coachee} tasks={tasks || []} onUpdateTasks={onUpdateTasks} />
      </TabsContent>
      <TabsContent value="tasks" className="mt-6">
        <PortalTasksTab coachee={coachee} tasks={tasks || []} onUpdateTasks={onUpdateTasks} />
      </TabsContent>
      <TabsContent value="goals" className="mt-6">
        <PortalGoalsTab coachee={coachee} updateCoacheeData={updateCoacheeData} />
      </TabsContent>
      <TabsContent value="journal" className="mt-6">
        <PortalJournalTab coachee={coachee} portalData={portalData} updatePortalData={updatePortalData} onShareJournalEntry={onShareJournalEntry} />
      </TabsContent>
      <TabsContent value="sessions" className="mt-6">
        <PortalSessionsTab coachee={coachee} />
      </TabsContent>
    </Tabs>
  );
};

export default PortalTabs;