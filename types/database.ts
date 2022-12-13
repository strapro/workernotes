export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      worker_notes: {
        Row: {
          id: string
          note: string | null
          worker_id: string | null
          created_at: string | null
          updated_at: string | null
          sentiment: number | null
        }
        Insert: {
          id: string
          note?: string | null
          worker_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          sentiment?: number | null
        }
        Update: {
          id?: string
          note?: string | null
          worker_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          sentiment?: number | null
        }
      }
      workers: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          manager_id: string | null
          created_at: string | null
          updated_at: string | null
          profile_pic: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          manager_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          profile_pic?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          manager_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          profile_pic?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
