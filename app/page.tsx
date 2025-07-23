"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/store/header"
import { BannerComponent } from "@/components/store/banner"
import { MainCategories } from "@/components/store/main-categories"
import { ProductGrid } from "@/components/store/product-grid"
import { BottomNav } from "@/components/store/bottom-nav"
import { CartPage } from "@/components/store/cart-page"
import { OrdersPage } from "@/components/store/orders-page"
import { HomeFilters } from "@/components/store/home-filters"
import { useCart } from "@/hooks/use-cart"
import { useLocation } from "@/hooks/use-location"
import { ArrowRight } from "@/components/icons/arrow-right" // Import ArrowRight component
import type { Product, Category } from "@/types"

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<"home" | "cart" | "orders" | "profile">("home")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [nearbyOnly, setNearbyOnly] = useState(false)
  // Remove all state and logic related to sortBy
  // Remove sortBy from HomeFilters props and usage

  const { getTotalItems } = useCart()
  const { location, requestLocation } = useLocation()

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        const response = await fetch(`${backendUrl}/api/categories`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setCategories(data.data)
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        const params = new URLSearchParams()

        if (selectedCategory) params.append("category", selectedCategory)
        if (searchQuery) params.append("search", searchQuery)
        if (selectedCity) params.append("city", selectedCity)
        // Remove sortBy from HomeFilters props and usage

        // Add location parameters for nearby filter
        if (nearbyOnly && location) {
          params.append("latitude", location.latitude.toString())
          params.append("longitude", location.longitude.toString())
          params.append("nearbyOnly", "true")
        }

        const response = await fetch(`${backendUrl}/api/products?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.success ? data.data : [])
        } else {
          console.error("Failed to fetch products")
          setProducts([])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, searchQuery, selectedCity, nearbyOnly, location])

  // Request location when nearby filter is enabled
  useEffect(() => {
    if (nearbyOnly && !location) {
      requestLocation()
    }
  }, [nearbyOnly, location, requestLocation])

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName === selectedCategory ? "" : categoryName)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
  }

  const handleNearbyToggle = (enabled: boolean) => {
    setNearbyOnly(enabled)
  }

  // Remove handleSortChange

  const handleCartClick = () => {
    setCurrentPage("cart")
  }

  if (currentPage === "cart") {
    return <CartPage onBack={() => setCurrentPage("home")} />
  }

  if (currentPage === "orders") {
    return <OrdersPage onBack={() => setCurrentPage("home")} />
  }

  if (currentPage === "profile") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setCurrentPage("home")} className="p-2">
              <ArrowRight className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">الملف الشخصي</h1>
          </div>
        </header>
        <main className="px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-600">قريباً...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={handleSearch}
        cartItemsCount={getTotalItems()}
        onCartClick={handleCartClick}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
      />

      <main className="pb-20">
        <BannerComponent />

        <div className="px-4 py-6 space-y-6">
          <MainCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          <HomeFilters
            nearbyOnly={nearbyOnly}
            // Remove sortBy from HomeFilters props and usage
            onNearbyToggle={handleNearbyToggle}
            // Remove onSortChange
            hasLocation={!!location}
          />

          <ProductGrid products={products} loading={loading} />
        </div>
      </main>

      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} cartItemsCount={getTotalItems()} />
    </div>
  )
}
