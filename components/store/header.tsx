"use client"

import type React from "react"

import { useState } from "react"
import { Search, ShoppingCart, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  onSearch: (query: string) => void
  cartItemsCount: number
  onCartClick: () => void
  selectedCity: string
  onCityChange: (city: string) => void
}

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

export function Header({ onSearch, cartItemsCount, onCartClick, selectedCity, onCityChange }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
    setShowSearch(false)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="px-4 py-3">
        {/* Top Row - Logo/Name on left, Search/Cart on right (RTL) */}
        <div className="flex flex-row-reverse items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSearch((v) => !v)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">م</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">متجري</h1>
          </div>
        </div>

        {/* City Selector */}
        {/* Removed city selector from header, now only in HomeFilters */}

        {/* Search Popover */}
        {showSearch && (
          <div className="absolute top-16 right-4 left-4 bg-white border rounded-xl shadow-lg p-4 z-50 flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">بحث عن المنتجات</span>
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ابحث عن المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                  autoFocus
                />
              </div>
              <Button type="submit" size="sm">
                بحث
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
