"use client";

import React from "react";

// Uses shadcn/ui Skeleton component and Tailwind utility classes
// Place this file in a component folder (e.g. components/skeletons/FormSkeleton.jsx)
// Imports assume you have a shadcn-style setup with `components/ui/skeleton` available.

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * FormSkeleton
 *
 * Props:
 * - fields: number of form fields to render (default 5)
 * - columns: 1 or 2 (layout columns)
 * - showHeader: show a header/title skeleton
 */
export default function FormSkeleton({ fields = 5, columns = 1, showHeader = true }) {
  const gridCols = columns === 2 ? "grid-cols-2" : "grid-cols-1";

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {showHeader && (
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-3/4 rounded-md mb-2" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          </div>
        )}

        <div className={`grid ${gridCols} gap-4`}>
          {Array.from({ length: fields }).map((_, i) => (
            <div key={i} className="space-y-2">
              {/* Label skeleton */}
              <Skeleton className="h-4 w-1/3 rounded-md" />

              {/* Input skeleton (full width) */}
              <Skeleton className="h-10 w-full rounded-md" />

              {/* Optional helper text skeleton */}
              <Skeleton className="h-3 w-1/2 rounded-md mt-2" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-12 rounded-md" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
