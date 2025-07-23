"use client"

import { useState, useEffect } from "react"

export function useApi<T>(url: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(url)
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error || "An error occurred")
        }
      } catch (err) {
        setError("Failed to fetch data")
        console.error("API Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error }
}
