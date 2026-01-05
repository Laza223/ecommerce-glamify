// Database types matching Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============ Categories ============
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

// ============ Products ============
export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  cost_per_item: number | null
  sku: string | null
  barcode: string | null
  stock: number
  low_stock_threshold: number
  images: string[]
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  // Relations
  category?: Category
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  value: string
  price_adjustment: number
  stock: number
  sku: string | null
  is_active: boolean
  created_at: string
}

// ============ Profiles (extends auth.users) ============
export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

export interface UserAddress {
  id: string
  user_id: string
  label: string | null
  full_name: string
  phone: string | null
  street_address: string
  apartment: string | null
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
}

// ============ Orders ============
export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled'

export interface Order {
  id: string
  user_id: string | null
  order_number: string
  status: OrderStatus
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  currency: string
  
  // Customer info (for guest checkout)
  customer_email: string
  customer_name: string
  customer_phone: string | null
  
  // Shipping address
  shipping_address: ShippingAddress
  
  // Payment info
  mp_payment_id: string | null
  mp_preference_id: string | null
  mp_status: string | null
  
  // Tracking
  tracking_number: string | null
  tracking_url: string | null
  
  notes: string | null
  created_at: string
  updated_at: string
  
  // Relations
  items?: OrderItem[]
  profile?: Profile
}

export interface ShippingAddress {
  full_name: string
  phone: string | null
  street_address: string
  apartment: string | null
  city: string
  state: string
  postal_code: string
  country: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string | null
  product_name: string
  variant_name: string | null
  quantity: number
  unit_price: number
  total_price: number
  product_image: string | null
  created_at: string
  // Relations
  product?: Product
}

// ============ Store Settings ============
export interface StoreSetting {
  key: string
  value: Json
  created_at: string
  updated_at: string
}

// ============ Cart (Client-side) ============
export interface CartItem {
  product_id: string
  variant_id: string | null
  quantity: number
  // Denormalized for display
  product: Product
  variant?: ProductVariant
}

// ============ API Response Types ============
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// ============ Filter Types ============
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  search?: string
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest'
}
