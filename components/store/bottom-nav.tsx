"use client"

import { useState, useEffect } from "react"
import { Home, ShoppingCart, Package, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BottomNavProps {
  currentPage: "home" | "cart" | "orders" | "profile" | "favorites"
  onPageChange: (page: "home" | "cart" | "orders" | "profile" | "favorites") => void
  cartItemsCount: number
  showFavorites?: boolean
}

export function BottomNav({ currentPage, onPageChange, cartItemsCount, showFavorites }: BottomNavProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { id: "home" as const, label: "الرئيسية", icon: Home },
    { id: "cart" as const, label: "السلة", icon: ShoppingCart, badge: cartItemsCount },
    { id: "favorites" as const, label: "المفضلة", icon: Heart },
    { id: "orders" as const, label: "الطلبات", icon: Package },
    // Removed profile/user nav item
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            if (item.id === "favorites" && !showFavorites) return null
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 relative ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {item.id === "favorites" ? (
                  <Icon className={`h-6 w-6 md:h-7 md:w-7 ${isActive ? "fill-blue-600" : "fill-none"}`} fill={isActive ? "#2563eb" : "none"} />
                ) : (
                  <Icon className="h-6 w-6 md:h-7 md:w-7" />
                )}
                {item.label && <span className="text-xs">{item.label}</span>}
                {mounted && item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
