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
          status: "pending" | "completed" | "failed" | "queued"
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
          status?: "pending" | "completed" | "failed" | "queued"
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
          status?: "pending" | "completed" | "failed" | "queued"
          url?: string
        }
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
      }
      Website: {
        Row: {
          created_at: string
          id: string
          normalized_url: string
          space_id: string
          theme: "LIGHT" | "DARK" | "BOTH"
          updated_at: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          normalized_url?: string
          space_id: string
          theme?: "LIGHT" | "DARK" | "BOTH"
          updated_at?: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          normalized_url?: string
          space_id?: string
          theme?: "LIGHT" | "DARK" | "BOTH"
          updated_at?: string
          url?: string
          user_id?: string | null
        }
      }
    }
    Enums: {
      ScanStatus: "pending" | "completed" | "failed" | "queued"
    }
  }
}

export type ScanStatus = Database["public"]["Enums"]["ScanStatus"]
