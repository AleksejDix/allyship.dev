import { createClient } from '@/lib/supabase/server'
import { Database } from '@/database.types'

type AccessibilityDailyStats =
  Database['public']['Views']['page_accessibility_daily_stats']['Row']
type AccessibilityWeeklyStats =
  Database['public']['Views']['page_accessibility_weekly_stats']['Row']
type AccessibilityMonthlyStats =
  Database['public']['Views']['page_accessibility_monthly_stats']['Row']
type AccessibilityLatestStats =
  Database['public']['Views']['page_latest_accessibility_stats']['Row']

export interface AccessibilityAnalyticsData {
  daily: AccessibilityDailyStats[]
  weekly: AccessibilityWeeklyStats[]
  monthly: AccessibilityMonthlyStats[]
  latest: AccessibilityLatestStats | null
}

export async function getPageAccessibilityAnalytics(
  pageId: string,
  timeRange: '7d' | '30d' | '90d' = '30d'
): Promise<AccessibilityAnalyticsData> {
  const supabase = await createClient()

  // Calculate date range
  const endDate = new Date()
  const startDate = new Date()

  switch (timeRange) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(endDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(endDate.getDate() - 90)
      break
  }

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  // Fetch all data in parallel
  const [dailyResult, weeklyResult, monthlyResult, latestResult] =
    await Promise.all([
      // Daily stats
      supabase
        .from('page_accessibility_daily_stats')
        .select('*')
        .eq('page_id', pageId)
        .gte('scan_date', startDateStr)
        .lte('scan_date', endDateStr)
        .order('scan_date', { ascending: true }),

      // Weekly stats
      supabase
        .from('page_accessibility_weekly_stats')
        .select('*')
        .eq('page_id', pageId)
        .gte('week_start', startDateStr)
        .lte('week_start', endDateStr)
        .order('week_start', { ascending: true }),

      // Monthly stats
      supabase
        .from('page_accessibility_monthly_stats')
        .select('*')
        .eq('page_id', pageId)
        .gte('month_start', startDateStr)
        .lte('month_start', endDateStr)
        .order('month_start', { ascending: true }),

      // Latest stats
      supabase
        .from('page_latest_accessibility_stats')
        .select('*')
        .eq('page_id', pageId)
        .single(),
    ])

  // Handle errors
  if (dailyResult.error) {
    console.error(
      'Error fetching daily accessibility stats:',
      dailyResult.error
    )
  }
  if (weeklyResult.error) {
    console.error(
      'Error fetching weekly accessibility stats:',
      weeklyResult.error
    )
  }
  if (monthlyResult.error) {
    console.error(
      'Error fetching monthly accessibility stats:',
      monthlyResult.error
    )
  }
  if (latestResult.error && latestResult.error.code !== 'PGRST116') {
    console.error(
      'Error fetching latest accessibility stats:',
      latestResult.error
    )
  }

  return {
    daily: dailyResult.data || [],
    weekly: weeklyResult.data || [],
    monthly: monthlyResult.data || [],
    latest: latestResult.data || null,
  }
}

export interface AccessibilityTrendData {
  date: string
  accessibility_score: number
  critical_issues: number
  serious_issues: number
  moderate_issues: number
  minor_issues: number
  total_violations: number
  total_passes: number
  total_issues: number
}

export function formatAccessibilityDataForCharts(
  data: AccessibilityAnalyticsData,
  granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
): AccessibilityTrendData[] {
  let sourceData: any[]
  let dateField: string

  switch (granularity) {
    case 'weekly':
      sourceData = data.weekly
      dateField = 'week_start'
      break
    case 'monthly':
      sourceData = data.monthly
      dateField = 'month_start'
      break
    default:
      sourceData = data.daily
      dateField = 'scan_date'
  }

  return sourceData.map(item => ({
    date: item[dateField],
    accessibility_score: item.avg_accessibility_score || 0,
    critical_issues: item.avg_critical_issues || 0,
    serious_issues: item.avg_serious_issues || 0,
    moderate_issues: item.avg_moderate_issues || 0,
    minor_issues: item.avg_minor_issues || 0,
    total_violations: item.avg_violations || 0,
    total_passes: item.avg_passes || 0,
    total_issues:
      (item.avg_critical_issues || 0) +
      (item.avg_serious_issues || 0) +
      (item.avg_moderate_issues || 0) +
      (item.avg_minor_issues || 0),
  }))
}

export function getAccessibilityScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600'
  if (score >= 75) return 'text-yellow-600'
  if (score >= 50) return 'text-orange-600'
  return 'text-red-600'
}

export function getAccessibilityScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 50) return 'Needs Improvement'
  return 'Poor'
}

export function getIssuesSeverityColor(
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
): string {
  switch (severity) {
    case 'critical':
      return 'text-red-600'
    case 'serious':
      return 'text-orange-600'
    case 'moderate':
      return 'text-yellow-600'
    case 'minor':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}
