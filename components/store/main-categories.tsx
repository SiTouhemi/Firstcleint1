"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { Category } from "@/types"

interface MainCategoriesProps {
  categories: (Category & { productCount?: number })[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
}

const CATEGORY_STYLES: Record<string, { background: string; borderColor: string }> = {
  electronics: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    borderColor: '#2196f3',
  },
  clothes: {
    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    borderColor: '#9c27b0',
  },
  shoes: {
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffccbc 100%)',
    borderColor: '#ff9800',
  },
  accessories: {
    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
    borderColor: '#e91e63',
  },
  vegetables: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    borderColor: '#4caf50',
  },
  fruits: {
    background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
    borderColor: '#ffc107',
  },
};
const DEFAULT_STYLE = {
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  borderColor: '#e9ecef',
};

export function MainCategories({ categories, selectedCategory, onCategorySelect }: MainCategoriesProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="main-categories-section" style={{ direction: 'rtl' }}>
      <h3 className="main-categories-title text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Noto Sans Arabic, sans-serif', textAlign: 'right' }}>الفئات الرئيسية</h3>
      <div className="main-categories-grid flex flex-row gap-4 overflow-x-auto pb-2">
        {categories.map((category, idx) => {
          const gradients = [
            'linear-gradient(135deg, rgb(227, 242, 253) 0%, rgb(187, 222, 251) 100%)', // blue
            'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)', // green
            'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)', // orange
            'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)', // purple
            'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', // pink
            'linear-gradient(135deg, #e1f5fe 0%, #81d4fa 100%)', // light blue
          ];
          const background = category.background || gradients[idx % gradients.length];
          return (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
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
              className="main-category-card hover:scale-105 hover:shadow-lg min-w-[120px] flex-shrink-0"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="text-3xl mb-2">{category.icon}</span>
                <span className="font-bold text-base text-gray-900 mb-1 block" style={{ fontFamily: 'Noto Sans Arabic, system-ui, -apple-system, sans-serif' }}>{category.name}</span>
                <span className="text-xs text-gray-600 mt-1">+{category.productCount} منتج</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
