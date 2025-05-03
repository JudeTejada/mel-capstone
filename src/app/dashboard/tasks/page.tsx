import type { Metadata } from "next";
import { api } from "~/trpc/server";
import { TaskView } from "./components/TaskView";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default async function TaskPage() {
  const tasks = await api.tasks.getAllTasks();

  return <TaskView tasks={tasks} />;
}
