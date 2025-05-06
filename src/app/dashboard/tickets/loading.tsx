import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function TicketsLoading() {
  return (
    <div className="container mx-auto space-y-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Stats Overview Skeletons */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-32" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tickets Table Skeleton */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>All Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters Skeleton */}
              <div className="flex flex-col gap-4 md:flex-row">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-10 w-[200px]" />
              </div>

              {/* Table Skeleton */}
              <div className="rounded-md border">
                <div className="p-4">
                  {/* Table Header */}
                  <div className="flex gap-4 border-b pb-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-40" />
                  </div>

                  {/* Table Rows */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4 border-b py-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
