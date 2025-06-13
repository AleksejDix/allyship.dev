export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allyreport_issues: {
        Row: {
          context_data: Json | null
          created_at: string | null
          current_code: string | null
          description: string
          element_html: string | null
          element_selector: string | null
          estimated_effort: string | null
          fix_complexity: string | null
          fixed_at: string | null
          how_to_fix: string | null
          id: string
          resolution_notes: string | null
          rule_id: string
          scan_id: string
          screenshot_url: string | null
          severity: string
          status: string | null
          suggested_code: string | null
          title: string
          updated_at: string | null
          wcag_criterion: string | null
          wcag_guideline: string | null
          wcag_level: string | null
          wcag_principle: string | null
        }
        Insert: {
          context_data?: Json | null
          created_at?: string | null
          current_code?: string | null
          description: string
          element_html?: string | null
          element_selector?: string | null
          estimated_effort?: string | null
          fix_complexity?: string | null
          fixed_at?: string | null
          how_to_fix?: string | null
          id?: string
          resolution_notes?: string | null
          rule_id: string
          scan_id: string
          screenshot_url?: string | null
          severity: string
          status?: string | null
          suggested_code?: string | null
          title: string
          updated_at?: string | null
          wcag_criterion?: string | null
          wcag_guideline?: string | null
          wcag_level?: string | null
          wcag_principle?: string | null
        }
        Update: {
          context_data?: Json | null
          created_at?: string | null
          current_code?: string | null
          description?: string
          element_html?: string | null
          element_selector?: string | null
          estimated_effort?: string | null
          fix_complexity?: string | null
          fixed_at?: string | null
          how_to_fix?: string | null
          id?: string
          resolution_notes?: string | null
          rule_id?: string
          scan_id?: string
          screenshot_url?: string | null
          severity?: string
          status?: string | null
          suggested_code?: string | null
          title?: string
          updated_at?: string | null
          wcag_criterion?: string | null
          wcag_guideline?: string | null
          wcag_level?: string | null
          wcag_principle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'allyreport_issues_scan_id_fkey'
            columns: ['scan_id']
            isOneToOne: false
            referencedRelation: 'Scan'
            referencedColumns: ['id']
          },
        ]
      }
      allyreport_scans: {
        Row: {
          added_at: string | null
          allyreport_id: string
          id: string
          included_in_report: boolean | null
          matched_pattern: string | null
          page_notes: string | null
          priority_level: number | null
          scan_id: string
          scan_weight: number | null
        }
        Insert: {
          added_at?: string | null
          allyreport_id: string
          id?: string
          included_in_report?: boolean | null
          matched_pattern?: string | null
          page_notes?: string | null
          priority_level?: number | null
          scan_id: string
          scan_weight?: number | null
        }
        Update: {
          added_at?: string | null
          allyreport_id?: string
          id?: string
          included_in_report?: boolean | null
          matched_pattern?: string | null
          page_notes?: string | null
          priority_level?: number | null
          scan_id?: string
          scan_weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'allyreport_scans_report_config_id_fkey'
            columns: ['allyreport_id']
            isOneToOne: false
            referencedRelation: 'report_configs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'allyreport_scans_report_config_id_fkey'
            columns: ['allyreport_id']
            isOneToOne: false
            referencedRelation: 'reports'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'allyreport_scans_scan_id_fkey'
            columns: ['scan_id']
            isOneToOne: false
            referencedRelation: 'Scan'
            referencedColumns: ['id']
          },
        ]
      }
      Page: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          normalized_url: string
          path: string
          updated_at: string
          url: string
          website_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          normalized_url?: string
          path: string
          updated_at?: string
          url: string
          website_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          normalized_url?: string
          path?: string
          updated_at?: string
          url?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'Page_website_id_fkey'
            columns: ['website_id']
            isOneToOne: false
            referencedRelation: 'Website'
            referencedColumns: ['id']
          },
        ]
      }
      report_configs: {
        Row: {
          access_password: string | null
          base_url: string
          branding: Json | null
          created_at: string | null
          deleted_at: string | null
          executive_summary: string | null
          id: string
          is_public: boolean | null
          methodology: string | null
          next_review_date: string | null
          password_protected: boolean | null
          recommendations: string | null
          scope_config: Json | null
          share_token: string | null
          space_id: string | null
          target_domain: string
          title: string
          updated_at: string | null
          wcag_level: string | null
        }
        Insert: {
          access_password?: string | null
          base_url: string
          branding?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          executive_summary?: string | null
          id?: string
          is_public?: boolean | null
          methodology?: string | null
          next_review_date?: string | null
          password_protected?: boolean | null
          recommendations?: string | null
          scope_config?: Json | null
          share_token?: string | null
          space_id?: string | null
          target_domain: string
          title: string
          updated_at?: string | null
          wcag_level?: string | null
        }
        Update: {
          access_password?: string | null
          base_url?: string
          branding?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          executive_summary?: string | null
          id?: string
          is_public?: boolean | null
          methodology?: string | null
          next_review_date?: string | null
          password_protected?: boolean | null
          recommendations?: string | null
          scope_config?: Json | null
          share_token?: string | null
          space_id?: string | null
          target_domain?: string
          title?: string
          updated_at?: string | null
          wcag_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'report_configs_space_id_fkey'
            columns: ['space_id']
            isOneToOne: false
            referencedRelation: 'Space'
            referencedColumns: ['id']
          },
        ]
      }
      Scan: {
        Row: {
          created_at: string
          id: string
          metrics: Json
          normalized_url: string
          page_id: string
          screenshot_dark: string | null
          screenshot_light: string | null
          status: Database['public']['Enums']['ScanStatus']
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json
          normalized_url?: string
          page_id: string
          screenshot_dark?: string | null
          screenshot_light?: string | null
          status?: Database['public']['Enums']['ScanStatus']
          url?: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json
          normalized_url?: string
          page_id?: string
          screenshot_dark?: string | null
          screenshot_light?: string | null
          status?: Database['public']['Enums']['ScanStatus']
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'Scan_page_id_fkey'
            columns: ['page_id']
            isOneToOne: false
            referencedRelation: 'Page'
            referencedColumns: ['id']
          },
        ]
      }
      ScanSchedule: {
        Row: {
          created_at: string
          frequency: string
          id: string
          is_active: boolean
          last_scan_at: string | null
          next_scan_at: string | null
          page_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          frequency: string
          id?: string
          is_active?: boolean
          last_scan_at?: string | null
          next_scan_at?: string | null
          page_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          last_scan_at?: string | null
          next_scan_at?: string | null
          page_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ScanSchedule_page_id_fkey'
            columns: ['page_id']
            isOneToOne: true
            referencedRelation: 'Page'
            referencedColumns: ['id']
          },
        ]
      }
      Space: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          is_personal: boolean
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_personal?: boolean
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_personal?: boolean
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      wcag_guideline: {
        Row: {
          conformance_level: string | null
          created_at: string | null
          description: string | null
          guideline_number: string
          id: string
          principle_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          conformance_level?: string | null
          created_at?: string | null
          description?: string | null
          guideline_number: string
          id?: string
          principle_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          conformance_level?: string | null
          created_at?: string | null
          description?: string | null
          guideline_number?: string
          id?: string
          principle_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'wcag_guideline_principle_id_fkey'
            columns: ['principle_id']
            isOneToOne: false
            referencedRelation: 'wcag_principle'
            referencedColumns: ['id']
          },
        ]
      }
      wcag_principle: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      wcag_success_criterion: {
        Row: {
          created_at: string | null
          description: string | null
          guideline_id: string
          id: string
          level: string
          principle_id: string | null
          sc_number: string
          title: string | null
          updated_at: string | null
          url: string | null
          wcag_version_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          guideline_id: string
          id?: string
          level: string
          principle_id?: string | null
          sc_number: string
          title?: string | null
          updated_at?: string | null
          url?: string | null
          wcag_version_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          guideline_id?: string
          id?: string
          level?: string
          principle_id?: string | null
          sc_number?: string
          title?: string | null
          updated_at?: string | null
          url?: string | null
          wcag_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'wcag_success_criterion_guideline_id_fkey'
            columns: ['guideline_id']
            isOneToOne: false
            referencedRelation: 'wcag_guideline'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'wcag_success_criterion_principle_id_fkey'
            columns: ['principle_id']
            isOneToOne: false
            referencedRelation: 'wcag_principle'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'wcag_success_criterion_wcag_version_id_fkey'
            columns: ['wcag_version_id']
            isOneToOne: false
            referencedRelation: 'wcag_version'
            referencedColumns: ['id']
          },
        ]
      }
      wcag_version: {
        Row: {
          id: string
          release_date: string | null
          status: string | null
          title: string | null
          url: string | null
          version: string
        }
        Insert: {
          id?: string
          release_date?: string | null
          status?: string | null
          title?: string | null
          url?: string | null
          version: string
        }
        Update: {
          id?: string
          release_date?: string | null
          status?: string | null
          title?: string | null
          url?: string | null
          version?: string
        }
        Relationships: []
      }
      Website: {
        Row: {
          created_at: string
          id: string
          normalized_url: string
          space_id: string
          theme: Database['public']['Enums']['DomainTheme']
          updated_at: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          normalized_url?: string
          space_id: string
          theme?: Database['public']['Enums']['DomainTheme']
          updated_at?: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          normalized_url?: string
          space_id?: string
          theme?: Database['public']['Enums']['DomainTheme']
          updated_at?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'Domain_space_id_fkey'
            columns: ['space_id']
            isOneToOne: false
            referencedRelation: 'Space'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      reports: {
        Row: {
          access_password: string | null
          base_url: string | null
          branding: Json | null
          completed_at: string | null
          created_at: string | null
          deleted_at: string | null
          executive_summary: string | null
          id: string | null
          is_public: boolean | null
          methodology: string | null
          next_review_date: string | null
          password_protected: boolean | null
          published_at: string | null
          recommendations: string | null
          scope_config: Json | null
          share_token: string | null
          space_id: string | null
          started_at: string | null
          status: string | null
          summary: Json | null
          target_domain: string | null
          title: string | null
          updated_at: string | null
          wcag_level: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'report_configs_space_id_fkey'
            columns: ['space_id']
            isOneToOne: false
            referencedRelation: 'Space'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Functions: {
      calculate_next_scan_time: {
        Args: { frequency_val: string; base_time?: string }
        Returns: string
      }
      cleanup_disabled_accounts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_audit_logs: {
        Args: { retention_period?: unknown }
        Returns: number
      }
      extract_path_from_url: {
        Args: { url: string }
        Returns: string
      }
      is_admin: {
        Args: { jwt?: Json }
        Returns: boolean
      }
      log_user_action: {
        Args: {
          user_id: string
          action: string
          details?: Json
          ip_address?: string
        }
        Returns: undefined
      }
      mask_ip_address: {
        Args: { ip: string }
        Returns: string
      }
      merge_duplicate_pages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      merge_duplicate_websites: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      normalize_page_url: {
        Args: { url: string } | { url: string; website_normalized_url: string }
        Returns: string
      }
      normalize_url: {
        Args: { url: string }
        Returns: string
      }
      normalize_website_url: {
        Args: { url: string }
        Returns: string
      }
      parse_name: {
        Args: { full_name: string }
        Returns: {
          first_name: string
          last_name: string
        }[]
      }
      queue_user_notification: {
        Args: { user_id: string; notification_type: string; details?: Json }
        Returns: string
      }
      reactivate_user: {
        Args: { user_id: string; admin_id: string; reason?: string }
        Returns: undefined
      }
      request_gdpr_deletion: {
        Args: {
          user_id: string
          requester_id?: string
          reason?: string
          admin_override?: boolean
        }
        Returns: undefined
      }
      verify_active_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      DomainTheme: 'LIGHT' | 'DARK' | 'BOTH'
      ScanStatus: 'pending' | 'completed' | 'failed' | 'queued'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      DomainTheme: ['LIGHT', 'DARK', 'BOTH'],
      ScanStatus: ['pending', 'completed', 'failed', 'queued'],
    },
  },
} as const
