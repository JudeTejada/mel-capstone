import type { Metadata } from "next";

import { api } from "~/trpc/server";
import { TaskTable } from "./components/TaskTable";
export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default async function TaskPage() {
  const tasks = await api.tasks.getAllTasks();

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TaskTable tasks={tasks.data} />
        </div>
      </div>
    </>
  );
}
