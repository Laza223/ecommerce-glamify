// types/database.ts
// Database types matching Supabase schema (schema.sql)
// To regenerate: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          display_order?: number;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          display_order?: number;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          compare_at_price: number | null;
          cost_per_item: number | null;
          sku: string | null;
          barcode: string | null;
          stock: number;
          low_stock_threshold: number;
          images: string[];
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          category_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          compare_at_price?: number | null;
          cost_per_item?: number | null;
          sku?: string | null;
          barcode?: string | null;
          stock?: number;
          low_stock_threshold?: number;
          images?: string[];
          is_active?: boolean;
          is_featured?: boolean;
        };
        Update: {
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          compare_at_price?: number | null;
          cost_per_item?: number | null;
          sku?: string | null;
          barcode?: string | null;
          stock?: number;
          low_stock_threshold?: number;
          images?: string[];
          is_active?: boolean;
          is_featured?: boolean;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          value: string;
          price_adjustment: number;
          stock: number;
          sku: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          product_id: string;
          name: string;
          value: string;
          price_adjustment?: number;
          stock?: number;
          sku?: string | null;
          is_active?: boolean;
        };
        Update: {
          product_id?: string;
          name?: string;
          value?: string;
          price_adjustment?: number;
          stock?: number;
          sku?: string | null;
          is_active?: boolean;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string;
        };
      };
      user_addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string | null;
          full_name: string;
          phone: string | null;
          street_address: string;
          apartment: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          label?: string | null;
          full_name: string;
          phone?: string | null;
          street_address: string;
          apartment?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          is_default?: boolean;
        };
        Update: {
          user_id?: string;
          label?: string | null;
          full_name?: string;
          phone?: string | null;
          street_address?: string;
          apartment?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          is_default?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          status: string;
          subtotal: number;
          shipping_cost: number;
          tax: number;
          total: number;
          currency: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string | null;
          shipping_address: Record<string, unknown>;
          mp_payment_id: string | null;
          mp_preference_id: string | null;
          mp_status: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string | null;
          order_number?: string;
          status?: string;
          subtotal: number;
          shipping_cost?: number;
          tax?: number;
          total: number;
          currency?: string;
          customer_email: string;
          customer_name: string;
          customer_phone?: string | null;
          shipping_address: Record<string, unknown>;
          mp_payment_id?: string | null;
          mp_preference_id?: string | null;
          mp_status?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          notes?: string | null;
        };
        Update: {
          user_id?: string | null;
          order_number?: string;
          status?: string;
          subtotal?: number;
          shipping_cost?: number;
          tax?: number;
          total?: number;
          currency?: string;
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string | null;
          shipping_address?: Record<string, unknown>;
          mp_payment_id?: string | null;
          mp_preference_id?: string | null;
          mp_status?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          notes?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name: string;
          variant_name: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_image: string | null;
          created_at: string;
        };
        Insert: {
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name: string;
          variant_name?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_image?: string | null;
        };
        Update: {
          order_id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name?: string;
          variant_name?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          product_image?: string | null;
        };
      };
      store_settings: {
        Row: {
          key: string;
          value: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Record<string, unknown>;
        };
        Update: {
          key?: string;
          value?: Record<string, unknown>;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
