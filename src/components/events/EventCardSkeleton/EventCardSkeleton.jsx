/**
 * Event Card Skeleton Component
 * Loading skeleton for event cards
 */

'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function EventCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      {/* Image skeleton */}
      <div className="relative w-full h-48 bg-muted">
        <Skeleton className="w-full h-full" />
        <Skeleton className="absolute top-2 right-2 w-16 h-6 rounded-full" />
      </div>

      <CardHeader>
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        
        {/* Date and location skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardContent>

      <CardFooter>
        {/* Button skeleton */}
        <Skeleton className="w-full h-10" />
      </CardFooter>
    </Card>
  );
}

