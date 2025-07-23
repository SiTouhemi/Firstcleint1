import { supabase, type Store } from "../config/database"

export class StoreService {
  static async getAllStores(): Promise<Store[]> {
    const { data, error } = await supabase
      .from("stores")
      .select(`
        *,
        cities(name),
        districts(name)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getStoreById(id: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from("stores")
      .select(`
        *,
        cities(name),
        districts(name)
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error) throw error
    return data
  }

  static async getStoreBySlug(slug: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from("stores")
      .select(`
        *,
        cities(name),
        districts(name)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (error) throw error
    return data
  }

  static async createStore(storeData: Omit<Store, "id" | "created_at" | "updated_at">): Promise<Store> {
    const { data, error } = await supabase.from("stores").insert(storeData).select().single()

    if (error) throw error
    return data
  }

  static async updateStore(id: string, storeData: Partial<Store>): Promise<Store> {
    const { data, error } = await supabase.from("stores").update(storeData).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  static async deleteStore(id: string): Promise<void> {
    const { error } = await supabase.from("stores").update({ is_active: false }).eq("id", id)

    if (error) throw error
  }

  static async getNearbyStores(lat: number, lng: number, radiusKm = 10): Promise<Store[]> {
    const { data, error } = await supabase.rpc("get_nearby_stores", {
      user_lat: lat,
      user_lng: lng,
      radius_km: radiusKm,
    })

    if (error) throw error
    return data || []
  }

  static async getStoreStats(storeId: string): Promise<any> {
    const { data, error } = await supabase.from("store_stats").select("*").eq("id", storeId).single()

    if (error) throw error
    return data
  }

  static async getFeaturedStores(): Promise<Store[]> {
    const { data, error } = await supabase
      .from("stores")
      .select(`
        *,
        cities(name),
        districts(name)
      `)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }
}
