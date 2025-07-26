export interface Product {
  id: string
  name: string
  description?: string
  price: number
  original_price?: number
  image_url?: string
  available: boolean
  stock_quantity: number
  unit?: string
  category_id?: string
  category_name?: string
  store_id: string
  store_name?: string
  city?: string
  distance?: number
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  key: string
  description?: string
  icon?: string
  gradient?: string
  border_color?: string
  background?: string // new optional property for background color/gradient
  is_active: boolean
  sort_order: number
  parent_id?: string
  store_id?: string
  created_at?: string
  updated_at?: string
  subcategories?: Category[]
}

export interface Store {
  id: string
  name: string
  slug: string
  description?: string
  location_lat?: number
  location_lng?: number
  address?: string
  city?: string
  phone?: string
  delivery_range?: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  offer_text?: string
  badge_text?: string
  background_color?: string
  text_color?: string
  button_color?: string
  button_text?: string
  button_link?: string
  image_url?: string
  is_active: boolean
  sort_order?: number
  start_date?: string
  end_date?: string
  store_id?: string
  position?: string
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  image_url?: string
  unit?: string
  quantity: number
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  items: OrderItem[]
  subtotal: number
  delivery_fee: number
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  created_at?: string
  updated_at?: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
  total: number
}

export interface Location {
  latitude: number
  longitude: number
  city?: string
  address?: string
}
