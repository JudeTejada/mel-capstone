'use client';

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";

export function RecentTasksList() {
  const { data: recentTasks } = api.tasks.getRecentTasks.useQuery();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTasks?.data?.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h4 className="font-semibold">{task.title}</h4>
                <p className="text-sm text-gray-500">
                  Due {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm ${task.status === 'TODO' ? 'bg-yellow-100 text-yellow-600' : task.status === 'INPROGRESS' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}