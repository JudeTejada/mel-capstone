import { Circle } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/server";

export async function HeroContent() {
  const { data, status } = await api.tasks.getMainTasks();

  const { high, low, medium } = data;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Priority</CardTitle>
          <Circle size={16} className="text-gray-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{low}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
          <Circle size={16} className="text-yellow-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{medium}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          <Circle size={16} className="text-red-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{high}</div>
        </CardContent>
      </Card>
    </div>
  );
}
