import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { HeroContent } from "./components/HeroContent";
import { RecentTasks } from "./components/RecentTasks";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-y-4">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-[126px] w-full" />
            <Skeleton className="h-[126px] w-full" />
            <Skeleton className="h-[126px] w-full" />
          </div>
        }
      >
        <HeroContent />
      </Suspense>

      <Suspense fallback="loading">
        <RecentTasks />
      </Suspense>
    </div>
  );
}
