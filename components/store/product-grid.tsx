"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"

interface ProductGridProps {
  products: Product[]
  loading: boolean
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (product: Product) => {
    if (!product.available || product.stock_quantity <= 0) {
      toast({
        title: "المنتج غير متوفر",
        description: "هذا المنتج غير متوفر حالياً",
        variant: "destructive",
      })
      return
    }

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
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-3">
              <div className="bg-gray-200 rounded-lg h-32 mb-3" />
              <div className="bg-gray-200 h-4 rounded mb-2" />
              <div className="bg-gray-200 h-3 rounded mb-2" />
              <div className="bg-gray-200 h-6 rounded" />
            </CardContent>
          </Card>
        ))}
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
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="p-3">
            <div className="relative mb-3">
              <img
                src={product.image_url || "/placeholder.svg?height=120&width=120&query=product"}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              {!product.available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">غير متوفر</span>
                </div>
              )}
              {product.distance && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {product.distance.toFixed(1)} كم
                </div>
              )}
            </div>

            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>

            {product.description && <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>}

            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-blue-600">{product.price} ر.س</span>
                {product.unit && <span className="text-xs text-gray-500">/{product.unit}</span>}
              </div>

              <Button
                size="sm"
                onClick={() => handleAddToCart(product)}
                disabled={!product.available || product.stock_quantity <= 0}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {product.store_name && <p className="text-xs text-gray-500 mt-1">{product.store_name}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
