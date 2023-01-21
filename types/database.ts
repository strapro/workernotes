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
      department_levels: {
        Row: {
          created_at: string | null
          department_id: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
      }
      departments: {
        Row: {
          created_at: string | null
          id: string
          manager_id: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          manager_id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          manager_id?: string | null
          name?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
      }
      worker_notes: {
        Row: {
          created_at: string | null
          id: string
          note: string | null
          sentiment: number | null
          updated_at: string | null
          worker_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          note?: string | null
          sentiment?: number | null
          updated_at?: string | null
          worker_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string | null
          sentiment?: number | null
          updated_at?: string | null
          worker_id?: string | null
        }
      }
      workers: {
        Row: {
          created_at: string | null
          department_id: string | null
          department_level_id: string | null
          first_name: string | null
          id: string
          last_name: string | null
          manager_id: string | null
          profile_pic: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          department_level_id?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          manager_id?: string | null
          profile_pic?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          department_level_id?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          manager_id?: string | null
          profile_pic?: string | null
          updated_at?: string | null
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
