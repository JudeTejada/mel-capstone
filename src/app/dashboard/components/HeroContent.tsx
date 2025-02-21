import { Circle, Plus } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";

export async function HeroContent() {
  const { data, status } = await api.tasks.getMainTasks();

  const { high, low, medium } = data;
  const total = low + medium + high;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="group border-gray-200 transition-all hover:border-gray-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Priority</CardTitle>
          <Circle size={16} className="text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-700">{low}</div>
            <Button size="sm" variant="ghost" className="opacity-0 transition-opacity group-hover:opacity-100">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{Math.round((low / total) * 100)}% of total tasks</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gray-500 transition-all duration-500 ease-in-out"
                style={{ width: `${(low / total) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group border-yellow-200 transition-all hover:border-yellow-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
          <Circle size={16} className="text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-yellow-700">{medium}</div>
            <Button size="sm" variant="ghost" className="opacity-0 transition-opacity group-hover:opacity-100">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
          <div className="mt-2">
            <p className="text-sm text-yellow-600">{Math.round((medium / total) * 100)}% of total tasks</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-yellow-100">
              <div
                className="h-full rounded-full bg-yellow-500 transition-all duration-500 ease-in-out"
                style={{ width: `${(medium / total) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group border-red-200 transition-all hover:border-red-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          <Circle size={16} className="text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-red-700">{high}</div>
            <Button size="sm" variant="ghost" className="opacity-0 transition-opacity group-hover:opacity-100">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
          <div className="mt-2">
            <p className="text-sm text-red-600">{Math.round((high / total) * 100)}% of total tasks</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-red-100">
              <div
                className="h-full rounded-full bg-red-500 transition-all duration-500 ease-in-out"
                style={{ width: `${(high / total) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
