"use client"

import { useBanners } from "@/hooks/use-banners"

export function DynamicBanner() {
  const { banners, loading } = useBanners()

  if (loading) {
    return (
      <div className="p-5 bg-white border-b border-gray-100">
        <div className="bg-gray-200 rounded-xl p-5 animate-pulse h-24"></div>
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="p-5 bg-white border-b border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="flex-1 relative z-10">
            <h2 className="text-white text-lg font-bold mb-1">مرحباً بكم</h2>
            <p className="text-white/90 text-sm">في متجرنا الإلكتروني</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 bg-white border-b border-gray-100">
      <div className="space-y-4">
        {banners.slice(0, 1).map((banner) => (
          <div
            key={banner.id}
            className={`${banner.background_color} ${banner.text_color} rounded-xl p-5 flex items-center justify-between relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

            {banner.image_url && (
              <img
                src={banner.image_url || "/placeholder.svg"}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
            )}

            <div className="flex-1 relative z-10">
              <h2 className="text-lg font-bold mb-1">{banner.title}</h2>
              {banner.subtitle && <p className="opacity-90 text-sm mb-1">{banner.subtitle}</p>}
              {banner.description && <p className="opacity-80 text-xs">{banner.description}</p>}
            </div>

            {banner.button_text && (
              <div className="relative z-10">
                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors">
                  {banner.button_text}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
