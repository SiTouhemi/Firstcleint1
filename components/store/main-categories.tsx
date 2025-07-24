"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { Category } from "@/types"

interface MainCategoriesProps {
  categories: Category[]
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
      <div className="main-categories-grid flex flex-row-reverse gap-3 overflow-x-auto pb-2">
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
            <button
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
              <span className="main-category-icon text-[28px] mb-2 block">
                {category.icon || (category.image_url && category.image_url.match(/^\p{Emoji}/u) ? category.image_url : '\ud83d\udce6')}
              </span>
              <span className="main-category-name font-bold text-base text-gray-900 mb-1 block" style={{ fontFamily: 'Noto Sans Arabic, system-ui, -apple-system, sans-serif' }}>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
