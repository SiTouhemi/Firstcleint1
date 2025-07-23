"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/app/providers"
import type { Product } from "@/types"

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { supabase } = useApp()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true })

        if (error) throw error

        // Transform data to match our Product interface
        const transformedProducts =
          data?.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category_key,
            description: product.description,
            unit: product.unit,
            image: product.image_url,
            created_at: product.created_at,
            updated_at: product.updated_at,
          })) || []

        setProducts(transformedProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    // Subscribe to real-time changes
    const channel = supabase
      .channel("products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        fetchProducts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return { products, loading }
}
