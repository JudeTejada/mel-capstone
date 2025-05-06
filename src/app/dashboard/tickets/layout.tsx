import { Suspense } from "react";
import { api } from "~/trpc/server";
import { StatsOverview } from "~/components/tickets/StatsOverview";
import { CreateTicketDialog } from "~/components/tickets/CreateTicketDialog";
import { LoadingStats } from "./loading-stats";

export default async function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tickets = await api.ticket.getAll();

  return (
    <div className="container mx-auto space-y-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <CreateTicketDialog />
      </div>

      {/* Stats Overview */}
      <Suspense fallback={<LoadingStats />}>
        <StatsOverview tickets={tickets} />
      </Suspense>

      {/* Main Content */}
      <div className="mt-8">
        <Suspense fallback={<LoadingStats />}>{children}</Suspense>
      </div>
    </div>
  );
}
