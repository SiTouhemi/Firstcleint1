"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types"

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <div className="bg-white border-b px-4 py-3">
      <ScrollArea className="w-full">
        <div className="flex space-x-3 space-x-reverse">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect("")}
            className="flex-shrink-0"
          >
            الكل
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategorySelect(category.id)}
              className="flex-shrink-0"
            >
              {category.icon && <span className="mr-1">{category.icon}</span>}
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
