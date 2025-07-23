import { supabase, type Order } from "../config/database"

export class OrderService {
  static async getOrders(filters: {
    storeId?: string
    status?: string
    customerPhone?: string
    limit?: number
    offset?: number
  }): Promise<Order[]> {
    let query = supabase.from("orders").select(`
        *,
        stores!inner(name, slug, theme_color)
      `)

    if (filters.storeId) {
      query = query.eq("store_id", filters.storeId)
    }

    if (filters.status) {
      query = query.eq("status", filters.status)
    }

    if (filters.customerPhone) {
      query = query.eq("customer_phone", filters.customerPhone)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  static async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        stores!inner(name, slug, theme_color, phone, address)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  static async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        stores!inner(name, slug, theme_color, phone, address)
      `)
      .eq("order_number", orderNumber)
      .single()

    if (error) throw error
    return data
  }

  static async createOrder(
    orderData: Omit<Order, "id" | "order_number" | "created_at" | "updated_at">,
  ): Promise<Order> {
    const { data, error } = await supabase.from("orders").insert(orderData).select().single()

    if (error) throw error
    return data
  }

  static async updateOrderStatus(id: string, status: Order["status"], adminNotes?: string): Promise<Order> {
    const updateData: any = { status }

    if (adminNotes) {
      updateData.admin_notes = adminNotes
    }

    if (status === "delivered") {
      updateData.delivered_at = new Date().toISOString()
    }

    if (status === "cancelled") {
      updateData.cancelled_at = new Date().toISOString()
    }

    const { data, error } = await supabase.from("orders").update(updateData).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  static async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .update({ payment_status: paymentStatus })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getOrderStats(storeId?: string): Promise<{
    total: number
    pending: number
    confirmed: number
    preparing: number
    ready: number
    out_for_delivery: number
    delivered: number
    cancelled: number
    total_revenue: number
  }> {
    let query = supabase.from("orders").select("status, total")

    if (storeId) {
      query = query.eq("store_id", storeId)
    }

    const { data, error } = await query

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
      total_revenue: 0,
    }

    data?.forEach((order) => {
      stats[order.status as keyof typeof stats]++
      if (order.status === "delivered") {
        stats.total_revenue += Number.parseFloat(order.total)
      }
    })

    return stats
  }

  static async getRecentOrders(storeId?: string, limit = 5): Promise<Order[]> {
    let query = supabase.from("orders").select(`
        *,
        stores!inner(name, slug)
      `)

    if (storeId) {
      query = query.eq("store_id", storeId)
    }

    query = query.order("created_at", { ascending: false }).limit(limit)

    const { data, error } = await query

    if (error) throw error
    return data || []
  }
}
