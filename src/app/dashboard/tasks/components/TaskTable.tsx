"use client";

import * as React from "react";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { Status } from "@prisma/client";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { AddTaskModal } from "~/app/_components/AddTaskModal";
import { EditTaskModal } from "~/app/_components/EditTaskModal";
import { useRouter } from "next/navigation";
import { ConfirmDeleteTaskDialog } from "~/app/_components/ConfirmDeleteTaskDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Filter } from "lucide-react";

type Task = {
  id: string;
  title: string;
  assignees: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  }[];
  project: {
    title: string;
  };
  priority: "LOW" | "MEDIUM" | "HIGH";
  estimatedHours: number;
  status: Status;
  deadline: Date;
};

type TaskTableProps = {
  tasks: Task[];
};

export const formatStatus = (status: Status): string => {
  switch (status) {
    case "INPROGRESS":
      return "In Progress";
    case "TODO":
      return "To Do";
    case "COMPLETED":
      return "Completed";
    default:
      return status;
  }
};

const formatPriority = (priority: string): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
};

export function TaskTable({ tasks }: TaskTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectSort, setProjectSort] = useState<string | null>(null);
  const [prioritySort, setPrioritySort] = useState<string | null>(null);
  const [statusSort, setStatusSort] = useState<Status | null>(null);
  const [assigneeSort, setAssigneeSort] = useState<string | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<
    (Task & { project: { title: string; id: string } }) | null
  >(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Get unique project titles for filter
  const uniqueProjects = Array.from(
    new Set(tasks.map((task) => task.project.title)),
  );

  // Get unique assignees for filter
  const uniqueAssignees = Array.from(
    new Set(
      tasks.flatMap((task) =>
        task.assignees.map((assignee) => ({
          id: assignee.id,
          name: `${assignee.firstName} ${assignee.lastName}`,
        })),
      ),
    ),
  );

  // Filter tasks
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((task) => (projectSort ? task.project.title === projectSort : true))
    .filter((task) => (prioritySort ? task.priority === prioritySort : true))
    .filter((task) => (statusSort ? task.status === statusSort : true))
    .filter((task) =>
      assigneeSort
        ? task.assignees.some((assignee) => assignee.id === assigneeSort)
        : true,
    );

  // Group tasks by status
  const groupedTasks = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    },
    {} as Record<Status, Task[]>,
  );

  // Order of status display
  const statusOrder: Status[] = ["TODO", "INPROGRESS", "COMPLETED"];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-shrink-0 flex-col space-y-4 sm:flex-row sm:gap-4">
          <Input
            placeholder="Search by task title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <div className="block sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[80vh] w-full overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Filter Tasks</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project</label>
                    <Select
                      value={projectSort ?? undefined}
                      onValueChange={setProjectSort}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>All Projects</SelectItem>
                        {uniqueProjects.map((project) => (
                          <SelectItem key={project} value={project}>
                            {project}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={prioritySort ?? undefined}
                      onValueChange={setPrioritySort}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>All Priorities</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assignee</label>
                    <Select
                      value={assigneeSort ?? undefined}
                      onValueChange={setAssigneeSort}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>All Assignees</SelectItem>
                        {uniqueAssignees.map((assignee) => (
                          <SelectItem key={assignee.id} value={assignee.id}>
                            {assignee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setProjectSort(null);
                      setPrioritySort(null);
                      setStatusSort(null);
                      setAssigneeSort(null);
                    }}
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <AddTaskModal isOpen={isAddTaskOpen} setIsOpen={setIsAddTaskOpen}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsAddTaskOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            Add Task
          </Button>
        </AddTaskModal>
      </div>
      <div>
        <div className="hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2 md:grid-cols-4">
          <Select
            value={projectSort ?? undefined}
            onValueChange={setProjectSort}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Projects</SelectItem>
              {uniqueProjects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={prioritySort ?? undefined}
            onValueChange={setPrioritySort}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={assigneeSort ?? undefined}
            onValueChange={setAssigneeSort}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Assignees</SelectItem>
              {uniqueAssignees.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setProjectSort(null);
              setPrioritySort(null);
              setStatusSort(null);
              setAssigneeSort(null);
            }}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {statusOrder.map((status) => {
          const statusTasks = groupedTasks[status] ?? [];

          return (
            <div key={status} className="rounded-lg border">
              <div className="border-b bg-muted/50 px-4 py-3">
                <h2 className="flex items-center gap-2 font-semibold text-muted-foreground">
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${status === "INPROGRESS" ? "bg-blue-500" : status === "TODO" ? "bg-yellow-500" : "bg-green-500"}`}
                  />
                  {formatStatus(status)}
                </h2>
              </div>
              {statusTasks.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  No tasks in {formatStatus(status)}
                </div>
              ) : (
                <div className="block overflow-x-auto">
                  <Table>
                    <TableHeader className="hidden md:table-header-group">
                      <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead className="min-w-[200px]">Title</TableHead>
                        <TableHead className="w-[150px]">Assignees</TableHead>
                        <TableHead className="w-[150px]">Project</TableHead>
                        <TableHead className="w-[100px]">Priority</TableHead>
                        <TableHead className="w-[120px]">Deadline</TableHead>
                        <TableHead className="w-[100px] text-right">
                          Est. Hours
                        </TableHead>
                        <TableHead className="w-[100px] text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statusTasks.map((task, index) => (
                        <TableRow
                          key={task.id}
                          className="block cursor-pointer border-b md:table-row md:border-b-0"
                          onClick={(e) => {
                            router.push(`/dashboard/tasks/${task.id}`);
                            e.preventDefault();
                          }}
                        >
                          <TableCell className="hidden font-mono md:table-cell">
                            {index + 1}
                          </TableCell>
                          <TableCell className="block py-4 md:table-cell">
                            <div className="font-medium md:font-normal">
                              {task.title}
                            </div>
                            <div className="mt-1 space-y-2 md:hidden">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  Project:
                                </span>
                                <span>{task.project.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  Priority:
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${task.priority === "HIGH" ? "bg-red-100 text-red-800" : task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                                >
                                  {formatPriority(task.priority)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  Deadline:
                                </span>
                                <span>
                                  {format(
                                    new Date(task.deadline),
                                    "MMM dd, yyyy",
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  Est. Hours:
                                </span>
                                <span>{task.estimatedHours}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="block py-2 md:table-cell md:py-4">
                            <div className="flex -space-x-2">
                              {task.assignees.map((assignee) => (
                                <Avatar
                                  key={assignee.id}
                                  className="h-8 w-8 border-2 border-background"
                                >
                                  <AvatarImage
                                    src={assignee.image ?? undefined}
                                  />
                                  <AvatarFallback>
                                    {assignee.firstName[0]}
                                    {assignee.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {task.project.title}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${task.priority === "HIGH" ? "bg-red-100 text-red-800" : task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                            >
                              {formatPriority(task.priority)}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {format(new Date(task.deadline), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="hidden text-right md:table-cell">
                            {task.estimatedHours}
                          </TableCell>
                          <TableCell className="flex flex-row items-center space-y-2 py-4 md:table-cell md:space-x-2 md:space-y-0 md:text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full md:w-auto"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedTask(task);
                                setIsEditTaskOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-red-600 hover:bg-red-100 hover:text-red-800 md:w-auto"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedTask(task);
                                setIsDeleteOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedTask && (
        <EditTaskModal
          taskData={{
            id: selectedTask.id,
            title: selectedTask.title,
            description: selectedTask.description, // You'll need to add this to your Task type if needed
            status: selectedTask.status,
            assigneeIds: selectedTask.assignees.map((a) => a.id),
            projectId: selectedTask.project.id, // You'll need to add project.id to your Task type
            deadline: selectedTask.deadline,
            priority: selectedTask.priority,
            estimatedHours: selectedTask.estimatedHours,
            actualHours: 0, // You'll need to add this to your Task type if needed
          }}
          isOpen={isEditTaskOpen}
          setIsOpen={setIsEditTaskOpen}
        />
      )}
      {selectedTask && (
        <ConfirmDeleteTaskDialog
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
          taskId={selectedTask.id}
        />
      )}
    </div>
  );
}
