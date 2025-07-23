"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/app/providers"

interface Category {
  id: string
  key: string
  name: string
  icon: string
  count: number
  gradient: string
  borderColor: string
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { supabase } = useApp()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select(`
            *,
            products!inner(count)
          `)
          .eq("is_active", true)
          .order("sort_order", { ascending: true })

        if (error) throw error

        // Transform data to match our Category interface
        const transformedCategories =
          data?.map((category) => ({
            id: category.id,
            key: category.key,
            name: category.name,
            icon: category.icon,
            count: category.products?.length || 0,
            gradient: category.gradient,
            borderColor: category.border_color,
          })) || []

        setCategories(transformedCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()

    // Subscribe to real-time changes
    const channel = supabase
      .channel("categories")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, () => {
        fetchCategories()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return { categories, loading }
}
