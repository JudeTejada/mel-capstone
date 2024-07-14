import { Status } from "@prisma/client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { Fragment } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/server";

const statusLabels: Record<Exclude<Status, "COMPLETED">, string> = {
  INPROGRESS: "In progress",
  TODO: "To do",
};

export async function RecentTasks() {
  const { data } = await api.tasks.getRecentTasks();

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
        <CardDescription>Tasks that had been created recently.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.map((item) => (
            <Fragment key={item.id}>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {item.assigned.firstName[0]}
                    {item.assigned.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(item.deadline), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {statusLabels[item.status]}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
