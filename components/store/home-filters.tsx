"use client"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeFiltersProps {
  nearbyOnly: boolean
  onNearbyToggle: (enabled: boolean) => void
  hasLocation: boolean
}

export function HomeFilters({ nearbyOnly, onNearbyToggle, hasLocation }: HomeFiltersProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      <Button
        variant={nearbyOnly ? "default" : "outline"}
        size="sm"
        onClick={() => onNearbyToggle(!nearbyOnly)}
        className="flex-shrink-0 flex items-center gap-2"
      >
        <MapPin className="h-4 w-4" />
        قريب مني
      </Button>

      {nearbyOnly && !hasLocation && (
        <span className="text-xs text-amber-600 flex-shrink-0">يرجى السماح بالوصول للموقع</span>
      )}
    </div>
  )
}
