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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Domain: {
        Row: {
          created_at: string | null
          id: string
          name: string
          space_id: string
          theme: Database["public"]["Enums"]["DomainTheme"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          space_id: string
          theme?: Database["public"]["Enums"]["DomainTheme"]
        }
        Update: {
          created_at?: string | null
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
          created_at: string | null
          id: string
          metrics: Json | null
          page_id: string
          screenshot_dark: string | null
          screenshot_light: string | null
          status: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metrics?: Json | null
          page_id: string
          screenshot_dark?: string | null
          screenshot_light?: string | null
          status?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metrics?: Json | null
          page_id?: string
          screenshot_dark?: string | null
          screenshot_light?: string | null
          status?: string | null
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
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      DomainTheme: "LIGHT" | "DARK" | "BOTH"
      MembershipRole: "OWNER" | "MEMBER"
      MembershipStatus: "PENDING" | "ACTIVE" | "DECLINED"
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
