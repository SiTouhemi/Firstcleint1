import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Database types
export interface Store {
  id: string
  name: string
  slug?: string
  description?: string
  email?: string
  phone?: string
  whatsapp?: string
  website?: string
  address: string
  city_id?: string
  district_id?: string
  location_lat?: number
  location_lng?: number
  delivery_range: number
  delivery_fee: number
  min_order_amount: number
  logo_url?: string
  cover_image_url?: string
  theme_color: string
  is_active: boolean
  is_featured: boolean
  opening_hours?: any
  social_media?: any
  settings?: any
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  store_id: string
  name: string
  slug?: string
  description?: string
  icon?: string
  image_url?: string
  parent_id?: string
  sort_order: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  subcategories?: Category[]
}

export interface Product {
  id: string
  store_id: string
  category_id?: string
  subcategory_id?: string
  name: string
  slug?: string
  description?: string
  short_description?: string
  price: number
  compare_price?: number
  cost_price?: number
  unit: string
  weight?: number
  dimensions?: any
  image_url?: string
  images?: string[]
  gallery?: string[]
  is_active: boolean
  is_featured: boolean
  stock_quantity: number
  track_quantity: boolean
  allow_backorder: boolean
  sku?: string
  barcode?: string
  tags?: string[]
  attributes?: any
  seo_title?: string
  seo_description?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  store_id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_address: string
  customer_city_id?: string
  customer_district_id?: string
  customer_lat?: number
  customer_lng?: number
  customer_notes?: string
  items: any[]
  subtotal: number
  delivery_fee: number
  tax_amount: number
  total: number
  promo_code?: string
  payment_method: string
  payment_status: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  delivery_type: "delivery" | "pickup"
  scheduled_delivery?: string
  delivered_at?: string
  cancelled_at?: string
  cancellation_reason?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface Banner {
  id: string
  store_id: string
  title: string
  subtitle?: string
  description?: string
  image_url?: string
  mobile_image_url?: string
  background_color: string
  text_color: string
  button_text?: string
  button_link?: string
  button_color: string
  position: "hero" | "middle" | "footer"
  is_active: boolean
  sort_order: number
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}
