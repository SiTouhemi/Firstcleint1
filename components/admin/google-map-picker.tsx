"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { google } from "google-maps"

interface GoogleMapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  initialLocation?: { lat: number; lng: number; address: string }
}

export function GoogleMapPicker({ onLocationSelect, initialLocation }: GoogleMapPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [searchValue, setSearchValue] = useState(initialLocation?.address || "")
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    initializeMap()
  }, [])

  const initializeMap = async () => {
    try {
      // Wait for Google Maps to load
      if (!window.google) {
        await new Promise((resolve) => {
          const checkGoogle = () => {
            if (window.google) {
              resolve(true)
            } else {
              setTimeout(checkGoogle, 100)
            }
          }
          checkGoogle()
        })
      }

      const defaultLocation = initialLocation || { lat: 24.7136, lng: 46.6753 } // Riyadh

      const mapInstance = new window.google.maps.Map(mapRef.current!, {
        center: defaultLocation,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      const markerInstance = new window.google.maps.Marker({
        position: defaultLocation,
        map: mapInstance,
        draggable: true,
        title: "اسحب لتحديد الموقع",
      })

      // Handle marker drag
      markerInstance.addListener("dragend", () => {
        const position = markerInstance.getPosition()
        if (position) {
          reverseGeocode(position.lat(), position.lng())
        }
      })

      // Handle map click
      mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          markerInstance.setPosition(event.latLng)
          reverseGeocode(event.latLng.lat(), event.latLng.lng())
        }
      })

      setMap(mapInstance)
      setMarker(markerInstance)
      setIsLoading(false)

      // If initial location exists, get its address
      if (initialLocation && !initialLocation.address) {
        reverseGeocode(initialLocation.lat, initialLocation.lng)
      }
    } catch (error) {
      console.error("Error initializing map:", error)
      setIsLoading(false)
      toast({
        title: "خطأ في تحميل الخريطة",
        description: "تأكد من اتصالك بالإنترنت",
        variant: "destructive",
      })
    }
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`)
      const data = await response.json()

      if (data.success && data.address) {
        setSearchValue(data.address)
        onLocationSelect({ lat, lng, address: data.address })
      } else {
        // Fallback to coordinates if reverse geocoding fails
        const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        setSearchValue(address)
        onLocationSelect({ lat, lng, address })
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error)
      // Fallback to coordinates
      const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      setSearchValue(address)
      onLocationSelect({ lat, lng, address })
    }
  }

  const handleSearch = async () => {
    if (!searchValue.trim() || !map || !marker) return

    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(searchValue)}`)
      const data = await response.json()

      if (data.success && data.location) {
        const { lat, lng } = data.location
        const position = new window.google.maps.LatLng(lat, lng)

        map.setCenter(position)
        map.setZoom(16)
        marker.setPosition(position)

        onLocationSelect({ lat, lng, address: searchValue })

        toast({
          title: "تم العثور على الموقع",
          description: "تم تحديد الموقع على الخريطة",
        })
      } else {
        toast({
          title: "لم يتم العثور على الموقع",
          description: "جرب البحث بعنوان أكثر تفصيلاً",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error geocoding:", error)
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث عن الموقع",
        variant: "destructive",
      })
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "الموقع غير مدعوم",
        description: "متصفحك لا يدعم خدمات الموقع",
        variant: "destructive",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        if (map && marker) {
          const pos = new window.google.maps.LatLng(latitude, longitude)
          map.setCenter(pos)
          map.setZoom(16)
          marker.setPosition(pos)
          reverseGeocode(latitude, longitude)
        }
      },
      (error) => {
        console.error("Error getting location:", error)
        toast({
          title: "خطأ في تحديد الموقع",
          description: "تأكد من السماح للموقع بالوصول لموقعك",
          variant: "destructive",
        })
      },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="ابحث عن عنوان أو منطقة..."
            className="pr-10"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} variant="outline">
          بحث
        </Button>
        <Button onClick={getCurrentLocation} variant="outline">
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        <div ref={mapRef} className="w-full h-64 rounded-lg border border-gray-300" style={{ minHeight: "256px" }} />

        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">جاري تحميل الخريطة...</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600">اضغط على الخريطة أو اسحب العلامة لتحديد الموقع بدقة</p>
    </div>
  )
}
