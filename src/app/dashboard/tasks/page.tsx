import type { Metadata } from "next";
import { columns } from "./components/columnts";

import { DataTable } from "./components/data-table";
import { api } from "~/trpc/server";
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
          <div className="flex items-center space-x-2">{/* <UserNav /> */}</div>
        </div>
        <DataTable data={tasks.data} columns={columns} />
      </div>
    </>
  );
}
