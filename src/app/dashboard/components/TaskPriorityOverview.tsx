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
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Task Priority Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Doughnut
            data={taskStatusData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || "";
                      const value = typeof context.raw === "number" ? context.raw : 0;
                      return `${label}: ${value} tasks`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}