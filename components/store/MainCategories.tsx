import React from "react";

interface MainCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  count: number;
}

interface MainCategoriesProps {
  categories: MainCategory[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function MainCategories({ categories, selectedId, onSelect }: MainCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start py-2" dir="rtl">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`rounded-xl border ${cat.color} p-4 w-32 flex flex-col items-center shadow-sm transition-all duration-150
            ${selectedId === cat.id ? 'ring-2 ring-blue-400 scale-105' : ''}
          `}
        >
          <span className="text-3xl mb-2">{cat.emoji}</span>
          <span className="font-bold text-base">{cat.name}</span>
          <span className="text-xs text-gray-600 mt-1">+{cat.count} منتج</span>
        </button>
      ))}
    </div>
  );
} 