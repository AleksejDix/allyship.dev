import { createClient } from '@/lib/supabase/server'
import { Tables } from '../../../database.types'

type PageScanDailyStats = Tables<'page_scan_daily_stats'>
type PageScanWeeklyStats = Tables<'page_scan_weekly_stats'>
type PageScanMonthlyStats = Tables<'page_scan_monthly_stats'>
type PageLatestScanStats = Tables<'page_latest_scan_stats'>

interface PageScanAnalytics {
  dailyStats: PageScanDailyStats[]
  weeklyStats: PageScanWeeklyStats[]
  monthlyStats: PageScanMonthlyStats[]
  latestStats: PageLatestScanStats | null
}

export async function getPageScanAnalytics(
  pageId: string
): Promise<PageScanAnalytics> {
  const supabase = await createClient()

  // Fetch all analytics data in parallel
  const [dailyResult, weeklyResult, monthlyResult, latestResult] =
    await Promise.all([
      // Daily stats for the last 30 days
      supabase
        .from('page_scan_daily_stats')
        .select('*')
        .eq('page_id', pageId)
        .gte(
          'scan_date',
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
        )
        .order('scan_date', { ascending: true }),

      // Weekly stats for the last 12 weeks
      supabase
        .from('page_scan_weekly_stats')
        .select('*')
        .eq('page_id', pageId)
        .gte(
          'week_start',
          new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
        )
        .order('week_start', { ascending: true }),

      // Monthly stats for the last 12 months
      supabase
        .from('page_scan_monthly_stats')
        .select('*')
        .eq('page_id', pageId)
        .gte(
          'month_start',
          new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
        )
        .order('month_start', { ascending: true }),

      // Latest stats for the page
      supabase
        .from('page_latest_scan_stats')
        .select('*')
        .eq('page_id', pageId)
        .single(),
    ])

  // Handle errors gracefully
  const dailyStats = dailyResult.error ? [] : dailyResult.data
  const weeklyStats = weeklyResult.error ? [] : weeklyResult.data
  const monthlyStats = monthlyResult.error ? [] : monthlyResult.data
  const latestStats = latestResult.error ? null : latestResult.data

  return {
    dailyStats,
    weeklyStats,
    monthlyStats,
    latestStats,
  }
}

export async function refreshScanAnalytics(): Promise<void> {
  const supabase = await createClient()

  // Call the refresh function
  const { error } = await supabase.rpc('refresh_scan_analytics')

  if (error) {
    console.error('Failed to refresh scan analytics:', error)
    throw new Error('Failed to refresh scan analytics')
  }
}
