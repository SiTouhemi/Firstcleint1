import React from "react";

export default function SpecialOfferBanner() {
  return (
    <div className="flex items-center rounded-2xl bg-[#0686e4] p-4 min-h-[90px] w-full max-w-md mx-auto shadow-md">
      {/* Yellow Circle with Percentage */}
      <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 mr-4">
        <span className="text-2xl font-bold text-black">50%</span>
      </div>
      {/* Text Content */}
      <div className="flex flex-col text-right w-full">
        <span className="text-white font-bold text-lg" style={{lineHeight: 1.5}}>عروض خاصة</span>
        <span className="text-white text-sm mt-1" style={{lineHeight: 1.5}}>
          على جميع المنتجات المختارة لفترة محدودة
        </span>
      </div>
    </div>
  );
} 