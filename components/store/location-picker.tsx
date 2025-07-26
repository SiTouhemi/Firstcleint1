"use client"

import { useState } from "react"
import { MapPin, Navigation, Check, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import MapPicker from "@/components/ui/map-picker"

interface LocationPickerProps {
  onLocationChange: (location: { lat: number; lng: number } | null) => void
  currentLocation: { lat: number; lng: number } | null
}

export function LocationPicker({ onLocationChange, currentLocation }: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showMapPicker, setShowMapPicker] = useState(false)
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

  const handleMapPickerConfirm = (location: { lat: number; lng: number; address?: string }) => {
    onLocationChange({ lat: location.lat, lng: location.lng })
    setShowMapPicker(false)
    toast({
      title: "تم تحديد الموقع",
      description: location.address || "تم تحديد موقع التوصيل بنجاح",
    })
  }

  return (
    <>
      {/* Main Location Picker */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {currentLocation ? "الموقع محدد" : "تحديد موقع التوصيل"}
              </h3>
              <p className="text-xs text-gray-500">
                {currentLocation 
                  ? "سيتم عرض المنتجات القريبة منك" 
                  : "اختر موقعك للحصول على توصيل أسرع"
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentLocation && (
              <Badge variant="secondary" className="text-xs">
                <Check className="w-3 h-3 ml-1" />
                محدد
              </Badge>
            )}
            <Button
              variant={currentLocation ? "outline" : "default"}
              size="sm"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="flex items-center gap-2"
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {isGettingLocation ? "جاري التحديد..." : currentLocation ? "تحديث" : "تحديد"}
            </Button>
          </div>
        </div>

        {/* Location Details */}
        {currentLocation && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">موقع التوصيل</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationModal(true)}
                className="text-blue-600 hover:text-blue-700 text-xs"
              >
                تغيير
              </Button>
            </div>
            <div className="mt-2 text-xs text-blue-700 font-mono">
              {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </div>
          </div>
        )}
      </div>

      {/* Location Options Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">تحديد موقع التوصيل</CardTitle>
              <p className="text-sm text-gray-600">اختر طريقة تحديد موقعك</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Location */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">تحديد سريع</h4>
                    <p className="text-xs text-gray-600">استخدم موقعك الحالي</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setShowLocationModal(false)
                    getCurrentLocation()
                  }}
                  className="w-full"
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  ) : (
                    <Navigation className="w-4 h-4 ml-2" />
                  )}
                  تحديد موقعي الحالي
                </Button>
              </div>

              {/* Interactive Map */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">خريطة تفاعلية</h4>
                    <p className="text-xs text-gray-600">اختر موقعك على الخريطة</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setShowLocationModal(false)
                    setShowMapPicker(true)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 ml-2" />
                  فتح الخريطة
                </Button>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => setShowLocationModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Picker */}
      {showMapPicker && (
        <MapPicker
          onConfirm={handleMapPickerConfirm}
          onCancel={() => setShowMapPicker(false)}
          initialLocation={currentLocation || undefined}
          title="تحديد موقع التوصيل"
          subtitle="اختر موقعك على الخريطة"
        />
      )}
    </>
  )
}
