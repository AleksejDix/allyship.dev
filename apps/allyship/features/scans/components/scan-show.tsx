'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Database } from '@/apps/AllyShip/database.types'
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckIcon,
  MoonIcon,
  SunIcon,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/page-header'

type MetricsData = {
  violations_count: number
  passes_count: number
  incomplete_count: number
  inapplicable_count: number
  critical_issues: number
  serious_issues: number
  moderate_issues: number
  minor_issues: number
  results_url: string
}

type Scan = Database['public']['Tables']['Scan']['Row']

export function ScanShow({ serverProps }: { serverProps: Scan }) {
  const [scan, setScan] = useState(serverProps)
  const [activeMode, setActiveMode] = useState<'light' | 'dark'>('light')
  const [progress, setProgress] = useState<{
    hasScreenshots: boolean
    hasMetrics: boolean
  }>({
    hasScreenshots:
      !!serverProps?.screenshot_light && !!serverProps?.screenshot_dark,
    hasMetrics: !!serverProps?.metrics,
  })

  const supabase = createClient()

  useEffect(() => {
    console.log('scan', scan)
    if (!scan) return
    const channel = supabase
      .channel(`scan:${scan.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Scan',
          filter: `id=eq.${scan.id}`,
        },
        payload => {
          const newScan = payload.new as Scan
          setScan(newScan)
          setProgress({
            hasScreenshots:
              !!newScan.screenshot_light && !!newScan.screenshot_dark,
            hasMetrics: !!newScan.metrics,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  })

  if (!scan) {
    return notFound()
  }

  if (scan.status === 'pending') {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <PageHeader heading={scan.url} />
          <Card>
            <CardHeader>
              <CardTitle>Scanning in Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    We are currently scanning your website for accessibility
                    issues. This process typically takes 1-2 minutes.
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${progress.hasScreenshots ? 'bg-green-500' : 'bg-muted'}`}
                      />
                      <span className="text-sm">Capturing screenshots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${progress.hasMetrics ? 'bg-green-500' : 'bg-muted'}`}
                      />
                      <span className="text-sm">
                        Running accessibility tests
                      </span>
                    </div>
                  </div>
                </div>
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
                      </div>
                    </div>
                    <div className="h-24 w-4/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30 animate-pulse" />
                    <div className="h-12 w-3/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30 animate-pulse" />
                    <div className="h-32 w-2/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30 animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Early return if no metrics available
  if (!scan.metrics) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <PageHeader heading={scan.url} />
          <Card>
            <CardHeader>
              <CardTitle>Processing Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The scan is complete, but we&apos;re still processing the
                results. Please wait a moment...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentMetrics = (
    scan.metrics as Record<'light' | 'dark', MetricsData>
  )?.[activeMode]

  if (!currentMetrics) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <PageHeader heading={scan.url} />
          <Card>
            <CardHeader>
              <CardTitle>No Results Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No results are available for {activeMode} mode.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {scan.status === 'completed' && (
        <div className="space-y-8">
          <PageHeader heading={scan.url} />

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Screenshots</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <SunIcon className="w-4 h-4" />
                      <h3 className="text-sm font-medium">Light Mode</h3>
                    </div>
                    {scan.screenshot_light && (
                      <Image
                        src={scan.screenshot_light}
                        alt={`Light mode screenshot of ${scan.url}`}
                        width={1440}
                        height={900}
                        className="rounded-lg w-full border border-border"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MoonIcon className="w-4 h-4" />
                      <h3 className="text-sm font-medium">Dark Mode</h3>
                    </div>
                    {scan.screenshot_dark && (
                      <Image
                        src={scan.screenshot_dark}
                        alt={`Dark mode screenshot of ${scan.url}`}
                        width={1440}
                        height={900}
                        className="rounded-lg w-full border border-border"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    Accessibility Results
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveMode('light')}
                        className={`p-2 rounded-md ${activeMode === 'light' ? 'bg-muted' : ''}`}
                        aria-label="Show light mode results"
                      >
                        <SunIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveMode('dark')}
                        className={`p-2 rounded-md ${activeMode === 'dark' ? 'bg-muted' : ''}`}
                        aria-label="Show dark mode results"
                      >
                        <MoonIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Total Issues
                      </p>
                      <p className="text-2xl font-bold">
                        {currentMetrics.violations_count +
                          currentMetrics.incomplete_count}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          (currentMetrics.passes_count /
                            (currentMetrics.passes_count +
                              currentMetrics.violations_count)) *
                            100
                        )}
                        %
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Critical Issues
                      </p>
                      <p className="text-2xl font-bold text-destructive">
                        {currentMetrics.critical_issues}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Total Passes
                      </p>
                      <p className="text-2xl font-bold text-green-500">
                        {currentMetrics.passes_count}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issue Severity ({activeMode} mode)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Critical</span>
                        <span className="font-medium">
                          {currentMetrics.critical_issues}
                        </span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div
                          className="bg-destructive rounded-full h-2"
                          style={{
                            width: `${(currentMetrics.critical_issues / currentMetrics.violations_count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Serious</span>
                        <span className="font-medium">
                          {currentMetrics.serious_issues}
                        </span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div
                          className="bg-orange-500 rounded-full h-2"
                          style={{
                            width: `${(currentMetrics.serious_issues / currentMetrics.violations_count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Moderate</span>
                        <span className="font-medium">
                          {currentMetrics.moderate_issues}
                        </span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-500 rounded-full h-2"
                          style={{
                            width: `${(currentMetrics.moderate_issues / currentMetrics.violations_count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Minor</span>
                        <span className="font-medium">
                          {currentMetrics.minor_issues}
                        </span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 rounded-full h-2"
                          style={{
                            width: `${(currentMetrics.minor_issues / currentMetrics.violations_count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Results ({activeMode} mode)</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="violations">
                <TabsList>
                  <TabsTrigger
                    className="flex-inline gap-2 text-destructive-foreground"
                    value="violations"
                  >
                    <AlertCircleIcon className="w-4 h-4" />
                    Violations
                    <Badge variant="secondary">
                      {currentMetrics.violations_count}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger className="flex-inline gap-2" value="passes">
                    <CheckIcon className="w-4 h-4" />
                    Passes
                    <Badge variant="secondary">
                      {currentMetrics.passes_count}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger className="flex-inline gap-2" value="incomplete">
                    <AlertCircleIcon className="w-4 h-4" />
                    Incomplete
                    <Badge variant="secondary">
                      {currentMetrics.incomplete_count}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex-inline gap-2"
                    value="inapplicable"
                  >
                    <AlertTriangleIcon className="w-4 h-4" />
                    Inapplicable
                    <Badge variant="secondary">
                      {currentMetrics.inapplicable_count}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="violations">
                  <div className="mt-4">
                    <a
                      href={currentMetrics.results_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View detailed results
                    </a>
                  </div>
                </TabsContent>
                <TabsContent value="passes">
                  <div className="mt-4">
                    <a
                      href={currentMetrics.results_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View detailed results
                    </a>
                  </div>
                </TabsContent>
                <TabsContent value="incomplete">
                  <div className="mt-4">
                    <a
                      href={currentMetrics.results_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View detailed results
                    </a>
                  </div>
                </TabsContent>
                <TabsContent value="inapplicable">
                  <div className="mt-4">
                    <a
                      href={currentMetrics.results_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View detailed results
                    </a>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {scan.status === 'failed' && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive">
          <p>Error: Something went wrong during the scan.</p>
        </div>
      )}
    </div>
  )
}
