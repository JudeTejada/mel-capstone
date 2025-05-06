import { api } from "~/trpc/server";
import { TicketTable } from "~/components/tickets/TicketTable";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default async function TicketsPage() {
  const tickets = await api.ticket.getAll();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <TicketTable tickets={tickets} />
      </CardContent>
    </Card>
  );
}
