import React from "react";

interface Product {
  id: string;
  name: string;
  image: string;
  isFavorite?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onToggleFavorite: (id: string) => void;
}

export default function ProductGrid({ products, onToggleFavorite }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-2">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-xl shadow-sm p-2 flex flex-col relative">
          <button
            className={`absolute top-2 left-2 z-10 p-1 rounded-full ${product.isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'}`}
            onClick={() => onToggleFavorite(product.id)}
            aria-label="تفضيل المنتج"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={product.isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.41 1.01-4.5 2.623C10.91 4.76 9.24 3.75 7.5 3.75 5.015 3.75 3 5.765 3 8.25c0 5.25 9 12 9 12s9-6.75 9-12z" />
            </svg>
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-28 sm:h-32 object-cover rounded-lg mb-2"
          />
          <div className="text-right font-medium text-sm sm:text-base px-1 truncate">{product.name}</div>
        </div>
      ))}
    </div>
  );
} 