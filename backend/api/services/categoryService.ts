import { supabase, type Category } from "../config/database"

export class CategoryService {
  static async getCategories(storeId?: string, includeSubcategories = true): Promise<Category[]> {
    let query = supabase.from("categories").select("*").eq("is_active", true).is("parent_id", null) // Only main categories

    if (storeId) {
      query = query.eq("store_id", storeId)
    }

    query = query.order("sort_order", { ascending: true }).order("name", { ascending: true })

    const { data: categories, error } = await query

    if (error) throw error

    if (includeSubcategories && categories) {
      // Fetch subcategories for each category
      for (const category of categories) {
        const { data: subcategories } = await supabase
          .from("categories")
          .select("*")
          .eq("parent_id", category.id)
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true })

        category.subcategories = subcategories || []
      }
    }

    return categories || []
  }

  static async getSubcategories(parentId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("parent_id", parentId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })

    if (error) throw error
    return data || []
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .select(`
        *,
        parent:categories!parent_id(*)
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error) throw error
    return data
  }

  static async getCategoryBySlug(storeId: string, slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .select(`
        *,
        parent:categories!parent_id(*)
      `)
      .eq("store_id", storeId)
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (error) throw error
    return data
  }

  static async createCategory(categoryData: Omit<Category, "id" | "created_at" | "updated_at">): Promise<Category> {
    const { data, error } = await supabase.from("categories").insert(categoryData).select().single()

    if (error) throw error
    return data
  }

  static async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase.from("categories").update(categoryData).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  static async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from("categories").update({ is_active: false }).eq("id", id)

    if (error) throw error
  }

  static async getFeaturedCategories(storeId?: string): Promise<Category[]> {
    let query = supabase.from("categories").select("*").eq("is_active", true).eq("is_featured", true)

    if (storeId) {
      query = query.eq("store_id", storeId)
    }

    query = query.order("sort_order", { ascending: true }).order("name", { ascending: true })

    const { data, error } = await query

    if (error) throw error
    return data || []
  }
}
