"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { formatStatus } from "../tasks/components/TaskTable";

export function RecentTasksList() {
  const { data: recentTasks, isLoading } = api.tasks.getRecentTasks.useQuery();

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="mt-2 h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3 sm:space-y-4">
          {recentTasks?.data?.map((task) => (
            <Link href={`/dashboard/tasks/${task.id}`} key={task.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-3 sm:p-4 gap-2 sm:gap-0">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">{task.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Due {new Date(task.deadline).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm w-fit ${task.status === "TODO" ? "bg-yellow-100 text-yellow-600" : task.status === "INPROGRESS" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
                >
                  {formatStatus(task.status)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
