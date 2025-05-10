import type { Ticket } from "@prisma/client";
import { TicketCard } from "./TicketCard";

interface TicketListProps {
  tickets: (Ticket & {
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
  })[];
}

export function TicketList({ tickets }: TicketListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
