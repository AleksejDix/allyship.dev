"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { IssueDistribution } from "@/features/scans/components/issue-distribution"
import { Passes } from "@/features/scans/components/passes"
// import { TestEngine } from "@/features/scans/components/test-engine"
import { AlertCircleIcon, AlertTriangleIcon, CheckIcon } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"

export function ScanShow({ serverProps }: { serverProps: any }) {
  const [scan, setScan] = useState(serverProps)

  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel("Scan")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Scan" },
        (payload) => {
          console.log("payload", payload)
          if (payload.new.id === scan.id) {
            setScan(payload.new)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  })

  if (scan.status === "pending") {
    return (
      <div>
        <div
          aria-hidden="true"
          className="w-full h-full bg-card rounded-md border border-border"
        >
          {/* Browser Chrome */}
          <div className="bg-muted border-b border-border">
            {/* Title bar */}
            <div className="px-4 py-2 flex items-center gap-2">
              {/* Traffic light buttons */}
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              {/* URL Bar */}
              <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center gap-2 ml-4">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                example.com
              </div>
            </div>

            {/* Tab bar */}
            <div className="px-4 flex items-center gap-2">
              <div className="bg-background rounded-t-lg px-4 py-1 text-xs border-t border-x border-border flex items-center gap-2">
                <span>example.com</span>
                <div className="w-4 h-4 rounded-full hover:bg-muted flex items-center justify-center">
                  ×
                </div>
              </div>
              <div className="w-5 h-5 rounded-md hover:bg-muted flex items-center justify-center text-xs">
                +
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 space-y-3 relative overflow-hidden aspect-video w-full">
            {/* Scanning container */}
            <div>
              <div className="absolute inset-0 animate-scan animate-duration-[5s]">
                {/* Left gradient glow */}
                <div className="absolute top-0 left-0 bottom-0 w-[1px] h-full bg-green-500">
                  <div className="absolute animate-hide-right top-0 left-[1px] bottom-0 w-8 bg-gradient-to-l from-transparent to-green-500/20" />
                  <div className="absolute animate-hide-left opacity-0 top-0 right-[1px] bottom-0 w-8 bg-gradient-to-r from-transparent to-green-500/20" />
                </div>
                {/* Glowing line */}
                {/* Right gradient glow */}
              </div>
            </div>
            <div className="h-24 w-4/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30 animate-pulse" />
            <div className="h-12 w-3/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30 animate-pulse" />
            <div className="h-32 w-2/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    scan.status === "completed" && (
      <div className="container py-8 ">
        {/* <pre>{JSON.stringify(scan, null, 2)}</pre> */}
        {scan.results && scan.status === "completed" && (
          <div className="space-y-8">
            <PageHeader heading={scan.url} />

            <div className="grid lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Screenshot</CardTitle>
                </CardHeader>
                <CardContent>
                  {scan.screenshot && (
                    <Image
                      src={scan.screenshot}
                      alt={`Screenshot of ${scan.url}`}
                      width={800}
                      height={600}
                      className="rounded-lg object-cover w-full"
                    />
                  )}
                </CardContent>
              </Card>

              <IssueDistribution results={scan.results} />

              <Card>
                <CardHeader>
                  <CardTitle>Scan Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Total Issues
                      </p>
                      <p className="text-2xl font-bold">
                        {scan.results.violations.length +
                          scan.results.incomplete.length}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          (scan.results.passes.length /
                            (scan.results.passes.length +
                              scan.results.violations.length)) *
                            100
                        )}
                        %
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Total Passes
                      </p>
                      <p className="text-2xl font-bold">
                        {scan.results.passes.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="violations">
              <TabsList>
                <TabsTrigger
                  className="flex-inline gap-2 text-destructive-foreground"
                  value="violations"
                >
                  <AlertCircleIcon className="w-4 h-4" />
                  Violations
                  <Badge variant="secondary">
                    {scan.results.violations.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger className="flex-inline gap-2" value="passes">
                  <CheckIcon className="w-4 h-4" />
                  Passes
                  <Badge variant="secondary">
                    {scan.results.passes.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger className="flex-inline gap-2" value="incomplete">
                  <AlertCircleIcon className="w-4 h-4" />
                  Incomplete
                  <Badge variant="secondary">
                    {scan.results.incomplete.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger className="flex-inline gap-2" value="inapplicable">
                  <AlertTriangleIcon className="w-4 h-4" />
                  Inapplicable
                  <Badge variant="secondary">
                    {scan.results.inapplicable.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="violations">
                <Passes passes={scan.results.violations} />
              </TabsContent>
              <TabsContent value="passes">
                <Passes passes={scan.results.passes} />
              </TabsContent>
              <TabsContent value="incomplete">
                <Passes passes={scan.results.incomplete} />
              </TabsContent>
              <TabsContent value="inapplicable">
                <Passes passes={scan.results.inapplicable} />
              </TabsContent>
            </Tabs>

            {scan.status === "completed" && (
              <div className="space-y-4">
                {/* <pre>{JSON.stringify(Object.keys(scan.results), null, 2)}</pre> */}

                {/* <TestEngine testEngine={scan.results.testEngine} /> */}
              </div>
            )}
            {scan.status === "failed" && (
              <p>Error: Something went wrong during the scan.</p>
            )}
          </div>
        )}
      </div>
    )
  )
}
