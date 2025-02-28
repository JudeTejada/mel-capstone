'use client';

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

export function TaskPriorityOverview() {
  const { data: mainTasks, isLoading } = api.tasks.getMainTasks.useQuery();

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Task Priority Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] w-full items-center justify-center">
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const taskStatusData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        data: [
          mainTasks?.data.low ?? 0,
          mainTasks?.data.medium ?? 0,
          mainTasks?.data.high ?? 0,
        ],
        backgroundColor: ["#94a3b8", "#3b82f6", "#22c55e"],
        borderColor: ["#64748b", "#2563eb", "#16a34a"],
        borderWidth: 2,
        hoverOffset: 4,
        label: "Tasks by Priority"
      },
    ],
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Task Priority Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[250px] sm:h-[300px] w-full px-2 sm:px-4">
            <Doughnut
              data={taskStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      padding: 16,
                      usePointStyle: true,
                      font: {
                        size: 12,
                      },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || "";
                        const value = typeof context.raw === "number" ? context.raw : 0;
                        const total = context.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} tasks (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-[#94a3b8]" />
                <span>Low Priority</span>
              </div>
              <span className="font-bold">{mainTasks?.data.low ?? 0} tasks</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-[#3b82f6]" />
                <span>Medium Priority</span>
              </div>
              <span className="font-bold">{mainTasks?.data.medium ?? 0} tasks</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
                <span>High Priority</span>
              </div>
              <span className="font-bold">{mainTasks?.data.high ?? 0} tasks</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}