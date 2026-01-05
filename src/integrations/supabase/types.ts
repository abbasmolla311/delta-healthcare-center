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
      admin_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          consultation_fee: number
          consultation_mode: Database["public"]["Enums"]["consultation_mode"]
          created_at: string | null
          doctor_id: string
          follow_up_date: string | null
          id: string
          meeting_link: string | null
          notes: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          prescription_notes: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          symptoms: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          consultation_fee: number
          consultation_mode: Database["public"]["Enums"]["consultation_mode"]
          created_at?: string | null
          doctor_id: string
          follow_up_date?: string | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          prescription_notes?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          symptoms?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          consultation_fee?: number
          consultation_mode?: Database["public"]["Enums"]["consultation_mode"]
          created_at?: string | null
          doctor_id?: string
          follow_up_date?: string | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          prescription_notes?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          symptoms?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          medicine_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          medicine_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          medicine_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          about: string | null
          consultation_fee: number | null
          created_at: string | null
          experience_years: number | null
          hospital: string | null
          id: string
          is_available: boolean | null
          languages: string[] | null
          name: string
          profile_image: string | null
          qualification: string | null
          rating: number | null
          schedule: Json | null
          specialty: string
          total_reviews: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          about?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          experience_years?: number | null
          hospital?: string | null
          id?: string
          is_available?: boolean | null
          languages?: string[] | null
          name: string
          profile_image?: string | null
          qualification?: string | null
          rating?: number | null
          schedule?: Json | null
          specialty: string
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          about?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          experience_years?: number | null
          hospital?: string | null
          id?: string
          is_available?: boolean | null
          languages?: string[] | null
          name?: string
          profile_image?: string | null
          qualification?: string | null
          rating?: number | null
          schedule?: Json | null
          specialty?: string
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      health_packages: {
        Row: {
          created_at: string | null
          description: string | null
          discounted_price: number
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          original_price: number | null
          tests_included: string[] | null
          total_tests: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discounted_price: number
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          original_price?: number | null
          tests_included?: string[] | null
          total_tests?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discounted_price?: number
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          original_price?: number | null
          tests_included?: string[] | null
          total_tests?: number | null
        }
        Relationships: []
      }
      lab_bookings: {
        Row: {
          amount: number
          booking_date: string
          booking_time: string | null
          collection_address: string | null
          created_at: string | null
          id: string
          is_home_collection: boolean | null
          lab_id: string | null
          package_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          report_url: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          test_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_date: string
          booking_time?: string | null
          collection_address?: string | null
          created_at?: string | null
          id?: string
          is_home_collection?: boolean | null
          lab_id?: string | null
          package_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          report_url?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          test_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_date?: string
          booking_time?: string | null
          collection_address?: string | null
          created_at?: string | null
          id?: string
          is_home_collection?: boolean | null
          lab_id?: string | null
          package_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          report_url?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          test_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_bookings_lab_id_fkey"
            columns: ["lab_id"]
            isOneToOne: false
            referencedRelation: "labs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "health_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_bookings_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "lab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_tests: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          discount_percent: number | null
          home_collection_available: boolean | null
          id: string
          is_active: boolean | null
          name: string
          preparation_required: string | null
          price: number
          report_time: string | null
          sample_type: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          home_collection_available?: boolean | null
          id?: string
          is_active?: boolean | null
          name: string
          preparation_required?: string | null
          price: number
          report_time?: string | null
          sample_type?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          home_collection_available?: boolean | null
          id?: string
          is_active?: boolean | null
          name?: string
          preparation_required?: string | null
          price?: number
          report_time?: string | null
          sample_type?: string | null
        }
        Relationships: []
      }
      labs: {
        Row: {
          accreditation: string[] | null
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          rating: number | null
          total_reviews: number | null
          user_id: string | null
        }
        Insert: {
          accreditation?: string[] | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          user_id?: string | null
        }
        Update: {
          accreditation?: string[] | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      medicines: {
        Row: {
          brand: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          discount_percent: number | null
          dosage: string | null
          form: string | null
          generic_name: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          manufacturer: string | null
          name: string
          pack_size: string | null
          price: number
          requires_prescription: boolean | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          dosage?: string | null
          form?: string | null
          generic_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          manufacturer?: string | null
          name: string
          pack_size?: string | null
          price: number
          requires_prescription?: boolean | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          dosage?: string | null
          form?: string | null
          generic_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          manufacturer?: string | null
          name?: string
          pack_size?: string | null
          price?: number
          requires_prescription?: boolean | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medicines_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          reference_id: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          reference_id?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          reference_id?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          delivery_address: string | null
          delivery_fee: number | null
          delivery_notes: string | null
          delivery_phone: string | null
          discount: number | null
          expected_delivery: string | null
          id: string
          items: Json
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          prescription_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_notes?: string | null
          delivery_phone?: string | null
          discount?: number | null
          expected_delivery?: string | null
          id?: string
          items: Json
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          prescription_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_notes?: string | null
          delivery_phone?: string | null
          discount?: number | null
          expected_delivery?: string | null
          id?: string
          items?: Json
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          prescription_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacies: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          delivers_home: boolean | null
          email: string | null
          id: string
          is_24_hours: boolean | null
          is_active: boolean | null
          license_number: string | null
          name: string
          phone: string | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          delivers_home?: boolean | null
          email?: string | null
          id?: string
          is_24_hours?: boolean | null
          is_active?: boolean | null
          license_number?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          delivers_home?: boolean | null
          email?: string | null
          id?: string
          is_24_hours?: boolean | null
          is_active?: boolean | null
          license_number?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          notes: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
          pincode: string | null
          state: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number | null
          reviewable_id: string
          reviewable_type: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          reviewable_id: string
          reviewable_type: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          reviewable_id?: string
          reviewable_type?: string
          user_id?: string
        }
        Relationships: []
      }
      scan_bookings: {
        Row: {
          amount: number
          booking_date: string
          booking_time: string | null
          created_at: string | null
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          prescription_id: string | null
          report_url: string | null
          scan_center_id: string | null
          scan_test_id: string
          status: Database["public"]["Enums"]["booking_status"] | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_date: string
          booking_time?: string | null
          created_at?: string | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          prescription_id?: string | null
          report_url?: string | null
          scan_center_id?: string | null
          scan_test_id: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_date?: string
          booking_time?: string | null
          created_at?: string | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          prescription_id?: string | null
          report_url?: string | null
          scan_center_id?: string | null
          scan_test_id?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_bookings_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_bookings_scan_center_id_fkey"
            columns: ["scan_center_id"]
            isOneToOne: false
            referencedRelation: "scan_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_bookings_scan_test_id_fkey"
            columns: ["scan_test_id"]
            isOneToOne: false
            referencedRelation: "scan_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_centers: {
        Row: {
          address: string | null
          available_scans: string[] | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          rating: number | null
          total_reviews: number | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          available_scans?: string[] | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          available_scans?: string[] | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      scan_tests: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percent: number | null
          id: string
          is_active: boolean | null
          name: string
          preparation_required: string | null
          price: number
          report_time: string | null
          requires_prescription: boolean | null
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          preparation_required?: string | null
          price: number
          report_time?: string | null
          requires_prescription?: boolean | null
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          preparation_required?: string | null
          price?: number
          report_time?: string | null
          requires_prescription?: boolean | null
          type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      app_role: "admin" | "doctor" | "pharmacy" | "lab" | "scan_center" | "user"
      booking_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
      consultation_mode: "video" | "audio" | "chat" | "offline"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      user_status: "active" | "inactive" | "pending" | "suspended"
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
      app_role: ["admin", "doctor", "pharmacy", "lab", "scan_center", "user"],
      booking_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      consultation_mode: ["video", "audio", "chat", "offline"],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      user_status: ["active", "inactive", "pending", "suspended"],
    },
  },
} as const
