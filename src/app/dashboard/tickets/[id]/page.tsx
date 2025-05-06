import { api } from "~/trpc/server";
import { TicketDetails } from "~/components/tickets/TicketDetails";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CreateTicketDialog } from "~/components/tickets/CreateTicketDialog";

interface TicketPageProps {
  params: {
    id: string;
  };
}

export default async function TicketPage({ params }: TicketPageProps) {
  const ticket = await api.ticket.getById(params.id);
  const allTickets = await api.ticket.getAll();

  if (!ticket) {
    notFound();
  }

  // Calculate ticket stats
  const totalTickets = allTickets.length;
  const installationTickets = allTickets.filter(
    (t) => t.type === "INSTALLATION",
  ).length;
  const rectificationTickets = allTickets.filter(
    (t) => t.type === "RECTIFICATION",
  ).length;
  const inProgressTickets = allTickets.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;
  const onHoldTickets = allTickets.filter((t) => t.status === "ON_HOLD").length;
  const completedTickets = allTickets.filter((t) => t.status === "DONE").length;

  return (
    <div className="container mx-auto space-y-8 py-10">
      {/* Ticket Details */}
      <div className="mt-8 w-full">
        <TicketDetails ticket={ticket} />
      </div>
    </div>
  );
}
