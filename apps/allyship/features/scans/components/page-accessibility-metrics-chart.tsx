'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Badge } from '@workspace/ui/components/badge'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  AccessibilityAnalyticsData,
  AccessibilityTrendData,
  formatAccessibilityDataForCharts,
  getAccessibilityScoreColor,
  getAccessibilityScoreLabel,
  getIssuesSeverityColor,
} from '../lib/get-page-accessibility-analytics-client'
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

interface PageAccessibilityMetricsChartProps {
  data: AccessibilityAnalyticsData
  pageId: string
}

export function PageAccessibilityMetricsChart({
  data,
  pageId,
}: PageAccessibilityMetricsChartProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [granularity, setGranularity] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily')

  const chartData = formatAccessibilityDataForCharts(data, granularity)
  const latest = data.latest

  // Calculate summary stats
  const totalIssues = latest
    ? (latest.latest_critical_issues || 0) +
      (latest.latest_serious_issues || 0) +
      (latest.latest_moderate_issues || 0) +
      (latest.latest_minor_issues || 0)
    : 0

  const accessibilityScore = latest?.latest_accessibility_score || 0
  const scoreLabel = getAccessibilityScoreLabel(accessibilityScore)
  const scoreColor = getAccessibilityScoreColor(accessibilityScore)

  // Prepare pie chart data for issue breakdown
  const issueBreakdownData = latest
    ? [
        {
          name: 'Critical',
          value: latest.latest_critical_issues || 0,
          color: '#dc2626',
        },
        {
          name: 'Serious',
          value: latest.latest_serious_issues || 0,
          color: '#ea580c',
        },
        {
          name: 'Moderate',
          value: latest.latest_moderate_issues || 0,
          color: '#ca8a04',
        },
        {
          name: 'Minor',
          value: latest.latest_minor_issues || 0,
          color: '#2563eb',
        },
      ].filter(item => item.value > 0)
    : []

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Accessibility Score
            </CardTitle>
            <CheckCircle
              aria-hidden="true"
              className="h-4 w-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={scoreColor}>{accessibilityScore}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className={scoreColor}>
                {scoreLabel}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <AlertTriangle
              aria-hidden="true"
              className="h-4 w-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssues}</div>
            <p className="text-xs text-muted-foreground">
              {latest?.latest_critical_issues || 0} critical,{' '}
              {latest?.latest_serious_issues || 0} serious
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Passed</CardTitle>
            <CheckCircle
              aria-hidden="true"
              className="h-4 w-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {latest?.latest_passes || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Accessibility tests passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Clock
              aria-hidden="true"
              className="h-4 w-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latest?.total_completed_scans || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed accessibility scans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="granularity-select" className="text-sm font-medium">
            Granularity:
          </label>
          <Select
            value={granularity}
            onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
              setGranularity(value)
            }
          >
            <SelectTrigger id="granularity-select" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accessibility Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Score Trend</CardTitle>
            <CardDescription>
              Track accessibility score improvements over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={value => new Date(value).toLocaleDateString()}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={value => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [
                    `${value}%`,
                    'Accessibility Score',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="accessibility_score"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issues by Severity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Issues by Severity</CardTitle>
            <CardDescription>
              Track different types of accessibility issues over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={value => new Date(value).toLocaleDateString()}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={value => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="critical_issues"
                  stackId="1"
                  stroke="#dc2626"
                  fill="#dc2626"
                  name="Critical"
                />
                <Area
                  type="monotone"
                  dataKey="serious_issues"
                  stackId="1"
                  stroke="#ea580c"
                  fill="#ea580c"
                  name="Serious"
                />
                <Area
                  type="monotone"
                  dataKey="moderate_issues"
                  stackId="1"
                  stroke="#ca8a04"
                  fill="#ca8a04"
                  name="Moderate"
                />
                <Area
                  type="monotone"
                  dataKey="minor_issues"
                  stackId="1"
                  stroke="#2563eb"
                  fill="#2563eb"
                  name="Minor"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Violations vs Passes */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results Trend</CardTitle>
            <CardDescription>
              Compare violations and passes over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={value => new Date(value).toLocaleDateString()}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={value => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Bar
                  dataKey="total_violations"
                  fill="#dc2626"
                  name="Violations"
                />
                <Bar dataKey="total_passes" fill="#16a34a" name="Passes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Current Issue Breakdown */}
        {issueBreakdownData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Current Issue Breakdown</CardTitle>
              <CardDescription>
                Distribution of issues by severity in latest scan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={issueBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {issueBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Historical Comparison */}
      {latest && (
        <Card>
          <CardHeader>
            <CardTitle>Historical Comparison</CardTitle>
            <CardDescription>
              Compare current metrics with historical averages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Current Violations:
                  </span>
                  <span className="text-sm">
                    {latest.latest_violations || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Historical Average:
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {latest.avg_violations_all_time || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trend:</span>
                  <div className="flex items-center space-x-1">
                    {(latest.latest_violations || 0) <
                    (latest.avg_violations_all_time || 0) ? (
                      <>
                        <TrendingDown
                          aria-hidden="true"
                          className="h-4 w-4 text-green-600"
                        />
                        <span className="text-sm text-green-600">
                          Improving
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingUp
                          aria-hidden="true"
                          className="h-4 w-4 text-red-600"
                        />
                        <span className="text-sm text-red-600">
                          Needs Attention
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Current Critical Issues:
                  </span>
                  <span className="text-sm">
                    {latest.latest_critical_issues || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Historical Average:
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {latest.avg_critical_all_time || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trend:</span>
                  <div className="flex items-center space-x-1">
                    {(latest.latest_critical_issues || 0) <
                    (latest.avg_critical_all_time || 0) ? (
                      <>
                        <TrendingDown
                          aria-hidden="true"
                          className="h-4 w-4 text-green-600"
                        />
                        <span className="text-sm text-green-600">
                          Improving
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingUp
                          aria-hidden="true"
                          className="h-4 w-4 text-red-600"
                        />
                        <span className="text-sm text-red-600">
                          Needs Attention
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
