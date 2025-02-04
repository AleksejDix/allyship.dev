"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
      .channel("scan")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "scan" },
        (payload) => {
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

  return (
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
                <Badge variant="secondary">{scan.results.passes.length}</Badge>
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
}
