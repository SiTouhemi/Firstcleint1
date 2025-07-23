"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { Category } from "@/types"

interface MainCategoriesProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
}

export function MainCategories({ categories, selectedCategory, onCategorySelect }: MainCategoriesProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">الأقسام</h3>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
