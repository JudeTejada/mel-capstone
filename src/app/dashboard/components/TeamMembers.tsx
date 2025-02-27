'use client';

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

export function TeamMembers() {
  const { data: users, isLoading } = api.users.getUsersWithTaskCount.useQuery();

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="rounded-lg border p-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-2 h-4 w-24" />
                <Skeleton className="mt-2 h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {users?.result?.map((user) => (
            <div key={user.id} className="rounded-lg border p-3 sm:p-4">
              <h4 className="font-semibold text-sm sm:text-base">{user.firstName} {user.lastName}</h4>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{user.position}</p>
              <p className="text-xs sm:text-sm text-gray-500">{user.taskCount} tasks assigned</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}