export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      forms: {
        Row: {
          id: string
          title: string
          description: string | null
          questions: Json
          is_public: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          questions?: Json
          is_public?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          questions?: Json
          is_public?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          form_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          form_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          form_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          form_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          form_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}

