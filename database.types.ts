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
      Memberships: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          space_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          space_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          space_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "Space"
            referencedColumns: ["id"]
          },
        ]
      }
      Page: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          updated_at: string
          url: string
          website_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          updated_at?: string
          url: string
          website_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
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
      Website: {
        Row: {
          created_at: string
          id: string
          space_id: string
          theme: Database["public"]["Enums"]["DomainTheme"]
          updated_at: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          space_id: string
          theme?: Database["public"]["Enums"]["DomainTheme"]
          updated_at?: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
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
      ScanStatus: "pending" | "completed" | "failed" | "queued"
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
