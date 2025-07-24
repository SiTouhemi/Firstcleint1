"use client"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const cities = [
  "الرياض",
  "جدة",
  "الدمام",
  "مكة المكرمة",
  "المدينة المنورة",
  "الطائف",
  "تبوك",
  "بريدة",
  "خميس مشيط",
  "الأحساء",
]

interface HomeFiltersProps {
  nearbyOnly: boolean
  onNearbyToggle: (enabled: boolean) => void
  hasLocation: boolean
  selectedCity: string
  onCityChange: (city: string) => void
}

export function HomeFilters({ nearbyOnly, onNearbyToggle, hasLocation, selectedCity, onCityChange }: HomeFiltersProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 justify-end">
      {/* Location button first (rightmost in RTL) */}
      <Button
        variant={nearbyOnly ? "default" : "outline"}
        size="sm"
        onClick={() => onNearbyToggle(!nearbyOnly)}
        className="flex-shrink-0 flex items-center gap-2"
      >
        <MapPin className="h-4 w-4" />
        قريب مني
      </Button>
      {/* City filter select (to the left of location in RTL) */}
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="flex-shrink-0 p-2 border border-gray-300 rounded-lg text-sm bg-white min-w-[100px] max-w-[140px]"
      >
        <option value="">كل المدن</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      {nearbyOnly && !hasLocation && (
        <span className="text-xs text-amber-600 flex-shrink-0">يرجى السماح بالوصول للموقع</span>
      )}
    </div>
  )
}
