import { Database } from '@/apps/AllyShip/database.types'

export type ScanStatus = Database['public']['Enums']['ScanStatus']

export type Scan = Database['public']['Tables']['Scan']['Row']

export interface CreateScanResult {
  id: string
  status: ScanStatus
  created_at: string
}

export interface CreateScanParams {
  p_website_url: string
  p_page_url: string
  p_page_path: string
  p_space_id: string
  p_user_id: string
}

declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = CreateScanResult>(
      fn: 'create_scan_with_website_and_page',
      params: CreateScanParams
    ): Promise<{ data: T | null; error: null } | { data: null; error: any }>
  }
}
