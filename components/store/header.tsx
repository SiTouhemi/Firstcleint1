"use client"

import type React from "react"

import { useState } from "react"
import { Search, ShoppingCart, MapPin } from "lucide-react"
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="px-4 py-3">
        {/* Top Row - Logo and Cart */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">م</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">متجري</h1>
          </div>

          <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Button>
        </div>

        {/* City Selector */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">جميع المدن</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button type="submit" size="sm">
            بحث
          </Button>
        </form>
      </div>
    </header>
  )
}
