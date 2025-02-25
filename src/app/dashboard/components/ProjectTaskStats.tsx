"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Bar } from "react-chartjs-2";
import { api } from "~/trpc/react";


export function ProjectTaskStats() {
  const { data: projects } = api.projects.getProjectsWithTaskCount.useQuery();

  const projectTaskData = {
    labels: projects?.result?.map((project) => project.title) ?? [],
    datasets: [
      {
        label: "Tasks",
        data:
          projects?.result?.map((project) => project.tasks?.length ?? 0) ?? [],
        backgroundColor: "#60a5fa",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Project Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Bar
            data={projectTaskData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
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
