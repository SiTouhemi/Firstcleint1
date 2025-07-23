import { supabase, type Product } from "../config/database"

export class ProductService {
  static async getProducts(filters: {
    storeId?: string
    categoryId?: string
    subcategoryId?: string
    search?: string
    featured?: boolean
    limit?: number
    offset?: number
    city?: string
    latitude?: number
    longitude?: number
    nearbyOnly?: boolean
    sortBy?: "name" | "price"
  }): Promise<Product[]> {
    let query = supabase
      .from("products")
      .select(`
        *,
        stores!inner(id, name, slug, city, location_lat, location_lng, delivery_range),
        category:categories!products_category_id_fkey(name, slug),
        subcategory:categories!products_subcategory_id_fkey(name, slug)
      `)
      .eq("is_active", true)

    if (filters.storeId) {
      query = query.eq("store_id", filters.storeId)
    }

    if (filters.categoryId) {
      query = query.eq("category_id", filters.categoryId)
    }

    if (filters.subcategoryId) {
      query = query.eq("subcategory_id", filters.subcategoryId)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.featured) {
      query = query.eq("is_featured", true)
    }

    // City filtering using city_id
    let cityStoreIds: string[] | undefined = undefined
    if (filters.city) {
      // Look up city id by name
      const { data: city, error: cityError } = await supabase
        .from('cities')
        .select('id')
        .eq('name', filters.city)
        .single()
      if (cityError) throw cityError
      if (city && city.id) {
        // Find all stores in that city
        const { data: storesInCity, error: storesError } = await supabase
          .from('stores')
          .select('id')
          .eq('city_id', city.id)
        if (storesError) throw storesError
        cityStoreIds = (storesInCity || []).map((s: any) => s.id)
        if (cityStoreIds.length === 0) {
          return []
        }
        query = query.in('store_id', cityStoreIds)
      } else {
        // No such city, return empty
        return []
      }
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    // Remove all logic related to sortBy
    // Always sort by name ascending
    query = query.order("name", { ascending: true })

    // Database-side nearby filtering
    let nearbyStoreIds: string[] | undefined = undefined
    if (filters.nearbyOnly && filters.latitude && filters.longitude) {
      // Find stores within their delivery range of the user
      const { data: stores, error: storesError } = await supabase.rpc('find_nearby_stores', {
        user_lat: filters.latitude,
        user_lng: filters.longitude
      })
      if (storesError) throw storesError
      nearbyStoreIds = (stores || []).map((s: any) => s.id)
      if (nearbyStoreIds.length === 0) {
        return []
      }
      query = query.in('store_id', nearbyStoreIds)
    }

    // Fetch data
    const { data, error } = await query
    if (error) throw error
    let products = data || []

    // Remove in-memory haversine filtering

    return products
  }

  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        stores!inner(name, slug, theme_color),
        category:categories!products_category_id_fkey(name, slug),
        subcategory:categories!products_subcategory_id_fkey(name, slug)
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error) throw error
    return data
  }

  static async getProductBySlug(storeId: string, slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        stores!inner(name, slug, theme_color),
        category:categories!products_category_id_fkey(name, slug),
        subcategory:categories!products_subcategory_id_fkey(name, slug)
      `)
      .eq("store_id", storeId)
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (error) throw error
    return data
  }

  static async createProduct(productData: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product> {
    // Validate store_id
    if (!productData.store_id) throw new Error("store_id is required")
    const { data: store, error: storeError } = await supabase.from("stores").select("id").eq("id", productData.store_id).single()
    if (storeError || !store) throw new Error("Invalid store_id")
    // Validate category_id
    if (!productData.category_id) throw new Error("category_id is required")
    const { data: category, error: categoryError } = await supabase.from("categories").select("id").eq("id", productData.category_id).single()
    if (categoryError || !category) throw new Error("Invalid category_id")
    const { data, error } = await supabase.from("products").insert(productData).select().single()
    if (error) throw error
    return data
  }

  static async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    // Validate store_id if present
    if (productData.store_id) {
      const { data: store, error: storeError } = await supabase.from("stores").select("id").eq("id", productData.store_id).single()
      if (storeError || !store) throw new Error("Invalid store_id")
    }
    // Validate category_id if present
    if (productData.category_id) {
      const { data: category, error: categoryError } = await supabase.from("categories").select("id").eq("id", productData.category_id).single()
      if (categoryError || !category) throw new Error("Invalid category_id")
    }
    const { data, error } = await supabase.from("products").update(productData).eq("id", id).select().single()
    if (error) throw error
    return data
  }

  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from("products").update({ is_active: false }).eq("id", id)

    if (error) throw error
  }

  static async getNearbyProducts(lat: number, lng: number, radiusKm = 10): Promise<Product[]> {
    const { data, error } = await supabase.rpc("get_nearby_products", {
      user_lat: lat,
      user_lng: lng,
      radius_km: radiusKm,
    })

    if (error) throw error
    return data || []
  }

  static async updateStock(id: string, quantity: number): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .update({ stock_quantity: quantity })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getFeaturedProducts(storeId?: string): Promise<Product[]> {
    let query = supabase
      .from("products")
      .select(`
        *,
        stores!inner(name, slug, theme_color),
        category:categories!products_category_id_fkey(name, slug),
        subcategory:categories!products_subcategory_id_fkey(name, slug)
      `)
      .eq("is_active", true)
      .eq("is_featured", true)

    if (storeId) {
      query = query.eq("store_id", storeId)
    }

    query = query.order("sort_order", { ascending: true }).order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) throw error
    return data || []
  }
}
