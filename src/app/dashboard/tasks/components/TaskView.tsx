
"use client";
import React, { useState } from 'react'
import { Task } from '@prisma/client';
import { Button } from '~/components/ui/button';
import { ListBulletIcon } from '@radix-ui/react-icons';
import { CalendarIcon } from '@radix-ui/react-icons';
import { CalendarHeader } from './CalendarHeader';
import { TaskTable } from './TaskTable';
import { CalendarView } from './CalendarView';

type Props = {
  tasks: Task[];
}

export  function TaskView({tasks}: Props) {
   const [view, setView] = useState<"list" | "calendar">("list");
   const [calendarView, setCalendarView] = useState<"month" | "week" | "day">(
     "month",
   );
   const [filters, setFilters] = useState({
     status: "all",
     priority: "all",
   });

   const handleFilterChange = (type: string, value: string) => {
     setFilters((prev) => ({ ...prev, [type]: value }));
   };

   const filteredTasks = tasks.data.filter((task) => {
     if (filters.status !== "all" && task.status !== filters.status)
       return false;
     if (filters.priority !== "all" && task.priority !== filters.priority)
       return false;
     return true;
   });

   return (
     <>
       <div className="h-full flex-1 flex-col space-y-8">
         <div className="flex items-center justify-between space-y-2">
           <div>
             <h2 className="text-2xl font-bold tracking-tight">
               Welcome back!
             </h2>
             <p className="text-muted-foreground">
               Here&apos;s a list of your tasks for this month!
             </p>
           </div>
           <div className="flex items-center gap-2">
             <Button
               variant={view === "list" ? "default" : "outline"}
               size="icon"
               onClick={() => setView("list")}
             >
               <ListBulletIcon className="h-4 w-4" />
             </Button>
             <Button
               variant={view === "calendar" ? "default" : "outline"}
               size="icon"
               onClick={() => setView("calendar")}
             >
               <CalendarIcon className="h-4 w-4" />
             </Button>
           </div>
         </div>

         {view === "calendar" && (
           <CalendarHeader
             view={calendarView}
             onViewChange={setCalendarView}
             onFilterChange={handleFilterChange}
           />
         )}

         <div className="flex items-center space-x-2">
           {view === "list" ? (
             <TaskTable tasks={filteredTasks} />
           ) : (
             <CalendarView tasks={filteredTasks} />
           )}
         </div>
       </div>
     </>
   );
}