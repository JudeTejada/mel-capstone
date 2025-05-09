"use client";

import { useState } from "react";
import type { Task } from "@prisma/client";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import Link from "next/link";

interface CalendarTaskCardProps {
  task: Task;
}

export function CalendarTaskCard({ task }: CalendarTaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      case "LOW":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-yellow-500";
      case "INPROGRESS":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/dashboard/tasks/${task.id}`}>
            <div
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md p-1 text-sm hover:bg-accent",
                getPriorityColor(task.priority),
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  getStatusColor(task.status),
                )}
              />
              <span className="truncate">{task.title}</span>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{task.title}</p>
            <div className="flex gap-2">
              <Badge variant="outline">{task.priority}</Badge>
              <Badge variant="outline">{task.status}</Badge>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
