'use client';

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";

export function TeamMembers() {
  const { data: users } = api.users.getUsersWithTaskCount.useQuery();

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.result?.map((user) => (
            <div key={user.id} className="rounded-lg border p-4">
              <h4 className="font-semibold">{user.firstName} {user.lastName}</h4>
              <p className="text-sm text-gray-500">{user.position}</p>
              <p className="text-sm text-gray-500">{user.taskCount} tasks assigned</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}