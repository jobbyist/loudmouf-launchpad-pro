export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          path: string | null
          properties: Json
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          path?: string | null
          properties?: Json
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          path?: string | null
          properties?: Json
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      article_comments: {
        Row: {
          article_id: string
          author_name: string
          body: string
          created_at: string
          id: string
          status: string
          user_id: string | null
        }
        Insert: {
          article_id: string
          author_name: string
          body: string
          created_at?: string
          id?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          article_id?: string
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "newsroom_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_likes: {
        Row: {
          article_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_likes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "newsroom_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      member_signatures: {
        Row: {
          acceptance_statements: Json
          accepted_at: string
          agreement_version: string
          created_at: string
          full_name: string
          id: string
          ip_address: string | null
          signature_hash: string
          typed_signature: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          acceptance_statements?: Json
          accepted_at: string
          agreement_version: string
          created_at?: string
          full_name: string
          id?: string
          ip_address?: string | null
          signature_hash: string
          typed_signature: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          acceptance_statements?: Json
          accepted_at?: string
          agreement_version?: string
          created_at?: string
          full_name?: string
          id?: string
          ip_address?: string | null
          signature_hash?: string
          typed_signature?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      newsroom_articles: {
        Row: {
          cover: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string
          slug: string
          source: string
          source_url: string
          status: string
          summary_md: string
          title: string
          word_count: number | null
        }
        Insert: {
          cover?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string
          slug: string
          source: string
          source_url: string
          status?: string
          summary_md: string
          title: string
          word_count?: number | null
        }
        Update: {
          cover?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string
          slug?: string
          source?: string
          source_url?: string
          status?: string
          summary_md?: string
          title?: string
          word_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          tier: string | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          tier?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          tier?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      referral_attributions: {
        Row: {
          commission_cents: number
          created_at: string
          event_type: string
          id: string
          referred_email: string | null
          referred_user_id: string | null
          referrer_user_id: string
          shopify_order_id: string | null
          source: string | null
          status: string
        }
        Insert: {
          commission_cents?: number
          created_at?: string
          event_type: string
          id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_user_id: string
          shopify_order_id?: string | null
          source?: string | null
          status?: string
        }
        Update: {
          commission_cents?: number
          created_at?: string
          event_type?: string
          id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_user_id?: string
          shopify_order_id?: string | null
          source?: string | null
          status?: string
        }
        Relationships: []
      }
      said_verifications: {
        Row: {
          created_at: string
          id: string
          id_number_hash: string
          id_number_last4: string
          raw_response: Json | null
          user_id: string
          verified: boolean
          verifynow_ref: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          id_number_hash: string
          id_number_last4: string
          raw_response?: Json | null
          user_id: string
          verified?: boolean
          verifynow_ref?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          id_number_hash?: string
          id_number_last4?: string
          raw_response?: Json | null
          user_id?: string
          verified?: boolean
          verifynow_ref?: string | null
        }
        Relationships: []
      }
      shopify_orders: {
        Row: {
          created_at: string
          currency: string | null
          email: string | null
          financial_status: string | null
          fulfillment_status: string | null
          id: string
          raw: Json | null
          shopify_order_id: string
          status: string | null
          tier: string | null
          total_cents: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          email?: string | null
          financial_status?: string | null
          fulfillment_status?: string | null
          id?: string
          raw?: Json | null
          shopify_order_id: string
          status?: string | null
          tier?: string | null
          total_cents?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          email?: string | null
          financial_status?: string | null
          fulfillment_status?: string | null
          id?: string
          raw?: Json | null
          shopify_order_id?: string
          status?: string | null
          tier?: string | null
          total_cents?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "member"],
    },
  },
} as const
