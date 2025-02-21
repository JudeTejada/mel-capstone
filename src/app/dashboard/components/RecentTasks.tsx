import type { Status } from "@prisma/client";
import { format } from "date-fns";
import { Fragment } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/server";

const statusStyles: Record<Status, { label: string; className: string }> = {
  INPROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-800" },
  TODO: { label: "To Do", className: "bg-gray-100 text-gray-800" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-800" },
};

export async function RecentTasks() {
  const { data } = await api.tasks.getRecentTasks();

  return (
    <Card className=" transition-all hover:shadow-md  w-full">
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
        <CardDescription>Tasks that had been created recently.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item) => (
            <Fragment key={item.id}>
              <Link href={`/dashboard/tasks/${item.id}`}>
                <div className="group flex items-center justify-between rounded-lg p-2 transition-all hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10 border-2 border-gray-200">
                      <AvatarFallback className="bg-slate-100 text-primary">
                        {item.assigned.firstName[0]}
                        {item.assigned.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(item.deadline), "MMMM dd, yyyy")}
                        </p>
                        <Badge
                          variant="secondary"
                          className={statusStyles[item.status].className}
                        >
                          {statusStyles[item.status].label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
