"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"
import { useState } from "react"
import { useFavorites } from "@/hooks/use-favorites"

interface ProductGridProps {
  products: Product[]
  loading: boolean
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const { isFavorite, toggleFavorite } = useFavorites()

  if (loading) {
    return (
      <div className="products-section px-0">
        <div className="products-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-[480px] sm:max-w-2xl md:max-w-4xl mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow animate-pulse w-full h-[220px] md:h-[250px]" />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">لا توجد منتجات</p>
      </div>
    )
  }

  return (
    <div className="products-section px-0">
      <div className="products-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-[480px] sm:max-w-2xl md:max-w-4xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card bg-white rounded-xl overflow-hidden shadow transition-all duration-300 cursor-pointer w-full min-w-[140px] sm:min-w-[160px] md:min-w-[180px] md:h-auto"
          >
            <div className="product-image relative w-full h-[120px] sm:h-[140px] md:h-[160px] overflow-hidden">
              <img
                src={product.image_url || "/placeholder.svg?height=120&width=120&query=product"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
              />
              <button
                className={`favorite-btn absolute top-2 right-2 bg-white/90 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${isFavorite(product.id) ? 'text-red-600' : 'text-gray-400'}`}
                aria-label="إضافة للمفضلة"
                onClick={() => toggleFavorite(product.id)}
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <div className="product-info p-3">
              <h3 className="product-name text-[13px] md:text-[15px] font-semibold text-gray-900 mb-1 leading-tight line-clamp-2 truncate">{product.name}</h3>
              {product.description && <p className="product-description text-[11px] md:text-[13px] text-gray-600 mb-2 leading-tight line-clamp-2 truncate">{product.description}</p>}
              <div className="product-price text-[14px] md:text-[16px] font-bold text-blue-600 mb-2 truncate">{product.price} {product.unit && <span className="text-[12px] md:text-[14px]">ر.س/{product.unit}</span>}</div>
              {product.available === false || (product.stock_quantity !== undefined && product.stock_quantity <= 0) ? (
                <div className="text-xs text-red-500 font-semibold text-center py-2">المنتج غير متوفر حالياً</div>
              ) : (
                <button
                  className="add-to-cart-btn w-full bg-gray-50 border border-gray-200 py-2 rounded-lg text-[11px] md:text-[13px] font-medium flex items-center justify-center gap-1 text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  onClick={() => {
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image_url: product.image_url,
                      unit: product.unit,
                    })
                    toast({
                      title: "تم إضافة المنتج",
                      description: `تم إضافة ${product.name} إلى السلة`,
                    })
                  }}
                  type="button"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  إضافة للسلة
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
