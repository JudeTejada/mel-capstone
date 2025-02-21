import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { HeroContent } from "./components/HeroContent";
import { RecentTasks } from "./components/RecentTasks";
import { MemberStats } from "./components/MemberStats";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-y-4 px-4 md:px-0">
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
      <div className="flex flex-col gap-4 md:flex-row">
        <Suspense
          fallback={
            <Card className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-4 w-[180px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          }
        >
          <RecentTasks />
        </Suspense>
        <Suspense
          fallback={
            <Card className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-4 w-[180px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          }
        >
          <MemberStats />
        </Suspense>
      </div>
    </div>
  );
}
