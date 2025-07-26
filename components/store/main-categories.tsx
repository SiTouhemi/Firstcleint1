"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
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
  const { toast } = useToast();
  const [showNotification, setShowNotification] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="main-categories-section" style={{ direction: 'rtl' }}>
      {/* Fast Notification */}
      {showNotification && (
        <div 
          className={`fixed top-4 right-4 z-50 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 ${
            isExiting 
              ? 'translate-x-full opacity-0' 
              : 'translate-x-0 opacity-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold" style={{ fontFamily: 'Noto Sans Arabic, system-ui, -apple-system, sans-serif' }}>عرض منتجات {selectedCategoryName}</span>
          </div>
        </div>
      )}
      
      <h3 className="main-categories-title text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Noto Sans Arabic, sans-serif', textAlign: 'right' }}>الفئات الرئيسية</h3>
      <div className="main-categories-grid flex flex-row gap-4 overflow-x-auto pb-4 px-4 py-2">
        {categories.map((category, idx) => {
          const gradients = [
            'linear-gradient(135deg, #D0E9FC 0%, #A8D8F0 100%)', // light baby blue
            'linear-gradient(135deg, #EFD6F9 0%, #D4B5F0 100%)', // light lavender
            'linear-gradient(135deg, #FCE6B1 0%, #F9D976 100%)', // light yellow-orange
            'linear-gradient(135deg, #F0E6FF 0%, #E0D0FF 100%)', // soft purple
            'linear-gradient(135deg, #FFE6F0 0%, #FFD0E0 100%)', // soft pink
            'linear-gradient(135deg, #E6F9F0 0%, #D0F0E0 100%)', // soft mint
          ];
          const background = category.background || gradients[idx % gradients.length];
          return (
            <div
              key={category.id}
              onClick={() => {
                onCategorySelect(category.id);
                setSelectedCategoryName(category.name);
                setIsExiting(false);
                setShowNotification(true);
                setTimeout(() => {
                  setIsExiting(true);
                  setTimeout(() => setShowNotification(false), 300);
                }, 2000);
              }}
              style={{
                width: 'calc(20vh - 13px)',
                height: 'calc(20vh + 15px)',
                borderColor: 'rgb(25, 118, 210)',
                background,
                opacity: 1.0,
                fontFamily: 'Noto Sans Arabic, system-ui, -apple-system, sans-serif',
                color: '#000000',
                fontWeight: '600',
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
                transition: 'all 0.3s ease-in-out',
              }}
              className="main-category-card hover:shadow-xl hover:shadow-blue-500/25 min-w-[120px] flex-shrink-0 transform-gpu will-change-transform"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)';
                e.currentTarget.style.zIndex = '10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.zIndex = 'auto';
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="text-3xl mb-2">{category.icon}</span>
                                        <span className="font-bold text-base text-black mb-1 block" style={{ fontFamily: 'Noto Sans Arabic, system-ui, -apple-system, sans-serif', fontWeight: '700', textRendering: 'optimizeLegibility' }}>{category.name}</span>
                        <span className="text-xs text-black mt-1 font-medium" style={{ textRendering: 'optimizeLegibility' }}>+{category.productCount} منتج</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
