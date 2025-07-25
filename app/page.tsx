import { BannerComponent } from "@/components/store/banner"
import { HomeClient } from "@/components/store/HomeClient"
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
import SubcategoryFilterBar from "@/components/store/SubcategoryFilterBar"

// Add server-side fetching for banners
async function getBanners() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const res = await fetch(`${backendUrl}/api/banners`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  return data.success ? data.data : []
}

export default async function HomePage() {
  const banners = await getBanners()
  return <HomeClient banners={banners} />
}
