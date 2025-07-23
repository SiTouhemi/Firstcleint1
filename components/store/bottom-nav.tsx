"use client"

import { Home, ShoppingCart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BottomNavProps {
  currentPage: "home" | "cart" | "orders" | "profile"
  onPageChange: (page: "home" | "cart" | "orders" | "profile") => void
  cartItemsCount: number
}

export function BottomNav({ currentPage, onPageChange, cartItemsCount }: BottomNavProps) {
  const navItems = [
    { id: "home" as const, label: "الرئيسية", icon: Home },
    { id: "cart" as const, label: "السلة", icon: ShoppingCart, badge: cartItemsCount },
    { id: "orders" as const, label: "الطلبات", icon: Package },
    // Removed profile/user nav item
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
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
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
