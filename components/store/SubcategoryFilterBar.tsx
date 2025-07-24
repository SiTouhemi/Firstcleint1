import React from "react";

interface Subcategory {
  id: string;
  name: string;
}

interface SubcategoryFilterBarProps {
  subcategories: Subcategory[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function SubcategoryFilterBar({ subcategories, selectedId, onSelect }: SubcategoryFilterBarProps) {
  return (
    <div className="flex flex-row-reverse justify-end gap-2 pb-2 overflow-x-auto" style={{ fontFamily: "'Noto Sans Arabic', system-ui, -apple-system, sans-serif" }}>
      {subcategories.map((sub) => (
        <button
          key={sub.id}
          onClick={() => onSelect(sub.id)}
          className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors whitespace-nowrap
            ${selectedId === sub.id ? 'bg-[#007bff] text-white' : 'bg-[#e9ecef] text-[#666]'}
          `}
          style={{ border: 'none', fontFamily: "'Noto Sans Arabic', system-ui, -apple-system, sans-serif" }}
        >
          {sub.name}
        </button>
      ))}
      {/* 'All' button always last in DOM, so visually first in RTL */}
      <button
        onClick={() => onSelect("")}
        className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors whitespace-nowrap
          ${selectedId === '' ? 'bg-[#007bff] text-white' : 'bg-[#e9ecef] text-[#666]'}
        `}
        style={{ border: 'none', fontFamily: "'Noto Sans Arabic', system-ui, -apple-system, sans-serif" }}
      >
        الكل
      </button>
    </div>
  );
} 