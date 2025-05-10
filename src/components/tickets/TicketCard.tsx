"use client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import type { Ticket } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

interface TicketCardProps {
  ticket: Ticket & {
    assignedTo: {
      firstName: string;
      lastName: string;
    } | null;
    installationProgress: {
      poleExcavation: number;
      cableLaid: number;
      napLcpMounted: number;
      poleErected: number;
      cableFixed: number;
      napLcpSpliced: number;
    } | null;
  };
}

export function TicketCard({ ticket }: TicketCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "DONE":
        return "bg-green-500";
      case "ON_HOLD":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const calculateOverallProgress = () => {
    if (!ticket.installationProgress) return 0;
    const values = [
      ticket.installationProgress.poleExcavation,
      ticket.installationProgress.cableLaid,
      ticket.installationProgress.napLcpMounted,
      ticket.installationProgress.poleErected,
      ticket.installationProgress.cableFixed,
      ticket.installationProgress.napLcpSpliced,
    ];
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  return (
    <Link href={`/dashboard/tickets/${ticket.id}`}>
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">
              {ticket.type} #{ticket.id.slice(0, 8)}
            </CardTitle>
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Assigned To</p>
              <p className="font-medium">
                {ticket.assignedTo
                  ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                  : "Unassigned"}
              </p>
            </div>
            {ticket.type === "INSTALLATION" && (
              <div>
                <p className="mb-2 text-sm text-gray-500">
                  Installation Progress
                </p>
                <Progress value={calculateOverallProgress()} />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">
                {format(new Date(ticket.createdAt), "PPP")}
              </p>
            </div>
            {ticket.remarks && (
              <div>
                <p className="text-sm text-gray-500">Remarks</p>
                <p className="line-clamp-2 text-sm">{ticket.remarks}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
