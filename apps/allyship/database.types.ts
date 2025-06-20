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
      act_rule_wcag_mappings: {
        Row: {
          act_rule_id: string
          confidence_level: number
          created_at: string
          for_conformance: boolean
          id: string
          notes: string | null
          relationship_type: string
          wcag_criterion_id: string
        }
        Insert: {
          act_rule_id: string
          confidence_level?: number
          created_at?: string
          for_conformance?: boolean
          id?: string
          notes?: string | null
          relationship_type?: string
          wcag_criterion_id: string
        }
        Update: {
          act_rule_id?: string
          confidence_level?: number
          created_at?: string
          for_conformance?: boolean
          id?: string
          notes?: string | null
          relationship_type?: string
          wcag_criterion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "act_rule_wcag_mappings_act_rule_id_fkey"
            columns: ["act_rule_id"]
            isOneToOne: false
            referencedRelation: "act_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "act_rule_wcag_mappings_act_rule_id_fkey"
            columns: ["act_rule_id"]
            isOneToOne: false
            referencedRelation: "act_rules_with_wcag"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "act_rule_wcag_mappings_wcag_criterion_id_fkey"
            columns: ["wcag_criterion_id"]
            isOneToOne: false
            referencedRelation: "wcag_success_criterion"
            referencedColumns: ["id"]
          },
        ]
      }
      act_rules: {
        Row: {
          categories: Database["public"]["Enums"]["act_rule_category"][]
          created_at: string
          description: string
          id: string
          implementation_url: string | null
          input_aspects: string[]
          is_active: boolean
          name: string
          rule_id: string
          updated_at: string
        }
        Insert: {
          categories?: Database["public"]["Enums"]["act_rule_category"][]
          created_at?: string
          description: string
          id?: string
          implementation_url?: string | null
          input_aspects?: string[]
          is_active?: boolean
          name: string
          rule_id: string
          updated_at?: string
        }
        Update: {
          categories?: Database["public"]["Enums"]["act_rule_category"][]
          created_at?: string
          description?: string
          id?: string
          implementation_url?: string | null
          input_aspects?: string[]
          is_active?: boolean
          name?: string
          rule_id?: string
          updated_at?: string
        }
        Relationships: []
      }
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
            foreignKeyName: "allyreport_issues_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "Scan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allyreport_issues_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "unified_scan_results"
            referencedColumns: ["scan_id"]
          },
          {
            foreignKeyName: "allyreport_issues_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "wcag_audit_report"
            referencedColumns: ["scan_id"]
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
            foreignKeyName: "allyreport_scans_report_config_id_fkey"
            columns: ["allyreport_id"]
            isOneToOne: false
            referencedRelation: "report_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allyreport_scans_report_config_id_fkey"
            columns: ["allyreport_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allyreport_scans_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "Scan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allyreport_scans_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "unified_scan_results"
            referencedColumns: ["scan_id"]
          },
          {
            foreignKeyName: "allyreport_scans_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "wcag_audit_report"
            referencedColumns: ["scan_id"]
          },
        ]
      }
      axe_rule_mappings: {
        Row: {
          act_rule_id: string | null
          axe_description: string | null
          axe_help_url: string | null
          axe_impact: string | null
          axe_rule_id: string
          axe_rule_name: string
          axe_tags: string[] | null
          confidence_level: number | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          act_rule_id?: string | null
          axe_description?: string | null
          axe_help_url?: string | null
          axe_impact?: string | null
          axe_rule_id: string
          axe_rule_name: string
          axe_tags?: string[] | null
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          act_rule_id?: string | null
          axe_description?: string | null
          axe_help_url?: string | null
          axe_impact?: string | null
          axe_rule_id?: string
          axe_rule_name?: string
          axe_tags?: string[] | null
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "axe_rule_mappings_act_rule_id_fkey"
            columns: ["act_rule_id"]
            isOneToOne: false
            referencedRelation: "act_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "axe_rule_mappings_act_rule_id_fkey"
            columns: ["act_rule_id"]
            isOneToOne: false
            referencedRelation: "act_rules_with_wcag"
            referencedColumns: ["id"]
          },
        ]
      }
      CrawlJob: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          pages_created: number | null
          progress: Json | null
          settings: Json | null
          started_at: string | null
          status: string
          updated_at: string
          website_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          pages_created?: number | null
          progress?: Json | null
          settings?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string
          website_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          pages_created?: number | null
          progress?: Json | null
          settings?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "CrawlJob_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "Website"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CrawlJob_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website_wcag_compliance"
            referencedColumns: ["website_id"]
          },
        ]
      }
      CrawlUrlTracker: {
        Row: {
          crawl_job_id: string
          id: string
          path: string
          processed_at: string | null
          queued_at: string | null
          url: string
        }
        Insert: {
          crawl_job_id: string
          id?: string
          path: string
          processed_at?: string | null
          queued_at?: string | null
          url: string
        }
        Update: {
          crawl_job_id?: string
          id?: string
          path?: string
          processed_at?: string | null
          queued_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "CrawlUrlTracker_crawl_job_id_fkey"
            columns: ["crawl_job_id"]
            isOneToOne: false
            referencedRelation: "CrawlJob"
            referencedColumns: ["id"]
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
            foreignKeyName: "Page_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "Website"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Page_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website_wcag_compliance"
            referencedColumns: ["website_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
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
            foreignKeyName: "report_configs_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "Space"
            referencedColumns: ["id"]
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
          scan_type: string
          scope: string
          screenshot_dark: string | null
          screenshot_light: string | null
          status: Database["public"]["Enums"]["ScanStatus"]
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json
          normalized_url?: string
          page_id: string
          scan_type?: string
          scope?: string
          screenshot_dark?: string | null
          screenshot_light?: string | null
          status?: Database["public"]["Enums"]["ScanStatus"]
          url?: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json
          normalized_url?: string
          page_id?: string
          scan_type?: string
          scope?: string
          screenshot_dark?: string | null
          screenshot_light?: string | null
          status?: Database["public"]["Enums"]["ScanStatus"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
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
            foreignKeyName: "ScanSchedule_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: true
            referencedRelation: "Page"
            referencedColumns: ["id"]
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
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      test_element_results: {
        Row: {
          created_at: string
          element_attributes: Json
          element_html: string | null
          element_selector: string
          element_xpath: string | null
          help_url: string | null
          id: string
          impact: Database["public"]["Enums"]["act_severity"] | null
          message: string
          outcome: Database["public"]["Enums"]["act_outcome"]
          remediation: string | null
          test_result_id: string
        }
        Insert: {
          created_at?: string
          element_attributes?: Json
          element_html?: string | null
          element_selector: string
          element_xpath?: string | null
          help_url?: string | null
          id?: string
          impact?: Database["public"]["Enums"]["act_severity"] | null
          message: string
          outcome: Database["public"]["Enums"]["act_outcome"]
          remediation?: string | null
          test_result_id: string
        }
        Update: {
          created_at?: string
          element_attributes?: Json
          element_html?: string | null
          element_selector?: string
          element_xpath?: string | null
          help_url?: string | null
          id?: string
          impact?: Database["public"]["Enums"]["act_severity"] | null
          message?: string
          outcome?: Database["public"]["Enums"]["act_outcome"]
          remediation?: string | null
          test_result_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_element_results_test_result_id_fkey"
            columns: ["test_result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
        ]
      }
      test_executions: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          execution_context: Json
          execution_status: Database["public"]["Enums"]["test_execution_status"]
          id: string
          scan_id: string
          started_at: string | null
          tool_name: string
          tool_version: string | null
          updated_at: string
          user_agent: string | null
          viewport_height: number | null
          viewport_width: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          execution_context?: Json
          execution_status?: Database["public"]["Enums"]["test_execution_status"]
          id?: string
          scan_id: string
          started_at?: string | null
          tool_name?: string
          tool_version?: string | null
          updated_at?: string
          user_agent?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          execution_context?: Json
          execution_status?: Database["public"]["Enums"]["test_execution_status"]
          id?: string
          scan_id?: string
          started_at?: string | null
          tool_name?: string
          tool_version?: string | null
          updated_at?: string
          user_agent?: string | null
          viewport_height?: number | null
          viewport_width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_executions_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "Scan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_executions_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "unified_scan_results"
            referencedColumns: ["scan_id"]
          },
          {
            foreignKeyName: "test_executions_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "wcag_audit_report"
            referencedColumns: ["scan_id"]
          },
        ]
      }
      test_results: {
        Row: {
          act_rule_id: string
          created_at: string
          elements_failed: number
          elements_passed: number
          elements_tested: number
          execution_id: string
          execution_time_ms: number | null
          id: string
          is_applicable: boolean
          outcome: Database["public"]["Enums"]["act_outcome"]
        }
        Insert: {
          act_rule_id: string
          created_at?: string
          elements_failed?: number
          elements_passed?: number
          elements_tested?: number
          execution_id: string
          execution_time_ms?: number | null
          id?: string
          is_applicable?: boolean
          outcome: Database["public"]["Enums"]["act_outcome"]
        }
        Update: {
          act_rule_id?: string
          created_at?: string
          elements_failed?: number
          elements_passed?: number
          elements_tested?: number
          execution_id?: string
          execution_time_ms?: number | null
          id?: string
          is_applicable?: boolean
          outcome?: Database["public"]["Enums"]["act_outcome"]
        }
        Relationships: [
          {
            foreignKeyName: "test_results_act_rule_id_fkey"
            columns: ["act_rule_id"]
            isOneToOne: false
            referencedRelation: "act_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_act_rule_id_fkey"
            columns: ["act_rule_id"]
            isOneToOne: false
            referencedRelation: "act_rules_with_wcag"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "test_execution_summary"
            referencedColumns: ["execution_id"]
          },
          {
            foreignKeyName: "test_results_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "test_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_summaries: {
        Row: {
          compliance_score: number | null
          created_at: string
          elements_failed: number
          elements_passed: number
          execution_id: string
          id: string
          rules_cant_tell: number
          rules_failed: number
          rules_inapplicable: number
          rules_passed: number
          total_elements: number
          total_rules: number
          updated_at: string
          wcag_a_compliant: boolean | null
          wcag_aa_compliant: boolean | null
          wcag_aaa_compliant: boolean | null
        }
        Insert: {
          compliance_score?: number | null
          created_at?: string
          elements_failed?: number
          elements_passed?: number
          execution_id: string
          id?: string
          rules_cant_tell?: number
          rules_failed?: number
          rules_inapplicable?: number
          rules_passed?: number
          total_elements?: number
          total_rules?: number
          updated_at?: string
          wcag_a_compliant?: boolean | null
          wcag_aa_compliant?: boolean | null
          wcag_aaa_compliant?: boolean | null
        }
        Update: {
          compliance_score?: number | null
          created_at?: string
          elements_failed?: number
          elements_passed?: number
          execution_id?: string
          id?: string
          rules_cant_tell?: number
          rules_failed?: number
          rules_inapplicable?: number
          rules_passed?: number
          total_elements?: number
          total_rules?: number
          updated_at?: string
          wcag_a_compliant?: boolean | null
          wcag_aa_compliant?: boolean | null
          wcag_aaa_compliant?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "test_summaries_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: true
            referencedRelation: "test_execution_summary"
            referencedColumns: ["execution_id"]
          },
          {
            foreignKeyName: "test_summaries_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: true
            referencedRelation: "test_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      wcag_guideline: {
        Row: {
          created_at: string
          description: string | null
          guideline_number: string
          id: string
          principle_id: string
          title: string
          understanding_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          guideline_number: string
          id?: string
          principle_id: string
          title: string
          understanding_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          guideline_number?: string
          id?: string
          principle_id?: string
          title?: string
          understanding_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wcag_guideline_principle_id_fkey"
            columns: ["principle_id"]
            isOneToOne: false
            referencedRelation: "wcag_principle"
            referencedColumns: ["id"]
          },
        ]
      }
      wcag_principle: {
        Row: {
          created_at: string
          description: string
          id: string
          number: number
          short_title: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          number: number
          short_title: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          number?: number
          short_title?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      wcag_success_criterion: {
        Row: {
          created_at: string
          description: string | null
          guideline_id: string
          how_to_meet_url: string | null
          id: string
          level: Database["public"]["Enums"]["wcag_level"]
          sc_number: string
          title: string
          understanding_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          guideline_id: string
          how_to_meet_url?: string | null
          id?: string
          level: Database["public"]["Enums"]["wcag_level"]
          sc_number: string
          title: string
          understanding_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          guideline_id?: string
          how_to_meet_url?: string | null
          id?: string
          level?: Database["public"]["Enums"]["wcag_level"]
          sc_number?: string
          title?: string
          understanding_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wcag_success_criterion_guideline_id_fkey"
            columns: ["guideline_id"]
            isOneToOne: false
            referencedRelation: "wcag_guideline"
            referencedColumns: ["id"]
          },
        ]
      }
      wcag_version: {
        Row: {
          created_at: string
          id: string
          is_current: boolean
          release_date: string | null
          sort_order: number
          status: Database["public"]["Enums"]["wcag_status"]
          title: string
          updated_at: string
          url: string | null
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_current?: boolean
          release_date?: string | null
          sort_order: number
          status?: Database["public"]["Enums"]["wcag_status"]
          title: string
          updated_at?: string
          url?: string | null
          version: string
        }
        Update: {
          created_at?: string
          id?: string
          is_current?: boolean
          release_date?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["wcag_status"]
          title?: string
          updated_at?: string
          url?: string | null
          version?: string
        }
        Relationships: []
      }
      wcag_version_criteria: {
        Row: {
          created_at: string
          criterion_id: string
          id: string
          introduced_in_version: boolean
          modified_in_version: boolean
          notes: string | null
          version_id: string
        }
        Insert: {
          created_at?: string
          criterion_id: string
          id?: string
          introduced_in_version?: boolean
          modified_in_version?: boolean
          notes?: string | null
          version_id: string
        }
        Update: {
          created_at?: string
          criterion_id?: string
          id?: string
          introduced_in_version?: boolean
          modified_in_version?: boolean
          notes?: string | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wcag_version_criteria_criterion_id_fkey"
            columns: ["criterion_id"]
            isOneToOne: false
            referencedRelation: "wcag_success_criterion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wcag_version_criteria_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "wcag_version"
            referencedColumns: ["id"]
          },
        ]
      }
      Website: {
        Row: {
          created_at: string
          id: string
          normalized_url: string
          space_id: string
          theme: Database["public"]["Enums"]["DomainTheme"]
          updated_at: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          normalized_url?: string
          space_id: string
          theme?: Database["public"]["Enums"]["DomainTheme"]
          updated_at?: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          normalized_url?: string
          space_id?: string
          theme?: Database["public"]["Enums"]["DomainTheme"]
          updated_at?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Domain_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "Space"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      act_rules_with_wcag: {
        Row: {
          categories: Database["public"]["Enums"]["act_rule_category"][] | null
          created_at: string | null
          description: string | null
          id: string | null
          implementation_url: string | null
          is_active: boolean | null
          name: string | null
          rule_id: string | null
          wcag_mappings: Json | null
        }
        Relationships: []
      }
      common_accessibility_issues: {
        Row: {
          affected_scans: number | null
          affected_websites: number | null
          avg_failure_rate: number | null
          categories: string | null
          impact_levels: number | null
          last_seen_date: string | null
          rule_id: string | null
          rule_name: string | null
          total_failed_elements: number | null
          total_failures: number | null
          wcag_criteria: string | null
          wcag_levels: string | null
        }
        Relationships: []
      }
      page_accessibility_daily_stats: {
        Row: {
          avg_accessibility_score: number | null
          avg_critical_issues: number | null
          avg_inapplicable: number | null
          avg_incomplete: number | null
          avg_minor_issues: number | null
          avg_moderate_issues: number | null
          avg_passes: number | null
          avg_serious_issues: number | null
          avg_violations: number | null
          first_scan_at: string | null
          last_scan_at: string | null
          max_critical: number | null
          max_violations: number | null
          min_critical: number | null
          min_violations: number | null
          page_id: string | null
          scan_date: string | null
          total_scans: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
        ]
      }
      page_accessibility_monthly_stats: {
        Row: {
          avg_accessibility_score: number | null
          avg_critical_issues: number | null
          avg_inapplicable: number | null
          avg_incomplete: number | null
          avg_minor_issues: number | null
          avg_moderate_issues: number | null
          avg_passes: number | null
          avg_serious_issues: number | null
          avg_violations: number | null
          first_scan_at: string | null
          last_scan_at: string | null
          max_critical: number | null
          max_violations: number | null
          min_critical: number | null
          min_violations: number | null
          month_start: string | null
          page_id: string | null
          total_scans: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
        ]
      }
      page_accessibility_weekly_stats: {
        Row: {
          avg_accessibility_score: number | null
          avg_critical_issues: number | null
          avg_inapplicable: number | null
          avg_incomplete: number | null
          avg_minor_issues: number | null
          avg_moderate_issues: number | null
          avg_passes: number | null
          avg_serious_issues: number | null
          avg_violations: number | null
          first_scan_at: string | null
          last_scan_at: string | null
          max_critical: number | null
          max_violations: number | null
          min_critical: number | null
          min_violations: number | null
          page_id: string | null
          total_scans: number | null
          week_start: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
        ]
      }
      page_latest_accessibility_stats: {
        Row: {
          avg_critical_all_time: number | null
          avg_violations_all_time: number | null
          latest_accessibility_score: number | null
          latest_critical_issues: number | null
          latest_inapplicable: number | null
          latest_incomplete: number | null
          latest_minor_issues: number | null
          latest_moderate_issues: number | null
          latest_passes: number | null
          latest_scan_at: string | null
          latest_serious_issues: number | null
          latest_total_issues: number | null
          latest_violations: number | null
          page_id: string | null
          total_completed_scans: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
        ]
      }
      page_latest_scan_stats: {
        Row: {
          latest_scan_at: string | null
          latest_status: Database["public"]["Enums"]["ScanStatus"] | null
          overall_success_rate: number | null
          page_id: string | null
          scans_last_30_days: number | null
          total_scans: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
        ]
      }
      page_scan_daily_stats: {
        Row: {
          completed_scans: number | null
          failed_scans: number | null
          first_scan_at: string | null
          last_scan_at: string | null
          page_id: string | null
          pending_scans: number | null
          queued_scans: number | null
          scan_date: string | null
          success_rate: number | null
          total_scans: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
        ]
      }
      page_scan_monthly_stats: {
        Row: {
          completed_scans: number | null
          failed_scans: number | null
          first_scan_at: string | null
          last_scan_at: string | null
          month_start: string | null
          page_id: string | null
          pending_scans: number | null
          queued_scans: number | null
          success_rate: number | null
          total_scans: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
        ]
      }
      page_scan_weekly_stats: {
        Row: {
          completed_scans: number | null
          failed_scans: number | null
          first_scan_at: string | null
          last_scan_at: string | null
          page_id: string | null
          pending_scans: number | null
          queued_scans: number | null
          success_rate: number | null
          total_scans: number | null
          week_start: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
        ]
      }
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
            foreignKeyName: "report_configs_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "Space"
            referencedColumns: ["id"]
          },
        ]
      }
      test_execution_summary: {
        Row: {
          completed_at: string | null
          compliance_score: number | null
          elements_failed: number | null
          elements_passed: number | null
          execution_duration_seconds: number | null
          execution_id: string | null
          execution_status:
            | Database["public"]["Enums"]["test_execution_status"]
            | null
          page_url: string | null
          pass_rate_percentage: number | null
          rules_cant_tell: number | null
          rules_failed: number | null
          rules_inapplicable: number | null
          rules_passed: number | null
          scan_id: string | null
          scan_url: string | null
          started_at: string | null
          tool_name: string | null
          tool_version: string | null
          total_elements: number | null
          total_rules: number | null
          wcag_a_compliant: boolean | null
          wcag_aa_compliant: boolean | null
          wcag_aaa_compliant: boolean | null
          website_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_executions_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "Scan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_executions_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "unified_scan_results"
            referencedColumns: ["scan_id"]
          },
          {
            foreignKeyName: "test_executions_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "wcag_audit_report"
            referencedColumns: ["scan_id"]
          },
        ]
      }
      unified_scan_results: {
        Row: {
          acceptable_compliance: boolean | null
          all_elements_passed: boolean | null
          all_rules_passed: boolean | null
          completed_tests: number | null
          compliance_score: number | null
          coverage_type: string | null
          created_at: string | null
          elements_failed: number | null
          elements_passed: number | null
          failed_tests: number | null
          high_compliance: boolean | null
          last_completed_at: string | null
          normalized_url: string | null
          owner_id: string | null
          page_id: string | null
          page_url: string | null
          risk_level: string | null
          rules_failed: number | null
          rules_passed: number | null
          scan_duration_seconds: number | null
          scan_id: string | null
          scan_recency: string | null
          scan_type: string | null
          scan_url: string | null
          scope: string | null
          space_name: string | null
          status: Database["public"]["Enums"]["ScanStatus"] | null
          total_elements_tested: number | null
          total_rules_tested: number | null
          total_tests: number | null
          wcag_criteria_tested: number | null
          website_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
        ]
      }
      wcag_audit_report: {
        Row: {
          coverage_type: string | null
          created_at: string | null
          critical_issues: number | null
          minor_issues: number | null
          moderate_issues: number | null
          owner_id: string | null
          page_id: string | null
          page_url: string | null
          risk_assessment: string | null
          scan_id: string | null
          scan_type: string | null
          scope: string | null
          serious_issues: number | null
          space_name: string | null
          total_issues: number | null
          wcag_a_compliance_score: number | null
          wcag_a_compliant: boolean | null
          wcag_a_failed: number | null
          wcag_a_passed: number | null
          wcag_aa_compliance_score: number | null
          wcag_aa_compliant: boolean | null
          wcag_aa_failed: number | null
          wcag_aa_passed: number | null
          wcag_aaa_compliance_score: number | null
          wcag_aaa_compliant: boolean | null
          wcag_aaa_failed: number | null
          wcag_aaa_passed: number | null
          website_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
        ]
      }
      wcag_current_criteria: {
        Row: {
          criterion_title: string | null
          description: string | null
          guideline_number: string | null
          guideline_title: string | null
          how_to_meet_url: string | null
          level: Database["public"]["Enums"]["wcag_level"] | null
          principle_number: number | null
          principle_title: string | null
          sc_number: string | null
          understanding_url: string | null
        }
        Relationships: []
      }
      wcag_hierarchy: {
        Row: {
          criterion_description: string | null
          criterion_title: string | null
          guideline_number: string | null
          guideline_title: string | null
          level: Database["public"]["Enums"]["wcag_level"] | null
          principle_number: number | null
          principle_title: string | null
          sc_number: string | null
          version: string | null
          version_title: string | null
        }
        Relationships: []
      }
      wcag_version_changes: {
        Row: {
          criterion_title: string | null
          guideline_number: string | null
          guideline_title: string | null
          how_to_meet_url: string | null
          introduced_in_version: boolean | null
          level: Database["public"]["Enums"]["wcag_level"] | null
          notes: string | null
          principle: string | null
          sc_number: string | null
          understanding_url: string | null
          version: string | null
          version_title: string | null
        }
        Relationships: []
      }
      website_wcag_compliance: {
        Row: {
          aa_compliance_percentage: number | null
          aa_compliant_pages: number | null
          aa_non_compliant_pages: number | null
          avg_compliance_score: number | null
          last_test_date: string | null
          total_pages: number | null
          website_id: string | null
          website_url: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_next_scan_time: {
        Args: { frequency_val: string; base_time?: string }
        Returns: string
      }
      can_start_crawl_job: {
        Args: { p_website_id: string }
        Returns: boolean
      }
      check_crawl_job_completion: {
        Args: { p_crawl_job_id: string }
        Returns: undefined
      }
      cleanup_disabled_accounts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_audit_logs: {
        Args: { retention_period?: unknown }
        Returns: number
      }
      cleanup_stuck_crawl_jobs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      complete_crawl_message: {
        Args: {
          p_msg_id: number
          p_crawl_job_id: string
          p_success: boolean
          p_links_found?: string[]
          p_error_message?: string
        }
        Returns: undefined
      }
      create_pages_from_crawl_job: {
        Args: { p_crawl_job_id: string }
        Returns: Json
      }
      extract_path_from_url: {
        Args: { url: string }
        Returns: string
      }
      get_crawl_queue_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_latest_scan_results: {
        Args: { page_id_param: string }
        Returns: {
          scan_type: string
          scope: string
          compliance_score: number
          has_issues: boolean
          last_scanned: string
          scan_id: string
        }[]
      }
      get_next_crawl_message: {
        Args: { p_visibility_timeout_seconds?: number }
        Returns: {
          msg_id: number
          crawl_job_id: string
          url: string
          depth: number
          priority: number
          queued_at: string
          read_ct: number
        }[]
      }
      get_page_test_results: {
        Args: { page_url: string }
        Returns: {
          execution_id: string
          scan_date: string
          total_issues: number
          critical_issues: number
          serious_issues: number
          moderate_issues: number
          minor_issues: number
          wcag_aa_compliant: boolean
          compliance_score: number
        }[]
      }
      get_scan_strategy: {
        Args: { page_url: string }
        Returns: {
          recommended_scans: string[]
          reasoning: string
          priority_order: number[]
        }[]
      }
      get_wcag_coverage: {
        Args: { execution_uuid: string }
        Returns: {
          wcag_number: string
          wcag_title: string
          wcag_level: Database["public"]["Enums"]["wcag_level"]
          total_rules_tested: number
          rules_passed: number
          rules_failed: number
          coverage_percentage: number
        }[]
      }
      get_wcag_criteria_by_level: {
        Args: {
          version_param: string
          level_param: Database["public"]["Enums"]["wcag_level"]
        }
        Returns: {
          sc_number: string
          title: string
          description: string
          understanding_url: string
        }[]
      }
      get_wcag_criteria_by_version: {
        Args: { version_param: string }
        Returns: {
          sc_number: string
          title: string
          level: Database["public"]["Enums"]["wcag_level"]
          guideline_number: string
          guideline_title: string
          principle_number: number
          principle_title: string
        }[]
      }
      get_wcag_version_stats: {
        Args: { version_param: string }
        Returns: {
          version: string
          total_criteria: number
          level_a_count: number
          level_aa_count: number
          level_aaa_count: number
          new_in_version: number
          inherited_from_previous: number
        }[]
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
      manual_process_queue_message: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
      pgmq_delete: {
        Args: { p_queue_name: string; p_msg_id: number }
        Returns: boolean
      }
      pgmq_read: {
        Args: { p_queue_name: string; p_vt: number; p_qty: number }
        Returns: {
          msg_id: number
          message: Json
        }[]
      }
      process_axe_scan_results: {
        Args: { scan_id_param: string; axe_results: Json }
        Returns: {
          execution_id: string
          processed_rules: number
          processed_violations: number
        }[]
      }
      process_crawl_queue_batch: {
        Args: { batch_size?: number }
        Returns: Json
      }
      process_crawl_queue_simple: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      queue_crawl_url: {
        Args: {
          p_crawl_job_id: string
          p_url: string
          p_depth: number
          p_priority: number
        }
        Returns: number
      }
      queue_test_result: {
        Args: { test_data: Json }
        Returns: number
      }
      queue_user_notification: {
        Args: { user_id: string; notification_type: string; details?: Json }
        Returns: string
      }
      reactivate_user: {
        Args: { user_id: string; admin_id: string; reason?: string }
        Returns: undefined
      }
      refresh_accessibility_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_scan_analytics: {
        Args: Record<PropertyKey, never>
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
      trigger_test_results_processing: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_crawl_progress: {
        Args: {
          p_crawl_job_id: string
          p_processed_url: string
          p_path: string
          p_depth: number
          p_links_found: number
        }
        Returns: undefined
      }
      update_crawl_progress_failed: {
        Args: {
          p_crawl_job_id: string
          p_failed_url: string
          p_error_message: string
        }
        Returns: undefined
      }
      verify_active_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      act_outcome: "passed" | "failed" | "inapplicable" | "cantTell"
      act_rule_category:
        | "aria"
        | "forms"
        | "headings"
        | "structure"
        | "images"
        | "links"
        | "tables"
        | "language"
        | "landmarks"
        | "color"
        | "contrast"
        | "focus"
        | "keyboard"
        | "buttons"
        | "interactive"
        | "autocomplete"
        | "video"
        | "audio"
        | "meta"
        | "iframe"
        | "svg"
        | "object"
      act_severity: "critical" | "serious" | "moderate" | "minor"
      DomainTheme: "LIGHT" | "DARK" | "BOTH"
      ScanStatus: "pending" | "completed" | "failed" | "queued"
      test_execution_status:
        | "pending"
        | "running"
        | "completed"
        | "failed"
        | "cancelled"
      wcag_level: "A" | "AA" | "AAA"
      wcag_status: "draft" | "active" | "deprecated" | "superseded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      act_outcome: ["passed", "failed", "inapplicable", "cantTell"],
      act_rule_category: [
        "aria",
        "forms",
        "headings",
        "structure",
        "images",
        "links",
        "tables",
        "language",
        "landmarks",
        "color",
        "contrast",
        "focus",
        "keyboard",
        "buttons",
        "interactive",
        "autocomplete",
        "video",
        "audio",
        "meta",
        "iframe",
        "svg",
        "object",
      ],
      act_severity: ["critical", "serious", "moderate", "minor"],
      DomainTheme: ["LIGHT", "DARK", "BOTH"],
      ScanStatus: ["pending", "completed", "failed", "queued"],
      test_execution_status: [
        "pending",
        "running",
        "completed",
        "failed",
        "cancelled",
      ],
      wcag_level: ["A", "AA", "AAA"],
      wcag_status: ["draft", "active", "deprecated", "superseded"],
    },
  },
} as const
