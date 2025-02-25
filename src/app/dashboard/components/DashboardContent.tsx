"use client";

import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { TaskPriorityOverview } from "./TaskPriorityOverview";
import { TeamMembers } from "./TeamMembers";
import { RecentTasksList } from "./RecentTasksList";
import { ProjectTaskStats } from "./ProjectTaskStats";
import { ProjectsOverview } from "./ProjectsOverview";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function DashboardContent() {
  const { data: taskStats } = api.tasks.getTasksByStatus.useQuery();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" />
              <span>Unassigned</span>
            </div>
            <div className="mt-2 text-3xl font-bold">
              {taskStats?.data.todo ?? 0}
            </div>
            <div className="text-sm text-muted-foreground">Tasks</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="inline-block h-3 w-3 rounded-full bg-blue-500" />
              <span>In Progress</span>
            </div>
            <div className="mt-2 text-3xl font-bold">
              {taskStats?.data.inProgress ?? 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Tasks in progress
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
              <span>Completed</span>
            </div>
            <div className="mt-2 text-3xl font-bold">
              {taskStats?.data.completed ?? 0}
            </div>
            <div className="text-sm text-muted-foreground">Tasks completed</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Suspense fallback={<Skeleton className="col-span-2 h-[300px]" />}>
          <TaskPriorityOverview />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[300px]" />}>
          <ProjectTaskStats />
        </Suspense>

        <Suspense fallback={<Skeleton className="col-span-3 h-[300px]" />}>
          <ProjectsOverview />
        </Suspense>

        <Suspense fallback={<Skeleton className="col-span-2 h-[300px]" />}>
          <RecentTasksList />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[300px]" />}>
          <TeamMembers />
        </Suspense>
      </div>
    </div>
  );
}
