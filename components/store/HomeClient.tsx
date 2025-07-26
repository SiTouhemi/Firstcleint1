"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/store/header"
import { DynamicBanner } from "@/components/store/dynamic-banner"
import { MainCategories } from "@/components/store/main-categories"
import { ProductGrid } from "@/components/store/product-grid"
import { BottomNav } from "@/components/store/bottom-nav"
import { CartPage } from "@/components/store/cart-page"
import { OrdersPage } from "@/components/store/orders-page"
import { HomeFilters } from "@/components/store/home-filters"
import { useCart } from "@/hooks/use-cart"
import { useLocation } from "@/hooks/use-location"
import { ArrowRight } from "@/components/icons/arrow-right"
import type { Product, Category, Banner } from "@/types"
import SubcategoryFilterBar from "@/components/store/SubcategoryFilterBar"
import { useFavorites } from "@/hooks/use-favorites"
import { Heart } from "lucide-react"

interface HomeClientProps {
  banners: Banner[]
}

export function HomeClient({ banners }: HomeClientProps) {
  const [currentPage, setCurrentPage] = useState<"home" | "cart" | "orders" | "profile" | "favorites">("home")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const [cities, setCities] = useState<string[]>([])
  const [hasInitialLoad, setHasInitialLoad] = useState(false)

  const { getTotalItems } = useCart()
  const { location, requestLocation } = useLocation()
  const { favorites } = useFavorites()

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

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/cities")
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          // Accept both array of objects or array of strings
          if (typeof data.data[0] === "string") {
            setCities(data.data)
          } else if (typeof data.data[0] === "object" && data.data[0].name) {
            setCities(data.data.map((c: any) => c.name))
          }
        }
      } catch (e) {
        setCities([])
      }
    }
    fetchCities()
  }, [])

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id)
    }
  }, [categories, selectedCategory])
  useEffect(() => {
    setSelectedSubcategory("")
  }, [selectedCategory])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        const params = new URLSearchParams()
        if (selectedCategory) params.append("category", selectedCategory)
        if (selectedSubcategory) params.append("subcategory", selectedSubcategory)
        if (searchQuery) params.append("search", searchQuery)
        if (selectedCity) params.append("city", selectedCity)
        if (nearbyOnly && location) {
          params.append("latitude", location.latitude.toString())
          params.append("longitude", location.longitude.toString())
          params.append("nearbyOnly", "true")
        } else if (nearbyOnly && !location) {
          // Don't fetch with nearbyOnly if location is not available yet
          setLoading(false)
          return
        }
        // Add cache-busting param
        params.append("t", Date.now().toString())
        const response = await fetch(`${backendUrl}/api/products?${params.toString()}`, { cache: 'no-store' })
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
        setHasInitialLoad(true)
      }
    }
    
    // Only fetch products if we have a selected category or if it's the initial load
    if (selectedCategory || (!selectedCategory && categories.length > 0)) {
      fetchProducts()
    }
  }, [selectedCategory, selectedSubcategory, searchQuery, selectedCity, nearbyOnly, categories.length])

  useEffect(() => {
    if (nearbyOnly && !location) {
      requestLocation()
    }
  }, [nearbyOnly, location, requestLocation])

  // Separate effect to handle location changes after initial load
  useEffect(() => {
    if (hasInitialLoad && location && nearbyOnly) {
      // Refetch products when location changes and nearbyOnly is enabled
      const fetchProducts = async () => {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
          const params = new URLSearchParams()
          if (selectedCategory) params.append("category", selectedCategory)
          if (selectedSubcategory) params.append("subcategory", selectedSubcategory)
          if (searchQuery) params.append("search", searchQuery)
          if (selectedCity) params.append("city", selectedCity)
          if (nearbyOnly && location) {
            params.append("latitude", location.latitude.toString())
            params.append("longitude", location.longitude.toString())
            params.append("nearbyOnly", "true")
          }
          params.append("t", Date.now().toString())
          const response = await fetch(`${backendUrl}/api/products?${params.toString()}`, { cache: 'no-store' })
          if (response.ok) {
            const data = await response.json()
            setProducts(data.success ? data.data : [])
          }
        } catch (error) {
          console.error("Error fetching products with location:", error)
        }
      }
      fetchProducts()
    }
  }, [location, hasInitialLoad, nearbyOnly, selectedCategory, selectedSubcategory, searchQuery, selectedCity])

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }
  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)
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
  if (currentPage === "favorites") {
    const favoriteProducts = products.filter((p) => favorites.includes(p.id))
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setCurrentPage("home")} className="p-2">
              <ArrowRight className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">المفضلة</h1>
          </div>
        </header>
        <main className="px-4 py-6">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">لا توجد منتجات مفضلة</p>
            </div>
          ) : (
            <ProductGrid products={favoriteProducts} loading={false} />
          )}
        </main>
        <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} cartItemsCount={getTotalItems()} showFavorites />
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
        <DynamicBanner pcMode={true} />
        <div className="px-4 py-6 space-y-6">
          <MainCategories
            categories={categories.filter(c => !c.parent_id).map(cat => ({
              ...cat,
              productCount: products.filter(p => p.category_id === cat.id).length
            }))}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
          {/* Subcategories below categories */}
          {selectedCategory && (() => {
            console.log('Selected category:', selectedCategory);
            console.log('All categories:', categories);
            // Find subcategories where parent_id matches the selected category
            let subcategories = categories.filter(c => c.parent_id === selectedCategory)
            console.log('Subcategories:', subcategories);
            if (subcategories && subcategories.length > 0) {
              console.log('Rendering subcategory bar with:', subcategories);
              return (
                <SubcategoryFilterBar
                  subcategories={subcategories}
                  selectedId={selectedSubcategory}
                  onSelect={handleSubcategorySelect}
                />
              )
            }
            console.log('No subcategories to render');
            return null
          })()}
          <HomeFilters
            cities={cities}
            nearbyOnly={nearbyOnly}
            onNearbyToggle={handleNearbyToggle}
            hasLocation={!!location}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />
          <ProductGrid products={products} loading={loading} />
        </div>
      </main>
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} cartItemsCount={getTotalItems()} showFavorites />
    </div>
  )
} 