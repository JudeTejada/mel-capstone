import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { api } from "~/trpc/server";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default async function TaskPage() {
  const data = await api.users.getAllUsers();

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>View each of the members</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {data.result.map((user) => (
              <div
                className="flex items-center justify-between space-x-4"
                key={user.id}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
