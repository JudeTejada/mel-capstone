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
  const { data: taskStats, isLoading } = api.tasks.getTasksByStatus.useQuery();

  return (
    <div className="space-y-4  md:space-y-6 md:px-0">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {isLoading ? (
          <>
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-8 w-16" />
                <Skeleton className="mt-1 h-4 w-20" />
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-8 w-16" />
                <Skeleton className="mt-1 h-4 w-20" />
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-8 w-16" />
                <Skeleton className="mt-1 h-4 w-20" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" />
                  <span>To Do</span>
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold">
                  {taskStats?.data.todo ?? 0}
                </div>
                <div className="text-sm text-muted-foreground text-center">Tasks in to do</div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="inline-block h-3 w-3 rounded-full bg-blue-500" />
                  <span>In Progress</span>
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold">
                  {taskStats?.data.inProgress ?? 0}
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  Tasks in progress
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
                  <span>Completed</span>
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold">
                  {taskStats?.data.completed ?? 0}
                </div>
                <div className="text-sm text-muted-foreground text-center">Tasks completed</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 md:col-span-2">
          <TaskPriorityOverview />
        </div>
        <ProjectTaskStats />
        <div className="col-span-1 md:col-span-3">
          <ProjectsOverview />
        </div>
        <div className="col-span-1 md:col-span-2">
          <RecentTasksList />
        </div>
        <TeamMembers />
      </div>
    </div>
  );
}
