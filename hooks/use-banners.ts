"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/app/providers"

interface Banner {
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
  sort_order: number
  start_date?: string
  end_date?: string
  store_id?: string
  position?: string
  created_at?: string
  updated_at?: string
}

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners')
        const data = await res.json()
        setBanners(data.success ? data.data : [])
      } catch (error) {
        console.error('Error fetching banners:', error)
        setBanners([])
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  return { banners, loading }
}
