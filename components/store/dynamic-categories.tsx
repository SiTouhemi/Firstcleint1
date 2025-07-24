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
        {categories.map((category, idx) => {
          const gradients = [
            'linear-gradient(135deg, rgb(227, 242, 253) 0%, rgb(187, 222, 251) 100%)', // blue
            'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)', // green
            'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)', // orange
            'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)', // purple
            'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', // pink
            'linear-gradient(135deg, #e1f5fe 0%, #81d4fa 100%)', // light blue
          ];
          const background = gradients[idx % gradients.length];
          return (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category.key)}
              style={{
                width: '20vh',
                height: '20vh',
                borderColor: 'rgb(33, 150, 243)',
                background,
                opacity: 0.8,
                fontFamily: 'Noto Sans Arabic, system-ui, -apple-system, sans-serif',
                color: '#1a1a1a',
                textAlign: 'center',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '1rem',
                padding: '1.25rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              className="category-card hover:scale-105 hover:shadow-lg min-w-[120px] flex-shrink-0"
            >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative z-10">
              <span className="text-3xl mb-2 block">{category.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-xs text-gray-600">{category.count}+ منتج</p>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  )
}
