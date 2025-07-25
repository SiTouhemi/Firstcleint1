"use client"

import { useState, useEffect } from "react"
import type { Banner } from "@/types"

interface BannerComponentProps {
  banners: Banner[]
}

export function BannerComponent({ banners }: BannerComponentProps) {
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [banners.length])

  if (banners.length === 0) {
    return (
      <div className="bg-blue-600 text-white rounded-2xl shadow-lg p-5 mx-4 mt-4 flex items-center justify-between gap-4" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
        <div>
          <h2 className="text-2xl font-bold mb-1">عروض خاصة</h2>
          <p className="text-base text-blue-100">خصم يصل إلى 50% على جميع المنتجات</p>
        </div>
        <div className="flex items-center justify-center">
          <span className="bg-yellow-400 text-blue-900 font-bold text-lg rounded-full w-16 h-16 flex items-center justify-center shadow-md">50%</span>
        </div>
      </div>
    )
  }

  const banner = banners[currentBanner]

  return (
    <div className="relative mx-4 mt-4">
      <div
        className="bg-blue-600 text-white rounded-2xl shadow-lg p-5 flex items-center justify-between gap-4 min-h-[90px]"
        style={{
          fontFamily: 'Noto Sans Arabic, sans-serif',
          backgroundImage: banner.image_url ? `url(${banner.image_url})` : undefined,
          backgroundSize: banner.image_url ? 'cover' : undefined,
          backgroundPosition: banner.image_url ? 'center' : undefined,
        }}
      >
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">{banner.title}</h2>
          {banner.description && <p className="text-base text-blue-100">{banner.description}</p>}
        </div>
        {/* No badge for dynamic banners since no badge/discount field exists */}
        {banner.image_url && <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl" />}
      </div>
      {banners.length > 1 && (
        <div className="flex justify-center mt-2 gap-1">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentBanner ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
