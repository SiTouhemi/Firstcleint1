"use client"

import { useState } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface LocationPickerProps {
  onLocationChange: (location: { lat: number; lng: number } | null) => void
  currentLocation: { lat: number; lng: number } | null
}

export function LocationPicker({ onLocationChange, currentLocation }: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { toast } = useToast()

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "الموقع غير مدعوم",
        description: "متصفحك لا يدعم خدمات الموقع",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        onLocationChange(location)
        setIsGettingLocation(false)
        toast({
          title: "تم تحديد الموقع",
          description: "سيتم عرض المنتجات القريبة منك",
        })
      },
      (error) => {
        console.error("Error getting location:", error)
        setIsGettingLocation(false)
        toast({
          title: "خطأ في تحديد الموقع",
          description: "تأكد من السماح للموقع بالوصول لموقعك",
          variant: "destructive",
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">{currentLocation ? "الموقع محدد" : "تحديد الموقع"}</span>
        </div>

        <Button
          variant={currentLocation ? "outline" : "default"}
          size="sm"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center gap-2"
        >
          <Navigation className="h-4 w-4" />
          {isGettingLocation ? "جاري التحديد..." : currentLocation ? "تحديث الموقع" : "تحديد الموقع"}
        </Button>
      </div>

      {currentLocation && <div className="mt-2 text-xs text-gray-600">سيتم عرض المنتجات من المتاجر القريبة منك</div>}
    </div>
  )
}
