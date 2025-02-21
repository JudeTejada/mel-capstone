"use client";

import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { UserDialog } from "./UserDialog";

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

type MemberStatsClientProps = {
  users: User[];
};

export function MemberStatsClient({ users }: MemberStatsClientProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card
            key={user.id}
            className="group cursor-pointer border-gray-200 transition-all hover:border-primary/20 hover:shadow-md border-none"
            onClick={() => setSelectedUser(user)}
          >
            <CardContent className="flex flex-col space-y-4 p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-gray-200 transition-all group-hover:border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-base font-semibold">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {user.taskCount} tasks assigned
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      <UserDialog
        selectedUser={selectedUser}
        onOpenChange={() => setSelectedUser(null)}
      />
    </>
  );
}