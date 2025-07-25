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
  subcategories?: Category[]
  parent_id?: string
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data.success ? data.data : [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    fetchCategories();
    interval = setInterval(fetchCategories, 900000);
    return () => clearInterval(interval);
  }, [])

  return { categories, loading }
}
