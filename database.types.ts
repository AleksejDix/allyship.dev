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
          created_by: string | null
          id: string
          name: string
          space_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          space_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          space_id?: string
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
      get_role_level: {
        Args: {
          role: Database["public"]["Enums"]["MembershipRole"]
        }
        Returns: number
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
      verify_active_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      MembershipRole: "owner" | "admin" | "member"
      MembershipStatus: "active" | "inactive" | "pending" | "banned"
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

