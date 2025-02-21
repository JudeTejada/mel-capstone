"use client";

import { format } from "date-fns";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { Spinner } from "~/app/ui";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  taskCount: number;
  tasks: Array<{
    id: string;
    title: string;
    status: "TODO" | "INPROGRESS" | "COMPLETED";
    deadline: Date;
  }>;
};

const statusStyles = {
  TODO: { label: "To Do", className: "bg-gray-100 text-gray-800" },
  INPROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-800" },
};

type UserDialogProps = {
  selectedUser: User | null;
  onOpenChange: (open: boolean) => void;
};

export function UserDialog({ selectedUser, onOpenChange }: UserDialogProps) {
  const { data: userData, isLoading } = api.users.getUserDetails.useQuery(
    { userId: selectedUser?.id ?? "" },
    { enabled: !!selectedUser },
  );

  return (
    <Dialog open={!!selectedUser} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner />
          </div>
        ) : userData ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border-2 border-gray-200">
                  <AvatarFallback className="bg-slate-100 text-primary">
                    {userData.firstName[0]}
                    {userData.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="text-xl font-semibold">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {userData.taskCount} tasks assigned
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Assigned Tasks</h3>
              <div className="space-y-4">
                {userData.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge
                        variant="secondary"
                        className={statusStyles[task.status].className}
                      >
                        {statusStyles[task.status].label}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Due: {format(new Date(task.deadline), "MMMM dd, yyyy")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
