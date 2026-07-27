import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted rounded-md" />
        <div className="h-4 w-96 bg-muted rounded-md" />
      </div>

      {/* Metrics Grid Skeleton (4 cards) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-muted bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="h-4 w-24 bg-muted rounded-md" />
              <div className="h-4 w-4 bg-muted rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-8 w-16 bg-muted rounded-md" />
              <div className="h-3 w-32 bg-muted rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Panels Skeleton */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Left Column (col-span-4) */}
        <div className="md:col-span-4 space-y-6">
          {/* Card 1 */}
          <Card className="border-muted bg-card">
            <CardHeader className="space-y-2">
              <div className="h-5 w-40 bg-muted rounded-md" />
              <div className="h-3.5 w-60 bg-muted rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-xl bg-secondary/10 gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/3 bg-muted rounded-md" />
                    <div className="h-3 w-1/4 bg-muted rounded-md" />
                  </div>
                  <div className="h-6 w-12 bg-muted rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 2 (Table) */}
          <Card className="border-muted bg-card">
            <CardHeader className="space-y-2">
              <div className="h-5 w-32 bg-muted rounded-md" />
              <div className="h-3.5 w-48 bg-muted rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex border-b pb-2">
                  <div className="h-4 w-1/3 bg-muted rounded-md mr-4" />
                  <div className="h-4 w-1/4 bg-muted rounded-md mr-4" />
                  <div className="h-4 w-1/4 bg-muted rounded-md ml-auto" />
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex py-2">
                    <div className="h-4 w-1/2 bg-muted rounded-md mr-4" />
                    <div className="h-4 w-16 bg-muted rounded-md mr-4" />
                    <div className="h-4 w-8 bg-muted rounded-md ml-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (col-span-3) */}
        <div className="md:col-span-3">
          <Card className="border-muted bg-card h-full">
            <CardHeader className="space-y-2">
              <div className="h-5 w-48 bg-muted rounded-md" />
              <div className="h-3.5 w-64 bg-muted rounded-md" />
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-4 w-12 bg-muted rounded-md" />
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
