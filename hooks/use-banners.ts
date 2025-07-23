"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/app/providers"

interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url?: string
  background_color: string
  text_color: string
  button_text?: string
  button_link?: string
  is_active: boolean
  sort_order: number
}

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const { supabase } = useApp()

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true })

        if (error) throw error
        setBanners(data || [])
      } catch (error) {
        console.error("Error fetching banners:", error)
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()

    // Subscribe to real-time changes
    const channel = supabase
      .channel("banners")
      .on("postgres_changes", { event: "*", schema: "public", table: "banners" }, () => {
        fetchBanners()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return { banners, loading }
}
