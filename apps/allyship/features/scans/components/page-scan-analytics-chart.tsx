'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs'
import { CalendarDays, TrendingUp, Target, Activity } from 'lucide-react'
import { Tables } from '../../../database.types'

type PageScanDailyStats = Tables<'page_scan_daily_stats'>
type PageScanWeeklyStats = Tables<'page_scan_weekly_stats'>
type PageScanMonthlyStats = Tables<'page_scan_monthly_stats'>
type PageLatestScanStats = Tables<'page_latest_scan_stats'>

interface PageScanAnalyticsChartProps {
  pageId: string
  dailyStats: PageScanDailyStats[]
  weeklyStats: PageScanWeeklyStats[]
  monthlyStats: PageScanMonthlyStats[]
  latestStats: PageLatestScanStats | null
}

const COLORS = {
  completed: '#22c55e', // green-500
  failed: '#ef4444', // red-500
  pending: '#f59e0b', // amber-500
  queued: '#6b7280', // gray-500
}

const STATUS_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#6b7280']

export function PageScanAnalyticsChart({
  pageId,
  dailyStats,
  weeklyStats,
  monthlyStats,
  latestStats,
}: PageScanAnalyticsChartProps) {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  )

  // Get the appropriate data based on time range
  const getChartData = () => {
    switch (timeRange) {
      case 'daily':
        return dailyStats.map(stat => ({
          date: new Date(stat.scan_date!).toLocaleDateString(),
          total: stat.total_scans || 0,
          completed: stat.completed_scans || 0,
          failed: stat.failed_scans || 0,
          pending: stat.pending_scans || 0,
          queued: stat.queued_scans || 0,
          successRate: stat.success_rate || 0,
        }))
      case 'weekly':
        return weeklyStats.map(stat => ({
          date: new Date(stat.week_start!).toLocaleDateString(),
          total: stat.total_scans || 0,
          completed: stat.completed_scans || 0,
          failed: stat.failed_scans || 0,
          pending: stat.pending_scans || 0,
          queued: stat.queued_scans || 0,
          successRate: stat.success_rate || 0,
        }))
      case 'monthly':
        return monthlyStats.map(stat => ({
          date: new Date(stat.month_start!).toLocaleDateString(),
          total: stat.total_scans || 0,
          completed: stat.completed_scans || 0,
          failed: stat.failed_scans || 0,
          pending: stat.pending_scans || 0,
          queued: stat.queued_scans || 0,
          successRate: stat.success_rate || 0,
        }))
    }
  }

  const chartData = getChartData()

  // Calculate status distribution for pie chart
  const getStatusDistribution = () => {
    const totals = chartData.reduce(
      (acc, item) => ({
        completed: acc.completed + item.completed,
        failed: acc.failed + item.failed,
        pending: acc.pending + item.pending,
        queued: acc.queued + item.queued,
      }),
      { completed: 0, failed: 0, pending: 0, queued: 0 }
    )

    return [
      { name: 'Completed', value: totals.completed, color: COLORS.completed },
      { name: 'Failed', value: totals.failed, color: COLORS.failed },
      { name: 'Pending', value: totals.pending, color: COLORS.pending },
      { name: 'Queued', value: totals.queued, color: COLORS.queued },
    ].filter(item => item.value > 0)
  }

  const statusDistribution = getStatusDistribution()

  // Show empty state if no data
  if (!latestStats && chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity aria-hidden="true" className="h-5 w-5" />
            Scan Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity
              aria-hidden="true"
              className="h-12 w-12 text-muted-foreground mx-auto mb-4"
            />
            <h3 className="text-lg font-medium mb-2">No scan data available</h3>
            <p className="text-muted-foreground">
              Run your first scan to see analytics and trends for this page.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show basic stats even if no chart data
  if (!latestStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity aria-hidden="true" className="h-5 w-5" />
            Scan Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading scan analytics...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Scans
                </p>
                <p className="text-2xl font-bold">
                  {latestStats.total_scans || 0}
                </p>
              </div>
              <Activity
                aria-hidden="true"
                className="h-8 w-8 text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </p>
                <p className="text-2xl font-bold">
                  {latestStats.overall_success_rate || 0}%
                </p>
              </div>
              <Target
                aria-hidden="true"
                className="h-8 w-8 text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last 30 Days
                </p>
                <p className="text-2xl font-bold">
                  {latestStats.scans_last_30_days || 0}
                </p>
              </div>
              <CalendarDays
                aria-hidden="true"
                className="h-8 w-8 text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Latest Status
                </p>
                <Badge
                  variant={
                    latestStats.latest_status === 'completed'
                      ? 'default'
                      : latestStats.latest_status === 'failed'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {latestStats.latest_status}
                </Badge>
              </div>
              <TrendingUp
                aria-hidden="true"
                className="h-8 w-8 text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - only show if we have chart data */}
      {chartData.length > 0 && (
        <Tabs
          value={timeRange}
          onValueChange={(value: string) =>
            setTimeRange(value as 'daily' | 'weekly' | 'monthly')
          }
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Scan Volume Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Scan Volume Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="completed"
                      stackId="a"
                      fill={COLORS.completed}
                      name="Completed"
                    />
                    <Bar
                      dataKey="failed"
                      stackId="a"
                      fill={COLORS.failed}
                      name="Failed"
                    />
                    <Bar
                      dataKey="pending"
                      stackId="a"
                      fill={COLORS.pending}
                      name="Pending"
                    />
                    <Bar
                      dataKey="queued"
                      stackId="a"
                      fill={COLORS.queued}
                      name="Queued"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Success Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Success Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={value => [`${value}%`, 'Success Rate']}
                    />
                    <Line
                      type="monotone"
                      dataKey="successRate"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: '#22c55e' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            {statusDistribution.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Total Scans Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Total Scans Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      )}
    </div>
  )
}
