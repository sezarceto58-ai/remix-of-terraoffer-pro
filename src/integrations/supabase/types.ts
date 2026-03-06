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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          active: boolean | null
          city: string | null
          created_at: string | null
          id: string
          last_triggered_at: string | null
          max_bedrooms: number | null
          max_price: number | null
          min_bedrooms: number | null
          min_price: number | null
          name: string
          property_type: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          city?: string | null
          created_at?: string | null
          id?: string
          last_triggered_at?: string | null
          max_bedrooms?: number | null
          max_price?: number | null
          min_bedrooms?: number | null
          min_price?: number | null
          name: string
          property_type?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          city?: string | null
          created_at?: string | null
          id?: string
          last_triggered_at?: string | null
          max_bedrooms?: number | null
          max_price?: number | null
          min_bedrooms?: number | null
          min_price?: number | null
          name?: string
          property_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agent_id: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          property_id: string | null
          source: string | null
          stage: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          property_id?: string | null
          source?: string | null
          stage?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          property_id?: string | null
          source?: string | null
          stage?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          offer_id: string | null
          property_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          offer_id?: string | null
          property_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          offer_id?: string | null
          property_id?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          asking_price: number | null
          buyer_id: string
          closing_timeline_days: number | null
          counter_price: number | null
          created_at: string | null
          currency: string | null
          deposit_percent: number | null
          financing_type: string | null
          id: string
          message: string | null
          offer_price: number
          offer_type: string | null
          proof_uploaded: boolean | null
          property_id: string
          seller_id: string | null
          seller_note: string | null
          seriousness_score: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          asking_price?: number | null
          buyer_id: string
          closing_timeline_days?: number | null
          counter_price?: number | null
          created_at?: string | null
          currency?: string | null
          deposit_percent?: number | null
          financing_type?: string | null
          id?: string
          message?: string | null
          offer_price: number
          offer_type?: string | null
          proof_uploaded?: boolean | null
          property_id: string
          seller_id?: string | null
          seller_note?: string | null
          seriousness_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          asking_price?: number | null
          buyer_id?: string
          closing_timeline_days?: number | null
          counter_price?: number | null
          created_at?: string | null
          currency?: string | null
          deposit_percent?: number | null
          financing_type?: string | null
          id?: string
          message?: string | null
          offer_price?: number
          offer_type?: string | null
          proof_uploaded?: boolean | null
          property_id?: string
          seller_id?: string | null
          seller_note?: string | null
          seriousness_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      project_plans: {
        Row: {
          created_at: string
          id: string
          land_area: number
          land_location: Json
          max_floors: number | null
          restrictions: string[] | null
          result: Json | null
          shape: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          land_area: number
          land_location: Json
          max_floors?: number | null
          restrictions?: string[] | null
          result?: Json | null
          shape?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          land_area?: number
          land_location?: Json
          max_floors?: number | null
          restrictions?: string[] | null
          result?: Json | null
          shape?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          agent_name: string | null
          agent_verified: boolean | null
          ai_confidence: string | null
          ai_valuation: number | null
          area: number
          bathrooms: number | null
          bedrooms: number | null
          city: string
          created_at: string | null
          currency: string | null
          description: string | null
          description_ar: string | null
          district: string | null
          features: string[] | null
          id: string
          latitude: number | null
          longitude: number | null
          price: number
          price_iqd: number | null
          property_type: string
          status: string | null
          terra_score: number | null
          title: string
          title_ar: string | null
          type: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          views: number | null
        }
        Insert: {
          agent_name?: string | null
          agent_verified?: boolean | null
          ai_confidence?: string | null
          ai_valuation?: number | null
          area: number
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          description_ar?: string | null
          district?: string | null
          features?: string[] | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          price: number
          price_iqd?: number | null
          property_type: string
          status?: string | null
          terra_score?: number | null
          title: string
          title_ar?: string | null
          type?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          views?: number | null
        }
        Update: {
          agent_name?: string | null
          agent_verified?: boolean | null
          ai_confidence?: string | null
          ai_valuation?: number | null
          area?: number
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          description_ar?: string | null
          district?: string | null
          features?: string[] | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          price?: number
          price_iqd?: number | null
          property_type?: string
          status?: string | null
          terra_score?: number | null
          title?: string
          title_ar?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          views?: number | null
        }
        Relationships: []
      }
      property_images: {
        Row: {
          created_at: string | null
          id: string
          property_id: string | null
          sort_order: number | null
          storage_path: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          sort_order?: number | null
          storage_path: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          sort_order?: number | null
          storage_path?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          product_id: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          product_id?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          product_id?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      usage_logs: {
        Row: {
          called_at: string | null
          function_name: string
          id: string
          user_id: string
        }
        Insert: {
          called_at?: string | null
          function_name: string
          id?: string
          user_id: string
        }
        Update: {
          called_at?: string | null
          function_name?: string
          id?: string
          user_id?: string
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
          role?: Database["public"]["Enums"]["app_role"]
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
      increment_property_views: {
        Args: { p_property_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "buyer" | "seller" | "admin" | "developer"
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
      app_role: ["buyer", "seller", "admin", "developer"],
    },
  },
} as const
