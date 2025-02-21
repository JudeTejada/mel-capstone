import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/server";
import { MemberStatsClient } from "./MemberStatsClient";

export async function MemberStats() {
  const data = await api.users.getUsersWithTaskCount();

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Overview of team members and their tasks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MemberStatsClient users={data.result} />
      </CardContent>
    </Card>
  );
}