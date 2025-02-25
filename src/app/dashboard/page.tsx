import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { DashboardContent } from "./components/DashboardContent";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-y-4 px-4 md:px-0">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        }
      > 
        <DashboardContent />
      </Suspense>
    </div>
  );
}
