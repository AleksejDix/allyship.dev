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
      Customer: {
        Row: {
          attrs: Json | null
          created: string | null
          description: string | null
          email: string | null
          id: string | null
          name: string | null
        }
        Insert: {
          attrs?: Json | null
          created?: string | null
          description?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
        }
        Update: {
          attrs?: Json | null
          created?: string | null
          description?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
        }
        Relationships: []
      }
      Disputes: {
        Row: {
          amount: number | null
          attrs: Json | null
          charge: string | null
          created: string | null
          currency: string | null
          id: string | null
          payment_intent: string | null
          reason: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          attrs?: Json | null
          charge?: string | null
          created?: string | null
          currency?: string | null
          id?: string | null
          payment_intent?: string | null
          reason?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          attrs?: Json | null
          charge?: string | null
          created?: string | null
          currency?: string | null
          id?: string | null
          payment_intent?: string | null
          reason?: string | null
          status?: string | null
        }
        Relationships: []
      }
      Domain: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
          space_id: string
          theme: Database["public"]["Enums"]["DomainTheme"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          space_id: string
          theme?: Database["public"]["Enums"]["DomainTheme"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          space_id?: string
          theme?: Database["public"]["Enums"]["DomainTheme"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Domain_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "Space"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Domain_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "UserSpaceView"
            referencedColumns: ["space_id"]
          },
        ]
      }
      Invoice: {
        Row: {
          attrs: Json | null
          currency: string | null
          customer: string | null
          id: string | null
          period_end: string | null
          period_start: string | null
          status: string | null
          subscription: string | null
          total: number | null
        }
        Insert: {
          attrs?: Json | null
          currency?: string | null
          customer?: string | null
          id?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          subscription?: string | null
          total?: number | null
        }
        Update: {
          attrs?: Json | null
          currency?: string | null
          customer?: string | null
          id?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          subscription?: string | null
          total?: number | null
        }
        Relationships: []
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
          updated_at?: string
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
            foreignKeyName: "Membership_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "UserSpaceView"
            referencedColumns: ["space_id"]
          },
        ]
      }
      Page: {
        Row: {
          created_at: string
          domain_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          domain_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
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
        ]
      }
      Space: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_personal: boolean
          name: string
          transfer_token: string | null
          transfer_token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_personal?: boolean
          name: string
          transfer_token?: string | null
          transfer_token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_personal?: boolean
          name?: string
          transfer_token?: string | null
          transfer_token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      Subscription: {
        Row: {
          attrs: Json | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          customer: string | null
          id: string | null
        }
        Insert: {
          attrs?: Json | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer?: string | null
          id?: string | null
        }
        Update: {
          attrs?: Json | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer?: string | null
          id?: string | null
        }
        Relationships: []
      }
      User: {
        Row: {
          data_retention_period: unknown
          deleted_at: string | null
          deletion_requested_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          data_retention_period?: unknown
          deleted_at?: string | null
          deletion_requested_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          data_retention_period?: unknown
          deleted_at?: string | null
          deletion_requested_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_audit_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          ip_address: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string
          details: Json | null
          error: string | null
          id: string
          processed_at: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          error?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
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
      UserSpaceView: {
        Row: {
          created_at: string | null
          created_by: string | null
          domain_count: number | null
          membership_status:
            | Database["public"]["Enums"]["MembershipStatus"]
            | null
          owner_first_name: string | null
          owner_last_name: string | null
          space_id: string | null
          space_name: string | null
          updated_at: string | null
          user_id: string | null
          user_role: Database["public"]["Enums"]["MembershipRole"] | null
        }
        Relationships: []
      }
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
      get_role_level: {
        Args: {
          role: Database["public"]["Enums"]["MembershipRole"]
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
      parse_name: {
        Args: {
          full_name: string
        }
        Returns: {
          first_name: string
          last_name: string
        }[]
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
      verify_active_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      DomainTheme: "LIGHT" | "DARK" | "BOTH"
      MembershipRole: "owner" | "admin" | "member"
      MembershipStatus: "active" | "inactive" | "pending" | "banned"
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
