"use client"

import { useState, useCallback } from "react"
import type { Location } from "@/types"

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Get city name from coordinates
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
          const response = await fetch(`${backendUrl}/api/reverse-geocode?lat=${latitude}&lng=${longitude}`)

          let city = "غير محدد"
          if (response.ok) {
            const data = await response.json()
            city = data.city || "غير محدد"
          }

          setLocation({
            latitude,
            longitude,
            city,
          })
        } catch (err) {
          setLocation({
            latitude,
            longitude,
            city: "غير محدد",
          })
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        setError("Unable to retrieve your location")
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }, [])

  return {
    location,
    loading,
    error,
    requestLocation,
  }
}
