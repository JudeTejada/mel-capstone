import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Ticket } from "@prisma/client";
import {
  ClipboardList,
  HardHat,
  SlidersHorizontal,
  Zap,
  PauseCircle,
  CheckCircle2,
} from "lucide-react";

interface StatsOverviewProps {
  tickets: Ticket[];
}

export function StatsOverview({ tickets }: StatsOverviewProps) {
  // Calculate ticket stats
  const totalTickets = tickets.length;
  const installationTickets = tickets.filter(
    (t) => t.type === "INSTALLATION",
  ).length;
  const rectificationTickets = tickets.filter(
    (t) => t.type === "RECTIFICATION",
  ).length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;
  const onHoldTickets = tickets.filter((t) => t.status === "ON_HOLD").length;
  const completedTickets = tickets.filter((t) => t.status === "DONE").length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <ClipboardList className="mr-2 h-[30px] w-[30px] text-blue-500" />
          <CardTitle className="text-sm font-medium text-blue-500">
            Total Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTickets}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <HardHat className="mr-2 h-[30px] w-[30px] text-green-500" />
          <CardTitle className="text-sm font-medium text-green-500">
            Installation Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{installationTickets}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <SlidersHorizontal className="mr-2 h-[30px] w-[30px] text-purple-500" />
          <CardTitle className="text-sm font-medium text-purple-500">
            Rectification Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rectificationTickets}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Zap className="mr-2 h-[30px] w-[30px] text-yellow-500" />
          <CardTitle className="text-sm font-medium text-yellow-500">
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressTickets}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <PauseCircle className="mr-2 h-[30px] w-[30px] text-red-500" />
          <CardTitle className="text-sm font-medium text-red-500">
            On Hold
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onHoldTickets}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CheckCircle2 className="mr-2 h-[30px] w-[30px] text-green-500" />
          <CardTitle className="text-sm font-medium text-green-500">
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTickets}</div>
        </CardContent>
      </Card>
    </div>
  );
}
