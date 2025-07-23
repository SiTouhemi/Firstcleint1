"use client"

import { useCategories } from "@/hooks/use-categories"

interface DynamicCategoriesProps {
  onCategorySelect: (category: string) => void
}

export function DynamicCategories({ onCategorySelect }: DynamicCategoriesProps) {
  const { categories, loading } = useCategories()

  if (loading) {
    return (
      <div className="p-5 bg-white border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الفئات الرئيسية</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-[120px] flex-shrink-0 bg-gray-200 rounded-xl p-5 animate-pulse h-24"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 bg-white border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">الفئات الرئيسية</h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category.key)}
            className={`min-w-[120px] flex-shrink-0 ${category.gradient} rounded-xl p-5 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border ${category.borderColor} relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>

            <div className="relative z-10">
              <span className="text-3xl mb-2 block">{category.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-xs text-gray-600">{category.count}+ منتج</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
