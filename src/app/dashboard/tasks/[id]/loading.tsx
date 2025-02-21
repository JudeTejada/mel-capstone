import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <div>
      <div className="grid w-full grid-cols-1 md:grid-cols-4">
        <div className="col-span-3 bg-white">
          <Link href={"/dashboard/tasks"} className="flex md:hidden">
            <Button variant="link" className="p-0 text-gray-500">
              <ArrowLeft size={20} className="mr-1" />
              Go back
            </Button>
          </Link>

          <div className="mb-6 grid grid-cols-2 gap-y-4 md:hidden">
            {/* Mobile metadata skeletons */}
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex flex-col gap-x-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="mt-1 h-6 w-32" />
              </div>
            ))}
          </div>

          <Link href={"/dashboard/tasks"} className="hidden md:flex">
            <Button variant="link" className="p-0 text-gray-500">
              <ArrowLeft size={20} className="mr-1" />
              Go back
            </Button>
          </Link>

          {/* Title skeleton */}
          <Skeleton className="mb-4 h-8 w-3/4 md:h-10" />

          {/* Description skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Comments section skeleton */}
          <div className="mt-8 space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop sidebar skeletons */}
        <div className="col-span-1 hidden flex-col space-y-4 md:flex">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex flex-col gap-x-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="mt-1 h-6 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}