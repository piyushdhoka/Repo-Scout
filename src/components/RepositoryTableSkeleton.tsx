import { Skeleton } from "@/components/ui/skeleton";

export function RepositoryTableSkeleton() {
  return (
    <div className="space-y-4 bg-black">
      {/* Table Header Skeleton */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <Skeleton className="h-6 w-32 bg-gray-900" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-20 bg-gray-900" />
          <Skeleton className="h-6 w-20 bg-gray-900" />
          <Skeleton className="h-6 w-24 bg-gray-900" />
        </div>
      </div>

      {/* Table Rows Skeleton */}
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="border border-gray-800 rounded-lg p-4 bg-gray-950 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-start justify-between">
            {/* Left side - Repository info */}
            <div className="flex-1 space-y-3">
              {/* Repository name */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-48 bg-gray-900" />
                <Skeleton className="h-5 w-16 bg-gray-900 rounded-full" />
              </div>

              {/* Description */}
              <Skeleton className="h-4 w-full max-w-2xl bg-gray-900" />
              <Skeleton className="h-4 w-3/4 bg-gray-900" />

              {/* Tags/Topics */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 bg-gray-900 rounded-full" />
                <Skeleton className="h-6 w-24 bg-gray-900 rounded-full" />
                <Skeleton className="h-6 w-16 bg-gray-900 rounded-full" />
              </div>
            </div>

            {/* Right side - Stats */}
            <div className="flex gap-6 ml-4">
              <div className="text-center">
                <Skeleton className="h-5 w-12 bg-gray-900 mb-1" />
                <Skeleton className="h-4 w-10 bg-gray-900" />
              </div>
              <div className="text-center">
                <Skeleton className="h-5 w-12 bg-gray-900 mb-1" />
                <Skeleton className="h-4 w-10 bg-gray-900" />
              </div>
              <div className="text-center">
                <Skeleton className="h-5 w-16 bg-gray-900 mb-1" />
                <Skeleton className="h-4 w-12 bg-gray-900" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
