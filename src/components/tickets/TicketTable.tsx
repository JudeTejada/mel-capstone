"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Ticket, ProgressStatus } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { getStatusColor, getFormattedStatus } from "~/lib/utils/ticket";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface TicketWithRelations extends Ticket {
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
  activityType: string;
  completedAt: Date | null;
}

const activityTypes = {
  INSTALLATION: [
    "New Installation",
    "Upgrade Installation",
    "Replacement Installation",
  ],
  RECTIFICATION: [
    "High loss",
    "Sagging cable",
    "Fiber break/no power",
    "Insufficient depth of pole",
    "Wrong fiber assignment",
  ],
};

interface TicketTableProps {
  tickets: TicketWithRelations[];
}

export function TicketTable({ tickets }: TicketTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProgressStatus | "ALL">(
    "ALL",
  );
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<
    "INSTALLATION" | "RECTIFICATION"
  >("INSTALLATION");

  const calculateOverallProgress = (
    progress: TicketWithRelations["installationProgress"],
  ) => {
    if (!progress) return 0;
    const values = [
      progress.poleExcavation,
      progress.cableLaid,
      progress.napLcpMounted,
      progress.poleErected,
      progress.cableFixed,
      progress.napLcpSpliced,
    ];
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const renderProgressTooltip = (
    progress: TicketWithRelations["installationProgress"],
  ) => {
    if (!progress) return null;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">Pole Excavation:</span>
          <div className="flex items-center gap-2">
            <Progress value={progress.poleExcavation} className="w-[100px]" />
            <span className="min-w-[40px] text-sm">
              {progress.poleExcavation}%
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">Cable Laid:</span>
          <div className="flex items-center gap-2">
            <Progress value={progress.cableLaid} className="w-[100px]" />
            <span className="min-w-[40px] text-sm">{progress.cableLaid}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">NAP/LCP Mounted:</span>
          <div className="flex items-center gap-2">
            <Progress value={progress.napLcpMounted} className="w-[100px]" />
            <span className="min-w-[40px] text-sm">
              {progress.napLcpMounted}%
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">Pole Erected:</span>
          <div className="flex items-center gap-2">
            <Progress value={progress.poleErected} className="w-[100px]" />
            <span className="min-w-[40px] text-sm">
              {progress.poleErected}%
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">Cable Fixed:</span>
          <div className="flex items-center gap-2">
            <Progress value={progress.cableFixed} className="w-[100px]" />
            <span className="min-w-[40px] text-sm">{progress.cableFixed}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">NAP/LCP Spliced:</span>
          <div className="flex items-center gap-2">
            <Progress value={progress.napLcpSpliced} className="w-[100px]" />
            <span className="min-w-[40px] text-sm">
              {progress.napLcpSpliced}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Get unique assignees for filter
  const uniqueAssignees = Array.from(
    new Set(
      tickets
        .filter((t) => t.assignedTo)
        .map((t) => `${t.assignedTo?.firstName} ${t.assignedTo?.lastName}`),
    ),
  );

  const filteredTickets = tickets.filter((ticket) => {
    const matchesType = ticket.type === selectedType;
    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;
    const matchesAssignee =
      assigneeFilter === "ALL" ||
      (ticket.assignedTo &&
        `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` ===
          assigneeFilter);
    const matchesSearch =
      !searchQuery ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.activityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.assignedTo?.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false) ||
      (ticket.assignedTo?.lastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false) ||
      (ticket.remarks?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    return matchesType && matchesStatus && matchesAssignee && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tickets</h1>
        <div className="flex items-center gap-2">
          <Tabs
            defaultValue="INSTALLATION"
            onValueChange={(value) =>
              setSelectedType(value as typeof selectedType)
            }
            className="w-fit"
          >
            <TabsList className="bg-background">
              <TabsTrigger
                value="INSTALLATION"
                className="data-[state=active]:bg-white"
              >
                Installation Tickets
              </TabsTrigger>
              <TabsTrigger
                value="RECTIFICATION"
                className="data-[state=active]:bg-white"
              >
                Rectification Tickets
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by ID or Activity Type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
          data-testid="ticket-filter"
        />

        <Select
          value={statusFilter}
          onValueChange={(value: ProgressStatus | "ALL") =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
            <SelectItem value="ON_HOLD">On Hold</SelectItem>
          </SelectContent>
        </Select>

        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Assignees</SelectItem>
            {uniqueAssignees.map((assignee) => (
              <SelectItem key={assignee} value={assignee}>
                {assignee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Activity Type</TableHead>
              <TableHead>Status</TableHead>
              {selectedType === "INSTALLATION" && (
                <TableHead>Progress</TableHead>
              )}
              <TableHead>Assigned To</TableHead>
              <TableHead>Date Completed</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                data-testid="ticket-item"
              >
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.activityType ?? "N/A"}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ticket.status)}>
                    {getFormattedStatus(ticket.status)}
                  </Badge>
                </TableCell>
                {selectedType === "INSTALLATION" && (
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={calculateOverallProgress(
                                ticket.installationProgress,
                              )}
                              className="w-[60px]"
                            />
                            <span className="text-sm">
                              {Math.round(
                                calculateOverallProgress(
                                  ticket.installationProgress,
                                ),
                              )}
                              %
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-[300px] p-4">
                          {renderProgressTooltip(ticket.installationProgress)}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                )}
                <TableCell>
                  {ticket.assignedTo
                    ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                    : "Unassigned"}
                </TableCell>
                <TableCell>
                  {ticket.completedAt
                    ? format(new Date(ticket.completedAt), "MMM d, yyyy")
                    : "Set date"}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {ticket.remarks || "No remarks"}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add your action menu logic here
                    }}
                    className="h-8 w-8 p-0"
                  >
                    ⋮
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
