export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Domain: {
        Row: {
          created_at: string
          id: string
          name: string
          space_id: string
          theme: Database["public"]["Enums"]["DomainTheme"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          space_id: string
          theme?: Database["public"]["Enums"]["DomainTheme"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          space_id?: string
          theme?: Database["public"]["Enums"]["DomainTheme"]
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
      Membership: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["MembershipRole"]
          space_id: string
          status: Database["public"]["Enums"]["MembershipStatus"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["MembershipRole"]
          space_id: string
          status?: Database["public"]["Enums"]["MembershipStatus"]
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["MembershipRole"]
          space_id?: string
          status?: Database["public"]["Enums"]["MembershipStatus"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Membership_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "Space"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Membership_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Page: {
        Row: {
          created_at: string | null
          domain_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          domain_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          domain_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "Page_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "Domain"
            referencedColumns: ["id"]
          },
        ]
      }
      Scan: {
        Row: {
          created_at: string
          id: string
          metrics: Json | null
          page_id: string
          screenshot_dark: string | null
          screenshot_light: string | null
          status: Database["public"]["Enums"]["ScanStatus"]
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json | null
          page_id: string
          screenshot_dark?: string | null
          screenshot_light?: string | null
          status?: Database["public"]["Enums"]["ScanStatus"]
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json | null
          page_id?: string
          screenshot_dark?: string | null
          screenshot_light?: string | null
          status?: Database["public"]["Enums"]["ScanStatus"]
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Scan_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "Page"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Scan_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Space: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Space_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          data_retention_period: unknown | null
          deleted_at: string | null
          deletion_requested_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          data_retention_period?: unknown | null
          deleted_at?: string | null
          deletion_requested_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          data_retention_period?: unknown | null
          deleted_at?: string | null
          deletion_requested_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_audit_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          ip_address: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string | null
          details: Json | null
          error: string | null
          id: string
          processed_at: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          error?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          error?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_disabled_accounts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_audit_logs: {
        Args: {
          retention_period?: unknown
        }
        Returns: number
      }
      is_admin: {
        Args: {
          jwt?: Json
        }
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
        Args: {
          ip: string
        }
        Returns: string
      }
      queue_user_notification: {
        Args: {
          user_id: string
          notification_type: string
          details?: Json
        }
        Returns: string
      }
      reactivate_user: {
        Args: {
          user_id: string
          admin_id: string
          reason?: string
        }
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
    }
    Enums: {
      DomainTheme: "LIGHT" | "DARK" | "BOTH"
      MembershipRole: "OWNER" | "MEMBER"
      MembershipStatus: "PENDING" | "ACTIVE" | "DECLINED"
      ScanStatus: "pending" | "completed" | "failed" | "queued"
      SubStatus: "ACTIVE" | "PAST_DUE" | "CANCELED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
